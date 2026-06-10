import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRoom, getRoomById, setControllerId } from '../../database/room/index.js';
import { joinRoom, getMembersByRoom, getRoomsByUser } from '../../database/roomMember/index.js';
import { addRoomVideo, getVideosByRoom } from '../../database/roomVideo/index.js';
import { getTagsByRoomVideo } from '../../database/tag/index.js';
import { generateRoomId } from '../../utils/roomId.js';
import { isOssEnabled, getUploadUrl, getSignedUrl, proxyUploadToOss } from '../../services/ossService.js';
import { isUploadWhitelisted } from '../../database/user/index.js';
import { addDailyBytes } from '../../middleware/uploadGuard.js';
import { success, fail } from '../../utils/response.js';
import { broadcast } from '../ws/registry.js';

// ─── 本地存储配置（仅 isOssEnabled() === false 时使用）────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../../../uploads');

/**
 * 将 objectKey 转换为本地模式的播放 URL（仅供本地模式使用）。
 * COS 模式下播放 URL 由 getSignedUrl() 实时生成，不走此函数。
 */
function toLocalPlayUrl(objectKey: string): string {
  // objectKey 格式：cowatch/{roomId}/{uuid}-{fileName}
  // 本地静态文件服务挂载在 /uploads，因此拼接为 /uploads/{objectKey}
  return `/uploads/${objectKey}`;
}

export const RoomsController = {

  /**
   * POST /api/rooms
   * 创建房间，当前登录用户自动成为管理员
   */
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const { name } = req.body as { name?: string };

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      fail(res, 400, '请输入房间名');
      return;
    }
    if (name.trim().length > 10) {
      fail(res, 400, '房间名最多10个字符');
      return;
    }

    let roomId = '';
    for (let i = 0; i < 5; i++) {
      const candidate = generateRoomId();
      if (!getRoomById(candidate)) { roomId = candidate; break; }
    }
    if (!roomId) {
      fail(res, 500, '房间码生成失败，请重试');
      return;
    }

    const room = createRoom(roomId, name.trim());
    joinRoom(userId, roomId, true);
    setControllerId(roomId, userId);

    success(res, {
      roomId: room.id,
      roomName: room.name,
      inviteUrl: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/room/${roomId}/lobby`,
    });
  },

  /**
   * POST /api/rooms/:roomId/join
   * 加入房间（幂等）
   */
  async join(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const userId = req.userId!;

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    joinRoom(userId, roomId, false);

    // 仅返回 roomId 供前端跳转，播放状态由 WS ROOM_STATE 下发，无需在此返回
    success(res, { roomId });
  },

  /**
   * GET /api/rooms/:roomId
   * 获取房间信息（含成员列表）
   *
   * rooms.video_url 存的是 objectKey，不是可播放 URL。
   * 此处以 activeObjectKey 字段返回，语义明确。
   * 前端不得将此值直接用于 <video src>，播放 URL 必须由 WS ROOM_STATE 下发（含签名）。
   */
  async getInfo(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const members = getMembersByRoom(roomId);
    success(res, {
      roomId: room.id,
      roomName: room.name,
      activeObjectKey: room.video_url,  // objectKey，不是播放 URL
      controlMode: room.control_mode,
      controllerId: room.controller_id,
      // is_online 字段已废弃：在房间即在线，WS 断线时从列表移除，DB 不维护在线态
      members: members.map((m) => ({
        userId: m.user_id,
        nickname: m.nickname,
        isAdmin: m.is_admin === 1,
      })),
    });
  },

  /**
   * GET /api/rooms/my
   * 获取当前用户参与的所有房间
   */
  async getMyRooms(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const rooms = getRoomsByUser(userId);
    success(res, { rooms });
  },

  /**
   * GET /api/rooms/:roomId/videos
   * 获取房间内所有视频列表
   *
   * room_videos.video_url 存储的是 objectKey。
   * 此接口仅用于前端初始化视频列表（展示文件名、排序等），
   * 不在此处签名——播放 URL 在用户切换视频时由 WS SWITCH_VIDEO 广播实时签名下发。
   * 前端收到视频列表后，videoUrl 字段即为 objectKey，
   * 点击播放时发送 SWITCH_VIDEO 消息，后端签名后广播给所有成员。
   */
  async listVideos(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const videos = getVideosByRoom(roomId);
    success(res, {
      videos: videos.map((v) => ({
        id: v.id,
        objectKey: v.video_url,   // 语义明确：返回 objectKey，不是播放 URL
        fileName: v.file_name,
        uploaderId: v.uploader_id,
        createdAt: v.created_at,
      })),
    });
  },

  /**
   * GET /api/rooms/:roomId/tags?videoId=xxx
   * 获取房间内某视频的所有 Tag（按时间升序）
   */
  async listTags(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const { videoId } = req.query as Record<string, string>;

    if (!videoId) { fail(res, 400, '缺少 videoId 参数'); return; }

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const tags = getTagsByRoomVideo(roomId, videoId);
    success(res, {
      tags: tags.map((t) => ({
        id: t.id,
        roomId: t.room_id,
        videoId: t.video_id,
        time: t.time,
        label: t.label,
        createdBy: t.created_by,
        createdAt: t.created_at,
      })),
    });
  },

  /**
   * GET /api/rooms/:roomId/upload-url
   *
   * 根据用户白名单状态返回不同上传模式：
   *
   * - 本地开发模式（isOssEnabled() === false）：
   *     mode: 'local'，前端直传到后端本地
   *
   * - OSS 模式 + 白名单用户：
   *     mode: undefined（默认 OSS 直传）
   *     返回预签名 PUT URL，前端直接 PUT 到 OSS，无需经过后端
   *
   * - OSS 模式 + 非白名单用户：
   *     mode: 'proxy'
   *     返回后端代理上传接口地址，文件经后端中转写入 OSS
   *
   * 返回字段：
   *   - uploadUrl：上传目标地址
   *   - objectKey：视频的唯一标识（前端上传完成后须原样回传给 confirm 接口）
   *   - fileName：原始文件名
   */
  async getUploadUrl(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const userId = req.userId!;
    const { fileName, fileType } = req.query as Record<string, string>;

    if (!fileName || !fileType) { fail(res, 400, '缺少 fileName 或 fileType 参数'); return; }

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    if (isOssEnabled()) {
      try {
        const objectKey = `cowatch/${roomId}/${uuidv4()}-${fileName}`;

        if (isUploadWhitelisted(userId)) {
          // 白名单用户：COS 直传，返回预签名 PUT URL
          const uploadUrl = await getUploadUrl(objectKey, fileType);
          success(res, { uploadUrl, objectKey, fileName });
        } else {
          // 非白名单用户：后端中转，返回代理上传地址
          success(res, {
            uploadUrl: `/api/rooms/${roomId}/upload-proxy?objectKey=${encodeURIComponent(objectKey)}&fileType=${encodeURIComponent(fileType)}&fileName=${encodeURIComponent(fileName)}`,
            objectKey,
            fileName,
            mode: 'proxy',
          });
        }
      } catch (err) {
        console.error('[getUploadUrl/oss]', err);
        fail(res, 500, '获取上传地址失败');
      }
    } else {
      // 本地模式：objectKey 格式与 COS 保持一致，确保 SW 路径判断统一
      const objectKey = `cowatch/${roomId}/${uuidv4()}-${fileName}`;
      success(res, {
        uploadUrl: `/api/rooms/${roomId}/upload?objectKey=${encodeURIComponent(objectKey)}&fileName=${encodeURIComponent(fileName)}`,
        objectKey,
        fileName,
        mode: 'local',
      });
    }
  },

  /**
   * POST /api/rooms/:roomId/upload-proxy
   * 非白名单用户专用：后端接收文件流并代理上传到 COS
   *
   * 流程：
   *   1. uploadGuard 中间件已完成 Sec-Fetch 校验 + 每日流量预检
   *   2. 此处将 req 可读流直接 pipe 给 COS putStream，零临时文件
   *   3. 上传成功后，将实际写入字节数计入当日用量（addDailyBytes）
   *   4. 写入 room_videos（存 objectKey）并广播 VIDEO_ADDED（含实时签名的播放 URL）
   */
  async proxyUpload(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const userId = req.userId!;
    const { objectKey, fileType, fileName } = req.query as Record<string, string>;

    if (!objectKey || !fileType || !fileName) {
      fail(res, 400, '缺少 objectKey / fileType / fileName 参数');
      return;
    }

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    try {
      await proxyUploadToOss(objectKey, req, fileType);

      const realBytes = parseInt(req.headers['content-length'] ?? '0', 10);
      if (realBytes > 0) addDailyBytes(userId, realBytes);

      // 存 objectKey 到 room_videos
      // 注意：不调用 setVideoUrl——上传完成不代表用户激活该视频，
      // 激活由用户点击播放触发 SWITCH_VIDEO WS 消息后后端更新。
      const videoId = uuidv4();
      const video = addRoomVideo(videoId, roomId, objectKey, fileName, userId);

      // 广播时实时签名（有效期 30 分钟，从上传完成时刻起算）
      const signedUrl = await getSignedUrl(objectKey);
      broadcast(roomId, {
        type: 'VIDEO_ADDED',
        data: {
          id: video.id,
          objectKey,
          videoUrl: signedUrl,
          fileName: video.file_name,
          uploaderId: video.uploader_id,
          createdAt: video.created_at,
        },
      });

      console.log(`[proxyUpload] userId=${userId} roomId=${roomId} bytes=${realBytes} objectKey=${objectKey}`);
      success(res, { objectKey });
    } catch (err) {
      console.error('[proxyUpload]', err);
      fail(res, 500, '代理上传失败');
    }
  },

  /**
   * PUT /api/rooms/:roomId/upload
   * 本地模式专用：接收前端直传的视频文件，写入 uploads/{objectKey}
   *
   * objectKey 格式：cowatch/{roomId}/{uuid}-{fileName}（与 COS 模式对齐）
   * 本地访问路径：/uploads/{objectKey}
   */
  uploadLocal(req: Request, res: Response): void {
    const { roomId } = req.params;
    const userId = req.userId!;

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const objectKey = (req.query.objectKey as string) || `cowatch/${roomId}/${uuidv4()}.mp4`;
    const rawName = (req.query.fileName as string) || 'video.mp4';

    // 本地存储路径与 objectKey 对齐：uploads/cowatch/{roomId}/{uuid}-{fileName}
    const filePath = path.join(uploadsDir, objectKey);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      const videoId = uuidv4();
      // 存 objectKey 到 room_videos（与 COS 模式一致）
      // 注意：不调用 setVideoUrl——上传完成不代表用户激活该视频。
      const video = addRoomVideo(videoId, roomId, objectKey, rawName, userId);

      const localPlayUrl = toLocalPlayUrl(objectKey);

      broadcast(roomId, {
        type: 'VIDEO_ADDED',
        data: {
          id: video.id,
          objectKey,
          videoUrl: localPlayUrl,
          fileName: video.file_name,
          uploaderId: video.uploader_id,
          createdAt: video.created_at,
        },
      });
      success(res, { objectKey });
    });

    writeStream.on('error', (err) => {
      console.error('[uploadLocal]', err);
      fail(res, 500, '文件保存失败');
    });
  },

  /**
   * PUT /api/rooms/:roomId/video
   * 白名单用户 COS 直传完成后调用此接口确认。
   *
   * body.objectKey：前端从 getUploadUrl 拿到的 objectKey，原样回传
   * 后端将 objectKey 存入 room_videos，并广播带实时签名的 VIDEO_ADDED。
   */
  async setVideo(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const userId = req.userId!;
    const { objectKey, fileName } = req.body as { objectKey?: string; fileName?: string };

    if (!objectKey || typeof objectKey !== 'string') { fail(res, 400, '缺少 objectKey'); return; }

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const videoId = uuidv4();
    const resolvedFileName = fileName || objectKey.split('/').pop() || 'video.mp4';
    // 注意：不调用 setVideoUrl——上传完成不代表用户激活该视频。
    const video = addRoomVideo(videoId, roomId, objectKey, resolvedFileName, userId);

    // 广播时实时签名（有效期 30 分钟，从确认时刻起算）
    const signedUrl = await getSignedUrl(objectKey);
    broadcast(roomId, {
      type: 'VIDEO_ADDED',
      data: {
        id: video.id,
        objectKey,
        videoUrl: signedUrl,
        fileName: video.file_name,
        uploaderId: video.uploader_id,
        createdAt: video.created_at,
      },
    });
    success(res, { objectKey });
  },
};
