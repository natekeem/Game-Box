@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [TOOL BOX — GAME-BOX] 통합 서버를 시작합니다 (http://127.0.0.1:8765/game-box)...
node scripts/serve-platform.mjs
pause
