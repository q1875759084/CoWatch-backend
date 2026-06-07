import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  createUser,
  getUserById,
  getUserByUsername,
  checkUsernameExists,
} from '../../database/user/index.js';
import { generateTokens, verifyToken } from '../../utils/jwt.js';

/**
 * 账号名校验规则：6-20位，英文字母 + 数字 + 特殊字符（!@#$%^&*等）
 */
const USERNAME_REG = /^[A-Za-z0-9!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]{6,20}$/;
const PASSWORD_MIN_LEN = 6;

export interface UserPublicInfo {
  userId: string;
  username: string;
  nickname: string;
}

export interface AuthResult {
  userInfo: UserPublicInfo;
  accessToken: string;
  refreshToken: string;
}

/**
 * 注册：校验 → 查重 → 加密 → 入库 → 自动登录（返回双 Token）
 */
export async function registerUser(username: string, password: string): Promise<AuthResult> {
  if (!USERNAME_REG.test(username)) {
    throw new Error('账号名格式错误：6-20位，仅支持英文、数字及特殊字符');
  }
  if (password.length < PASSWORD_MIN_LEN) {
    throw new Error(`密码长度不能少于 ${PASSWORD_MIN_LEN} 位`);
  }

  if (checkUsernameExists(username)) {
    throw new Error('账号名已存在');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  const user = createUser({ id: userId, username, password_hash: passwordHash, nickname: username });

  const { accessToken, refreshToken } = generateTokens(user.id);
  return {
    userInfo: { userId: user.id, username: user.username, nickname: user.nickname },
    accessToken,
    refreshToken,
  };
}

/**
 * 登录：校验账号密码 → 生成双 Token
 */
export async function loginUser(username: string, password: string): Promise<AuthResult> {
  if (!username || !password) {
    throw new Error('账号和密码不能为空');
  }

  const user = getUserByUsername(username);
  if (!user) {
    throw new Error('账号不存在');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error('密码错误');
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  return {
    userInfo: { userId: user.id, username: user.username, nickname: user.nickname },
    accessToken,
    refreshToken,
  };
}

/**
 * 刷新 Token：校验 refreshToken → 生成新双 Token
 */
export async function refreshUserToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = verifyToken(refreshToken);
  const user = getUserById(payload.userId);
  if (!user) throw new Error('用户不存在');
  return generateTokens(user.id);
}

/**
 * 获取用户公开信息（脱敏）
 */
export function getUserProfile(userId: string): UserPublicInfo {
  const user = getUserById(userId);
  if (!user) throw new Error('用户不存在');
  return { userId: user.id, username: user.username, nickname: user.nickname };
}
