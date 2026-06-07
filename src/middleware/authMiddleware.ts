import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

/**
 * 扩展 Express Request 类型，挂载登录用户 ID
 * （与 roomAuth.ts 共用同一个全局命名空间扩展）
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * JWT 鉴权中间件
 *
 * 从 Authorization: Bearer <token> 解析 userId，挂载到 req.userId。
 * 校验失败返回 401，不执行 next()。
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authStr = req.headers.authorization;
  if (!authStr || !authStr.startsWith('Bearer ')) {
    res.status(401).json({ code: 401, message: '未登录，请先登录', data: null });
    return;
  }

  const token = authStr.slice(7);
  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ code: 401, message: 'Token 无效或已过期，请重新登录', data: null });
  }
}
