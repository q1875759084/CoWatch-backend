import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';
import { URL } from 'url';
import { verifyToken } from '../utils/jwt.js';
import { getRoomMember, getAdminByRoom, getMembersByRoom } from '../database/roomMember/index.js';
import { getRoomById, setControllerId, setVideoUrl } from '../database/room/index.js';
import { getVideosByRoom, getVideoIdByObjectKey } from '../database/roomVideo/index.js';
import { addTag, deleteTag } from '../database/tag/index.js';
import { getUserById } from '../database/user/index.js';
import { addClient, removeClient, broadcast, broadcastExcept, sendToClient, getOnlineUserIds } from '../controllers/ws/registry.js';
import type { RoomRow } from '../database/room/index.js';

interface WsMessage {
  type: string;
  data?: Record<string, unknown>;
}

/**
 * 内存中记录每个房间的实时播放状态（不落库，进度是高频易变数据）。
 * 新成员加入时用于初始化，避免以暂停状态进入正在播放的房间。
 */
const roomPlayback = new Map<string, { isPlaying: boolean; currentTime: number }>();

/** 每个房间的笔迹快照（纯内存，不落库）。
 * 新成员加入时通过 ROOM_STATE 一次性下发，解决刷新/中途加入看不到历史笔迹的问题。
 * 上限 500 条，超出时丢弃最旧的。
 */
const STROKES_LIMIT = 500;
const roomStrokes = new Map<string, Array<{ color: string; points: unknown[] }>>();

/**
 * 每个房间的操作序列号（单调递增）。
 * 每次广播 SYNC_STATE / TAG_SEEK 时递增并附带到消息里。
 * 非主控收到后用于过期判断：seq 较小的消息（旧指令）直接丢弃，
 * 确保快速连续操作（如 TAG_SEEK → play → pause）在非主控侧按最新状态落地。
 */
const roomSeq = new Map<string, number>();

/**
 * 每个房间的共享笔记内容（纯内存，不落库）。
 * 新成员加入时通过 ROOM_STATE 一次性下发，保证后到成员也能看到笔记内容。
 */
const roomNote = new Map<string, string>();

/** 聊天消息结构 */
interface ChatMessage {
  userId: string;
  nickname: string;
  content: string;
  timestamp: number;
}

/**
 * 每个房间的聊天消息缓存（纯内存，不落库）。
 * 最多保留最近 50 条，超出时丢弃最旧的。
 * 新成员加入时通过 ROOM_STATE 下发，保证中途加入也能看到近期消息。
 */
const CHAT_LIMIT = 50;
const roomChat = new Map<string, ChatMessage[]>();

/** 获取房间当前 seq 并递增，用于广播时附带 */
function nextSeq(roomId: string): number {
  const seq = (roomSeq.get(roomId) ?? 0) + 1;
  roomSeq.set(roomId, seq);
  return seq;
}

function canControl(userId: string, room: RoomRow | null): boolean {
  if (!room) return false;
  if (room.control_mode === 'free') return true;
  return room.controller_id === userId;
}

/**
 * 将 objectKey 转换为 m3u8 API 路径（异步版）。
 *
 * HLS 架构下，前端不直接播放 mp4，而是通过后端动态生成的 m3u8 加载。
 * 返回格式：/api/rooms/{roomId}/videos/{videoId}/m3u8
 * 若找不到对应 videoId（数据异常），返回 null。
 */
async function toPlayUrl(roomId: string, objectKey: string): Promise<string | null> {
  const videoId = await getVideoIdByObjectKey(objectKey);
  if (!videoId) return null;
  return `/api/rooms/${roomId}/videos/${videoId}/m3u8`;
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
    // ── 连接鉴权（异步处理，出错则关闭 WS）────────────────────────────────────
    void handleConnection(ws, req);
  });

  return wss;
}

async function handleConnection(ws: WebSocket, req: IncomingMessage): Promise<void> {
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

  const [member, room, user] = await Promise.all([
    getRoomMember(userId, roomId),
    getRoomById(roomId),
    getUserById(userId),
  ]);

  if (!member) {
    ws.close(1008, 'Unauthorized');
    return;
  }
  if (!room) {
    ws.close(1008, 'Room not found');
    return;
  }

  const nickname = user?.nickname ?? userId;

  // ── 上线处理 ────────────────────────────────────────────────────────────
  addClient(roomId, userId, ws);

  broadcastExcept(roomId, userId, {
    type: 'MEMBER_JOINED',
    data: { userId, nickname, isAdmin: member.is_admin === 1, isOnline: true },
  });

  const [currentMembers, allVideos] = await Promise.all([
    getMembersByRoom(roomId),
    getVideosByRoom(roomId),
  ]);

  const onlineIds = getOnlineUserIds(roomId);
  const playback = roomPlayback.get(roomId) ?? { isPlaying: false, currentTime: 0 };

  const activeObjectKey = room.video_url ?? null;
  const currentVideoUrl = activeObjectKey ? await toPlayUrl(roomId, activeObjectKey) : null;
  const activeVideo = activeObjectKey ? allVideos.find((v) => v.video_url === activeObjectKey) : null;

  sendToClient(roomId, userId, {
    type: 'ROOM_STATE',
    data: {
      videoUrl: currentVideoUrl,
      activeObjectKey,
      activeVideoId: activeVideo?.id ?? null,
      controlMode: room.control_mode,
      controllerId: room.controller_id,
      isPlaying: playback.isPlaying,
      currentTime: playback.currentTime,
      strokes: roomStrokes.get(roomId) ?? [],
      noteContent: roomNote.get(roomId) ?? '',
      chatMessages: roomChat.get(roomId) ?? [],
      members: currentMembers.map((m) => ({
        userId: m.user_id,
        nickname: m.nickname,
        isAdmin: m.is_admin === 1,
        isOnline: onlineIds.has(m.user_id),
      })),
    },
  });

  // ── 自动成为主控（第一个进入房间的人）────────────────────────────────────
  if (onlineIds.size === 1) {
    await setControllerId(roomId, userId);
    broadcast(roomId, {
      type: 'CONTROL_CHANGED',
      data: { controllerId: userId, controllerNickname: nickname },
    });
    console.log(`[WS] ${nickname}(${userId}) auto-assigned as controller of room ${roomId}`);
  }

  console.log(`[WS] ${nickname}(${userId}) joined room ${roomId}`);

  // ── 消息处理 ────────────────────────────────────────────────────────────
  ws.on('message', (raw) => {
    let msg: WsMessage;
    try {
      msg = JSON.parse(raw.toString()) as WsMessage;
    } catch {
      return;
    }
    // 异步处理消息，错误不向上抛
    void handleMessage(ws, roomId, userId, nickname, member.is_admin, msg);
  });

  // ── 断线处理 ────────────────────────────────────────────────────────────
  ws.on('close', () => {
    void handleDisconnect(roomId, userId, nickname);
  });

  ws.on('error', (err) => {
    console.error(`[WS] error for ${userId}:`, err);
  });
}

async function handleMessage(
  _ws: WebSocket,
  roomId: string,
  userId: string,
  nickname: string,
  isAdminFlag: number,
  msg: WsMessage,
): Promise<void> {
  const latestRoom = await getRoomById(roomId);
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
      if (!canControl(userId, latestRoom) && isAdminFlag !== 1) return;
      const targetUserId = msg.data?.targetUserId as string | undefined;
      if (!targetUserId) return;
      const [targetMember, targetUser] = await Promise.all([
        getRoomMember(targetUserId, roomId),
        getUserById(targetUserId),
      ]);
      if (!targetMember) return;
      await setControllerId(roomId, targetUserId);
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
      const tag = await addTag(tagId, roomId, videoId, time, label, userId);
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
      await deleteTag(tagId, roomId);
      broadcast(roomId, { type: 'TAG_DELETED', data: { id: tagId } });
      break;
    }

    case 'TAG_SEEK': {
      if (!canControl(userId, latestRoom)) return;
      const { time } = (msg.data ?? {}) as Record<string, unknown>;
      if (typeof time !== 'number') return;
      roomPlayback.set(roomId, { isPlaying: false, currentTime: time });
      const seq = nextSeq(roomId);
      broadcastExcept(roomId, userId, { type: 'SYNC_STATE', data: { isPlaying: false, currentTime: time, seq } });
      break;
    }

    case 'SWITCH_VIDEO': {
      if (!canControl(userId, latestRoom)) return;
      const objectKey = msg.data?.objectKey as string | undefined;
      const msgVideoId = msg.data?.videoId as string | undefined;
      if (!objectKey) return;

      await setVideoUrl(roomId, objectKey);

      const resolvedVideoId = msgVideoId ?? await getVideoIdByObjectKey(objectKey);
      if (!resolvedVideoId) {
        console.error('[WS] SWITCH_VIDEO：找不到 videoId for objectKey:', objectKey);
        return;
      }

      const m3u8Url = `/api/rooms/${roomId}/videos/${resolvedVideoId}/m3u8`;
      broadcast(roomId, {
        type: 'SWITCH_VIDEO',
        data: { objectKey, videoUrl: m3u8Url, videoId: resolvedVideoId },
      });
      break;
    }

    case 'CURSOR_MOVE': {
      const { x, y, styleId } = (msg.data ?? {}) as Record<string, unknown>;
      if (typeof x !== 'number' || typeof y !== 'number' || typeof styleId !== 'string') return;
      broadcastExcept(roomId, userId, {
        type: 'CURSOR_MOVE',
        data: { userId, x, y, styleId },
      });
      break;
    }

    case 'CURSOR_HIDE': {
      broadcastExcept(roomId, userId, {
        type: 'CURSOR_HIDE',
        data: { userId },
      });
      break;
    }

    case 'DRAW_STROKE': {
      const { color, points } = (msg.data ?? {}) as Record<string, unknown>;
      if (typeof color !== 'string' || !Array.isArray(points)) return;
      const strokes = roomStrokes.get(roomId) ?? [];
      strokes.push({ color, points });
      if (strokes.length > STROKES_LIMIT) strokes.shift();
      roomStrokes.set(roomId, strokes);
      broadcastExcept(roomId, userId, {
        type: 'DRAW_STROKE',
        data: { userId, color, points },
      });
      break;
    }

    case 'DRAW_CLEAR': {
      roomStrokes.set(roomId, []);
      broadcastExcept(roomId, userId, {
        type: 'DRAW_CLEAR',
        data: { userId },
      });
      break;
    }

    case 'DRAW_CLEAR_COLOR': {
      const { color } = (msg.data ?? {}) as Record<string, unknown>;
      if (typeof color !== 'string') return;
      const existing = roomStrokes.get(roomId);
      if (existing) roomStrokes.set(roomId, existing.filter((s) => s.color !== color));
      broadcastExcept(roomId, userId, {
        type: 'DRAW_CLEAR_COLOR',
        data: { userId, color },
      });
      break;
    }

    case 'NOTE_UPDATE': {
      if (!canControl(userId, latestRoom)) return;
      const { content } = (msg.data ?? {}) as Record<string, unknown>;
      if (typeof content !== 'string') return;
      roomNote.set(roomId, content);
      broadcastExcept(roomId, userId, {
        type: 'NOTE_UPDATE',
        data: { content, fromUserId: userId },
      });
      break;
    }

    case 'CHAT_MESSAGE': {
      const { content: chatContent } = (msg.data ?? {}) as Record<string, unknown>;
      if (typeof chatContent !== 'string' || !chatContent.trim()) return;
      const chatMsg: ChatMessage = {
        userId,
        nickname,
        content: chatContent.trim(),
        timestamp: Date.now(),
      };
      const chats = roomChat.get(roomId) ?? [];
      chats.push(chatMsg);
      if (chats.length > CHAT_LIMIT) chats.shift();
      roomChat.set(roomId, chats);
      broadcast(roomId, { type: 'CHAT_MESSAGE', data: chatMsg });
      break;
    }

    case 'FORCE_SYNC': {
      const freshRoomForSync = await getRoomById(roomId);
      if (!freshRoomForSync) break;

      const syncPlayback = roomPlayback.get(roomId) ?? { isPlaying: false, currentTime: 0 };
      const syncActiveObjectKey = freshRoomForSync.video_url ?? null;
      const syncVideoUrl = syncActiveObjectKey ? await toPlayUrl(roomId, syncActiveObjectKey) : null;
      const [syncVideos, syncMembers] = await Promise.all([
        getVideosByRoom(roomId),
        getMembersByRoom(roomId),
      ]);
      const syncActiveVideo = syncActiveObjectKey ? syncVideos.find((v) => v.video_url === syncActiveObjectKey) : null;
      const syncOnlineIds = getOnlineUserIds(roomId);

      const roomStateData = {
        videoUrl: syncVideoUrl,
        activeObjectKey: syncActiveObjectKey,
        activeVideoId: syncActiveVideo?.id ?? null,
        controlMode: freshRoomForSync.control_mode,
        controllerId: freshRoomForSync.controller_id,
        isPlaying: syncPlayback.isPlaying,
        currentTime: syncPlayback.currentTime,
        strokes: roomStrokes.get(roomId) ?? [],
        noteContent: roomNote.get(roomId) ?? '',
        chatMessages: roomChat.get(roomId) ?? [],
        members: syncMembers.map((m) => ({
          userId: m.user_id,
          nickname: m.nickname,
          isAdmin: m.is_admin === 1,
          isOnline: syncOnlineIds.has(m.user_id),
        })),
      };

      const isController = canControl(userId, freshRoomForSync);
      if (isController) {
        broadcastExcept(roomId, userId, {
          type: 'ROOM_STATE',
          data: { ...roomStateData, forceSynced: true },
        });
        console.log(`[WS] FORCE_SYNC from controller ${userId}, broadcast ROOM_STATE to room ${roomId}`);
      } else {
        sendToClient(roomId, userId, {
          type: 'ROOM_STATE',
          data: { ...roomStateData, forceSynced: false },
        });
        console.log(`[WS] FORCE_SYNC from member ${userId}, unicast ROOM_STATE back`);
      }
      break;
    }

    default:
      console.warn(`[WS] 未知消息类型: ${msg.type}`);
  }
}

async function handleDisconnect(roomId: string, userId: string, nickname: string): Promise<void> {
  removeClient(roomId, userId);

  const freshRoom = await getRoomById(roomId);

  const remainingClients = getOnlineUserIds(roomId);
  if (remainingClients.size === 0) {
    roomPlayback.set(roomId, { isPlaying: false, currentTime: 0 });
    await setVideoUrl(roomId, null);
  }

  if (freshRoom && freshRoom.controller_id === userId) {
    let newControllerId: string | null = null;
    let newControllerNickname = '';

    const admin = await getAdminByRoom(roomId);
    if (admin && remainingClients.has(admin.user_id)) {
      newControllerId = admin.user_id;
      // admin 类型里没 nickname，需要另外查
      const adminUser = await getUserById(admin.user_id);
      newControllerNickname = adminUser?.nickname ?? admin.user_id;
    } else if (remainingClients.size > 0) {
      const fallbackId = remainingClients.values().next().value as string;
      const fallbackUser = await getUserById(fallbackId);
      newControllerId = fallbackId;
      newControllerNickname = fallbackUser?.nickname ?? fallbackId;
    }

    await setControllerId(roomId, newControllerId ?? userId);
    if (newControllerId) {
      broadcast(roomId, {
        type: 'CONTROL_CHANGED',
        data: { controllerId: newControllerId, controllerNickname: newControllerNickname },
      });
      console.log(`[WS] controller changed to ${newControllerNickname}(${newControllerId}) after ${nickname} left`);
    }
  }

  broadcast(roomId, { type: 'MEMBER_OFFLINE', data: { userId } });
  console.log(`[WS] ${nickname}(${userId}) left room ${roomId}`);
}
