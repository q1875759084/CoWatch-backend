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
:: Priority 2: ffmpeg-bin\ffmpeg.exe in %LOCALAPPDATA%\CoWatch\ (downloaded automatically)
:: If neither exists, download from CoWatch CDN (no install, no admin required)

set FFMPEG_CMD=ffmpeg
set FFMPEG_LOCAL=%LOCALAPPDATA%\CoWatch\ffmpeg-bin\ffmpeg.exe
set FFMPEG_URL=https://static.daibao.site/tools/ffmpeg.exe
set FFMPEG_DIR=%LOCALAPPDATA%\CoWatch\ffmpeg-bin

:: Check system ffmpeg first
ffmpeg -version >nul 2>&1
if not errorlevel 1 goto :encode

:: System ffmpeg not found. Check local ffmpeg and verify it can actually run.
if exist "%FFMPEG_LOCAL%" (
    "%FFMPEG_LOCAL%" -version >nul 2>&1
    if not errorlevel 1 (
        set FFMPEG_CMD=%FFMPEG_LOCAL%
        goto :encode
    )
    echo.
    echo  Local ffmpeg found but cannot run ^(corrupted or blocked^). Re-downloading...
    echo.
)

:: Download ffmpeg
echo.
echo  ffmpeg not found. Downloading automatically, please wait...
echo  (~130 MB, saved to %LOCALAPPDATA%\CoWatch\ffmpeg-bin\)
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ProgressPreference = 'SilentlyContinue'; " ^
    "New-Item -ItemType Directory -Force -Path '%FFMPEG_DIR%' | Out-Null; " ^
    "Write-Host '  Downloading ffmpeg...'; " ^
    "try { " ^
    "  Invoke-WebRequest -Uri '%FFMPEG_URL%' -OutFile '%FFMPEG_DIR%\ffmpeg.exe' -UseBasicParsing; " ^
    "  Write-Host '  Download finished.' " ^
    "} catch { " ^
    "  Write-Host '  [ERROR] Download failed:' $_.Exception.Message; " ^
    "  exit 1 " ^
    "} "

if errorlevel 1 (
    echo.
    echo  [ERROR] Download process failed. See details above.
    echo.
    pause
    exit /b 1
)

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

:: -----------------------------------------------------------------------------

:encode
set INPUT=%~1
set OUTPUT=%~dp1%~n1_compressed.mp4

echo.
echo  ==========================================
echo   CoWatch Compressor - CRF 30
echo  ==========================================
echo   Input : %INPUT%
echo   Output: %OUTPUT%
echo  ------------------------------------------
echo   Quality: CRF 30, ~500 MB per 30 min
echo   Encoding... (high CPU is normal)
echo  ------------------------------------------
echo.

:: -vf scale: limit max width to 1600px (same as recorder hardware encoding), keep aspect ratio, height rounded to even
:: -pix_fmt yuv420p: compatible with 10bit source files
:: -y: overwrite output if exists
"%FFMPEG_CMD%" -i "%INPUT%" -vf "scale=w='min(iw,1600)':h=-2" -c:v libx264 -crf 30 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart -g 300 -keyint_min 300 -sc_threshold 0 -y "%OUTPUT%"

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
