import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const staticRoot = path.join(rootDir, 'hancom97-original');

test('GAME-BOX Unified API, Identity, Event Idempotency, Ranking Separation & SPA Routes', async (t) => {
  const { server } = createGameBoxServer({
    staticRoot,
    databasePath: ':memory:',
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(() => {
    server.close();
  });

  // 1. SPA routes (/game-box, /game-box/retro, /game-box/deck) return 200 HTML
  for (const route of ['/game-box', '/game-box/retro', '/game-box/deck']) {
    const res = await fetch(`${baseUrl}${route}`);
    assert.equal(res.status, 200, `Route ${route} should return 200`);
    const html = await res.text();
    assert.match(html, /game-box-root/);
  }

  // 2. Register Guest Player
  const guestId = 'guest-12345678-abcd-4321-9999';
  const regRes = await fetch(`${baseUrl}/api/game-box/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerId: guestId,
      nickname: '초기닉네임',
      identityType: 'guest',
    }),
  });
  assert.equal(regRes.status, 200);
  const regData = await regRes.json();
  assert.equal(regData.player.playerId, guestId);
  assert.equal(regData.player.nickname, '초기닉네임');

  // 3. Empty rankings should return empty array (never dummy data)
  const emptyRankRes = await fetch(`${baseUrl}/api/game-box/rankings?gameId=hancom-typing-97&gameMode=position&playerId=${guestId}`);
  assert.equal(emptyRankRes.status, 200);
  const emptyRank = await emptyRankRes.json();
  assert.equal(emptyRank.entries.length, 0);
  assert.equal(emptyRank.myBest, null);

  // 4. Record game:start session
  const startRes = await fetch(`${baseUrl}/api/game-box/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerId: guestId,
      gameId: 'hancom-typing-97',
      gameSessionId: 'sess-hancom-001',
      gameMode: 'position',
      eventType: 'game:start',
      durationMs: 0,
    }),
  });
  assert.equal(startRes.status, 200);

  // 5. Record game:complete and verify idempotency (duplicate clientEventId is not saved twice)
  const resultPayload = {
    playerId: guestId,
    gameId: 'hancom-typing-97',
    gameSessionId: 'sess-hancom-001',
    clientEventId: 'evt-hancom-001-complete',
    gameMode: 'position',
    typingSpeed: 385,
    accuracy: 97.5,
    errorCount: 2,
    durationMs: 42000,
    outcome: 'completed',
  };

  const firstSave = await fetch(`${baseUrl}/api/game-box/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resultPayload),
  });
  assert.equal(firstSave.status, 201);
  const firstSaveData = await firstSave.json();
  assert.equal(firstSaveData.duplicated, false);

  const duplicateSave = await fetch(`${baseUrl}/api/game-box/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resultPayload),
  });
  assert.equal(duplicateSave.status, 200);
  const dupData = await duplicateSave.json();
  assert.equal(dupData.duplicated, true);

  // 6. Verify Hancom 97 record does NOT appear in Hanme 3.0 rankings
  const hanmeRankRes = await fetch(`${baseUrl}/api/game-box/rankings?gameId=hanme-typing-30&gameMode=position&playerId=${guestId}`);
  const hanmeRank = await hanmeRankRes.json();
  assert.equal(hanmeRank.entries.length, 0);

  // 7. Change nickname and verify existing record preserves connection and shows updated nickname!
  const nickChangeRes = await fetch(`${baseUrl}/api/game-box/players/${guestId}/nickname`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname: '변경된타자왕' }),
  });
  assert.equal(nickChangeRes.status, 200);

  const rankAfterNickRes = await fetch(`${baseUrl}/api/game-box/rankings?gameId=hancom-typing-97&gameMode=position&playerId=${guestId}`);
  const rankAfterNick = await rankAfterNickRes.json();
  assert.equal(rankAfterNick.entries.length, 1);
  assert.equal(rankAfterNick.entries[0].nickname, '변경된타자왕');
  assert.equal(rankAfterNick.entries[0].metricValue, 385);
  assert.equal(rankAfterNick.myBest.metricValue, 385);

  // 8. Record Pikachu Volleyball vs-computer win vs vs-local-2p practice
  await fetch(`${baseUrl}/api/game-box/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerId: guestId,
      gameId: 'pikachu-volleyball',
      gameSessionId: 'sess-pika-local-1',
      clientEventId: 'evt-pika-local-1',
      gameMode: 'vs-local-2p',
      score: 99999,
      durationMs: 30000,
      outcome: 'win',
    }),
  });

  // vs-local-2p must NOT pollute vs-computer official AI ranking
  const pikaRankEmpty = await (await fetch(`${baseUrl}/api/game-box/rankings?gameId=pikachu-volleyball&gameMode=vs-computer&playerId=${guestId}`)).json();
  assert.equal(pikaRankEmpty.entries.length, 0);

  // Now submit actual vs-computer AI match completion
  await fetch(`${baseUrl}/api/game-box/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerId: guestId,
      gameId: 'pikachu-volleyball',
      gameSessionId: 'sess-pika-ai-1',
      clientEventId: 'evt-pika-ai-1',
      gameMode: 'vs-computer',
      score: 15800,
      durationMs: 55000,
      outcome: 'win',
      opponentType: 'ai',
      metadata: { playerScore: 15, opponentScore: 6 },
    }),
  });

  const pikaRankAfter = await (await fetch(`${baseUrl}/api/game-box/rankings?gameId=pikachu-volleyball&gameMode=vs-computer&playerId=${guestId}`)).json();
  assert.equal(pikaRankAfter.entries.length, 1);
  assert.equal(pikaRankAfter.entries[0].nickname, '변경된타자왕');
  assert.equal(pikaRankAfter.entries[0].metricValue, 15800);
});
