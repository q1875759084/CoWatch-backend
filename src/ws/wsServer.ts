import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';
import { URL } from 'url';
import { verifyToken } from '../utils/jwt.js';
import { getRoomMember, setMemberOnline, getAdminByRoom } from '../database/roomMember/index.js';
import { getRoomById, setControlMode, setControllerId } from '../database/room/index.js';
import { getUserById } from '../database/user/index.js';
import { addClient, removeClient, broadcast, broadcastExcept, sendToClient } from '../controllers/ws/registry.js';

interface WsMessage {
  type: string;
  data?: Record<string, unknown>;
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
    setMemberOnline(userId, roomId, true);

    broadcastExcept(roomId, userId, {
      type: 'MEMBER_JOINED',
      data: { userId, nickname, isAdmin: member.is_admin === 1 },
    });

    const currentRoom = getRoomById(roomId)!;
    sendToClient(roomId, userId, {
      type: 'ROOM_STATE',
      data: {
        videoUrl: currentRoom.video_url,
        controlMode: currentRoom.control_mode,
        controllerId: currentRoom.controller_id,
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
          broadcastExcept(roomId, userId, { type: 'SYNC_PROGRESS', data: { currentTime, fromUserId: userId } });
          break;
        }

        case 'SYNC_STATE': {
          if (!canControl(userId, latestRoom)) return;
          const { isPlaying, currentTime } = msg.data ?? {};
          if (typeof isPlaying !== 'boolean' || typeof currentTime !== 'number') return;
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

        case 'MODE_CHANGE': {
          if (member.is_admin !== 1) return;
          const mode = msg.data?.mode as 'designated' | 'free' | undefined;
          if (mode !== 'designated' && mode !== 'free') return;
          setControlMode(roomId, mode);
          broadcast(roomId, { type: 'MODE_CHANGED', data: { mode } });
          break;
        }

        case 'START_WATCH': {
          if (member.is_admin !== 1) return;
          const freshRoom = getRoomById(roomId);
          if (!freshRoom?.video_url) {
            sendToClient(roomId, userId, { type: 'ERROR', data: { message: '请先上传视频再开始复盘' } });
            return;
          }
          broadcast(roomId, { type: 'ROOM_STARTED', data: { videoUrl: freshRoom.video_url } });
          break;
        }

        default:
          console.warn(`[WS] 未知消息类型: ${msg.type}`);
      }
    });

    // ── 断线处理 ────────────────────────────────────────────────────────────
    ws.on('close', () => {
      removeClient(roomId, userId);
      setMemberOnline(userId, roomId, false);

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
  if (room.control_mode === 'free') return true;
  return room.controller_id === userId;
}
