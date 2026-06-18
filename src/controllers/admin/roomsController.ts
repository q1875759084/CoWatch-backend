import { Request, Response } from 'express';
import { db } from '../../database/index.js';
import { success } from '../../utils/response.js';

interface RoomWithMemberCount {
  id: string;
  name: string;
  video_url: string | null;
  created_at: number;
  updated_at: number;
  member_count: number;
}

export const AdminRoomsController = {
  /**
   * GET /api/admin/cowatch/rooms
   * 获取全部房间列表（含成员数）
   */
  list(_req: Request, res: Response): void {
    const rows = db.prepare(`
      SELECT
        r.id, r.name, r.video_url, r.created_at, r.updated_at,
        COUNT(rm.user_id) AS member_count
      FROM rooms r
      LEFT JOIN room_members rm ON rm.room_id = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `).all() as RoomWithMemberCount[];

    success(res, { rooms: rows });
  },
};
