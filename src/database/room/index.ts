import { db } from '../index.js';

export interface RoomRow {
  id: string;
  video_url: string | null;
  control_mode: 'designated' | 'free';
  controller_id: string | null;
  created_at: number;
  updated_at: number;
}

export function createRoom(id: string): RoomRow {
  const now = Date.now();
  db.prepare(`
    INSERT INTO rooms (id, video_url, control_mode, controller_id, created_at, updated_at)
    VALUES (?, NULL, 'designated', NULL, ?, ?)
  `).run(id, now, now);
  return getRoomById(id)!;
}

export function getRoomById(id: string): RoomRow | null {
  return (db.prepare('SELECT * FROM rooms WHERE id = ?').get(id) as RoomRow) ?? null;
}

export function setVideoUrl(roomId: string, videoUrl: string): void {
  db.prepare('UPDATE rooms SET video_url = ?, updated_at = ? WHERE id = ?')
    .run(videoUrl, Date.now(), roomId);
}

export function setControlMode(roomId: string, mode: 'designated' | 'free'): void {
  db.prepare('UPDATE rooms SET control_mode = ?, updated_at = ? WHERE id = ?')
    .run(mode, Date.now(), roomId);
}

export function setControllerId(roomId: string, userId: string | null): void {
  db.prepare('UPDATE rooms SET controller_id = ?, updated_at = ? WHERE id = ?')
    .run(userId, Date.now(), roomId);
}
