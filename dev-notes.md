# CoWatch Backend 开发笔记

## 踩坑记录

### N+1 查询：SQLite 迁移 PostgreSQL 后才暴露的性能问题

**现象：** `GET /api/rooms/:roomId/videos` 接口，有 N 个视频就发 N+1 条 SQL。

**根因：** SQLite 是进程内嵌入式数据库，单次查询开销约 0.01-0.1ms，N+1 在 SQLite 下几乎感知不到。迁移 PostgreSQL 后每次查询需走 TCP 网络栈，开销变成 0.5-5ms，N+1 才成为真实瓶颈。

**原始写法（错误）：**
```typescript
const videosWithLabels = await Promise.all(videos.map(async (v) => ({
  ...v,
  labels: await getLabelsByVideo(v.id),  // 每个视频单独查一次
})));
```

**修复：** 新增 `getLabelsByVideos`（复数），用 `ANY` 批量查询，内存 Map 分组：
```typescript
const labelsMap = await getLabelsByVideos(videos.map((v) => v.id));
const videosWithLabels = videos.map((v) => ({
  ...v,
  labels: labelsMap.get(v.id) ?? [],
}));
```

```sql
-- 一次批量查询替代 N 次单查
SELECT video_id, label FROM video_labels
WHERE video_id = ANY(${sql.array(videoIds)})
ORDER BY video_id, sort_order ASC
```

**结论：** 从 SQLite 迁移到 PostgreSQL 后，需要重新审视所有在循环/map 中调用数据库函数的地方，这类 N+1 模式是最常见的迁移后性能陷阱。

---

## 架构决策

### handleMessage 高频查 DB 问题（待处理）

**现象：** `wsServer.ts` 的 `handleMessage` 每收到一条 WS 消息都执行 `getRoomById(roomId)`，`SYNC_PROGRESS`（200ms 广播一次）是高频消息，在 PostgreSQL 下每次都是真实的网络往返。

**当前状态：** 已识别，暂未处理。改动需要引入内存缓存或将 room 信息挂在连接上下文中，有一定复杂度。

---

### requireRoomActive 双重 DB 查询问题（待处理）

**现象：** `roomAuthMiddleware` 和 `requireRoomActive` 串联时，同一请求对同一 `roomId` 发起两次 `SELECT rooms`。在 SQLite 下几乎无感，PostgreSQL 下是真实的额外往返。

**当前状态：** 已识别，暂未处理。修复方向是将 `roomAuthMiddleware` 查到的 room 对象挂载到 `req` 上，供后续中间件复用。
