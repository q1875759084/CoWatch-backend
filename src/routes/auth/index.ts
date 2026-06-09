import { Router } from 'express';
import { AuthController } from '../../controllers/auth/index.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { fail } from '../../utils/response.js';

const router = Router();

// 注册接口暂时关闭（防止未授权注册）
// 恢复注册只需将下面两行注释互换即可
router.post('/register', (_req, res) => fail(res, 503, '注册功能暂未开放，请联系管理员'));
// router.post('/register', (req, res) => AuthController.register(req, res));

router.post('/login',    (req, res) => AuthController.login(req, res));
router.post('/refresh',  (req, res) => AuthController.refresh(req, res));
router.post('/logout',   authMiddleware, (req, res) => AuthController.logout(req, res));
router.get('/profile',   authMiddleware, (req, res) => AuthController.profile(req, res));

export default router;
