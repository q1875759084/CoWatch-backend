import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('[jwt] JWT_SECRET 环境变量未配置，应用拒绝启动');
}
// 类型断言：上方 Fail Fast 保证 SECRET 非空
const CONFIRMED_SECRET: string = SECRET;

const ACCESS_EXPIRES = '1h';
const REFRESH_EXPIRES = '7d';

export interface JwtPayload {
  userId: string;
}

/**
 * 生成双 Token
 * - accessToken：短有效期（1h），存内存 + localStorage
 * - refreshToken：长有效期（7d），写入 HttpOnly Cookie，前端不可读
 */
export function generateTokens(userId: string): { accessToken: string; refreshToken: string } {
  const payload: JwtPayload = { userId };
  return {
    accessToken: jwt.sign(payload, CONFIRMED_SECRET, { expiresIn: ACCESS_EXPIRES }),
    refreshToken: jwt.sign(payload, CONFIRMED_SECRET, { expiresIn: REFRESH_EXPIRES }),
  };
}

/**
 * 校验并解析 Token（通用）
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, CONFIRMED_SECRET) as unknown as JwtPayload;
}
