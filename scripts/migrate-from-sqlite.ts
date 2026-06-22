/**
 * scripts/migrate-from-sqlite.ts
 *
 * 一次性脚本：将 SQLite 数据迁移到 PostgreSQL。
 *
 * 使用方式（在项目根目录执行）：
 *   npx tsx scripts/migrate-from-sqlite.ts
 *
 * 前置条件：
 *   1. .env 文件中已配置 DATABASE_URL（指向目标 PG 实例）
 *   2. 目标 PG 已运行，且通过 runMigrations 建好了 schema
 *   3. SQLite 文件路径：database/cowatch.sqlite3（默认）
 *      或通过环境变量 SQLITE_PATH 指定
 *
 * 安全性：
 *   - 幂等：每张表迁移前检查是否已有数据，有则跳过（避免重复导入）
 *   - 事务：每张表的数据整体在一个事务内写入，失败时自动回滚
 */

import 'dotenv/config';
import Database from 'better-sqlite3';
import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── 动态导入 better-sqlite3（已从 package.json 移除，需临时安装）────────────
// 注意：运行此脚本前需要 npm install better-sqlite3 @types/better-sqlite3 -D

// ─── PostgreSQL 客户端（复用项目的连接池）────────────────────────────────────
// 直接 import postgres 避免循环依赖
import postgres from 'postgres';

const DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://cowatch:dev@localhost:5432/cowatch';

const sql = postgres(DATABASE_URL, { max: 5 });

// ─── SQLite 路径 ──────────────────────────────────────────────────────────────
const SQLITE_PATH = process.env.SQLITE_PATH
  ?? resolve(__dirname, '../database/cowatch.sqlite3');

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function log(msg: string): void {
  console.log(`[migrate] ${msg}`);
}

async function countPg(table: string): Promise<number> {
  const [row] = await sql.unsafe(`SELECT COUNT(*)::int AS cnt FROM ${table}`);
  return row.cnt as number;
}

// ─── 迁移各表 ─────────────────────────────────────────────────────────────────

async function migrateUsers(db: Database.Database): Promise<void> {
  const existing = await countPg('users');
  if (existing > 0) {
    log(`users 表已有 ${existing} 条数据，跳过`);
    return;
  }

  const rows = db.prepare('SELECT * FROM users').all() as Record<string, unknown>[];
  if (rows.length === 0) { log('users 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      id:                  r.id,
      username:            r.username,
      password_hash:       r.password_hash,
      nickname:            r.nickname,
      created_at:          r.created_at,
      is_upload_whitelist: r.is_upload_whitelist ?? 0,
      avatar_url:          r.avatar_url ?? null,
      is_banned:           r.is_banned ?? 0,
    }));
    await tx`INSERT INTO users ${tx(records)}`;
  });
  log(`✅ users: 迁移 ${rows.length} 条`);
}

async function migrateRooms(db: Database.Database): Promise<void> {
  const existing = await countPg('rooms');
  if (existing > 0) { log(`rooms 表已有 ${existing} 条数据，跳过`); return; }

  const rows = db.prepare('SELECT * FROM rooms').all() as Record<string, unknown>[];
  if (rows.length === 0) { log('rooms 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      id:           r.id,
      name:         r.name ?? '',
      video_url:    r.video_url ?? null,
      control_mode: r.control_mode ?? 'designated',
      controller_id: r.controller_id ?? null,
      created_at:   r.created_at,
      updated_at:   r.updated_at,
    }));
    await tx`INSERT INTO rooms ${tx(records)}`;
  });
  log(`✅ rooms: 迁移 ${rows.length} 条`);
}

async function migrateRoomMembers(db: Database.Database): Promise<void> {
  const existing = await countPg('room_members');
  if (existing > 0) { log(`room_members 已有 ${existing} 条数据，跳过`); return; }

  const rows = db.prepare('SELECT * FROM room_members').all() as Record<string, unknown>[];
  if (rows.length === 0) { log('room_members 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      user_id:   r.user_id,
      room_id:   r.room_id,
      is_admin:  r.is_admin ?? 0,
      joined_at: r.joined_at,
    }));
    await tx`INSERT INTO room_members ${tx(records)}`;
  });
  log(`✅ room_members: 迁移 ${rows.length} 条`);
}

async function migrateRoomVideos(db: Database.Database): Promise<void> {
  const existing = await countPg('room_videos');
  if (existing > 0) { log(`room_videos 已有 ${existing} 条数据，跳过`); return; }

  const rows = db.prepare('SELECT * FROM room_videos').all() as Record<string, unknown>[];
  if (rows.length === 0) { log('room_videos 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      id:           r.id,
      room_id:      r.room_id,
      video_url:    r.video_url,
      file_name:    r.file_name,
      uploader_id:  r.uploader_id,
      created_at:   r.created_at,
      hls_prefix:   r.hls_prefix ?? null,
      // SQLite 旧版 hls_status 可能是 'done'，PG schema 改为 'ready'
      hls_status:   r.hls_status === 'done' ? 'ready' : (r.hls_status ?? 'pending'),
      display_name: r.display_name ?? null,
    }));
    await tx`INSERT INTO room_videos ${tx(records)}`;
  });
  log(`✅ room_videos: 迁移 ${rows.length} 条`);
}

async function migrateTags(db: Database.Database): Promise<void> {
  const existing = await countPg('tags');
  if (existing > 0) { log(`tags 已有 ${existing} 条数据，跳过`); return; }

  const rows = db.prepare('SELECT * FROM tags').all() as Record<string, unknown>[];
  if (rows.length === 0) { log('tags 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      id:         r.id,
      room_id:    r.room_id,
      video_id:   r.video_id,
      time:       r.time,
      label:      r.label,
      created_by: r.created_by,
      created_at: r.created_at,
    }));
    await tx`INSERT INTO tags ${tx(records)}`;
  });
  log(`✅ tags: 迁移 ${rows.length} 条`);
}

async function migrateVideoLabels(db: Database.Database): Promise<void> {
  const existing = await countPg('video_labels');
  if (existing > 0) { log(`video_labels 已有 ${existing} 条数据，跳过`); return; }

  // 旧版本可能没有 video_labels 表
  let rows: Record<string, unknown>[];
  try {
    rows = db.prepare('SELECT * FROM video_labels').all() as Record<string, unknown>[];
  } catch {
    log('video_labels 表不存在（旧版本），跳过');
    return;
  }
  if (rows.length === 0) { log('video_labels 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      id:         r.id,
      video_id:   r.video_id,
      label:      r.label,
      sort_order: r.sort_order ?? 0,
      created_at: r.created_at,
    }));
    await tx`INSERT INTO video_labels ${tx(records)}`;
  });
  log(`✅ video_labels: 迁移 ${rows.length} 条`);
}

async function migrateSubscriptions(db: Database.Database): Promise<void> {
  const existing = await countPg('user_subscriptions');
  if (existing > 0) { log(`user_subscriptions 已有 ${existing} 条数据，跳过`); return; }

  let rows: Record<string, unknown>[];
  try {
    rows = db.prepare('SELECT * FROM user_subscriptions').all() as Record<string, unknown>[];
  } catch {
    log('user_subscriptions 表不存在，跳过');
    return;
  }
  if (rows.length === 0) { log('user_subscriptions 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      id:         r.id,
      user_id:    r.user_id,
      plan:       r.plan,
      expires_at: r.expires_at ?? null,
      created_at: r.created_at,
    }));
    await tx`INSERT INTO user_subscriptions ${tx(records)}`;
  });
  log(`✅ user_subscriptions: 迁移 ${rows.length} 条`);
}

async function migrateInviteCodes(db: Database.Database): Promise<void> {
  const existing = await countPg('invite_codes');
  if (existing > 0) { log(`invite_codes 已有 ${existing} 条数据，跳过`); return; }

  let rows: Record<string, unknown>[];
  try {
    rows = db.prepare('SELECT * FROM invite_codes').all() as Record<string, unknown>[];
  } catch {
    log('invite_codes 表不存在，跳过');
    return;
  }
  if (rows.length === 0) { log('invite_codes 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      code:       r.code,
      used_count: r.used_count ?? 0,
      max_count:  r.max_count ?? 10,
      grant_plan: r.grant_plan ?? null,
    }));
    await tx`INSERT INTO invite_codes ${tx(records)}`;
  });
  log(`✅ invite_codes: 迁移 ${rows.length} 条`);
}

async function migrateSegmentViews(db: Database.Database): Promise<void> {
  const existing = await countPg('segment_views');
  if (existing > 0) { log(`segment_views 已有 ${existing} 条数据，跳过`); return; }

  let rows: Record<string, unknown>[];
  try {
    rows = db.prepare('SELECT * FROM segment_views').all() as Record<string, unknown>[];
  } catch {
    log('segment_views 表不存在，跳过');
    return;
  }
  if (rows.length === 0) { log('segment_views 表为空，跳过'); return; }

  // 分批导入，避免单次 INSERT 过大
  const BATCH_SIZE = 500;
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await sql.begin(async (tx) => {
      const records = batch.map((r) => ({
        id:           r.id,
        room_id:      r.room_id,
        video_id:     r.video_id,
        segment_name: r.segment_name,
        user_id:      r.user_id,
        bytes:        r.bytes ?? 0,
        created_at:   r.created_at,
      }));
      await tx`INSERT INTO segment_views ${tx(records)}`;
    });
    total += batch.length;
  }
  log(`✅ segment_views: 迁移 ${total} 条`);
}

async function migrateAdminUsers(db: Database.Database): Promise<void> {
  const existing = await countPg('admin_users');
  if (existing > 0) { log(`admin_users 已有 ${existing} 条数据，跳过`); return; }

  let rows: Record<string, unknown>[];
  try {
    rows = db.prepare('SELECT * FROM admin_users').all() as Record<string, unknown>[];
  } catch {
    log('admin_users 表不存在，跳过');
    return;
  }
  if (rows.length === 0) { log('admin_users 表为空，跳过'); return; }

  await sql.begin(async (tx) => {
    const records = rows.map((r) => ({
      id:            r.id,
      username:      r.username,
      password_hash: r.password_hash,
      permissions:   r.permissions ?? '["admin"]',
      created_at:    r.created_at,
    }));
    await tx`INSERT INTO admin_users ${tx(records)}`;
  });
  log(`✅ admin_users: 迁移 ${rows.length} 条`);
}

// ─── 主入口 ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  log(`SQLite 源文件：${SQLITE_PATH}`);
  log(`目标 PG：${DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);

  // 打开 SQLite（只读模式，防止意外写入）
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const BetterSqlite3 = require('better-sqlite3') as typeof Database;
  const db = new BetterSqlite3(SQLITE_PATH, { readonly: true });

  log('开始迁移...\n');

  // 按外键依赖顺序迁移
  await migrateUsers(db);
  await migrateRooms(db);
  await migrateRoomMembers(db);
  await migrateRoomVideos(db);
  await migrateTags(db);
  await migrateVideoLabels(db);
  await migrateSubscriptions(db);
  await migrateInviteCodes(db);
  await migrateSegmentViews(db);
  await migrateAdminUsers(db);

  db.close();
  await sql.end();

  log('\n🎉 迁移完成！');
}

main().catch((err) => {
  console.error('[migrate] 迁移失败：', err);
  process.exit(1);
});
