import { db } from './index.js';
import { seedInviteCodes } from './inviteCode/index.js';

/**
 * 初始化所有数据表（幂等，已存在则跳过）
 *
 * 表结构说明：
 *   users              — 注册账号，唯一身份凭证
 *   rooms              — 复盘房间
 *   room_members       — 用户与房间的关联关系 + 房间内角色
 *   room_videos        — 房间内上传的视频记录
 *   tags               — 视频复盘标记点
 *   user_subscriptions — 用户权益订阅（plan 字符串 + 到期时间）
 *   invite_codes       — 邀请码（含类型：普通码/会员码）
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
      hls_prefix   TEXT,
      hls_status   TEXT NOT NULL DEFAULT 'pending',
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

    CREATE TABLE IF NOT EXISTS user_subscriptions (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      plan        TEXT NOT NULL,
      expires_at  INTEGER,
      created_at  INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON user_subscriptions (user_id);

    CREATE TABLE IF NOT EXISTS invite_codes (
      code        TEXT PRIMARY KEY,
      used_count  INTEGER NOT NULL DEFAULT 0,
      max_count   INTEGER NOT NULL DEFAULT 10,
      grant_plan  TEXT
    );
  `);

  // 幂等补列迁移：对已存在的旧表自动补齐缺失的列，避免因 CREATE TABLE IF NOT EXISTS
  // 跳过建表导致新增列永远不出现。每个 ALTER TABLE 单独 try/catch，互不影响。
  runMigrations();

  console.log('✅ 数据库表初始化完成');

  // 初始化预置邀请码（同步，幂等）
  seedInviteCodes();
}

/**
 * 增量列迁移（幂等）
 *
 * 每条迁移对应一次字段新增，SQLite 不支持 IF NOT EXISTS 语法，
 * 所以用 try/catch 捕获 "duplicate column" 错误来实现幂等。
 * 新增字段时在此处追加一条 alterColumn 调用即可。
 */
function runMigrations(): void {
  const migrations: Array<{ sql: string; desc: string }> = [
    {
      // is_upload_whitelist 已废弃（改用 user_subscriptions 判断），列保留不删
      sql: 'ALTER TABLE users ADD COLUMN is_upload_whitelist INTEGER NOT NULL DEFAULT 0',
      desc: 'users.is_upload_whitelist (废弃，仅兼容旧数据)',
    },
    {
      sql: 'ALTER TABLE room_videos ADD COLUMN hls_prefix TEXT',
      desc: 'room_videos.hls_prefix',
    },
    {
      sql: "ALTER TABLE room_videos ADD COLUMN hls_status TEXT NOT NULL DEFAULT 'pending'",
      desc: 'room_videos.hls_status',
    },
    // room_members.is_online 废弃：在线状态改为纯内存（roomClients Map）管理，
    // 不再写 DB。SQLite < 3.35 不支持 DROP COLUMN，旧库中该列继续存在但永不读写。
    // 新库通过上方 CREATE TABLE IF NOT EXISTS 建表时已不含该列。
  ];

  for (const { sql, desc } of migrations) {
    try {
      db.prepare(sql).run();
      console.log(`✅ 迁移成功：${desc}`);
    } catch (err) {
      // "duplicate column name" 表示列已存在，属于正常情况，静默跳过
      const msg = (err as Error).message ?? '';
      if (msg.includes('duplicate column name')) {
        // 列已存在，跳过
      } else {
        // 其他错误（如语法错误）需要抛出，避免静默掩盖真实问题
        throw err;
      }
    }
  }
}
