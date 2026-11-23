import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAW_GAMES } from '../tool-box/src/features/game-box/registry/drawGames.js';
import { secureRandomInt, secureRandomFloat, shuffleUnbiased } from '../tool-box/src/features/game-box/draw/shared/randomEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('RANDOM PLAY ZONE 6개 추첨 게임(기존 마블 룰렛 + 신규 5종) 레지스트리 및 원본 오픈소스 저장소·라이선스 보존 검증', () => {
  assert.equal(DRAW_GAMES.length, 6);
  const expectedIds = ['roulette', 'bomb-ladder', 'lotto-645', 'team-draft', 'chaos-wheel', 'mystery-box'];
  assert.deepEqual(DRAW_GAMES.map(g => g.id), expectedIds);

  const vendorRepos = [
    { dir: 'pickle-eight', licenseFile: 'LICENSE' },
    { dir: '3d-lottery', licenseFile: 'README.md' },
    { dir: 'random-team-generator', licenseFile: 'README.md' },
    { dir: 'spin-the-wheel', licenseFile: 'LICENSE' },
    { dir: 'lottery-draw', licenseFile: 'LICENSE' },
  ];

  for (const repo of vendorRepos) {
    const repoPath = path.join(rootDir, 'vendor', repo.dir);
    assert.equal(fs.existsSync(repoPath), true, `vendor/${repo.dir} 디렉터리가 존재해야 함`);
    const licPath = path.join(repoPath, repo.licenseFile);
    assert.equal(fs.existsSync(licPath), true, `vendor/${repo.dir}/${repo.licenseFile} 파일이 존재해야 함`);
    const content = fs.readFileSync(licPath, 'utf8');
    assert.match(content, /MIT|ISC|Free to use/i, `vendor/${repo.dir} 라이선스 고지가 포함되어야 함`);
  }
});

test('편향 없는 난수 엔진(secureRandomInt, secureRandomFloat, shuffleUnbiased) 무결성 검증', () => {
  for (let i = 0; i < 200; i += 1) {
    const v = secureRandomInt(10);
    assert.ok(Number.isInteger(v) && v >= 0 && v < 10);
    const f = secureRandomFloat();
    assert.ok(f >= 0 && f < 1);
  }

  const original = [1, 2, 3, 4, 5, 6, 7, 8];
  const shuffled = shuffleUnbiased(original);
  assert.equal(shuffled.length, original.length);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), original);
});

test('5개 독립형 미니게임 소스 및 번들 통합 검증', () => {
  const bundleJsPath = path.join(rootDir, 'game-box', 'bundle.js');
  assert.equal(fs.existsSync(bundleJsPath), true, 'game-box/bundle.js가 빌드되어 있어야 함');
  const bundleText = fs.readFileSync(bundleJsPath, 'utf8');

  assert.ok(bundleText.includes('BOMB LADDER'), '번들에 BOMB LADDER가 포함되어야 함');
  assert.ok(bundleText.includes('LOTTO 6/45'), '번들에 LOTTO 6/45가 포함되어야 함');
  assert.ok(bundleText.includes('TEAM DRAFT'), '번들에 TEAM DRAFT가 포함되어야 함');
  assert.ok(bundleText.includes('CHAOS WHEEL'), '번들에 CHAOS WHEEL가 포함되어야 함');
  assert.ok(bundleText.includes('MYSTERY BOX'), '번들에 MYSTERY BOX가 포함되어야 함');
});
