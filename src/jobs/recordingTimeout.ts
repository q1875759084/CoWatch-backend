/**
 * 录制超时自动收尾任务
 *
 * 背景：
 *   Electron 客户端以 sessionId 为单位实时上传 HLS 切片。
 *   若客户端崩溃或被强杀，/recording/finish 接口不会被调用，
 *   导致切片已在 COS 但 room_videos 无记录，视频永久丢失。
 *
 * 方案：
 *   每 3 分钟扫描 recording_sessions 表，找出 last_segment_at 超过
 *   SESSION_TIMEOUT_MS 且 status = 'recording' 的 session，
 *   用已上传的切片自动生成 room_videos 记录（等价于补调 finish 接口）。
 *
 * 超时阈值设计（SESSION_TIMEOUT_MS = 3 分钟）：
 *   - HLS 每片 10s，正常录制下 last_segment_at 每 10s 刷新一次
 *   - 网络抖动最坏情况：pRetry 重试约 30s，指数退避最长约 150s（5 轮）
 *   - 3 分钟 > 最坏网络抖动，不会误判正在录制的 session 为超时
 *   - 3 分钟 < 用户可忍受的"视频出现延迟"，崩溃后约 3~6 分钟视频可见
 */

import { v4 as uuidv4 } from 'uuid';
import {
  getTimedOutSessions,
  markSessionAutoFinished,
} from '../database/recordingSession/index.js';
import { addRoomVideo, updateHlsStatus } from '../database/roomVideo/index.js';
import { getRoomById } from '../database/room/index.js';
import { broadcast } from '../controllers/ws/registry.js';

/** 超时阈值：last_segment_at 超过此时长且未收到 finish，视为客户端已消失 */
const SESSION_TIMEOUT_MS = 3 * 60 * 1000; // 3 分钟

/** 扫描间隔 */
const SCAN_INTERVAL_MS = 3 * 60 * 1000; // 3 分钟

/**
 * 对单个超时 session 执行自动收尾：
 *   1. 用已有 segmentKeys 重建 hlsPrefix
 *   2. 写入 room_videos（hls_status = ready）
 *   3. 广播 VIDEO_ADDED
 *   4. 标记 session 为 auto_finished
 */
async function autoFinishSession(session: Awaited<ReturnType<typeof getTimedOutSessions>>[number]): Promise<void> {
  const { session_id, room_id, user_id, segment_keys_json } = session;

  let segmentKeys: string[];
  try {
    segmentKeys = JSON.parse(segment_keys_json) as string[];
  } catch {
    console.warn(`[recordingTimeout] session ${session_id} segment_keys_json 解析失败，跳过`);
    return;
  }

  if (segmentKeys.length === 0) {
    console.warn(`[recordingTimeout] session ${session_id} 无已上传切片，跳过`);
    // 无切片也标记为 auto_finished，避免下次再扫到
    await markSessionAutoFinished(session_id);
    return;
  }

  // 从第一个 objectKey 提取 hlsPrefix
  // objectKey 格式：cowatch/{roomId}/recordings/{sessionId}/seg001.ts
  const firstKey = segmentKeys[0]!;
  const lastSlash = firstKey.lastIndexOf('/');
  if (lastSlash === -1) {
    console.warn(`[recordingTimeout] session ${session_id} objectKey 格式异常：${firstKey}，跳过`);
    return;
  }
  const hlsPrefix = firstKey.slice(0, lastSlash + 1);

  // 校验房间是否存在（防止房间被删后无效写入）
  const room = await getRoomById(room_id);
  if (!room) {
    console.warn(`[recordingTimeout] session ${session_id} 对应房间 ${room_id} 不存在，跳过`);
    await markSessionAutoFinished(session_id);
    return;
  }

  const videoId = uuidv4();
  // displayName 使用兜底名称，用户可后续重命名
  const displayName = `录制（自动收尾 ${new Date().toLocaleString('zh-CN')}）`;

  await addRoomVideo(videoId, room_id, hlsPrefix, displayName, user_id);
  // duration 未知（客户端未上报），写 0 即可；generateM3u8 会使用固定 HLS_SEGMENT_DURATION
  await updateHlsStatus(videoId, 'ready', hlsPrefix);

  console.log(
    `[recordingTimeout] 自动收尾完成：session=${session_id} videoId=${videoId}` +
    ` segments=${segmentKeys.length} hlsPrefix=${hlsPrefix}`,
  );

  // 广播 VIDEO_ADDED，房间内在线成员实时看到视频
  try {
    broadcast(room_id, {
      type: 'VIDEO_ADDED',
      data: {
        id: videoId,
        objectKey: hlsPrefix,
        m3u8ObjectKey: hlsPrefix,
        videoUrl: `/api/rooms/${room_id}/videos/${videoId}/m3u8`,
        fileName: displayName,
        uploaderId: user_id,
        createdAt: Date.now(),
      },
    });
  } catch (e) {
    // 广播失败不影响数据写入，下次用户进房间会通过 HTTP 拉取视频列表
    console.warn(`[recordingTimeout] 广播 VIDEO_ADDED 失败：`, (e as Error).message);
  }

  await markSessionAutoFinished(session_id);
}

/**
 * 执行一轮超时扫描。
 */
async function runTimeoutCheck(): Promise<void> {
  let sessions;
  try {
    sessions = await getTimedOutSessions(SESSION_TIMEOUT_MS);
  } catch (err) {
    console.error('[recordingTimeout] 查询超时 session 失败：', (err as Error).message);
    return;
  }

  if (sessions.length === 0) return;

  console.log(`[recordingTimeout] 发现 ${sessions.length} 个超时 session，开始自动收尾`);

  for (const session of sessions) {
    try {
      await autoFinishSession(session);
    } catch (err) {
      console.error(`[recordingTimeout] session ${session.session_id} 自动收尾失败：`, (err as Error).message);
      // 单个失败不影响其他 session，继续处理
    }
  }
}

/**
 * 启动录制超时自动收尾定时任务。
 * 在 app.ts 的 start() 中调用。
 * 立即执行一次（处理服务重启前积压的超时 session），之后每 3 分钟执行一次。
 */
export function scheduleRecordingTimeoutJob(): void {
  console.log(`[recordingTimeout] 定时任务已注册，间隔 ${SCAN_INTERVAL_MS / 1000}s`);

  // 服务启动时立即跑一次，处理上次服务宕机遗留的超时 session
  void runTimeoutCheck();

  setInterval(() => {
    void runTimeoutCheck();
  }, SCAN_INTERVAL_MS);
}
