import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket } from 'ws';
import {
  SnakeDuelEngine,
  SNAKE_GRID_WIDTH,
  SNAKE_GRID_HEIGHT,
  SNAKE_TICK_MS,
} from '../server/original-engines/snake-duel-engine.mjs';
import { PlatformRealtimeHub } from '../server/platform-realtime.mjs';
import { createGameBoxServer } from '../server/http-app.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function connectWebSocket(url) {
  const messages = [];
  const waiters = [];
  const ws = new WebSocket(url);
  ws.on('message', (raw) => {
    const message = JSON.parse(String(raw));
    messages.push(message);
    for (const waiter of [...waiters]) {
      if (!waiter.predicate(message)) continue;
      clearTimeout(waiter.timeout);
      waiters.splice(waiters.indexOf(waiter), 1);
      waiter.resolve(message);
    }
  });
  const opened = new Promise((resolve, reject) => {
    ws.once('open', resolve);
    ws.once('error', reject);
  });
  const waitFor = (predicate, timeoutMs = 1500) => {
    const existing = messages.find(predicate);
    if (existing) return Promise.resolve(existing);
    return new Promise((resolve, reject) => {
      const waiter = { predicate, resolve, timeout: null };
      waiter.timeout = setTimeout(() => {
        waiters.splice(waiters.indexOf(waiter), 1);
        reject(new Error('Timed out waiting for WebSocket message'));
      }, timeoutMs);
      waiters.push(waiter);
    });
  };
  return { ws, opened, waitFor };
}

test('Snake Duel 어댑터는 원본 30x20 보드, 150ms 틱, 시작 위치를 보존한다', () => {
  assert.equal(SNAKE_GRID_WIDTH, 30);
  assert.equal(SNAKE_GRID_HEIGHT, 20);
  assert.equal(SNAKE_TICK_MS, 150);
  const engine = new SnakeDuelEngine({ 1: 'A', 2: 'B' }, () => 0);
  const snapshot = engine.getSnapshot();
  assert.deepEqual(snapshot.snakes[0].body, [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }]);
  assert.deepEqual(snapshot.snakes[1].body, [{ x: 24, y: 12 }, { x: 25, y: 12 }, { x: 26, y: 12 }]);
});

test('Snake Duel 어댑터는 원본처럼 즉시 180도 회전을 무시한다', () => {
  const engine = new SnakeDuelEngine({ 1: 'A', 2: 'B' }, () => 0);
  engine.setDirection(1, 'LEFT');
  engine.tick();
  assert.deepEqual(engine.getSnapshot().snakes[0].body[0], { x: 6, y: 7 });
});

test('Blast Arena 어댑터는 세 아이템을 노출하고 능력치를 실제 적용한다', () => {
  const hub = new PlatformRealtimeHub({ store: { recordMatchResult: () => null } });
  const user = { id: 'u1', name: 'Player', departmentId: 'd1', departmentName: 'QA' };
  const roomInfo = hub.createRoom({ user, gameId: 'bomberman', mode: 'bot', botCount: 1 });
  const room = hub.rooms[roomInfo.code];
  hub.startGame(room.code, user.id);

  assert.deepEqual(new Set(room.gameState.powerUps.map(item => item.kind)), new Set(['bomb', 'flame', 'speed']));
  const fighter = room.gameState.fighters[user.id];
  const player = room.players.find(item => item.id === user.id);
  for (const [kind, field, expected] of [
    ['bomb', 'bombCapacity', 2],
    ['flame', 'bombRange', 2],
    ['speed', 'speed', 1.5],
  ]) {
    fighter.x = 1;
    fighter.y = 1;
    fighter.lastMoveAt = 0;
    room.gameState.grid[1][2] = 0;
    room.gameState.powerUps = [{ id: `test-${kind}`, kind, x: 2, y: 1 }];
    const result = hub.handleBombermanAction(room, player, { dir: 'right' });
    assert.equal(result.ok, true);
    assert.equal(fighter[field], expected);
  }
  hub.cleanupRoomTimers(room);
});

test('벤더 원본과 라이선스 파일을 작업공간에 보존한다', () => {
  for (const relative of [
    'vendor/snake-duel-original/LICENSE',
    'vendor/snake-duel-original/src/shared/GameEngine.ts',
    'vendor/blast-arena-original/LICENSE.md',
    'vendor/blast-arena-original/server/gameLogic.js',
    'vendor/html5-bombergirl-original/LICENSE.txt',
    'vendor/html5-bombergirl-original/js/GameEngine.js',
    'vendor/html5-bombergirl-original/bower_components/EaselJS/lib/easeljs-0.8.1.min.js',
  ]) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, `${relative} is missing`);
  }
});

test('Bombergirl 원본 페이지와 온라인 2인 입력 중계가 같은 플랫폼 서버에서 동작한다', async (t) => {
  const { server } = createGameBoxServer({ staticRoot: path.join(root, 'platform') });
  let first = null;
  let second = null;
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => {
    first?.ws.terminate();
    second?.ws.terminate();
    return new Promise(resolve => server.close(resolve));
  });

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/original-bombergirl/?mode=single`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<canvas id="canvas" width="545" height="416"><\/canvas>/);
  assert.match(html, /\/original-bombergirl\/game-box-online\.js/);

  first = connectWebSocket(`ws://127.0.0.1:${port}/original-bombergirl/ws?room=PAIR01&player=p1&name=One`);
  second = connectWebSocket(`ws://127.0.0.1:${port}/original-bombergirl/ws?room=PAIR01&player=p2&name=Two`);
  await Promise.all([first.opened, second.opened]);
  const [start1, start2] = await Promise.all([
    first.waitFor(message => message.type === 'start'),
    second.waitFor(message => message.type === 'start'),
  ]);
  assert.deepEqual(new Set([start1.slot, start2.slot]), new Set([0, 1]));
  assert.equal(start1.seed, start2.seed);

  const relayed = second.waitFor(message => message.type === 'input' && message.action === 'right');
  first.ws.send(JSON.stringify({ type: 'input', action: 'right', pressed: true }));
  assert.deepEqual(await relayed, { type: 'input', slot: start1.slot, action: 'right', pressed: true });
});
