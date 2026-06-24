import { v4 as uuidv4 } from 'uuid';
import sql from '../index.js';

export interface VideoLabelRow {
  id: string;
  video_id: string;
  label: string;
  sort_order: number;
  created_at: number;
}

/**
 * 批量查询多个视频的 label 列表，返回 Map<videoId, string[]>。
 * 用于 listVideos 接口，避免 N+1 查询。
 */
export async function getLabelsByVideos(videoIds: string[]): Promise<Map<string, string[]>> {
  if (videoIds.length === 0) return new Map();
  const rows = await sql`
    SELECT video_id, label FROM video_labels
    WHERE video_id = ANY(${sql.array(videoIds)})
    ORDER BY video_id, sort_order ASC
  `;
  const result = new Map<string, string[]>();
  for (const row of rows) {
    const vid = row.video_id as string;
    if (!result.has(vid)) result.set(vid, []);
    result.get(vid)!.push(row.label as string);
  }
  return result;
}

/**
 * 整体替换视频的 label 列表（在事务内删除旧记录再批量插入）
 */
export async function setLabelsForVideo(videoId: string, labels: string[]): Promise<void> {
  await sql.begin(async (tx) => {
    await tx`DELETE FROM video_labels WHERE video_id = ${videoId}`;
    if (labels.length > 0) {
      const now = Date.now();
      const rows = labels.map((label, i) => ({
        id: uuidv4(),
        video_id: videoId,
        label,
        sort_order: i,
        created_at: now,
      }));
      await tx`INSERT INTO video_labels ${tx(rows)}`;
    }
  });
}

export async function deleteLabelsByVideo(videoId: string): Promise<void> {
  await sql`DELETE FROM video_labels WHERE video_id = ${videoId}`;
}
