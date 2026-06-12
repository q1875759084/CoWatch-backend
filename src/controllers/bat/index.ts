import path from 'path';
import { Request, Response } from 'express';
import { fail } from '../../utils/response.js';

// process.cwd() 在 dev(tsx) 和 prod(node dist/) 下均指向项目根目录，
// 比 import.meta.url + fileURLToPath 更稳定
const BAT_DIR = path.resolve(process.cwd(), 'src/assets/bat');

/** 合法的 CRF 数字档位 */
const VALID_PRESETS = ['23', '26', '28', '30'] as const;
type EncodePreset = typeof VALID_PRESETS[number];

export const BatController = {
  /**
   * GET /api/bat?preset=23|26|28|30
   * 下载对应 CRF 档位的 .bat 转码脚本，无需鉴权
   */
  download(req: Request, res: Response): void {
    const raw = req.query.preset as string | undefined;
    const preset: EncodePreset =
      raw && (VALID_PRESETS as readonly string[]).includes(raw)
        ? (raw as EncodePreset)
        : '30';

    const fileName = `compress_${preset}.bat`;
    const filePath = path.join(BAT_DIR, fileName);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(filePath, (err) => {
      if (err) {
        fail(res, 500, '脚本文件不存在，请联系管理员');
      }
    });
  },
};
