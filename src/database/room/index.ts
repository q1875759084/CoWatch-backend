import sql from '../index.js';

export interface RoomRow {
  id: string;
  name: string;
  video_url: string | null;
  control_mode: string;
  controller_id: string | null;
  created_at: number;
  updated_at: number;
}

export async function createRoom(id: string, name: string): Promise<RoomRow> {
  const now = Date.now();
  const [row] = await sql`
    INSERT INTO rooms (id, name, created_at, updated_at)
    VALUES (${id}, ${name}, ${now}, ${now})
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
