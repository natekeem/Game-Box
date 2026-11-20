import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { RankingStore, CATEGORIES } from './ranking-store.mjs';
import { PlatformStore, GAME_REGISTRY_META, MOCK_USERS, adaptExternalUser } from './platform-store.mjs';
import { PlatformRealtimeHub } from './platform-realtime.mjs';
import { createOriginalBlastArenaAdapter } from './original-blast-arena-adapter.mjs';
import { createOriginalBombergirlAdapter } from './original-bombergirl-adapter.mjs';
import { GameBoxStore, GAME_RANKING_MODES } from './game-box-store.mjs';

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.css', 'text/css; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'], ['.json', 'application/json; charset=utf-8'], ['.wasm', 'application/wasm'],
  ['.jsdos', 'application/zip'], ['.zip', 'application/zip'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.png', 'image/png'],
  ['.gif', 'image/gif'], ['.webp', 'image/webp'], ['.ico', 'image/x-icon'], ['.cur', 'image/x-icon'], ['.ani', 'application/octet-stream'],
  ['.bmp', 'image/bmp'],
  ['.svg', 'image/svg+xml'], ['.woff', 'font/woff'], ['.woff2', 'font/woff2'], ['.ttf', 'font/ttf'], ['.otf', 'font/otf'],
  ['.symbols', 'text/plain; charset=utf-8'], ['.map', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'], ['.wav', 'audio/wav'], ['.mp3', 'audio/mpeg'], ['.ogg', 'audio/ogg'], ['.mid', 'audio/midi'],
  ['.swf', 'application/x-shockwave-flash'], ['.pdf', 'application/pdf'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
]);

function json(response, status, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(body);
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 3 * 1024 * 1024) throw new Error('요청 데이터가 너무 큽니다.');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new Error('JSON 요청 형식이 올바르지 않습니다.'); }
}

function bearer(request) {
  const authorization = String(request.headers.authorization || '');
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
}

function routeMatch(pathname, expression) {
  const match = pathname.match(expression);
  return match ? match.slice(1).map(decodeURIComponent) : null;
}

export function createGameBoxServer({
  staticRoot,
  databasePath = ':memory:',
  identityProvider = null,
  allowLocalAuth = identityProvider == null,
  allowMockUserSwitch = identityProvider == null,
} = {}) {
  const store = new RankingStore(databasePath);
  const platformStore = new PlatformStore(databasePath);
  const gameBoxStore = new GameBoxStore(databasePath);
  const realtimeHub = new PlatformRealtimeHub({ store: platformStore });
  const originalBlastArena = createOriginalBlastArenaAdapter();
  const originalBombergirl = createOriginalBombergirlAdapter();

  async function authenticatedUser(request) {
    if (identityProvider) {
      const identity = await identityProvider(request);
      if (identity) return store.syncExternalIdentity(identity);
    }
    return allowLocalAuth ? store.authenticate(bearer(request)) : null;
  }

  async function resolvePlatformUser(request, url) {
    if (identityProvider) {
      const identity = await identityProvider(request);
      if (!identity) return null;
      const adapted = adaptExternalUser(identity);
      if (!adapted) return null;
      return platformStore.upsertUser(adapted, false);
    }
    if (!allowMockUserSwitch) return null;
    let customNick = '';
    try {
      customNick = decodeURIComponent(String(
        request.headers['x-gamebox-nickname'] ||
        url.searchParams.get('nickname') ||
        ''
      )).trim();
    } catch {}

    const guestIdParam = (url?.searchParams?.get('guestId') || request.headers['x-guest-id'] || '').trim();
    const mockId = String(
      (guestIdParam.startsWith('guest-') ? guestIdParam : '') ||
      request.headers['x-mock-user-id'] ||
      url?.searchParams?.get('mockUserId') ||
      MOCK_USERS[0].id
    ).trim();

    // If mockId is a guest or custom nickname is present, ensure identity matches guestId
    if (mockId.startsWith('guest-') || (customNick && customNick !== '김성민')) {
      const guestUser = {
        id: mockId,
        name: customNick || '게스트',
        departmentId: 'dept-guest',
        departmentName: '게스트 플레이어',
      };
      return platformStore.upsertUser(guestUser, false);
    }

    return platformStore.getUser(mockId) || platformStore.getUser(MOCK_USERS[0].id);
  }

  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
      const { pathname } = url;
      const method = request.method || 'GET';

      if (originalBlastArena.handleHttp(request, response, url)) return;
      if (originalBombergirl.handleHttp(request, response, url)) return;

      // ─── Unified GAME-BOX API (/api/game-box/*) ───────────────────────────────
      if (pathname.startsWith('/api/game-box/')) {
        if (pathname === '/api/game-box/modes' && method === 'GET') {
          return json(response, 200, { modes: GAME_RANKING_MODES });
        }

        if (pathname === '/api/game-box/players' && method === 'POST') {
          const body = await readJson(request);
          const player = gameBoxStore.upsertPlayer({
            playerId: body.playerId || body.guestId,
            nickname: body.nickname,
            identityType: body.identityType || 'guest',
            externalUserId: body.externalUserId || null,
          });
          return json(response, 200, { player });
        }

        const playerMatch = routeMatch(pathname, /^\/api\/game-box\/players\/([^/]+)$/);
        if (playerMatch && method === 'GET') {
          const player = gameBoxStore.getPlayer(playerMatch[0]);
          if (!player) return json(response, 404, { error: '등록된 플레이어를 찾을 수 없습니다.' });
          return json(response, 200, { player });
        }
        if (playerMatch && (method === 'PATCH' || method === 'PUT')) {
          const body = await readJson(request);
          const player = gameBoxStore.updateNickname(playerMatch[0], body.nickname);
          return json(response, 200, { player });
        }

        const playerNickMatch = routeMatch(pathname, /^\/api\/game-box\/players\/([^/]+)\/nickname$/);
        if (playerNickMatch && (method === 'PATCH' || method === 'PUT' || method === 'POST')) {
          const body = await readJson(request);
          const player = gameBoxStore.updateNickname(playerNickMatch[0], body.nickname);
          return json(response, 200, { player });
        }

        const playerRecordsMatch = routeMatch(pathname, /^\/api\/game-box\/players\/([^/]+)\/records$/);
        if (playerRecordsMatch && method === 'GET') {
          const data = gameBoxStore.getPlayerRecords(playerRecordsMatch[0], {
            gameId: url.searchParams.get('gameId') || null,
            limit: url.searchParams.get('limit') || 25,
          });
          return json(response, 200, data);
        }

        if ((pathname === '/api/game-box/sessions' || pathname === '/api/game-box/sessions/start' || pathname === '/api/game-box/sessions/event') && method === 'POST') {
          const body = await readJson(request);
          const session = gameBoxStore.recordSessionEvent(body);
          return json(response, 200, { session });
        }

        if (pathname === '/api/game-box/results' && method === 'POST') {
          const body = await readJson(request);
          const saved = gameBoxStore.recordGameResult(body);
          return json(response, saved.duplicated ? 200 : 201, saved);
        }

        if (pathname === '/api/game-box/rankings' && method === 'GET') {
          const data = gameBoxStore.getRankings({
            gameId: url.searchParams.get('gameId') || 'hancom-typing-97',
            gameMode: url.searchParams.get('gameMode') || null,
            limit: url.searchParams.get('limit') || 10,
            playerId: url.searchParams.get('playerId') || null,
          });
          return json(response, 200, data);
        }

        return json(response, 404, { error: 'GAME-BOX API 경로를 찾을 수 없습니다.' });
      }

      // ─── Modern Game Platform API (/api/platform/*) ───────────────────────────
      if (pathname.startsWith('/api/platform/')) {
        const currentUser = await resolvePlatformUser(request, url);
        if (!currentUser) {
          return json(response, 401, { error: '사내 AD SSO 인증이 필요합니다.' });
        }

        if (pathname === '/api/platform/bootstrap' && method === 'GET') {
          return json(response, 200, {
            authMode: identityProvider ? 'external' : 'mock',
            allowMockUserSwitch: !!allowMockUserSwitch && !identityProvider,
            currentUser,
            users: platformStore.listUsers(),
            departments: platformStore.listDepartments(),
            games: GAME_REGISTRY_META,
            rooms: realtimeHub.listPublicRooms(),
            events: platformStore.listEventGroups(),
          });
        }

        if (pathname === '/api/platform/users' && method === 'GET') {
          return json(response, 200, {
            users: platformStore.listUsers({
              departmentId: url.searchParams.get('departmentId') || null,
              query: url.searchParams.get('q') || '',
            }),
            departments: platformStore.listDepartments(),
          });
        }

        if (pathname === '/api/platform/stream' && method === 'GET') {
          const clientId = url.searchParams.get('clientId') || currentUser.id;
          response.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
          });
          response.write(`event: connected\ndata: ${JSON.stringify({ clientId, user: currentUser })}\n\n`);
          realtimeHub.subscribe(clientId, response);
          return;
        }

        if (pathname === '/api/platform/rooms' && method === 'GET') {
          return json(response, 200, {
            rooms: realtimeHub.listPublicRooms(
              url.searchParams.get('gameId') || null,
              url.searchParams.get('matchType') || null,
            ),
          });
        }

        if (pathname === '/api/platform/rooms' && method === 'POST') {
          const body = await readJson(request);
          const room = realtimeHub.createRoom({
            user: currentUser,
            gameId: body.gameId,
            mode: body.mode || 'online',
            matchType: body.matchType === 'quick' ? 'quick' : 'code',
            botCount: body.botCount || 0,
            botDifficulty: body.botDifficulty || 'normal',
            eventId: body.eventId || null,
          });
          return json(response, 201, { room });
        }

        const roomMatch = routeMatch(pathname, /^\/api\/platform\/rooms\/([^/]+)$/);
        if (roomMatch && method === 'GET') {
          const room = realtimeHub.rooms[String(roomMatch[0]).toUpperCase()];
          if (!room) return json(response, 404, { error: '방을 찾을 수 없습니다.' });
          return json(response, 200, { room: realtimeHub.serializeRoom(room) });
        }

        const roomAction = routeMatch(pathname, /^\/api\/platform\/rooms\/([^/]+)\/([a-z-]+)$/);
        if (roomAction && method === 'POST') {
          const [code, actionName] = roomAction;
          const body = await readJson(request);
          if (actionName === 'join') {
            return json(response, 200, { room: realtimeHub.joinRoom(code, currentUser) });
          }
          if (actionName === 'leave') {
            return json(response, 200, { result: realtimeHub.leaveRoom(code, currentUser.id) });
          }
          if (actionName === 'ready') {
            return json(response, 200, { room: realtimeHub.setReady(code, currentUser.id, body.ready) });
          }
          if (actionName === 'add-bot') {
            return json(response, 200, { room: realtimeHub.addBot(code, currentUser.id, body.difficulty) });
          }
          if (actionName === 'remove-bot') {
            return json(response, 200, { room: realtimeHub.removeBot(code, currentUser.id, body.botId) });
          }
          if (actionName === 'start') {
            return json(response, 200, { room: realtimeHub.startGame(code, currentUser.id) });
          }
          if (actionName === 'action') {
            const res = realtimeHub.handleAction(code, currentUser.id, body);
            return json(response, res.ok ? 200 : 400, res);
          }
          if (actionName === 'rematch') {
            return json(response, 200, { room: realtimeHub.rematch(code, currentUser.id) });
          }
        }

        // Event Groups
        if (pathname === '/api/platform/events' && method === 'GET') {
          return json(response, 200, { events: platformStore.listEventGroups() });
        }
        if (pathname === '/api/platform/events' && method === 'POST') {
          const body = await readJson(request);
          const event = platformStore.createEventGroup(currentUser.id, body);
          return json(response, 201, { event });
        }
        const pEventMatch = routeMatch(pathname, /^\/api\/platform\/events\/([^/]+)$/);
        if (pEventMatch && method === 'GET') {
          const rankings = platformStore.getEventRankings(pEventMatch[0]);
          return json(response, 200, rankings);
        }
        const pEventAction = routeMatch(pathname, /^\/api\/platform\/events\/([^/]+)\/(join|status)$/);
        if (pEventAction && method === 'POST') {
          const [eventId, act] = pEventAction;
          const body = await readJson(request);
          if (act === 'join') {
            return json(response, 200, { event: platformStore.addEventParticipant(eventId, body.userId || currentUser.id) });
          }
          if (act === 'status') {
            return json(response, 200, { event: platformStore.updateEventGroupStatus(currentUser.id, eventId, body.status) });
          }
        }

        // Rankings & User Stats
        if (pathname === '/api/platform/rankings' && method === 'GET') {
          const gameId = url.searchParams.get('gameId') || null;
          const includePractice = url.searchParams.get('includePractice') === 'true';
          const departmentId = url.searchParams.get('departmentId') || null;
          return json(response, 200, {
            individual: platformStore.getRankings({ gameId, includePractice, departmentId }),
            departments: platformStore.getDepartmentRankings({ gameId, includePractice }),
          });
        }

        if (pathname === '/api/platform/stats' && method === 'GET') {
          const targetUserId = url.searchParams.get('userId') || currentUser.id;
          return json(response, 200, platformStore.getUserStats(targetUserId));
        }

        if (pathname === '/api/platform/matches' && method === 'POST') {
          const body = await readJson(request);
          const recorded = platformStore.recordMatchResult(body);
          return json(response, 201, { recorded });
        }

        // Marble Roulette History & Presets
        if (pathname === '/api/platform/roulette/history' && method === 'GET') {
          return json(response, 200, {
            history: platformStore.listRouletteHistory(),
            presets: platformStore.listRoulettePresets(currentUser.id),
          });
        }
        if (pathname === '/api/platform/roulette/history' && method === 'POST') {
          const body = await readJson(request);
          const draw = platformStore.recordRouletteDraw(currentUser.id, body);
          return json(response, 201, { draw });
        }
        if (pathname === '/api/platform/roulette/presets' && method === 'POST') {
          const body = await readJson(request);
          const preset = platformStore.saveRoulettePreset(currentUser.id, body);
          return json(response, 201, { preset });
        }

        return json(response, 404, { error: '플랫폼 API 경로를 찾을 수 없습니다.' });
      }

      if (pathname === '/api/health' && method === 'GET') return json(response, 200, { ok: true });
      if (pathname === '/api/categories' && method === 'GET') return json(response, 200, { categories: CATEGORIES });
      if (pathname === '/api/auth-mode' && method === 'GET') {
        return json(response, 200, { mode: identityProvider ? 'external' : 'local' });
      }
      if (pathname === '/api/launch-app' && (method === 'POST' || method === 'GET')) {
        const version = url.searchParams.get('version') || '2007';
        const wsRoot = path.resolve(staticRoot, '..');
        let exePath = '';
        let cwd = '';
        let args = [];

        if (version === '2007') {
          cwd = path.join(wsRoot, 'references', '한컴타자연습 2007');
          exePath = path.join(cwd, '한컴타자연습.exe');
        } else if (version === 'hanme') {
          cwd = path.join(wsRoot, 'references', '한메타자교사 3.0');
          exePath = path.join(cwd, 'dosbox.exe');
          args = ['HTT.EXE'];
        } else {
          return json(response, 400, { error: '알 수 없는 버전입니다: ' + version });
        }

        if (!fs.existsSync(exePath)) {
          return json(response, 404, { error: `실행 파일이 없습니다: ${exePath}` });
        }

        try {
          const proc = spawn(exePath, args, { cwd, detached: true, stdio: 'ignore' });
          proc.unref();
          return json(response, 200, { ok: true, version, message: `${version} 버전이 로컬 Windows에서 실행되었습니다.` });
        } catch (e) {
          return json(response, 500, { error: `프로세스 실행 실패: ${e.message}` });
        }
      }
      if (pathname === '/api/users' && method === 'POST') {
        if (!allowLocalAuth) return json(response, 403, { error: '사용자 정보는 사내 인증 서버에서 제공합니다.' });
        const body = await readJson(request);
        return json(response, 201, store.createUser(body.displayName));
      }

      if (pathname.startsWith('/api/')) {
        const user = await authenticatedUser(request);
        if (!user) return json(response, 401, { error: '로그인이 필요합니다.' });

        if (pathname === '/api/bootstrap' && method === 'GET') {
          return json(response, 200, { ...store.listContext(user.id), authMode: identityProvider ? 'external' : 'local' });
        }
        if (pathname === '/api/users/search' && method === 'GET') return json(response, 200, { users: store.searchUsers(url.searchParams.get('q'), user.id) });
        if (pathname === '/api/organizations' && method === 'POST') {
          const body = await readJson(request);
          return json(response, 201, store.createOrganization(user.id, body.name));
        }
        const organization = routeMatch(pathname, /^\/api\/organizations\/([^/]+)$/);
        if (organization && method === 'GET') return json(response, 200, store.getOrganization(organization[0], user.id));
        const organizationMember = routeMatch(pathname, /^\/api\/organizations\/([^/]+)\/members$/);
        if (organizationMember && method === 'POST') {
          const body = await readJson(request);
          return json(response, 200, store.addOrganizationMember(user.id, organizationMember[0], body.userId));
        }

        if (pathname === '/api/events' && method === 'POST') {
          const body = await readJson(request);
          return json(response, 201, store.createEvent(user.id, body));
        }
        const event = routeMatch(pathname, /^\/api\/events\/([^/]+)$/);
        if (event && method === 'GET') return json(response, 200, store.getEvent(event[0], user.id));
        const invitation = routeMatch(pathname, /^\/api\/events\/([^/]+)\/invitations$/);
        if (invitation && method === 'POST') {
          const body = await readJson(request);
          return json(response, 200, store.inviteToEvent(user.id, invitation[0], body.userId));
        }
        const accept = routeMatch(pathname, /^\/api\/events\/([^/]+)\/accept$/);
        if (accept && method === 'POST') return json(response, 200, store.acceptEvent(user.id, accept[0]));

        if (pathname === '/api/attempts' && method === 'POST') {
          const body = await readJson(request);
          return json(response, 201, store.submitAttempt(user.id, body));
        }
        if (pathname === '/api/rankings' && method === 'GET') {
          const scope = url.searchParams.get('scope') || 'global';
          const scopeId = url.searchParams.get('scopeId');
          if (scope === 'event') store.getEvent(scopeId, user.id);
          if (scope === 'organization') store.getOrganization(scopeId, user.id);
          return json(response, 200, store.rankings({
            category: url.searchParams.get('category'), scope,
            scopeId, period: url.searchParams.get('period') || 'all',
            from: url.searchParams.get('from'), to: url.searchParams.get('to'), limit: url.searchParams.get('limit'),
          }));
        }
        const recordSnapshot = routeMatch(pathname, /^\/api\/records\/(hancom97|hancom2007)$/);
        if (recordSnapshot && method === 'GET') {
          const game = recordSnapshot[0];
          const snapshot = store.getRecordSnapshot(user.id, game);
          return json(response, snapshot ? 200 : 404, snapshot || { error: '저장된 원본 기록이 없습니다.' });
        }
        if (recordSnapshot && method === 'PUT') {
          const body = await readJson(request);
          return json(response, 200, store.saveRecordSnapshot(user.id, recordSnapshot[0], body));
        }
        return json(response, 404, { error: 'API 경로를 찾을 수 없습니다.' });
      }

      if (!staticRoot) return json(response, 404, { error: 'Not found' });
      const wsRoot = fs.existsSync(path.join(staticRoot, 'game-box', 'index.html'))
        ? staticRoot
        : path.resolve(staticRoot, '..');
      const decoded = decodeURIComponent(pathname);

      // Redirect bare root (when not loading DOS typing iframe ?v=97|hanme) to official entrypoint /game-box
      if (decoded === '/' && !url.searchParams.has('v') && !url.searchParams.has('embed')) {
        response.writeHead(302, { Location: '/game-box' }).end();
        return;
      }

      // Route /game-box/deck-lab-single to unmodified Channel 3 vendor build
      if (decoded === '/game-box/deck-lab-single' || decoded === '/game-box/deck-lab-single/') {
        const singleHtml = path.join(staticRoot, 'vendor', 'channel-3', 'dist', 'index.html');
        if (fs.existsSync(singleHtml)) {
          response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': fs.statSync(singleHtml).size,
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
          });
          fs.createReadStream(singleHtml).pipe(response);
          return;
        }
      }

      if (decoded.startsWith('/game-box/deck-lab-single/')) {
        const subPath = decoded.replace('/game-box/deck-lab-single/', '');
        const targetSingle = path.join(staticRoot, 'vendor', 'channel-3', 'dist', subPath);
        if (fs.existsSync(targetSingle) && fs.statSync(targetSingle).isFile()) {
          const ext = path.extname(targetSingle).toLowerCase();
          const contentType = MIME.get(ext) || 'application/octet-stream';
          response.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': fs.statSync(targetSingle).size,
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
          });
          fs.createReadStream(targetSingle).pipe(response);
          return;
        }
      }

      // SPA History Route Support for /game-box, /game-box/retro, /game-box/deck, /game-box/draw, /game-box/deck-lab
      if (
        decoded === '/game-box' ||
        decoded === '/game-box/' ||
        decoded === '/game-box/retro' ||
        decoded === '/game-box/retro/' ||
        decoded === '/game-box/deck' ||
        decoded === '/game-box/deck/' ||
        decoded === '/game-box/draw' ||
        decoded === '/game-box/draw/' ||
        decoded === '/game-box/deck-lab' ||
        decoded === '/game-box/deck-lab/'
      ) {
        const spaHtml = path.join(wsRoot, 'game-box', 'index.html');
        if (fs.existsSync(spaHtml)) {
          response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': fs.statSync(spaHtml).size,
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
          });
          fs.createReadStream(spaHtml).pipe(response);
          return;
        }
      }

      let requested = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
      let target = path.resolve(staticRoot, requested);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        if (!pathname.endsWith('/')) {
          response.writeHead(302, { Location: `${pathname}/${url.search}` }).end();
          return;
        }
        target = path.join(target, 'index.html');
      }
      
      const isUnderStatic = target === staticRoot || target.startsWith(`${staticRoot}${path.sep}`);
      
      if (!isUnderStatic || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
        let fallbackTarget = path.resolve(wsRoot, requested);
        if (fs.existsSync(fallbackTarget) && fs.statSync(fallbackTarget).isDirectory()) {
          if (!pathname.endsWith('/')) {
            response.writeHead(302, { Location: `${pathname}/${url.search}` }).end();
            return;
          }
          fallbackTarget = path.join(fallbackTarget, 'index.html');
        }
        const allowedRoots = ['game-box', 'tool-box', 'assets', 'data', 'pikachu-volleyball', 'roulette', 'platform', 'win98-web'];
        const isAllowed = allowedRoots.some(r => requested === r || requested.startsWith(`${r}/`) || requested.startsWith(`${r}\\`));
        if (isAllowed && fallbackTarget.startsWith(`${wsRoot}${path.sep}`) && fs.existsSync(fallbackTarget) && fs.statSync(fallbackTarget).isFile()) {
          target = fallbackTarget;
        } else if (!isUnderStatic) {
          response.writeHead(403).end('Forbidden'); return;
        } else if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
          response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found'); return;
        }
      }
      response.writeHead(200, {
        'Content-Type': MIME.get(path.extname(target).toLowerCase()) || 'application/octet-stream',
        'Content-Length': fs.statSync(target).size,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      fs.createReadStream(target).pipe(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      json(response, 400, { error: message });
    }
  });
  originalBlastArena.attach(server);
  originalBombergirl.attach(server);
  server.on('close', () => {
    store.close();
    platformStore.close();
    gameBoxStore.close();
  });
  return { server, store, platformStore, gameBoxStore, realtimeHub };
}
