import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const referenceRoot = path.join(root, 'references', '한메타자교사 3.0');
const output = path.join(root, 'hanme30-original');
const jsDosDist = path.join(root, 'node_modules', 'js-dos', 'dist');
const emulatorsDist = path.join(root, 'node_modules', 'emulators', 'dist');

const expectedHashes = {
  'HTT.DAT': '1EC43138DA0DD78F5255164FBB5F9F845997DBE0089378AE24323680BDECFA02',
  'HTT.EXE': '9620801EED17FA9D48187FD65CF93C17C37081AB8B69123B4FEBAAB87BFDE563',
  'PROVERB.ENG': 'F72782869D79107B41189EEF7DFA4AD993BB9024559046C5CB6922FE431FAA46',
  'PROVERB.KOR': 'FA7EAEF8B8D195CF28E332BB1CADF3CBA62B3C1A940E4C35E3632F83BC19FBFB',
  'WORD.ENG': 'CFEF6B615034A523640A168D1C62B3A28B184209DB417B15FDBFADCF8BD27FDF',
  'WORD.KOR': '4CEE9D9B06C5E5E6C9F218B98D010E460C27A6457B2589021267889A9C4AFC6D',
};

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
HTT.EXE
`;

const packagingDosboxConfig = dosboxConfig.replace('HTT.EXE\n', '');
const jsdosMetadata = { version: '8', title: 'Hanme Typing 3.0' };

function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
}

function safeRemoveTemp(target) {
  const tempRoot = path.resolve(os.tmpdir());
  const resolved = path.resolve(target);
  const relative = path.relative(tempRoot, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || !path.basename(resolved).startsWith('hanme30-bundle-')) {
    throw new Error(`임시 경로 안전 검사 실패: ${resolved}`);
  }
  fs.rmSync(resolved, { recursive: true, force: true });
}

export async function buildHanmePlayer() {
  console.log('=== 한메타자교사 3.0 원본 빌드 시작 ===');
  
  // 1. 원본 파일 검증
  for (const [file, expectedHash] of Object.entries(expectedHashes)) {
    const fullPath = path.join(referenceRoot, file);
    if (!fs.existsSync(fullPath)) throw new Error(`원본 파일이 없습니다: ${file}`);
    const actualHash = hash(fs.readFileSync(fullPath));
    if (actualHash !== expectedHash) throw new Error(`${file} 해시 불일치: ${actualHash} (예상: ${expectedHash})`);
  }
  console.log(`한메타자교사 3.0 원본 파일 ${Object.keys(expectedHashes).length}개 무결성 검증 완료.`);

  // 2. js-dos 번들 빌드
  const bundleStage = fs.mkdtempSync(path.join(os.tmpdir(), 'hanme30-bundle-'));
  const generatedBundle = path.join(bundleStage, 'hanme-typing-3.jsdos');
  
  try {
    await import('emulators');
    const emulatorApi = globalThis.emulators;
    emulatorApi.pathPrefix = `${path.resolve(emulatorsDist)}${path.sep}`;

    const initEntries = [];
    for (const file of Object.keys(expectedHashes)) {
      const fullPath = path.join(referenceRoot, file);
      initEntries.push({ path: file, contents: new Uint8Array(fs.readFileSync(fullPath)) });
    }
    initEntries.push({ dosboxConf: packagingDosboxConfig, jsdosConf: jsdosMetadata });

    let packer = null;
    let packed = null;
    try {
      packer = await emulatorApi.dosboxNode(initEntries);
      packed = await packer.persist(false);
    } finally {
      if (packer) {
        try { await packer.exit(); } catch {}
      }
    }

    if (!packed) throw new Error('js-dos 번들 패키징 결과가 비어 있습니다.');
    const generatedBytes = await emulatorApi.bundleUpdateConfig(packed, {
      dosboxConf: dosboxConfig,
      jsdosConf: jsdosMetadata,
    });
    fs.writeFileSync(generatedBundle, generatedBytes);
    const bundleHash = hash(generatedBytes);
    console.log(`hanme-typing-3.jsdos 생성 완료 (${(generatedBytes.length / 1024).toFixed(1)} KiB, SHA-256: ${bundleHash})`);

    // 3. 출력 디렉터리 준비
    fs.mkdirSync(output, { recursive: true });
    fs.mkdirSync(path.join(output, 'vendor', 'js-dos'), { recursive: true });
    fs.cpSync(jsDosDist, path.join(output, 'vendor', 'js-dos'), { recursive: true, force: true });
    fs.cpSync(emulatorsDist, path.join(output, 'vendor', 'js-dos', 'emulators'), { recursive: true, force: true });
    fs.copyFileSync(generatedBundle, path.join(output, 'hanme-typing-3.jsdos'));

    // 4. HTML/CSS/JS 플레이어 생성
    writePlayerFiles(output, bundleHash);

    // 5. Manifest 생성
    const manifest = {
      title: '한메타자교사 3.0 원본 실행기',
      generatedAt: new Date().toISOString(),
      originalFiles: expectedHashes,
      runtimeBundle: {
        file: 'hanme-typing-3.jsdos',
        sha256: bundleHash,
        verifiedOriginalFiles: Object.keys(expectedHashes).length,
      },
      runtime: { jsDos: '8.5.3', emulators: '8.5.2', license: 'GPL-2.0' },
    };
    fs.writeFileSync(path.join(output, 'runtime-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

    console.log(`한메타자교사 3.0 빌드 완료: ${output}`);
    return manifest;
  } finally {
    safeRemoveTemp(bundleStage);
  }
}

function writePlayerFiles(outDir, bundleHash) {
  // player.html / index.html
  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>한메타자교사 3.0 — 원본 실행</title>
  <link rel="icon" href="./favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="./vendor/js-dos/js-dos.css">
  <link rel="stylesheet" href="./player.css">
  <script defer src="./vendor/js-dos/js-dos.js"></script>
  <script type="module" src="./player.js"></script>
</head>
<body>
  <main class="original-player" id="player-shell">
    <header class="player-header">
      <div>
        <p class="eyebrow">ORIGINAL DOS PROGRAM · 1994</p>
        <h1>한메타자교사 3.0</h1>
      </div>
      <div class="player-actions" aria-label="버전 선택 및 화면 조작">
        <a class="header-link hub-link" href="../hub.html" title="4개 버전 전체 선택">🎮 타자연습 4개 버전 허브</a>
        <a class="header-link" href="../hancom97-original/" title="한컴타자연습 97 실행">한컴 97</a>
        <button type="button" id="toggle-frame">원본 화면만 보기</button>
        <button type="button" id="restart">다시 시작</button>
        <button type="button" id="fullscreen">전체 화면</button>
      </div>
    </header>

    <section class="machine-wrap" id="machine-wrap" aria-label="CRT 모니터 속 한메타자교사 원본 실행 화면">
      <div class="machine-stage">
        <div class="screen-glass">
          <div id="dos" role="application" aria-label="한메타자교사 3.0 원본 DOS 프로그램"></div>
          <div class="boot-cover" id="boot-cover">
            <div class="boot-led" aria-hidden="true"></div>
            <strong id="boot-title">한메타자교사 3.0 준비 중</strong>
            <span id="boot-detail">HTT.EXE와 자료 파일을 로딩합니다.</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="player-footer">
      <p id="status" class="status" aria-live="polite">초기화 중…</p>
      <p class="keyboard-note">원본 DOS 프로그램이 직접 키 입력을 처리합니다. 한글 입력 시 브라우저 입력기는 영문 상태로 두고, 프로그램 자체 한글 입력 모드를 사용하세요. <kbd>Esc</kbd>는 이전 메뉴 키입니다.</p>
    </footer>
  </main>
</body>
</html>`;
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

  // player.js
  const js = `(() => {
  'use strict';

  const EXPECTED_BUNDLE_SHA256 = '${bundleHash.toLowerCase()}';
  const BUNDLE_URL = './hanme-typing-3.jsdos?v=' + EXPECTED_BUNDLE_SHA256.slice(0, 16);
  const shell = document.getElementById('player-shell');
  const dosElement = document.getElementById('dos');
  const status = document.getElementById('status');
  const bootCover = document.getElementById('boot-cover');
  const bootTitle = document.getElementById('boot-title');
  const bootDetail = document.getElementById('boot-detail');
  let player = null;
  let generation = 0;

  const setStatus = (message, detail = '') => {
    status.textContent = message;
    bootTitle.textContent = message;
    if (detail) bootDetail.textContent = detail;
  };

  async function stopPlayer() {
    if (player?.stop) {
      try { await player.stop(); } catch (error) { console.warn('js-dos stop failed', error); }
    }
    player = null;
    dosElement.replaceChildren();
  }

  async function launch() {
    const ownGeneration = ++generation;
    bootCover.classList.remove('hidden');
    await stopPlayer();
    try {
      if (typeof window.Dos !== 'function') throw new Error('js-dos 런타임을 불러오지 못했습니다.');
      setStatus('한메타자교사 3.0 DOSBox 시작 중', '번들 검증 및 환경 초기화 중');
      player = window.Dos(dosElement, {
        url: BUNDLE_URL,
        pathPrefix: './vendor/js-dos/emulators/',
        backend: 'dosbox',
        backendLocked: true,
        autoStart: true,
        kiosk: true,
        imageRendering: 'pixelated',
        renderBackend: 'canvas',
        renderAspect: '4/3',
        mouseCapture: false,
        noCursor: false,
        autoSave: false,
        onEvent(event, arg) {
          if (ownGeneration !== generation) return;
          if (event === 'emu-ready') setStatus('DOSBox 준비 완료', 'HTT.EXE를 부팅합니다.');
          if (event === 'bnd-play') setStatus('한메타자교사 3.0 실행 중', '원본 프로그램 시작을 기다립니다.');
          if (event === 'ci-ready') {
            window.hanme30CommandInterface = arg;
            setStatus('한메타자교사 3.0 실행 중', '화면을 클릭한 뒤 조작하세요. (베네치아, 자리연습 등)');
            bootCover.classList.add('hidden');
            dosElement.focus({ preventScroll: true });
          }
        },
      });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      setStatus('실행 실패', message);
      bootDetail.textContent = message;
    }
  }

  document.getElementById('toggle-frame').addEventListener('click', event => {
    shell.classList.toggle('clean-view');
    event.currentTarget.textContent = shell.classList.contains('clean-view') ? 'CRT 프레임 보기' : '원본 화면만 보기';
  });
  document.getElementById('restart').addEventListener('click', launch);
  document.getElementById('fullscreen').addEventListener('click', async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.getElementById('machine-wrap').requestFullscreen();
  });

  launch();
})();`;
  fs.writeFileSync(path.join(outDir, 'player.js'), js, 'utf8');

  // player.css
  const css = fs.readFileSync(path.join(root, 'original-player-src', 'player.css'), 'utf8');
  fs.writeFileSync(path.join(outDir, 'player.css'), css, 'utf8');

  // favicon.svg
  const favicon = fs.readFileSync(path.join(root, 'original-player-src', 'favicon.svg'), 'utf8');
  fs.writeFileSync(path.join(outDir, 'favicon.svg'), favicon, 'utf8');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  buildHanmePlayer().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
