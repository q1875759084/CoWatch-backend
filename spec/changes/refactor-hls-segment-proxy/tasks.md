# HLS 切片代理化 实现任务

## 任务清单

### 后端 CoWatch-backend

#### 1. hlsService.ts — generateM3u8 URL 改为相对路径

- [x] 修改 `generateM3u8` 函数签名，新增 `roomId` 参数（移除 `userId`）
- [x] 线上模式：切片 URL 从 CDN 签名 URL 改为 `/api/rooms/{roomId}/videos/{videoId}/segments/{segmentName}`
- [x] 本地模式：切片 URL 从 `/uploads/...` 改为 `/api/rooms/{roomId}/videos/{videoId}/segments/{segmentName}`（统一）
- [x] 移除 `getHlsSegmentSignedUrl` import（generateM3u8 不再生成签名 URL）
- [x] 更新 `generateM3u8` 的 JSDoc 注释

#### 2. controllers/rooms/index.ts — 新增 getSegment 处理器

- [x] 新增 `getSegment` 方法（`GET /api/rooms/:roomId/videos/:videoId/segments/:segmentName`）
- [x] 参数校验：`segmentName` 必须以 `.ts` 结尾，不含 `/` 或 `..`
- [x] 权限校验：验证 video 存在且属于该 room（`getRoomVideoById`）
- [x] 线上模式：调用 `getHlsSegmentSignedUrl(hlsPrefix + segmentName, 10 * 60)` 生成签名 URL，返回 302
- [x] 本地模式：拼接 `/uploads/{hlsPrefix}{segmentName}`，返回 302
- [x] 更新 `getVideoM3u8` 调用 `generateM3u8`，透传 `roomId` 参数（移除 `userId`）
- [x] import `getHlsSegmentSignedUrl` from ossService

#### 3. routes/rooms/index.ts — 注册新路由

- [x] 注册 `GET /:roomId/videos/:videoId/segments/:segmentName`，挂载 `roomAuthMiddleware` + `requireRoomActive`
- [x] 路由位置：在 `/:roomId/videos/:videoId/m3u8` 之后、`/:roomId` 通配路由之前

---

### 前端 CoWatch

#### 4. src/utils/hlsSegment.ts — 适配新路径格式

- [x] 修改 `isHlsSegment`：新增匹配条件 `pathname.includes('/segments/')` 覆盖新格式
- [x] 修改 `parseSegmentMeta`：新增 regex 分支，匹配 `/rooms/{roomId}/videos/{videoId}/segments/{segmentName}.ts`
- [x] 保留旧格式 regex（`/cowatch/{roomId}/{videoId}/{segmentName}.ts`），向下兼容

#### 5. src/sw.ts — Service Worker 适配

- [x] 无需改动 sw.ts，`isHlsSegment` 更新后自动匹配新格式
- [x] SW 同源请求后端代理路径无 CORS 问题，`fetch(request)` 直接可用

#### 6. electron/handlers/cache.ts — Electron 适配

- [x] 无需改动核心逻辑，新格式切片请求流程已验证：
  - `isHlsSegment(app://localhost/api/rooms/.../segments/...)` → true
  - `realUrl` = `${apiOrigin}/api/rooms/...` → 后端 302 → CDN
  - `net.fetch` 自动跟随 302，CDN 响应写入本地 cache
- [x] 更新顶部注释，说明新格式切片处理流程

---

## 完成标准

- [x] 所有后端代码实现完毕，lint 通过
- [x] 所有前端工具函数更新完毕，lint 通过
- [ ] 后端部署后，Web 端（浏览器）访问视频播放正常（待联调验证）
- [ ] Electron preview 模式（连接测试环境后端）视频播放正常，无 CORS 报错（待联调验证）
- [ ] m3u8 文件中切片路径为 `/api/rooms/...` 形式（待联调验证）
- [ ] 302 重定向响应正常，Location 指向带签名 CDN URL（待联调验证）
