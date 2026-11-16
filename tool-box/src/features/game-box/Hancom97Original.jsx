import React, { useEffect, useRef, useState } from 'react';
import './Hancom97Original.css';
import { createRecordBridge, snapshotToInitFs } from './hancom97RecordBridge.js';

async function ensureRuntime(assetBaseUrl) {
  const cssUrl = `${assetBaseUrl}/vendor/js-dos/js-dos.css`;
  if (!document.querySelector(`link[data-hancom97-runtime="${cssUrl}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.dataset.hancom97Runtime = cssUrl;
    document.head.append(link);
  }

  if (typeof window.Dos === 'function') return;
  const scriptUrl = `${assetBaseUrl}/vendor/js-dos/js-dos.js`;
  let script = document.querySelector(`script[data-hancom97-runtime="${scriptUrl}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.dataset.hancom97Runtime = scriptUrl;
    document.head.append(script);
  }
  await new Promise((resolve, reject) => {
    if (typeof window.Dos === 'function') resolve();
    else {
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', () => reject(new Error('js-dos 런타임 로드 실패')), { once: true });
    }
  });
}

async function sha256(buffer) {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export default function Hancom97Original({
  assetBaseUrl = '/games/hancom97',
  className = '',
  crt = true,
  onReady,
  onExit,
  onRecords,
  onError,
  loadRecords,
  initialRecordSnapshot = null,
}) {
  const base = assetBaseUrl.replace(/\/$/, '');
  const dosRef = useRef(null);
  const playerRef = useRef(null);
  const bridgeRef = useRef(null);
  const initialRecordSnapshotRef = useRef(initialRecordSnapshot);
  const callbacksRef = useRef({ onReady, onExit, onRecords, onError, loadRecords });
  const generationRef = useRef(0);
  const [generation, setGeneration] = useState(0);
  const [showCrt, setShowCrt] = useState(crt);
  const [status, setStatus] = useState('원본 파일 확인 중');

  initialRecordSnapshotRef.current = initialRecordSnapshot;
  callbacksRef.current = { onReady, onExit, onRecords, onError, loadRecords };

  useEffect(() => {
    const ownGeneration = ++generationRef.current;
    let disposed = false;

    async function launch() {
      try {
        setStatus('고정 버전 DOSBox 준비 중');
        await ensureRuntime(base);
        const manifestResponse = await fetch(`${base}/runtime-manifest.json`, { cache: 'no-store' });
        if (!manifestResponse.ok) throw new Error(`runtime-manifest.json HTTP ${manifestResponse.status}`);
        const manifest = await manifestResponse.json();
        const expectedHash = String(manifest.runtimeBundle?.sha256 || '').toLowerCase();
        if (!/^[a-f0-9]{64}$/.test(expectedHash)) throw new Error('실행 번들 해시가 없습니다.');
        const bundleUrl = `${base}/hancom-typing-1997.jsdos?v=${expectedHash.slice(0, 16)}`;

        setStatus('원본 번들 무결성 확인 중');
        const bundleResponse = await fetch(bundleUrl, { cache: 'no-store' });
        if (!bundleResponse.ok) throw new Error(`원본 번들 HTTP ${bundleResponse.status}`);
        const actualHash = await sha256(await bundleResponse.arrayBuffer());
        if (actualHash !== expectedHash) throw new Error(`원본 번들 해시 불일치: ${actualHash}`);
        if (disposed || ownGeneration !== generationRef.current || !dosRef.current) return;

        setStatus('_HTTD_.EXE 시작 중');
        const loadedSnapshot = await callbacksRef.current.loadRecords?.();
        const initFs = snapshotToInitFs(loadedSnapshot ?? initialRecordSnapshotRef.current);
        playerRef.current = window.Dos(dosRef.current, {
          url: bundleUrl,
          pathPrefix: `${base}/vendor/js-dos/emulators/`,
          backend: 'dosbox',
          backendLocked: true,
          autoStart: true,
          kiosk: true,
          imageRendering: 'pixelated',
          renderBackend: 'canvas',
          renderAspect: '4/3',
          mouseCapture: false,
          autoSave: false,
          fsChanges: { local: false },
          ...(initFs.length ? { initFs } : {}),
          onEvent(event, value) {
            if (disposed || ownGeneration !== generationRef.current) return;
            if (event === 'bnd-play') setStatus('원본 번들 실행 중');
            if (event === 'ci-ready') {
              setStatus('한컴타자연습 97 원본 실행 중');
              callbacksRef.current.onReady?.(value);
              bridgeRef.current = createRecordBridge(value, {
                onSnapshot: snapshot => callbacksRef.current.onRecords?.(snapshot),
                onError: error => callbacksRef.current.onError?.(error),
              });
              bridgeRef.current.start();
              value.events().onExit(async () => {
                await bridgeRef.current?.capture({ force: true });
                bridgeRef.current?.stop();
                callbacksRef.current.onExit?.();
              });
            }
          },
        });
      } catch (error) {
        if (disposed) return;
        const normalized = error instanceof Error ? error : new Error(String(error));
        setStatus(`실행 실패: ${normalized.message}`);
        callbacksRef.current.onError?.(normalized);
      }
    }

    launch();
    return () => {
      disposed = true;
      bridgeRef.current?.stop();
      bridgeRef.current = null;
      const player = playerRef.current;
      playerRef.current = null;
      if (player?.stop) Promise.resolve(player.stop()).catch(() => {});
      dosRef.current?.replaceChildren();
    };
  }, [base, generation]);

  const restart = () => setGeneration(value => value + 1);
  const fullscreen = () => {
    const shell = dosRef.current?.closest('.hancom97-react-player');
    if (!shell) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else shell.requestFullscreen();
  };

  return (
    <section className={`hancom97-react-player ${showCrt ? 'with-crt' : 'clean'} ${className}`.trim()}>
      <header className="hancom97-react-toolbar">
        <div>
          <small>ORIGINAL DOS PROGRAM · 1997</small>
          <h2>한컴타자연습 97</h2>
        </div>
        <div className="hancom97-react-actions">
          <button type="button" onClick={() => setShowCrt(value => !value)}>
            {showCrt ? '원본 화면만 보기' : 'CRT 프레임 보기'}
          </button>
          <button type="button" onClick={restart}>다시 시작</button>
          <button type="button" onClick={fullscreen}>전체 화면</button>
        </div>
      </header>
      <div className="hancom97-react-stage" style={{ '--hancom97-crt': `url("${base}/assets-terminal-1997.png")` }}>
        <div className="hancom97-react-screen">
          <div ref={dosRef} className="hancom97-react-dos" role="application" aria-label="한컴타자연습 97 원본 DOS 프로그램" />
        </div>
      </div>
      <footer>{status}</footer>
    </section>
  );
}
