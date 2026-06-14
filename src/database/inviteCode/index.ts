import { db } from '../index.js';

export interface InviteCodeRow {
  code: string;
  used_count: number;
  max_count: number;
  grant_plan: string | null;
}

/**
 * 查询邀请码（不存在或已满返回 null）
 */
export function getInviteCode(code: string): InviteCodeRow | null {
  const row = db.prepare(`
    SELECT * FROM invite_codes WHERE code = ?
  `).get(code) as InviteCodeRow | undefined;
  if (!row) return null;
  if (row.used_count >= row.max_count) return null;
  return row;
}

/**
 * 核销邀请码：used_count += 1
 * 应在 registerUser 事务内调用。
 */
export function consumeInviteCode(code: string): void {
  db.prepare(`
    UPDATE invite_codes SET used_count = used_count + 1 WHERE code = ?
  `).run(code);
}

// ─── 预置邀请码数据 ────────────────────────────────────────────────────────────

/**
 * 普通邀请码：max_count=10，grant_plan=NULL
 * 注册后为普通成员。
 */
const NORMAL_CODES: string[] = [
  'kfcvivo50',
  '倍攻',
  '你瞅啥',
  '沙漠皇帝',
  'cpdd',
  'whatcanisay',
  '凑个数吧',
];

/**
 * 会员邀请码：max_count=1，grant_plan='vip:basic'
 * 注册后自动获得 vip:basic 订阅（永久）。
 */
const VIP_CODES: string[] = [
  '0531',
  '小萝卜',
  '踩地火',
  '不太聪明',
  'anxina',
  '变态萝莉控',
  '世界第一h2',
];

/**
 * 测试专用邀请码：max_count=999999（近似无限），仅用于开发/测试
 * ndymember → 普通成员；ndyvip → vip:basic 会员
 */
const DEV_CODES: Array<{ code: string; grantPlan: string | null }> = [
  { code: 'ndymember', grantPlan: null },
  { code: 'ndyvip',    grantPlan: 'vip:basic' },
];

/**
 * 初始化预置邀请码（幂等，已存在则跳过）
 */
export function seedInviteCodes(): void {
  const insertNormal = db.prepare(`
    INSERT OR IGNORE INTO invite_codes (code, used_count, max_count, grant_plan)
    VALUES (?, 0, 10, NULL)
  `);
  const insertVip = db.prepare(`
    INSERT OR IGNORE INTO invite_codes (code, used_count, max_count, grant_plan)
    VALUES (?, 0, 1, 'vip:basic')
  `);
  const insertDev = db.prepare(`
    INSERT OR IGNORE INTO invite_codes (code, used_count, max_count, grant_plan)
    VALUES (?, 0, 999999, ?)
  `);

  for (const code of NORMAL_CODES) {
    insertNormal.run(code);
  }
  for (const code of VIP_CODES) {
    insertVip.run(code);
  }
  for (const { code, grantPlan } of DEV_CODES) {
    insertDev.run(code, grantPlan);
  }

  console.log(`✅ 预置邀请码初始化完成（普通码 ${NORMAL_CODES.length} 个，会员码 ${VIP_CODES.length} 个，测试码 ${DEV_CODES.length} 个）`);
}
