import React, { useEffect, useRef } from 'react';
import { useGameIdentity } from '../identity/GameIdentityProvider.js';

/**
 * RetroDesktop (/game-box/retro)
 * Preserves and mounts the existing Korean Windows 98 Desktop (/win98-web/)
 * without introducing glassmorphism or non-Win98 UI inside the desktop.
 */
export default function RetroDesktop({ onNavigate }) {
  const { identity, openNicknameModal } = useGameIdentity();
  const iframeRef = useRef(null);

  // Sync identity to the Windows 98 iframe whenever identity changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(
        {
          source: 'game-box-host',
          type: 'identity:sync',
          payload: identity,
        },
        window.location.origin
      );
    } catch {
      // ignore cross-frame timing errors before load
    }
  }, [identity]);

  const sendCommandToWin98 = (appId) => {
    const cw = iframeRef.current?.contentWindow;
    if (cw?.System?.launchApp) {
      cw.System.launchApp(appId);
      cw.focus();
    }
  };

  return (
    <div className="gb-retro-shell">
      <div className="gb-subbar">
        <div className="gb-subbar-left">
          <button
            type="button"
            className="gb-subbar-back"
            onClick={() => onNavigate('/game-box')}
          >
            &larr; GAME-BOX 홈으로
          </button>
          <span className="gb-subbar-divider">|</span>
          <strong className="gb-subbar-title">RETRO DESKTOP (Windows 98)</strong>
          <span className="gb-subbar-hint">
            바탕화면의 [한컴타자연습], [한메타자연습], [피카츄 배구], [게임 가이드], 오른쪽 [GAME RANKING] 창을 이용하세요.
          </span>
        </div>
        <div className="gb-subbar-actions">
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => sendCommandToWin98('retro-game-guide')}
          >
            📖 게임 가이드 열기
          </button>
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => sendCommandToWin98('retro-ranking')}
          >
            🏆 GAME RANKING 창 열기
          </button>
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={openNicknameModal}
          >
            👤 {identity.nickname || '닉네임 설정'}
          </button>
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => onNavigate('/game-box/deck')}
          >
            🕹️ GAME DECK 이동 &rarr;
          </button>
        </div>
      </div>

      <div className="gb-retro-viewport">
        <iframe
          ref={iframeRef}
          src="/win98-web/"
          title="Windows 98 RETRO DESKTOP"
          className="gb-retro-iframe"
          allow="autoplay; fullscreen"
          onLoad={() => {
            try {
              iframeRef.current?.contentWindow?.postMessage(
                {
                  source: 'game-box-host',
                  type: 'identity:sync',
                  payload: identity,
                },
                window.location.origin
              );
            } catch {}
          }}
        />
      </div>
    </div>
  );
}
