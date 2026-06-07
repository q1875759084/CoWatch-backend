import { db } from '../index.js';

export interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  nickname: string;
  created_at: number;
}

/**
 * 创建用户（注册专用）
 */
export function createUser(user: {
  id: string;
  username: string;
  password_hash: string;
  nickname: string;
}): UserRow {
  const now = Date.now();
  db.prepare(`
    INSERT INTO users (id, username, password_hash, nickname, created_at)
    VALUES (@id, @username, @password_hash, @nickname, @created_at)
  `).run({ ...user, created_at: now });
  return getUserById(user.id)!;
}

/**
 * 根据 ID 查询用户
 */
export function getUserById(id: string): UserRow | null {
  return (db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow) ?? null;
}

/**
 * 根据用户名查询用户（登录专用）
 */
export function getUserByUsername(username: string): UserRow | null {
  return (db.prepare('SELECT * FROM users WHERE username = ?').get(username) as UserRow) ?? null;
}

/**
 * 检查用户名是否已存在
 */
export function checkUsernameExists(username: string): boolean {
  return !!db.prepare('SELECT 1 FROM users WHERE username = ?').get(username);
}
