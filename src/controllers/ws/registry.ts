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
 * 广播消息给房间内所有人（含发送者）
 */
export function broadcast(roomId: string, message: object): void {
  const clients = getClients(roomId);
  const payload = JSON.stringify(message);
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
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
      ws.send(payload);
    }
  });
}

/**
 * 向指定用户单播消息
 */
export function sendToClient(roomId: string, userId: string, message: object): void {
  const ws = getClients(roomId).get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
