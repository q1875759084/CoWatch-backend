import sql from '../index.js';

export interface AdminUserRow {
  id: string;
  username: string;
  password_hash: string;
  permissions: string;   // JSON string，如 '["admin","cowatch"]'
  created_at: number;
}

export async function getAdminUserByUsername(username: string): Promise<AdminUserRow | null> {
  const [row] = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
  return (row as unknown as AdminUserRow) ?? null;
}

export async function getAdminUserById(id: string): Promise<AdminUserRow | null> {
  const [row] = await sql`SELECT * FROM admin_users WHERE id = ${id}`;
  return (row as unknown as AdminUserRow) ?? null;
}

/**
 * 将 permissions JSON 字符串解析为字符串数组
 */
export function parsePermissions(permissions: string): string[] {
  try {
    const parsed = JSON.parse(permissions);
    return Array.isArray(parsed) ? parsed : ['admin'];
  } catch {
    return ['admin'];
  }
}
