import { Router } from 'express';
import { RoomsController } from '../../controllers/rooms/index.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roomAuthMiddleware } from '../../middleware/roomAuth.js';
import { uploadGuard } from '../../middleware/uploadGuard.js';
import { requirePlan } from '../../middleware/planGuard.js';

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

// 获取房间视频列表（所有成员可见）
router.get('/:roomId/videos', roomAuthMiddleware, (req, res) =>
  RoomsController.listVideos(req, res),
);

// 获取房间某视频的 Tag 列表（所有成员可见）
router.get('/:roomId/tags', roomAuthMiddleware, (req, res) =>
  RoomsController.listTags(req, res),
);

// 获取视频的动态 m3u8 内容（所有房间成员可见）
// 注意：路径中含 videos/:videoId，需在 /:roomId 通配路由之前注册
router.get('/:roomId/videos/:videoId/m3u8', roomAuthMiddleware, (req, res) =>
  RoomsController.getVideoM3u8(req, res),
);

// 获取房间信息（放在子路由之后，避免 /:roomId 提前匹配 /videos、/tags 等路径）
router.get('/:roomId', (req, res) => RoomsController.getInfo(req, res));

// 获取上传 URL（房间所有成员均可上传）
// 所有用户统一返回 mode: 'proxy'（已废弃白名单直传分支）
router.get('/:roomId/upload-url', roomAuthMiddleware, (req, res) =>
  RoomsController.getUploadUrl(req, res),
);

// 代理上传（房间所有成员均可上传）
// uploadGuard：校验 Sec-Fetch 请求头 + 每日中转总流量限制
// 注意：需要禁用 express.json/urlencoded 对 body 的解析，保持 req 为原始流
router.post('/:roomId/upload-proxy', roomAuthMiddleware, uploadGuard, (req, res) =>
  RoomsController.proxyUpload(req, res),
);

// 本地模式：直接上传视频文件（房间所有成员均可上传）
router.put('/:roomId/upload', roomAuthMiddleware, (req, res) =>
  RoomsController.uploadLocal(req, res),
);

// 重命名视频（上传者 或 管理员）
router.patch('/:roomId/videos/:videoId/name', roomAuthMiddleware, (req, res) =>
  RoomsController.renameVideo(req, res),
);

// 删除视频及其所有 tags（上传者 或 管理员）
router.delete('/:roomId/videos/:videoId', roomAuthMiddleware, (req, res) =>
  RoomsController.deleteVideo(req, res),
);

// 整体替换视频 label 列表（上传者 或 管理员）
router.put('/:roomId/videos/:videoId/labels', roomAuthMiddleware, (req, res) =>
  RoomsController.updateVideoLabels(req, res),
);

// 注：PUT /:roomId/video（白名单直传 confirm 接口）已废弃，不再注册

export default router;
