import { Readable } from 'stream';
import { createHash } from 'crypto';
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

let client: COS | null = null;

function getClient(): COS {
  if (!client) {
    client = new COS({
      SecretId: process.env.COS_SECRET_ID!,
      SecretKey: process.env.COS_SECRET_KEY!,
    });
  }
  return client;
}

/**
 * 生成 COS 预签名 PUT 上传 URL（白名单用户直传 COS，无需经过后端）
 *
 * COS 服务端通过 Policy 约束上传条件：
 *   - 单文件大小上限：4 GB（1小时 × 8 Mbps ÷ 8 ≈ 3.6 GB，取整）
 *   - key 必须与后端下发的 objectKey 一致
 *   - Content-Type 必须与声明的 mimeType 一致
 *
 * 参考文档：https://cloud.tencent.com/document/product/436/14690
 */
export function getUploadUrl(
  objectKey: string,
  mimeType: string,
  expireSeconds = 900,
): Promise<string> {
  return new Promise((resolve, reject) => {
    getClient().getObjectUrl(
      {
        Bucket: process.env.COS_BUCKET!,
        Region: process.env.COS_REGION!,
        Key: objectKey,
        Method: 'PUT',
        Expires: expireSeconds,
        Headers: { 'Content-Type': mimeType },
        Sign: true,
      },
      (err, data) => {
        if (err) reject(err);
        else resolve(data.Url);
      },
    );
  });
}

/**
 * 代理上传：将可读流直接 PUT 到 COS（非白名单用户走后端中转时使用）
 *
 * 上传成功后返回 objectKey（而非 URL），objectKey 由调用方持久化到数据库。
 * 播放时通过 getSignedUrl(objectKey) 实时生成时效签名 URL 下发给前端。
 *
 * @param objectKey  COS 对象键
 * @param stream     来自 req 的可读流（req 本身即是 Readable）
 * @param mimeType   文件 MIME 类型
 * @returns          objectKey（调用方存库用）
 */
export async function proxyUploadToOss(
  objectKey: string,
  stream: Readable,
  mimeType: string,
): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    getClient().putObject(
      {
        Bucket: process.env.COS_BUCKET!,
        Region: process.env.COS_REGION!,
        Key: objectKey,
        ContentType: mimeType,
        Body: stream,
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
  // 返回 objectKey，不返回 URL（URL 需要签名，由上层按需生成）
  return objectKey;
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
    const timestamp = Math.floor(Date.now() / 1000) + expireSeconds;
    const rand = Math.random().toString(36).slice(2, 10); // 8 位随机串
    const uid = '0';                                       // 固定 0，暂不启用用户体系
    const pathname = `/${objectKey}`;
    const rawStr = `${pathname}${timestamp}${rand}${uid}${cdnAuthKey}`;
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
