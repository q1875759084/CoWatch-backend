import { Request, Response } from 'express';
import sql from '../../database/index.js';
import { getRoomById, setRoomPlanLevel, type RoomPlanLevel } from '../../database/room/index.js';
import { addRoomSubscription } from '../../database/roomSubscription/index.js';
import { success, fail } from '../../utils/response.js';

const VALID_PLAN_LEVELS: RoomPlanLevel[] = ['free', 'vip:basic', 'vip:pro'];

interface RoomWithStats {
  id: string;
  name: string;
  video_url: string | null;
  created_at: number;
  updated_at: number;
  plan_level: RoomPlanLevel;
  owner_id: string | null;
  member_count: number;
  /** 当月流量（字节） */
  traffic_month: number;
  /** 近 7 天流量（字节） */
  traffic_7d: number;
  /** 今日流量（字节） */
  traffic_today: number;
}

export const AdminRoomsController = {
  /**
   * GET /api/admin/cowatch/rooms
   * 获取全部房间列表（含成员数 + 当月/7天/今日流量统计 + plan_level）
   */
  async list(_req: Request, res: Response): Promise<void> {
    const now = Date.now();

    // 今日零点（本地时间）
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    // 近 7 天
    const day7Start = now - 7 * 24 * 60 * 60 * 1000;
    // 本月 1 日零点（本地时间）
    const monthStart = (() => {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })();

    const rows = await sql<RoomWithStats[]>`
      SELECT
        r.id,
        r.name,
        r.video_url,
        r.created_at,
        r.updated_at,
        r.plan_level,
        r.owner_id,
        COUNT(DISTINCT rm.user_id)::int AS member_count,
        COALESCE(SUM(CASE WHEN sv.created_at >= ${monthStart} THEN sv.bytes ELSE 0 END), 0)::bigint AS traffic_month,
        COALESCE(SUM(CASE WHEN sv.created_at >= ${day7Start}  THEN sv.bytes ELSE 0 END), 0)::bigint AS traffic_7d,
        COALESCE(SUM(CASE WHEN sv.created_at >= ${todayStart} THEN sv.bytes ELSE 0 END), 0)::bigint AS traffic_today
      FROM rooms r
      LEFT JOIN room_members  rm ON rm.room_id = r.id
      LEFT JOIN segment_views sv ON sv.room_id  = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `;

    success(res, { rooms: rows });
  },

  /**
   * POST /api/admin/cowatch/rooms/:roomId/plan-level
   * 手动设置房间等级，Body: { planLevel: 'free' | 'vip:basic' | 'vip:pro' }
   */
  async setPlanLevel(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const { planLevel } = req.body as { planLevel?: RoomPlanLevel };

    if (!planLevel || !VALID_PLAN_LEVELS.includes(planLevel)) {
      fail(res, 400, `planLevel 必须为 ${VALID_PLAN_LEVELS.join(' | ')}`);
      return;
    }

    const room = await getRoomById(roomId);
    if (!room) {
      fail(res, 404, '房间不存在');
      return;
    }

    // 更新房间等级
    await setRoomPlanLevel(roomId, planLevel);

    // 写入房间订阅记录（admin 手动授权，永久有效）
    if (planLevel !== 'free') {
      await addRoomSubscription(roomId, planLevel, 'admin_grant', req.adminId);
    }

    success(res, null, `房间等级已更新为 ${planLevel}`);
  },
};
