import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'original-player-src');
const output = path.join(root, 'hancom97-original');
const sourceBundle = path.join(root, 'original-dos', 'hancom-typing-1997.jsdos');
const referenceRoot = path.join(root, 'references', '한컴타자연습 1997');
const referenceExe = path.join(referenceRoot, '_HTTD_.EXE');
const jsDosDist = path.join(root, 'node_modules', 'js-dos', 'dist');
const emulatorsDist = path.join(root, 'node_modules', 'emulators', 'dist');
const recordBridgeSource = path.join(root, 'tool-box', 'src', 'features', 'game-box', 'hancom97RecordBridge.js');
const expectedExeHash = '4CD9A0EFCD7676D6F08528643BB76FCB0834DC61881A046149AC85B0702C90C7';
const expectedSourceBundleHash = '43ACF7FEE437F30B503C2C2164A84A0D4A53E39F3D857ED9C68D4DA979400B15';
const dosboxConfig = `[sdl]
fullscreen=false
fulldouble=false
[speaker]
pcspeaker=true
[dosbox]
memsize=16
[cpu]
core=auto
cycles=auto
[render]
frameskip=0
[autoexec]
@echo off
mount c .
c:
_HTTD_.EXE
`;
const packagingDosboxConfig = dosboxConfig.replace('_HTTD_.EXE\n', '');
const jsdosMetadata = { version: '8', title: 'Hancom Typing 1997' };

function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
}

function requirePath(target, label) {
  if (!fs.existsSync(target)) throw new Error(`${label}이 없습니다: ${target}`);
}

function tarRead(archive, entry) {
  const result = spawnSync('tar', ['-xOf', archive, entry], { encoding: null, maxBuffer: 8 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`번들에서 ${entry} 읽기 실패: ${String(result.stderr)}`);
  return result.stdout;
}

function tarList(archive) {
  const result = spawnSync('tar', ['-tf', archive], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`번들 목록 읽기 실패: ${result.stderr}`);
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

function safeRemoveTemp(target) {
  const tempRoot = path.resolve(os.tmpdir());
  const resolved = path.resolve(target);
  const relative = path.relative(tempRoot, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || !path.basename(resolved).startsWith('hancom97-bundle-')) {
    throw new Error(`임시 경로 안전 검사 실패: ${resolved}`);
  }
  fs.rmSync(resolved, { recursive: true, force: true });
}

requirePath(source, '원본 플레이어 소스');
requirePath(sourceBundle, '1997 js-dos 원본 자료 번들');
requirePath(referenceExe, '사용자 지정 _HTTD_.EXE');
requirePath(jsDosDist, 'js-dos 8.5.3 런타임');
requirePath(emulatorsDist, 'emulators 8.5.2 런타임');
requirePath(recordBridgeSource, '한컴타자연습 기록 브리지');

const referenceExeHash = hash(fs.readFileSync(referenceExe));
const sourceBundleHash = hash(fs.readFileSync(sourceBundle));
const bundledExeHash = hash(tarRead(sourceBundle, '_HTTD_.EXE'));
if (referenceExeHash !== expectedExeHash) throw new Error(`참조 EXE 해시가 변경되었습니다: ${referenceExeHash}`);
if (bundledExeHash !== expectedExeHash) throw new Error(`번들 EXE가 원본과 다릅니다: ${bundledExeHash}`);
if (sourceBundleHash !== expectedSourceBundleHash) throw new Error(`원본 자료 번들 해시가 변경되었습니다: ${sourceBundleHash}`);

const archiveEntries = tarList(sourceBundle);
const dataEntries = archiveEntries.filter(entry => entry === '_HTTD_.EXE' || entry.startsWith('APP/HNCTT/'));
for (const entry of dataEntries) {
  const reference = entry === '_HTTD_.EXE' ? referenceExe : path.join(referenceRoot, ...entry.split('/'));
  requirePath(reference, `원본 자료 ${entry}`);
  const referenceHash = hash(fs.readFileSync(reference));
  const archiveHash = hash(tarRead(sourceBundle, entry));
  if (referenceHash !== archiveHash) throw new Error(`${entry}가 제공 원본과 다릅니다.`);
}

// 기존 자료 번들의 파일 내용은 정확하지만 일반 ZIP 작성기로 만들어져 js-dos/libzip이
// APP/HNCTT를 복원하지 못한다. 원본 바이트를 InitFileEntry로 직접 적재한 뒤 js-dos가
// 자신의 파일시스템을 패키징하게 하여 런타임 호환 .jsdos를 만든다.
const bundleStage = fs.mkdtempSync(path.join(os.tmpdir(), 'hancom97-bundle-'));
const generatedBundle = path.join(bundleStage, 'hancom-typing-1997.jsdos');
try {
  await import('emulators');
  const emulatorApi = globalThis.emulators;
  if (!emulatorApi?.dosboxNode || !emulatorApi?.bundleUpdateConfig) {
    throw new Error('emulators 8.5.2 Node API를 초기화하지 못했습니다.');
  }
  emulatorApi.pathPrefix = `${path.resolve(emulatorsDist)}${path.sep}`;

  const initEntries = [];
  for (const entry of dataEntries) {
    const sourceFile = entry === '_HTTD_.EXE' ? referenceExe : path.join(referenceRoot, ...entry.split('/'));
    initEntries.push({ path: entry, contents: new Uint8Array(fs.readFileSync(sourceFile)) });
  }
  initEntries.push({ dosboxConf: packagingDosboxConfig, jsdosConf: jsdosMetadata });

  let packer = null;
  let packed = null;
  try {
    packer = await emulatorApi.dosboxNode(initEntries);
    packed = await packer.persist(false);
  } finally {
    if (packer) {
      try { await packer.exit(); } catch { /* 패키징 완료 후 종료 실패는 번들 검증에서 잡힌다. */ }
    }
  }
  if (!packed) throw new Error('js-dos 파일시스템 패키징 결과가 비어 있습니다.');
  const generatedBytes = await emulatorApi.bundleUpdateConfig(packed, {
    dosboxConf: dosboxConfig,
    jsdosConf: jsdosMetadata,
  });
  fs.writeFileSync(generatedBundle, generatedBytes);

  const generatedEntries = tarList(generatedBundle);
  for (const directory of ['APP/', 'APP/HNCTT/', '.jsdos/']) {
    if (!generatedEntries.includes(directory)) throw new Error(`실행 번들 디렉터리 엔트리 누락: ${directory}`);
  }
  for (const entry of dataEntries) {
    const sourceFile = entry === '_HTTD_.EXE' ? referenceExe : path.join(referenceRoot, ...entry.split('/'));
    if (hash(tarRead(generatedBundle, entry)) !== hash(fs.readFileSync(sourceFile))) {
      throw new Error(`실행 번들에서 ${entry} 바이트가 변경되었습니다.`);
    }
  }

  const relativeOutput = path.relative(root, output);
  if (!relativeOutput || relativeOutput.startsWith('..') || path.isAbsolute(relativeOutput)) throw new Error('출력 경로가 작업공간 밖입니다.');
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  fs.cpSync(source, output, { recursive: true, force: true });
  fs.copyFileSync(recordBridgeSource, path.join(output, 'record-bridge.js'));
  fs.mkdirSync(path.join(output, 'vendor', 'js-dos'), { recursive: true });
  fs.cpSync(jsDosDist, path.join(output, 'vendor', 'js-dos'), { recursive: true, force: true });
  fs.cpSync(emulatorsDist, path.join(output, 'vendor', 'js-dos', 'emulators'), { recursive: true, force: true });
  fs.copyFileSync(generatedBundle, path.join(output, 'hancom-typing-1997.jsdos'));
  fs.mkdirSync(path.join(output, 'licenses'), { recursive: true });
  fs.copyFileSync(path.join(root, 'node_modules', 'emulators', 'LICENSE'), path.join(output, 'licenses', 'js-dos-GPL-2.0.txt'));

  const runtimeBundleHash = hash(fs.readFileSync(generatedBundle));
  const builtPlayerPath = path.join(output, 'player.js');
  const builtPlayer = fs.readFileSync(builtPlayerPath, 'utf8').replace('__HANCOM97_BUNDLE_SHA256__', runtimeBundleHash.toLowerCase());
  if (builtPlayer.includes('__HANCOM97_BUNDLE_SHA256__')) throw new Error('플레이어 번들 해시 치환 실패');
  fs.writeFileSync(builtPlayerPath, builtPlayer, 'utf8');

  const manifest = {
    title: '한컴타자연습 97 원본 실행기',
    generatedAt: new Date().toISOString(),
    originalExe: { file: '_HTTD_.EXE', sha256: referenceExeHash },
    sourceBundle: { file: 'original-dos/hancom-typing-1997.jsdos', sha256: sourceBundleHash },
    runtimeBundle: {
      file: 'hancom-typing-1997.jsdos',
      sha256: runtimeBundleHash,
      verifiedOriginalFiles: dataEntries.length,
      jsDosNativePackaging: true,
      requiredDirectoryEntries: ['APP/', 'APP/HNCTT/', '.jsdos/'],
    },
    runtime: { jsDos: '8.5.3', emulators: '8.5.2', license: 'GPL-2.0' },
  };
  fs.writeFileSync(path.join(output, 'runtime-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const totalBytes = fs.readdirSync(output, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .reduce((sum, entry) => sum + fs.statSync(path.join(entry.parentPath, entry.name)).size, 0);
  console.log(`Built ${relativeOutput} (${(totalBytes / 1024 / 1024).toFixed(2)} MiB)`);
  console.log(`Verified exact _HTTD_.EXE + ${dataEntries.length - 1} original data files.`);
  console.log(`Runtime bundle SHA-256 ${runtimeBundleHash}`);
} finally {
  safeRemoveTemp(bundleStage);
}
