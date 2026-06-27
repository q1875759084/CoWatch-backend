/**
 * 临时转码测试脚本（用完删除）
 *
 * 启动：node compress-test.mjs
 * 然后打开 http://localhost:4000 选择视频上传
 *
 * 提供六种转码模式（全部 CRF 30）：
 *   【dev-min】   720p 30fps CRF 38（体积小，转码快，日常开发用）
 *   【.bat 模拟】 原始分辨率/帧率 CRF 30 veryfast（与 Windows .bat 参数完全一致）
 *   【720p 30fps】Electron 录制默认档
 *   【720p 60fps】720p 高帧率
 *   【900p 30fps】中间档（1600×900）
 *   【900p 60fps】中间档高帧率
 *
 * 所有模式关键帧参数相同（-g 120 -keyint_min 120 -sc_threshold 0）
 * 输出到脚本同目录下的 compress-output/ 文件夹
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'compress-output');
const TMP_PATH = path.join(__dirname, 'compress-output', '_tmp_upload');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const PORT = 4001;

// ─── 内联 HTML 页面 ───────────────────────────────────────────────────────────
const PAGE_HTML = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>CoWatch 转码测试</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 700px; margin: 60px auto; padding: 0 20px; color: #222; }
  h2 { margin-bottom: 8px; }
  p.hint { color: #666; font-size: 14px; margin-bottom: 24px; line-height: 1.6; }
  input[type=file] { display: block; margin-bottom: 20px; }
  .btn-group { margin-bottom: 16px; }
  .btn-group-label { font-size: 12px; color: #999; margin-bottom: 6px; }
  .btn-row { display: flex; gap: 10px; margin-bottom: 6px; }
  button { flex: 1; padding: 10px 0; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-util { background: #f0f0f0; color: #444; }
  .btn-720-30 { background: #1677ff; color: #fff; }
  .btn-720-60 { background: #0958d9; color: #fff; }
  .btn-900-30 { background: #389e0d; color: #fff; }
  .btn-900-60 { background: #237804; color: #fff; }
  #status { margin-top: 16px; font-size: 14px; white-space: pre-wrap; background: #f5f5f5; padding: 14px; border-radius: 6px; min-height: 60px; }
</style>
</head>
<body>
<h2>CoWatch 本地转码测试</h2>
<p class="hint">
  选择视频后点击对应档位转码，输出文件在脚本目录 compress-output/ 下，直接用播放器打开对比。<br>
  720p / 900p 档位均使用 <b>CRF 30 / fast preset</b>，与 Electron 录制参数一致。<br>
  注意：60fps 源视频才有意义，30fps 源视频转 60fps 无效果。
</p>

<input type="file" id="file" accept="video/*">

<div class="btn-group">
  <div class="btn-group-label">辅助工具</div>
  <div class="btn-row">
    <button class="btn-util" onclick="upload('/compress')">dev-min（720p CRF38，开发用）</button>
    <button class="btn-util" onclick="upload('/compress-bat')">.bat 模拟（原始分辨率 CRF30）</button>
  </div>
</div>

<div class="btn-group">
  <div class="btn-group-label">720p — CRF 30</div>
  <div class="btn-row">
    <button class="btn-720-30" onclick="upload('/compress-720-30')">720p · 30fps</button>
    <button class="btn-720-60" onclick="upload('/compress-720-60')">720p · 60fps</button>
  </div>
</div>

<div class="btn-group">
  <div class="btn-group-label">900p (1600×900) — CRF 30</div>
  <div class="btn-row">
    <button class="btn-900-30" onclick="upload('/compress-900-30')">900p · 30fps</button>
    <button class="btn-900-60" onclick="upload('/compress-900-60')">900p · 60fps</button>
  </div>
</div>

<div id="status">等待上传...</div>

<script>
async function upload(endpoint) {
  const file = document.getElementById('file').files[0];
  if (!file) { alert('请先选择视频文件'); return; }

  const buttons = document.querySelectorAll('button');
  const status = document.getElementById('status');
  buttons.forEach(b => b.disabled = true);
  status.textContent = '上传中，请稍候...';

  const fd = new FormData();
  fd.append('video', file);

  try {
    const res = await fetch(endpoint, { method: 'POST', body: fd });
    const json = await res.json();
    if (json.ok) {
      status.textContent = '✅ 转码完成！\\n\\n' + json.files.map(f =>
        f.preset + '（CRF ' + f.crf + '）：' + f.size
      ).join('\\n');
    } else {
      status.textContent = '❌ 失败：' + json.error;
    }
  } catch(e) {
    status.textContent = '❌ 请求出错：' + e.message;
  } finally {
    buttons.forEach(b => b.disabled = false);
  }
}
</script>
</body>
</html>`;

// ─── 解析 multipart/form-data（不引入 multer，纯 Node 实现）────────────────────
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) return reject(new Error('无法解析 boundary'));

    const boundary = '--' + boundaryMatch[1];
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      const headerEnd = buf.indexOf(Buffer.from('\r\n\r\n'));
      if (headerEnd === -1) return reject(new Error('找不到 multipart header 结束位置'));
      const start = headerEnd + 4;
      const endBoundary = Buffer.from('\r\n' + boundary + '--');
      const endIdx = buf.indexOf(endBoundary, start);
      if (endIdx === -1) return reject(new Error('找不到 multipart 结束标记'));
      const fileData = buf.slice(start, endIdx);
      const header = buf.slice(0, headerEnd).toString();
      const nameMatch = header.match(/filename="(.+?)"/);
      const originalName = nameMatch ? nameMatch[1] : 'upload.mp4';
      resolve({ data: fileData, originalName });
    });
    req.on('error', reject);
  });
}

// ─── 通用 ffmpeg runner ───────────────────────────────────────────────────────

/**
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {object} opts
 * @param {number} opts.height      - 输出高度（720 / 900），宽度按比例缩放（-2:height）
 * @param {number} opts.fps         - 帧率（30 / 60）
 * @param {number} opts.crf         - CRF 值
 * @param {string} [opts.preset]    - libx264 preset，默认 fast
 * @param {boolean} [opts.keepRes]  - true 时不缩放（原始分辨率），忽略 height
 */
function runFfmpeg(inputPath, outputPath, opts) {
  const { height, fps, crf, preset = 'fast', keepRes = false } = opts;
  return new Promise((resolve, reject) => {
    const args = ['-i', inputPath];
    if (!keepRes) {
      args.push('-vf', `scale=-2:${height}`);
    }
    args.push(
      '-r', String(fps),
      '-c:v', 'libx264',
      '-crf', String(crf),
      '-preset', preset,
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-g', '120',
      '-keyint_min', '120',
      '-sc_threshold', '0',
      '-y',
      outputPath,
    );
    const label = keepRes
      ? `原始分辨率 ${fps}fps CRF${crf} ${preset}`
      : `${height}p ${fps}fps CRF${crf} ${preset}`;
    console.log(`[ffmpeg] ${label} → ${path.basename(outputPath)}`);
    const proc = spawn('ffmpeg', args);
    proc.stderr.on('data', (d) => process.stdout.write(d));
    proc.on('close', (code) => { if (code === 0) resolve(); else reject(new Error(`ffmpeg 退出码 ${code}`)); });
    proc.on('error', reject);
  });
}

function formatSize(filePath) {
  try {
    const bytes = fs.statSync(filePath).size;
    if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + ' GB';
    if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  } catch { return '未知'; }
}

// ─── 路由表 ───────────────────────────────────────────────────────────────────

const ROUTES = {
  '/compress': {
    label: 'dev-min',
    ffmpegOpts: { height: 720, fps: 30, crf: 38, preset: 'fast' },
    suffix: '_dev-min_crf38',
  },
  '/compress-bat': {
    label: 'bat-sim',
    ffmpegOpts: { height: null, fps: 30, crf: 30, preset: 'veryfast', keepRes: true },
    suffix: '_bat-sim_crf30',
  },
  '/compress-720-30': {
    label: '720p-30fps',
    ffmpegOpts: { height: 720, fps: 30, crf: 30, preset: 'fast' },
    suffix: '_720p_30fps_crf30',
  },
  '/compress-720-60': {
    label: '720p-60fps',
    ffmpegOpts: { height: 720, fps: 60, crf: 30, preset: 'fast' },
    suffix: '_720p_60fps_crf30',
  },
  '/compress-900-30': {
    label: '900p-30fps',
    ffmpegOpts: { height: 900, fps: 30, crf: 30, preset: 'fast' },
    suffix: '_900p_30fps_crf30',
  },
  '/compress-900-60': {
    label: '900p-60fps',
    ffmpegOpts: { height: 900, fps: 60, crf: 30, preset: 'fast' },
    suffix: '_900p_60fps_crf30',
  },
};

// ─── HTTP Server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(PAGE_HTML);
    return;
  }

  const route = ROUTES[req.url];
  if (req.method === 'POST' && route) {
    try {
      console.log(`[${route.label}] 接收上传文件...`);
      const { data, originalName } = await parseMultipart(req);
      fs.writeFileSync(TMP_PATH, data);
      console.log(`[${route.label}] 文件大小 ${formatSize(TMP_PATH)}，开始转码...`);

      const baseName = path.basename(originalName, path.extname(originalName));
      const outPath = path.join(OUTPUT_DIR, `${baseName}${route.suffix}.mp4`);
      await runFfmpeg(TMP_PATH, outPath, route.ffmpegOpts);
      fs.unlink(TMP_PATH, () => {});

      const files = [{ preset: route.label, crf: route.ffmpegOpts.crf, size: formatSize(outPath) }];
      console.log(`[${route.label}] 完成：`, files);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, files }));
    } catch (err) {
      console.error(`[${route.label}] 出错：`, err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`✅ 转码测试服务启动：http://localhost:${PORT}`);
  console.log(`   输出目录：${OUTPUT_DIR}`);
  console.log('   用完后删除 compress-test.mjs 和 compress-output/ 即可');
});
