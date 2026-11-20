import React, { useEffect, useMemo, useRef } from 'react';

const SNAKE_COLORS = {
  bg: '#1f1a16',
  grid: '#2a221c',
  p1: '#e8b34a',
  p1Dim: '#7a6534',
  p2: '#4fd1c5',
  p2Dim: '#2f6b64',
  food: '#e85d4e',
};

const drawSnakeCell = (context, x, y, width, height, inset) => {
  const padding = Math.min(width, height) * inset * 0.5;
  context.fillRect(x * width + padding, y * height + padding, width - padding * 2, height - padding * 2);
};

const snakeList = (snakes) => Object.values(snakes || {}).sort((a, b) => (a.role || 0) - (b.role || 0));

export function OriginalSnakeDuelArena({ gs, room, currentUser, onAction }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const previousRef = useRef(null);
  const width = gs.gridWidth || 30;
  const height = gs.gridHeight || 20;
  const snakes = useMemo(() => snakeList(gs.snakes), [gs.snakes]);
  const food = gs.food || { x: 15, y: 10 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    const next = { snakes, food, width, height };
    const previous = previousRef.current || next;
    const startedAt = performance.now();
    const duration = 135;

    const draw = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - ((1 - progress) ** 3);
      const cellWidth = canvas.width / width;
      const cellHeight = canvas.height / height;

      context.fillStyle = SNAKE_COLORS.bg;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = SNAKE_COLORS.grid;
      context.lineWidth = 1;
      for (let x = 1; x < width; x++) {
        context.beginPath();
        context.moveTo(x * cellWidth, 0);
        context.lineTo(x * cellWidth, canvas.height);
        context.stroke();
      }
      for (let y = 1; y < height; y++) {
        context.beginPath();
        context.moveTo(0, y * cellHeight);
        context.lineTo(canvas.width, y * cellHeight);
        context.stroke();
      }

      context.fillStyle = SNAKE_COLORS.food;
      drawSnakeCell(context, food.x, food.y, cellWidth, cellHeight, 0.35);

      next.snakes.forEach((snake, snakeIndex) => {
        const oldSnake = previous.snakes.find(item => item.role === snake.role) || snake;
        const [main, dim] = snake.role === 1
          ? [SNAKE_COLORS.p1, SNAKE_COLORS.p1Dim]
          : [SNAKE_COLORS.p2, SNAKE_COLORS.p2Dim];
        snake.body.forEach((segment, index) => {
          const oldSegment = oldSnake.body[Math.min(index, oldSnake.body.length - 1)] || segment;
          const x = oldSegment.x + (segment.x - oldSegment.x) * eased;
          const y = oldSegment.y + (segment.y - oldSegment.y) * eased;
          context.fillStyle = snake.alive ? (index === 0 ? main : dim) : '#4a4239';
          drawSnakeCell(context, x, y, cellWidth, cellHeight, index === 0 ? 0.15 : 0.25);
        });
        if (!snake.alive && snakeIndex === 0) context.globalAlpha = 1;
      });

      if (progress < 1) animationRef.current = requestAnimationFrame(draw);
      else previousRef.current = next;
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [snakes, food.x, food.y, width, height]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const direction = {
        ArrowUp: 'up', KeyW: 'up',
        ArrowDown: 'down', KeyS: 'down',
        ArrowLeft: 'left', KeyA: 'left',
        ArrowRight: 'right', KeyD: 'right',
      }[event.code];
      if (!direction) return;
      event.preventDefault();
      onAction({ dir: direction });
    };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onAction]);

  const p1 = snakes[0] || { name: 'Player 1', score: 0 };
  const p2 = snakes[1] || { name: 'Player 2', score: 0 };
  return (
    <section className="sd-shell" aria-label="원본 Snake Duel 게임 화면">
      <div className="sd-scoreboard">
        <div className={`sd-badge sd-badge-p1 ${p1.id === currentUser.id ? 'is-me' : ''}`}>
          <span className="sd-badge-role">Player 1 · WASD</span>
          <strong>{p1.name}</strong>
          <span className="sd-score">{p1.score || 0} pts</span>
        </div>
        <div className="sd-room-tag"><small>ROOM</small><strong>{room?.code || 'LOCAL'}</strong></div>
        <div className={`sd-badge sd-badge-p2 ${p2.id === currentUser.id ? 'is-me' : ''}`}>
          <span className="sd-badge-role">Player 2 · ARROWS</span>
          <strong>{p2.name}</strong>
          <span className="sd-score">{p2.score || 0} pts</span>
        </div>
      </div>
      <div className="sd-board-wrap">
        <canvas ref={canvasRef} className="sd-board" width="600" height="400" aria-label="30 x 20 Snake Duel 캔버스" />
      </div>
      <div className="sd-footnote">
        <span>원본 엔진 · 30×20 · 150ms tick</span>
        <span>WASD 또는 방향키</span>
      </div>
      <ArcadeDpad onAction={onAction} />
    </section>
  );
}

export function OriginalBombermanArena({ mode = 'online', bots = 1, currentUser = null }) {
  const iframeRef = useRef(null);
  const sessionNonce = useRef(Date.now()).current;
  const params = useMemo(() => {
    const p = new URLSearchParams({ bots: String(bots), _s: String(sessionNonce) });
    if (currentUser?.name) p.set('nickname', currentUser.name);
    return p;
  }, [bots, currentUser?.name, sessionNonce]);

  useEffect(() => {
    const focusIframe = () => iframeRef.current?.contentWindow?.focus();
    const timer = setTimeout(focusIframe, 300);
    return () => {
      clearTimeout(timer);
      try {
        fetch('/original-blast-arena/api/reset', { method: 'GET', keepalive: true }).catch(() => {});
      } catch {
        // ignore reset failure on unmount
      }
    };
  }, []);

  return (
    <section
      className="ba-original-shell"
      aria-label="Blast Arena 원본 게임"
      onClick={() => iframeRef.current?.contentWindow?.focus()}
    >
      <iframe
        ref={iframeRef}
        key={`${mode}-${params.toString()}`}
        className="ba-original-frame"
        src={`/original-blast-arena/?mode=${encodeURIComponent(mode)}&${params.toString()}`}
        title="Blast Arena original game"
        allow="autoplay; fullscreen; gamepad"
        tabIndex="0"
        onLoad={() => iframeRef.current?.contentWindow?.focus()}
      />
    </section>
  );
}

export function OriginalBombergirlArena({ mode = 'single', bots = 3, room = null, currentUser = null, onBackToLobby = null }) {
  const iframeRef = useRef(null);
  const src = useMemo(() => {
    const params = new URLSearchParams({ mode });
    if (mode === 'online') {
      params.set('room', room?.code || '');
      params.set('player', currentUser?.id || '');
      params.set('name', currentUser?.name || 'Player');
    } else {
      params.set('bots', String(bots));
    }
    return `/original-bombergirl/?${params.toString()}`;
  }, [mode, bots, room?.code, currentUser?.id, currentUser?.name]);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'return-to-lobby') {
        onBackToLobby?.();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onBackToLobby]);

  useEffect(() => {
    const onKeyDown = (e) => {
      // Forward arrow keys, WASD, Space, Enter, Esc to Bombergirl iframe
      const capturedKeys = [38, 40, 37, 39, 87, 83, 65, 68, 32, 16, 18, 13, 27, 77];
      if (capturedKeys.includes(e.keyCode)) {
        iframeRef.current?.contentWindow?.postMessage({
          type: 'bombergirl-key',
          keyCode: e.keyCode,
          down: true,
        }, '*');
      }
    };
    const onKeyUp = (e) => {
      const capturedKeys = [38, 40, 37, 39, 87, 83, 65, 68, 32, 16, 18, 13, 27, 77];
      if (capturedKeys.includes(e.keyCode)) {
        iframeRef.current?.contentWindow?.postMessage({
          type: 'bombergirl-key',
          keyCode: e.keyCode,
          down: false,
        }, '*');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    const timer = setTimeout(() => iframeRef.current?.contentWindow?.focus(), 300);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      className="bg-original-shell"
      aria-label="HTML5 Bombergirl 원본 게임"
      onClick={() => iframeRef.current?.contentWindow?.focus()}
    >
      <iframe
        ref={iframeRef}
        key={src}
        className="bg-original-frame"
        src={src}
        title={mode === 'online' ? 'HTML5 Bombergirl online game' : 'HTML5 Bombergirl original single player'}
        allow="autoplay; fullscreen; gamepad"
        tabIndex="0"
        onLoad={() => iframeRef.current?.contentWindow?.focus()}
      />
    </section>
  );
}
function ArcadeDpad({ onAction }) {
  return (
    <div className="oa-dpad" aria-label="화면 방향키">
      <button type="button" className="up" onClick={() => onAction({ dir: 'up' })}>▲</button>
      <button type="button" className="left" onClick={() => onAction({ dir: 'left' })}>◀</button>
      <button type="button" className="down" onClick={() => onAction({ dir: 'down' })}>▼</button>
      <button type="button" className="right" onClick={() => onAction({ dir: 'right' })}>▶</button>
    </div>
  );
}
