import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRoom, getRoomById, setVideoUrl, setControllerId } from '../../database/room/index.js';
import { joinRoom, getMembersByRoom, getRoomsByUser } from '../../database/roomMember/index.js';
import { addRoomVideo, getVideosByRoom } from '../../database/roomVideo/index.js';
import { getTagsByRoomVideo } from '../../database/tag/index.js';
import { generateRoomId } from '../../utils/roomId.js';
import { isOssEnabled, getUploadUrl, getVideoUrl, proxyUploadToOss } from '../../services/ossService.js';
import { isUploadWhitelisted } from '../../database/user/index.js';
import { addDailyBytes } from '../../middleware/uploadGuard.js';
import { success, fail } from '../../utils/response.js';
import { broadcast } from '../ws/registry.js';

// ─── 本地存储配置（仅 isOssEnabled() === false 时使用）────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../../../uploads');

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

    success(res, {
      roomId,
      videoUrl: room.video_url,
      isAdmin: false,
    });
  },

  /**
   * GET /api/rooms/:roomId
   * 获取房间信息（含成员列表）
   */
  async getInfo(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const members = getMembersByRoom(roomId);
    success(res, {
      roomId: room.id,
      roomName: room.name,
      videoUrl: room.video_url,
      controlMode: room.control_mode,
      controllerId: room.controller_id,
      members: members.map((m) => ({
        userId: m.user_id,
        nickname: m.nickname,
        isAdmin: m.is_admin === 1,
        isOnline: m.is_online === 1,
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
   */
  async listVideos(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const videos = getVideosByRoom(roomId);
    success(res, {
      videos: videos.map((v) => ({
        id: v.id,
        videoUrl: v.video_url,
        fileName: v.file_name,
        uploaderId: v.uploader_id,
        createdAt: v.created_at,
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
   *     uploadGuard 中间件仅挂载在 proxy 路由上，用于限制每日中转流量
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
          // 白名单用户：COS 直传，返回预签名 URL
          const uploadUrl = await getUploadUrl(objectKey, fileType);
          const videoUrl = getVideoUrl(objectKey);
          success(res, { uploadUrl, videoUrl, fileName });
        } else {
          // 非白名单用户：后端中转，返回代理上传地址
          // objectKey 编码后作为 query 参数传递，避免路径解析冲突
          const videoUrl = getVideoUrl(objectKey);
          success(res, {
            uploadUrl: `/api/rooms/${roomId}/upload-proxy?objectKey=${encodeURIComponent(objectKey)}&fileType=${encodeURIComponent(fileType)}&fileName=${encodeURIComponent(fileName)}`,
            videoUrl,
            fileName,
            mode: 'proxy',
          });
        }
      } catch (err) {
        console.error('[getUploadUrl/oss]', err);
        fail(res, 500, '获取上传地址失败');
      }
    } else {
      const videoId = uuidv4();
      success(res, {
        uploadUrl: `/api/rooms/${roomId}/upload?userId=${userId}&videoId=${videoId}&fileName=${encodeURIComponent(fileName)}`,
        videoUrl: '',
        fileName,
        mode: 'local',
      });
    }
  },

  /**
   * POST /api/rooms/:roomId/upload-proxy
   * 非白名单用户专用：后端接收文件流并代理上传到 OSS
   *
   * 流程：
   *   1. uploadGuard 中间件已完成 Sec-Fetch 校验 + 每日流量预检
   *   2. 此处将 req 可读流直接 pipe 给 OSS putStream，零临时文件
   *   3. 上传成功后，将实际写入字节数计入当日用量（addDailyBytes）
   *   4. 写入 room_videos 并广播 VIDEO_ADDED
   *
   * 注意：objectKey / fileType / fileName / videoUrl 均通过 getUploadUrl 下发的 URL query 携带，
   * 前端 PUT 时带上这些参数即可，无需额外传 body。
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
      // 流式代理到 OSS，req 本身就是 Readable
      const videoUrl = await proxyUploadToOss(objectKey, req, fileType);

      // 真实上传完成后，计入当日流量（Content-Length 可被伪造，但已完成上传的字节数是真实的）
      const realBytes = parseInt(req.headers['content-length'] ?? '0', 10);
      if (realBytes > 0) addDailyBytes(userId, realBytes);

      // 写入 room_videos 并广播
      const videoId = uuidv4();
      const video = addRoomVideo(videoId, roomId, videoUrl, fileName, userId);
      setVideoUrl(roomId, videoUrl);

      broadcast(roomId, {
        type: 'VIDEO_ADDED',
        data: {
          id: video.id,
          videoUrl: video.video_url,
          fileName: video.file_name,
          uploaderId: video.uploader_id,
          createdAt: video.created_at,
        },
      });

      console.log(`[proxyUpload] userId=${userId} roomId=${roomId} bytes=${realBytes} objectKey=${objectKey}`);
      success(res, { videoUrl });
    } catch (err) {
      console.error('[proxyUpload]', err);
      fail(res, 500, '代理上传失败');
    }
  },

  /**
   * PUT /api/rooms/:roomId/upload
   * 本地模式专用：接收前端直传的视频文件，raw body 写入本地，并追加到 room_videos
   */
  uploadLocal(req: Request, res: Response): void {
    const { roomId } = req.params;
    const userId = req.userId!;

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const dest = path.join(uploadsDir, roomId);
    fs.mkdirSync(dest, { recursive: true });

    const rawName = (req.query.fileName as string) || 'video.mp4';
    const videoId = (req.query.videoId as string) || uuidv4();
    const ext = path.extname(rawName) || '.mp4';
    const savedName = `${videoId}${ext}`;
    const filePath = path.join(dest, savedName);

    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      const videoUrl = `/uploads/${roomId}/${savedName}`;

      // 写入 room_videos 表（每次上传追加一条）
      const video = addRoomVideo(videoId, roomId, videoUrl, rawName, userId);

      // rooms.video_url 同步更新为最新上传的视频（方便 ROOM_STATE 推送）
      setVideoUrl(roomId, videoUrl);

      broadcast(roomId, {
        type: 'VIDEO_ADDED',
        data: {
          id: video.id,
          videoUrl: video.video_url,
          fileName: video.file_name,
          uploaderId: video.uploader_id,
          createdAt: video.created_at,
        },
      });
      success(res, { videoUrl });
    });

    writeStream.on('error', (err) => {
      console.error('[uploadLocal]', err);
      fail(res, 500, '文件保存失败');
    });
  },

  /**
   * PUT /api/rooms/:roomId/video
   * 确认视频上传完成（OSS 模式）：追加到 room_videos，并广播 VIDEO_ADDED
   */
  async setVideo(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const userId = req.userId!;
    const { videoUrl, fileName } = req.body as { videoUrl?: string; fileName?: string };

    if (!videoUrl || typeof videoUrl !== 'string') { fail(res, 400, '缺少 videoUrl'); return; }

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const videoId = uuidv4();
    const resolvedFileName = fileName || videoUrl.split('/').pop() || 'video.mp4';
    const video = addRoomVideo(videoId, roomId, videoUrl, resolvedFileName, userId);

    setVideoUrl(roomId, videoUrl);

    broadcast(roomId, {
      type: 'VIDEO_ADDED',
      data: {
        id: video.id,
        videoUrl: video.video_url,
        fileName: video.file_name,
        uploaderId: video.uploader_id,
        createdAt: video.created_at,
      },
    });
    success(res, { success: true });
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
};
