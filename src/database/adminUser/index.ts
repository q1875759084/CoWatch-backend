import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../index.js';

export interface AdminUserRow {
  id: string;
  username: string;
  password_hash: string;
  /** JSON 序列化的 string[]，如 '["admin"]' 或 '["admin:cowatch"]' */
  permissions: string;
  created_at: number;
}

/**
 * 初始化 admin_users 表（幂等，由 initSchema 调用）
 */
export function initAdminUsersTable(): void {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            TEXT PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      permissions   TEXT NOT NULL DEFAULT '["admin"]',
      created_at    INTEGER NOT NULL
    )
  `).run();
}

/**
 * 根据用户名查询 Admin 账号
 */
export function getAdminUserByUsername(username: string): AdminUserRow | null {
  return (
    (db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as AdminUserRow) ?? null
  );
}

/**
 * 根据 ID 查询 Admin 账号
 */
export function getAdminUserById(id: string): AdminUserRow | null {
  return (
    (db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id) as AdminUserRow) ?? null
  );
}

/**
 * 创建 Admin 账号（初始化脚本 / 测试用）
 */
export function createAdminUser(params: {
  id: string;
  username: string;
  password_hash: string;
  permissions?: string[];
}): AdminUserRow {
  const perms = JSON.stringify(params.permissions ?? ['admin']);
  db.prepare(`
    INSERT INTO admin_users (id, username, password_hash, permissions, created_at)
    VALUES (@id, @username, @password_hash, @permissions, @created_at)
  `).run({
    id: params.id,
    username: params.username,
    password_hash: params.password_hash,
    permissions: perms,
    created_at: Date.now(),
  });
  return getAdminUserById(params.id)!;
}

/**
 * 预置初始 Admin 账号（幂等，已存在则跳过）
 *
 * 权限 ["admin"] 为超级权限，涵盖所有模块和子应用。
 */
export function seedAdminUsers(): void {
  const existing = db.prepare('SELECT 1 FROM admin_users WHERE username = ?').get('cmjndy312405');
  if (existing) return;

  const passwordHash = bcrypt.hashSync('cmjndy312405', 10);
  db.prepare(`
    INSERT INTO admin_users (id, username, password_hash, permissions, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(uuidv4(), 'cmjndy312405', passwordHash, JSON.stringify(['admin']), Date.now());

  console.log('✅ Admin 初始账号已创建（cmjndy312405）');
}

/**
 * 解析 permissions 字段（JSON string → string[]）
 */
export function parsePermissions(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
