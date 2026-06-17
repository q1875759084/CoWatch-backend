import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/response.js';

/**
 * 视频上传防护中间件
 *
 * 挂载在 POST /api/rooms/:roomId/upload-proxy 接口上（所有用户统一走后端中转）。
 * 执行以下两层校验：
 *
 * 1. Sec-Fetch 请求头校验
 *    浏览器会自动注入 Sec-Fetch-Site / Sec-Fetch-Mode，且 JS 无法手动设置（浏览器过滤）。
 *    脚本工具（curl/axios）默认不带这些头，校验可增加伪造成本。
 *    注意：Postman / Python requests 等工具可手动添加，无法防住有经验的攻击者，
 *    定位是"增加尝试成本"而非"完全防御"。
 *
 * 2. 每日房间上传总字节数限制
 *    每个房间每日中转上传的总字节数不得超过 DAILY_BYTES_LIMIT（15 GB）。
 *    此处仅校验"当日已用量 + 本次 Content-Length 是否超限"。
 *    实际字节计数在 proxyUpload handler 中真实写入完成后更新，防止恶意多请求占用配额。
 *    计数器存内存 Map，服务重启自动清零，日期变更自动重置。
 */

/** 每个房间每日中转上传总字节上限：15 GB */
const DAILY_BYTES_LIMIT = 15 * 1024 * 1024 * 1024;

interface DailyRecord {
  date: string;  // YYYY-MM-DD
  bytes: number; // 当日已中转上传的总字节数
}

/** 内存计数器：roomId → 当日字节使用记录 */
const uploadBytesCounter = new Map<string, DailyRecord>();

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * 查询房间当日已用字节数（过期则清零）
 */
export function getDailyUsedBytes(roomId: string): number {
  const today = getTodayDate();
  const record = uploadBytesCounter.get(roomId);
  if (!record || record.date !== today) return 0;
  return record.bytes;
}

/**
 * 在文件真实写入/中转完成后，将本次上传字节数计入房间当日用量
 */
export function addDailyBytes(roomId: string, bytes: number): void {
  const today = getTodayDate();
  const record = uploadBytesCounter.get(roomId);
  if (!record || record.date !== today) {
    uploadBytesCounter.set(roomId, { date: today, bytes });
  } else {
    record.bytes += bytes;
  }
}

export function uploadGuard(req: Request, res: Response, next: NextFunction): void {
  const roomId = req.params.roomId;

  // ── 校验一：Sec-Fetch 请求头 ──────────────────────────────────────────────
  const secFetchSite = req.headers['sec-fetch-site'];
  const secFetchMode = req.headers['sec-fetch-mode'];

  // 正常浏览器上传：sec-fetch-site 为 same-origin，sec-fetch-mode 为 cors
  // 若两个头都不存在，大概率是脚本请求，拒绝
  const hasBrowserHeaders = secFetchSite !== undefined || secFetchMode !== undefined;
  if (!hasBrowserHeaders) {
    fail(res, 403, '请求来源异常，仅支持通过网页上传');
    return;
  }

  // ── 校验二：房间每日总字节数预检 ──────────────────────────────────────────
  // 用 Content-Length 做提前判断（可被伪造，但恶意场景本就是攻击者，增加门槛即可）
  // 真实计费在 proxyUpload 完成后执行，此处仅做"当日余量是否足以容纳本次声明大小"的快速拦截
  const contentLength = parseInt(req.headers['content-length'] ?? '0', 10);
  const usedBytes = getDailyUsedBytes(roomId);
  if (usedBytes + contentLength > DAILY_BYTES_LIMIT) {
    const usedGB = (usedBytes / 1024 / 1024 / 1024).toFixed(2);
    const limitGB = (DAILY_BYTES_LIMIT / 1024 / 1024 / 1024).toFixed(0);
    fail(
      res,
      429,
      `该房间今日上传流量已达上限（${limitGB} GB），当日已用 ${usedGB} GB，请明日再试。`,
    );
    return;
  }

  next();
}
