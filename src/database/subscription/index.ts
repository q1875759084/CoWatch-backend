import { v4 as uuidv4 } from 'uuid';
import sql from '../index.js';

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan: string;
  expires_at: number | null;
  created_at: number;
}

/**
 * 添加订阅记录
 * @param expiresAt 毫秒 Unix timestamp，undefined 表示永久
 */
export async function addSubscription(
  userId: string,
  plan: string,
  expiresAt?: number,
): Promise<SubscriptionRow> {
  const now = Date.now();
  const [row] = await sql`
    INSERT INTO user_subscriptions (id, user_id, plan, expires_at, created_at)
    VALUES (${uuidv4()}, ${userId}, ${plan}, ${expiresAt ?? null}, ${now})
    RETURNING *
  `;
  return row as unknown as SubscriptionRow;
}

/**
 * 获取用户当前有效的所有 plan 名称列表
 * 有效条件：expires_at IS NULL 或 expires_at > now
 */
export async function getActivePlans(userId: string): Promise<string[]> {
  const now = Date.now();
  const rows = await sql`
    SELECT plan FROM user_subscriptions
    WHERE user_id = ${userId}
      AND (expires_at IS NULL OR expires_at > ${now})
  `;
  return rows.map((r) => r.plan as string);
}
