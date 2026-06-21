import { Router } from 'express';
import { AdminAuthController } from '../../controllers/admin/authController.js';
import { AdminUsersController } from '../../controllers/admin/usersController.js';
import { AdminRoomsController } from '../../controllers/admin/roomsController.js';
import { adminAuthMiddleware } from '../../middleware/adminAuth.js';

const router = Router();

// ─── Auth（无需 adminAuth）────────────────────────────────────────────────────
router.post('/auth/login', AdminAuthController.login);
router.post('/auth/refresh', AdminAuthController.refresh);
router.post('/auth/logout', AdminAuthController.logout);

// ─── 以下路由均需 adminAuth ────────────────────────────────────────────────────
router.use(adminAuthMiddleware);

// CoWatch 用户管理
router.get('/cowatch/users', AdminUsersController.list);
router.post('/cowatch/users/:userId/ban', AdminUsersController.setBan);
router.post('/cowatch/users/:userId/plans', AdminUsersController.grantPlan);
router.delete('/cowatch/users/:userId', AdminUsersController.remove);

// CoWatch 房间查看
router.get('/cowatch/rooms', AdminRoomsController.list);

export default router;
