import { v4 as uuidv4 } from 'uuid';
import sql from '../index.js';

export interface SegmentViewInput {
  roomId: string;
  videoId: string;
  segmentName: string;
  userId: string;
  bytes: number;
}

/**
 * 批量写入 HLS 片段观看记录（单事务）
 *
 * Service Worker 批量上报时使用，减少事务次数。
 */
export async function insertSegmentViewBatch(items: SegmentViewInput[]): Promise<void> {
  if (items.length === 0) return;
  const now = Date.now();
  const rows = items.map((item) => ({
    id: uuidv4(),
    room_id: item.roomId,
    video_id: item.videoId,
    segment_name: item.segmentName,
    user_id: item.userId,
    bytes: item.bytes,
    created_at: now,
  }));
  await sql`INSERT INTO segment_views ${sql(rows)}`;
}
