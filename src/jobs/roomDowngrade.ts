import { getAllActiveRooms, setRoomPlanLevel, type RoomPlanLevel } from '../database/room/index.js';
import { getActivePlans } from '../database/subscription/index.js';
import { getActiveRoomSubscriptions } from '../database/roomSubscription/index.js';
import { PLAN_HIERARCHY } from '../middleware/planGuard.js';

/**
 * 根据用户 plans 计算其可支撑的最高房间等级
 */
function deriveMaxRoomPlanLevel(userPlans: string[]): RoomPlanLevel {
  let maxLevel = 0;
  for (const p of userPlans) {
    const level = PLAN_HIERARCHY[p];
    if (level !== undefined && level > maxLevel) {
      maxLevel = level;
    }
  }
  if (maxLevel >= PLAN_HIERARCHY['vip:pro']) return 'vip:pro';
  if (maxLevel >= PLAN_HIERARCHY['vip:basic']) return 'vip:basic';
  return 'free';
}

/**
 * 每日房间降级任务
 *
 * 逻辑：
 *   1. 查询所有 plan_level != 'free' 的房间
 *   2. 对每个房间的 owner_id 查询当前有效 plan
 *   3. 若 owner 的 plan 已不足以支撑该房间等级：
 *      - 检查是否有 admin_grant 或 room_package 来源的有效订阅
 *      - 若有，跳过（这些来源不受用户会员状态影响）
 *      - 若无，将房间降级为 'free'
 */
async function runRoomDowngradeCheck(): Promise<void> {
  console.log('[roomDowngrade] 开始检查房间降级...');

  let checked = 0;
  let downgraded = 0;

  try {
    const rooms = await getAllActiveRooms();
    checked = rooms.length;

    for (const room of rooms) {
      try {
        // owner_id 为 null（历史数据）时跳过
        if (!room.owner_id) continue;

        const ownerPlans = await getActivePlans(room.owner_id);
        const ownerMaxLevel = deriveMaxRoomPlanLevel(ownerPlans);

        const roomLevel = PLAN_HIERARCHY[room.plan_level] ?? 0;
        const ownerLevel = PLAN_HIERARCHY[ownerMaxLevel] ?? 0;

        // owner 的会员等级足以支撑当前房间等级，无需降级
        if (ownerLevel >= roomLevel) continue;

        // 检查是否有 admin_grant 或 room_package 来源的有效订阅
        const activeSubs = await getActiveRoomSubscriptions(room.id);
        const hasProtectedSub = activeSubs.some(
          (s) => s.source === 'admin_grant' || s.source === 'room_package',
        );
        if (hasProtectedSub) continue;

        // 降级为 free
        await setRoomPlanLevel(room.id, 'free');
        downgraded++;
        console.log(`[roomDowngrade] 房间已降级：roomId=${room.id} ${room.plan_level} → free`);
      } catch (err) {
        console.error(`[roomDowngrade] 处理房间 ${room.id} 时出错：`, err);
      }
    }
  } catch (err) {
    console.error('[roomDowngrade] 获取房间列表失败：', err);
  }

  console.log(`[roomDowngrade] 检查完成：共 ${checked} 个房间，降级 ${downgraded} 个`);
}

/**
 * 计算距离下一个凌晨 3:00 的毫秒数
 */
function msUntilNextRun(hour = 3): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, 0, 0, 0);
  if (next.getTime() <= now.getTime()) {
    // 已过今日 3:00，等到明天
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

/**
 * 启动每日房间降级定时任务（凌晨 3:00 执行）
 * 在 app.ts 的 start() 中调用。
 */
export function scheduleRoomDowngradeJob(): void {
  const delay = msUntilNextRun(3);
  const hours = (delay / 1000 / 60 / 60).toFixed(1);
  console.log(`[roomDowngrade] 定时任务已注册，${hours}h 后首次运行（每日凌晨 3:00）`);

  setTimeout(function tick() {
    void runRoomDowngradeCheck();
    // 下次在 24 小时后执行
    setTimeout(tick, 24 * 60 * 60 * 1000);
  }, delay);
}
