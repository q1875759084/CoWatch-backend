import sql from '../index.js';

export type RecordingSessionStatus = 'recording' | 'finished' | 'auto_finished';

export interface RecordingSessionRow {
  session_id: string;
  room_id: string;
  user_id: string;
  status: RecordingSessionStatus;
  last_segment_at: number;
  segment_keys_json: string;
  started_at: number;
  created_at: number;
}

/**
 * 首片切片到达时创建 session 记录。
 * ON CONFLICT DO NOTHING 幂等，并发重复插入安全。
 */
export async function createRecordingSession(
  sessionId: string,
  roomId: string,
  userId: string,
  firstSegmentKey: string,
  now: number,
): Promise<void> {
  await sql`
    INSERT INTO recording_sessions
      (session_id, room_id, user_id, status, last_segment_at, segment_keys_json, started_at, created_at)
    VALUES
      (${sessionId}, ${roomId}, ${userId}, 'recording', ${now},
       ${JSON.stringify([firstSegmentKey])}, ${now}, ${now})
    ON CONFLICT (session_id) DO NOTHING
  `;
}

/**
 * 后续切片到达时，追加 objectKey 并刷新 last_segment_at。
 * PostgreSQL 支持 jsonb || jsonb 做数组追加，无需应用层读取再写回。
 */
export async function appendSegmentKey(
  sessionId: string,
  segmentKey: string,
  now: number,
): Promise<void> {
  await sql`
    UPDATE recording_sessions
    SET
      last_segment_at  = ${now},
      segment_keys_json = (segment_keys_json::jsonb || ${JSON.stringify([segmentKey])}::jsonb)::text
    WHERE session_id = ${sessionId}
  `;
}

/**
 * finish 接口调用时，将 session 标记为正常结束。
 */
export async function markSessionFinished(sessionId: string): Promise<void> {
  await sql`
    UPDATE recording_sessions SET status = 'finished' WHERE session_id = ${sessionId}
  `;
}

/**
 * 查询所有超时的进行中 session。
 * 超时定义：status = 'recording' 且 last_segment_at < (now - timeoutMs)
 */
export async function getTimedOutSessions(timeoutMs: number): Promise<RecordingSessionRow[]> {
  const cutoff = Date.now() - timeoutMs;
  const rows = await sql`
    SELECT * FROM recording_sessions
    WHERE status = 'recording' AND last_segment_at < ${cutoff}
  `;
  return rows as unknown as RecordingSessionRow[];
}

/**
 * 将 session 标记为自动收尾完成。
 */
export async function markSessionAutoFinished(sessionId: string): Promise<void> {
  await sql`
    UPDATE recording_sessions SET status = 'auto_finished' WHERE session_id = ${sessionId}
  `;
}
