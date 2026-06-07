import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRoom, getRoomById, setVideoUrl, setControllerId } from '../../database/room/index.js';
import { joinRoom, getMembersByRoom, getRoomsByUser } from '../../database/roomMember/index.js';
import { generateRoomId } from '../../utils/roomId.js';
import { isOssEnabled, getUploadUrl, getVideoUrl } from '../../services/ossService.js';
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

    let roomId = '';
    for (let i = 0; i < 5; i++) {
      const candidate = generateRoomId();
      if (!getRoomById(candidate)) { roomId = candidate; break; }
    }
    if (!roomId) {
      fail(res, 500, '房间码生成失败，请重试');
      return;
    }

    const room = createRoom(roomId);
    joinRoom(userId, roomId, true);
    setControllerId(roomId, userId);

    success(res, {
      roomId: room.id,
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
    if (room.status === 'closed') { fail(res, 410, '房间已关闭'); return; }

    joinRoom(userId, roomId, false);

    success(res, {
      roomId,
      videoUrl: room.video_url,
      status: room.status,
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
      status: room.status,
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
   * GET /api/rooms/:roomId/upload-url
   * OSS 模式：返回预签名 URL；本地模式：返回后端上传接口地址
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
        const uploadUrl = await getUploadUrl(objectKey, fileType);
        const videoUrl = getVideoUrl(objectKey);
        success(res, { uploadUrl, videoUrl });
      } catch (err) {
        console.error('[getUploadUrl/oss]', err);
        fail(res, 500, '获取上传地址失败');
      }
    } else {
      success(res, {
        uploadUrl: `/api/rooms/${roomId}/upload?userId=${userId}`,
        videoUrl: '',
        mode: 'local',
      });
    }
  },

  /**
   * PUT /api/rooms/:roomId/upload
   * 本地模式专用：接收前端直传的视频文件，raw body 写入本地
   */
  uploadLocal(req: Request, res: Response): void {
    const { roomId } = req.params;

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    const dest = path.join(uploadsDir, roomId);
    fs.mkdirSync(dest, { recursive: true });

    const rawName = (req.query.fileName as string) || 'video.mp4';
    const ext = path.extname(rawName) || '.mp4';
    const savedName = `${uuidv4()}${ext}`;
    const filePath = path.join(dest, savedName);

    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      const videoUrl = `/uploads/${roomId}/${savedName}`;
      setVideoUrl(roomId, videoUrl);
      broadcast(roomId, { type: 'VIDEO_READY', data: { videoUrl } });
      success(res, { videoUrl });
    });

    writeStream.on('error', (err) => {
      console.error('[uploadLocal]', err);
      fail(res, 500, '文件保存失败');
    });
  },

  /**
   * PUT /api/rooms/:roomId/video
   * 确认视频上传完成（OSS 模式）
   */
  async setVideo(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const { videoUrl } = req.body;

    if (!videoUrl || typeof videoUrl !== 'string') { fail(res, 400, '缺少 videoUrl'); return; }

    const room = getRoomById(roomId);
    if (!room) { fail(res, 404, '房间不存在'); return; }

    setVideoUrl(roomId, videoUrl);
    broadcast(roomId, { type: 'VIDEO_READY', data: { videoUrl } });
    success(res, { success: true });
  },
};
