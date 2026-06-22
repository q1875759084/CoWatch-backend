import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  createUser,
  getUserById,
  getUserByUsername,
  checkUsernameExists,
  updateUserAvatar,
  updateUserNickname,
} from '../../database/user/index.js';
import { getInviteCode, consumeInviteCode } from '../../database/inviteCode/index.js';
import { addSubscription, getActivePlans } from '../../database/subscription/index.js';
import { generateTokens, verifyToken } from '../../utils/jwt.js';
import { uploadAvatar, DEFAULT_AVATAR_URL } from '../ossService.js';

/**
 * 账号名校验规则：6-20位，英文字母 + 数字 + 特殊字符（!@#$%^&*等）
 */
const USERNAME_REG = /^[A-Za-z0-9!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]{6,20}$/;
const PASSWORD_MIN_LEN = 6;

export interface UserPublicInfo {
  userId: string;
  username: string;
  nickname: string;
  plans: string[];
  /** 用户头像 URL，始终非空（DB 为 null 时返回默认头像地址） */
  avatarUrl: string;
}

export interface AuthResult {
  userInfo: UserPublicInfo;
  accessToken: string;
  refreshToken: string;
}

/**
 * 注册：校验 → 验证邀请码 → 创建用户 → 核销邀请码 → 按需写订阅 → 自动登录
 *
 * 邀请码逻辑：
 * - 普通码（grant_plan=NULL）：注册后为普通成员，plans=[]
 * - 会员码（grant_plan='vip:basic'）：注册后自动获得 vip:basic 永久订阅
 */
export async function registerUser(
  username: string,
  password: string,
  inviteCode: string,
): Promise<AuthResult> {
  // ── 格式校验 ──────────────────────────────────────────────────────────────
  if (!USERNAME_REG.test(username)) {
    throw new Error('账号名格式错误：6-20位，仅支持英文、数字及特殊字符');
  }
  if (password.length < PASSWORD_MIN_LEN) {
    throw new Error(`密码长度不能少于 ${PASSWORD_MIN_LEN} 位`);
  }
  if (!inviteCode || !inviteCode.trim()) {
    throw new Error('请输入邀请码');
  }

  // ── 邀请码校验 ────────────────────────────────────────────────────────────
  const codeRow = await getInviteCode(inviteCode.trim());
  if (!codeRow) {
    throw new Error('邀请码无效或已被使用完毕');
  }

  // ── 账号名查重 ────────────────────────────────────────────────────────────
  if (await checkUsernameExists(username)) {
    throw new Error('账号名已存在');
  }

  // ── 创建用户 ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  const user = await createUser({ id: userId, username, password_hash: passwordHash, nickname: username });

  // ── 核销邀请码 ────────────────────────────────────────────────────────────
  await consumeInviteCode(inviteCode.trim());

  // ── 按需写入订阅 ──────────────────────────────────────────────────────────
  if (codeRow.grant_plan) {
    await addSubscription(userId, codeRow.grant_plan);
  }

  const plans = await getActivePlans(userId);
  const { accessToken, refreshToken } = generateTokens(user.id);
  return {
    userInfo: {
      userId: user.id,
      username: user.username,
      nickname: user.nickname,
      plans,
      avatarUrl: user.avatar_url ?? DEFAULT_AVATAR_URL,
    },
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

  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('账号不存在');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error('密码错误');
  }

  const plans = await getActivePlans(user.id);
  const { accessToken, refreshToken } = generateTokens(user.id);
  return {
    userInfo: {
      userId: user.id,
      username: user.username,
      nickname: user.nickname,
      plans,
      avatarUrl: user.avatar_url ?? DEFAULT_AVATAR_URL,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * 刷新 Token：校验 refreshToken → 生成新双 Token
 */
export async function refreshUserToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = verifyToken(refreshToken);
  const user = await getUserById(payload.userId);
  if (!user) throw new Error('用户不存在');
  return generateTokens(user.id);
}

/**
 * 获取用户公开信息（含有效 plans）
 */
export async function getUserProfile(userId: string): Promise<UserPublicInfo> {
  const user = await getUserById(userId);
  if (!user) throw new Error('用户不存在');
  const plans = await getActivePlans(userId);
  return {
    userId: user.id,
    username: user.username,
    nickname: user.nickname,
    plans,
    avatarUrl: user.avatar_url ?? DEFAULT_AVATAR_URL,
  };
}

/** 昵称最大长度 */
const NICKNAME_MAX_LEN = 20;

/**
 * 修改用户昵称
 */
export async function changeUserNickname(userId: string, nickname: string): Promise<string> {
  const trimmed = nickname.trim();
  if (!trimmed) throw new Error('昵称不能为空');
  if (trimmed.length > NICKNAME_MAX_LEN) throw new Error(`昵称不能超过 ${NICKNAME_MAX_LEN} 个字符`);

  const user = await getUserById(userId);
  if (!user) throw new Error('用户不存在');

  await updateUserNickname(userId, trimmed);
  return trimmed;
}

/**
 * 上传用户头像：COS 写入 → DB 更新 → 返回新头像 URL
 */
export async function uploadUserAvatar(
  userId: string,
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const user = await getUserById(userId);
  if (!user) throw new Error('用户不存在');

  const avatarUrl = await uploadAvatar(userId, buffer, mimeType);
  await updateUserAvatar(userId, avatarUrl);
  return avatarUrl;
}
