import sql from '../index.js';

export type RoomPlanLevel = 'free' | 'vip:basic' | 'vip:pro';

export interface RoomRow {
  id: string;
  name: string;
  video_url: string | null;
  control_mode: string;
  controller_id: string | null;
  created_at: number;
  updated_at: number;
  /** 房间当前等级：'free' | 'vip:basic' | 'vip:pro' */
  plan_level: RoomPlanLevel;
  /** 房间创建者 user_id，用于每日降级检查 */
  owner_id: string | null;
}

export async function createRoom(
  id: string,
  name: string,
  ownerId: string,
  planLevel: RoomPlanLevel,
): Promise<RoomRow> {
  const now = Date.now();
  const [row] = await sql`
    INSERT INTO rooms (id, name, owner_id, plan_level, created_at, updated_at)
    VALUES (${id}, ${name}, ${ownerId}, ${planLevel}, ${now}, ${now})
    RETURNING *
  `;
  return row as unknown as RoomRow;
}

export async function getRoomById(id: string): Promise<RoomRow | null> {
  const [row] = await sql`SELECT * FROM rooms WHERE id = ${id}`;
  return (row as unknown as RoomRow) ?? null;
}

export async function setVideoUrl(roomId: string, videoUrl: string | null): Promise<void> {
  await sql`
    UPDATE rooms SET video_url = ${videoUrl}, updated_at = ${Date.now()}
    WHERE id = ${roomId}
  `;
}

export async function setControllerId(roomId: string, controllerId: string): Promise<void> {
  await sql`UPDATE rooms SET controller_id = ${controllerId} WHERE id = ${roomId}`;
}

/**
 * 更新房间等级
 */
export async function setRoomPlanLevel(roomId: string, planLevel: RoomPlanLevel): Promise<void> {
  await sql`UPDATE rooms SET plan_level = ${planLevel} WHERE id = ${roomId}`;
}

/**
 * 查询所有 plan_level != 'free' 的房间（供每日降级 cron 使用）
 */
export async function getAllActiveRooms(): Promise<RoomRow[]> {
  const rows = await sql`SELECT * FROM rooms WHERE plan_level != 'free'`;
  return rows as unknown as RoomRow[];
}
