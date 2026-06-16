import { db } from '../index.js';

export interface RoomMemberRow {
  user_id: string;
  room_id: string;
  is_admin: 0 | 1;
  // is_online 已废弃：在线状态改由进程内 roomClients Map 维护，不再写 DB
  joined_at: number;
}

/**
 * 加入房间（幂等：已存在则更新 joined_at）
 */
export function joinRoom(userId: string, roomId: string, isAdmin: boolean): RoomMemberRow {
  const now = Date.now();
  db.prepare(`
    INSERT INTO room_members (user_id, room_id, is_admin, joined_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, room_id) DO UPDATE SET joined_at = excluded.joined_at
  `).run(userId, roomId, isAdmin ? 1 : 0, now);
  return getRoomMember(userId, roomId)!;
}

/**
 * 获取用户在某个房间的记录
 */
export function getRoomMember(userId: string, roomId: string): RoomMemberRow | null {
  return (
    db.prepare('SELECT * FROM room_members WHERE user_id = ? AND room_id = ?')
      .get(userId, roomId) as RoomMemberRow
  ) ?? null;
}

/**
 * 获取房间内所有成员（含用户昵称，JOIN users 表）
 */
export interface RoomMemberWithNickname extends RoomMemberRow {
  nickname: string;
  avatar_url: string | null;
}

export function getMembersByRoom(roomId: string): RoomMemberWithNickname[] {
  return db.prepare(`
    SELECT rm.*, u.nickname, u.avatar_url
    FROM room_members rm
    JOIN users u ON u.id = rm.user_id
    WHERE rm.room_id = ?
    ORDER BY rm.joined_at ASC
  `).all(roomId) as RoomMemberWithNickname[];
}

/**
 * 获取房间管理员
 */
export function getAdminByRoom(roomId: string): RoomMemberWithNickname | null {
  return (
    db.prepare(`
      SELECT rm.*, u.nickname, u.avatar_url
      FROM room_members rm
      JOIN users u ON u.id = rm.user_id
      WHERE rm.room_id = ? AND rm.is_admin = 1
    `).get(roomId) as RoomMemberWithNickname
  ) ?? null;
}

/**
 * 获取某用户参与的所有房间（含房间基本信息）
 */
export interface UserRoomRow {
  room_id: string;
  room_name: string;
  video_url: string | null;
  is_admin: 0 | 1;
  joined_at: number;
}

export function getRoomsByUser(userId: string): UserRoomRow[] {
  return db.prepare(`
    SELECT rm.room_id, r.name AS room_name, r.video_url, rm.is_admin, rm.joined_at
    FROM room_members rm
    JOIN rooms r ON r.id = rm.room_id
    WHERE rm.user_id = ?
    ORDER BY rm.joined_at DESC
  `).all(userId) as UserRoomRow[];
}
