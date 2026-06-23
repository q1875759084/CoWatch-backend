import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getRoomById } from '../database/room/index.js';
import { fail } from '../utils/response.js';

/**
 * 房间可用性守卫中间件
 *
 * 挂载在需要房间处于激活状态的接口上。
 * 若房间 plan_level 为 'free'（已过期/不可用），返回 403。
 *
 * 前置依赖：roomAuthMiddleware（已校验用户为房间成员）
 * 不挂载场景：GET /:roomId（getInfo）、POST /:roomId/join
 *   — 前端需要通过 getInfo 拿到 planLevel 才能显示过期提示页
 */
export function requireRoomActive(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { roomId } = req.params;
    if (!roomId) {
      fail(res, 400, '缺少 roomId 参数');
      return;
    }
    getRoomById(roomId)
      .then((room) => {
        if (!room) {
          fail(res, 404, '房间不存在');
          return;
        }
        if (room.plan_level === 'free') {
          fail(res, 403, '房间已过期，请购买会员或房间续费包');
          return;
        }
        next();
      })
      .catch((err) => {
        console.error('[requireRoomActive]', err);
        fail(res, 500, '房间状态校验失败');
      });
  };
}
