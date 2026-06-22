# SQLite → PostgreSQL 迁移 技术设计

## 1. 功能概述

将 CoWatch-backend 持久层从 `better-sqlite3`（同步 SQLite）迁移到 PostgreSQL（`postgres.js`），消除 SQLite DDL 限制（无法 DROP CONSTRAINT / ALTER COLUMN），使 schema 演进不再需要重建表的 workaround。迁移后所有 DB 操作变为异步，本地开发与线上环境均通过 Docker 运行 PostgreSQL。

## 2. 涉及模块

| 模块 | 路径 | 变更类型 |
|------|------|---------|
| 数据库连接 | `src/database/index.ts` | 重写 |
| Schema 初始化 | `src/database/schema.ts` | 重写（迁移文件机制替代） |
| 迁移执行器 | `src/database/migrate.ts` | 新建 |
| SQL 迁移文件 | `migrations/001_init.sql` | 新建 |
| database/user | `src/database/user/index.ts` | 同步→异步 |
| database/room | `src/database/room/index.ts` | 同步→异步 |
| database/roomMember | `src/database/roomMember/index.ts` | 同步→异步 |
| database/roomVideo | `src/database/roomVideo/index.ts` | 同步→异步 |
| database/tag | `src/database/tag/index.ts` | 同步→异步 |
| database/videoLabel | `src/database/videoLabel/index.ts` | 同步→异步 |
| database/segmentView | `src/database/segmentView/index.ts` | 同步→异步 |
| database/subscription | `src/database/subscription/index.ts` | 同步→异步 |
| database/inviteCode | `src/database/inviteCode/index.ts` | 同步→异步 |
| database/adminUser | `src/database/adminUser/index.ts` | 同步→异步 |
| infra/cowatch | `docker-compose.yml` / `dev.yml` / `prod.yml` | 加 postgres service |
| 数据迁移脚本 | `scripts/migrate-from-sqlite.ts` | 新建（一次性执行） |

---

## 3. 核心设计

### 3.1 数据库连接（`src/database/index.ts`）

**旧：** `better-sqlite3` 同步单例

```ts
// 旧
import Database from 'better-sqlite3';
export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
```

**新：** `postgres.js` 连接池，环境变量 `DATABASE_URL` 驱动

```ts
// 新
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
});
export default sql;
```

- `DATABASE_URL` 格式：`postgresql://cowatch:<password>@postgres:5432/cowatch`
- 本地开发：`postgresql://cowatch:dev@localhost:5432/cowatch`（docker-compose 暴露 5432）
- 连接池 max=10，适合单机低并发场景

---

### 3.2 Schema 迁移机制

废弃 `schema.ts` 的 `initSchema()` + `runMigrations()` 模式，改为：

**`migrations/` 目录结构：**
```
migrations/
  001_init.sql          ← 完整建表 DDL（全部 11 张表）
  002_xxx.sql           ← 未来新增字段 / 改约束等（按需追加）
```

**`src/database/migrate.ts`（启动时执行）：**

```ts
// 伪代码
async function runMigrations(sql: Sql) {
  // 1. 确保 schema_migrations 表存在
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
    version     TEXT PRIMARY KEY,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  // 2. 读取 migrations/ 目录，按文件名升序排列
  const files = readdirSync('migrations').filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const version = file.replace('.sql', '');
    // 3. 检查是否已执行
    const [row] = await sql`SELECT 1 FROM schema_migrations WHERE version = ${version}`;
    if (row) continue;

    // 4. 执行迁移
    const sqlContent = readFileSync(`migrations/${file}`, 'utf-8');
    await sql.begin(async sql => {
      await sql.unsafe(sqlContent);
      await sql`INSERT INTO schema_migrations (version) VALUES (${version})`;
    });
    console.log(`✅ 迁移执行：${version}`);
  }
}
```

启动入口 `app.ts` 中 `await runMigrations(sql)` 后再监听端口。

---

### 3.3 SQL 语法差异对照

| 场景 | SQLite（旧） | PostgreSQL（新） |
|------|-------------|-----------------|
| 单行查询 | `db.prepare(...).get(id)` | `const [row] = await sql\`...\`` |
| 多行查询 | `db.prepare(...).all(id)` | `const rows = await sql\`...\`` |
| 写入（无返回） | `db.prepare(...).run(...)` | `await sql\`INSERT...\`` |
| 写入后查询 | `run()` + 再 `get()` | `INSERT ... RETURNING *` 一步完成 |
| 占位符 | `?` 或 `@name` | 模板字符串 `${param}`（postgres.js 自动参数化） |
| 事务 | `db.transaction(fn)()` | `await sql.begin(async sql => { ... })` |
| UPSERT | `INSERT OR IGNORE` / `ON CONFLICT DO UPDATE` | `ON CONFLICT DO UPDATE`（语法相同） |
| 布尔值 | `0` / `1`（INTEGER） | `true` / `false`（BOOLEAN） |
| 时间戳 | `INTEGER`（毫秒 Unix） | 保持 `BIGINT`（毫秒 Unix，不改语义） |

> **布尔值说明**：PostgreSQL 原生支持 BOOLEAN，但为减少迁移风险，`is_admin`、`is_upload_whitelist`、`is_banned` 等字段在 `001_init.sql` 中继续用 `INTEGER` 类型，代码层不改类型判断逻辑。未来可单独一条迁移改为 BOOLEAN。

---

### 3.4 各 database 文件改造模式

以 `user/index.ts` 为例说明通用模式：

```ts
// 旧（同步）
export function getUserById(id: string): UserRow | null {
  return (db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow) ?? null;
}

// 新（异步）
export async function getUserById(id: string): Promise<UserRow | null> {
  const [row] = await sql`SELECT * FROM users WHERE id = ${id}`;
  return (row as UserRow) ?? null;
}
```

**`INSERT` 后立即查询 → 改用 `RETURNING *`：**
```ts
// 旧
db.prepare('INSERT INTO users ...').run(...);
return getUserById(id)!;

// 新
const [row] = await sql`INSERT INTO users (...) VALUES (...) RETURNING *`;
return row as UserRow;
```

**事务（videoLabel.setLabelsForVideo）：**
```ts
// 旧
db.transaction(() => {
  deleteStmt.run(videoId);
  labels.forEach((label, idx) => insertStmt.run(...));
})();

// 新
await sql.begin(async sql => {
  await sql`DELETE FROM video_labels WHERE video_id = ${videoId}`;
  for (const [idx, label] of labels.entries()) {
    await sql`INSERT INTO video_labels (...) VALUES (...)`;
  }
});
```

**批量插入（segmentView.insertSegmentViewBatch）：**
```ts
// 新：postgres.js 支持数组批量插入
await sql`INSERT INTO segment_views ${sql(rows.map(r => ({
  id: uuidv4(), room_id: r.roomId, ...
})))}`;
```

---

### 3.5 infra docker-compose 变更

**`docker-compose.yml`（base）新增 postgres service：**

```yaml
postgres:
  image: postgres:16-alpine
  environment:
    - POSTGRES_DB=cowatch
    - POSTGRES_USER=cowatch
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  expose:
    - "5432"
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U cowatch"]
    interval: 5s
    timeout: 3s
    retries: 10
  restart: always

backend:
  # 新增：
  depends_on:
    postgres:
      condition: service_healthy
  environment:
    # 新增：
    - DATABASE_URL=postgresql://cowatch:${POSTGRES_PASSWORD}@postgres:5432/cowatch
```

**`docker-compose.dev.yml` 新增：**
```yaml
postgres:
  ports:
    - "5432:5432"   # 暴露到宿主机，供本地直连调试
  volumes:
    - cowatch-pg-dev:/var/lib/postgresql/data

volumes:
  cowatch-pg-dev:
```

**`docker-compose.prod.yml` 新增：**
```yaml
postgres:
  volumes:
    - cowatch-pg-prod:/var/lib/postgresql/data

volumes:
  cowatch-pg-prod:
```

---

### 3.6 数据迁移脚本（`scripts/migrate-from-sqlite.ts`）

一次性脚本，在新 PostgreSQL 容器启动后手动执行：

```
执行步骤：
1. docker compose exec backend node dist/scripts/migrate-from-sqlite.js --db-path /app/database/cowatch.sqlite3
2. 脚本逐表读取 SQLite 数据，批量写入 PostgreSQL
3. 完成后输出各表条数对比，人工核验
```

**迁移顺序**（尊重外键依赖）：
```
users → rooms → room_members → room_videos
→ tags → video_labels → user_subscriptions
→ invite_codes → segment_views → admin_users
```

**注意事项：**
- `segment_views` 已无外键约束，无需担心 video_id 引用问题
- 所有时间戳保持毫秒 BIGINT，不做转换
- `admin_users` 表在迁移脚本里也包含（`password_hash` 直接复制，不重新 hash）

---

### 3.7 seed 数据处理

`seedInviteCodes()` / `seedAdminUsers()` 从 schema 初始化移入启动时执行，逻辑不变，改为 async：

```ts
// app.ts 启动序列
await runMigrations(sql);
await seedInviteCodes(sql);
await seedAdminUsers(sql);
app.listen(PORT);
```

---

## 4. 关键决策记录

| 决策点 | 结论 | 理由 |
|--------|------|------|
| 迁移范围 | 先迁测试，验证后再迁生产 | 生产尚未上线，无紧迫性；测试验证降低生产风险 |
| 历史数据 | 独立一次性脚本手动执行 | 逻辑清晰，出错可重跑，不污染业务代码 |
| PG 客户端 | `postgres.js` | 模板字符串语法最简洁，自动参数化防注入 |
| 本地开发 | Docker 跑 PostgreSQL | 与线上一致，零额外安装 |
| Schema 迁移管理 | `migrations/*.sql` + `schema_migrations` 表 | 比 `try/catch ALTER TABLE` 更规范可追溯 |
| 布尔字段类型 | 保持 INTEGER（0/1） | 减少迁移风险，未来单独迁 BOOLEAN |
| 时间戳 | 保持毫秒 BIGINT | 不改语义，代码层零改动 |

---

## 5. 回归测试清单

迁移后手动验证以下关键路径：

- [ ] 注册 / 登录（users 表读写）
- [ ] 创建房间 / 进入房间（rooms / room_members）
- [ ] 上传视频 / HLS 切片完成（room_videos）
- [ ] 播放视频（m3u8 接口、segment_views 写入）
- [ ] 删除视频（不报 FOREIGN KEY 错误）
- [ ] 添加/删除 Tag（tags 表）
- [ ] 流量统计 API（segment_views 聚合查询）
- [ ] daibao-dashboard 登录（admin_users）
- [ ] daibao-dashboard 房间列表带流量（JOIN 查询）
