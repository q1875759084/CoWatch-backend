import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import COS from 'cos-nodejs-sdk-v5';

/**
 * 必要的线上模式环境变量清单
 *
 * 缺少其中任意一项，服务将无法正确存储或分发视频，
 * 必须在启动阶段 fatal exit（而非运行中悄悄降级）。
 */
const ONLINE_REQUIRED_VARS = [
  'COS_REGION',
  'COS_BUCKET',
  'COS_SECRET_ID',
  'COS_SECRET_KEY',
  'COS_BASE_URL',
  'CDN_AUTH_KEY',
] as const;

/**
 * 判断当前是否为线上模式（所有 COS/CDN 变量均已配置）
 *
 * 本地开发不填任何 COS_* / CDN_* 变量，自动使用本地文件存储 + /uploads 静态服务。
 * 线上部署必须注入全部变量；如有缺失请调用 validateOnlineConfig() 尽早终止进程。
 */
export function isOnlineMode(): boolean {
  return ONLINE_REQUIRED_VARS.every((v) => !!process.env[v]);
}

/**
 * 线上模式配置完整性校验（在 app.ts 启动阶段调用）
 *
 * - 所有必要变量都存在 → 打印就绪日志
 * - 任意一个缺失 → 列出缺失项并 process.exit(1)，阻止服务以错误配置启动
 *
 * 本地模式（所有变量均未配置）不触发此函数，保持静默通过。
 */
export function validateOnlineConfig(): void {
  const present = ONLINE_REQUIRED_VARS.filter((v) => !!process.env[v]);
  const missing = ONLINE_REQUIRED_VARS.filter((v) => !process.env[v]);

  // 要么全有（线上模式），要么全没有（本地模式），中间状态属于配置异常
  if (present.length === 0) {
    console.log('[ossService] 🏠 本地模式：使用本地文件存储，跳过 COS/CDN 配置校验');
    return;
  }

  if (missing.length > 0) {
    console.error('[ossService] ❌ 配置异常：COS/CDN 变量必须全部配置或全部不配置，当前缺失：', missing.join(', '));
    console.error('[ossService] 请补全所有线上模式所需变量后重新启动，服务即将退出。');
    process.exit(1);
  }

  console.log('[ossService] ☁️  线上模式：COS + CDN 配置完整，服务正常启动');
}

/**
 * 判断是否配置了 static 桶环境变量（头像上传）
 *
 * static 桶与视频桶共用同一套 COS 凭证，
 * 因此只要线上模式配置完整，static 桶也必然可用。
 */
function isStaticOssEnabled(): boolean {
  const { COS_STATIC_BUCKET, COS_REGION, COS_SECRET_ID, COS_SECRET_KEY } = process.env;
  return !!(COS_STATIC_BUCKET && COS_REGION && COS_SECRET_ID && COS_SECRET_KEY);
}

// ─── COS 客户端 ───────────────────────────────────────────────────────────────

/**
 * 内网加速依赖的地域
 *
 * COS SDK 的 Domain 模板硬编码为内网域名（cos-internal），
 * 仅在服务器与 Bucket 同地域时可用。
 * 若 COS_REGION 与此值不符，getClient() 会在首次初始化时打印警告，
 * 方便在迁移地域时快速定位"内网请求失败"的根因。
 */
const COS_INTERNAL_REGION = 'ap-shanghai';

let client: COS | null = null;
let staticClient: COS | null = null;

function getClient(): COS {
  if (!client) {
    const region = process.env.COS_REGION ?? '';
    if (region !== COS_INTERNAL_REGION) {
      console.warn(
        `[ossService] ⚠️  COS_REGION="${region}" 与内网加速预期地域 "${COS_INTERNAL_REGION}" 不一致。` +
        '内网域名（cos-internal）仅在同地域时可用，跨地域会导致上传/下载请求失败。' +
        '如已迁移地域，请同步修改 ossService.ts 中的 COS_INTERNAL_REGION。',
      );
    } else {
      console.log(`[ossService] COS 客户端初始化，地域=${region}，内网加速已启用`);
    }
    client = new COS({
      SecretId: process.env.COS_SECRET_ID!,
      SecretKey: process.env.COS_SECRET_KEY!,
      // 走腾讯云内网域名：服务器（上海）与 Bucket（上海）同地域，内网速度 ~500Mbps vs 公网 ~4Mbps
      // 若迁移地域，需同步修改上方的 COS_INTERNAL_REGION 并确认服务器与 Bucket 同地域
      Domain: '{Bucket}.cos-internal.{Region}.tencentcos.cn',
    });
  }
  return client;
}

/**
 * 生成带时效签名的视频 GET URL（用于前端播放视频）
 *
 * 有两种签名模式，自动按配置选择：
 *
 * 【CDN 模式】配置了 COS_BASE_URL + CDN_AUTH_KEY 时启用
 *   - 使用腾讯云 CDN TypeA 时间戳鉴权：
 *       sign = md5(CDN_AUTH_KEY + pathname + timestamp)
 *       url  = {CDN_BASE_URL}/{objectKey}?sign={timestamp}-{rand}-{uid}-{md5}
 *   - CDN 节点验签，过期后即使有缓存也返回 403，彻底防止 URL 泄露后被持续访问
 *   - CDN 回源 COS 时走私有存储桶访问（控制台已配置），无需 COS 签名
 *   - SW cache key：剥离 sign 参数（纯路径），同一视频签名轮换后仍命中缓存
 *
 * 【本地模式】未配置 COS/CDN 变量时（本地开发）
 *   - 回退到 COS SDK 生成 q-sign-* 时效签名 URL
 *   - SW cache key：剥离 q-sign-* 参数
 *
 * 有效期设计：
 *   - 默认 30 分钟：覆盖大文件（~1GB）在普通带宽（~5Mbps）下的完整下载时间
 *   - SW 缓存完成后，所有后续 Range 请求走本地 Cache Storage，不再请求源站
 */
export function getSignedUrl(
  objectKey: string,
  expireSeconds = 30 * 60,
  userId = '0',
): Promise<string> {
  const cdnBase = (process.env.COS_BASE_URL ?? '').replace(/\/$/, '');
  const cdnAuthKey = process.env.CDN_AUTH_KEY ?? '';

  // ── 线上模式：CDN TypeA 鉴权签名 ────────────────────────────────────────────
  if (cdnBase && cdnAuthKey) {
    // TypeA 格式：{CDN_BASE}/{key}?sign={timestamp}-{rand}-{uid}-{md5hash}
    //   md5hash = md5("{key}{timestamp}{rand}{uid}{CDN_AUTH_KEY}")
    //   腾讯云文档：https://cloud.tencent.com/document/product/228/33115
    // TypeA 的 timestamp 是起始时间（当前时间），有效时间窗口由 CDN 控制台配置的 expireSeconds 控制
    // 注意：CDN 控制台里「有效时间」= 1800s，与后端 expireSeconds 保持一致即可，此处不叠加
    const timestamp = Math.floor(Date.now() / 1000);
    const rand = Math.random().toString(36).slice(2, 10); // 8 位随机串
    const uid = '0';                                      // TypeA uid 字段固定为 0
    const pathname = `/${objectKey}`;
    // 腾讯云 CDN TypeA 签名公式（通过鉴权计算器逆向验证）：
    //   md5(path + "-" + timestamp + "-" + rand + "-" + uid + "-" + key)
    // 参考：https://cloud.tencent.com/document/product/228/41623
    const rawStr = `${pathname}-${timestamp}-${rand}-${uid}-${cdnAuthKey}`;
    const md5hash = createHash('md5').update(rawStr).digest('hex');
    const sign = `${timestamp}-${rand}-${uid}-${md5hash}`;
    // userId 作为独立 query 参数附加，不参与签名，CDN 透传，SW 直接读取用于流量归因
    const uidParam = userId !== '0' ? `&uid=${encodeURIComponent(userId)}` : '';
    return Promise.resolve(`${cdnBase}${pathname}?sign=${sign}${uidParam}`);
  }

  // ── 本地模式：回退到 COS SDK 签名 URL（不应在线上出现，仅供本地调试）──────
  return new Promise((resolve, reject) => {
    getClient().getObjectUrl(
      {
        Bucket: process.env.COS_BUCKET!,
        Region: process.env.COS_REGION!,
        Key: objectKey,
        Method: 'GET',
        Expires: expireSeconds,
        Sign: true,
      },
      (err, data) => {
        if (err) { reject(err); return; }
        // 若配置了 CDN 域名但无鉴权密钥（不推荐），仍做域名替换
        if (cdnBase) {
          // 配置了 CDN 域名但无鉴权密钥（不推荐，线上应始终同时配置二者）
          resolve(data.Url.replace(/^https?:\/\/[^/]+/, cdnBase));
        } else {
          resolve(data.Url);
        }
      },
    );
  });
}

// ─── static 桶客户端 ──────────────────────────────────────────────────────────

/**
 * static 桶专用 COS 客户端
 *
 * 与视频桶共用同一对 SecretId/SecretKey（同账号 CAM 策略覆盖两个桶）。
 * 桶名由 COS_STATIC_BUCKET 独立配置，地域复用 COS_REGION（两桶同地域）。
 */
function getStaticClient(): COS {
  if (!staticClient) {
    const region = process.env.COS_REGION ?? '';
    if (region !== COS_INTERNAL_REGION) {
      console.warn(
        `[ossService] ⚠️  static 桶 COS_REGION="${region}" 与内网加速预期地域 "${COS_INTERNAL_REGION}" 不一致。`,
      );
    } else {
      console.log(`[ossService] static 桶 COS 客户端初始化，地域=${region}，内网加速已启用`);
    }
    staticClient = new COS({
      SecretId: process.env.COS_SECRET_ID!,
      SecretKey: process.env.COS_SECRET_KEY!,
      Domain: '{Bucket}.cos-internal.{Region}.tencentcos.cn',
    });
  }
  return staticClient;
}

// ─── 头像上传 ──────────────────────────────────────────────────────────────────

/**
 * 默认头像 CDN 地址
 *
 * 由 COS_STATIC_URL 环境变量拼接生成（与头像上传路径保持一致）。
 * 本地模式下此值为空字符串前缀拼接，头像接口会走本地文件降级逻辑；
 * 线上模式由 CI/CD 平台注入 COS_STATIC_URL。
 */
export const DEFAULT_AVATAR_URL = `${(process.env.COS_STATIC_URL ?? '').replace(/\/$/, '')}/avatar/default/default.jpg`;

/**
 * 上传用户头像到 COS static 桶，并返回公开访问的 CDN URL
 *
 * - objectKey 格式：avatar/{userId}/{userId}-{ts}.jpg
 *   - 按用户前缀隔离，方便未来按用户维度管理（列举/统计）
 *   - 时间戳后缀保证每次上传 URL 唯一，彻底绕过 CDN 缓存
 *   - 旧文件不主动删除（头像文件极小，存储成本忽略不计）
 * - 头像存放在 static 桶（public read），直接走 CDN 访问，无需签名
 * - 本地开发（未配置 COS）：写入 uploads/avatar/{userId}/ 目录
 *
 * @param userId   用户 ID（UUID），作为目录名 + 文件名前缀
 * @param buffer   图片 Buffer（jpg/png/webp 均可，建议前端压缩后上传）
 * @param mimeType 图片 MIME 类型，默认 image/jpeg
 */
export async function uploadAvatar(
  userId: string,
  buffer: Buffer,
  mimeType = 'image/jpeg',
): Promise<string> {
  // 时间戳后缀：每次上传生成不同 URL，绕过 CDN 对固定路径的缓存
  const ts = Date.now();

  if (!isStaticOssEnabled()) {
    // 本地模式：写入 uploads/avatar/{userId}/ 目录，走已有的 /uploads 静态服务
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const avatarDir = path.resolve(__dirname, `../../uploads/avatar/${userId}`);
    fs.mkdirSync(avatarDir, { recursive: true });
    const fileName = `${userId}-${ts}.jpg`;
    fs.writeFileSync(path.join(avatarDir, fileName), buffer);
    // 本地服务地址（与 app.ts 中 /uploads 静态路由对应）
    const localBase = process.env.LOCAL_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3002}`;
    console.log(`[ossService] 🏠 本地模式：头像写入 uploads/avatar/${userId}/${fileName}`);
    return `${localBase}/uploads/avatar/${userId}/${fileName}`;
  }

  const objectKey = `avatar/${userId}/${userId}-${ts}.jpg`;

  // static 桶独立客户端：桶名来自 COS_STATIC_BUCKET，地域复用 COS_REGION
  await new Promise<void>((resolve, reject) => {
    getStaticClient().putObject(
      {
        Bucket: process.env.COS_STATIC_BUCKET!,
        Region: process.env.COS_REGION!,
        Key: objectKey,
        ContentType: mimeType,
        Body: buffer,
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });

  // 头像桶 public read，直接拼 CDN 域名，不需要签名
  const staticCdnBase = (process.env.COS_STATIC_URL ?? '').replace(/\/$/, '');
  if (staticCdnBase) {
    return `${staticCdnBase}/${objectKey}`;
  }
  // fallback：未配置 static CDN 域名时返回 COS 公网地址（线上不推荐，应配置 COS_STATIC_URL）
  const region = process.env.COS_REGION!;
  const bucket = process.env.COS_STATIC_BUCKET!;
  return `https://${bucket}.cos.${region}.myqcloud.com/${objectKey}`;
}

// ─── HLS 切片相关 ──────────────────────────────────────────────────────────────

/**
 * 上传单个 HLS .ts 片段到 COS（仅线上模式调用）
 *
 * @param objectKey  目标 COS 对象键，如 cowatch/{roomId}/{uuid}/seg000.ts
 * @param filePath   本地临时文件绝对路径
 * @returns          objectKey（同入参，方便链式调用）
 */
export async function uploadHlsSegment(
  objectKey: string,
  filePath: string,
): Promise<string> {
  const fileStream = fs.createReadStream(filePath);
  await new Promise<void>((resolve, reject) => {
    getClient().putObject(
      {
        Bucket: process.env.COS_BUCKET!,
        Region: process.env.COS_REGION!,
        Key: objectKey,
        ContentType: 'video/MP2T',
        Body: fileStream,
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
  return objectKey;
}

/**
 * 生成 HLS .ts 片段的带时效签名 GET URL（线上模式 = CDN 签名，本地模式 = COS SDK 签名）
 *
 * 默认有效期 2 小时（覆盖复盘 session，跨天刷新时重新请求 m3u8 接口）。
 * 逻辑与 getSignedUrl 完全相同，仅默认有效期不同。
 */
export function getHlsSegmentSignedUrl(
  objectKey: string,
  expireSeconds = 2 * 3600,
  userId = '0',
): Promise<string> {
  return getSignedUrl(objectKey, expireSeconds, userId);
}

/**
 * 删除 COS 单个对象（仅线上模式有效；本地模式静默跳过）
 *
 * @param objectKey  要删除的对象键，如 cowatch/{roomId}/{uuid}-video.mp4
 */
export async function deleteObject(objectKey: string): Promise<void> {
  if (!isOnlineMode()) {
    console.log(`[ossService] 🏠 本地模式：跳过 COS 删除 objectKey=${objectKey}`);
    return;
  }
  await new Promise<void>((resolve, reject) => {
    getClient().deleteObject(
      {
        Bucket: process.env.COS_BUCKET!,
        Region: process.env.COS_REGION!,
        Key: objectKey,
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

/**
 * 批量删除 COS 对象（仅线上模式有效；本地模式静默跳过）
 *
 * COS SDK 单次最多删除 1000 个对象，超出时自动分批发送。
 *
 * @param objectKeys  要删除的对象键数组
 */
export async function deleteObjects(objectKeys: string[]): Promise<void> {
  if (!isOnlineMode()) {
    console.log(`[ossService] 🏠 本地模式：跳过 COS 批量删除，共 ${objectKeys.length} 个对象`);
    return;
  }
  if (objectKeys.length === 0) return;

  // COS 单次批量删除上限 1000 个
  const BATCH_SIZE = 1000;
  for (let i = 0; i < objectKeys.length; i += BATCH_SIZE) {
    const batch = objectKeys.slice(i, i + BATCH_SIZE);
    await new Promise<void>((resolve, reject) => {
      getClient().deleteMultipleObject(
        {
          Bucket: process.env.COS_BUCKET!,
          Region: process.env.COS_REGION!,
          Objects: batch.map((Key) => ({ Key })),
          Quiet: true, // Quiet 模式：响应体仅包含删除失败的条目
        },
        (err, data) => {
          if (err) { reject(err); return; }
          // data.Error 包含删除失败的条目（Quiet 模式下 data.Deleted 为空数组）
          const errors = data?.Error ?? [];
          if (errors.length > 0) {
            reject(new Error(`[ossService] 批量删除部分失败：${JSON.stringify(errors)}`));
          } else {
            resolve();
          }
        },
      );
    });
  }
}

/**
 * 列举 COS 某前缀下所有 .ts 文件（用于 generateM3u8 动态拼装）
 *
 * 返回按文件名升序排列的 objectKey 列表（seg000.ts, seg001.ts, ...）
 */
export async function listHlsSegments(hlsPrefix: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    getClient().getBucket(
      {
        Bucket: process.env.COS_BUCKET!,
        Region: process.env.COS_REGION!,
        Prefix: hlsPrefix,
        MaxKeys: 1000,
      },
      (err, data) => {
        if (err) { reject(err); return; }
        const keys = (data.Contents ?? [])
          .map((item: { Key: string }) => item.Key)
          .filter((key: string) => key.endsWith('.ts'))
          .sort(); // seg000.ts < seg001.ts ... 按字典序升序
        resolve(keys);
      },
    );
  });
}
