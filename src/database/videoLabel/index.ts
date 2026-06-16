import { v4 as uuidv4 } from 'uuid';
import { db } from '../index.js';

export interface VideoLabelRow {
  id: string;
  video_id: string;
  label: string;
  sort_order: number;
  created_at: number;
}

/**
 * 获取视频的所有 label（按 sort_order 升序）
 */
export function getLabelsByVideo(videoId: string): string[] {
  const rows = db
    .prepare('SELECT label FROM video_labels WHERE video_id = ? ORDER BY sort_order ASC')
    .all(videoId) as Pick<VideoLabelRow, 'label'>[];
  return rows.map((r) => r.label);
}

/**
 * 整体替换视频的 label 列表（事务：先全删再批量插入）
 * labels 数组的下标即为 sort_order
 */
export function setLabelsForVideo(videoId: string, labels: string[]): void {
  const now = Date.now();
  const deleteStmt = db.prepare('DELETE FROM video_labels WHERE video_id = ?');
  const insertStmt = db.prepare(
    'INSERT INTO video_labels (id, video_id, label, sort_order, created_at) VALUES (?, ?, ?, ?, ?)',
  );

  db.transaction(() => {
    deleteStmt.run(videoId);
    labels.forEach((label, idx) => {
      insertStmt.run(uuidv4(), videoId, label, idx, now);
    });
  })();
}

/**
 * 删除视频时级联清除其所有 label（在 deleteRoomVideo 之前调用）
 */
export function deleteLabelsByVideo(videoId: string): void {
  db.prepare('DELETE FROM video_labels WHERE video_id = ?').run(videoId);
}
