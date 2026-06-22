import { Request, Response, NextFunction } from 'express';
import { getRoomMember } from '../database/roomMember/index.js';

/**
 * 扩展 Express Request 类型，挂载房间角色信息
 * （userId 由 authMiddleware 注入，此处仅扩展 isAdmin）
 */
declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}

/**
 * 房间成员鉴权中间件
 *
 * 前置依赖：authMiddleware（已将 userId 挂载到 req.userId）
 * 校验通过后将 isAdmin 挂载到 req，供 controller 使用。
 */
export function roomAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const roomId = req.params.roomId;
  const userId = req.userId;

  if (!roomId || !userId) {
    res.status(400).json({ code: 400, message: '缺少 roomId 或用户身份', data: null });
    return;
  }

  getRoomMember(userId, roomId)
    .then((member) => {
      if (!member) {
        res.status(403).json({ code: 403, message: '无权限访问该房间', data: null });
        return;
      }
      req.isAdmin = member.is_admin === 1;
      next();
    })
    .catch((err) => {
      console.error('[roomAuthMiddleware]', err);
      res.status(500).json({ code: 500, message: '鉴权失败', data: null });
    });
}
