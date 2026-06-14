import { Request, Response, NextFunction, RequestHandler } from 'express';
import { hasActivePlan } from '../database/subscription/index.js';

/**
 * 权益守卫中间件工厂
 *
 * 用法：在路由上注入 requirePlan('vip:basic')，校验当前登录用户是否持有该 plan。
 * 前置依赖：authMiddleware（已将 userId 挂载到 req.userId）
 *
 * 扩展示例：
 *   requirePlan('cursor:basic')  — 自定义鼠标上传权限
 *   requirePlan('broadcast')     — 广播权限
 */
export function requirePlan(plan: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ code: 401, message: '未登录，请先登录', data: null });
      return;
    }
    if (!hasActivePlan(userId, plan)) {
      res.status(403).json({
        code: 403,
        message: `该功能需要 ${plan} 权限，请升级会员`,
        data: null,
      });
      return;
    }
    next();
  };
}
