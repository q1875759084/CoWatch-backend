import { db } from '../index.js';

export interface RoomVideoRow {
  id: string;
  room_id: string;
  video_url: string;
  file_name: string;
  uploader_id: string;
  created_at: number;
  hls_prefix: string | null;
  hls_status: 'pending' | 'done' | 'error';
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
 * 通过 video_url 反查视频记录（用于关联 tags）
 */
export function getVideoByUrl(videoUrl: string): RoomVideoRow | null {
  return (db.prepare('SELECT * FROM room_videos WHERE video_url = ?').get(videoUrl) as RoomVideoRow) ?? null;
}

/**
 * 获取房间内所有视频（按上传时间升序）
 */
export function getVideosByRoom(roomId: string): RoomVideoRow[] {
  return db.prepare(`
    SELECT * FROM room_videos WHERE room_id = ? ORDER BY created_at ASC
  `).all(roomId) as RoomVideoRow[];
}

/**
 * 更新视频的 HLS 切片状态和前缀
 */
export function updateHlsStatus(
  videoId: string,
  hlsPrefix: string,
  status: 'pending' | 'done' | 'error',
): void {
  db.prepare(`
    UPDATE room_videos SET hls_prefix = ?, hls_status = ? WHERE id = ?
  `).run(hlsPrefix, status, videoId);
}

/**
 * 通过 objectKey（video_url 字段）反查视频 id（用于 wsServer SWITCH_VIDEO）
 */
export function getVideoIdByObjectKey(objectKey: string): string | null {
  const row = db.prepare('SELECT id FROM room_videos WHERE video_url = ? ORDER BY created_at DESC LIMIT 1').get(objectKey) as { id: string } | undefined;
  return row?.id ?? null;
}
