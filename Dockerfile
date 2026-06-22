# ==================== 第一阶段：构建 ====================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==================== 第二阶段：运行 ====================
FROM node:20-alpine AS runner

WORKDIR /app

# ffmpeg：HLS 切片所需，保留在运行时镜像（-c copy 模式，无重编码，速度极快）
RUN apk add --no-cache ffmpeg

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 从构建阶段复制编译产物
COPY --from=builder /app/dist ./dist

# 复制 .bat 脚本资源（供用户下载）
COPY --from=builder /app/src/assets ./src/assets

# 复制数据库迁移文件（runMigrations 在运行时读取此目录）
COPY --from=builder /app/migrations ./migrations

# 持久化目录：
#   /app/uploads   - 本地模式下的视频文件（COS 模式下此目录不会写入）
VOLUME ["/app/uploads"]

EXPOSE 3002

CMD ["node", "dist/app.js"]
