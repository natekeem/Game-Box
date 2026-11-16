import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wsRoot = path.resolve(__dirname, '..');
const pikaDir = path.join(wsRoot, 'pikachu-volleyball');

test('피카츄 배구 배포 디렉터리 및 필수 번들 파일 존재 검증', () => {
  const requiredFiles = [
    path.join(pikaDir, 'index.html'),
    path.join(pikaDir, 'ko', 'index.html'),
    path.join(pikaDir, 'ko', 'replay', 'index.html'),
    path.join(pikaDir, 'resources', 'assets', 'images', 'sprite_sheet.json'),
    path.join(pikaDir, 'resources', 'assets', 'sounds', 'bgm.mp3'),
    path.join(pikaDir, 'resources', 'assets', 'sounds', 'WAVE140_1.wav'),
    path.join(pikaDir, 'resources', 'assets', 'sounds', 'WAVE144_1.wav'),
  ];

  for (const file of requiredFiles) {
    assert.equal(fs.existsSync(file), true, `파일이 존재해야 합니다: ${file}`);
  }
});

test('피카츄 배구 한국어 UI에 1인용 AI, 2인 로컬, 퀵 매치, 친구 대전 버튼이 구성되어 있다', () => {
  const html = fs.readFileSync(path.join(pikaDir, 'ko', 'index.html'), 'utf8');
  assert.ok(html.includes('vs-computer-btn'), '1인용 컴퓨터 AI 대전 버튼 ID가 있어야 함');
  assert.ok(html.includes('vs-local-btn'), '2인용 로컬 대전 버튼 ID가 있어야 함');
  assert.ok(html.includes('quick-match-btn'), '온라인 퀵 매치 버튼 ID가 있어야 함');
  assert.ok(html.includes('with-your-friend-btn'), '친구와 함께 버튼 ID가 있어야 함');
  assert.ok(html.includes('create-btn'), '방 만들기 버튼 ID가 있어야 함');
  assert.ok(html.includes('join-btn'), '방 들어가기 버튼 ID가 있어야 함');
});

test('GAME-BOX 레지스트리에 피카츄 배구가 정상 등록되어 있다', () => {
  const regJs = fs.readFileSync(path.join(wsRoot, 'tool-box', 'src', 'features', 'game-box', 'registry', 'retroGames.js'), 'utf8');
  assert.ok(regJs.includes('피카츄 배구'), '피카츄 배구 타이틀이 있어야 함');
  assert.ok(regJs.includes('/pikachu-volleyball/ko/index.html'), '피카츄 배구 링크가 있어야 함');
});

test('HTTP 서버가 피카츄 배구 정적 에셋을 200 OK로 정상 서빙한다', async (t) => {
  const staticRoot = path.join(wsRoot, 'hancom97-original');
  const { server } = createGameBoxServer({ staticRoot, databasePath: ':memory:' });

  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    if (server.closeAllConnections) server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });

  const { port } = server.address();

  const resHtml = await fetch(`http://127.0.0.1:${port}/pikachu-volleyball/ko/index.html`);
  assert.equal(resHtml.status, 200);
  const text = await resHtml.text();
  assert.ok(text.includes('vs-computer-btn'));

  const resBgm = await fetch(`http://127.0.0.1:${port}/pikachu-volleyball/resources/assets/sounds/bgm.mp3`);
  assert.equal(resBgm.status, 200);
  assert.equal(resBgm.headers.get('content-type'), 'audio/mpeg');

  const resSheet = await fetch(`http://127.0.0.1:${port}/pikachu-volleyball/resources/assets/images/sprite_sheet.json`);
  assert.equal(resSheet.status, 200);
  assert.ok(resSheet.headers.get('content-type').includes('json'));
});

test('피카츄 배구 AI 대전 랭킹 제출 및 조회 검증', async (t) => {
  const staticRoot = path.join(wsRoot, 'hancom97-original');
  const { server } = createGameBoxServer({ staticRoot, databasePath: ':memory:' });

  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    if (server.closeAllConnections) server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });

  const { port } = server.address();

  // Create user
  const userRes = await fetch(`http://127.0.0.1:${port}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: '지우' }),
  });
  assert.equal(userRes.status, 201);
  const { token } = await userRes.json();

  // Submit attempt
  const attemptRes = await fetch(`http://127.0.0.1:${port}/api/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      category: 'pikachu-vs-com',
      score: 18500,
      elapsedMs: 42000,
      source: 'pikachu-volleyball',
    }),
  });
  assert.equal(attemptRes.status, 201);

  // Query ranking
  const rankRes = await fetch(`http://127.0.0.1:${port}/api/rankings?category=pikachu-vs-com`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(rankRes.status, 200);
  const rankData = await rankRes.json();
  assert.equal(rankData.entries.length, 1);
  assert.equal(rankData.entries[0].score, 18500);
  assert.equal(rankData.entries[0].displayName, '지우');
});
