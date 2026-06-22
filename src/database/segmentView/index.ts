import { v4 as uuidv4 } from 'uuid';
import { db } from '../index.js';

export interface SegmentViewRow {
  id: string;
  room_id: string;
  video_id: string;
  segment_name: string;
  user_id: string;
  bytes: number;
  created_at: number;
}

// ─── 删除 ──────────────────────────────────────────────────────────────────────

/**
 * 删除指定视频的所有流量记录。
 *
 * ⚠️ 不应在视频删除流程中调用此函数。
 * segment_views 是纯流量日志表，video_id 只是分组 key，视频删除后
 * 历史流量记录应继续保留，以支持 dashboard 的流量统计回溯。
 * （segment_views 表已不含外键约束，视频删除不会触发级联问题）
 *
 * 仅用于数据清理、GDPR 删除等特殊场景。
 */
export function deleteSegmentViewsByVideo(videoId: string): void {
  db.prepare('DELETE FROM segment_views WHERE video_id = ?').run(videoId);
}

// ─── 写入 ──────────────────────────────────────────────────────────────────────

/**
 * 记录一次 HLS 片段的真实 CDN 下载（缓存未命中）。
 *
 * 每次调用对应一次真实的 CDN 下行流量，不去重。
 * 多个用户各自下载同一片段，会产生多条记录（成本按实际请求次数计算）。
 *
 * @param roomId       房间 ID
 * @param videoId      视频 ID（room_videos.id）
 * @param segmentName  片段文件名，如 seg000.ts
 * @param userId       发起请求的用户 ID（'anonymous' 表示未登录）
 * @param bytes        本次下载的字节数（0 表示未知）
 */
export function insertSegmentView(
  roomId: string,
  videoId: string,
  segmentName: string,
  userId: string,
  bytes: number,
): void {
  db.prepare(`
    INSERT INTO segment_views (id, room_id, video_id, segment_name, user_id, bytes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), roomId, videoId, segmentName, userId, bytes, Date.now());
}

export interface SegmentViewInput {
  roomId: string;
  videoId: string;
  segmentName: string;
  userId: string;
  bytes: number;
}

/**
 * 批量写入多条 HLS 片段下载记录（单事务，减少 SQLite 写锁竞争）。
 *
 * 使用 better-sqlite3 的 transaction 将多条 INSERT 包在同一个事务内，
 * 相比逐条 INSERT 可减少约 80% 的写锁获取次数。
 *
 * @param items  待写入的片段记录列表（最多 50 条，由调用方限制）
 */
export function insertSegmentViewBatch(items: SegmentViewInput[]): void {
  if (items.length === 0) return;
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO segment_views (id, room_id, video_id, segment_name, user_id, bytes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const runBatch = db.transaction((rows: SegmentViewInput[]) => {
    for (const row of rows) {
      stmt.run(uuidv4(), row.roomId, row.videoId, row.segmentName, row.userId, row.bytes, now);
    }
  });
  runBatch(items);
}

// ─── 查询 ──────────────────────────────────────────────────────────────────────

export interface RoomTrafficStat {
  room_id: string;
  total_bytes: number;
  request_count: number;
}

export interface VideoTrafficStat {
  video_id: string;
  total_bytes: number;
  request_count: number;
}

export interface UserTrafficStat {
  user_id: string;
  total_bytes: number;
  request_count: number;
}

/**
 * 按时间范围统计各房间的流量总量
 */
export function getRoomTrafficStats(
  startAt: number,
  endAt: number,
): RoomTrafficStat[] {
  return db.prepare(`
    SELECT
      room_id,
      SUM(bytes)  AS total_bytes,
      COUNT(*)    AS request_count
    FROM segment_views
    WHERE created_at >= ? AND created_at < ?
    GROUP BY room_id
    ORDER BY total_bytes DESC
  `).all(startAt, endAt) as RoomTrafficStat[];
}

/**
 * 查询某房间内各视频的流量统计
 */
export function getVideoTrafficStats(
  roomId: string,
  startAt: number,
  endAt: number,
): VideoTrafficStat[] {
  return db.prepare(`
    SELECT
      video_id,
      SUM(bytes)  AS total_bytes,
      COUNT(*)    AS request_count
    FROM segment_views
    WHERE room_id = ? AND created_at >= ? AND created_at < ?
    GROUP BY video_id
    ORDER BY total_bytes DESC
  `).all(roomId, startAt, endAt) as VideoTrafficStat[];
}

/**
 * 查询某房间内各用户的流量统计
 */
export function getUserTrafficStats(
  roomId: string,
  startAt: number,
  endAt: number,
): UserTrafficStat[] {
  return db.prepare(`
    SELECT
      user_id,
      SUM(bytes)  AS total_bytes,
      COUNT(*)    AS request_count
    FROM segment_views
    WHERE room_id = ? AND created_at >= ? AND created_at < ?
    GROUP BY user_id
    ORDER BY total_bytes DESC
  `).all(roomId, startAt, endAt) as UserTrafficStat[];
}

/**
 * 全局流量汇总（用于大盘概览）
 */
export function getTotalTrafficStats(
  startAt: number,
  endAt: number,
): { total_bytes: number; request_count: number } {
  return db.prepare(`
    SELECT
      COALESCE(SUM(bytes), 0) AS total_bytes,
      COUNT(*)                AS request_count
    FROM segment_views
    WHERE created_at >= ? AND created_at < ?
  `).get(startAt, endAt) as { total_bytes: number; request_count: number };
}
