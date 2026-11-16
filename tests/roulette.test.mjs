import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wsRoot = path.resolve(__dirname, '..');
const rouletteDir = path.join(wsRoot, 'roulette');

test('마블 룰렛 배포 디렉터리 및 필수 번들 파일 존재 검증', () => {
  const indexHtml = path.join(rouletteDir, 'index.html');
  const swJs = path.join(rouletteDir, 'service-worker.js');

  assert.equal(fs.existsSync(indexHtml), true, 'roulette/index.html 파일이 존재해야 함');
  assert.equal(fs.existsSync(swJs), true, 'roulette/service-worker.js 파일이 존재해야 함');

  const files = fs.readdirSync(rouletteDir);
  const wasmExists = files.some((f) => f.endsWith('.wasm'));
  assert.equal(wasmExists, true, 'Box2D wasm 파일이 존재해야 함');
});

test('GAME DECK 레지스트리에 마블 룰렛이 정상 등록되어 있다', () => {
  const regJs = fs.readFileSync(path.join(wsRoot, 'tool-box', 'src', 'features', 'game-box', 'registry', 'arcadeGames.js'), 'utf8');
  assert.ok(regJs.includes('마블 룰렛'), '마블 룰렛 타이틀이 있어야 함');
  assert.ok(regJs.includes('/roulette/index.html'), '마블 룰렛 링크가 있어야 함');
});

test('HTTP 서버가 마블 룰렛 정적 에셋을 200 OK로 정상 서빙한다', async (t) => {
  const staticRoot = path.join(wsRoot, 'hancom97-original');
  const { server } = createGameBoxServer({ staticRoot, databasePath: ':memory:' });

  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    if (server.closeAllConnections) server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });

  const { port } = server.address();

  const resHtml = await fetch(`http://127.0.0.1:${port}/roulette/index.html`);
  assert.equal(resHtml.status, 200);
  const text = await resHtml.text();
  assert.ok(text.includes('Marble Roulette') || text.includes('마블 룰렛'));

  const files = fs.readdirSync(rouletteDir);
  const wasmFile = files.find((f) => f.endsWith('.wasm'));
  assert.ok(wasmFile, 'wasm 파일이 디렉터리에 존재');

  const resWasm = await fetch(`http://127.0.0.1:${port}/roulette/${wasmFile}`);
  assert.equal(resWasm.status, 200);
  assert.equal(resWasm.headers.get('content-type'), 'application/wasm');
});
