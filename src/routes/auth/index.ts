import { Router } from 'express';
import { AuthController } from '../../controllers/auth/index.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router();

// 注册接口（需邀请码）
router.post('/register', (req, res) => AuthController.register(req, res));

router.post('/login',    (req, res) => AuthController.login(req, res));
router.post('/refresh',  (req, res) => AuthController.refresh(req, res));
router.post('/logout',   authMiddleware, (req, res) => AuthController.logout(req, res));
router.get('/profile',   authMiddleware, (req, res) => AuthController.profile(req, res));

export default router;
