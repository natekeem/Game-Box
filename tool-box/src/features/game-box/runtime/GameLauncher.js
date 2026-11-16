import React, { useEffect, useRef } from 'react';

/**
 * GameLauncher:
 * Mounts only the selected game iframe on demand and cleans up timers/listeners on unmount
 * so switching games never leaks iframes or keyboard listeners.
 */
export default function GameLauncher({
  title,
  src,
  aspectRatio = '4:3',
  onClose,
  allowFullscreen = true,
}) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.focus();
    }
    return () => {
      if (iframe) {
        try {
          iframe.src = 'about:blank';
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [src]);

  const handleFullscreen = () => {
    if (iframeRef.current?.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    }
  };

  return (
    <div className="gb-launcher-frame-wrap" data-aspect={aspectRatio}>
      <div className="gb-launcher-toolbar">
        <span className="gb-launcher-title">{title}</span>
        <div className="gb-launcher-actions">
          {allowFullscreen && (
            <button type="button" className="gb-launcher-btn" onClick={handleFullscreen}>
              전체화면
            </button>
          )}
          {onClose && (
            <button type="button" className="gb-launcher-btn gb-launcher-btn-close" onClick={onClose}>
              전원 끄기 / 종료
            </button>
          )}
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="gb-launcher-iframe"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
