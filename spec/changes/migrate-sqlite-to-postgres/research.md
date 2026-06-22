# Research: SQLite → PostgreSQL 迁移

## 背景

当前 CoWatch-backend 使用 `better-sqlite3`（同步 API）+ 单文件 SQLite。
随着功能演进，SQLite 的 DDL 限制（无法直接 `ALTER TABLE DROP CONSTRAINT` / 改列类型等）
导致 schema 变更需要重建表（如 `removeSegmentViewsForeignKeys()`），维护成本逐渐上升。
当前规模（10 张表、数据量小）是迁移成本最低的时间窗口。

---

## 关键决策

### D1：迁移范围
- **Decision:** 先迁测试环境，回归验证通过后再迁生产
- **Rationale:** 测试环境有大量真实记录，迁移脚本在测试上跑通后生产风险几乎为零；生产环境尚未正式上线，无紧迫性
- **Alternatives considered:** 同步迁移两套环境（风险集中，无回滚窗口）

### D2：历史数据迁移方式
- **Decision:** 独立一次性迁移脚本，手动执行
- **Rationale:** 逻辑清晰，出错可重跑，不污染业务代码；启动时自动检测迁移逻辑复杂且有不可预期的边界情况
- **Alternatives considered:**
  - 后端启动时自动检测并迁移（逻辑混在 initSchema，出错难排查）
  - 不迁移历史数据从空库起步（测试环境有大量有效数据，不接受丢失）

### D3：PostgreSQL 客户端
- **Decision:** `postgres.js`（原生 SQL，模板字符串占位符）
- **Rationale:** 当前代码全是手写 SQL，ORM 引入额外学习成本收益不大；`postgres.js` API 比 `pg` 更简洁（`` sql`SELECT * FROM users WHERE id = ${id}` `` 语法）
- **Alternatives considered:**
  - Prisma ORM（需要重新定义 schema、迁移文件格式完全不同，改造量大）
  - `pg` / node-postgres（老牌但占位符 `$1 $2` 不如模板字符串直观）

### D4：本地开发环境
- **Decision:** 本地也用 Docker 跑 PostgreSQL（`docker compose up` 一起启动）
- **Rationale:** 与线上环境完全一致，无需在本机安装 PostgreSQL，新人 clone 后一键启动
- **Alternatives considered:**
  - 本地安装 PostgreSQL（环境不一致，版本差异风险）
  - 本地继续用 SQLite 双 DB 模式（维护两套 DB 层，引入新的复杂度）

### D5：Schema 迁移管理
- **Decision:** 手写 SQL 迁移文件（`migrations/001_init.sql`），启动时按序自动执行未跑过的，`schema_migrations` 表记录已执行版本
- **Rationale:** 比现有 `try/catch ALTER TABLE` 更规范、可追溯；不引入外部工具，保持技术栈简单
- **Alternatives considered:**
  - 继续沿用 `runMigrations()` 风格（在 PG 上 `try/catch` 模式仍然可用，但不够规范）
  - `node-pg-migrate` 等工具（引入额外依赖和学习成本）

---

## 现状盘点

### 数据库文件位置（Docker volume）
| 环境 | Volume | 容器内路径 |
|------|--------|-----------|
| 测试 | `cowatch-db-dev` | `/app/database` |
| 生产 | `cowatch-db-prod` | `/app/database` |

### 需改造的 database 层文件
| 文件 | 函数数量（估计） |
|------|----------------|
| `database/user/index.ts` | ~8 |
| `database/room/index.ts` | ~6 |
| `database/roomMember/index.ts` | ~5 |
| `database/roomVideo/index.ts` | ~7 |
| `database/tag/index.ts` | ~4 |
| `database/videoLabel/index.ts` | ~4 |
| `database/segmentView/index.ts` | ~5 |
| `database/subscription/index.ts` | ~3 |
| `database/inviteCode/index.ts` | ~3 |
| `database/adminUser/index.ts` | ~4 |
| `database/schema.ts` | 重写为迁移文件 |

### 涉及表（共 10 张）
```
users / rooms / room_members / room_videos / tags
video_labels / user_subscriptions / invite_codes
segment_views / admin_users
```

### 关键变更点
1. `better-sqlite3` 同步 API → `postgres.js` 异步 API（所有 DB 函数加 `async/await`）
2. 占位符：`?` → 模板字符串 `` sql`...${param}...` ``
3. `db.prepare(...).get()` → `await sql`...`` ` `（返回数组，需取 `[0]`）
4. `db.prepare(...).all()` → `await sql`...`` `（直接返回数组）
5. `db.prepare(...).run()` → `await sql`...`` `
6. 事务：`db.transaction(fn)()` → `await sql.begin(async sql => { ... })`
7. `PRAGMA` 语句全部删除
8. `schema.ts` 重写为 `migrations/001_init.sql`

---

## 迁移执行计划（草稿）

### 阶段一：基础设施
1. infra: `docker-compose.yml` 加 postgres service
2. infra: `docker-compose.dev.yml` / `docker-compose.prod.yml` 加 postgres volume
3. backend: 替换依赖（`better-sqlite3` → `postgres`）
4. backend: 新建 `src/database/pg.ts`（连接池单例）
5. backend: 新建 `migrations/` 目录，写 `001_init.sql`
6. backend: 新建 `src/database/migrate.ts`（启动时执行迁移）

### 阶段二：database 层改造
- 逐文件将同步函数改为 async，更新所有 Controller 调用点

### 阶段三：数据迁移脚本
- `scripts/migrate-from-sqlite.ts`：读取旧 `.db` 文件，写入 PostgreSQL

### 阶段四：验证
- 测试环境部署，执行迁移脚本，手动回归测试关键路径

---

## 风险点

| 风险 | 概率 | 处理方式 |
|------|------|----------|
| 漏加 await 导致运行时报错 | 中 | 关键路径手动回归测试覆盖 |
| 迁移脚本数据类型不匹配（如 INTEGER 时间戳） | 低 | 脚本中显式转换，对比条数验证 |
| postgres service 启动慢，backend 先于 PG 就绪 | 低 | `depends_on: condition: service_healthy` |
| 本地 docker-compose.dev.yml 缺少 postgres（本地开发） | 低 | 统一加入，文档说明 |
