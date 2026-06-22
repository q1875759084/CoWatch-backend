import sql from '../index.js';

export interface TagRow {
  id: string;
  room_id: string;
  video_id: string;
  time: number;
  label: string;
  created_by: string;
  created_at: number;
}

export async function addTag(
  id: string,
  roomId: string,
  videoId: string,
  time: number,
  label: string,
  createdBy: string,
): Promise<TagRow> {
  const now = Date.now();
  const [row] = await sql`
    INSERT INTO tags (id, room_id, video_id, time, label, created_by, created_at)
    VALUES (${id}, ${roomId}, ${videoId}, ${time}, ${label}, ${createdBy}, ${now})
    RETURNING *
  `;
  return row as unknown as TagRow;
}

export async function deleteTag(id: string, roomId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM tags WHERE id = ${id} AND room_id = ${roomId}
  `;
  return result.count > 0;
}

export async function getTagsByRoomVideo(roomId: string, videoId: string): Promise<TagRow[]> {
  const rows = await sql`
    SELECT * FROM tags
    WHERE room_id = ${roomId} AND video_id = ${videoId}
    ORDER BY time ASC
  `;
  return rows as unknown as TagRow[];
}

export async function deleteTagsByVideo(videoId: string): Promise<void> {
  await sql`DELETE FROM tags WHERE video_id = ${videoId}`;
}
