-- 删除已废弃的 is_upload_whitelist 字段
-- 该字段自引入 user_subscriptions 权益体系后即废弃，保留仅为历史兼容，现正式清理
ALTER TABLE users DROP COLUMN IF EXISTS is_upload_whitelist;
