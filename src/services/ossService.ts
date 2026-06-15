import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import COS from 'cos-nodejs-sdk-v5';

/**
 * 判断是否配置了 COS 环境变量
 *
 * 本地开发不填 COS_* 变量，自动降级为本地文件存储模式。
 * 生产环境注入完整的 COS_* 变量后自动走 COS 模式。
 */
export function isOssEnabled(): boolean {
  const { COS_REGION, COS_BUCKET, COS_SECRET_ID, COS_SECRET_KEY } = process.env;
  return !!(COS_REGION && COS_BUCKET && COS_SECRET_ID && COS_SECRET_KEY);
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
 * 【COS 直连模式】未配置 CDN_AUTH_KEY 时（本地开发 / 未接 CDN）
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
): Promise<string> {
  const cdnBase = (process.env.COS_BASE_URL ?? '').replace(/\/$/, '');
  const cdnAuthKey = process.env.CDN_AUTH_KEY ?? '';

  // ── CDN TypeA 鉴权模式 ──────────────────────────────────────────────────────
  if (cdnBase && cdnAuthKey) {
    // TypeA 格式：{CDN_BASE}/{key}?sign={timestamp}-{rand}-{uid}-{md5hash}
    //   md5hash = md5("{key}{timestamp}{rand}{uid}{CDN_AUTH_KEY}")
    //   腾讯云文档：https://cloud.tencent.com/document/product/228/33115
    // TypeA 的 timestamp 是起始时间（当前时间），有效时间窗口由 CDN 控制台配置的 expireSeconds 控制
    // 注意：CDN 控制台里「有效时间」= 1800s，与后端 expireSeconds 保持一致即可，此处不叠加
    const timestamp = Math.floor(Date.now() / 1000);
    const rand = Math.random().toString(36).slice(2, 10); // 8 位随机串
    const uid = '0';                                       // 固定 0，暂不启用用户体系
    const pathname = `/${objectKey}`;
    // 腾讯云 CDN TypeA 签名公式（通过鉴权计算器逆向验证）：
    //   md5(path + "-" + timestamp + "-" + rand + "-" + uid + "-" + key)
    // 参考：https://cloud.tencent.com/document/product/228/41623
    const rawStr = `${pathname}-${timestamp}-${rand}-${uid}-${cdnAuthKey}`;
    const md5hash = createHash('md5').update(rawStr).digest('hex');
    const sign = `${timestamp}-${rand}-${uid}-${md5hash}`;
    return Promise.resolve(`${cdnBase}${pathname}?sign=${sign}`);
  }

  // ── COS 直连模式（本地开发 / 未配置 CDN 鉴权密钥）─────────────────────────
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
          resolve(data.Url.replace(/^https?:\/\/[^/]+/, cdnBase));
        } else {
          resolve(data.Url);
        }
      },
    );
  });
}

// ─── 头像上传 ──────────────────────────────────────────────────────────────────

/**
 * 默认头像 CDN 地址（static 桶 public read，无需鉴权）
 */
export const DEFAULT_AVATAR_URL = 'https://static.daibao.site/avatar/default/default.jpg';

/**
 * 上传用户头像到 COS static 桶，并返回公开访问的 CDN URL
 *
 * - objectKey 格式：avatar/{userId}.jpg（同一用户反复上传会覆盖旧图）
 * - 头像存放在 static 桶（public read），直接走 CDN 访问，无需签名
 * - 本地开发（未配置 COS）：不写 COS，返回 DEFAULT_AVATAR_URL 以便前端有地址可用
 *
 * @param userId   用户 ID（UUID 或数字字符串），作为文件名避免冲突
 * @param buffer   图片 Buffer（jpg/png/webp 均可，建议前端压缩后上传）
 * @param mimeType 图片 MIME 类型，默认 image/jpeg
 */
export async function uploadAvatar(
  userId: string,
  buffer: Buffer,
  mimeType = 'image/jpeg',
): Promise<string> {
  if (!isOssEnabled()) {
    // 本地开发降级：写入 uploads/avatar/ 目录，走已有的 /uploads 静态服务
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const avatarDir = path.resolve(__dirname, '../../uploads/avatar');
    fs.mkdirSync(avatarDir, { recursive: true });
    const fileName = `${userId}.jpg`;
    fs.writeFileSync(path.join(avatarDir, fileName), buffer);
    // 本地服务地址（与 app.ts 中 /uploads 静态路由对应）
    const localBase = process.env.LOCAL_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3002}`;
    console.log(`[ossService] 本地模式：头像写入 uploads/avatar/${fileName}`);
    return `${localBase}/uploads/avatar/${fileName}`;
  }

  const objectKey = `avatar/${userId}.jpg`;
  const cdnBase = (process.env.COS_BASE_URL ?? '').replace(/\/$/, '');

  // static 桶：需要单独的 Bucket/Region 配置
  // 若使用同一个桶，直接用现有 getClient()；若是独立 static 桶，需单独客户端
  // 当前设计：头像与视频共用同一桶（cowatch-static），通过 objectKey 前缀区分目录
  await new Promise<void>((resolve, reject) => {
    getClient().putObject(
      {
        Bucket: process.env.COS_BUCKET!,
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

  // 头像是 public read，直接拼 CDN 域名即可，不需要签名
  if (cdnBase) {
    return `${cdnBase}/${objectKey}`;
  }
  // fallback：无 CDN 域名时返回 COS 公网地址
  const region = process.env.COS_REGION!;
  const bucket = process.env.COS_BUCKET!;
  return `https://${bucket}.cos.${region}.myqcloud.com/${objectKey}`;
}

// ─── HLS 切片相关 ──────────────────────────────────────────────────────────────

/**
 * 上传单个 HLS .ts 片段到 COS
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
 * 生成 HLS .ts 片段的带时效签名 GET URL
 *
 * 默认有效期 2 小时（覆盖复盘 session，跨天刷新时重新请求 m3u8 接口）。
 * 逻辑与 getSignedUrl 完全相同，仅默认有效期不同。
 */
export function getHlsSegmentSignedUrl(
  objectKey: string,
  expireSeconds = 2 * 3600,
): Promise<string> {
  return getSignedUrl(objectKey, expireSeconds);
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
