-- CoWatch 初始 Schema
-- 创建时间：2026-06
-- 注：所有时间戳字段使用 BIGINT（毫秒 Unix timestamp），与 SQLite 保持一致
-- 注：布尔字段使用 INTEGER（0/1），与旧数据兼容

-- ─── users ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                   TEXT PRIMARY KEY,
  username             TEXT UNIQUE NOT NULL,
  password_hash        TEXT NOT NULL,
  nickname             TEXT NOT NULL,
  created_at           BIGINT NOT NULL,
  is_upload_whitelist  INTEGER NOT NULL DEFAULT 0,  -- 已废弃，由 003 migration 删除
  avatar_url           TEXT,
  is_banned            INTEGER NOT NULL DEFAULT 0
);

-- ─── rooms ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooms (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL DEFAULT '',
  video_url     TEXT,
  control_mode  TEXT NOT NULL DEFAULT 'designated',
  controller_id TEXT,
  created_at    BIGINT NOT NULL,
  updated_at    BIGINT NOT NULL
);

-- ─── room_members ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS room_members (
  user_id   TEXT NOT NULL,
  room_id   TEXT NOT NULL,
  is_admin  INTEGER NOT NULL DEFAULT 0,
  joined_at BIGINT NOT NULL,
  PRIMARY KEY (user_id, room_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- ─── room_videos ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS room_videos (
  id           TEXT PRIMARY KEY,
  room_id      TEXT NOT NULL,
  video_url    TEXT NOT NULL,
  file_name    TEXT NOT NULL,
  uploader_id  TEXT NOT NULL,
  created_at   BIGINT NOT NULL,
  hls_prefix   TEXT,
  hls_status   TEXT NOT NULL DEFAULT 'pending',
  display_name TEXT,
  FOREIGN KEY (room_id)     REFERENCES rooms(id),
  FOREIGN KEY (uploader_id) REFERENCES users(id)
);

-- ─── tags ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tags (
  id          TEXT PRIMARY KEY,
  room_id     TEXT NOT NULL,
  video_id    TEXT NOT NULL,
  time        REAL NOT NULL,
  label       TEXT NOT NULL,
  created_by  TEXT NOT NULL,
  created_at  BIGINT NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE INDEX IF NOT EXISTS idx_tags_room_video ON tags (room_id, video_id);

-- ─── video_labels ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS video_labels (
  id         TEXT PRIMARY KEY,
  video_id   TEXT NOT NULL,
  label      TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at BIGINT NOT NULL,
  FOREIGN KEY (video_id) REFERENCES room_videos(id)
);

CREATE INDEX IF NOT EXISTS idx_video_labels_video ON video_labels (video_id);

-- ─── user_subscriptions ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  plan        TEXT NOT NULL,
  expires_at  BIGINT,
  created_at  BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON user_subscriptions (user_id);

-- ─── invite_codes ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invite_codes (
  code        TEXT PRIMARY KEY,
  used_count  INTEGER NOT NULL DEFAULT 0,
  max_count   INTEGER NOT NULL DEFAULT 10,
  grant_plan  TEXT
);

-- ─── segment_views ──────────────────────────────────────────────────────────
-- 纯流量日志表，video_id 仅作分组 key，不设外键约束
-- 视频删除后历史流量记录应保留，供 dashboard 统计回溯
CREATE TABLE IF NOT EXISTS segment_views (
  id            TEXT PRIMARY KEY,
  room_id       TEXT NOT NULL,
  video_id      TEXT NOT NULL,
  segment_name  TEXT NOT NULL,
  user_id       TEXT NOT NULL,
  bytes         BIGINT NOT NULL DEFAULT 0,
  created_at    BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_segment_views_room  ON segment_views (room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_segment_views_video ON segment_views (video_id, created_at);
CREATE INDEX IF NOT EXISTS idx_segment_views_user  ON segment_views (user_id, created_at);

-- ─── admin_users ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            TEXT PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  permissions   TEXT NOT NULL DEFAULT '["admin"]',
  created_at    BIGINT NOT NULL
);
