import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createGameBoxServer } from '../server/http-app.mjs';
import { createTrustedProxyIdentityProvider } from '../server/trusted-proxy-identity.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const staticRoot = fs.existsSync(path.join(rootDir, 'hancom97-original', 'index.html'))
  ? path.join(rootDir, 'hancom97-original')
  : rootDir;

const host = process.env.HANCOM97_HOST || '127.0.0.1';
const preferredPort = Number(process.env.HANCOM97_PORT || process.env.PORT || 8765);
const databasePath =
  process.env.GAMEBOX_DATABASE || path.resolve(rootDir, 'data', 'game-box.sqlite');
const identityMode = process.env.GAMEBOX_IDENTITY_MODE || 'local';
const identityProvider =
  identityMode === 'trusted-proxy'
    ? createTrustedProxyIdentityProvider({ headerName: process.env.GAMEBOX_IDENTITY_HEADER })
    : null;

function openBrowser(url) {
  if (process.env.NO_BROWSER === '1') return;
  try {
    if (process.platform === 'win32') {
      spawn('cmd.exe', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
    } else if (process.platform === 'darwin') {
      spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    } else {
      spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
    }
  } catch {
    // ignore browser launch errors
  }
}

function tryFreeStalePortOnWindows(port) {
  if (process.platform !== 'win32') return;
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const lines = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (!line.includes('LISTENING')) continue;
      const parts = line.split(/\s+/);
      const pid = Number(parts[parts.length - 1]);
      if (pid && pid !== process.pid) {
        console.log(`[GAME-BOX] 기존 포트(${port}) 점유 프로세스(PID: ${pid})를 종료하고 최신 서버로 재시작합니다...`);
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      }
    }
  } catch {
    // No process listening or already freed
  }
}

tryFreeStalePortOnWindows(preferredPort);

const { server } = createGameBoxServer({
  staticRoot,
  databasePath,
  identityProvider,
});

function startListening(portToTry) {
  const onError = (err) => {
    if (err && err.code === 'EADDRINUSE' && portToTry < preferredPort + 10) {
      server.removeListener('error', onError);
      startListening(portToTry + 1);
      return;
    }
    console.error('[GAME-BOX] 서버 시작 오류:', err);
    process.exit(1);
  };

  server.once('error', onError);
  server.listen(portToTry, host, () => {
    server.removeListener('error', onError);
    const actualPort = server.address().port;
    const gameBoxUrl = `http://${host}:${actualPort}/game-box`;
    const retroUrl = `http://${host}:${actualPort}/game-box/retro`;
    const deckUrl = `http://${host}:${actualPort}/game-box/deck`;
    console.log('==============================================================');
    console.log(`🚀 TOOL BOX — GAME-BOX 홈:   ${gameBoxUrl}`);
    console.log(`🪟 RETRO DESKTOP (Win98):    ${retroUrl}`);
    console.log(`🕹️ GAME DECK (Arcade 20종):  ${deckUrl}`);
    console.log(`💾 SQLite DB:                ${databasePath}`);
    console.log('종료하려면 Ctrl+C 를 누르세요.');
    console.log('==============================================================');
    openBrowser(gameBoxUrl);
  });
}

startListening(preferredPort);

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
