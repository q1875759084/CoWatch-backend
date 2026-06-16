import { db } from '../index.js';

export interface TagRow {
  id: string;
  room_id: string;
  video_id: string;
  time: number;
  label: string;
  created_by: string;
  created_at: number;
}

/**
 * 新增一条 Tag
 */
export function addTag(
  id: string,
  roomId: string,
  videoId: string,
  time: number,
  label: string,
  createdBy: string,
): TagRow {
  const now = Date.now();
  db.prepare(`
    INSERT INTO tags (id, room_id, video_id, time, label, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, roomId, videoId, time, label, createdBy, now);
  return getTagById(id)!;
}

/**
 * 按主键查询
 */
export function getTagById(id: string): TagRow | null {
  return (db.prepare('SELECT * FROM tags WHERE id = ?').get(id) as TagRow) ?? null;
}

/**
 * 删除一条 Tag
 */
export function deleteTag(id: string): void {
  db.prepare('DELETE FROM tags WHERE id = ?').run(id);
}

/**
 * 获取房间内某视频的所有 Tag（按时间升序）
 */
export function getTagsByRoomVideo(roomId: string, videoId: string): TagRow[] {
  return db.prepare(`
    SELECT * FROM tags WHERE room_id = ? AND video_id = ? ORDER BY time ASC
  `).all(roomId, videoId) as TagRow[];
}

/**
 * 批量删除某视频的所有 Tag（删除视频时级联调用）
 */
export function deleteTagsByVideo(videoId: string): void {
  db.prepare('DELETE FROM tags WHERE video_id = ?').run(videoId);
}
