import OSS from 'ali-oss';

/**
 * 判断是否配置了 OSS 环境变量
 *
 * 本地开发不填 OSS_* 变量，自动降级为本地文件存储模式。
 * CI/CD 平台注入完整的 OSS_* 变量后自动走 OSS 模式。
 */
export function isOssEnabled(): boolean {
  const { OSS_REGION, OSS_BUCKET, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET } = process.env;
  return !!(OSS_REGION && OSS_BUCKET && OSS_ACCESS_KEY_ID && OSS_ACCESS_KEY_SECRET);
}

// ─── OSS 模式 ────────────────────────────────────────────────────────────────

function createClient(): OSS {
  const { OSS_REGION, OSS_BUCKET, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET } = process.env;
  return new OSS({
    region: OSS_REGION!,
    bucket: OSS_BUCKET!,
    accessKeyId: OSS_ACCESS_KEY_ID!,
    accessKeySecret: OSS_ACCESS_KEY_SECRET!,
  });
}

let client: OSS | null = null;

function getClient(): OSS {
  if (!client) client = createClient();
  return client;
}

/**
 * 生成 OSS 预签名 PUT 上传 URL（OSS 模式专用）
 */
export async function getUploadUrl(
  objectKey: string,
  mimeType: string,
  expireSeconds = 900,
): Promise<string> {
  const oss = getClient();
  const url = await oss.signatureUrl(objectKey, {
    expires: expireSeconds,
    method: 'PUT',
    'Content-Type': mimeType,
  } as Parameters<OSS['signatureUrl']>[1]);
  return url;
}

/**
 * 根据 objectKey 生成 OSS 公开访问 URL（支持自定义 CDN 域名）
 */
export function getVideoUrl(objectKey: string): string {
  const baseUrl = (process.env.OSS_BASE_URL ?? '').replace(/\/$/, '');
  return `${baseUrl}/${objectKey}`;
}
