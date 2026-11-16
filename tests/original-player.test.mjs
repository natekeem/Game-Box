import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'hancom97-original');
const runtimeBundle = path.join(output, 'hancom-typing-1997.jsdos');
const referenceRoot = path.join(root, 'references', '한컴타자연습 1997');
const expectedExeHash = '4CD9A0EFCD7676D6F08528643BB76FCB0834DC61881A046149AC85B0702C90C7';

function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
}

function tar(args, encoding = 'utf8') {
  const result = spawnSync('tar', args, { encoding, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(result.status, 0, String(result.stderr));
  return result.stdout;
}

test('지정된 1997 _HTTD_.EXE가 바이트 단위로 고정돼 있다', () => {
  assert.equal(hash(fs.readFileSync(path.join(referenceRoot, '_HTTD_.EXE'))), expectedExeHash);
});

test('실행 번들은 js-dos 디렉터리와 mount c 설정을 포함한다', () => {
  const entries = tar(['-tf', runtimeBundle]).split(/\r?\n/).filter(Boolean);
  for (const required of ['APP/', 'APP/HNCTT/', '.jsdos/', '_HTTD_.EXE']) {
    assert.ok(entries.includes(required), `${required} 누락`);
  }
  const config = tar(['-xOf', runtimeBundle, '.jsdos/dosbox.conf']);
  assert.match(config, /^mount c \.$/m);
  assert.match(config, /^_HTTD_\.EXE$/m);
});

test('실행 번들의 EXE와 자료 30개가 제공 원본과 모두 같다', () => {
  const entries = tar(['-tf', runtimeBundle]).split(/\r?\n/).filter(Boolean)
    .filter(entry => entry === '_HTTD_.EXE' || entry.startsWith('APP/HNCTT/') && !entry.endsWith('/'));
  assert.equal(entries.length, 31);
  for (const entry of entries) {
    const reference = entry === '_HTTD_.EXE'
      ? path.join(referenceRoot, entry)
      : path.join(referenceRoot, ...entry.split('/'));
    assert.equal(hash(tar(['-xOf', runtimeBundle, entry], null)), hash(fs.readFileSync(reference)), entry);
  }
});

test('manifest, 실제 번들, 브라우저 검증 해시가 일치한다', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(output, 'runtime-manifest.json'), 'utf8'));
  const player = fs.readFileSync(path.join(output, 'player.js'), 'utf8');
  const actual = hash(fs.readFileSync(runtimeBundle));
  assert.equal(manifest.originalExe.sha256, expectedExeHash);
  assert.equal(manifest.runtimeBundle.sha256, actual);
  assert.match(player, new RegExp(actual.toLowerCase()));
  assert.match(player, /hancom-typing-1997\.jsdos\?v=/);
});

test('플레이어는 재구현 엔진 없이 원본 DOS CommandInterface를 노출한다', () => {
  const player = fs.readFileSync(path.join(output, 'player.js'), 'utf8');
  assert.match(player, /window\.Dos\(dosElement/);
  assert.match(player, /pathPrefix:\s*'\.\/vendor\/js-dos\/emulators\/'/);
  assert.match(player, /window\.hancom97CommandInterface\s*=\s*arg/);
  assert.doesNotMatch(player, /gameBoxEngine|scoreTyping|original-lessons/);
});

test('js-dos와 emulator 런타임 버전은 정확히 고정돼 있다', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.dependencies['js-dos'], '8.5.3');
  assert.equal(pkg.dependencies.emulators, '8.5.2');
});

test('React 어댑터가 원본 런타임과 백엔드용 기록 콜백을 연결한다', () => {
  const adapter = fs.readFileSync(path.join(root, 'tool-box', 'src', 'features', 'game-box', 'Hancom97Original.jsx'), 'utf8');
  assert.match(adapter, /assetBaseUrl\s*=\s*'\/games\/hancom97'/);
  assert.match(adapter, /callbacksRef\.current\.onReady\?\.\(value\)/);
  assert.match(adapter, /callbacksRef\.current\.onRecords\?\.\(snapshot\)/);
  assert.match(adapter, /callbacksRef\.current\.loadRecords\?\.\(\)/);
  assert.match(adapter, /snapshotToInitFs\(loadedSnapshot \?\? initialRecordSnapshotRef\.current\)/);
  assert.match(adapter, /value\.events\(\)\.onExit/);
  assert.match(adapter, /fsChanges:\s*\{\s*local:\s*false\s*\}/);
  assert.doesNotMatch(adapter, /gameBoxEngine|scoreTyping|original-lessons/);
});

test('독립 실행기에도 원본 기록 내보내기와 복원 브리지가 포함된다', () => {
  const player = fs.readFileSync(path.join(output, 'player.js'), 'utf8');
  const bridge = fs.readFileSync(path.join(output, 'record-bridge.js'), 'utf8');
  assert.match(player, /window\.hancom97LoadRecords/);
  assert.match(player, /hancom97-records/);
  assert.match(player, /createRecordBridge\(arg/);
  assert.match(player, /visibilitychange/);
  assert.match(player, /pagehide/);
  assert.match(bridge, /HTP\.SCO/);
  assert.match(bridge, /HTT\.STA/);
});
