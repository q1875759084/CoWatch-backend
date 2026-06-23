import { v4 as uuidv4 } from 'uuid';
import sql from '../index.js';
import type { RoomPlanLevel } from '../room/index.js';

export type RoomSubscriptionSource = 'user_membership' | 'admin_grant' | 'room_package';

export interface RoomSubscriptionRow {
  id: string;
  room_id: string;
  plan: RoomPlanLevel;
  /** 持有来源：'user_membership' | 'admin_grant' | 'room_package'（预留） */
  source: RoomSubscriptionSource;
  /** 授权人（source='admin_grant' 时为 admin userId） */
  granted_by: string | null;
  /** NULL = 永久有效；毫秒 Unix timestamp */
  expires_at: number | null;
  created_at: number;
}

/**
 * 写入房间订阅记录
 *
 * @param roomId    房间 ID
 * @param plan      房间等级
 * @param source    持有来源
 * @param grantedBy 授权人（admin_grant 时传入 adminId，其余可省略）
 * @param expiresAt 过期时间（毫秒 timestamp），undefined 表示永久
 */
export async function addRoomSubscription(
  roomId: string,
  plan: RoomPlanLevel,
  source: RoomSubscriptionSource,
  grantedBy?: string,
  expiresAt?: number,
): Promise<RoomSubscriptionRow> {
  const now = Date.now();
  const [row] = await sql`
    INSERT INTO room_subscriptions (id, room_id, plan, source, granted_by, expires_at, created_at)
    VALUES (
      ${uuidv4()},
      ${roomId},
      ${plan},
      ${source},
      ${grantedBy ?? null},
      ${expiresAt ?? null},
      ${now}
    )
    RETURNING *
  `;
  return row as unknown as RoomSubscriptionRow;
}

/**
 * 查询房间当前所有有效的订阅记录（expires_at IS NULL 或 > now）
 * 用于降级判断：若存在 admin_grant 或 room_package 来源的有效订阅，则不降级
 */
export async function getActiveRoomSubscriptions(roomId: string): Promise<RoomSubscriptionRow[]> {
  const now = Date.now();
  const rows = await sql`
    SELECT * FROM room_subscriptions
    WHERE room_id = ${roomId}
      AND (expires_at IS NULL OR expires_at > ${now})
    ORDER BY created_at DESC
  `;
  return rows as unknown as RoomSubscriptionRow[];
}
