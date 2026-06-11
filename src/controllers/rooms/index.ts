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
import { isOssEnabled, proxyUploadToOss } from '../../services/ossService.js';
import { addDailyBytes } from '../../middleware/uploadGuard.js';
import { transcodeToHls, generateM3u8 } from '../../services/hlsService.js';
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

    success(res, { roomId });
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
      activeObjectKey: room.video_url,
      controlMode: room.control_mode,
      controllerId: room.controller_id,
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
   */
  async listVideos(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const videos = getVideosByRoom(roomId);
    success(res, {
      videos: videos.map((v) => ({
        id: v.id,
        objectKey: v.video_url,
        fileName: v.file_name,
        uploaderId: v.uploader_id,
        createdAt: v.created_at,
        hlsStatus: v.hls_status,
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
   * 废弃白名单直传分支，所有 OSS 模式统一返回 mode: 'proxy'。
   *
   * - 本地开发模式（isOssEnabled() === false）：
   *     mode: 'local'，前端直传到后端本地
   *
   * - OSS 模式（无论是否白名单）：
   *     mode: 'proxy'，文件经后端中转写入 OSS，后端负责切片
   */
  async getUploadUrl(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const { fileName, fileType } = req.query as Record<string, string>;

    if (!fileName || !fileType) { fail(res, 400, '缺少 fileName 或 fileType 参数'); return; }

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    if (isOssEnabled()) {
      const objectKey = `cowatch/${roomId}/${uuidv4()}-${fileName}`;
      success(res, {
        uploadUrl: `/api/rooms/${roomId}/upload-proxy?objectKey=${encodeURIComponent(objectKey)}&fileType=${encodeURIComponent(fileType)}&fileName=${encodeURIComponent(fileName)}`,
        objectKey,
        fileName,
        mode: 'proxy',
      });
    } else {
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
   * 后端接收文件流并代理上传到 COS，完成后异步触发 HLS 切片。
   *
   * 流程：
   *   1. uploadGuard 中间件已完成 Sec-Fetch 校验 + 每日流量预检
   *   2. 此处将 req 可读流直接 pipe 给 COS putStream，零临时文件
   *   3. 上传成功后，将实际写入字节数计入当日用量
   *   4. 写入 room_videos（hls_status: 'pending'），立即返回 200
   *   5. 异步执行 ffmpeg 切片，切片完成后广播 VIDEO_ADDED（含 m3u8ObjectKey）
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

      // 写入 room_videos（hls_status 默认为 'pending'）
      const videoId = uuidv4();
      const video = addRoomVideo(videoId, roomId, objectKey, fileName, userId);

      // 立即响应前端，切片在后台异步进行
      success(res, { objectKey, videoId: video.id });

      // 切片目录前缀：cowatch/{roomId}/{videoId}/
      const hlsPrefix = `cowatch/${roomId}/${videoId}/`;

      console.log(`[proxyUpload] 开始异步切片：videoId=${videoId} objectKey=${objectKey}`);

      // 异步切片，切片完成后广播 VIDEO_ADDED
      void transcodeToHls(
        videoId,
        objectKey,
        hlsPrefix,
        () => {
          // 切片成功：广播 VIDEO_ADDED，videoUrl 为 m3u8 API 路径
          broadcast(roomId, {
            type: 'VIDEO_ADDED',
            data: {
              id: video.id,
              objectKey,
              m3u8ObjectKey: hlsPrefix,
              videoUrl: `/api/rooms/${roomId}/videos/${videoId}/m3u8`,
              fileName: video.file_name,
              uploaderId: video.uploader_id,
              createdAt: video.created_at,
            },
          });
          console.log(`[proxyUpload] 切片完成，已广播 VIDEO_ADDED：videoId=${videoId}`);
        },
        (err) => {
          console.error(`[proxyUpload] 切片失败：videoId=${videoId}`, err.message);
          // 切片失败：广播错误通知（可选），让前端提示用户
          broadcast(roomId, {
            type: 'VIDEO_SLICE_ERROR',
            data: {
              videoId: video.id,
              fileName: video.file_name,
              message: '视频切片处理失败，请重新上传',
            },
          });
        },
      );
    } catch (err) {
      console.error('[proxyUpload]', err);
      fail(res, 500, '代理上传失败');
    }
  },

  /**
   * PUT /api/rooms/:roomId/upload
   * 本地模式专用：接收前端直传的视频文件，写入 uploads/{objectKey}，
   * 完成后异步触发 HLS 切片。
   */
  uploadLocal(req: Request, res: Response): void {
    const { roomId } = req.params;
    const userId = req.userId!;

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const objectKey = (req.query.objectKey as string) || `cowatch/${roomId}/${uuidv4()}.mp4`;
    const rawName = (req.query.fileName as string) || 'video.mp4';

    const filePath = path.join(uploadsDir, objectKey);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      const videoId = uuidv4();
      const video = addRoomVideo(videoId, roomId, objectKey, rawName, userId);

      // 立即响应前端
      success(res, { objectKey, videoId: video.id });

      const hlsPrefix = `cowatch/${roomId}/${videoId}/`;

      console.log(`[uploadLocal] 开始异步切片：videoId=${videoId} objectKey=${objectKey}`);

      void transcodeToHls(
        videoId,
        objectKey,
        hlsPrefix,
        () => {
          broadcast(roomId, {
            type: 'VIDEO_ADDED',
            data: {
              id: video.id,
              objectKey,
              m3u8ObjectKey: hlsPrefix,
              videoUrl: `/api/rooms/${roomId}/videos/${videoId}/m3u8`,
              fileName: video.file_name,
              uploaderId: video.uploader_id,
              createdAt: video.created_at,
            },
          });
          console.log(`[uploadLocal] 切片完成，已广播 VIDEO_ADDED：videoId=${videoId}`);
        },
        (err) => {
          console.error(`[uploadLocal] 切片失败：videoId=${videoId}`, err.message);
          broadcast(roomId, {
            type: 'VIDEO_SLICE_ERROR',
            data: {
              videoId: video.id,
              fileName: video.file_name,
              message: '视频切片处理失败，请重新上传',
            },
          });
        },
        uploadsDir,
      );
    });

    writeStream.on('error', (err) => {
      console.error('[uploadLocal]', err);
      fail(res, 500, '文件保存失败');
    });
  },

  /**
   * GET /api/rooms/:roomId/videos/:videoId/m3u8
   * 动态生成带签名 URL 的 m3u8 内容并返回。
   *
   * 每次请求实时生成，片段签名有效期 2 小时。
   * 跨天复盘场景：前端重新请求此接口即可刷新签名，SW 缓存的 .ts 片段不受影响。
   */
  async getVideoM3u8(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;

    try {
      const m3u8Content = await generateM3u8(videoId, uploadsDir);
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.send(m3u8Content);
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === '404') {
        fail(res, 404, error.message);
      } else if (error.code === '425') {
        fail(res, 425, error.message);
      } else {
        console.error('[getVideoM3u8]', err);
        fail(res, 500, '生成 m3u8 失败');
      }
    }
  },
};
