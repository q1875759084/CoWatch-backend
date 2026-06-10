import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';
import { URL } from 'url';
import { verifyToken } from '../utils/jwt.js';
import { getRoomMember, getAdminByRoom, getMembersByRoom } from '../database/roomMember/index.js';
import { getRoomById, setControllerId, setVideoUrl } from '../database/room/index.js';
import { getVideosByRoom } from '../database/roomVideo/index.js';
import { addTag, deleteTag } from '../database/tag/index.js';
import { getUserById } from '../database/user/index.js';
import { addClient, removeClient, broadcast, broadcastExcept, sendToClient } from '../controllers/ws/registry.js';
import { getSignedUrl, isOssEnabled } from '../services/ossService.js';

interface WsMessage {
  type: string;
  data?: Record<string, unknown>;
}

/**
 * 内存中记录每个房间的实时播放状态（不落库，进度是高频易变数据）。
 * 新成员加入时用于初始化，避免以暂停状态进入正在播放的房间。
 */
const roomPlayback = new Map<string, { isPlaying: boolean; currentTime: number }>();

/**
 * 每个房间的操作序列号（单调递增）。
 * 每次广播 SYNC_STATE / TAG_SEEK 时递增并附带到消息里。
 * 非主控收到后用于过期判断：seq 较小的消息（旧指令）直接丢弃，
 * 确保快速连续操作（如 TAG_SEEK → play → pause）在非主控侧按最新状态落地。
 */
const roomSeq = new Map<string, number>();

/** 获取房间当前 seq 并递增，用于广播时附带 */
function nextSeq(roomId: string): number {
  const seq = (roomSeq.get(roomId) ?? 0) + 1;
  roomSeq.set(roomId, seq);
  return seq;
}

/**
 * 将 objectKey 转换为播放 URL。
 *   - COS 模式：生成 30 分钟时效签名 URL
 *   - 本地模式：拼接为 /uploads/{objectKey}
 */
async function toPlayUrl(objectKey: string): Promise<string> {
  if (isOssEnabled()) {
    return getSignedUrl(objectKey);
  }
  return `/uploads/${objectKey}`;
}

/**
 * 初始化 WebSocket 服务
 *
 * 连接地址：ws://host/socket?roomId=xxx&token=xxx
 * token 即 accessToken，由前端在建立 WS 时传入。
 */
export function initWsServer(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: '/socket' });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    // ── 连接鉴权 ────────────────────────────────────────────────────────────
    const urlObj = new URL(req.url ?? '', `http://${req.headers.host}`);
    const roomId = urlObj.searchParams.get('roomId');
    const token  = urlObj.searchParams.get('token');

    if (!roomId || !token) {
      ws.close(1008, 'Missing roomId or token');
      return;
    }

    let userId: string;
    try {
      userId = verifyToken(token).userId;
    } catch {
      ws.close(1008, 'Invalid or expired token');
      return;
    }

    const member = getRoomMember(userId, roomId);
    if (!member) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    const room = getRoomById(roomId);
    if (!room) {
      ws.close(1008, 'Room not found');
      return;
    }

    const user = getUserById(userId);
    const nickname = user?.nickname ?? userId;

    // ── 上线处理 ────────────────────────────────────────────────────────────
    addClient(roomId, userId, ws);

    broadcastExcept(roomId, userId, {
      type: 'MEMBER_JOINED',
      data: { userId, nickname, isAdmin: member.is_admin === 1 },
    });

    // 进房间时视频列表只下发 objectKey，不签名。
    // 播放 URL 在用户点击播放（SWITCH_VIDEO）时由后端实时签名后广播。
    const existingVideos = getVideosByRoom(roomId);
    const currentMembers = getMembersByRoom(roomId);
    const playback = roomPlayback.get(roomId) ?? { isPlaying: false, currentTime: 0 };

    // 若当前房间已有激活视频（objectKey 存储在 room.video_url），实时签名后告知新成员
    const activeObjectKey = room.video_url ?? null;
    void (activeObjectKey ? toPlayUrl(activeObjectKey) : Promise.resolve(null)).then((signedUrl) => {
      sendToClient(roomId, userId, {
        type: 'ROOM_STATE',
        data: {
          // 若有激活视频，下发签名 URL；否则为 null（进房间时尚无人播放）
          videoUrl: signedUrl,
          activeObjectKey,
          controlMode: room.control_mode,
          controllerId: room.controller_id,
          // 下发当前播放状态，新加入成员可直接同步
          isPlaying: playback.isPlaying,
          currentTime: playback.currentTime,
          // 视频列表只含 objectKey，videoUrl 为 null（播放时按需签名）
          videos: existingVideos.map((v) => ({
            id: v.id,
            objectKey: v.video_url,
            videoUrl: null,
            fileName: v.file_name,
            uploaderId: v.uploader_id,
            createdAt: v.created_at,
          })),
          // 下发当前房间内所有成员
          members: currentMembers.map((m) => ({
            userId: m.user_id,
            nickname: m.nickname,
            isAdmin: m.is_admin === 1,
          })),
          // tags 不随 ROOM_STATE 下发（点击播放后按需拉取）
          tags: [],
        },
      });
    });

    console.log(`[WS] ${nickname}(${userId}) joined room ${roomId}`);

    // ── 消息处理 ────────────────────────────────────────────────────────────
    ws.on('message', (raw) => {
      let msg: WsMessage;
      try {
        msg = JSON.parse(raw.toString()) as WsMessage;
      } catch {
        return;
      }

      const latestRoom = getRoomById(roomId);
      if (!latestRoom) return;

      switch (msg.type) {

        case 'SYNC_PROGRESS': {
          if (!canControl(userId, latestRoom)) return;
          const currentTime = msg.data?.currentTime as number | undefined;
          if (typeof currentTime !== 'number') return;
          const prev = roomPlayback.get(roomId);
          roomPlayback.set(roomId, { isPlaying: prev?.isPlaying ?? true, currentTime });
          broadcastExcept(roomId, userId, { type: 'SYNC_PROGRESS', data: { currentTime, fromUserId: userId } });
          break;
        }

        case 'SYNC_STATE': {
          if (!canControl(userId, latestRoom)) return;
          const { isPlaying, currentTime } = msg.data ?? {};
          if (typeof isPlaying !== 'boolean' || typeof currentTime !== 'number') return;
          roomPlayback.set(roomId, { isPlaying, currentTime });
          const seq = nextSeq(roomId);
          broadcastExcept(roomId, userId, { type: 'SYNC_STATE', data: { isPlaying, currentTime, seq } });
          break;
        }

        case 'TRANSFER_CONTROL': {
          if (member.is_admin !== 1) return;
          const targetUserId = msg.data?.targetUserId as string | undefined;
          if (!targetUserId) return;
          const targetMember = getRoomMember(targetUserId, roomId);
          if (!targetMember) return;
          const targetUser = getUserById(targetUserId);
          setControllerId(roomId, targetUserId);
          broadcast(roomId, {
            type: 'CONTROL_CHANGED',
            data: { controllerId: targetUserId, controllerNickname: targetUser?.nickname ?? targetUserId },
          });
          break;
        }

        case 'TAG_ADD': {
          if (!canControl(userId, latestRoom)) return;
          const { id: tagId, videoId, time, label } = (msg.data ?? {}) as Record<string, unknown>;
          if (
            typeof tagId !== 'string' ||
            typeof videoId !== 'string' ||
            typeof time !== 'number' ||
            typeof label !== 'string'
          ) return;
          const tag = addTag(tagId, roomId, videoId, time, label, userId);
          broadcast(roomId, {
            type: 'TAG_ADDED',
            data: {
              id: tag.id,
              roomId: tag.room_id,
              videoId: tag.video_id,
              time: tag.time,
              label: tag.label,
              createdBy: tag.created_by,
              createdAt: tag.created_at,
            },
          });
          break;
        }

        case 'TAG_DELETE': {
          if (!canControl(userId, latestRoom)) return;
          const { id: tagId } = (msg.data ?? {}) as Record<string, unknown>;
          if (typeof tagId !== 'string') return;
          deleteTag(tagId);
          broadcast(roomId, { type: 'TAG_DELETED', data: { id: tagId } });
          break;
        }

        case 'TAG_SEEK': {
          if (!canControl(userId, latestRoom)) return;
          const { time } = (msg.data ?? {}) as Record<string, unknown>;
          if (typeof time !== 'number') return;
          roomPlayback.set(roomId, { isPlaying: false, currentTime: time });
          const seq = nextSeq(roomId);
          // 排除主控自身：主控点击 tag 后本地已直接操作视频（seek+pause），
          // 无需 WS 回环，只通知其他成员。
          broadcastExcept(roomId, userId, { type: 'SYNC_STATE', data: { isPlaying: false, currentTime: time, seq } });
          break;
        }

        case 'SWITCH_VIDEO': {
          /**
           * 方案 B：前端发送 objectKey，后端实时签名后广播带签名 videoUrl 的消息。
           *
           * 签名在"切换时刻"生成，有效期 30 分钟从此时起算。
           * 仅主控（controller）可以切换视频。
           */
          if (!canControl(userId, latestRoom)) return;
          const objectKey = msg.data?.objectKey as string | undefined;
          const videoId = msg.data?.videoId as string | undefined;
          if (!objectKey) return;

          // 更新 rooms.video_url 为当前激活视频的 objectKey
          setVideoUrl(roomId, objectKey);

          // 异步签名后广播（ws.on('message') 不支持 async，用 void + Promise）
          void toPlayUrl(objectKey).then((signedUrl) => {
            broadcast(roomId, {
              type: 'SWITCH_VIDEO',
              data: { objectKey, videoUrl: signedUrl, videoId },
            });
          }).catch((err) => {
            console.error('[WS] SWITCH_VIDEO 签名失败:', err);
          });
          break;
        }

        default:
          console.warn(`[WS] 未知消息类型: ${msg.type}`);
      }
    });

    // ── 断线处理 ────────────────────────────────────────────────────────────
    ws.on('close', () => {
      removeClient(roomId, userId);

      const freshRoom = getRoomById(roomId);
      if (freshRoom && freshRoom.controller_id === userId) {
        const admin = getAdminByRoom(roomId);
        const newControllerId = admin ? admin.user_id : null;
        setControllerId(roomId, newControllerId);
        if (newControllerId) {
          broadcast(roomId, {
            type: 'CONTROL_CHANGED',
            data: { controllerId: newControllerId, controllerNickname: admin!.nickname },
          });
        }
      }

      broadcast(roomId, { type: 'MEMBER_LEFT', data: { userId } });
      console.log(`[WS] ${nickname}(${userId}) left room ${roomId}`);
    });

    ws.on('error', (err) => {
      console.error(`[WS] error for ${userId}:`, err);
    });
  });

  return wss;
}

function canControl(userId: string, room: ReturnType<typeof getRoomById>): boolean {
  if (!room) return false;
  return room.controller_id === userId;
}
