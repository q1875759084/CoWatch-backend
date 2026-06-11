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

:: Check ffmpeg
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [ERROR] ffmpeg not found. Install it first:
    echo    winget install ffmpeg
    echo.
    pause
    exit /b 1
)

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

ffmpeg -i "%INPUT%" ^
    -c:v libx264 ^
    -crf 23 ^
    -preset fast ^
    -c:a aac ^
    -b:a 128k ^
    -movflags +faststart ^
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
