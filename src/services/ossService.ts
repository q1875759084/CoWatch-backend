import { Readable } from 'stream';
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
 * 生成带时效签名的 COS GET URL（用于前端播放视频）
 *
 * 存储桶为私有读写，所有 GET 访问必须携带有效签名。
 *
 * 有效期设计：
 *   - 签名仅需覆盖"视频首次完整下载到 SW Cache"的时间窗口
 *   - SW 缓存完成后，所有后续 Range 请求走本地 Cache Storage，不再触碰 COS
 *   - 因此有效期不需要覆盖整场复盘，只需覆盖最大文件在最慢网速下的下载时长
 *   - 签名在切换视频时（SWITCH_VIDEO）实时生成，有效期从切换时刻起算
 *   - 默认 30 分钟：覆盖大文件（~1GB）在普通带宽（~5Mbps）下的完整下载时间
 *
 * 优先使用 COS_BASE_URL（接入 CDN 后填入 CDN 域名），
 * 未配置时使用 COS 默认域名。
 *
 * cache key 策略：SW 在缓存时会剥离签名 query 参数，
 * 以纯路径（不含签名）作为 Cache Storage 的 key，
 * 保证同一视频无论签名如何轮换都能命中缓存。
 */
export function getSignedUrl(
  objectKey: string,
  expireSeconds = 30 * 60,
): Promise<string> {
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

        // 若配置了自定义域名（CDN），将 COS 默认域名替换为自定义域名
        const baseUrl = (process.env.COS_BASE_URL ?? '').replace(/\/$/, '');
        if (baseUrl) {
          // COS SDK 返回的 URL 域名形如 bucket.cos.region.myqcloud.com
          // 替换为 COS_BASE_URL
          const url = new URL(data.Url);
          url.host = new URL(baseUrl).host;
          url.protocol = new URL(baseUrl).protocol;
          resolve(url.toString());
        } else {
          resolve(data.Url);
        }
      },
    );
  });
}
