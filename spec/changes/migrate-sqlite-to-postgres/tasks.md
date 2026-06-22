# SQLite → PostgreSQL 迁移 实现任务

## 任务清单

### 阶段一：基础设施 & 依赖

#### 1. 依赖替换
- [ ] `npm remove better-sqlite3 @types/better-sqlite3`
- [ ] `npm install postgres`（`postgres.js`，无需 @types，自带声明）

#### 2. 新建 `src/database/index.ts`（连接池单例）
- [ ] 重写为 `postgres.js` 连接池，读取 `DATABASE_URL` 环境变量
- [ ] 本地无 `DATABASE_URL` 时 fallback 到 `postgresql://cowatch:dev@localhost:5432/cowatch`
- [ ] 删除旧的 `better-sqlite3` 连接逻辑和 PRAGMA 语句

#### 3. 新建 `migrations/001_init.sql`
- [ ] 包含全部 11 张表的 DDL（`users` / `rooms` / `room_members` / `room_videos` / `tags` / `video_labels` / `user_subscriptions` / `invite_codes` / `segment_views` / `admin_users`）
- [ ] `segment_views` 不含外键约束（已决策）
- [ ] 布尔字段保持 `INTEGER` 类型
- [ ] 时间戳字段用 `BIGINT`（毫秒 Unix）
- [ ] 包含所有索引（`idx_tags_room_video` 等）

#### 4. 新建 `src/database/migrate.ts`（迁移执行器）
- [ ] 启动时确保 `schema_migrations` 表存在
- [ ] 读取 `migrations/` 目录，按文件名升序执行未跑过的 `.sql`
- [ ] 每条迁移在事务内执行，执行后写入 `schema_migrations`
- [ ] 删除旧的 `src/database/schema.ts`

---

### 阶段二：database 层改造（同步 → 异步）

#### 5. `src/database/user/index.ts`
- [ ] `createUser` → async，改用 `INSERT ... RETURNING *`
- [ ] `getUserById` → async
- [ ] `getUserByUsername` → async
- [ ] `checkUsernameExists` → async
- [ ] `updateUserAvatar` → async
- [ ] `updateUserNickname` → async
- [ ] `banUser` → async
- [ ] `deleteUser` → async
- [ ] `getAllUsers` → async

#### 6. `src/database/room/index.ts`
- [ ] `createRoom` → async，改用 `INSERT ... RETURNING *`
- [ ] `getRoomById` → async
- [ ] `setVideoUrl` → async
- [ ] `setControllerId` → async

#### 7. `src/database/roomMember/index.ts`
- [ ] `joinRoom` → async，`ON CONFLICT DO UPDATE` 语法 PostgreSQL 兼容（保持不变）
- [ ] `getRoomMember` → async
- [ ] `getMembersByRoom` → async
- [ ] `getAdminByRoom` → async
- [ ] `getRoomsByUser` → async

#### 8. `src/database/roomVideo/index.ts`
- [ ] `addRoomVideo` → async，改用 `INSERT ... RETURNING *`
- [ ] `getRoomVideoById` → async
- [ ] `getVideoByUrl` → async
- [ ] `getVideosByRoom` → async
- [ ] `updateHlsStatus` → async
- [ ] `getVideoIdByObjectKey` → async
- [ ] `updateDisplayName` → async
- [ ] `deleteRoomVideo` → async

#### 9. `src/database/tag/index.ts`
- [ ] `addTag` → async，改用 `INSERT ... RETURNING *`
- [ ] `getTagById` → async
- [ ] `deleteTag` → async
- [ ] `getTagsByRoomVideo` → async
- [ ] `deleteTagsByVideo` → async

#### 10. `src/database/videoLabel/index.ts`
- [ ] `getLabelsByVideo` → async
- [ ] `setLabelsForVideo` → async，`db.transaction()` 改为 `sql.begin()`
- [ ] `deleteLabelsByVideo` → async

#### 11. `src/database/segmentView/index.ts`
- [ ] `deleteSegmentViewsByVideo` → async
- [ ] `insertSegmentView` → async
- [ ] `insertSegmentViewBatch` → async，改用 `sql(rows)` 批量插入语法
- [ ] `getRoomTrafficStats` → async
- [ ] `getVideoTrafficStats` → async
- [ ] `getUserTrafficStats` → async
- [ ] `getTotalTrafficStats` → async

#### 12. `src/database/subscription/index.ts`
- [ ] `hasActivePlan` → async
- [ ] `getActivePlans` → async
- [ ] `addSubscription` → async

#### 13. `src/database/inviteCode/index.ts`
- [ ] `getInviteCode` → async
- [ ] `consumeInviteCode` → async
- [ ] `seedInviteCodes` → async，`INSERT OR IGNORE` 改为 `INSERT ... ON CONFLICT DO NOTHING`

#### 14. `src/database/adminUser/index.ts`
- [ ] `initAdminUsersTable` → 迁移至 `migrations/001_init.sql`，删除此函数
- [ ] `getAdminUserByUsername` → async
- [ ] `getAdminUserById` → async
- [ ] `createAdminUser` → async，改用 `INSERT ... RETURNING *`；`@name` 占位符改为模板字符串
- [ ] `seedAdminUsers` → async

---

### 阶段三：调用方更新（Controllers / Services / 启动入口）

#### 15. 更新所有 Controllers（批量加 await）
- [ ] `src/controllers/auth/index.ts` — 所有 DB 调用加 `await`
- [ ] `src/controllers/rooms/index.ts` — 所有 DB 调用加 `await`
- [ ] `src/controllers/admin/usersController.ts` — 所有 DB 调用加 `await`
- [ ] `src/controllers/admin/roomsController.ts` — 所有 DB 调用加 `await`
- [ ] `src/controllers/users/index.ts`（如有）— 所有 DB 调用加 `await`

#### 16. 更新 Services
- [ ] `src/services/hlsService.ts` — DB 调用加 `await`
- [ ] `src/ws/wsServer.ts`（或类似文件）— DB 调用加 `await`

#### 17. 更新启动入口 `src/app.ts`
- [ ] 移除 `initSchema()` 调用
- [ ] 加入 `await runMigrations(sql)`
- [ ] 加入 `await seedInviteCodes()`、`await seedAdminUsers()`
- [ ] 确保 DB 就绪后再 `app.listen()`

---

### 阶段四：infra docker-compose

#### 18. `infra/cowatch/docker-compose.yml`（base）
- [ ] 新增 `postgres` service（`postgres:16-alpine`，healthcheck，expose 5432）
- [ ] `backend` 新增 `depends_on: postgres: condition: service_healthy`
- [ ] `backend.environment` 新增 `DATABASE_URL`

#### 19. `infra/cowatch/docker-compose.dev.yml`
- [ ] 新增 `postgres.ports: 5432:5432`（供本地直连调试）
- [ ] 新增 `postgres.volumes: cowatch-pg-dev:/var/lib/postgresql/data`
- [ ] 新增顶层 `volumes: cowatch-pg-dev:`
- [ ] `backend.volumes` 移除 `cowatch-db-dev:/app/database`（SQLite 文件不再需要）

#### 20. `infra/cowatch/docker-compose.prod.yml`
- [ ] 新增 `postgres.volumes: cowatch-pg-prod:/var/lib/postgresql/data`
- [ ] 新增顶层 `volumes: cowatch-pg-prod:`
- [ ] `backend.volumes` 移除 `cowatch-db-prod:/app/database`

---

### 阶段五：数据迁移脚本

#### 21. 新建 `scripts/migrate-from-sqlite.ts`
- [ ] 接受 `--db-path` 参数指定 SQLite 文件路径
- [ ] 按依赖顺序迁移：`users → rooms → room_members → room_videos → tags → video_labels → user_subscriptions → invite_codes → segment_views → admin_users`
- [ ] 每张表迁移完输出条数对比（SQLite 条数 vs PostgreSQL 条数）
- [ ] 时间戳保持毫秒 BIGINT 不转换
- [ ] 使用批量插入（每批 500 条）

---

### 阶段六：清理 & 验证

#### 22. 清理旧代码
- [ ] 删除 `src/database/schema.ts`（含 `initSchema` / `runMigrations` / `removeSegmentViewsForeignKeys`）
- [ ] 确认 `better-sqlite3` 相关 import 全部删除

#### 23. 本地联调验证
- [ ] `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` 启动无报错
- [ ] 后端日志显示迁移成功：`✅ 迁移执行：001_init`
- [ ] 手动回归测试（见 design.md §5）

---

完成所有任务后将 `- [ ]` 改为 `- [x]`
