import { Request, Response } from 'express';
import { db } from '../../database/index.js';
import { success } from '../../utils/response.js';

interface RoomWithStats {
  id: string;
  name: string;
  video_url: string | null;
  created_at: number;
  updated_at: number;
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
   * 获取全部房间列表（含成员数 + 当月/7天/今日流量统计）
   *
   * 流量来源：segment_views 表（由 SW 缓存未命中时上报）
   * 时间边界均为本地时间零点/月初，字节数为 SUM(bytes)。
   */
  list(_req: Request, res: Response): void {
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

    const rows = db.prepare(`
      SELECT
        r.id,
        r.name,
        r.video_url,
        r.created_at,
        r.updated_at,
        COUNT(DISTINCT rm.user_id) AS member_count,
        COALESCE(SUM(CASE WHEN sv.created_at >= :monthStart THEN sv.bytes ELSE 0 END), 0) AS traffic_month,
        COALESCE(SUM(CASE WHEN sv.created_at >= :day7Start  THEN sv.bytes ELSE 0 END), 0) AS traffic_7d,
        COALESCE(SUM(CASE WHEN sv.created_at >= :todayStart THEN sv.bytes ELSE 0 END), 0) AS traffic_today
      FROM rooms r
      LEFT JOIN room_members  rm ON rm.room_id = r.id
      LEFT JOIN segment_views sv ON sv.room_id  = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `).all({ monthStart, day7Start, todayStart }) as RoomWithStats[];

    success(res, { rooms: rows });
  },
};
