@echo off
setlocal

:: CoWatch Video Compressor - CRF 30
:: Usage: drag a video file onto this script to compress it
:: Output: same folder as input, filename + _compressed

if "%~1"=="" (
    echo.
    echo  [ERROR] Drag a video file onto this script. Do not double-click.
    echo.
    pause
    exit /b 1
)

:: --- ffmpeg auto-setup -------------------------------------------------------
:: Priority 1: ffmpeg already in system PATH
:: Priority 2: ffmpeg-bin\ffmpeg.exe next to this script (downloaded automatically)
:: If neither exists, download from CoWatch CDN (no install, no admin required)

set FFMPEG_CMD=ffmpeg
set FFMPEG_LOCAL=%~dp0ffmpeg-bin\ffmpeg.exe
set FFMPEG_URL=https://static.daibao.site/tools/ffmpeg.exe
set FFMPEG_DIR=%~dp0ffmpeg-bin

ffmpeg -version >nul 2>&1
if errorlevel 1 (
    if exist "%FFMPEG_LOCAL%" (
        set FFMPEG_CMD=%FFMPEG_LOCAL%
    ) else (
        echo.
        echo  ffmpeg not found. Downloading automatically, please wait...
        echo  (~130 MB, saved to ffmpeg-bin\ next to this script)
        echo.
        powershell -NoProfile -ExecutionPolicy Bypass -Command ^
            "New-Item -ItemType Directory -Force -Path '%FFMPEG_DIR%' | Out-Null; " ^
            "Write-Host '  Downloading ffmpeg...'; " ^
            "Invoke-WebRequest -Uri '%FFMPEG_URL%' -OutFile '%FFMPEG_DIR%\ffmpeg.exe' -UseBasicParsing"
        if not exist "%FFMPEG_LOCAL%" (
            echo.
            echo  [ERROR] Download failed. Please check your internet connection.
            echo.
            pause
            exit /b 1
        )
        echo.
        echo  ffmpeg downloaded successfully.
        set FFMPEG_CMD=%FFMPEG_LOCAL%
    )
)
:: -----------------------------------------------------------------------------

set INPUT=%~1
set OUTPUT=%~dp1%~n1_compressed.mp4
set ENCODER=libx264
set HW_LABEL=

echo.
echo  ==========================================
echo   CoWatch Compressor - CRF 30
echo  ==========================================
echo   Input : %INPUT%
echo   Output: %OUTPUT%
echo  ------------------------------------------
echo   Detecting hardware encoder...
echo  ------------------------------------------
echo.

:: --- Hardware encoder detection (1-frame probe, no output file) --------------
:: Try NVENC (NVIDIA)
"%FFMPEG_CMD%" -hide_banner -loglevel error -f lavfi -i color=black:s=128x128:r=1 -frames:v 1 -c:v h264_nvenc -f null - >nul 2>&1
if not errorlevel 1 (
    set ENCODER=h264_nvenc
    set HW_LABEL= [NVIDIA NVENC]
    goto :run_encode
)

:: Try QSV (Intel)
"%FFMPEG_CMD%" -hide_banner -loglevel error -f lavfi -i color=black:s=128x128:r=1 -frames:v 1 -c:v h264_qsv -f null - >nul 2>&1
if not errorlevel 1 (
    set ENCODER=h264_qsv
    set HW_LABEL= [Intel QSV]
    goto :run_encode
)

:: Try AMF (AMD)
"%FFMPEG_CMD%" -hide_banner -loglevel error -f lavfi -i color=black:s=128x128:r=1 -frames:v 1 -c:v h264_amf -f null - >nul 2>&1
if not errorlevel 1 (
    set ENCODER=h264_amf
    set HW_LABEL= [AMD AMF]
    goto :run_encode
)

:: Fallback: CPU (libx264)
set ENCODER=libx264
set HW_LABEL= [CPU libx264]

:run_encode
echo  ------------------------------------------
echo   Quality: CRF 30 / CQ 30, ~500 MB per 30 min
echo   Encoder :%HW_LABEL%
echo   Encoding... (high CPU/GPU is normal)
echo  ------------------------------------------
echo.

:: 单行命令，避免 ^ 续行符后隐藏空格导致输出路径丢失
:: -pix_fmt yuv420p 兼容 10bit 源文件（如 H.265 10bit MKV）
:: -y 自动覆盖同名输出文件
if "%ENCODER%"=="h264_nvenc" "%FFMPEG_CMD%" -i "%INPUT%" -c:v h264_nvenc -cq 30 -preset p2 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart -g 300 -keyint_min 300 -y "%OUTPUT%"
if "%ENCODER%"=="h264_qsv"  "%FFMPEG_CMD%" -i "%INPUT%" -c:v h264_qsv -q:v 30 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart -g 300 -keyint_min 300 -y "%OUTPUT%"
if "%ENCODER%"=="h264_amf"  "%FFMPEG_CMD%" -i "%INPUT%" -c:v h264_amf -quality speed -qp_i 30 -qp_p 30 -qp_b 32 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart -g 300 -keyint_min 300 -y "%OUTPUT%"
if "%ENCODER%"=="libx264"   "%FFMPEG_CMD%" -i "%INPUT%" -c:v libx264 -crf 30 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart -g 300 -keyint_min 300 -sc_threshold 0 -y "%OUTPUT%"

:: 错误判断在 if 块外，确保能正确捕获 errorlevel
if errorlevel 1 (
    echo.
    echo  [FAILED] Encoding error. Check if the input file is valid.
    echo.
    pause
    exit /b 1
)

echo.
echo  ==========================================
echo   Done!
echo   Output: %OUTPUT%
echo  ==========================================
echo.
echo  Upload the compressed file to CoWatch.
echo.
explorer "%~dp1"
pause
