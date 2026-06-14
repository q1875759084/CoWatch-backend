import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  refreshUserToken,
  getUserProfile,
} from '../../services/user/index.js';
import { success, fail } from '../../utils/response.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth/refresh',
};

export const AuthController = {

  /**
   * POST /api/auth/register
   * 注册并自动登录，返回 accessToken + userInfo（含 plans）
   * 需传入邀请码，邀请码类型决定注册后身份
   */
  async register(req: Request, res: Response): Promise<void> {
    const { username, password, inviteCode } = req.body;
    try {
      const result = await registerUser(username, password, inviteCode);
      res.cookie('refresh_token', result.refreshToken, REFRESH_COOKIE_OPTIONS);
      success(res, { userInfo: result.userInfo, accessToken: result.accessToken }, '注册成功');
    } catch (err: unknown) {
      fail(res, 400, err instanceof Error ? err.message : '注册失败');
    }
  },

  /**
   * POST /api/auth/login
   * 登录，返回 accessToken + userInfo，refreshToken 写入 HttpOnly Cookie
   */
  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    try {
      const result = await loginUser(username, password);
      res.cookie('refresh_token', result.refreshToken, REFRESH_COOKIE_OPTIONS);
      success(res, { userInfo: result.userInfo, accessToken: result.accessToken }, '登录成功');
    } catch (err: unknown) {
      fail(res, 400, err instanceof Error ? err.message : '登录失败');
    }
  },

  /**
   * POST /api/auth/refresh
   * 无感刷新：从 HttpOnly Cookie 取 refreshToken，返回新 accessToken
   */
  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    if (!refreshToken) {
      fail(res, 401, '未提供刷新凭证，请重新登录');
      return;
    }
    try {
      const tokens = await refreshUserToken(refreshToken);
      res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
      success(res, { accessToken: tokens.accessToken }, '刷新成功');
    } catch {
      res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
      fail(res, 401, '刷新凭证无效或已过期，请重新登录');
    }
  },

  /**
   * POST /api/auth/logout
   * 退出登录：清除 HttpOnly Cookie（需登录态）
   */
  logout(_req: Request, res: Response): void {
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    success(res, null, '退出登录成功');
  },

  /**
   * GET /api/auth/profile
   * 获取当前用户信息（需登录态）
   */
  profile(req: Request, res: Response): void {
    try {
      const userInfo = getUserProfile(req.userId!);
      success(res, { userInfo });
    } catch (err: unknown) {
      fail(res, 400, err instanceof Error ? err.message : '获取用户信息失败');
    }
  },
};
