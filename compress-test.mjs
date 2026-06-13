/**
 * 临时转码测试脚本（用完删除）
 *
 * 启动：node compress-test.mjs
 * 然后打开 http://localhost:4000 选择视频上传
 *
 * 提供两种转码模式：
 *   【dev-min】  720p 30fps CRF 38（体积小，转码快，日常开发用）
 *   【.bat 模拟】原始分辨率/帧率 CRF 30 veryfast（与 Windows .bat 参数完全一致，模拟真实用户场景）
 *
 * 两种模式关键帧参数相同（-g 120 -keyint_min 120 -sc_threshold 0），切片行为可对比。
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

const PORT = 4000;

// ─── 内联 HTML 页面 ───────────────────────────────────────────────────────────
const PAGE_HTML = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>CoWatch 转码测试</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 600px; margin: 60px auto; padding: 0 20px; color: #222; }
  h2 { margin-bottom: 8px; }
  p.hint { color: #666; font-size: 14px; margin-bottom: 24px; line-height: 1.6; }
  input[type=file] { display: block; margin-bottom: 20px; }
  .btn-row { display: flex; gap: 12px; margin-bottom: 8px; }
  button { flex: 1; padding: 10px 0; border: none; border-radius: 6px; font-size: 15px; cursor: pointer; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  #btn-dev  { background: #1677ff; color: #fff; }
  #btn-bat  { background: #389e0d; color: #fff; }
  .btn-hint { font-size: 12px; color: #999; display: flex; gap: 12px; margin-bottom: 20px; }
  .btn-hint span { flex: 1; text-align: center; }
  #status { margin-top: 16px; font-size: 14px; white-space: pre-wrap; background: #f5f5f5; padding: 14px; border-radius: 6px; min-height: 60px; }
</style>
</head>
<body>
<h2>CoWatch 本地转码测试</h2>
<p class="hint">
  选择视频后选择转码模式：<br>
  · <b>dev-min</b>：720p/30fps/CRF38，体积小转码快，日常开发调试用<br>
  · <b>.bat 模拟</b>：原始分辨率/帧率/CRF30/veryfast，与 Windows .bat 参数完全一致，模拟真实用户上传场景<br>
  两种模式关键帧参数相同，服务端切片行为可对比。
</p>

<input type="file" id="file" accept="video/*">
<div class="btn-row">
  <button id="btn-dev" onclick="upload('/compress')">dev-min 转码</button>
  <button id="btn-bat" onclick="upload('/compress-bat')">.bat 模拟转码</button>
</div>
<div class="btn-hint">
  <span>720p · 30fps · CRF 38</span>
  <span>原始分辨率 · 原始帧率 · CRF 30 · veryfast</span>
</div>
<div id="status">等待上传...</div>

<script>
async function upload(endpoint) {
  const file = document.getElementById('file').files[0];
  if (!file) { alert('请先选择视频文件'); return; }

  const btnDev = document.getElementById('btn-dev');
  const btnBat = document.getElementById('btn-bat');
  const status = document.getElementById('status');
  btnDev.disabled = true;
  btnBat.disabled = true;
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
    btnDev.disabled = false;
    btnBat.disabled = false;
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

// ─── 运行 ffmpeg ──────────────────────────────────────────────────────────────

/**
 * dev-min 模式：720p 30fps CRF 38，体积小，转码快，日常开发用
 */
function runFfmpegDev(inputPath, outputPath, crf) {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', inputPath,
      '-vf', 'scale=-2:720',
      '-r', '30',
      '-c:v', 'libx264',
      '-crf', String(crf),
      '-preset', 'fast',
      '-c:a', 'aac',
      '-b:a', '96k',
      '-movflags', '+faststart',
      '-g', '120',
      '-keyint_min', '120',
      '-sc_threshold', '0',
      '-y',
      outputPath,
    ];
    console.log(`[ffmpeg:dev] 720p-30fps CRF ${crf} → ${path.basename(outputPath)}`);
    const proc = spawn('ffmpeg', args);
    proc.stderr.on('data', (d) => process.stdout.write(d));
    proc.on('close', (code) => { if (code === 0) resolve(); else reject(new Error(`ffmpeg 退出码 ${code}`)); });
    proc.on('error', reject);
  });
}

/**
 * .bat 模拟模式：原始分辨率/帧率 CRF 30 veryfast
 * 与 Windows compress_30.bat 参数完全一致，模拟真实用户上传场景
 */
function runFfmpegBat(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', inputPath,
      '-c:v', 'libx264',
      '-crf', '30',
      '-preset', 'veryfast',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-g', '120',
      '-keyint_min', '120',
      '-sc_threshold', '0',
      '-y',
      outputPath,
    ];
    console.log(`[ffmpeg:bat] 原始分辨率 CRF 30 veryfast → ${path.basename(outputPath)}`);
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

// ─── HTTP Server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(PAGE_HTML);
    return;
  }

  // dev-min 模式
  if (req.method === 'POST' && req.url === '/compress') {
    try {
      console.log('[compress:dev] 接收上传文件...');
      const { data, originalName } = await parseMultipart(req);
      fs.writeFileSync(TMP_PATH, data);
      console.log(`[compress:dev] 文件大小 ${formatSize(TMP_PATH)}，开始转码...`);

      const baseName = path.basename(originalName, path.extname(originalName));
      const crf = 38;
      const outPath = path.join(OUTPUT_DIR, `${baseName}_dev-min_crf${crf}.mp4`);
      await runFfmpegDev(TMP_PATH, outPath, crf);
      fs.unlink(TMP_PATH, () => {});

      const files = [{ preset: 'dev-min', crf, size: formatSize(outPath) }];
      console.log('[compress:dev] 完成：', files);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, files }));
    } catch (err) {
      console.error('[compress:dev] 出错：', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  // .bat 模拟模式
  if (req.method === 'POST' && req.url === '/compress-bat') {
    try {
      console.log('[compress:bat] 接收上传文件...');
      const { data, originalName } = await parseMultipart(req);
      fs.writeFileSync(TMP_PATH, data);
      console.log(`[compress:bat] 文件大小 ${formatSize(TMP_PATH)}，开始转码（原始分辨率 CRF30 veryfast）...`);

      const baseName = path.basename(originalName, path.extname(originalName));
      const outPath = path.join(OUTPUT_DIR, `${baseName}_bat-sim_crf30.mp4`);
      await runFfmpegBat(TMP_PATH, outPath);
      fs.unlink(TMP_PATH, () => {});

      const files = [{ preset: 'bat-sim', crf: 30, size: formatSize(outPath) }];
      console.log('[compress:bat] 完成：', files);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, files }));
    } catch (err) {
      console.error('[compress:bat] 出错：', err);
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
