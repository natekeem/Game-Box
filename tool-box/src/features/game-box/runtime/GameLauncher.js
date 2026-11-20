import React, { useEffect, useRef, useMemo } from 'react';
import { useGameIdentity } from '../identity/GameIdentityProvider.js';

/**
 * GameLauncher:
 * - 게임 화면(iframe)만 담당하는 얇은 런처. 닉네임/guestId는 홈에서 등록된 값을 URL로 전달한다.
 * - 조작법 · 싱글/멀티 선택은 게임 대기실(/platform)에서 통일되어 제공된다.
 */
export default function GameLauncher({
  title,
  src,
  aspectRatio = '4:3',
  onClose,
  allowFullscreen = true,
}) {
  const iframeRef = useRef(null);
  const { identity } = useGameIdentity();

  const effectiveSrc = useMemo(() => {
    if (!src) return '';
    try {
      const url = new URL(src, window.location.origin);
      url.searchParams.set('embed', 'deck');
      if (identity?.nickname) url.searchParams.set('nickname', identity.nickname);
      if (identity?.guestId) url.searchParams.set('guestId', identity.guestId);
      return url.pathname + url.search;
    } catch {
      const sep = src.includes('?') ? '&' : '?';
      let res = `${src}${sep}embed=deck`;
      if (identity?.nickname) res += `&nickname=${encodeURIComponent(identity.nickname)}`;
      if (identity?.guestId) res += `&guestId=${encodeURIComponent(identity.guestId)}`;
      return res;
    }
  }, [src, identity?.nickname, identity?.guestId]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) iframe.focus();
    return () => {
      if (iframe) {
        try {
          iframe.src = 'about:blank';
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [effectiveSrc]);

  const handleFullscreen = () => {
    iframeRef.current?.requestFullscreen?.();
  };

  return (
    <div className="gb-launcher-frame-wrap" data-aspect={aspectRatio}>
      <div className="gb-launcher-toolbar">
        <div className="gb-launcher-left">
          <span className="gb-launcher-led-dot" />
          <span className="gb-launcher-title">{title}</span>
        </div>

        <div className="gb-launcher-actions">
          {identity?.nickname && (
            <span className="gb-launcher-player-badge" title="홈에서 등록한 닉네임">
              👤 {identity.nickname}
            </span>
          )}
          {allowFullscreen && (
            <button type="button" className="gb-launcher-btn" onClick={handleFullscreen} title="전체 화면">
              전체화면
            </button>
          )}
          {onClose && (
            <button type="button" className="gb-launcher-btn gb-launcher-btn-close" onClick={onClose} title="종료">
              ✕ 종료
            </button>
          )}
        </div>
      </div>

      <div className="gb-launcher-stage-container">
        <iframe
          ref={iframeRef}
          src={effectiveSrc}
          title={title}
          className="gb-launcher-iframe"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
}
