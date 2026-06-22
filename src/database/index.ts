import postgres from 'postgres';

/**
 * PostgreSQL 连接池单例
 *
 * 连接字符串优先读取环境变量 DATABASE_URL，本地开发 fallback 到默认值。
 * docker-compose 内部通过服务名 "postgres" 访问：
 *   postgresql://cowatch:<password>@postgres:5432/cowatch
 */
const DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://cowatch:dev@localhost:5432/cowatch';

const sql = postgres(DATABASE_URL, {
  max: 10,            // 连接池大小，单机低并发足够
  idle_timeout: 30,   // 闲置 30s 后释放连接
  connect_timeout: 10,
  onnotice: () => {}, // 屏蔽 NOTICE 日志（migrate 阶段 IF NOT EXISTS 会产生）
});

console.log('✅ PostgreSQL 连接池已初始化');

export default sql;
