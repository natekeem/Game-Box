import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(__dirname, '..', 'vendor', 'html5-bombergirl-original');
const ONLINE_CLIENT_PATH = path.resolve(__dirname, 'original-bombergirl-online-client.js');
const DEFAULT_MOUNT_PATH = '/original-bombergirl';

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.ico', 'image/x-icon'],
  ['.ogg', 'audio/ogg'],
  ['.mp3', 'audio/mpeg'],
  ['.wav', 'audio/wav'],
  ['.svg', 'image/svg+xml'],
  ['.eot', 'application/vnd.ms-fontobject'],
  ['.woff', 'font/woff'],
  ['.ttf', 'font/ttf'],
]);

function adaptedIndex(mountPath) {
  const target = path.join(SOURCE_ROOT, 'index.html');
  const source = fs.readFileSync(target, 'utf8');
  const bridge = [
    `<script src="${mountPath}/game-box-online.js"></script>`,
    '<style>',
    '#game-box-online-overlay{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(10,16,24,.88);color:#fff;font-family:Helvetica,Arial,sans-serif;text-align:center}',
    '#game-box-online-overlay strong{font-size:26px;color:#ff5c7a}',
    '#game-box-online-overlay span{font-size:14px;color:#d8e3ec}',
    '</style>',
  ].join('');
  return Buffer.from(source.replace('</head>', `${bridge}</head>`), 'utf8');
}

export function createOriginalBombergirlAdapter({ mountPath = DEFAULT_MOUNT_PATH } = {}) {
  const websocketPath = `${mountPath}/ws`;
  const onlineClientUrl = `${mountPath}/game-box-online.js`;
  const rooms = new Map();
  const wss = new WebSocketServer({ noServer: true });

  const broadcast = (room, payload) => {
    const message = JSON.stringify(payload);
    for (const client of room.clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) client.ws.send(message);
    }
  };

  const startRoomIfReady = (room) => {
    if (room.clients.size !== 2 || room.started) return;
    room.started = true;
    room.seed = Math.floor(Math.random() * 0xffffffff) >>> 0;
    room.startAt = Date.now() + 900;
    for (const client of room.clients.values()) {
      client.ws.send(JSON.stringify({
        type: 'start',
        slot: client.slot,
        seed: room.seed,
        startAt: room.startAt,
      }));
    }
  };

  wss.on('connection', (ws, request) => {
    const url = new URL(request?.url || websocketPath, 'http://localhost');
    const roomCode = String(url.searchParams.get('room') || '').trim().toUpperCase();
    const playerId = String(url.searchParams.get('player') || '').trim();
    const name = String(url.searchParams.get('name') || 'Player').trim().slice(0, 24);
    if (!roomCode || !playerId) {
      ws.send(JSON.stringify({ type: 'error', message: '온라인 방 정보가 없습니다.' }));
      ws.close(1008, 'Missing room or player');
      return;
    }

    let room = rooms.get(roomCode);
    if (!room) {
      room = { code: roomCode, clients: new Map(), started: false, seed: null, startAt: null };
      rooms.set(roomCode, room);
    }
    if (!room.clients.has(playerId) && room.clients.size >= 2) {
      ws.send(JSON.stringify({ type: 'error', message: 'Bombergirl 온라인 방은 최대 2명입니다.' }));
      ws.close(1008, 'Room full');
      return;
    }

    const occupiedSlots = new Set([...room.clients.values()].map(client => client.slot));
    const slot = occupiedSlots.has(0) ? 1 : 0;
    const previous = room.clients.get(playerId);
    if (previous && previous.ws.readyState === WebSocket.OPEN) previous.ws.close(1000, 'Reconnected');
    room.clients.set(playerId, { ws, playerId, name, slot });
    ws.send(JSON.stringify({ type: 'waiting', slot, room: roomCode }));
    startRoomIfReady(room);

    ws.on('message', (raw) => {
      let message;
      try { message = JSON.parse(raw); } catch { return; }
      if (message.type !== 'input') return;
      if (!['up', 'down', 'left', 'right', 'bomb'].includes(message.action)) return;
      if (typeof message.pressed !== 'boolean') return;
      const current = room.clients.get(playerId);
      if (!current || current.ws !== ws || !room.started) return;
      broadcast(room, {
        type: 'input',
        slot: current.slot,
        action: message.action,
        pressed: message.pressed,
      });
    });

    ws.on('close', () => {
      const current = room.clients.get(playerId);
      if (!current || current.ws !== ws) return;
      room.clients.delete(playerId);
      room.started = false;
      broadcast(room, { type: 'peer-left', playerId });
      if (!room.clients.size) rooms.delete(roomCode);
    });
  });

  function handleHttp(request, response, url) {
    const pathname = url.pathname;
    if (pathname !== mountPath && !pathname.startsWith(`${mountPath}/`)) return false;
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

    let body;
    let contentType;
    if (pathname === onlineClientUrl) {
      body = fs.readFileSync(ONLINE_CLIENT_PATH);
      contentType = MIME.get('.js');
    } else {
      const requested = pathname.slice(mountPath.length).replace(/^\/+/, '') || 'index.html';
      let target = path.resolve(SOURCE_ROOT, requested);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
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
      body = path.basename(target) === 'index.html' ? adaptedIndex(mountPath) : fs.readFileSync(target);
      contentType = MIME.get(path.extname(target).toLowerCase()) || 'application/octet-stream';
    }

    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-GameBox-Adapter': 'original-plus-input-relay',
    });
    if (request.method === 'HEAD') response.end();
    else response.end(body);
    return true;
  }

  function attach(server) {
    server.on('upgrade', (request, socket, head) => {
      const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname !== websocketPath) return;
      wss.handleUpgrade(request, socket, head, ws => wss.emit('connection', ws, request));
    });
    server.on('close', () => {
      for (const client of wss.clients) client.terminate();
      rooms.clear();
      wss.close();
    });
  }

  return { handleHttp, attach, mountPath, websocketPath, rooms };
}
