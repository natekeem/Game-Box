import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

test('3D 오픈소스 원본 라이선스 및 포팅 메타데이터가 완벽하게 보존되어 있다', async (t) => {
  await t.test('Finally 3D Game Cases Plugin 라이선스 (BSD-3-Clause) 검증', () => {
    const licensePath = path.join(projectRoot, 'vendor', 'finally-3d-game-cases', 'LICENSE');
    assert.ok(fs.existsSync(licensePath), 'vendor/finally-3d-game-cases/LICENSE must exist');
    const licenseText = fs.readFileSync(licensePath, 'utf8');
    assert.ok(licenseText.includes('BSD 3-Clause License'), 'Must contain BSD 3-Clause License header');
    assert.ok(licenseText.includes('otisabiburada') || licenseText.includes('SANSO'), 'Must contain copyright holder');
  });

  await t.test('PS2 Web 라이선스 (BSD-2-Clause) 및 CREDITS 검증', () => {
    const licensePath = path.join(projectRoot, 'vendor', 'ps2-web', 'LICENSE');
    const creditsPath = path.join(projectRoot, 'vendor', 'ps2-web', 'CREDITS.md');
    assert.ok(fs.existsSync(licensePath), 'vendor/ps2-web/LICENSE must exist');
    assert.ok(fs.existsSync(creditsPath), 'vendor/ps2-web/CREDITS.md must exist');
    const licenseText = fs.readFileSync(licensePath, 'utf8');
    assert.ok(licenseText.includes('BSD 2-Clause License'), 'Must contain BSD 2-Clause License header');
  });

  await t.test('gameDeckConfig.js에 포팅된 오픈소스 정보 및 Git commit SHA 기록 확인', async () => {
    const configModule = await import('../tool-box/src/features/game-box/deck/gameDeckConfig.js');
    const { PORTED_3D_ENGINES } = configModule;
    assert.ok(Array.isArray(PORTED_3D_ENGINES), 'PORTED_3D_ENGINES should be an array');
    assert.equal(PORTED_3D_ENGINES.length, 2, 'Should record both ported engines');

    const caseEngine = PORTED_3D_ENGINES.find(e => e.repo === 'otisabiburada/finally-3d-game-cases-plugin');
    assert.ok(caseEngine, 'Finally 3D Game Cases engine must be recorded');
    assert.equal(caseEngine.license, 'BSD-3-Clause');
    assert.equal(caseEngine.commit, '7e748d4bfad4e22ebccb318827724796bfeaf149');

    const consoleEngine = PORTED_3D_ENGINES.find(e => e.repo === 'brayanspagnol/ps2-web');
    assert.ok(consoleEngine, 'PS2 Web console engine must be recorded');
    assert.equal(consoleEngine.license, 'BSD-2-Clause');
    assert.equal(consoleEngine.commit, '654114aed6b85aacb1b3e68793808b3eb3feca13');
  });
});

test('포팅된 FinallyCaseEngine 모듈이 원본 engine.ts 핵심 API를 제공한다', async () => {
  const engineModule = await import('../tool-box/src/features/game-box/deck/cases/FinallyCaseEngine.js');
  const { buildCss, insertSounds, runInsert, PALETTE, SHAPES, WEAR_CSS } = engineModule;

  assert.equal(typeof buildCss, 'function', 'buildCss must be a function');
  assert.equal(typeof insertSounds, 'function', 'insertSounds must be a function');
  assert.equal(typeof runInsert, 'function', 'runInsert must be a function');
  assert.ok(PALETTE && typeof PALETTE === 'object', 'PALETTE must be defined');
  assert.ok(SHAPES && typeof SHAPES === 'object', 'SHAPES must be defined');
  assert.ok(WEAR_CSS && typeof WEAR_CSS === 'object', 'WEAR_CSS must be defined');

  const generatedCss = buildCss({
    aspectRatio: '2:3',
    caseType: 'box',
    depthMm: 14,
    spineWidthMm: 14,
    paletteKey: 'dark'
  });
  assert.ok(generatedCss.includes('[data-sanso-case="box"]'), 'CSS must include box selector');
  assert.ok(generatedCss.includes('transform-style: preserve-3d'), 'CSS must preserve 3d');
});

test('기존 20종의 아케이드 게임 레지스트리가 보존되고 GameDeck 3D 환경에 정상 바인딩된다', async () => {
  const { ARCADE_GAMES } = await import('../tool-box/src/features/game-box/registry/arcadeGames.js');
  assert.equal(ARCADE_GAMES.length, 20, 'Must have 20 registered arcade games');

  for (const game of ARCADE_GAMES) {
    assert.ok(game.id, `Game must have an id`);
    assert.ok(game.name, `Game ${game.id} must have a name`);
    assert.ok(game.launchUrl, `Game ${game.id} must define launchUrl`);
    assert.ok(game.aspectRatio, `Game ${game.id} must define aspectRatio`);
    assert.ok(game.discLabel, `Game ${game.id} must define discLabel`);
  }
});
