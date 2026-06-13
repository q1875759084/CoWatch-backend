import { WebSocket } from 'ws';

/**
 * 房间 WebSocket 连接池
 * Map<roomId, Map<userId, WebSocket>>
 */
const roomClients = new Map<string, Map<string, WebSocket>>();

export function addClient(roomId: string, userId: string, ws: WebSocket): void {
  if (!roomClients.has(roomId)) {
    roomClients.set(roomId, new Map());
  }
  roomClients.get(roomId)!.set(userId, ws);
}

export function removeClient(roomId: string, userId: string): void {
  roomClients.get(roomId)?.delete(userId);
  if (roomClients.get(roomId)?.size === 0) {
    roomClients.delete(roomId);
  }
}

export function getClients(roomId: string): Map<string, WebSocket> {
  return roomClients.get(roomId) ?? new Map();
}

/**
 * 获取房间内当前在线的 userId 集合。
 * 以进程内 WS 连接注册表为唯一权威，用于 ROOM_STATE 下发时拼接 isOnline 字段。
 */
export function getOnlineUserIds(roomId: string): Set<string> {
  return new Set(roomClients.get(roomId)?.keys() ?? []);
}

/**
 * 安全发送：捕获 ws.send() 可能抛出的同步异常（如连接已关闭但 readyState 尚未更新），
 * 防止单个连接异常传播到调用栈导致进程崩溃。
 */
function safeSend(ws: WebSocket, payload: string): void {
  try {
    ws.send(payload);
  } catch (err) {
    console.warn('[WS] send 失败（连接可能已关闭）:', (err as Error).message);
  }
}

/**
 * 广播消息给房间内所有人（含发送者）
 */
export function broadcast(roomId: string, message: object): void {
  const clients = getClients(roomId);
  const payload = JSON.stringify(message);
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      safeSend(ws, payload);
    }
  });
}

/**
 * 广播消息给房间内除发送者以外的所有人
 */
export function broadcastExcept(roomId: string, excludeUserId: string, message: object): void {
  const clients = getClients(roomId);
  const payload = JSON.stringify(message);
  clients.forEach((ws, userId) => {
    if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
      safeSend(ws, payload);
    }
  });
}

/**
 * 向指定用户单播消息
 */
export function sendToClient(roomId: string, userId: string, message: object): void {
  const ws = getClients(roomId).get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    safeSend(ws, JSON.stringify(message));
  }
}
