import path from 'path';
import { fileURLToPath } from 'url';
import { Request, Response } from 'express';
import { fail } from '../../utils/response.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BAT_DIR = path.resolve(__dirname, '../../assets/bat');

type EncodePreset = 'high' | 'balanced' | 'small';
const VALID_PRESETS: EncodePreset[] = ['high', 'balanced', 'small'];

export const BatController = {
  /**
   * GET /api/bat?preset=high|balanced|small
   * 下载对应画质档位的 .bat 转码脚本，无需鉴权
   */
  download(req: Request, res: Response): void {
    const raw = req.query.preset as string | undefined;
    const preset: EncodePreset =
      raw && (VALID_PRESETS as string[]).includes(raw)
        ? (raw as EncodePreset)
        : 'balanced';

    const fileName = `compress_${preset}.bat`;
    const filePath = path.join(BAT_DIR, fileName);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.sendFile(filePath, (err) => {
      if (err) {
        fail(res, 500, '脚本文件不存在，请联系管理员');
      }
    });
  },
};
