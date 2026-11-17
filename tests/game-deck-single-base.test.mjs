import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

test('단일 오픈소스 대안(Channel 3) 원본 및 라이선스 메타데이터가 보존되어 있다', async (t) => {
  await t.test('Channel 3 원본 라이선스 (AGPL-3.0) 검증', () => {
    const licensePath = path.join(projectRoot, 'vendor', 'channel-3', 'LICENSE');
    assert.ok(fs.existsSync(licensePath), 'vendor/channel-3/LICENSE must exist');
    const licenseText = fs.readFileSync(licensePath, 'utf8');
    assert.ok(licenseText.includes('GNU AFFERO GENERAL PUBLIC LICENSE'), 'Must contain AGPL-3.0 header');
    assert.ok(licenseText.includes('Version 3, 19 November 2007'), 'Must specify version 3');
  });

  await t.test('Channel 3 빌드 배포본 (dist/index.html) 무변경 보존 검증', () => {
    const indexPath = path.join(projectRoot, 'vendor', 'channel-3', 'dist', 'index.html');
    assert.ok(fs.existsSync(indexPath), 'vendor/channel-3/dist/index.html must exist');
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    assert.ok(indexHtml.includes('Channel 3: where the NES used to live'), 'Must contain Channel 3 title');
    assert.ok(indexHtml.includes('id="carousel"'), 'Must contain cartridge carousel');
    assert.ok(indexHtml.includes('id="tv-frame"'), 'Must contain TV frame');
  });

  await t.test('gameDeckConfig.js에 SINGLE_BASE_ENGINE 정보 및 Git commit SHA 기록 확인', async () => {
    const configModule = await import('../tool-box/src/features/game-box/deck/gameDeckConfig.js');
    const { SINGLE_BASE_ENGINE } = configModule;
    assert.ok(SINGLE_BASE_ENGINE, 'SINGLE_BASE_ENGINE must be defined');
    assert.equal(SINGLE_BASE_ENGINE.repo, 'dau-in/channel-3');
    assert.equal(SINGLE_BASE_ENGINE.license, 'AGPL-3.0');
    assert.equal(SINGLE_BASE_ENGINE.commit, 'ab85fff7bcb97b69f9fb90c531cb357ba517e4c9');
    assert.equal(SINGLE_BASE_ENGINE.unmodifiedLabEndpoint, '/game-box/deck-lab-single/');
  });
});

test('3종 핵심 검증 게임(Battle Box, Snake Duel, Bomberman) 레지스트리가 보존되어 있다', async () => {
  const { ARCADE_GAMES } = await import('../tool-box/src/features/game-box/registry/arcadeGames.js');

  const battleBox = ARCADE_GAMES.find(g => g.id === 'reaction');
  assert.ok(battleBox, 'Battle Box (reaction) must exist in registry');
  assert.ok(battleBox.name.includes('Reaction Battle'), 'Name matches');

  const snakeDuel = ARCADE_GAMES.find(g => g.id === 'snakeduel');
  assert.ok(snakeDuel, 'Snake Duel (snakeduel) must exist in registry');

  const bomberman = ARCADE_GAMES.find(g => g.id === 'bomberman');
  assert.ok(bomberman, 'Bomberman (bomberman) must exist in registry');
});
