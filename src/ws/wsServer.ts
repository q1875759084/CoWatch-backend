import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';
import { URL } from 'url';
import { verifyToken } from '../utils/jwt.js';
import { getRoomMember, getAdminByRoom, getMembersByRoom } from '../database/roomMember/index.js';
import { getRoomById, setControllerId, setVideoUrl } from '../database/room/index.js';
import { getVideosByRoom } from '../database/roomVideo/index.js';
import { getUserById } from '../database/user/index.js';
import { addClient, removeClient, broadcast, broadcastExcept, sendToClient } from '../controllers/ws/registry.js';

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

    const currentRoom = getRoomById(roomId)!;
    const existingVideos = getVideosByRoom(roomId);
    const currentMembers = getMembersByRoom(roomId);
    const playback = roomPlayback.get(roomId) ?? { isPlaying: false, currentTime: 0 };
    sendToClient(roomId, userId, {
      type: 'ROOM_STATE',
      data: {
        videoUrl: currentRoom.video_url,
        controlMode: currentRoom.control_mode,
        controllerId: currentRoom.controller_id,
        // 下发当前播放状态，新加入成员可直接同步
        isPlaying: playback.isPlaying,
        currentTime: playback.currentTime,
        videos: existingVideos.map((v) => ({
          id: v.id,
          videoUrl: v.video_url,
          fileName: v.file_name,
          uploaderId: v.uploader_id,
          createdAt: v.created_at,
        })),
        // 下发当前房间内所有成员（所有已加入房间的成员）
        members: currentMembers.map((m) => ({
          userId: m.user_id,
          nickname: m.nickname,
          isAdmin: m.is_admin === 1,
        })),
      },
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
          // 更新内存进度（保持 currentTime 尽量准确，isPlaying 维持上次 SYNC_STATE 的值）
          const prev = roomPlayback.get(roomId);
          roomPlayback.set(roomId, { isPlaying: prev?.isPlaying ?? true, currentTime });
          broadcastExcept(roomId, userId, { type: 'SYNC_PROGRESS', data: { currentTime, fromUserId: userId } });
          break;
        }

        case 'SYNC_STATE': {
          if (!canControl(userId, latestRoom)) return;
          const { isPlaying, currentTime } = msg.data ?? {};
          if (typeof isPlaying !== 'boolean' || typeof currentTime !== 'number') return;
          // 更新内存中的播放状态，供新加入成员初始化
          roomPlayback.set(roomId, { isPlaying, currentTime });
          broadcastExcept(roomId, userId, { type: 'SYNC_STATE', data: { isPlaying, currentTime } });
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

        case 'SWITCH_VIDEO': {
          // 任意成员都可以切换当前播放的视频
          const videoUrl = msg.data?.videoUrl as string | undefined;
          const videoId = msg.data?.videoId as string | undefined;
          if (!videoUrl) return;
          // 更新 rooms.video_url 为当前激活视频
          setVideoUrl(roomId, videoUrl);
          // 广播给所有成员（包括自己）
          broadcast(roomId, { type: 'SWITCH_VIDEO', data: { videoUrl, videoId } });
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
