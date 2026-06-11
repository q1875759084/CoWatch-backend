import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../index.js';

export interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  nickname: string;
  created_at: number;
  is_upload_whitelist: number; // 1 = 白名单用户（上传次数不受限制）
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

/**
 * 预置账号列表（注册关闭期间使用）
 * 说明：whitelist 为 true 的账号为白名单用户，上传不受次数限制
 */
const PRESET_USERS: Array<{ username: string; password: string; whitelist: boolean }> = [
  { username: 'huochai', password: 'huochai', whitelist: true },
  { username: 'kamui1',  password: 'cmj0531',  whitelist: true },
  { username: 'member1', password: '11111111', whitelist: false },
  { username: 'member2', password: '22222222', whitelist: false },
  { username: 'member3', password: '33333333', whitelist: false },
  { username: 'member4', password: '44444444', whitelist: false },
  { username: 'member5', password: '55555555', whitelist: false },
  { username: 'member6', password: '66666666', whitelist: false },
  { username: 'member7', password: '77777777', whitelist: false },
  { username: 'member8', password: '88888888', whitelist: false },
];

/**
 * 初始化预置账号（幂等：已存在的账号跳过，仅补充缺失的）
 * 在 initSchema 之后调用
 */
export async function seedDefaultUsers(): Promise<void> {
  const insert = db.prepare(`
    INSERT INTO users (id, username, password_hash, nickname, created_at, is_upload_whitelist)
    VALUES (@id, @username, @password_hash, @nickname, @created_at, @is_upload_whitelist)
  `);

  for (const u of PRESET_USERS) {
    const exists = checkUsernameExists(u.username);
    if (exists) continue;

    const passwordHash = await bcrypt.hash(u.password, 10);
    insert.run({
      id: uuidv4(),
      username: u.username,
      password_hash: passwordHash,
      nickname: u.username,
      created_at: Date.now(),
      is_upload_whitelist: u.whitelist ? 1 : 0,
    });
    console.log(`✅ 预置账号已创建：${u.username}${u.whitelist ? ' [白名单]' : ''}`);
  }
}
