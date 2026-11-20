import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { gameState } from '../vendor/blast-arena-original/server/state.js';
import { createGameState } from '../vendor/blast-arena-original/game/models.js';
import { initBroadcaster } from '../vendor/blast-arena-original/server/broadcast.js';
import { handleDisconnect, handleMessage } from '../vendor/blast-arena-original/server/messages.js';
import { queueInput } from '../vendor/blast-arena-original/server/gameLogic.js';
import { TileType } from '../vendor/blast-arena-original/game/constants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(__dirname, '..', 'vendor', 'blast-arena-original');
const DEFAULT_MOUNT_PATH = '/original-blast-arena';

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
]);

function adaptedSource(target, mountPath) {
  const source = fs.readFileSync(target);
  const relative = path.relative(SOURCE_ROOT, target).replaceAll('\\', '/');

  if (relative === 'index.html') {
    return Buffer.from(
      source
        .toString('utf8')
        .replaceAll('href="/app/', `href="${mountPath}/app/`)
        .replaceAll('src="/app/', `src="${mountPath}/app/`),
      'utf8',
    );
  }

  if (relative === 'app/main.js') {
    const original = 'const wsUrl = `ws://${wsHost}:8765`;';
    const transportAdapter = [
      "const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';",
      "  const wsParams = new URLSearchParams(window.location.search);",
      "  const wsMode = wsParams.get('mode') || 'online';",
      "  const wsBots = wsParams.get('bots') || '1';",
      `  const wsUrl = \`${'${wsProtocol}'}//${'${window.location.host}'}${mountPath}/ws?mode=${'${encodeURIComponent(wsMode)}'}&bots=${'${encodeURIComponent(wsBots)}'}\`;`,
    ].join('\n  ');
    const text = source.toString('utf8');
    if (!text.includes(original)) {
      throw new Error('Blast Arena 원본 WebSocket 연결 지점을 찾을 수 없습니다.');
    }
    return Buffer.from(text.replace(original, transportAdapter), 'utf8');
  }

  return source;
}

/**
 * Runs the vendored Blast Arena client and authoritative game server directly.
 * Only URL mounting and the WebSocket endpoint are adapted; rendering, assets,
 * input, game rules, lobby, chat, and the 15 ms game loop remain vendor source.
 */
export function createOriginalBlastArenaAdapter({ mountPath = DEFAULT_MOUNT_PATH } = {}) {
  const websocketPath = `${mountPath}/ws`;
  const wss = new WebSocketServer({ noServer: true });
  const botSessions = new Map();
  initBroadcaster(wss);

  function isDangerousCoordinate(x, y) {
    if (Object.values(gameState.game.explosions || {}).some(ex => ex.x === x && ex.y === y)) return true;
    for (const bomb of Object.values(gameState.game.bombs || {})) {
      if (bomb.x === x && bomb.y === y) return true;
      const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const [dx, dy] of directions) {
        for (let step = 1; step <= (bomb.range || 1); step += 1) {
          const nx = bomb.x + dx * step;
          const ny = bomb.y + dy * step;
          const tile = gameState.game.map?.tiles?.[ny * gameState.game.map.width + nx];
          if (!tile) break;
          if (nx === x && ny === y) return true;
          if (tile.type === TileType.Wall || tile.type === TileType.Block) break;
        }
      }
    }
    return false;
  }

  function walkableDirections(player) {
    const directions = [
      { dir: 'up', dx: 0, dy: -1 },
      { dir: 'down', dx: 0, dy: 1 },
      { dir: 'left', dx: -1, dy: 0 },
      { dir: 'right', dx: 1, dy: 0 },
    ];
    const width = gameState.game.map?.width || 0;
    return directions.filter(({ dx, dy }) => {
      const x = player.x + dx;
      const y = player.y + dy;
      const tile = gameState.game.map?.tiles?.[y * width + x];
      if (!tile || tile.type !== TileType.Floor || tile.occupiedByBombId) return false;
      return !Object.values(gameState.game.players || {}).some(other => (
        other.id !== player.id && other.status === 'alive' && other.x === x && other.y === y
      ));
    });
  }

  function chooseBotMove(player, session) {
    const options = walkableDirections(player);
    if (!options.length) return null;
    const safeOptions = options.filter(option => (
      !isDangerousCoordinate(player.x + option.dx, player.y + option.dy)
    ));
    if (isDangerousCoordinate(player.x, player.y) && safeOptions.length) {
      return safeOptions[Math.floor(Math.random() * safeOptions.length)];
    }

    const candidates = safeOptions.length ? safeOptions : options;
    const powerUps = Object.values(gameState.game.powerUps || {});
    const humans = Object.values(gameState.game.players || {}).filter(other => (
      other.id !== player.id && other.status === 'alive'
    ));
    const target = powerUps[0] || humans[0];
    if (target) {
      candidates.sort((a, b) => {
        const distanceA = Math.abs(player.x + a.dx - target.x) + Math.abs(player.y + a.dy - target.y);
        const distanceB = Math.abs(player.x + b.dx - target.x) + Math.abs(player.y + b.dy - target.y);
        return distanceA - distanceB;
      });
    }

    const width = gameState.game.map?.width || 0;
    const adjacentBlock = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ].some(({ dx, dy }) => {
      const tile = gameState.game.map?.tiles?.[(player.y + dy) * width + player.x + dx];
      return tile?.type === TileType.Block;
    });
    const closeHuman = humans.some(human => Math.abs(human.x - player.x) + Math.abs(human.y - player.y) <= 3);
    if ((adjacentBlock || closeHuman) && Date.now() - session.lastBombAt > 2200 && safeOptions.length >= 1) {
      session.lastBombAt = Date.now();
      queueInput(player.id, { kind: 'bomb' });
    }
    return candidates[0];
  }

  function ensureComputerOpponents(ownerWs, humanId, count) {
    if (botSessions.has(ownerWs)) return;
    const sessions = [];
    for (let index = 1; index <= count; index += 1) {
      const botId = `computer-${humanId}-${index}`;
      const fakeWs = { send() {} };
      handleMessage(fakeWs, JSON.stringify({ type: 'join', player_id: botId, nickname: count > 1 ? `COM-${index}` : 'COM-BOT' }));
      handleMessage(fakeWs, JSON.stringify({ type: 'ready', player_id: botId }));

      const session = { botId, fakeWs, lastBombAt: 0, timer: null };
      session.timer = setInterval(() => {
        if (gameState.room.status !== 'playing') return;
        const player = gameState.game.players?.[botId];
        if (!player || player.status !== 'alive') return;
        const move = chooseBotMove(player, session);
        if (move) queueInput(botId, { kind: 'move', dir: move.dir });
      }, 120);
      sessions.push(session);
    }
    botSessions.set(ownerWs, sessions);
  }

  function resetArenaState() {
    gameState.game = createGameState();
    gameState.game.status = 'waiting';
    gameState.game.winnerId = undefined;
    gameState.game.winnerIds = [];
    gameState.game.winners = [];
    gameState.game.finalStandings = [];
    gameState.game.eliminationLog = [];
    gameState.room.status = 'waiting';
    gameState.room.countdown = null;
    gameState.userIntentions = {};
    gameState.userRoles = {};
    gameState.players = {};
    gameState.spectators = {};
  }

  function removeComputerOpponents(ownerWs) {
    const sessions = botSessions.get(ownerWs);
    if (!sessions) return;
    for (const session of sessions) {
      clearInterval(session.timer);
      handleDisconnect(session.fakeWs);
    }
    botSessions.delete(ownerWs);
  }

  wss.on('connection', (ws, request) => {
    const connectionUrl = new URL(request?.url || websocketPath, 'http://localhost');
    const mode = connectionUrl.searchParams.get('mode') || 'online';
    const botCount = Math.min(3, Math.max(1, Number.parseInt(connectionUrl.searchParams.get('bots') || '1', 10) || 1));

    // When starting a new bot game or when prior match ended, completely clear stale game-over states
    if (mode === 'bot' || gameState.game.status === 'finished' || gameState.room.status === 'results' || wss.clients.size <= 1) {
      resetArenaState();
    }

    ws.send(JSON.stringify({
      type: 'state_sync',
      state: {
        ...gameState,
        chat: gameState.room.chat,
      },
    }));

    ws.on('message', (message) => {
      let parsed = null;
      try { parsed = JSON.parse(message); } catch { /* original handler ignores malformed packets */ }

      // If rejoining or starting fresh, ensure no lingering finished state
      if (parsed?.type === 'join' && (gameState.game.status === 'finished' || gameState.room.status === 'results')) {
        resetArenaState();
      }

      handleMessage(ws, message);

      if (parsed?.type === 'leave_lobby') {
        removeComputerOpponents(ws);
        if (wss.clients.size <= 1) {
          resetArenaState();
        }
      }

      if (mode === 'bot' && parsed?.type === 'join' && parsed.player_id) {
        ensureComputerOpponents(ws, parsed.player_id, botCount);
      }
    });
    ws.on('close', () => {
      removeComputerOpponents(ws);
      handleDisconnect(ws);
      if (wss.clients.size === 0) {
        resetArenaState();
      }
    });
  });
  function handleHttp(request, response, url) {
    const pathname = url.pathname;
    if (pathname !== mountPath && !pathname.startsWith(`${mountPath}/`)) return false;

    if (pathname === `${mountPath}/api/reset`) {
      resetArenaState();
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ ok: true, status: 'reset' }));
      return true;
    }

    if (pathname === websocketPath) {
      response.writeHead(426, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('WebSocket upgrade required');
      return true;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return true;
    }

    let requested = pathname.slice(mountPath.length).replace(/^\/+/, '') || 'index.html';
    let target = path.resolve(SOURCE_ROOT, requested);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      target = path.join(target, 'index.html');
    }

    const insideSource = target === SOURCE_ROOT || target.startsWith(`${SOURCE_ROOT}${path.sep}`);
    if (!insideSource) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Forbidden');
      return true;
    }
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return true;
    }

    const body = adaptedSource(target, mountPath);
    response.writeHead(200, {
      'Content-Type': MIME.get(path.extname(target).toLowerCase()) || 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-GameBox-Adapter': 'transport-only',
    });
    if (request.method === 'HEAD') response.end();
    else response.end(body);
    return true;
  }

  function attach(server) {
    server.on('upgrade', (request, socket, head) => {
      const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname !== websocketPath) return;
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });

    server.on('close', () => {
      for (const ownerWs of botSessions.keys()) removeComputerOpponents(ownerWs);
      for (const client of wss.clients) client.terminate();
      wss.close();
    });
  }

  return { handleHttp, attach, mountPath, websocketPath };
}
