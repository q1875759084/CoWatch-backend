-- Migration 004：为 room_videos 表添加 duration_seconds 字段
-- 用途：存储 Electron 实时录制视频的时长（秒），供 generateM3u8 修正最后一片的 #EXTINF 时长
-- 普通上传视频该字段为 NULL，generateM3u8 仍使用固定 HLS_SEGMENT_DURATION
ALTER TABLE room_videos ADD COLUMN duration_seconds INTEGER;
