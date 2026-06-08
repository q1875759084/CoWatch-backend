@echo off
chcp 65001 >nul
setlocal

:: ─────────────────────────────────────────────
:: CoWatch 视频压缩工具 - 均衡模式（CRF 26）
:: 用法：将录屏文件拖拽到本 bat 文件上，即可开始压缩
:: 输出文件与原文件同目录，文件名末尾加 _compressed
:: ─────────────────────────────────────────────

if "%~1"=="" (
    echo.
    echo  [错误] 请将视频文件拖拽到本工具上运行，不要直接双击。
    echo.
    pause
    exit /b 1
)

:: 检查 ffmpeg 是否可用
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [错误] 未检测到 ffmpeg，请先安装 ffmpeg 后再使用本工具。
    echo  安装方法：打开命令提示符，执行 winget install ffmpeg
    echo.
    pause
    exit /b 1
)

set INPUT=%~1
set OUTPUT=%~dp1%~n1_compressed.mp4

echo.
echo  ══════════════════════════════════════════
echo   CoWatch 视频压缩工具 - 均衡模式
echo  ══════════════════════════════════════════
echo   输入文件：%INPUT%
echo   输出文件：%OUTPUT%
echo  ──────────────────────────────────────────
echo   画质：均衡（CRF 26），预估 30 分钟视频约 1 GB
echo   开始转码，请耐心等待...
echo   （3GB 文件约需 5-10 分钟，期间 CPU 占用较高属正常现象）
echo  ──────────────────────────────────────────
echo.

ffmpeg -i "%INPUT%" ^
    -c:v libx264 ^
    -crf 26 ^
    -preset fast ^
    -c:a aac ^
    -b:a 128k ^
    -movflags +faststart ^
    "%OUTPUT%"

if errorlevel 1 (
    echo.
    echo  [失败] 转码过程中出现错误，请检查输入文件是否损坏。
    echo.
    pause
    exit /b 1
)

echo.
echo  ══════════════════════════════════════════
echo   转码完成！
echo   输出文件：%OUTPUT%
echo  ══════════════════════════════════════════
echo.
echo  现在可以将压缩后的文件上传到 CoWatch 进行复盘。
echo.
pause
