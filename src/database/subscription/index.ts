import { v4 as uuidv4 } from 'uuid';
import { db } from '../index.js';

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan: string;
  expires_at: number | null;
  created_at: number;
}

/**
 * 查询用户是否持有某 plan（含到期判断）
 *
 * expires_at = NULL 表示永久有效；
 * expires_at > Date.now() 表示未到期。
 */
export function hasActivePlan(userId: string, plan: string): boolean {
  const now = Date.now();
  const row = db.prepare(`
    SELECT 1 FROM user_subscriptions
    WHERE user_id = ? AND plan = ?
      AND (expires_at IS NULL OR expires_at > ?)
    LIMIT 1
  `).get(userId, plan, now);
  return !!row;
}

/**
 * 获取用户所有有效 plan 列表
 */
export function getActivePlans(userId: string): string[] {
  const now = Date.now();
  const rows = db.prepare(`
    SELECT plan FROM user_subscriptions
    WHERE user_id = ?
      AND (expires_at IS NULL OR expires_at > ?)
  `).all(userId, now) as Array<{ plan: string }>;
  return rows.map((r) => r.plan);
}

/**
 * 写入订阅记录
 *
 * @param expiresAt 到期时间戳（毫秒），不传则永久有效
 */
export function addSubscription(userId: string, plan: string, expiresAt?: number): void {
  db.prepare(`
    INSERT INTO user_subscriptions (id, user_id, plan, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(uuidv4(), userId, plan, expiresAt ?? null, Date.now());
}
