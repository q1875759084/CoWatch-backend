import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getActivePlans } from '../database/subscription/index.js';

/**
 * 权益守卫中间件工厂
 *
 * 用法：在路由上注入 requirePlan('vip:basic')，校验当前登录用户是否持有该 plan。
 * 前置依赖：authMiddleware（已将 userId 挂载到 req.userId）
 */
export function requirePlan(plan: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ code: 401, message: '未登录，请先登录', data: null });
      return;
    }
    getActivePlans(userId)
      .then((plans) => {
        if (!plans.includes(plan)) {
          res.status(403).json({
            code: 403,
            message: `该功能需要 ${plan} 权限，请升级会员`,
            data: null,
          });
          return;
        }
        next();
      })
      .catch((err) => {
        console.error('[requirePlan]', err);
        res.status(500).json({ code: 500, message: '权益校验失败', data: null });
      });
  };
}
