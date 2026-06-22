import { v4 as uuidv4 } from 'uuid';
import sql from '../index.js';

export interface VideoLabelRow {
  id: string;
  video_id: string;
  label: string;
  sort_order: number;
  created_at: number;
}

export async function getLabelsByVideo(videoId: string): Promise<string[]> {
  const rows = await sql`
    SELECT label FROM video_labels
    WHERE video_id = ${videoId}
    ORDER BY sort_order ASC
  `;
  return rows.map((r) => r.label as string);
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
