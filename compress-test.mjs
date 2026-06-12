/**
 * 临时转码测试脚本（用完删除）
 *
 * 启动：node compress-test.mjs
 * 然后打开 http://localhost:4000 选择视频上传
 * 生成一份测试文件（720p 30fps CRF 38，加关键帧参数）
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
  body { font-family: system-ui, sans-serif; max-width: 560px; margin: 60px auto; padding: 0 20px; color: #222; }
  h2 { margin-bottom: 8px; }
  p.hint { color: #666; font-size: 14px; margin-bottom: 24px; }
  input[type=file] { display: block; margin-bottom: 16px; }
  button { padding: 10px 28px; background: #1677ff; color: #fff; border: none; border-radius: 6px; font-size: 15px; cursor: pointer; }
  button:disabled { background: #aaa; cursor: not-allowed; }
  #status { margin-top: 24px; font-size: 14px; white-space: pre-wrap; background: #f5f5f5; padding: 14px; border-radius: 6px; min-height: 60px; }
</style>
</head>
<body>
<h2>CoWatch 本地转码测试</h2>
<p class="hint">上传后输出一份（720p 30fps CRF 38，加 -g 120 关键帧参数）。<br>
输出到 <code>compress-output/</code> 目录，转码期间页面请勿关闭。</p>

<input type="file" id="file" accept="video/*">
<button id="btn" onclick="upload()">开始转码</button>
<div id="status">等待上传...</div>

<script>
async function upload() {
  const file = document.getElementById('file').files[0];
  if (!file) { alert('请先选择视频文件'); return; }

  const btn = document.getElementById('btn');
  const status = document.getElementById('status');
  btn.disabled = true;
  status.textContent = '上传中，请稍候...';

  const fd = new FormData();
  fd.append('video', file);

  try {
    const res = await fetch('/compress', { method: 'POST', body: fd });
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
    btn.disabled = false;
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
      // 找到文件数据部分
      const boundaryBuf = Buffer.from(boundary);
      let start = -1;
      // 跳过 header，找到空行（\r\n\r\n）后的数据起点
      const headerEnd = buf.indexOf(Buffer.from('\r\n\r\n'));
      if (headerEnd === -1) return reject(new Error('找不到 multipart header 结束位置'));
      start = headerEnd + 4;
      // 找结束 boundary
      const endBoundary = Buffer.from('\r\n' + boundary + '--');
      const endIdx = buf.indexOf(endBoundary, start);
      if (endIdx === -1) return reject(new Error('找不到 multipart 结束标记'));
      const fileData = buf.slice(start, endIdx);

      // 从 header 中提取原始文件名
      const header = buf.slice(0, headerEnd).toString();
      const nameMatch = header.match(/filename="(.+?)"/);
      const originalName = nameMatch ? nameMatch[1] : 'upload.mp4';

      resolve({ data: fileData, originalName });
    });
    req.on('error', reject);
  });
}

// ─── 运行 ffmpeg，返回 Promise ────────────────────────────────────────────────
function runFfmpeg(inputPath, outputPath, crf) {
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
      // 强制关键帧间隔 2s（60fps→120帧），确保后端 -c copy 切片可在 10s 内找到关键帧
      '-g', '120',
      '-keyint_min', '120',
      '-sc_threshold', '0',
      '-y',
      outputPath,
    ];
    console.log(`[ffmpeg] 720p-30fps CRF ${crf} → ${path.basename(outputPath)}`);
    const proc = spawn('ffmpeg', args);
    proc.stderr.on('data', (d) => process.stdout.write(d));
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg 退出码 ${code}`));
    });
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
  // GET / → 返回 HTML 页面
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(PAGE_HTML);
    return;
  }

  // POST /compress → 接收上传，转码
  if (req.method === 'POST' && req.url === '/compress') {
    try {
      console.log('[compress] 接收上传文件...');
      const { data, originalName } = await parseMultipart(req);
      fs.writeFileSync(TMP_PATH, data);
      console.log(`[compress] 文件保存完毕，大小 ${formatSize(TMP_PATH)}，开始并行转码...`);

      const baseName = path.basename(originalName, path.extname(originalName));
      const presets = [
        { preset: 'dev-min', crf: 38 },
      ];

      // 串行转码（避免并行占满 CPU）
      for (let i = 0; i < presets.length; i++) {
        const { preset, crf } = presets[i];
        const outPath = path.join(OUTPUT_DIR, `${baseName}_${preset}_crf${crf}.mp4`);
        console.log(`[compress] 开始第 ${i + 1}/${presets.length} 份：${preset}（CRF ${crf}）`);
        await runFfmpeg(TMP_PATH, outPath, crf);
        console.log(`[compress] 第 ${i + 1}/${presets.length} 份完成`);
      }

      // 删除临时文件
      fs.unlink(TMP_PATH, () => {});

      const files = presets.map(({ preset, crf }) => {
        const outPath = path.join(OUTPUT_DIR, `${baseName}_${preset}_crf${crf}.mp4`);
        return { preset, crf, size: formatSize(outPath) };
      });

      console.log('[compress] 全部完成：', files);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, files }));
    } catch (err) {
      console.error('[compress] 出错：', err);
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
