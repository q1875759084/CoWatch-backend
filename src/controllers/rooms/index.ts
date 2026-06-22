import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRoom, getRoomById, setControllerId } from '../../database/room/index.js';
import { joinRoom, getMembersByRoom, getRoomsByUser } from '../../database/roomMember/index.js';
import { addRoomVideo, getVideosByRoom, getRoomVideoById, updateDisplayName, deleteRoomVideo } from '../../database/roomVideo/index.js';
import { insertSegmentViewBatch, type SegmentViewInput } from '../../database/segmentView/index.js';
import { getTagsByRoomVideo, deleteTagsByVideo } from '../../database/tag/index.js';
import { getLabelsByVideo, setLabelsForVideo, deleteLabelsByVideo } from '../../database/videoLabel/index.js';
import { generateRoomId } from '../../utils/roomId.js';
import { isOnlineMode, DEFAULT_AVATAR_URL } from '../../services/ossService.js';
import { addDailyBytes } from '../../middleware/uploadGuard.js';
import { transcodeToHls, generateM3u8 } from '../../services/hlsService.js';
import { success, fail } from '../../utils/response.js';
import { broadcast } from '../ws/registry.js';

// ─── 本地存储配置（仅 isOnlineMode() === false 时使用）────────────────────────
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
      if (!await getRoomById(candidate)) { roomId = candidate; break; }
    }
    if (!roomId) {
      fail(res, 500, '房间码生成失败，请重试');
      return;
    }

    const room = await createRoom(roomId, name.trim());
    await joinRoom(userId, roomId, true);
    await setControllerId(roomId, userId);

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

    const room = await getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    await joinRoom(userId, roomId, false);

    success(res, { roomId });
  },

  /**
   * GET /api/rooms/:roomId
   * 获取房间信息（含成员列表）
   */
  async getInfo(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const room = await getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const members = await getMembersByRoom(roomId);
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
    const rows = await getRoomsByUser(userId);
    const rooms = rows.map((r) => ({
      room_id: r.id,
      room_name: r.name,
      video_url: r.video_url,
      is_admin: r.is_admin,
      joined_at: r.joined_at,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
    success(res, { rooms });
  },

  /**
   * GET /api/rooms/:roomId/videos
   * 获取房间内所有视频列表
   */
  async listVideos(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const room = await getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const videos = await getVideosByRoom(roomId);
    const videosWithLabels = await Promise.all(videos.map(async (v) => ({
      id: v.id,
      objectKey: v.video_url,
      fileName: v.file_name,
      displayName: v.display_name ?? null,
      uploaderId: v.uploader_id,
      createdAt: v.created_at,
      hlsStatus: v.hls_status,
      labels: await getLabelsByVideo(v.id),
    })));
    success(res, { videos: videosWithLabels });
  },

  /**
   * GET /api/rooms/:roomId/tags?videoId=xxx
   * 获取房间内某视频的所有 Tag（按时间升序）
   */
  async listTags(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const { videoId } = req.query as Record<string, string>;

    if (!videoId) { fail(res, 400, '缺少 videoId 参数'); return; }

    const room = await getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const tags = await getTagsByRoomVideo(roomId, videoId);
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

    const video = await getRoomVideoById(videoId);
    if (!video || video.room_id !== roomId) {
      fail(res, 404, '视频不存在');
      return;
    }

    const isUploader = video.uploader_id === userId;
    if (!isUploader && !req.isAdmin) {
      fail(res, 403, '仅上传者或管理员可修改视频名称');
      return;
    }

    const trimmed = displayName.trim();
    await updateDisplayName(videoId, trimmed);

    broadcast(roomId, {
      type: 'VIDEO_RENAMED',
      data: { videoId, displayName: trimmed },
    });

    success(res, { videoId, displayName: trimmed });
  },

  /**
   * DELETE /api/rooms/:roomId/videos/:videoId
   * 删除视频及其所有 tags 和 labels（流量记录不删除，保留供统计）
   */
  async deleteVideo(req: Request, res: Response): Promise<void> {
    const { roomId, videoId } = req.params;
    const userId = req.userId!;

    const video = await getRoomVideoById(videoId);
    if (!video || video.room_id !== roomId) {
      fail(res, 404, '视频不存在');
      return;
    }

    const isUploader = video.uploader_id === userId;
    if (!isUploader && !req.isAdmin) {
      fail(res, 403, '仅上传者或管理员可删除视频');
      return;
    }

    // 级联删除该视频的所有 tags 和 labels（流量记录保留）
    await deleteTagsByVideo(videoId);
    await deleteLabelsByVideo(videoId);
    await deleteRoomVideo(videoId);

    broadcast(roomId, {
      type: 'VIDEO_DELETED',
      data: { videoId },
    });

    success(res, { videoId });
  },

  /**
   * PUT /api/rooms/:roomId/videos/:videoId/labels
   * 整体替换视频的 label 列表。
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

    const video = await getRoomVideoById(videoId);
    if (!video || video.room_id !== roomId) {
      fail(res, 404, '视频不存在');
      return;
    }

    const isUploader = video.uploader_id === userId;
    if (!isUploader && !req.isAdmin) {
      fail(res, 403, '仅上传者或管理员可修改 label');
      return;
    }

    const trimmed = (labels as string[]).map((l) => l.trim());
    await setLabelsForVideo(videoId, trimmed);

    broadcast(roomId, {
      type: 'VIDEO_LABELS_UPDATED',
      data: { videoId, labels: trimmed },
    });

    success(res, { videoId, labels: trimmed });
  },

  /**
   * GET /api/rooms/:roomId/upload-url
   */
  async getUploadUrl(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const { fileName, fileType } = req.query as Record<string, string>;

    if (!fileName || !fileType) { fail(res, 400, '缺少 fileName 或 fileType 参数'); return; }

    const room = await getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    if (isOnlineMode()) {
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
   */
  proxyUpload(req: Request, res: Response): void {
    const { roomId } = req.params;
    const userId = req.userId!;
    const { objectKey, fileType, fileName } = req.query as Record<string, string>;

    if (!objectKey || !fileType || !fileName) {
      fail(res, 400, '缺少 objectKey / fileType / fileName 参数');
      return;
    }

    void (async () => {
      const room = await getRoomById(roomId);
      if (!room) { fail(res, 404, '房间不存在'); return; }

      const tmpFile = path.join(os.tmpdir(), `cowatch-${uuidv4()}.mp4`);
      const writeStream = fs.createWriteStream(tmpFile);
      req.pipe(writeStream);

      writeStream.on('finish', () => {
        const realBytes = parseInt(req.headers['content-length'] ?? '0', 10);
        if (realBytes > 0) addDailyBytes(roomId, realBytes);

        void (async () => {
          const videoId = uuidv4();
          const video = await addRoomVideo(videoId, roomId, objectKey, fileName, userId);

          success(res, { objectKey, videoId: video.id });

          const hlsPrefix = `cowatch/${roomId}/${videoId}/`;
          console.log(`[proxyUpload] 开始异步切片：videoId=${videoId} tmpFile=${tmpFile}`);

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
            undefined,
            true,
          );
        })();
      });

      writeStream.on('error', (err) => {
        console.error('[proxyUpload] 写临时文件失败', err);
        fail(res, 500, '文件接收失败');
      });
    })();
  },

  /**
   * PUT /api/rooms/:roomId/upload
   * 本地模式专用：接收前端直传的视频文件，写入 uploads/{objectKey}。
   */
  uploadLocal(req: Request, res: Response): void {
    const { roomId } = req.params;
    const userId = req.userId!;

    void (async () => {
      const room = await getRoomById(roomId);
      if (!room) { fail(res, 404, '房间不存在'); return; }

      const objectKey = (req.query.objectKey as string) || `cowatch/${roomId}/${uuidv4()}.mp4`;
      const rawName = (req.query.fileName as string) || 'video.mp4';

      const filePath = path.join(uploadsDir, objectKey);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const writeStream = fs.createWriteStream(filePath);
      req.pipe(writeStream);

      writeStream.on('finish', () => {
        void (async () => {
          const videoId = uuidv4();
          const video = await addRoomVideo(videoId, roomId, objectKey, rawName, userId);

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
        })();
      });

      writeStream.on('error', (err) => {
        console.error('[uploadLocal]', err);
        fail(res, 500, '文件保存失败');
      });
    })();
  },

  /**
   * POST /api/rooms/segment-view
   * 批量上报 HLS 片段的真实 CDN 下载记录（缓存未命中触发）。
   */
  async reportSegmentView(req: Request, res: Response): Promise<void> {
    const { items } = req.body as { items?: unknown[] };

    if (!Array.isArray(items) || items.length === 0) {
      fail(res, 400, 'items 必须为非空数组');
      return;
    }

    const validItems: SegmentViewInput[] = [];
    for (const item of items.slice(0, 50)) {
      const { roomId, videoId, segmentName, userId = 'anonymous', bytes = 0 } =
        item as Record<string, unknown>;
      if (
        typeof roomId === 'string' && roomId &&
        typeof videoId === 'string' && videoId &&
        typeof segmentName === 'string' && segmentName
      ) {
        validItems.push({
          roomId,
          videoId,
          segmentName,
          userId: typeof userId === 'string' ? userId : 'anonymous',
          bytes: Number(bytes) || 0,
        });
      }
    }

    try {
      await insertSegmentViewBatch(validItems);
      success(res, null);
    } catch (err) {
      console.error('[reportSegmentView] 批量写入失败', err);
      success(res, null);
    }
  },

  /**
   * GET /api/rooms/:roomId/videos/:videoId/m3u8
   * 动态生成带签名 URL 的 m3u8 内容并返回。
   */
  async getVideoM3u8(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const userId = req.userId ?? '0';

    try {
      const m3u8Content = await generateM3u8(videoId, uploadsDir, userId);
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
