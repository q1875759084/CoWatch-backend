import { db } from './index.js';
import { seedDefaultUsers } from './user/index.js';

/**
 * 初始化所有数据表（幂等，已存在则跳过）
 *
 * 表结构说明：
 *   users        — 注册账号，唯一身份凭证
 *   rooms        — 复盘房间
 *   room_members — 用户与房间的关联关系 + 房间内角色（替代旧 members 表）
 */
export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id                   TEXT PRIMARY KEY,
      username             TEXT UNIQUE NOT NULL,
      password_hash        TEXT NOT NULL,
      nickname             TEXT NOT NULL,
      created_at           INTEGER NOT NULL,
      is_upload_whitelist  INTEGER NOT NULL DEFAULT 0
    );
    -- 旧数据库迁移：ALTER TABLE users ADD COLUMN is_upload_whitelist INTEGER NOT NULL DEFAULT 0;
    -- 设置白名单：UPDATE users SET is_upload_whitelist = 1 WHERE username = '目标用户名';

    CREATE TABLE IF NOT EXISTS rooms (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL DEFAULT '',
      video_url     TEXT,
      control_mode  TEXT NOT NULL DEFAULT 'designated',
      controller_id TEXT,
      created_at    INTEGER NOT NULL,
      updated_at    INTEGER NOT NULL,
      FOREIGN KEY (controller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS room_members (
      user_id   TEXT NOT NULL,
      room_id   TEXT NOT NULL,
      is_admin  INTEGER NOT NULL DEFAULT 0,
      is_online INTEGER NOT NULL DEFAULT 0,
      joined_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, room_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (room_id) REFERENCES rooms(id)
    );

    CREATE TABLE IF NOT EXISTS room_videos (
      id           TEXT PRIMARY KEY,
      room_id      TEXT NOT NULL,
      video_url    TEXT NOT NULL,
      file_name    TEXT NOT NULL,
      uploader_id  TEXT NOT NULL,
      created_at   INTEGER NOT NULL,
      FOREIGN KEY (room_id)     REFERENCES rooms(id),
      FOREIGN KEY (uploader_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS tags (
      id          TEXT PRIMARY KEY,
      room_id     TEXT NOT NULL,
      video_id    TEXT NOT NULL,
      time        REAL NOT NULL,
      label       TEXT NOT NULL,
      created_by  TEXT NOT NULL,
      created_at  INTEGER NOT NULL,
      FOREIGN KEY (room_id) REFERENCES rooms(id)
    );

    CREATE INDEX IF NOT EXISTS idx_tags_room_video ON tags (room_id, video_id);
  `);

  console.log('✅ 数据库表初始化完成');

  // 异步初始化预置账号（bcrypt hash 为异步操作，不阻塞启动）
  seedDefaultUsers().catch((err) => {
    console.error('❌ 预置账号初始化失败：', err);
  });
}
