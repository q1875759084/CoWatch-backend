@echo off
setlocal

:: CoWatch Video Compressor - High Quality (CRF 23)
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

ffmpeg -version >nul 2>&1
if errorlevel 1 (
    if exist "%FFMPEG_LOCAL%" (
        set FFMPEG_CMD=%FFMPEG_LOCAL%
    ) else (
        echo.
        echo  ffmpeg not found. Downloading automatically, please wait...
        echo  (~130 MB, saved to ffmpeg-bin\ next to this script)
        echo.

        set FFMPEG_URL=https://static.daibao.site/tools/ffmpeg.exe
        set FFMPEG_DIR=%~dp0ffmpeg-bin

        powershell -NoProfile -ExecutionPolicy Bypass -Command ^
            "New-Item -ItemType Directory -Force -Path '%FFMPEG_DIR%' | Out-Null; " ^
            "Write-Host '  Downloading ffmpeg...'; " ^
            "Invoke-WebRequest -Uri '%FFMPEG_URL%' -OutFile '%FFMPEG_DIR%\ffmpeg.exe'"

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

echo.
echo  ==========================================
echo   CoWatch Compressor - High Quality (CRF 23)
echo  ==========================================
echo   Input : %INPUT%
echo   Output: %OUTPUT%
echo  ------------------------------------------
echo   Quality: High, ~1.5 GB per 30 min
echo   Encoding... (may take 5-10 min, high CPU is normal)
echo  ------------------------------------------
echo.

"%FFMPEG_CMD%" -i "%INPUT%" ^
    -c:v libx264 ^
    -crf 23 ^
    -preset veryfast ^
    -c:a aac ^
    -b:a 128k ^
    -movflags +faststart ^
    -g 120 ^
    -keyint_min 120 ^
    -sc_threshold 0 ^
    "%OUTPUT%"

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
pause
