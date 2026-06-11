import os from 'os';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import ffmpegBin from 'ffmpeg-static';
import { getRoomVideoById, updateHlsStatus } from '../database/roomVideo/index.js';
import {
  isOssEnabled,
  uploadHlsSegment,
  getHlsSegmentSignedUrl,
  listHlsSegments,
} from './ossService.js';

/**
 * HLS 切片目标时长（秒）
 *
 * 15 秒：seek 精度与请求数的平衡点。
 * 1 小时视频 ≈ 240 个片段，每片 ~7.5MB（1080p60 30CRF），seek 只需下载 1 片。
 */
const HLS_SEGMENT_DURATION = 15;

// ─── ffmpeg 执行 ──────────────────────────────────────────────────────────────

/**
 * 调用系统 ffmpeg 将视频切片为 HLS .ts 格式。
 *
 * 使用 -c copy（无重编码），切片速度极快（通常 < 5s/视频小时）。
 * 前端已预先转码为 1080p60 30CRF mp4，此处仅做字节级切割。
 *
 * @param inputPath   ffmpeg -i 输入：COS 带签名 URL（COS 模式）或本地文件路径（本地模式）
 * @param tmpDir      临时输出目录（已由调用方创建）
 * @returns           生成的 m3u8 本地路径（`{tmpDir}/index.m3u8`）
 */
function runFfmpeg(inputPath: string, tmpDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const segmentPattern = path.join(tmpDir, 'seg%03d.ts');
    const m3u8Path = path.join(tmpDir, 'index.m3u8');

    const args = [
      '-i', inputPath,
      '-c', 'copy',
      '-f', 'hls',
      '-hls_time', String(HLS_SEGMENT_DURATION),
      '-hls_list_size', '0',
      '-hls_segment_filename', segmentPattern,
      m3u8Path,
    ];

    // ffmpeg-static 返回 string | null，null 时降级到系统 PATH 中的 ffmpeg
    const ffmpegPath: string = (ffmpegBin as unknown as string | null) ?? 'ffmpeg';
    console.log('[hlsService] ffmpeg 开始切片：', inputPath);
    const proc = spawn(ffmpegPath, args);

    const stderr: string[] = [];
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr.push(chunk.toString());
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log('[hlsService] ffmpeg 切片完成');
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
 * 将 mp4 文件通过 ffmpeg -c copy 切片，
 * 生成 .ts 片段并上传到 COS（COS 模式）或写入本地目录（本地模式），
 * 最后更新 room_videos 的 hls_* 字段。
 *
 * 此函数为异步后台任务，调用方 fire-and-forget；
 * 切片完成后由调用方负责广播 VIDEO_ADDED。
 *
 * @param videoId      room_videos.id
 * @param inputPath    ffmpeg 输入：
 *                       - COS 模式（proxyUpload）：/tmp/cowatch-{uuid}.mp4（临时文件绝对路径）
 *                       - 本地模式（uploadLocal）：objectKey 相对路径（相对于 uploadsDir）
 * @param hlsPrefix    切片目录前缀，如 cowatch/{roomId}/{uuid}/
 * @param onDone       切片完成回调，调用方在此处广播 VIDEO_ADDED
 * @param onError      切片失败回调
 * @param uploadsDir   本地模式：uploads 目录的绝对路径（COS 模式传 undefined）
 * @param isTmpFile    true 时，切片完成或失败后删除 inputPath 临时文件（COS 模式使用）
 */
export async function transcodeToHls(
  videoId: string,
  inputPath: string,
  hlsPrefix: string,
  onDone: () => void,
  onError: (err: Error) => void,
  uploadsDir?: string,
  isTmpFile = false,
): Promise<void> {
  const tmpDir = path.join(os.tmpdir(), `cowatch-hls-${videoId}`);

  try {
    // 1. 创建临时目录
    fs.mkdirSync(tmpDir, { recursive: true });

    // 2. 确定 ffmpeg 输入路径
    let ffmpegInput: string;
    if (isOssEnabled()) {
      // COS 模式：inputPath 已是临时文件的绝对路径，直接使用，无需网络请求
      ffmpegInput = inputPath;
    } else {
      // 本地模式：inputPath 为 objectKey 相对路径，需拼接 uploadsDir
      if (!uploadsDir) {
        throw new Error('[hlsService] 本地模式下 uploadsDir 不能为空');
      }
      ffmpegInput = path.join(uploadsDir, inputPath);
    }

    // 3. 执行 ffmpeg 切片
    await runFfmpeg(ffmpegInput, tmpDir);

    // 4. 收集切片结果
    const tsFiles = fs.readdirSync(tmpDir)
      .filter((f) => f.endsWith('.ts'))
      .sort(); // 保证顺序：seg000.ts, seg001.ts, ...

    if (tsFiles.length === 0) {
      throw new Error('[hlsService] ffmpeg 未生成任何 .ts 片段，请检查输入文件格式');
    }

    if (isOssEnabled()) {
      // 5a. COS 模式：逐个上传 .ts 文件到 COS（串行，避免带宽爆炸）
      for (const tsFile of tsFiles) {
        const localPath = path.join(tmpDir, tsFile);
        const cosKey = `${hlsPrefix}${tsFile}`; // 如 cowatch/roomId/uuid/seg000.ts
        await uploadHlsSegment(cosKey, localPath);
        console.log(`[hlsService] 已上传片段: ${cosKey}`);
      }
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

    // 6. 更新 DB 状态
    updateHlsStatus(videoId, hlsPrefix, 'done');
    console.log(`[hlsService] 视频 ${videoId} 切片完成，hlsPrefix=${hlsPrefix}`);

    // 7. 通知调用方广播 VIDEO_ADDED
    onDone();

  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[hlsService] 视频 ${videoId} 切片失败：`, error.message);
    updateHlsStatus(videoId, '', 'error');
    onError(error);
  } finally {
    // 清理切片临时目录（本地模式下 .ts 已 rename 走，tmpDir 为空；COS 模式下需清理）
    fs.rm(tmpDir, { recursive: true, force: true }, (rmErr) => {
      if (rmErr) console.warn('[hlsService] 临时目录清理失败：', rmErr.message);
    });
    // COS 模式：删除 proxyUpload 落盘的原始临时文件
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
 * 每次请求此接口都会重新生成，片段签名 URL 含 2 小时有效期，
 * 跨天复盘时前端重新请求即可刷新签名，缓存仍通过 SW 的 cache-first 命中。
 *
 * @param videoId    room_videos.id
 * @param uploadsDir 本地模式：uploads 目录的绝对路径
 * @returns         m3u8 文本字符串
 */
export async function generateM3u8(
  videoId: string,
  uploadsDir?: string,
): Promise<string> {
  const video = getRoomVideoById(videoId);
  if (!video) {
    const err = new Error(`视频不存在: ${videoId}`);
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }

  if (video.hls_status !== 'done' || !video.hls_prefix) {
    const err = new Error('视频切片尚未完成，请稍候');
    (err as NodeJS.ErrnoException).code = '425';
    throw err;
  }

  const hlsPrefix = video.hls_prefix;
  let segmentKeys: string[];

  if (isOssEnabled()) {
    // COS 模式：列举 COS 上的片段
    segmentKeys = await listHlsSegments(hlsPrefix);
  } else {
    // 本地模式：读取本地目录
    if (!uploadsDir) throw new Error('[hlsService] 本地模式下 uploadsDir 不能为空');
    const hlsLocalDir = path.join(uploadsDir, hlsPrefix);
    segmentKeys = fs.readdirSync(hlsLocalDir)
      .filter((f) => f.endsWith('.ts'))
      .sort()
      .map((f) => `${hlsPrefix}${f}`);
  }

  if (segmentKeys.length === 0) {
    throw new Error('[hlsService] HLS 片段列表为空，切片可能不完整');
  }

  // 为每个片段生成带签名的访问 URL
  const signedUrls = await Promise.all(
    segmentKeys.map((key) =>
      isOssEnabled()
        ? getHlsSegmentSignedUrl(key)
        : Promise.resolve(`/uploads/${key}`), // 本地模式直接走静态服务
    ),
  );

  // 拼装标准 HLS m3u8 格式
  const lines: string[] = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    `#EXT-X-TARGETDURATION:${HLS_SEGMENT_DURATION}`,
    '#EXT-X-MEDIA-SEQUENCE:0',
  ];

  for (const url of signedUrls) {
    lines.push(`#EXTINF:${HLS_SEGMENT_DURATION}.000000,`);
    lines.push(url);
  }

  lines.push('#EXT-X-ENDLIST');

  return lines.join('\n') + '\n';
}
