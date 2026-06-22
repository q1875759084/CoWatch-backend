import sql from '../index.js';

export interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  nickname: string;
  created_at: number;
  /** 用户头像 URL；NULL 表示使用默认头像 */
  avatar_url: string | null;
  is_banned: number;
}

/**
 * 创建用户（注册专用）
 */
export async function createUser(user: {
  id: string;
  username: string;
  password_hash: string;
  nickname: string;
}): Promise<UserRow> {
  const now = Date.now();
  const [row] = await sql`
    INSERT INTO users (id, username, password_hash, nickname, created_at)
    VALUES (${user.id}, ${user.username}, ${user.password_hash}, ${user.nickname}, ${now})
    RETURNING *
  `;
  return row as UserRow;
}

/**
 * 根据 ID 查询用户
 */
export async function getUserById(id: string): Promise<UserRow | null> {
  const [row] = await sql`SELECT * FROM users WHERE id = ${id}`;
  return (row as UserRow) ?? null;
}

/**
 * 根据用户名查询用户（登录专用）
 */
export async function getUserByUsername(username: string): Promise<UserRow | null> {
  const [row] = await sql`SELECT * FROM users WHERE username = ${username}`;
  return (row as UserRow) ?? null;
}

/**
 * 检查用户名是否已存在
 */
export async function checkUsernameExists(username: string): Promise<boolean> {
  const [row] = await sql`SELECT 1 FROM users WHERE username = ${username}`;
  return !!row;
}

/**
 * 更新用户头像 URL
 */
export async function updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
  await sql`UPDATE users SET avatar_url = ${avatarUrl} WHERE id = ${userId}`;
}

/**
 * 更新用户昵称
 */
export async function updateUserNickname(userId: string, nickname: string): Promise<void> {
  await sql`UPDATE users SET nickname = ${nickname} WHERE id = ${userId}`;
}

/**
 * 封号 / 解封
 */
export async function banUser(userId: string, banned: boolean): Promise<void> {
  await sql`UPDATE users SET is_banned = ${banned ? 1 : 0} WHERE id = ${userId}`;
}

/**
 * 删除用户
 */
export async function deleteUser(userId: string): Promise<void> {
  await sql`DELETE FROM users WHERE id = ${userId}`;
}

/**
 * 获取所有用户列表（Admin 用）
 */
export async function getAllUsers(): Promise<UserRow[]> {
  const rows = await sql`SELECT * FROM users ORDER BY created_at DESC`;
  return rows as unknown as UserRow[];
}
