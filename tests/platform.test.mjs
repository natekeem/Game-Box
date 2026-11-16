import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGameBoxServer } from '../server/http-app.mjs';
import {
  MockUserProvider,
  ExternalUserProvider,
  adaptCorporateUser,
} from '../platform-src/user-provider.js';
import { PLATFORM_GAMES } from '../platform-src/registry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function startTestServer(options = {}) {
  const ctx = createGameBoxServer({
    staticRoot: rootDir,
    databasePath: ':memory:',
    ...options,
  });
  await new Promise(resolve => ctx.server.listen(0, '127.0.0.1', resolve));
  const addr = ctx.server.address();
  const baseUrl = `http://127.0.0.1:${addr.port}`;

  async function api(pathname, { method = 'GET', userId = 'emp-001', body, headers = {} } = {}) {
    const res = await fetch(`${baseUrl}${pathname}`, {
      method,
      headers: {
        ...(userId ? { 'X-Mock-User-Id': userId } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  }

  async function close() {
    for (const room of Object.values(ctx.realtimeHub.rooms)) {
      ctx.realtimeHub.cleanupRoomTimers(room);
    }
    await new Promise(resolve => ctx.server.close(resolve));
  }

  return { ctx, baseUrl, api, close };
}

test('1. Standalone Platform Bundle & Static Assets Serve Cleanly', async () => {
  const { baseUrl, close } = await startTestServer();
  try {
    for (const route of ['/game-box', '/game-box/retro', '/game-box/deck', '/platform/', '/platform/bundle.js', '/platform/bundle.css', '/roulette/index.html']) {
      const res = await fetch(`${baseUrl}${route}`);
      assert.equal(res.status, 200, `Expected 200 for ${route}`);
    }
    assert.equal(PLATFORM_GAMES.length, 20, 'Platform must register all 20 games (1 Roulette + 15 BattleBox + 4 Additional)');
  } finally {
    await close();
  }
});

test('2. User Providers: MockUserProvider vs ExternalUserProvider & Corporate AD SSO Enforcement', async () => {
  // Frontend provider unit checks
  const mockProvider = new MockUserProvider({ initialUserId: 'emp-002' });
  assert.equal(mockProvider.allowMockUserSwitch, true);
  assert.equal(mockProvider.getCurrentUser().id, 'emp-002');
  assert.equal(mockProvider.getCurrentUser().name, '이지훈');
  assert.equal(mockProvider.getCurrentUser().departmentName, '인프라팀');

  mockProvider.switchMockUser('emp-003');
  assert.equal(mockProvider.getCurrentUser().id, 'emp-003');
  assert.equal(mockProvider.getCurrentUser().name, '박수진');

  const rawSsoPayload = {
    empNo: 'corp-9901',
    displayName: '홍길동',
    organizations: [{ id: 'org-sec', name: '정보보안팀' }],
  };
  const adapted = adaptCorporateUser(rawSsoPayload);
  assert.deepEqual(adapted, {
    id: 'corp-9901',
    name: '홍길동',
    departmentId: 'org-sec',
    departmentName: '정보보안팀',
  });

  const extProvider = new ExternalUserProvider({ user: rawSsoPayload });
  assert.equal(extProvider.allowMockUserSwitch, false);
  assert.deepEqual(extProvider.getCurrentUser(), adapted);
  assert.throws(() => extProvider.switchMockUser('emp-001'), /비활성화/);

  // Backend AD SSO enforcement check (ignores X-Mock-User-Id when identityProvider is set)
  const { api, close } = await startTestServer({
    allowMockUserSwitch: false,
    identityProvider: async (req) => {
      const ssoToken = req.headers['x-sso-user'];
      if (!ssoToken) return null;
      return {
        userId: 'ad-user-777',
        userName: '김보안',
        deptId: 'dept-sec',
        deptName: '사내보안팀',
      };
    },
  });

  try {
    const unauth = await api('/api/platform/bootstrap', { userId: 'emp-001' });
    assert.equal(unauth.status, 401);

    const authed = await api('/api/platform/bootstrap', {
      userId: 'emp-001', // Spoofed header must be ignored
      headers: { 'X-SSO-User': 'valid-session' },
    });
    assert.equal(authed.status, 200);
    assert.equal(authed.data.authMode, 'external');
    assert.equal(authed.data.allowMockUserSwitch, false);
    assert.equal(authed.data.currentUser.id, 'ad-user-777');
    assert.equal(authed.data.currentUser.name, '김보안');
    assert.equal(authed.data.currentUser.departmentName, '사내보안팀');
  } finally {
    await close();
  }
});

test('3. Marble Roulette Integration: Directory Load, Presets & Draw History', async () => {
  const { api, close } = await startTestServer();
  try {
    const dir = await api('/api/platform/users?departmentId=dept-auto');
    assert.equal(dir.status, 200);
    assert.ok(dir.data.users.some(u => u.name === '김성민' && u.departmentName === '자동화운영팀'));
    assert.ok(dir.data.users.some(u => u.name === '최민호' && u.departmentName === '자동화운영팀'));

    const presetRes = await api('/api/platform/roulette/presets', {
      method: 'POST',
      userId: 'emp-001',
      body: {
        title: '자동화운영팀 커피 내기',
        departmentId: 'dept-auto',
        participants: ['김성민 (자동화운영팀)', '최민호 (자동화운영팀)'],
      },
    });
    assert.equal(presetRes.status, 201);
    assert.equal(presetRes.data.preset.title, '자동화운영팀 커피 내기');

    const drawRes = await api('/api/platform/roulette/history', {
      method: 'POST',
      userId: 'emp-001',
      body: {
        title: '금요일 간식 당첨자 추첨',
        participants: ['김성민', '이지훈', '박수진'],
        winners: ['이지훈'],
        winnerUserId: 'emp-002',
      },
    });
    assert.equal(drawRes.status, 201);
    assert.ok(drawRes.data.draw);
    assert.deepEqual(drawRes.data.draw.winners, ['이지훈']);

    const historyRes = await api('/api/platform/roulette/history');
    assert.equal(historyRes.status, 200);
    assert.equal(historyRes.data.history.length, 1);
    assert.equal(historyRes.data.presets.length, 1);
  } finally {
    await close();
  }
});

test('4. All 15 BattleBox Individual Games Start & Play with AI BOTs', async () => {
  const { ctx, api, close } = await startTestServer();
  const battleboxGames = [
    'reaction',
    'speedtyping',
    'colormatch',
    'tictactoe',
    'memorymatch',
    'simonsays',
    'wordchain',
    'anagram',
    'mathduel',
    'numberhunt',
    'rpsarena',
    'trivia',
    'connectfour',
    'higherlower',
    'oddoneout',
  ];

  try {
    for (const gameId of battleboxGames) {
      const createRes = await api('/api/platform/rooms', {
        method: 'POST',
        userId: 'emp-001',
        body: {
          gameId,
          mode: 'bot',
          botCount: 3, // Automatically clamped to maxPlayers - 1 for 2P games
          botDifficulty: 'hard',
        },
      });
      assert.equal(createRes.status, 201, `Failed to create room for ${gameId}`);
      const code = createRes.data.room.code;
      assert.ok(createRes.data.room.players.length >= 2, `${gameId} should have human + at least 1 BOT`);
      assert.ok(createRes.data.room.players.some(p => p.isBot), `${gameId} should include AI BOT`);

      const startRes = await api(`/api/platform/rooms/${code}/start`, {
        method: 'POST',
        userId: 'emp-001',
      });
      assert.equal(startRes.status, 200, `Failed to start ${gameId}`);
      assert.equal(startRes.data.room.state, 'playing');

      const liveRoom = ctx.realtimeHub.rooms[code];
      assert.ok(liveRoom.lastPublicGameState, `${gameId} should emit initial updateGameState`);

      // Perform a valid player action per game to verify human interaction + state progression
      const gs = liveRoom.gameState;
      let actionPayload = null;
      switch (gameId) {
        case 'reaction':
          gs.canClick = true;
          gs.waiting = false;
          gs.clicked = false;
          gs.clickTime = Date.now() - 180;
          actionPayload = { type: 'click' };
          break;
        case 'speedtyping':
          actionPayload = { typed: gs.currentSentence || 'hello' };
          break;
        case 'colormatch':
          actionPayload = { color: gs.correctColor || 'red' };
          break;
        case 'tictactoe':
          actionPayload = { pos: 0 };
          break;
        case 'memorymatch':
          actionPayload = { cardIndex: 0 };
          break;
        case 'simonsays':
          gs.showingSequence = false;
          actionPayload = { sequence: gs.sequence || ['red'] };
          break;
        case 'wordchain':
          actionPayload = { word: 'apple' };
          break;
        case 'anagram':
          actionPayload = { guess: gs.currentWord || 'planet' };
          break;
        case 'mathduel':
          actionPayload = { answer: gs.currentAnswer };
          break;
        case 'numberhunt':
          actionPayload = { guess: gs.targetNumber || 50 };
          break;
        case 'rpsarena':
          actionPayload = { choice: 'rock' };
          break;
        case 'trivia':
          actionPayload = { answer: 0 };
          break;
        case 'connectfour':
          actionPayload = { col: 3 };
          break;
        case 'higherlower':
          actionPayload = { guess: 'higher' };
          break;
        case 'oddoneout':
          actionPayload = { index: gs.oddIndex ?? 0 };
          break;
      }

      if (actionPayload) {
        const actRes = await api(`/api/platform/rooms/${code}/action`, {
          method: 'POST',
          userId: 'emp-001',
          body: actionPayload,
        });
        assert.equal(actRes.status, 200, `Human action failed for ${gameId}: ${JSON.stringify(actRes.data)}`);
      }

      ctx.realtimeHub.cleanupRoomTimers(liveRoom);
    }
  } finally {
    await close();
  }
});

test('5. Additional Games (Snake Duel, Bomberman, CatchMind Drawing) Play with AI BOTs', async () => {
  const { ctx, api, close } = await startTestServer();
  try {
    // 5A. Snake Duel
    const snakeRoomRes = await api('/api/platform/rooms', {
      method: 'POST',
      userId: 'emp-001',
      body: { gameId: 'snakeduel', mode: 'bot', botCount: 1, botDifficulty: 'normal' },
    });
    const snakeCode = snakeRoomRes.data.room.code;
    await api(`/api/platform/rooms/${snakeCode}/start`, { method: 'POST', userId: 'emp-001' });
    assert.ok(ctx.realtimeHub.rooms[snakeCode].timers.snakeStart, 'Snake Duel gives players a ready window before movement');
    const dirRes = await api(`/api/platform/rooms/${snakeCode}/action`, {
      method: 'POST',
      userId: 'emp-001',
      body: { dir: 'UP' },
    });
    assert.equal(dirRes.status, 200);
    ctx.realtimeHub.cleanupRoomTimers(ctx.realtimeHub.rooms[snakeCode]);

    // 5B. Bomberman
    const bombRoomRes = await api('/api/platform/rooms', {
      method: 'POST',
      userId: 'emp-001',
      body: { gameId: 'bomberman', mode: 'bot', botCount: 3, botDifficulty: 'hard' },
    });
    const bombCode = bombRoomRes.data.room.code;
    assert.equal(bombRoomRes.data.room.players.length, 4);
    await api(`/api/platform/rooms/${bombCode}/start`, { method: 'POST', userId: 'emp-001' });
    const bombAct = await api(`/api/platform/rooms/${bombCode}/action`, {
      method: 'POST',
      userId: 'emp-001',
      body: { move: 'RIGHT', bomb: true },
    });
    assert.equal(bombAct.status, 200);
    assert.equal(ctx.realtimeHub.rooms[bombCode].gameState.bombs.length, 1);
    assert.equal(ctx.realtimeHub.rooms[bombCode].gameState.bombs[0].ticksLeft, 32, 'Bomberman uses Blast Arena\'s 2.5 second fuse at the platform tick rate');
    assert.deepEqual(
      new Set(ctx.realtimeHub.rooms[bombCode].gameState.powerUps.map(item => item.kind)),
      new Set(['bomb', 'flame', 'speed']),
      'Bomberman exposes all three original power-up types from the start',
    );
    const bombGrid = ctx.realtimeHub.rooms[bombCode].gameState.grid;
    for (const [x, y] of [[1, 1], [2, 1], [3, 1], [3, 2], [1, 2], [1, 3], [2, 3]]) {
      assert.equal(bombGrid[y][x], 0, `Bomberman top-left escape cell ${x},${y} stays open`);
    }
    ctx.realtimeHub.cleanupRoomTimers(ctx.realtimeHub.rooms[bombCode]);

    // 5C. CatchMind / DoodleDash Drawing Game (BOT Drawer + Human Guesser)
    const drawRoomRes = await api('/api/platform/rooms', {
      method: 'POST',
      userId: 'emp-001',
      body: { gameId: 'drawing', mode: 'bot', botCount: 2, botDifficulty: 'normal' },
    });
    const drawCode = drawRoomRes.data.room.code;
    await api(`/api/platform/rooms/${drawCode}/start`, { method: 'POST', userId: 'emp-001' });
    const drawRoom = ctx.realtimeHub.rooms[drawCode];
    const secretWord = drawRoom.gameState.currentPreset?.word;
    assert.ok(secretWord, 'Drawing game must select a secret word on server');

    // In round 1, player[0] (emp-001) is drawer, so emp-001 can emit a stroke:
    const strokeRes = await api(`/api/platform/rooms/${drawCode}/action`, {
      method: 'POST',
      userId: 'emp-001',
      body: { type: 'stroke', stroke: { color: '#000', width: 4, points: [[10, 10], [50, 50]] } },
    });
    assert.equal(strokeRes.status, 200);
    assert.equal(drawRoom.gameState.strokes.length, 1);

    // And a bot/guesser submitting the right word advances/scores:
    const botGuesser = drawRoom.players.find(p => p.isBot);
    const botGuessRes = ctx.realtimeHub.handleDrawingAction(drawRoom, botGuesser, { type: 'guess', text: secretWord });
    assert.equal(botGuessRes.ok, true);
    assert.ok(botGuesser.score > 0, 'Guesser receives points for correct answer');
    ctx.realtimeHub.cleanupRoomTimers(drawRoom);
  } finally {
    await close();
  }
});

test('6. Online Multiplayer Room, Event Groups, Official Rankings vs BOT Exclusion & Rematch', async () => {
  const { ctx, api, close } = await startTestServer();
  try {
    // 1. Create a cross-department Event Group
    const evRes = await api('/api/platform/events', {
      method: 'POST',
      userId: 'emp-001', // 김성민 (자동화운영팀)
      body: {
        name: '자동화운영팀 vs 인프라팀 친선전',
        description: '부서 연합 미니게임 이벤트',
        participantIds: ['emp-001', 'emp-002', 'emp-003'],
        gameIds: ['tictactoe', 'reaction', 'bomberman'],
      },
    });
    assert.equal(evRes.status, 201);
    const eventId = evRes.data.event.id;

    // 2. Play a BOT match first — verify it does NOT pollute official rankings
    const botRoomRes = await api('/api/platform/rooms', {
      method: 'POST',
      userId: 'emp-001',
      body: { gameId: 'tictactoe', mode: 'bot', botCount: 1, botDifficulty: 'easy', eventId },
    });
    const botCode = botRoomRes.data.room.code;
    await api(`/api/platform/rooms/${botCode}/start`, { method: 'POST', userId: 'emp-001' });
    ctx.realtimeHub.rooms[botCode].players[0].score = 10;
    ctx.realtimeHub.finalizeMatch(botCode, { winner: '김성민' });

    const rankAfterBot = await api('/api/platform/rankings');
    assert.equal(rankAfterBot.data.individual.length, 0, 'BOT matches must be excluded from official rankings');

    const rankWithPractice = await api('/api/platform/rankings?includePractice=true');
    assert.equal(rankWithPractice.data.individual.length, 1, 'Practice filter should show BOT match record');

    // 3. Play an Official Online Human-vs-Human Match (emp-001 vs emp-002)
    const onlineRoomRes = await api('/api/platform/rooms', {
      method: 'POST',
      userId: 'emp-001',
      body: { gameId: 'tictactoe', mode: 'online', eventId },
    });
    const onlineCode = onlineRoomRes.data.room.code;

    const joinRes = await api(`/api/platform/rooms/${onlineCode}/join`, {
      method: 'POST',
      userId: 'emp-002', // 이지훈 (인프라팀)
    });
    assert.equal(joinRes.status, 200);
    assert.equal(joinRes.data.room.players.length, 2);

    await api(`/api/platform/rooms/${onlineCode}/start`, { method: 'POST', userId: 'emp-001' });

    // Moves for X (emp-001) to win top row (0, 1, 2) while O (emp-002) plays (3, 4)
    await api(`/api/platform/rooms/${onlineCode}/action`, { method: 'POST', userId: 'emp-001', body: { pos: 0 } });
    await api(`/api/platform/rooms/${onlineCode}/action`, { method: 'POST', userId: 'emp-002', body: { pos: 3 } });
    await api(`/api/platform/rooms/${onlineCode}/action`, { method: 'POST', userId: 'emp-001', body: { pos: 1 } });
    await api(`/api/platform/rooms/${onlineCode}/action`, { method: 'POST', userId: 'emp-002', body: { pos: 4 } });
    await api(`/api/platform/rooms/${onlineCode}/action`, { method: 'POST', userId: 'emp-001', body: { pos: 2 } });

    const finishedRoom = ctx.realtimeHub.rooms[onlineCode];
    assert.ok(finishedRoom.lastResult, 'Match result should be recorded on room');
    assert.equal(finishedRoom.state, 'finished', 'Completed matches stay on the result screen until rematch');
    assert.ok(finishedRoom.lastResult.winner.includes('김성민'));
    assert.equal(finishedRoom.lastResult.isOfficial, true);

    // 4. Verify Official Rankings, Department Rankings, and Event Group Rankings
    const officialRanks = await api('/api/platform/rankings');
    assert.equal(officialRanks.data.individual.length, 2);
    assert.equal(officialRanks.data.individual[0].userId, 'emp-001');
    assert.equal(officialRanks.data.individual[0].wins, 1);
    assert.equal(officialRanks.data.departments[0].departmentId, 'dept-auto');

    const eventRankRes = await api(`/api/platform/events/${eventId}`);
    assert.equal(eventRankRes.status, 200);
    assert.equal(eventRankRes.data.standings[0].userId, 'emp-001');
    assert.ok(eventRankRes.data.standings[0].eventPoints > eventRankRes.data.standings[1].eventPoints);

    // 5. Verify Rematch resets room to lobby cleanly
    const rematchRes = await api(`/api/platform/rooms/${onlineCode}/rematch`, {
      method: 'POST',
      userId: 'emp-001',
    });
    assert.equal(rematchRes.status, 200);
    assert.equal(rematchRes.data.room.state, 'lobby');
  } finally {
    await close();
  }
});
