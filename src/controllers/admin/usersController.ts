import { Request, Response } from 'express';
import { getAllUsers, getUserById, banUser, deleteUser } from '../../database/user/index.js';
import { getActivePlans, addSubscription } from '../../database/subscription/index.js';
import { success, fail } from '../../utils/response.js';

export const AdminUsersController = {
  /**
   * GET /api/admin/cowatch/users
   * 获取全部用户列表（含封号状态、当前 plans）
   */
  async list(_req: Request, res: Response): Promise<void> {
    const rows = await getAllUsers();
    const users = await Promise.all(rows.map(async (u) => ({
      userId: u.id,
      username: u.username,
      nickname: u.nickname,
      avatarUrl: u.avatar_url,
      isBanned: u.is_banned === 1,
      plans: await getActivePlans(u.id),
      createdAt: u.created_at,
    })));
    success(res, { users });
  },

  /**
   * POST /api/admin/cowatch/users/:userId/ban
   * 封号 / 解封，Body: { banned: boolean }
   */
  async setBan(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { banned } = req.body as { banned?: boolean };
    if (typeof banned !== 'boolean') {
      fail(res, 400, 'banned 字段必须为 boolean');
      return;
    }
    const user = await getUserById(userId);
    if (!user) {
      fail(res, 404, '用户不存在');
      return;
    }
    await banUser(userId, banned);
    success(res, null, banned ? '封号成功' : '解封成功');
  },

  /**
   * POST /api/admin/cowatch/users/:userId/plans
   * 手动赋予订阅权益，Body: { plan: string, expiresAt?: number }
   */
  async grantPlan(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { plan, expiresAt } = req.body as { plan?: string; expiresAt?: number };
    if (!plan) {
      fail(res, 400, 'plan 字段不能为空');
      return;
    }
    const user = await getUserById(userId);
    if (!user) {
      fail(res, 404, '用户不存在');
      return;
    }
    await addSubscription(userId, plan, expiresAt);
    success(res, null, `权益 ${plan} 已赋予`);
  },

  /**
   * DELETE /api/admin/cowatch/users/:userId
   * 删除用户（不可逆）
   */
  async remove(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const user = await getUserById(userId);
    if (!user) {
      fail(res, 404, '用户不存在');
      return;
    }
    await deleteUser(userId);
    success(res, null, '用户已删除');
  },
};
