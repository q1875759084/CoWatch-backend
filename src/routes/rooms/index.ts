import { Router } from 'express';
import { RoomsController } from '../../controllers/rooms/index.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roomAuthMiddleware } from '../../middleware/roomAuth.js';
import { uploadGuard } from '../../middleware/uploadGuard.js';
import { requirePlan } from '../../middleware/planGuard.js';
import { requireRoomActive } from '../../middleware/roomPlanGuard.js';

const router = Router();

// HLS 片段下载上报（无需鉴权：SW 线程拿不到 cookie，仅做成本统计）
// 必须注册在 authMiddleware 之前，否则 cookie 缺失会被拦截
router.post('/segment-view', (req, res) => RoomsController.reportSegmentView(req, res));

// 所有房间接口都需要登录态
router.use(authMiddleware);

// 获取我的房间列表
router.get('/my', (req, res) => RoomsController.getMyRooms(req, res));

// 创建房间（需要 vip:basic 权限）
router.post('/', requirePlan('vip:basic'), (req, res) => RoomsController.create(req, res));

// 加入房间
router.post('/:roomId/join', (req, res) => RoomsController.join(req, res));

// 获取房间视频列表（所有成员可见；free 房间被 requireRoomActive 拦截）
router.get('/:roomId/videos', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.listVideos(req, res),
);

// 获取房间某视频的 Tag 列表（所有成员可见；free 房间被拦截）
router.get('/:roomId/tags', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.listTags(req, res),
);

// 获取视频的动态 m3u8 内容（所有房间成员可见；free 房间被拦截）
// 注意：路径中含 videos/:videoId，需在 /:roomId 通配路由之前注册
router.get('/:roomId/videos/:videoId/m3u8', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.getVideoM3u8(req, res),
);

// HLS 切片代理接口：权限校验通过后 302 重定向到 CDN（线上）或本地 /uploads（本地模式）
// m3u8 中的切片 URL 均指向此接口，渲染进程不直连 CDN，彻底消除跨域问题
router.get('/:roomId/videos/:videoId/segments/:segmentName', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.getSegment(req, res),
);

// 获取房间信息（不挂 requireRoomActive：前端需要拿到 planLevel 才能显示过期页）
router.get('/:roomId', (req, res) => RoomsController.getInfo(req, res));

// 获取上传 URL（free 房间被拦截）
router.get('/:roomId/upload-url', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.getUploadUrl(req, res),
);

// 代理上传（free 房间被拦截）
// uploadGuard：校验 Sec-Fetch 请求头 + 每日中转总流量限制
// 注意：需要禁用 express.json/urlencoded 对 body 的解析，保持 req 为原始流
router.post('/:roomId/upload-proxy', roomAuthMiddleware, requireRoomActive(), uploadGuard, (req, res) =>
  RoomsController.proxyUpload(req, res),
);

// 本地模式：直接上传视频文件（free 房间被拦截）
router.put('/:roomId/upload', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.uploadLocal(req, res),
);

// 重命名视频（上传者 或 管理员；free 房间被拦截）
router.patch('/:roomId/videos/:videoId/name', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.renameVideo(req, res),
);

// 删除视频及其所有 tags（上传者 或 管理员；free 房间被拦截）
router.delete('/:roomId/videos/:videoId', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.deleteVideo(req, res),
);

// 整体替换视频 label 列表（上传者 或 管理员；free 房间被拦截）
router.put('/:roomId/videos/:videoId/labels', roomAuthMiddleware, requireRoomActive(), (req, res) =>
  RoomsController.updateVideoLabels(req, res),
);

// 注：PUT /:roomId/video（白名单直传 confirm 接口）已废弃，不再注册

export default router;
