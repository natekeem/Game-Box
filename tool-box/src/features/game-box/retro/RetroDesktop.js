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
