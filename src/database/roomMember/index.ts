import sql from '../index.js';

export interface RoomMemberRow {
  user_id: string;
  room_id: string;
  is_admin: number;
  joined_at: number;
}

export interface RoomMemberWithUser extends RoomMemberRow {
  nickname: string;
  avatar_url: string | null;
}

export interface RoomWithMembership {
  id: string;
  name: string;
  video_url: string | null;
  created_at: number;
  updated_at: number;
  is_admin: number;
}

/**
 * 加入房间（幂等，若已是成员则不做任何事）
 */
export async function joinRoom(userId: string, roomId: string, isAdmin: boolean): Promise<void> {
  await sql`
    INSERT INTO room_members (user_id, room_id, is_admin, joined_at)
    VALUES (${userId}, ${roomId}, ${isAdmin ? 1 : 0}, ${Date.now()})
    ON CONFLICT (user_id, room_id) DO NOTHING
  `;
}

/**
 * 获取房间内所有成员（含用户昵称和头像）
 */
export async function getMembersByRoom(roomId: string): Promise<RoomMemberWithUser[]> {
  const rows = await sql`
    SELECT rm.user_id, rm.room_id, rm.is_admin, rm.joined_at,
           u.nickname, u.avatar_url
    FROM room_members rm
    JOIN users u ON u.id = rm.user_id
    WHERE rm.room_id = ${roomId}
  `;
  return rows as unknown as RoomMemberWithUser[];
}

/**
 * 查询指定用户是否为某房间成员
 */
export async function getRoomMember(userId: string, roomId: string): Promise<RoomMemberRow | null> {
  const [row] = await sql`
    SELECT * FROM room_members WHERE user_id = ${userId} AND room_id = ${roomId}
  `;
  return (row as unknown as RoomMemberRow) ?? null;
}

/**
 * 查询房间的管理员
 */
export async function getAdminByRoom(roomId: string): Promise<RoomMemberRow | null> {
  const [row] = await sql`
    SELECT * FROM room_members WHERE room_id = ${roomId} AND is_admin = 1
  `;
  return (row as unknown as RoomMemberRow) ?? null;
}

/**
 * 获取用户参与的所有房间列表
 */
export async function getRoomsByUser(userId: string): Promise<RoomWithMembership[]> {
  const rows = await sql`
    SELECT r.id, r.name, r.video_url, r.created_at, r.updated_at, rm.is_admin
    FROM rooms r
    JOIN room_members rm ON rm.room_id = r.id
    WHERE rm.user_id = ${userId}
    ORDER BY r.updated_at DESC
  `;
  return rows as unknown as RoomWithMembership[];
}
