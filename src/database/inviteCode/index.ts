import sql from '../index.js';

export interface InviteCodeRow {
  code: string;
  used_count: number;
  max_count: number;
  grant_plan: string | null;
}

/**
 * 查询有效的邀请码（used_count < max_count）
 */
export async function getInviteCode(code: string): Promise<InviteCodeRow | null> {
  const [row] = await sql`
    SELECT * FROM invite_codes
    WHERE code = ${code} AND used_count < max_count
  `;
  return (row as unknown as InviteCodeRow) ?? null;
}

/**
 * 核销邀请码（used_count += 1）
 */
export async function consumeInviteCode(code: string): Promise<void> {
  await sql`
    UPDATE invite_codes SET used_count = used_count + 1 WHERE code = ${code}
  `;
}
