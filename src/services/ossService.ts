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
 * @param objectKey  COS 对象键
 * @param stream     来自 req 的可读流（req 本身即是 Readable）
 * @param mimeType   文件 MIME 类型
 * @returns          上传后的 COS 公开访问 URL
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
  return getVideoUrl(objectKey);
}

/**
 * 根据 objectKey 生成 COS 公开访问 URL
 *
 * 优先使用 COS_BASE_URL（接入 CDN 后填入 CDN 域名），
 * 未配置时降级为 COS 默认域名。
 */
export function getVideoUrl(objectKey: string): string {
  const baseUrl = (process.env.COS_BASE_URL ?? '').replace(/\/$/, '');
  if (baseUrl) return `${baseUrl}/${objectKey}`;
  // 未配置自定义域名时使用 COS 默认域名
  const bucket = process.env.COS_BUCKET!;
  const region = process.env.COS_REGION!;
  return `https://${bucket}.cos.${region}.myqcloud.com/${objectKey}`;
}
