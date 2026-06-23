import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getActivePlans } from '../database/subscription/index.js';

/**
 * 会员等级层级定义（高等级自动包含低等级的所有权限）
 *
 * 层级越高，数字越大。
 * 校验逻辑：用户拥有 >= 所需等级的任意 plan，即视为通过。
 */
export const PLAN_HIERARCHY: Record<string, number> = {
  'vip:basic': 1,
  'vip:pro': 2,
};

/**
 * 判断用户拥有的 plans 是否满足所需 plan（含等级继承）
 *
 * 示例：
 *   hasRequiredPlan(['vip:pro'], 'vip:basic') → true  （pro 继承 basic）
 *   hasRequiredPlan(['vip:basic'], 'vip:pro') → false （basic 不包含 pro）
 *   hasRequiredPlan(['dev'], 'vip:basic')     → false （dev 不在层级中）
 */
function hasRequiredPlan(userPlans: string[], requiredPlan: string): boolean {
  const requiredLevel = PLAN_HIERARCHY[requiredPlan];

  // 若所需 plan 不在层级表中，则走精确匹配（保持向后兼容）
  if (requiredLevel === undefined) {
    return userPlans.includes(requiredPlan);
  }

  return userPlans.some((p) => {
    const level = PLAN_HIERARCHY[p];
    return level !== undefined && level >= requiredLevel;
  });
}

/**
 * 权益守卫中间件工厂
 *
 * 用法：在路由上注入 requirePlan('vip:basic')，校验当前登录用户是否持有该 plan。
 * 前置依赖：authMiddleware（已将 userId 挂载到 req.userId）
 *
 * 等级继承规则：vip:pro >= vip:basic，高等级自动满足低等级要求。
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
        if (!hasRequiredPlan(plans, plan)) {
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
