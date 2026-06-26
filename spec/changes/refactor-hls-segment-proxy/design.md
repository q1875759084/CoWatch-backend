# HLS 切片代理化 技术设计

## 1. 功能概述

当前 `generateM3u8` 在线上模式下将 CDN 签名 URL（如 `https://cdn.cowatch.xxx/cowatch/...seg000.ts?sign=...`）直接写入 m3u8。  
Electron 客户端的 `app://localhost` origin 不在 CDN CORS 白名单，导致切片请求被浏览器 preflight 阻断，视频无法播放。

**目标**：将 m3u8 中的切片 URL 改为后端相对路径（`/api/rooms/:roomId/videos/:videoId/segments/:segmentName`），后端收到请求后权限校验通过，再 302 重定向至带签名 CDN URL。渲染进程不再直连 CDN，彻底消除跨域问题，同时统一 Web / Electron / 任意 origin 的行为。

## 2. 涉及模块

**后端（CoWatch-backend）**
- `src/services/hlsService.ts` — `generateM3u8`
- `src/controllers/rooms/index.ts` — 新增 `getSegment`
- `src/routes/rooms/index.ts` — 注册新路由

**前端（CoWatch）**
- `src/utils/hlsSegment.ts` — `isHlsSegment`、`parseSegmentMeta`
- `src/sw.ts` — Service Worker fetch 拦截判断
- `electron/handlers/cache.ts` — Electron cache-first 拦截判断

## 3. 接口设计

### GET /api/rooms/:roomId/videos/:videoId/segments/:segmentName

| 项目 | 说明 |
|------|------|
| 鉴权 | `authMiddleware` + `roomAuthMiddleware` + `requireRoomActive` |
| 作用 | 权限校验通过后 302 重定向到带签名的 CDN URL（线上）或 /uploads 本地路径 |
| 参数 | `roomId`（房间）、`videoId`（视频）、`segmentName`（如 `seg000.ts`） |

```typescript
// 线上模式响应
HTTP/1.1 302 Found
Location: https://cdn.cowatch.xxx/cowatch/{roomId}/{videoId}/seg000.ts?sign=...

// 本地模式响应
HTTP/1.1 302 Found
Location: /uploads/cowatch/{roomId}/{videoId}/seg000.ts
```

**安全设计**：
- 302 Location 每次实时生成签名，无法被预先缓存推测
- `segmentName` 必须 `.ts` 结尾，拒绝目录穿越（不含 `/` 或 `..`）
- 权限校验链与 m3u8 接口一致（`requireRoomActive`）

### m3u8 切片 URL 格式变更

| 模式 | 旧格式 | 新格式 |
|------|--------|--------|
| 线上 | `https://cdn.xxx/cowatch/{roomId}/{videoId}/seg000.ts?sign=...` | `/api/rooms/{roomId}/videos/{videoId}/segments/seg000.ts` |
| 本地 | `/uploads/cowatch/{roomId}/{videoId}/seg000.ts` | `/api/rooms/{roomId}/videos/{videoId}/segments/seg000.ts`（统一） |

## 4. 前端改动

### isHlsSegment 适配

原规则匹配 `pathname.includes('/cowatch/') && pathname.endsWith('.ts')`，覆盖：
- CDN URL（线上）
- `/uploads/cowatch/...` （本地）

新 m3u8 切片 URL 格式为 `/api/rooms/{roomId}/videos/{videoId}/segments/{segmentName}.ts`，需同时匹配两种格式。

**新规则**（向下兼容，两种均支持）：
```
pathname.endsWith('.ts') && (
  pathname.includes('/cowatch/') ||         // 旧格式（CDN/本地直链）
  pathname.includes('/segments/')            // 新格式（后端代理路径）
)
```

### parseSegmentMeta 适配

新路径格式 `/api/rooms/{roomId}/videos/{videoId}/segments/{segmentName}`，需新增一条 regex：

```typescript
// 新格式：/api/rooms/{roomId}/videos/{videoId}/segments/{segmentName}.ts
const match2 = pathname.match(/\/rooms\/([^/]+)\/videos\/([^/]+)\/segments\/([^/]+\.ts)$/);
```

### SW / Electron cache-first 行为

- **SW（浏览器）**：新格式 URL 为同源相对路径，直接走 `fetch(request)` 即可，SW 本身就运行在同源，无 CORS 问题。缓存 key 改为剥签名后的相对路径，不含域名。
- **Electron cache.ts**：`handleHlsSegment` 中 `realUrl` 替换逻辑需适配：新格式 `app://localhost/api/...` → `${apiOrigin}/api/...`，与现有后端路径转发逻辑一致，无需额外处理（已由 main.ts 的 `isBackendPath` 分支处理）。

  **关键调整**：Electron 中新格式切片请求实际上会先被 `isBackendPath` 分支处理（`/api/` 前缀），而非 `isHlsSegment` 分支。因此：
  - `isHlsSegment` 在 Electron main.ts 中的判断需放在 `isBackendPath` 之前（已是现有顺序 ✅）
  - 或者改为：新格式切片走 `isBackendPath` → 后端 302 → Electron 自动跟随重定向到 CDN

  最终选择：**新格式切片请求不走 Electron cache-first**，而是走后端代理路径。后端 302 重定向到 CDN，Electron net.fetch 自动跟随重定向，CDN 响应直接返回给渲染进程。此时 Electron 环境下 m3u8 里的切片请求等同于普通后端请求，无需修改 cache.ts。

  > 注意：这意味着 **Electron 在新架构下不再本地缓存 HLS 切片**（cache-first 退化为直接走后端代理）。如后续需要恢复 Electron 缓存，应在后端 302 前端先读本地缓存，或在 protocol.handle 中拦截 302 Location 做缓存写入。本次 change 不包含此优化。

## 5. 关键决策记录

| 决策 | 结论 | 理由 |
|------|------|------|
| 是否修改 CDN CORS 配置 | 否 | 不符合最小权限原则，且无法覆盖所有 origin |
| 302 vs 后端直接返回 .ts | 302 重定向 | 避免后端转发 CDN 流量，带宽成本高；让 CDN 节点直接向客户端传输 |
| 是否统一本地模式也走新路径 | 是 | 统一前后端路径逻辑，减少分支 |
| Electron 切片缓存 | 本次不实现 | 新架构下切片请求走后端代理，缓存点需另外设计 |
| segmentName 校验强度 | 仅校验 .ts 后缀 + 无斜杠/点点 | 足够防路径穿越，不过度复杂 |
