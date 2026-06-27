import sql from '../index.js';

export interface RoomVideoRow {
  id: string;
  room_id: string;
  video_url: string;
  file_name: string;
  uploader_id: string;
  created_at: number;
  hls_prefix: string | null;
  hls_status: string;
  display_name: string | null;
  /** 视频总时长（秒）。Electron 录制视频由 finish 接口写入；普通上传视频为 null */
  duration_seconds: number | null;
}

export async function addRoomVideo(
  id: string,
  roomId: string,
  videoUrl: string,
  fileName: string,
  uploaderId: string,
): Promise<RoomVideoRow> {
  const now = Date.now();
  const [row] = await sql`
    INSERT INTO room_videos (id, room_id, video_url, file_name, uploader_id, created_at)
    VALUES (${id}, ${roomId}, ${videoUrl}, ${fileName}, ${uploaderId}, ${now})
    RETURNING *
  `;
  return row as unknown as RoomVideoRow;
}

export async function getVideosByRoom(roomId: string): Promise<RoomVideoRow[]> {
  const rows = await sql`
    SELECT * FROM room_videos WHERE room_id = ${roomId} ORDER BY created_at ASC
  `;
  return rows as unknown as RoomVideoRow[];
}

export async function getRoomVideoById(id: string): Promise<RoomVideoRow | null> {
  const [row] = await sql`SELECT * FROM room_videos WHERE id = ${id}`;
  return (row as unknown as RoomVideoRow) ?? null;
}

export async function updateHlsStatus(
  videoId: string,
  status: 'pending' | 'processing' | 'ready' | 'error',
  hlsPrefix?: string,
  durationSeconds?: number,
): Promise<void> {
  if (hlsPrefix !== undefined && durationSeconds !== undefined) {
    await sql`
      UPDATE room_videos
      SET hls_status = ${status}, hls_prefix = ${hlsPrefix}, duration_seconds = ${durationSeconds}
      WHERE id = ${videoId}
    `;
  } else if (hlsPrefix !== undefined) {
    await sql`
      UPDATE room_videos SET hls_status = ${status}, hls_prefix = ${hlsPrefix}
      WHERE id = ${videoId}
    `;
  } else {
    await sql`
      UPDATE room_videos SET hls_status = ${status} WHERE id = ${videoId}
    `;
  }
}

export async function updateDisplayName(videoId: string, displayName: string): Promise<void> {
  await sql`UPDATE room_videos SET display_name = ${displayName} WHERE id = ${videoId}`;
}

export async function deleteRoomVideo(videoId: string): Promise<void> {
  await sql`DELETE FROM room_videos WHERE id = ${videoId}`;
}

/**
 * 根据 objectKey（video_url 字段）查找视频 ID
 */
export async function getVideoIdByObjectKey(objectKey: string): Promise<string | null> {
  const [row] = await sql`SELECT id FROM room_videos WHERE video_url = ${objectKey}`;
  return (row?.id as string) ?? null;
}
