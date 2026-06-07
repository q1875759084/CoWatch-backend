import 'dotenv/config';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { initSchema } from './database/schema.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initWsServer } from './ws/wsServer.js';

// ─── 数据库初始化（启动时执行，幂等）────────────────────────────────────────
initSchema();

const app = express();
const port = Number(process.env.PORT) || 3002;

// CORS 白名单（多域名逗号分隔）
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3001'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(cookieParser());
app.use(express.json());

// 本地开发模式：将 uploads 目录作为静态文件服务（OSS 模式下此目录不会被写入）
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsDir));

// 注册所有路由，统一前缀 /api
app.use('/api', routes);

// 兜底
app.get('/', (_req: Request, res: Response) => {
  res.send(new Date().toISOString());
});

// ─── 全局错误处理（必须在所有路由之后注册）────────────────────────────────────
app.use(errorHandler);

// ─── HTTP Server + WebSocket Server ────────────────────────────────────────
const server = http.createServer(app);
initWsServer(server);

server.listen(port, () => {
  console.log(`✅ CoWatch backend running at http://localhost:${port}`);
  console.log(`✅ WebSocket available at ws://localhost:${port}/socket`);
});
