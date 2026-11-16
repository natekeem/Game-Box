import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GAME_REGISTRY as CLIENT_GAME_REGISTRY } from '../platform-src/registry.js';
import { GAME_REGISTRY_META as SERVER_GAME_REGISTRY } from '../server/platform-store.mjs';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDir, '..');
const stageSource = fs.readFileSync(
  path.join(root, 'platform-src', 'components', 'GamePlayStage.jsx'),
  'utf8',
);
const originalArcadeSource = fs.readFileSync(
  path.join(root, 'platform-src', 'components', 'OriginalArcadeArenas.jsx'),
  'utf8',
);
const appSource = fs.readFileSync(path.join(root, 'platform-src', 'GamePlatformApp.jsx'), 'utf8');
const platformCss = fs.readFileSync(path.join(root, 'platform-src', 'platform.css'), 'utf8');
const blastClientSource = fs.readFileSync(
  path.join(root, 'vendor', 'blast-arena-original', 'app', 'main.js'),
  'utf8',
);
const blastGameSource = fs.readFileSync(
  path.join(root, 'vendor', 'blast-arena-original', 'app', 'screens', 'game.js'),
  'utf8',
);
const blastAdapterSource = fs.readFileSync(
  path.join(root, 'server', 'original-blast-arena-adapter.mjs'),
  'utf8',
);
const bombergirlIndexSource = fs.readFileSync(
  path.join(root, 'vendor', 'html5-bombergirl-original', 'index.html'),
  'utf8',
);
const bombergirlGameSource = fs.readFileSync(
  path.join(root, 'vendor', 'html5-bombergirl-original', 'js', 'GameEngine.js'),
  'utf8',
);
const bombergirlAdapterSource = fs.readFileSync(
  path.join(root, 'server', 'original-bombergirl-adapter.mjs'),
  'utf8',
);
const bombergirlOnlineSource = fs.readFileSync(
  path.join(root, 'server', 'original-bombergirl-online-client.js'),
  'utf8',
);

test('GamePlayStage의 게임 클래스는 모두 스타일 계약을 갖는다', () => {
  const usedClasses = new Set(stageSource.match(/(?:gp|bb)-[a-zA-Z0-9-]+/g) || []);
  const definedClasses = new Set(
    (platformCss.match(/\.(?:gp|bb)-[a-zA-Z0-9-]+/g) || []).map(selector => selector.slice(1)),
  );
  const missing = [...usedClasses].filter(className => !definedClasses.has(className)).sort();

  assert.deepEqual(
    missing,
    [],
    `게임 화면에서 사용하지만 platform.css에 정의되지 않은 클래스: ${missing.join(', ')}`,
  );
});

test('스네이크는 원본 Canvas, 봄버맨과 봄버걸은 벤더 원본 클라이언트를 직접 실행한다', () => {
  assert.match(originalArcadeSource, /className="sd-board" width="600" height="400"/);
  assert.match(originalArcadeSource, /requestAnimationFrame\(draw\)/);
  assert.match(originalArcadeSource, /src=\{`\/original-blast-arena\/\?mode=/);
  assert.match(originalArcadeSource, /className="ba-original-frame"/);
  assert.match(originalArcadeSource, /className="bg-original-frame"/);
  assert.match(originalArcadeSource, /`\/original-bombergirl\/\?\$\{params\.toString\(\)\}`/);
  assert.match(platformCss, /\.ba-original-frame[\s\S]*?width:\s*100%/);
  assert.match(blastClientSource, /import \{ GameScreen,[^}]+\} from '\.\/screens\/game\.js'/);
  assert.match(blastAdapterSource, /transport-only/);
  assert.match(bombergirlIndexSource, /<canvas id="canvas" width="545" height="416"><\/canvas>/);
  assert.match(bombergirlGameSource, /tilesX:\s*17/);
  assert.match(bombergirlGameSource, /tilesY:\s*13/);
  assert.match(bombergirlAdapterSource, /original-plus-input-relay/);
  assert.match(bombergirlOnlineSource, /gGameEngine\.menu\.setMode\('single'\)/);
});

test('봄버맨 아이템과 HUD는 재구현이 아닌 벤더 원본 화면에서 렌더링한다', () => {
  assert.match(blastGameSource, /const \{ players = \{\}, bombs = \{\}, powerUps = \{\}/);
  assert.match(blastGameSource, /className: `powerup \$\{powerUpOnTile\.kind\}`/);
  assert.match(blastGameSource, /className: 'bomb'/);
  assert.match(blastGameSource, /className: 'explosion'/);
  assert.match(blastAdapterSource, /import \{ gameState \} from '\.\.\/vendor\/blast-arena-original\/server\/state\.js'/);
  assert.doesNotMatch(originalArcadeSource, /ba-tile-layer|ba-entity-layer|POWER_META/);
});

test('BattleBox 대전 화면은 점수판과 상태 표시를 유지한다', () => {
  assert.match(stageSource, /className="bb-scoreboard-bar"/);
  assert.match(stageSource, /className=\{`gp-status-banner bb-status-banner/);
  assert.match(stageSource, /className="gp-stage-inner bb-arena-body"/);
});

test('룰렛을 제외한 19개 게임은 1인·BOT·온라인 진입 기능을 노출한다', () => {
  const clientGames = CLIENT_GAME_REGISTRY.filter(game => game.id !== 'roulette');
  const serverById = new Map(SERVER_GAME_REGISTRY.map(game => [game.id, game]));

  for (const clientGame of clientGames) {
    const serverGame = serverById.get(clientGame.id);
    assert.ok(serverGame, `서버 레지스트리에 ${clientGame.id}가 없습니다.`);
    for (const capability of ['supportsSolo', 'supportsBot', 'supportsOnline']) {
      assert.equal(clientGame[capability], true, `${clientGame.id} client ${capability}`);
      assert.equal(serverGame[capability], true, `${clientGame.id} server ${capability}`);
    }
  }

  const originalBomberman = CLIENT_GAME_REGISTRY.find(game => game.id === 'bomberman');
  assert.equal(originalBomberman.supportsSolo, true);
  assert.equal(originalBomberman.supportsBot, true);
  assert.equal(originalBomberman.supportsOnline, true);
  assert.match(appSource, /싱글 vs 컴퓨터/);
  assert.match(appSource, /원본 멀티 \(2~4인\)/);

  const originalBombergirl = CLIENT_GAME_REGISTRY.find(game => game.id === 'bombergirl');
  assert.ok(originalBombergirl);
  assert.match(appSource, /원본 싱글 \+ AI 3명/);
  assert.match(appSource, /온라인 2인 방/);
});

test('온라인 방장 권한은 서버의 hostId 필드와 연결된다', () => {
  assert.match(appSource, /const roomHostId = currentRoom\?\.hostId \|\| currentRoom\?\.host/);
  assert.match(appSource, /const isRoomHost = !!currentRoom && roomHostId === currentUser\?\.id/);
  assert.match(appSource, /p\.id === roomHostId/);
});

test('현재 방과 다른 SSE 패킷은 게임 화면 상태를 덮어쓰지 않는다', () => {
  assert.match(appSource, /const eventRoomCode = data\?\.roomCode \|\| data\?\.code \|\| null/);
  assert.match(appSource, /if \(eventRoomCode && eventRoomCode !== roomCode\) return/);
});
