import { db } from './index.js';

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
      id            TEXT PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nickname      TEXT NOT NULL,
      created_at    INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id            TEXT PRIMARY KEY,
      status        TEXT NOT NULL DEFAULT 'waiting',
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
  `);

  console.log('✅ 数据库表初始化完成');
}
