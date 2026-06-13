# ==================== 第一阶段：构建 ====================
FROM node:20-alpine AS builder

WORKDIR /app

# better-sqlite3 是原生 addon，需要 node-gyp 编译
# alpine 最小镜像默认不含构建工具链，必须显式安装
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==================== 第二阶段：运行 ====================
FROM node:20-alpine AS runner

WORKDIR /app

# ffmpeg：HLS 切片所需，保留在运行时镜像（-c copy 模式，无重编码，速度极快）
RUN apk add --no-cache ffmpeg

# better-sqlite3 原生 addon 需要构建工具链，装完生产依赖后删除以控制镜像体积
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && apk del make g++

# 从构建阶段复制编译产物
COPY --from=builder /app/dist ./dist

# 复制 .bat 脚本资源（供用户下载）
COPY --from=builder /app/src/assets ./src/assets

# 持久化目录：
#   /app/database  - SQLite 数据库（通过 Docker Volume 挂载）
#   /app/uploads   - 本地模式下的视频文件（COS 模式下此目录不会写入）
VOLUME ["/app/database"]
VOLUME ["/app/uploads"]

EXPOSE 3002

CMD ["node", "dist/app.js"]
