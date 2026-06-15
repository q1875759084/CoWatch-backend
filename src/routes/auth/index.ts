import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AuthController } from '../../controllers/auth/index.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { fail } from '../../utils/response.js';

const router = Router();

// ─── multer：头像上传（内存存储，不落盘）────────────────────────────────────
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter(_req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 jpg / png / webp 格式的图片'));
    }
  },
});

// 注册接口（需邀请码）
router.post('/register', (req, res) => AuthController.register(req, res));

router.post('/login',    (req, res) => AuthController.login(req, res));
router.post('/refresh',  (req, res) => AuthController.refresh(req, res));
router.post('/logout',   authMiddleware, (req, res) => AuthController.logout(req, res));
router.get('/profile',   authMiddleware, (req, res) => AuthController.profile(req, res));
router.put('/nickname',  authMiddleware, (req, res) => AuthController.updateNickname(req, res));

// ─── multer 错误处理：超大文件 / 格式不符返回 400，不交给全局 500 handler ───
function handleMulterError(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      fail(res, 400, '图片大小不能超过 2MB');
    } else {
      fail(res, 400, `上传错误：${err.message}`);
    }
    return;
  }
  if (err instanceof Error) {
    // fileFilter 抛出的格式错误
    fail(res, 400, err.message);
    return;
  }
  next(err);
}

// 上传头像（需登录态，multipart/form-data，字段名 avatar）
router.post(
  '/avatar',
  authMiddleware,
  avatarUpload.single('avatar'),
  handleMulterError,
  (req: Request, res: Response) => AuthController.uploadAvatar(req, res),
);

export default router;
