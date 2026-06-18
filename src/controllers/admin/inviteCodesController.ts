import { Request, Response } from 'express';
import { db } from '../../database/index.js';
import { success, fail } from '../../utils/response.js';
import type { InviteCodeRow } from '../../database/inviteCode/index.js';

export const AdminInviteCodesController = {
  /**
   * GET /api/admin/cowatch/invite-codes
   * 获取全部邀请码列表
   */
  list(_req: Request, res: Response): void {
    const rows = db.prepare(`
      SELECT code, used_count, max_count, grant_plan
      FROM invite_codes
      ORDER BY code ASC
    `).all() as InviteCodeRow[];
    success(res, { inviteCodes: rows });
  },

  /**
   * POST /api/admin/cowatch/invite-codes
   * 创建邀请码
   * Body: { code: string; maxCount: number; grantPlan?: string | null }
   */
  create(req: Request, res: Response): void {
    const { code, maxCount, grantPlan } = req.body as {
      code?: string;
      maxCount?: number;
      grantPlan?: string | null;
    };
    if (!code || !maxCount || maxCount <= 0) {
      fail(res, 400, 'code 和 maxCount（正整数）不能为空');
      return;
    }

    const existing = db.prepare('SELECT 1 FROM invite_codes WHERE code = ?').get(code);
    if (existing) {
      fail(res, 409, '邀请码已存在');
      return;
    }

    db.prepare(`
      INSERT INTO invite_codes (code, used_count, max_count, grant_plan)
      VALUES (?, 0, ?, ?)
    `).run(code, maxCount, grantPlan ?? null);

    success(res, null, '邀请码创建成功');
  },

  /**
   * DELETE /api/admin/cowatch/invite-codes/:code
   * 删除邀请码
   */
  remove(req: Request, res: Response): void {
    const { code } = req.params;
    const existing = db.prepare('SELECT 1 FROM invite_codes WHERE code = ?').get(code);
    if (!existing) {
      fail(res, 404, '邀请码不存在');
      return;
    }
    db.prepare('DELETE FROM invite_codes WHERE code = ?').run(code);
    success(res, null, '邀请码已删除');
  },
};
