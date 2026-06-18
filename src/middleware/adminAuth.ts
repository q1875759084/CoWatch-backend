import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken } from '../utils/jwt.js';

/**
 * 扩展 Express Request 类型，挂载 Admin 信息
 */
declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      adminPermissions?: string[];
    }
  }
}

/**
 * Admin JWT 鉴权中间件
 *
 * 从 Authorization: Bearer <token> 解析 adminId / permissions，挂载到 req。
 * 校验失败返回 401。
 */
export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authStr = req.headers.authorization;
  if (!authStr?.startsWith('Bearer ')) {
    res.status(401).json({ code: 401, message: '未登录，请先登录', data: null });
    return;
  }

  const token = authStr.slice(7);
  try {
    const payload = verifyAdminToken(token);
    req.adminId = payload.adminId;
    req.adminPermissions = payload.permissions;
    next();
  } catch {
    res.status(401).json({ code: 401, message: 'Admin Token 无效或已过期', data: null });
  }
}

/**
 * 权限检查工厂函数
 *
 * 使用示例：router.get('/...', adminAuthMiddleware, requirePermission('admin'))
 */
export function requirePermission(perm: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const perms = req.adminPermissions ?? [];
    if (!perms.includes(perm) && !perms.includes('admin')) {
      res.status(403).json({ code: 403, message: '权限不足', data: null });
      return;
    }
    next();
  };
}
