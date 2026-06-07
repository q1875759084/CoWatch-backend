/**
 * 生成 6 位大写字母+数字的房间码
 * 排除易混淆字符（0/O、1/I/L）
 */
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateRoomId(): string {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}
