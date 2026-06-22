import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import type { Sql } from 'postgres';

const __dirname = dirname(fileURLToPath(import.meta.url));
// migrations 目录在项目根目录（src/../migrations）
const MIGRATIONS_DIR = resolve(__dirname, '../../migrations');

/**
 * 启动时按序执行 migrations/ 目录下未跑过的 .sql 文件（幂等）。
 *
 * 机制：
 *   - schema_migrations 表记录已执行的版本号（文件名去掉 .sql）
 *   - 每次迁移在事务内执行：sql 内容 + 写入版本号，原子完成
 *   - 文件名按字典序排列，保证执行顺序
 *
 * 使用方式：在 app.ts 监听端口之前 await runMigrations(sql)
 */
export async function runMigrations(sql: Sql): Promise<void> {
  // 确保版本记录表存在
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version     TEXT PRIMARY KEY,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // 读取 migrations 目录，按文件名升序
  let files: string[];
  try {
    files = readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();
  } catch {
    console.warn(`[migrate] migrations 目录不存在或为空：${MIGRATIONS_DIR}`);
    return;
  }

  for (const file of files) {
    const version = file.replace('.sql', '');

    // 检查是否已执行
    const [existing] = await sql`
      SELECT 1 FROM schema_migrations WHERE version = ${version}
    `;
    if (existing) continue;

    // 读取 SQL 内容
    const sqlContent = readFileSync(resolve(MIGRATIONS_DIR, file), 'utf-8');

    // 在事务内执行迁移 + 记录版本（原子）
    await sql.begin(async (tx) => {
      await tx.unsafe(sqlContent);
      await tx`INSERT INTO schema_migrations (version) VALUES (${version})`;
    });

    console.log(`✅ 迁移执行：${version}`);
  }

  console.log('✅ 数据库迁移检查完成');

  // Admin 初始账号（密码需 bcrypt，不能写在 SQL 里）
  await seedAdminUser(sql);
}

/**
 * 预置初始 Admin 账号（幂等，已存在则跳过）
 */
async function seedAdminUser(sql: Sql): Promise<void> {
  const ADMIN_USERNAME = 'cmjndy312405';

  const [existing] = await sql`
    SELECT 1 FROM admin_users WHERE username = ${ADMIN_USERNAME}
  `;
  if (existing) return;

  const passwordHash = await bcrypt.hash(ADMIN_USERNAME, 10);
  await sql`
    INSERT INTO admin_users (id, username, password_hash, permissions, created_at)
    VALUES (${uuidv4()}, ${ADMIN_USERNAME}, ${passwordHash}, ${JSON.stringify(['admin'])}, ${Date.now()})
  `;
  console.log(`✅ Admin 初始账号已创建（${ADMIN_USERNAME}）`);
}
