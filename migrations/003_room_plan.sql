-- 房间等级体系迁移
-- 创建时间：2026-06

-- ─── rooms 表新增字段 ──────────────────────────────────────────────────────────

-- plan_level：房间当前等级
--   'free'      → 房间已过期/不可用
--   'vip:basic' → 普通会员房间
--   'vip:pro'   → 高级会员房间
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS plan_level TEXT NOT NULL DEFAULT 'free';

-- owner_id：房间创建者，用于每日降级检查
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS owner_id TEXT REFERENCES users(id);

-- 回填历史房间的 owner_id（取 room_members 中 is_admin=1 的成员）
UPDATE rooms
SET owner_id = (
  SELECT user_id
  FROM room_members
  WHERE room_id = rooms.id AND is_admin = 1
  LIMIT 1
)
WHERE owner_id IS NULL;

-- ─── room_subscriptions 表（房间等级持有来源统一管理）────────────────────────
-- 为未来双轨付费体系奠基：
--   source = 'user_membership' → 创建房间时由用户会员等级决定
--   source = 'admin_grant'     → Admin 手动赋予
--   source = 'room_package'    → 房间付费包（下期实现，预留）
CREATE TABLE IF NOT EXISTS room_subscriptions (
  id          TEXT PRIMARY KEY,
  room_id     TEXT NOT NULL REFERENCES rooms(id),
  plan        TEXT NOT NULL,
  source      TEXT NOT NULL,
  granted_by  TEXT,
  expires_at  BIGINT,
  created_at  BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_room_subscriptions_room ON room_subscriptions (room_id);
