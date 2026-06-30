import 'dotenv/config';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import sql from './database/index.js';
import { runMigrations } from './database/migrate.js';
import { validateOnlineConfig } from './services/ossService.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initWsServer } from './ws/wsServer.js';
import { scheduleRoomDowngradeJob } from './jobs/roomDowngrade.js';
import { scheduleRecordingTimeoutJob } from './jobs/recordingTimeout.js';

// ─── 全局兜底：防止未捕获异常 / Promise rejection 导致进程崩溃 ────────────────
// 主要场景：ffmpeg 切片、WS send 等异步后台任务抛出未预期错误时，
// 不加此兜底会直接终止进程并断开所有 WS 连接（code=1006）。
process.on('uncaughtException', (err) => {
  console.error('[process] uncaughtException（已捕获，进程继续运行）:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[process] unhandledRejection（已捕获，进程继续运行）:', reason);
});

// ─── 配置校验（启动时执行）────────────────────────────────────────────────────
validateOnlineConfig();

const app = express();
const port = Number(process.env.PORT) || 3002;

// CORS 白名单（多域名逗号分隔）
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3001'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Object-Key'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));
app.use(cookieParser());
app.use(express.json());

// 本地模式：将 uploads 目录作为静态文件服务（线上模式下此目录不会被写入）
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir, {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.mp4') || filePath.endsWith('.ts')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  },
}));

// 注册所有路由，统一前缀 /api
app.use('/api', routes);

// 兜底
app.get('/', (_req: Request, res: Response) => {
  res.send(new Date().toISOString());
});

// ─── 全局错误处理（必须在所有路由之后注册）────────────────────────────────────
app.use(errorHandler);

// ─── 异步启动 ────────────────────────────────────────────────────────────────
async function start(): Promise<void> {
  // 数据库迁移（幂等，按序执行 migrations/*.sql）
  await runMigrations(sql);

  // 每日房间降级定时任务（凌晨 3:00）
  scheduleRoomDowngradeJob();

  // 录制超时自动收尾任务（每 3 分钟）
  // 覆盖场景：Electron 客户端崩溃/被强杀，finish 接口未被调用，已上传切片自动生成视频记录
  scheduleRecordingTimeoutJob();

  const server = http.createServer(app);
  initWsServer(server);

  server.listen(port, () => {
    console.log(`✅ CoWatch backend running at http://localhost:${port}`);
    console.log(`✅ WebSocket available at ws://localhost:${port}/socket`);
  });
}

start().catch((err) => {
  console.error('❌ 启动失败：', err);
  process.exit(1);
});
