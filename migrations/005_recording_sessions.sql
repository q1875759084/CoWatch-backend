-- Migration 005：新增 recording_sessions 表
--
-- 用途：追踪 Electron 实时录制的进行中状态。
--
-- 背景：
--   Electron 客户端以 sessionId（UUID）为单位上传 HLS 切片。
--   若客户端崩溃或被强杀，/recording/finish 接口不会被调用，
--   导致切片已在 COS 但 room_videos 无记录，视频永久丢失。
--
--   此表记录每个 session 的最后活跃时间，配合后台定时任务：
--   若 last_segment_at 超过 N 分钟且 status = 'recording'，
--   则自动触发收尾（用已有切片写入 room_videos），避免数据丢失。
--
-- 生命周期：
--   1. 首片切片上传 → INSERT session（status = recording）
--   2. 后续切片上传 → UPDATE last_segment_at + 追加 segment_key
--   3. finish 接口调用 → UPDATE status = finished（正常结束）
--   4. 定时任务扫描 → last_segment_at 超时且 status = recording → 自动收尾 → status = auto_finished
--   5. 可选：定期清理 status IN ('finished', 'auto_finished') 的旧记录

CREATE TABLE IF NOT EXISTS recording_sessions (
  session_id       TEXT PRIMARY KEY,
  room_id          TEXT NOT NULL,
  user_id          TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'recording',
  -- 最后一次切片上传的时间戳（ms），用于超时检测
  last_segment_at  BIGINT NOT NULL,
  -- 已上传切片的 objectKey 列表（JSON 数组字符串），供自动收尾时还原 segmentKeys
  -- PostgreSQL 侧用 jsonb || jsonb 追加，无需应用层读取再写回
  segment_keys_json TEXT NOT NULL DEFAULT '[]',
  -- 录制开始时间戳（ms），近似值（首片上传时间）
  started_at       BIGINT NOT NULL,
  created_at       BIGINT NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE INDEX IF NOT EXISTS idx_recording_sessions_status ON recording_sessions (status, last_segment_at);
