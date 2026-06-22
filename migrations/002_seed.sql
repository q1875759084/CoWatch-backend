-- 预置数据 seed（幂等，冲突则跳过）
-- 随 runMigrations 在启动时自动执行，仅首次生效

-- ─── 邀请码 ──────────────────────────────────────────────────────────────────
-- 普通码：max_count=10，grant_plan=NULL，注册后为普通成员
INSERT INTO invite_codes (code, used_count, max_count, grant_plan) VALUES
  ('kfcvivo50',    0, 10, NULL),
  ('倍攻',          0, 10, NULL),
  ('你瞅啥',         0, 10, NULL),
  ('沙漠皇帝',        0, 10, NULL),
  ('cpdd',         0, 10, NULL),
  ('whatcanisay',  0, 10, NULL),
  ('凑个数吧',        0, 10, NULL)
ON CONFLICT (code) DO NOTHING;

-- 会员码：max_count=1，grant_plan='vip:basic'，注册后自动获得 vip:basic 永久订阅
INSERT INTO invite_codes (code, used_count, max_count, grant_plan) VALUES
  ('0531',       0, 1, 'vip:basic'),
  ('小萝卜',       0, 1, 'vip:basic'),
  ('踩地火',       0, 1, 'vip:basic'),
  ('不太聪明',      0, 1, 'vip:basic'),
  ('anxina',     0, 1, 'vip:basic'),
  ('变态萝莉控',     0, 1, 'vip:basic'),
  ('世界第一h2',    0, 1, 'vip:basic')
ON CONFLICT (code) DO NOTHING;

-- 测试专用码：max_count=999999（近似无限），仅开发/测试环境使用
INSERT INTO invite_codes (code, used_count, max_count, grant_plan) VALUES
  ('ndymember',  0, 999999, NULL),
  ('ndyvip',     0, 999999, 'vip:basic')
ON CONFLICT (code) DO NOTHING;

-- ─── Admin 初始账号 ──────────────────────────────────────────────────────────
-- 密码在应用层由 bcrypt 哈希后写入；此处不能预置明文，需由应用代码处理
-- 见 src/database/migrate.ts 中的 seedAdminUser() 函数
