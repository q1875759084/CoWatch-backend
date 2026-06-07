import { db } from '../index.js';

export interface RoomVideoRow {
  id: string;
  room_id: string;
  video_url: string;
  file_name: string;
  uploader_id: string;
  created_at: number;
}

/**
 * 新增一条视频记录
 */
export function addRoomVideo(
  id: string,
  roomId: string,
  videoUrl: string,
  fileName: string,
  uploaderId: string,
): RoomVideoRow {
  const now = Date.now();
  db.prepare(`
    INSERT INTO room_videos (id, room_id, video_url, file_name, uploader_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, roomId, videoUrl, fileName, uploaderId, now);
  return getRoomVideoById(id)!;
}

/**
 * 按主键查询
 */
export function getRoomVideoById(id: string): RoomVideoRow | null {
  return (db.prepare('SELECT * FROM room_videos WHERE id = ?').get(id) as RoomVideoRow) ?? null;
}

/**
 * 获取房间内所有视频（按上传时间升序）
 */
export function getVideosByRoom(roomId: string): RoomVideoRow[] {
  return db.prepare(`
    SELECT * FROM room_videos WHERE room_id = ? ORDER BY created_at ASC
  `).all(roomId) as RoomVideoRow[];
}
