import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRoom, getRoomById, setControllerId, type RoomPlanLevel } from '../../database/room/index.js';
import { addRoomSubscription } from '../../database/roomSubscription/index.js';
import { getActivePlans } from '../../database/subscription/index.js';
import { PLAN_HIERARCHY } from '../../middleware/planGuard.js';
import { joinRoom, getMembersByRoom, getRoomsByUser } from '../../database/roomMember/index.js';
import { addRoomVideo, getVideosByRoom, getRoomVideoById, updateDisplayName, deleteRoomVideo, updateHlsStatus } from '../../database/roomVideo/index.js';
import { insertSegmentViewBatch, type SegmentViewInput } from '../../database/segmentView/index.js';
import { getTagsByRoomVideo, deleteTagsByVideo } from '../../database/tag/index.js';
import { getLabelsByVideos, setLabelsForVideo, deleteLabelsByVideo } from '../../database/videoLabel/index.js';
import { generateRoomId } from '../../utils/roomId.js';
import { isOnlineMode, DEFAULT_AVATAR_URL, getHlsSegmentSignedUrl, uploadHlsSegment } from '../../services/ossService.js';
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

    // 根据用户当前最高会员等级决定房间初始 plan_level
    const userPlans = await getActivePlans(userId);
    const planLevel = deriveRoomPlanLevel(userPlans);

    const room = await createRoom(roomId, name.trim(), userId, planLevel);
    await joinRoom(userId, roomId, true);
    await setControllerId(roomId, userId);

    // 写入房间订阅记录（来源：用户会员等级）
    if (planLevel !== 'free') {
      await addRoomSubscription(roomId, planLevel, 'user_membership');
    }

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
      planLevel: room.plan_level,
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
      is_admin: r.is_admin === 1,
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
    const labelsMap = await getLabelsByVideos(videos.map((v) => v.id));
    const videosWithLabels = videos.map((v) => ({
      id: v.id,
      objectKey: v.video_url,
      fileName: v.file_name,
      displayName: v.display_name ?? null,
      uploaderId: v.uploader_id,
      createdAt: v.created_at,
      hlsStatus: v.hls_status,
      labels: labelsMap.get(v.id) ?? [],
    }));
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
          // pro 房间：前端直传原始视频，后端负责转码（libx264 CRF 30 veryfast）
          const needTranscode = room.plan_level === 'vip:pro';
          console.log(`[proxyUpload] 开始异步处理：videoId=${videoId} transcode=${needTranscode} tmpFile=${tmpFile}`);

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
              console.log(`[proxyUpload] 处理完成，已广播 VIDEO_ADDED：videoId=${videoId}`);
            },
            (err) => {
              console.error(`[proxyUpload] 处理失败：videoId=${videoId}`, err.message);
              broadcast(roomId, {
                type: 'VIDEO_SLICE_ERROR',
                data: {
                  videoId: video.id,
                  fileName: video.file_name,
                  message: '视频处理失败，请重新上传',
                },
              });
            },
            undefined,
            true,
            needTranscode,
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
          // pro 房间：前端直传原始视频，后端负责转码（libx264 CRF 30 veryfast）
          const needTranscode = room.plan_level === 'vip:pro';
          console.log(`[uploadLocal] 开始异步处理：videoId=${videoId} transcode=${needTranscode} objectKey=${objectKey}`);

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
              console.log(`[uploadLocal] 处理完成，已广播 VIDEO_ADDED：videoId=${videoId}`);
            },
            (err) => {
              console.error(`[uploadLocal] 处理失败：videoId=${videoId}`, err.message);
              broadcast(roomId, {
                type: 'VIDEO_SLICE_ERROR',
                data: {
                  videoId: video.id,
                  fileName: video.file_name,
                  message: '视频处理失败，请重新上传',
                },
              });
            },
            uploadsDir,
            false,
            needTranscode,
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
   * POST /api/rooms/:roomId/recording/segment
   *
   * Electron 实时录制专用：接收单个 HLS .ts 切片，存 COS 或本地磁盘。
   *
   * 请求体：原始二进制流（Content-Type: video/MP2T）
   * 请求头 X-Object-Key：目标 objectKey（由 Electron 生成）
   * 响应：{ objectKey }
   */
  recordingSegment(req: Request, res: Response): void {
    const { roomId } = req.params;
    const userId = req.userId!;
    const objectKey = req.headers['x-object-key'] as string | undefined;

    if (!objectKey || !objectKey.endsWith('.ts')) {
      fail(res, 400, '缺少合法的 X-Object-Key 请求头（需以 .ts 结尾）');
      return;
    }

    void (async () => {
      try {
        const room = await getRoomById(roomId);
        if (!room) { fail(res, 404, '房间不存在'); return; }

        if (isOnlineMode()) {
          // 线上模式：先落盘临时文件，再上传 COS
          const tmpPath = path.join(os.tmpdir(), `rec-seg-${uuidv4()}.ts`);
          const writeStream = fs.createWriteStream(tmpPath);
          req.pipe(writeStream);

          await new Promise<void>((resolve, reject) => {
            writeStream.on('finish', () => resolve());
            writeStream.on('error', (err) => reject(err));
          });

          try {
            await uploadHlsSegment(objectKey, tmpPath);
          } finally {
            fs.unlink(tmpPath, () => { /* 静默清理 */ });
          }

          console.log(`[recordingSegment] 切片已上传 COS：${objectKey} (userId=${userId})`);
        } else {
          // 本地模式：写入 uploads 目录
          const localPath = path.join(uploadsDir, objectKey);
          fs.mkdirSync(path.dirname(localPath), { recursive: true });
          const writeStream = fs.createWriteStream(localPath);
          req.pipe(writeStream);
          await new Promise<void>((resolve, reject) => {
            writeStream.on('finish', () => resolve());
            writeStream.on('error', (err) => reject(err));
          });
          console.log(`[recordingSegment] 切片已写入本地：${localPath} (userId=${userId})`);
        }

        success(res, { objectKey });
      } catch (err) {
        console.error('[recordingSegment] 处理失败：', (err as Error).message);
        fail(res, 500, '切片上传失败');
      }
    })();
  },

  /**
   * POST /api/rooms/:roomId/recording/finish
   *
   * Electron 实时录制专用：录制结束后，由 Electron 调用此接口。
   * 后端写入 room_videos 记录（hls_status=ready），广播 VIDEO_ADDED。
   * 无需转码——切片已在 COS，可直接播放。
   *
   * 请求体：{ segmentKeys: string[], displayName: string, durationSeconds: number }
   * 响应：{ videoId: string }
   */
  async recordingFinish(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const userId = req.userId!;
    const {
      segmentKeys,
      displayName,
      durationSeconds,
    } = req.body as {
      segmentKeys?: unknown;
      displayName?: unknown;
      durationSeconds?: unknown;
    };

    // ── 参数校验 ────────────────────────────────────────────────────────────
    if (!Array.isArray(segmentKeys) || segmentKeys.length === 0) {
      fail(res, 400, 'segmentKeys 必须为非空数组');
      return;
    }
    if (segmentKeys.length > 1000) {
      fail(res, 400, 'segmentKeys 长度不得超过 1000');
      return;
    }
    for (const key of segmentKeys) {
      if (typeof key !== 'string' || !key.endsWith('.ts')) {
        fail(res, 400, 'segmentKeys 中每项必须为以 .ts 结尾的字符串');
        return;
      }
    }
    if (typeof displayName !== 'string' || displayName.trim().length === 0) {
      fail(res, 400, 'displayName 必须为非空字符串');
      return;
    }
    const duration = typeof durationSeconds === 'number' ? durationSeconds : 0;

    // 从第一个 objectKey 提取 hlsPrefix（截至最后一个 / 的部分）
    const firstKey = segmentKeys[0] as string;
    const lastSlash = firstKey.lastIndexOf('/');
    if (lastSlash === -1) {
      fail(res, 400, 'segmentKeys 格式不正确，应包含目录路径');
      return;
    }
    const hlsPrefix = firstKey.slice(0, lastSlash + 1);

    try {
      const room = await getRoomById(roomId);
      if (!room) { fail(res, 404, '房间不存在'); return; }

      const videoId = uuidv4();
      // video_url 存 hlsPrefix（与普通上传一致，下游 getSegment / generateM3u8 复用）
      const video = await addRoomVideo(videoId, roomId, hlsPrefix, displayName.trim(), userId);

      // 切片已在 COS，直接标 ready（跳过转码），同时写入 durationSeconds 供 generateM3u8 修正 #EXTINF
      await updateHlsStatus(videoId, 'ready', hlsPrefix, duration > 0 ? duration : undefined);

      console.log(
        `[recordingFinish] 录制写库完成：videoId=${videoId} segments=${segmentKeys.length}` +
        ` duration=${duration}s hlsPrefix=${hlsPrefix} (userId=${userId})`,
      );

      // 广播 VIDEO_ADDED，房间内所有成员实时看到新视频
      broadcast(roomId, {
        type: 'VIDEO_ADDED',
        data: {
          id: video.id,
          objectKey: hlsPrefix,
          m3u8ObjectKey: hlsPrefix,
          videoUrl: `/api/rooms/${roomId}/videos/${videoId}/m3u8`,
          fileName: video.file_name,
          uploaderId: video.uploader_id,
          createdAt: video.created_at,
        },
      });

      success(res, { videoId });
    } catch (err) {
      console.error('[recordingFinish] 处理失败：', (err as Error).message);
      fail(res, 500, '录制记录保存失败');
    }
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
   * 动态生成 m3u8 内容并返回。
   * 切片 URL 为后端代理相对路径（/api/rooms/:roomId/videos/:videoId/segments/:segmentName），
   * 不再直接暴露 CDN 签名 URL，避免跨域问题。
   * 注意：此接口挂载了 requireRoomActive，free 房间会在中间件层被拦截。
   */
  async getVideoM3u8(req: Request, res: Response): Promise<void> {
    const { roomId, videoId } = req.params;

    try {
      const m3u8Content = await generateM3u8(videoId, roomId, uploadsDir);
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

  /**
   * GET /api/rooms/:roomId/videos/:videoId/segments/:segmentName
   * HLS 切片代理接口：权限校验通过后 302 重定向到 CDN 签名 URL（线上）或本地静态路径（本地模式）。
   *
   * 设计要点：
   *   - 渲染进程（浏览器 / Electron）通过此接口间接访问 CDN，彻底消除跨域问题
   *   - 签名 URL 在服务端实时生成，客户端不感知 CDN 地址
   *   - segmentName 校验：必须以 .ts 结尾，且不含路径分隔符（防目录穿越）
   */
  async getSegment(req: Request, res: Response): Promise<void> {
    const { roomId, videoId, segmentName } = req.params;

    // ── 参数校验：防止目录穿越 ──────────────────────────────────────────────
    if (
      !segmentName.endsWith('.ts') ||
      segmentName.includes('/') ||
      segmentName.includes('..')
    ) {
      fail(res, 400, '非法的 segmentName');
      return;
    }

    const video = await getRoomVideoById(videoId);
    if (!video || video.room_id !== roomId) {
      fail(res, 404, '视频不存在');
      return;
    }

    if (!video.hls_prefix) {
      fail(res, 404, '视频切片不存在');
      return;
    }

    const objectKey = `${video.hls_prefix}${segmentName}`;

    if (isOnlineMode()) {
      // 线上模式：生成带时效签名的 CDN URL，302 重定向
      // 默认有效期 10 分钟（单个切片请求耗时远小于此值，足够安全）
      const signedUrl = await getHlsSegmentSignedUrl(objectKey, 10 * 60);
      res.redirect(302, signedUrl);
    } else {
      // 本地模式：重定向到 /uploads 静态服务
      res.redirect(302, `/uploads/${objectKey}`);
    }
  },
};

/**
 * 根据用户拥有的 plans 列表推导房间应获得的 plan_level。
 * 取用户所有有效 plan 中等级最高的一个映射到房间等级。
 * 若用户无任何 plan，返回 'free'（实际上 requirePlan 守卫会提前拦截，此处兜底）。
 */
function deriveRoomPlanLevel(userPlans: string[]): RoomPlanLevel {
  let maxLevel = 0;
  for (const p of userPlans) {
    const level = PLAN_HIERARCHY[p];
    if (level !== undefined && level > maxLevel) {
      maxLevel = level;
    }
  }
  if (maxLevel >= PLAN_HIERARCHY['vip:pro']) return 'vip:pro';
  if (maxLevel >= PLAN_HIERARCHY['vip:basic']) return 'vip:basic';
  return 'free';
}
