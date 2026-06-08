import { Router, Request, Response } from 'express';
import authRouter from './auth/index.js';
import roomsRouter from './rooms/index.js';
import { BatController } from '../controllers/bat/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/rooms', roomsRouter);

// 下载转码脚本（无需鉴权）
router.get('/bat', BatController.download);

// 兜底路由
router.use((_req: Request, res: Response) => {
  res.status(404).json({ code: 404, message: 'API 路径不存在', data: null });
});

export default router;
