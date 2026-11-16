import { createRecordBridge, snapshotToInitFs } from './record-bridge.js';
import { createHancom97Telemetry } from './hancom97-telemetry.js';

(() => {
  'use strict';

  // 빌드 시, 디렉터리 엔트리를 포함해 다시 포장한 실행 번들의 실제 해시로 치환된다.
  const EXPECTED_BUNDLE_SHA256 = '__HANCOM97_BUNDLE_SHA256__';
  // js-dos는 원격 번들을 OPFS에 URL 기준으로 캐시한다. 해시를 URL에 포함해야
  // 새 빌드가 이전의 손상된 번들 캐시와 절대 섞이지 않는다.
  const BUNDLE_URL = `./hancom-typing-1997.jsdos?v=${EXPECTED_BUNDLE_SHA256.slice(0, 16)}`;
  const EXPECTED_EXE_SHA256 = '4cd9a0efcd7676d6f08528643bb76fcb0834dc61881a046149ac85b0702c90c7';
  const shell = document.getElementById('player-shell');
  const dosElement = document.getElementById('dos');
  const status = document.getElementById('status');
  const bootCover = document.getElementById('boot-cover');
  const bootTitle = document.getElementById('boot-title');
  const bootDetail = document.getElementById('boot-detail');
  let player = null;
  let recordBridge = null;
  let telemetry = null;
  let generation = 0;
  let activeSession = null;

  function postGameEvent(payload) {
    const message = {
      source: 'game-box-runtime',
      type: payload.eventType,
      payload,
    };
    window.dispatchEvent(new CustomEvent('game-box:runtime-event', { detail: payload }));
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, window.location.origin);
      }
      if (window.top && window.top !== window && window.top !== window.parent) {
        window.top.postMessage(message, window.location.origin);
      }
    } catch (e) {
      console.warn('postMessage failed', e);
    }
  }

  const setStatus = (message, detail = '') => {
    status.textContent = message;
    bootTitle.textContent = message;
    if (detail) bootDetail.textContent = detail;
  };

  const digestHex = async bytes => {
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  };

  async function verifyBundle() {
    setStatus('원본 번들 무결성 확인 중', `_HTTD_.EXE SHA-256 ${EXPECTED_EXE_SHA256.slice(0, 12)}…`);
    const response = await fetch(BUNDLE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`원본 번들을 불러오지 못했습니다 (HTTP ${response.status})`);
    const bytes = await response.arrayBuffer();
    const actual = await digestHex(bytes);
    if (actual !== EXPECTED_BUNDLE_SHA256) throw new Error(`원본 번들 해시 불일치: ${actual}`);
    return bytes.byteLength;
  }

  async function stopPlayer() {
    if (activeSession && !activeSession.completed) {
      postGameEvent({
        gameId: activeSession.gameId,
        gameSessionId: activeSession.sessionId,
        clientEventId: `${activeSession.sessionId}-abort`,
        gameMode: activeSession.gameMode,
        eventType: 'game:abort',
        timestamp: new Date().toISOString(),
        durationMs: Math.max(0, Date.now() - activeSession.startedAt),
        outcome: 'aborted',
        recordClassification: 'practice',
      });
    }
    activeSession = null;
    recordBridge?.stop();
    recordBridge = null;
    telemetry?.stop();
    telemetry = null;
    if (player?.stop) {
      try { await player.stop(); } catch (error) { console.warn('js-dos stop failed', error); }
    }
    player = null;
    dosElement.replaceChildren();
  }

  async function launch(targetVer = '97') {
    const ownGeneration = ++generation;
    bootCover.classList.remove('hidden');
    await stopPlayer();
    try {
      if (typeof window.Dos !== 'function') throw new Error('고정 버전 js-dos 런타임을 불러오지 못했습니다.');
      
      const isHanme = targetVer === 'hanme';
      const bundleUrl = isHanme ? './hanme-typing-3.jsdos' : BUNDLE_URL;

      if (!isHanme) {
        const byteLength = await verifyBundle();
        if (ownGeneration !== generation) return;
        setStatus('원본 DOSBox 시작 중', `${(byteLength / 1024).toFixed(1)} KiB 번들 검증 완료`);
      } else {
        setStatus('한메타자교사 3.0 시작 중', 'HTT.EXE 번들을 준비합니다.');
      }

      const restoredSnapshot = (!isHanme && typeof window.hancom97LoadRecords === 'function')
        ? await window.hancom97LoadRecords()
        : null;
      const initFs = snapshotToInitFs(restoredSnapshot);
      player = window.Dos(dosElement, {
        url: bundleUrl,
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
        fsChanges: { local: false },
        ...(initFs.length ? { initFs } : {}),
        onEvent(event, arg) {
          if (ownGeneration !== generation) return;
          if (event === 'emu-ready') setStatus('DOSBox 준비 완료', isHanme ? 'HTT.EXE를 부팅합니다.' : '원본 실행 파일을 부팅합니다.');
          if (event === 'bnd-play') setStatus(isHanme ? '한메타자교사 3.0 실행 중' : '원본 번들 실행 중', isHanme ? '베네치아 및 연습 화면 대기 중' : '_HTTD_.EXE 시작을 기다립니다.');
          if (event === 'ci-ready') {
            const sessionId = crypto.randomUUID();
            activeSession = {
              sessionId,
              gameId: isHanme ? 'hanme-typing-30' : 'hancom-typing-97',
              gameMode: isHanme ? 'venezia' : 'position',
              startedAt: Date.now(),
              firstKeyAt: null,
              lastKeyAt: null,
              keystrokes: 0,
              backspaces: 0,
              completed: false,
            };
            postGameEvent({
              gameId: activeSession.gameId,
              gameSessionId: sessionId,
              clientEventId: `${sessionId}-start`,
              gameMode: activeSession.gameMode,
              eventType: 'game:start',
              timestamp: new Date().toISOString(),
              durationMs: 0,
              metadata: { executable: isHanme ? 'HTT.EXE' : '_HTTD_.EXE' },
            });

            if (!isHanme) {
              window.hancom97CommandInterface = arg;
              recordBridge = createRecordBridge(arg, {
                onSnapshot(snapshot) {
                  window.hancom97RecordSnapshot = snapshot;
                  window.dispatchEvent(new CustomEvent('hancom97-records', { detail: snapshot }));
                  postGameEvent({
                    gameId: 'hancom-typing-97',
                    gameSessionId: sessionId,
                    clientEventId: `${sessionId}-snapshot-${snapshot?.capturedAt || Date.now()}`,
                    gameMode: 'position',
                    eventType: 'game:progress',
                    timestamp: snapshot?.capturedAt || new Date().toISOString(),
                    durationMs: Math.max(0, Date.now() - activeSession.startedAt),
                    trustLevel: 'dos-binary-snapshot',
                    metadata: {
                      files: Array.isArray(snapshot?.files)
                        ? snapshot.files.map(f => ({ path: f.path, byteLength: f.byteLength }))
                        : [],
                    },
                  });
                },
                onError(error) { console.warn('한컴타자연습 기록 확인 실패', error); },
              });
              window.hancom97RecordBridge = recordBridge;
              recordBridge.start();
              telemetry = createHancom97Telemetry(arg, {
                onAttempt(attempt) {
                  window.dispatchEvent(new CustomEvent('hancom97-attempt', { detail: attempt }));
                  if (activeSession) activeSession.completed = true;
                  postGameEvent({
                    gameId: 'hancom-typing-97',
                    gameSessionId: sessionId,
                    clientEventId: attempt.clientAttemptId || `${sessionId}-complete-${Date.now()}`,
                    gameMode: 'position',
                    eventType: 'game:complete',
                    timestamp: attempt.occurredAt || new Date().toISOString(),
                    typingSpeed: attempt.speed,
                    accuracy: attempt.accuracy,
                    durationMs: attempt.elapsedMs,
                    outcome: 'completed',
                    recordClassification: 'ranking',
                    trustLevel: attempt.source || 'original-screen-telemetry',
                  });
                },
              });
              window.hancom97Telemetry = telemetry;
              arg.events().onExit(async () => {
                await recordBridge?.capture({ force: true });
                recordBridge?.stop();
                telemetry?.stop();
              });
              setStatus('한컴타자연습 97 원본 실행 중', '화면을 클릭한 뒤 원본 프로그램을 조작하세요.');
            } else {
              window.hanmeCommandInterface = arg;
              setStatus('한메타자교사 3.0 원본 실행 중', '화면을 클릭한 뒤 원본 프로그램을 조작하세요. (베네치아, 자리연습 등)');
            }
            bootCover.classList.add('hidden');
            dosElement.focus({ preventScroll: true });
          }
        },
      });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      setStatus('실행 실패', message);
      bootDetail.textContent = `${message} · 이 페이지는 file://이 아니라 npm start의 HTTP 주소로 열어야 합니다.`;
    }
  }

  window.launchDosGame = launch;
  window.stopDosPlayer = stopPlayer;
  window.getDosSessionStats = () => {
    if (!activeSession) return null;
    const activeDurationMs = activeSession.firstKeyAt
      ? Math.max(1000, (activeSession.lastKeyAt || Date.now()) - activeSession.firstKeyAt)
      : Math.max(1000, Date.now() - activeSession.startedAt);
    const effectiveStrokes = Math.max(0, activeSession.keystrokes - activeSession.backspaces);
    const typingSpeed = activeSession.keystrokes >= 5
      ? Math.min(2500, Math.round((effectiveStrokes / (activeDurationMs / 60000)) * 1.4))
      : 0;
    const accuracy = activeSession.keystrokes > 0
      ? Math.round((effectiveStrokes / activeSession.keystrokes) * 1000) / 10
      : 100;
    return {
      ...activeSession,
      activeDurationMs,
      typingSpeed,
      accuracy,
      errorCount: activeSession.backspaces,
    };
  };
  window.completeDosTypingSession = (options = {}) => {
    const stats = window.getDosSessionStats();
    if (!stats || stats.keystrokes < 5) {
      return { ok: false, error: '실제 타자 입력 기록이 부족합니다 (최소 5타 이상 입력 필요).' };
    }
    const mode = options.gameMode || stats.gameMode;
    const isScoreMode = mode === 'acid-rain' || mode === 'invader' || mode === 'venezia';
    const computedScore = isScoreMode
      ? (options.score ?? Math.round(stats.typingSpeed * 12 + (stats.keystrokes - stats.errorCount) * 25))
      : null;
    activeSession.completed = true;
    const payload = {
      gameId: stats.gameId,
      gameSessionId: stats.sessionId,
      clientEventId: `${stats.sessionId}-complete-${mode}-${Date.now()}`,
      gameMode: mode,
      eventType: 'game:complete',
      timestamp: new Date().toISOString(),
      typingSpeed: isScoreMode ? stats.typingSpeed : (options.typingSpeed ?? stats.typingSpeed),
      score: computedScore,
      accuracy: options.accuracy ?? stats.accuracy,
      errorCount: stats.errorCount,
      durationMs: stats.activeDurationMs,
      outcome: 'completed',
      recordClassification: 'ranking',
      trustLevel: 'dos-session-telemetry',
      metadata: {
        keystrokes: stats.keystrokes,
        backspaces: stats.backspaces,
        ...(options.metadata || {}),
      },
    };
    postGameEvent(payload);
    return { ok: true, payload };
  };

  window.addEventListener('keydown', event => {
    if (!activeSession || event.repeat) return;
    if (event.key === 'Backspace') {
      activeSession.backspaces += 1;
      activeSession.lastKeyAt = Date.now();
      return;
    }
    if (event.key.length === 1 || event.code.startsWith('Key') || event.code.startsWith('Digit') || event.code === 'Space' || event.code === 'Enter') {
      if (!activeSession.firstKeyAt) activeSession.firstKeyAt = Date.now();
      activeSession.lastKeyAt = Date.now();
      activeSession.keystrokes += 1;
    }
  }, true);

  document.getElementById('toggle-frame').addEventListener('click', event => {
    shell.classList.toggle('clean-view');
    event.currentTarget.textContent = shell.classList.contains('clean-view') ? 'CRT 프레임 보기' : '원본 화면만 보기';
  });
  document.getElementById('restart').addEventListener('click', () => {
    if (window.currentActiveVersion === 'minesweeper') {
      const iframe = document.querySelector('#custom-stage iframe');
      if (iframe) iframe.src = './minesweeper.html';
    } else {
      launch(window.currentActiveVersion === 'hanme' ? 'hanme' : '97');
    }
  });
  document.getElementById('fullscreen').addEventListener('click', async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.getElementById('machine-wrap').requestFullscreen();
  });
  window.addEventListener('unhandledrejection', event => {
    const message = event.reason instanceof Error ? event.reason.message : String(event.reason);
    if (!bootCover.classList.contains('hidden')) setStatus('실행 실패', message);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') recordBridge?.capture({ force: true });
  });
  window.addEventListener('pagehide', () => {
    recordBridge?.capture({ force: true });
  });

  const initParams = new URLSearchParams(window.location.search);
  if (initParams.get('embed') === 'win98') {
    document.body.classList.add('win98-embed');
  }
  const initVer = initParams.get('v');
  if (!initVer || initVer === '97') {
    launch('97');
  }
})();
