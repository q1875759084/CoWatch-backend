import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getAdminUserByUsername, getAdminUserById, parsePermissions } from '../../database/adminUser/index.js';
import { generateAdminTokens, verifyAdminToken } from '../../utils/jwt.js';
import { success, fail } from '../../utils/response.js';

const ADMIN_REFRESH_COOKIE = 'admin_refresh_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/admin/auth/refresh',
};

export const AdminAuthController = {
  /**
   * POST /api/admin/auth/login
   * Admin 登录，返回 accessToken + adminInfo，refreshToken 写 HttpOnly Cookie
   */
  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username || !password) {
      fail(res, 400, '用户名和密码不能为空');
      return;
    }

    const admin = getAdminUserByUsername(username);
    if (!admin) {
      fail(res, 401, '用户名或密码错误');
      return;
    }

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      fail(res, 401, '用户名或密码错误');
      return;
    }

    const permissions = parsePermissions(admin.permissions);
    const tokens = generateAdminTokens(admin.id, permissions);
    res.cookie(ADMIN_REFRESH_COOKIE, tokens.refreshToken, COOKIE_OPTIONS);
    success(res, {
      accessToken: tokens.accessToken,
      adminInfo: { adminId: admin.id, username: admin.username, permissions },
    }, '登录成功');
  },

  /**
   * POST /api/admin/auth/refresh
   * 无感刷新：从 HttpOnly Cookie 取 admin_refresh_token，返回新 accessToken
   */
  refresh(req: Request, res: Response): void {
    const refreshToken = req.cookies?.[ADMIN_REFRESH_COOKIE] as string | undefined;
    if (!refreshToken) {
      fail(res, 401, '未提供刷新凭证，请重新登录');
      return;
    }
    try {
      const payload = verifyAdminToken(refreshToken);
      const admin = getAdminUserById(payload.adminId);
      if (!admin) {
        fail(res, 401, 'Admin 账号不存在');
        return;
      }
      const permissions = parsePermissions(admin.permissions);
      const tokens = generateAdminTokens(admin.id, permissions);
      res.cookie(ADMIN_REFRESH_COOKIE, tokens.refreshToken, COOKIE_OPTIONS);
      success(res, { accessToken: tokens.accessToken }, '刷新成功');
    } catch {
      res.clearCookie(ADMIN_REFRESH_COOKIE, { path: '/api/admin/auth/refresh' });
      fail(res, 401, '刷新凭证无效或已过期，请重新登录');
    }
  },

  /**
   * POST /api/admin/auth/logout
   */
  logout(_req: Request, res: Response): void {
    res.clearCookie(ADMIN_REFRESH_COOKIE, { path: '/api/admin/auth/refresh' });
    success(res, null, '退出登录成功');
  },
};
