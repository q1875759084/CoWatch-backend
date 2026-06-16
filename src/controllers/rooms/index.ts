import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRoom, getRoomById, setControllerId } from '../../database/room/index.js';
import { joinRoom, getMembersByRoom, getRoomsByUser } from '../../database/roomMember/index.js';
import { addRoomVideo, getVideosByRoom, getRoomVideoById, updateDisplayName, deleteRoomVideo } from '../../database/roomVideo/index.js';
import { getTagsByRoomVideo, deleteTagsByVideo } from '../../database/tag/index.js';
import { getLabelsByVideo, setLabelsForVideo, deleteLabelsByVideo } from '../../database/videoLabel/index.js';
import { generateRoomId } from '../../utils/roomId.js';
import { isOssEnabled, DEFAULT_AVATAR_URL } from '../../services/ossService.js';
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
      // 在线状态不由 HTTP 返回，由 WS ROOM_STATE 负责。前端初始化时视所有成员为不在线。
      members: members.map((m) => ({
        userId: m.user_id,
        nickname: m.nickname,
        isAdmin: m.is_admin === 1,
        avatarUrl: m.avatar_url ?? DEFAULT_AVATAR_URL,
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
        displayName: v.display_name ?? null,
        uploaderId: v.uploader_id,
        createdAt: v.created_at,
        hlsStatus: v.hls_status,
        labels: getLabelsByVideo(v.id),
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
   * PATCH /api/rooms/:roomId/videos/:videoId/name
   * 更新视频的自定义展示名称。
   * 权限：房间成员 + （上传者 或 管理员）
   */
  async renameVideo(req: Request, res: Response): Promise<void> {
    const { roomId, videoId } = req.params;
    const { displayName } = req.body as { displayName?: string };
    const userId = req.userId!;

    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      fail(res, 400, 'displayName 不能为空');
      return;
    }
    if (displayName.trim().length > 50) {
      fail(res, 400, 'displayName 最多 50 个字符');
      return;
    }

    const video = getRoomVideoById(videoId);
    if (!video || video.room_id !== roomId) {
      fail(res, 404, '视频不存在');
      return;
    }

    // 权限校验：上传者 或 管理员（isAdmin 由 roomAuthMiddleware 挂载）
    const isUploader = video.uploader_id === userId;
    if (!isUploader && !req.isAdmin) {
      fail(res, 403, '仅上传者或管理员可修改视频名称');
      return;
    }

    const trimmed = displayName.trim();
    updateDisplayName(videoId, trimmed);

    // 广播给房间全员
    broadcast(roomId, {
      type: 'VIDEO_RENAMED',
      data: { videoId, displayName: trimmed },
    });

    success(res, { videoId, displayName: trimmed });
  },

  /**
   * DELETE /api/rooms/:roomId/videos/:videoId
   * 删除视频及其所有 tags。
   * 权限：房间成员 + （上传者 或 管理员）
   */
  async deleteVideo(req: Request, res: Response): Promise<void> {
    const { roomId, videoId } = req.params;
    const userId = req.userId!;

    const video = getRoomVideoById(videoId);
    if (!video || video.room_id !== roomId) {
      fail(res, 404, '视频不存在');
      return;
    }

    // 权限校验：上传者 或 管理员（isAdmin 由 roomAuthMiddleware 挂载）
    const isUploader = video.uploader_id === userId;
    if (!isUploader && !req.isAdmin) {
      fail(res, 403, '仅上传者或管理员可删除视频');
      return;
    }

    // 级联删除该视频的所有 tags 和 labels
    deleteTagsByVideo(videoId);
    deleteLabelsByVideo(videoId);
    // 删除视频记录
    deleteRoomVideo(videoId);

    // 广播给房间全员
    broadcast(roomId, {
      type: 'VIDEO_DELETED',
      data: { videoId },
    });

    success(res, { videoId });
  },

  /**
   * PUT /api/rooms/:roomId/videos/:videoId/labels
   * 整体替换视频的 label 列表。
   * 权限：房间成员 + （上传者 或 管理员）
   */
  async updateVideoLabels(req: Request, res: Response): Promise<void> {
    const { roomId, videoId } = req.params;
    const { labels } = req.body as { labels?: unknown };
    const userId = req.userId!;

    if (!Array.isArray(labels)) {
      fail(res, 400, 'labels 必须为数组');
      return;
    }
    if (labels.length > 3) {
      fail(res, 400, 'label 最多 3 个');
      return;
    }
    for (const l of labels) {
      if (typeof l !== 'string' || l.trim().length === 0 || l.trim().length > 8) {
        fail(res, 400, '每个 label 为 1~8 个字');
        return;
      }
    }

    const video = getRoomVideoById(videoId);
    if (!video || video.room_id !== roomId) {
      fail(res, 404, '视频不存在');
      return;
    }

    // 权限校验：上传者 或 管理员
    const isUploader = video.uploader_id === userId;
    if (!isUploader && !req.isAdmin) {
      fail(res, 403, '仅上传者或管理员可修改 label');
      return;
    }

    const trimmed = (labels as string[]).map((l) => l.trim());
    setLabelsForVideo(videoId, trimmed);

    // 广播给房间全员
    broadcast(roomId, {
      type: 'VIDEO_LABELS_UPDATED',
      data: { videoId, labels: trimmed },
    });

    success(res, { videoId, labels: trimmed });
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
   * 后端接收文件流，先落盘临时目录，立即响应前端，然后异步切片并上传到 COS。
   *
   * 流程：
   *   1. uploadGuard 中间件已完成 Sec-Fetch 校验 + 每日流量预检
   *   2. 将 req 流 pipe 到 /tmp/cowatch-{uuid}.mp4（临时文件）
   *   3. 写完后立即写入 DB 并响应前端 200（进度条立刻跳 100%，进入"切片中"状态）
   *   4. 后台异步：ffmpeg 读本地临时文件切片 → 上传 .ts 到 COS → 删临时文件
   *   5. 切片完成后广播 VIDEO_ADDED
   *
   * 与旧方案的区别：
   *   旧：req → COS（阻塞等待 COS 写完）→ 响应前端 → ffmpeg 从 CDN URL 下载（容器内 DNS 失败）
   *   新：req → 临时文件（本地 I/O）→ 立即响应前端 → ffmpeg 读临时文件（无网络依赖）→ 上传 .ts
   */
  proxyUpload(req: Request, res: Response): void {
    const { roomId } = req.params;
    const userId = req.userId!;
    const { objectKey, fileType, fileName } = req.query as Record<string, string>;

    if (!objectKey || !fileType || !fileName) {
      fail(res, 400, '缺少 objectKey / fileType / fileName 参数');
      return;
    }

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    // 临时文件路径：/tmp/cowatch-{uuid}.mp4
    const tmpFile = path.join(os.tmpdir(), `cowatch-${uuidv4()}.mp4`);
    const writeStream = fs.createWriteStream(tmpFile);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      const realBytes = parseInt(req.headers['content-length'] ?? '0', 10);
      if (realBytes > 0) addDailyBytes(userId, realBytes);

      // 写入 room_videos（hls_status 默认为 'pending'）
      const videoId = uuidv4();
      const video = addRoomVideo(videoId, roomId, objectKey, fileName, userId);

      // 立即响应前端，切片在后台异步进行
      success(res, { objectKey, videoId: video.id });

      const hlsPrefix = `cowatch/${roomId}/${videoId}/`;
      console.log(`[proxyUpload] 开始异步切片：videoId=${videoId} tmpFile=${tmpFile}`);

      // 异步切片：ffmpeg 读本地临时文件，无需从 COS/CDN 下载
      void transcodeToHls(
        videoId,
        tmpFile,
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
          console.log(`[proxyUpload] 切片完成，已广播 VIDEO_ADDED：videoId=${videoId}`);
        },
        (err) => {
          console.error(`[proxyUpload] 切片失败：videoId=${videoId}`, err.message);
          broadcast(roomId, {
            type: 'VIDEO_SLICE_ERROR',
            data: {
              videoId: video.id,
              fileName: video.file_name,
              message: '视频切片处理失败，请重新上传',
            },
          });
        },
        undefined, // uploadsDir：COS 模式不需要
        true,      // isTmpFile：切片完成后删除此临时文件
      );
    });

    writeStream.on('error', (err) => {
      console.error('[proxyUpload] 写临时文件失败', err);
      fail(res, 500, '文件接收失败');
    });
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
