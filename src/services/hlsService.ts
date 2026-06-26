import os from 'os';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { getRoomVideoById, updateHlsStatus } from '../database/roomVideo/index.js';
import {
  isOnlineMode,
  uploadHlsSegment,
  listHlsSegments,
} from './ossService.js';

/**
 * HLS 切片目标时长（秒）
 *
 * 10 秒：seek 精度与请求数的平衡点。
 * 1 小时视频 ≈ 360 个片段，每片 ~5MB（1080p60 30CRF），seek 平均多下载 5s。
 */
const HLS_SEGMENT_DURATION = 10;

// ─── 串行转码队列 ──────────────────────────────────────────────────────────────
//
// 背景：pro 房间支持前端直传原始视频，后端用 libx264（CRF 30 veryfast）转码。
//
// 服务器环境（2026-06-23 确认）：
//   OS        Ubuntu 24.04 LTS x86_64
//   ffmpeg    系统自带 v6.1.1（/usr/bin/ffmpeg），libx264 可用
//   CPU       4 核
//   内存      3.6 GB 总量，可用约 2.1 GB
//   磁盘      根分区 59 GB，已用 39 GB，剩余 18 GB（/tmp 挂载在根分区）
//
// ── 风险一：CPU ────────────────────────────────────────────────────────────────
//   libx264 veryfast 单任务约占 1–2 核，速度约 5–8x 实时。
//   并发转码时 CPU 打满，HTTP/WS 请求响应延迟上升，WS 心跳可能超时断连。
//   → 串行队列保证同一时刻只有一个转码任务运行，-c copy 任务不受此限制。
//
// ── 风险二：内存 ───────────────────────────────────────────────────────────────
//   ffmpeg 为流式处理，不会将整个文件读入内存；
//   实际占用取决于 GOP 大小（-g 300 = 5s@60fps），约 几十~几百 MB，与文件大小无关。
//   → 内存不是主要风险，当前串行队列已足够保护。
//
// ── 风险三：磁盘 ───────────────────────────────────────────────────────────────
//   转码期间 /tmp 同时存在原始文件（最大 3 GB）+ 输出 .ts 片段目录（边写边产生）。
//   串行队列下，若队列中堆积 N 个任务，则 /tmp 最多同时有 N×3 GB 原始文件：
//     - 任务完成后 isTmpFile=true 立即清理原始临时文件，.ts 片段上传 COS 后也会清理
//     - 当前剩余 18 GB，2 个排队任务峰值约占 6~7 GB，仍安全
//     - 若磁盘使用率继续上升（>90%）或高频并发上传，需关注磁盘空间
//   → 当前无需额外处理，后续可考虑在入队前检查磁盘剩余空间并拒绝请求。
//
// 用一个简单的 Promise 链实现串行队列：同一时刻只有一个转码任务在跑，
// 其余任务排队等待，不影响文件上传响应（文件落盘即立即响应前端，转码异步进行）。

let transcodeQueue = Promise.resolve();

/**
 * 将 fn 加入串行转码队列。返回的 Promise 在 fn 执行完成（或失败）后 resolve/reject。
 */
function enqueueTranscode<T>(fn: () => Promise<T>): Promise<T> {
  let resolveNext!: (value: T) => void;
  let rejectNext!: (reason: unknown) => void;
  const result = new Promise<T>((res, rej) => {
    resolveNext = res;
    rejectNext = rej;
  });

  transcodeQueue = transcodeQueue.then(() =>
    fn().then(resolveNext, rejectNext),
  );

  return result;
}

// ─── ffmpeg 执行 ──────────────────────────────────────────────────────────────

/**
 * 调用系统 ffmpeg 将视频切片（或先转码再切片）为 HLS .ts 格式。
 *
 * transcode = false（默认）：
 *   使用 -c copy（无重编码），切片速度极快（通常 < 5s/视频小时）。
 *   前端已预先转码为 1080p60 30CRF mp4，此处仅做字节级切割。
 *
 * transcode = true（pro 房间，原始视频直传）：
 *   先用 libx264 重新编码再切片，参数对齐 compress_30.bat：
 *     -c:v libx264 -crf 30 -preset veryfast
 *     -pix_fmt yuv420p（兼容 10bit 源文件）
 *     -c:a aac -b:a 128k
 *     -movflags +faststart
 *     -g 300 -keyint_min 300 -sc_threshold 0（固定 GOP，保证 HLS 切片对齐关键帧）
 *
 * @param inputPath   ffmpeg -i 输入路径
 * @param tmpDir      临时输出目录（已由调用方创建）
 * @param transcode   true = 先转码再切片；false = 仅 -c copy 切片
 */
function runFfmpeg(inputPath: string, tmpDir: string, transcode: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const segmentPattern = path.join(tmpDir, 'seg%03d.ts');
    const m3u8Path = path.join(tmpDir, 'index.m3u8');

    let args: string[];

    if (transcode) {
      // 转码 + 切片：参数与 compress_30.bat 保持一致
      args = [
        '-i', inputPath,
        '-c:v', 'libx264',
        '-crf', '30',
        '-preset', 'veryfast',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-g', '300',
        '-keyint_min', '300',
        '-sc_threshold', '0',
        '-f', 'hls',
        '-hls_time', String(HLS_SEGMENT_DURATION),
        '-hls_list_size', '0',
        '-hls_segment_filename', segmentPattern,
        '-y',
        m3u8Path,
      ];
      console.log('[hlsService] ffmpeg 开始转码+切片：', inputPath);
    } else {
      // 仅切片（-c copy）
      args = [
        '-i', inputPath,
        '-c', 'copy',
        '-f', 'hls',
        '-hls_time', String(HLS_SEGMENT_DURATION),
        '-hls_list_size', '0',
        '-hls_segment_filename', segmentPattern,
        m3u8Path,
      ];
      console.log('[hlsService] ffmpeg 开始切片：', inputPath);
    }

    // 系统 ffmpeg（Ubuntu apt / macOS brew install ffmpeg）
    const proc = spawn('ffmpeg', args);

    const stderr: string[] = [];
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr.push(chunk.toString());
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log('[hlsService] ffmpeg 完成');
        resolve();
      } else {
        const log = stderr.join('').slice(-2000); // 截取末尾 2000 字符，避免日志过长
        reject(new Error(`ffmpeg 退出码 ${code}：${log}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`ffmpeg 启动失败（是否已安装 ffmpeg？）：${err.message}`));
    });
  });
}

// ─── 核心切片流程 ──────────────────────────────────────────────────────────────

/**
 * 将视频文件通过 ffmpeg 切片（或先转码再切片）为 HLS .ts 格式，
 * 生成片段并上传到 COS（线上模式）或写入本地目录（本地模式），
 * 最后更新 room_videos 的 hls_* 字段。
 *
 * 此函数为异步后台任务，调用方 fire-and-forget；
 * 切片完成后由调用方负责广播 VIDEO_ADDED。
 *
 * @param videoId      room_videos.id
 * @param inputPath    ffmpeg 输入：
 *                       - 线上模式（proxyUpload）：/tmp/cowatch-{uuid}.mp4（临时文件绝对路径）
 *                       - 本地模式（uploadLocal）：objectKey 相对路径（相对于 uploadsDir）
 * @param hlsPrefix    切片目录前缀，如 cowatch/{roomId}/{uuid}/
 * @param onDone       切片完成回调，调用方在此处广播 VIDEO_ADDED
 * @param onError      切片失败回调
 * @param uploadsDir   本地模式：uploads 目录的绝对路径（线上模式传 undefined）
 * @param isTmpFile    true 时，切片完成或失败后删除 inputPath 临时文件（线上模式使用）
 * @param transcode    true = 先用 libx264（CRF 30 veryfast）转码再切片（pro 房间原始直传）
 *                     false（默认）= 仅 -c copy 切片（前端已预压缩）
 */
export async function transcodeToHls(
  videoId: string,
  inputPath: string,
  hlsPrefix: string,
  onDone: () => void,
  onError: (err: Error) => void,
  uploadsDir?: string,
  isTmpFile = false,
  transcode = false,
): Promise<void> {
  const tmpDir = path.join(os.tmpdir(), `cowatch-hls-${videoId}`);

  try {
    // 1. 创建临时目录
    fs.mkdirSync(tmpDir, { recursive: true });

    // 2. 确定 ffmpeg 输入路径
    let ffmpegInput: string;
    if (isOnlineMode()) {
      // 线上模式：inputPath 已是临时文件的绝对路径，直接使用，无需网络请求
      ffmpegInput = inputPath;
    } else {
      // 本地模式：inputPath 为 objectKey 相对路径，需拼接 uploadsDir
      if (!uploadsDir) {
        throw new Error('[hlsService] 本地模式下 uploadsDir 不能为空');
      }
      ffmpegInput = path.join(uploadsDir, inputPath);
    }

    // 3. 执行 ffmpeg
    //    transcode=true（原始视频）→ 排入串行队列，避免并发转码打满 CPU/内存
    //    transcode=false（已压缩）  → 直接跑，-c copy 极快不占资源
    const t0 = Date.now();
    if (transcode) {
      await enqueueTranscode(() => runFfmpeg(ffmpegInput, tmpDir, true));
    } else {
      await runFfmpeg(ffmpegInput, tmpDir, false);
    }
    const tFfmpeg = Date.now() - t0;

    // 4. 收集切片结果
    const tsFiles = fs.readdirSync(tmpDir)
      .filter((f) => f.endsWith('.ts'))
      .sort(); // 保证顺序：seg000.ts, seg001.ts, ...

    if (tsFiles.length === 0) {
      throw new Error('[hlsService] ffmpeg 未生成任何 .ts 片段，请检查输入文件格式');
    }

    console.log(`[hlsService] ffmpeg 切片耗时 ${tFfmpeg}ms，共 ${tsFiles.length} 个片段`);

    if (isOnlineMode()) {
      // 5a. 线上模式：并发上传 .ts 文件到 COS（并发数 5，兼顾速度与带宽）
      const tUploadStart = Date.now();
      const CONCURRENCY = 5;
      for (let i = 0; i < tsFiles.length; i += CONCURRENCY) {
        const batch = tsFiles.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(async (tsFile) => {
          const localPath = path.join(tmpDir, tsFile);
          const cosKey = `${hlsPrefix}${tsFile}`;
          await uploadHlsSegment(cosKey, localPath);
          console.log(`[hlsService] 已上传片段: ${cosKey}`);
        }));
      }
      console.log(`[hlsService] COS 上传耗时 ${Date.now() - tUploadStart}ms`);
    } else {
      // 5b. 本地模式：将 .ts 文件移动到 uploads/{hlsPrefix} 目录
      if (!uploadsDir) throw new Error('[hlsService] 本地模式下 uploadsDir 不能为空');
      const hlsLocalDir = path.join(uploadsDir, hlsPrefix);
      fs.mkdirSync(hlsLocalDir, { recursive: true });
      for (const tsFile of tsFiles) {
        fs.renameSync(
          path.join(tmpDir, tsFile),
          path.join(hlsLocalDir, tsFile),
        );
      }
      console.log(`[hlsService] 本地切片完成: ${hlsLocalDir}`);
    }

    // 6. 更新 DB 状态（异步）
    await updateHlsStatus(videoId, 'ready', hlsPrefix);
    console.log(`[hlsService] 视频 ${videoId} 切片完成，hlsPrefix=${hlsPrefix}`);

    // 7. 通知调用方广播 VIDEO_ADDED
    onDone();

  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[hlsService] 视频 ${videoId} 切片失败：`, error.message);
    await updateHlsStatus(videoId, 'error').catch(() => {});
    onError(error);
  } finally {
    // 清理切片临时目录（本地模式下 .ts 已 rename 走，tmpDir 为空；线上模式下需清理）
    fs.rm(tmpDir, { recursive: true, force: true }, (rmErr) => {
      if (rmErr) console.warn('[hlsService] 临时目录清理失败：', rmErr.message);
    });
    // 线上模式：删除 proxyUpload 落盘的原始临时文件
    if (isTmpFile) {
      fs.rm(inputPath, { force: true }, (rmErr) => {
        if (rmErr) console.warn('[hlsService] 临时文件清理失败：', rmErr.message);
        else console.log('[hlsService] 临时文件已清理：', inputPath);
      });
    }
  }
}

// ─── 动态 m3u8 生成 ────────────────────────────────────────────────────────────

/**
 * 动态生成 m3u8 内容（内存拼装，不存 COS）。
 *
 * 切片 URL 统一使用后端代理相对路径：
 *   /api/rooms/{roomId}/videos/{videoId}/segments/{segmentName}
 *
 * 好处：
 *   1. 渲染进程（浏览器 / Electron app://）不再直连 CDN，彻底消除跨域问题
 *   2. 权限校验集中在 getSegment 接口，CDN 签名仅在服务端生成，不暴露在 m3u8 文件中
 *   3. 统一 Web / Electron 行为，无需区分环境
 *
 * @param videoId    room_videos.id
 * @param roomId     所属房间 ID，用于拼装代理路径
 * @param uploadsDir 本地模式：uploads 目录的绝对路径（仅用于读取片段文件名列表）
 * @returns         m3u8 文本字符串
 */
export async function generateM3u8(
  videoId: string,
  roomId: string,
  uploadsDir?: string,
): Promise<string> {
  const video = await getRoomVideoById(videoId);
  if (!video) {
    const err = new Error(`视频不存在: ${videoId}`);
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }

  if (video.hls_status !== 'ready' || !video.hls_prefix) {
    const err = new Error('视频切片尚未完成，请稍候');
    (err as NodeJS.ErrnoException).code = '425';
    throw err;
  }

  const hlsPrefix = video.hls_prefix;
  let segmentNames: string[];

  if (isOnlineMode()) {
    // 线上模式：列举 COS 上的片段，取文件名部分（去掉前缀目录）
    const segmentKeys = await listHlsSegments(hlsPrefix);
    segmentNames = segmentKeys.map((key) => key.slice(hlsPrefix.length));
  } else {
    // 本地模式：读取本地目录
    if (!uploadsDir) throw new Error('[hlsService] 本地模式下 uploadsDir 不能为空');
    const hlsLocalDir = path.join(uploadsDir, hlsPrefix);
    segmentNames = fs.readdirSync(hlsLocalDir)
      .filter((f) => f.endsWith('.ts'))
      .sort();
  }

  if (segmentNames.length === 0) {
    throw new Error('[hlsService] HLS 片段列表为空，切片可能不完整');
  }

  // 切片 URL 统一为后端代理路径，渲染进程通过此路径请求，后端 302 重定向到 CDN/本地
  const segmentUrls = segmentNames.map(
    (name) => `/api/rooms/${roomId}/videos/${videoId}/segments/${name}`,
  );

  // 拼装标准 HLS m3u8 格式
  const lines: string[] = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    `#EXT-X-TARGETDURATION:${HLS_SEGMENT_DURATION}`,
    '#EXT-X-MEDIA-SEQUENCE:0',
  ];

  for (const url of segmentUrls) {
    lines.push(`#EXTINF:${HLS_SEGMENT_DURATION}.000000,`);
    lines.push(url);
  }

  lines.push('#EXT-X-ENDLIST');

  return lines.join('\n') + '\n';
}
