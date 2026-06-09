import { Router } from 'express';
import { RoomsController } from '../../controllers/rooms/index.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roomAuthMiddleware, adminAuthMiddleware } from '../../middleware/roomAuth.js';
import { uploadGuard } from '../../middleware/uploadGuard.js';

const router = Router();

// 所有房间接口都需要登录态
router.use(authMiddleware);

// 获取我的房间列表
router.get('/my', (req, res) => RoomsController.getMyRooms(req, res));

// 创建房间
router.post('/', (req, res) => RoomsController.create(req, res));

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

// 获取房间信息（放在子路由之后，避免 /:roomId 提前匹配 /videos、/tags 等路径）
router.get('/:roomId', (req, res) => RoomsController.getInfo(req, res));

// 获取上传 URL（需是房间管理员）
// 白名单用户返回 OSS 预签名 URL（直传），非白名单用户返回代理上传地址（mode: 'proxy'）
router.get('/:roomId/upload-url', roomAuthMiddleware, adminAuthMiddleware, (req, res) =>
  RoomsController.getUploadUrl(req, res),
);

// 非白名单用户代理上传（需是房间管理员）
// uploadGuard：校验 Sec-Fetch 请求头 + 每日中转总流量限制
// 注意：需要禁用 express.json/urlencoded 对 body 的解析，保持 req 为原始流
router.post('/:roomId/upload-proxy', roomAuthMiddleware, adminAuthMiddleware, uploadGuard, (req, res) =>
  RoomsController.proxyUpload(req, res),
);

// 本地模式：直接上传视频文件（需是房间管理员）
router.put('/:roomId/upload', roomAuthMiddleware, adminAuthMiddleware, (req, res) =>
  RoomsController.uploadLocal(req, res),
);

// 确认视频上传完成（OSS 模式，需是房间管理员）
router.put('/:roomId/video', roomAuthMiddleware, adminAuthMiddleware, (req, res) =>
  RoomsController.setVideo(req, res),
);

export default router;
