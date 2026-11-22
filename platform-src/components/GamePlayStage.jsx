import React, { useState, useEffect, useRef } from 'react';
import { OriginalSnakeDuelArena, OriginalBombermanArena, OriginalBombergirlArena } from './OriginalArcadeArenas.jsx';

/**
 * Interactive Play Stage for all supported realtime and skill games.
 * Preserves each game's visual feel and controls while providing
 * full React lifecycle cleanup and BOT / Online support.
 */
export function GamePlayStage({ gameId, room, currentUser, gameStateData, onAction }) {
  const gs = gameStateData?.gameState || {};
  const status = gameStateData?.status || '게임 준비 중...';
  const scores = gameStateData?.scores || {};
  const currentPlayerId = gameStateData?.currentPlayerId || null;
  const isMyTurn = !currentPlayerId || currentPlayerId === currentUser.id;

  if (gameId === 'bomberman') return <OriginalBombermanArena mode="online" currentUser={currentUser} />;
  if (gameId === 'bombergirl') {
    return <OriginalBombergirlArena mode="online" room={room} currentUser={currentUser} onBackToLobby={() => onAction?.({ type: 'leave' })} />;
  }

  if (gameId === 'snakeduel') {
    return (
      <div className="gp-play-stage oa-stage-wrapper" data-game-stage={gameId}>
        <div className="oa-live-status" role="status"><span />{status}</div>
        <OriginalSnakeDuelArena gs={gs} room={room} currentUser={currentUser} onAction={onAction} />
      </div>
    );
  }

  return (
    <div className="gp-play-stage bb-stage-wrapper" data-game-stage={gameId}>
      {Object.keys(scores).length > 0 && (
        <div className="bb-scoreboard-bar" aria-label="현재 점수">
          {Object.entries(scores).map(([name, score]) => (
            <div key={name} className={`bb-score-pill ${name === currentUser.name ? 'me' : ''}`}>
              <span>{name === currentUser.name ? '👤' : name.includes('BOT') ? '🤖' : '🎮'} {name}</span>
              <strong className="bb-score-val">{score}점</strong>
            </div>
          ))}
        </div>
      )}

      <div className={`gp-status-banner bb-status-banner ${isMyTurn ? 'my-turn' : 'wait-turn'}`} role="status">
        {status}
      </div>

      <div className="gp-stage-inner bb-arena-body">
        {gameId === 'reaction' && <ReactionArena status={status} onAction={onAction} />}
        {gameId === 'tictactoe' && <TicTacToeArena gs={gs} isMyTurn={isMyTurn} onAction={onAction} />}
        {gameId === 'connectfour' && <ConnectFourArena gs={gs} isMyTurn={isMyTurn} onAction={onAction} />}
        {gameId === 'wordchain' && <WordChainArena gs={gs} isMyTurn={isMyTurn} onAction={onAction} />}
        {gameId === 'mathduel' && <MathDuelArena gs={gs} isMyTurn={isMyTurn} onAction={onAction} />}
        {gameId === 'rpsarena' && <RpsArena gs={gs} currentUser={currentUser} onAction={onAction} />}
        {gameId === 'anagram' && <AnagramArena gs={gs} isMyTurn={isMyTurn} onAction={onAction} />}
        {gameId === 'numberhunt' && <NumberHuntArena gs={gs} currentUser={currentUser} onAction={onAction} />}
        {gameId === 'memorymatch' && <MemoryMatchArena gs={gs} isMyTurn={isMyTurn} onAction={onAction} />}
        {gameId === 'speedtyping' && <SpeedTypingArena gs={gs} currentUser={currentUser} onAction={onAction} />}
        {gameId === 'colormatch' && <ColorMatchArena gs={gs} currentUser={currentUser} onAction={onAction} />}
        {gameId === 'simonsays' && <SimonSaysArena gs={gs} currentUser={currentUser} onAction={onAction} />}
        {gameId === 'trivia' && <TriviaArena gs={gs} currentUser={currentUser} onAction={onAction} />}
        {gameId === 'higherlower' && <HigherLowerArena gs={gs} isMyTurn={isMyTurn} onAction={onAction} />}
        {gameId === 'oddoneout' && <OddOneOutArena gs={gs} isMyTurn={isMyTurn} onAction={onAction} />}
        {gameId === 'drawing' && <DrawingArena gs={gs} currentUser={currentUser} onAction={onAction} />}
      </div>
    </div>
  );
}

// 1. Reaction Battle
function ReactionArena({ status, onAction }) {
  const isGo = status && status.includes('GO');
  return (
    <div className="bb-reaction-wrap">
      <p className="bb-hint">원이 <strong style={{ color: '#00ff88' }}>초록색 (GO!)</strong>으로 바뀌는 순간 즉시 클릭하세요!</p>
      <button
        type="button"
        className={`bb-reaction-circle ${isGo ? 'go' : 'ready'}`}
        onClick={() => isGo && onAction({ type: 'click' })}
      >
        <span className="bb-reaction-icon">{isGo ? '🎯' : '⏳'}</span>
        <span className="bb-reaction-label">{isGo ? '지금 클릭!' : '대기 중...'}</span>
      </button>
    </div>
  );
}

// 2. Tic Tac Toe
function TicTacToeArena({ gs, isMyTurn, onAction }) {
  const board = Array.isArray(gs.board) ? gs.board : Array(9).fill(null);
  return (
    <div className="bb-ttt-board">
      {board.map((cell, i) => (
        <button
          key={i}
          type="button"
          className={`bb-ttt-cell ${cell === 'X' ? 'x-mark' : cell === 'O' ? 'o-mark' : ''}`}
          disabled={!isMyTurn || cell !== null}
          onClick={() => onAction({ pos: i })}
        >
          {cell || ''}
        </button>
      ))}
    </div>
  );
}

// 3. Connect Four
function ConnectFourArena({ gs, isMyTurn, onAction }) {
  const board = Array.isArray(gs.board) ? gs.board : Array(42).fill(null);
  const done = Number.isInteger(gs.winner) || gs.draw;
  return (
    <div className="bb-cf-wrap">
      <div className="bb-cf-drops">
        {[0, 1, 2, 3, 4, 5, 6].map(col => (
          <button
            key={col}
            type="button"
            className="gp-btn gp-btn-secondary gp-btn-sm"
            disabled={done || !isMyTurn}
            onClick={() => onAction({ column: col })}
          >
            ▼ {col + 1}열
          </button>
        ))}
      </div>
      <div className="bb-cf-grid">
        {board.map((cell, i) => (
          <div
            key={i}
            className={`bb-cf-cell ${cell === 'R' ? 'red' : cell === 'Y' ? 'yellow' : ''}`}
            onClick={() => !done && isMyTurn && onAction({ column: i % 7 })}
          />
        ))}
      </div>
    </div>
  );
}

// 4. Word Chain
function WordChainArena({ gs, isMyTurn, onAction }) {
  const [word, setWord] = useState('');
  const chain = gs.chain || [];
  const lastLetter = (gs.lastLetter || 'a').toUpperCase();

  const submit = (e) => {
    e.preventDefault();
    if (!word.trim()) return;
    onAction({ word: word.trim().toLowerCase() });
    setWord('');
  };

  return (
    <div className="bb-prompt-wrap">
      <div className="bb-prompt-card">
        시작 알파벳: <strong>&ldquo;{lastLetter}&rdquo;</strong> 로 시작하는 영단어 입력
      </div>
      <form className="bb-input-row" onSubmit={submit}>
        <input
          type="text"
          className="gp-input"
          placeholder={`"${lastLetter}"로 시작하는 영단어 (예: apple, eagle...)`}
          value={word}
          disabled={!isMyTurn}
          onChange={e => setWord(e.target.value)}
        />
        <button type="submit" className="gp-btn gp-btn-primary" disabled={!isMyTurn}>제출</button>
      </form>
      <div className="bb-chain-list">
        {chain.length === 0 ? <small className="gp-muted">아직 연결된 단어가 없습니다.</small> : chain.map((w, i) => (
          <span key={i} className="bb-chain-chip">{i > 0 ? `→ ${w}` : w}</span>
        ))}
      </div>
    </div>
  );
}

// 5. Math Duel
function MathDuelArena({ gs, isMyTurn, onAction }) {
  const [ans, setAns] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (ans === '') return;
    onAction({ answer: Number(ans) });
    setAns('');
  };
  return (
    <div className="bb-prompt-wrap">
      <div className="bb-prompt-card bb-big-math">{gs.prompt ? `${gs.prompt} = ?` : '문제 출제 중...'}</div>
      <form className="bb-input-row" onSubmit={submit}>
        <input
          type="number"
          className="gp-input"
          placeholder="정답 숫자 입력..."
          value={ans}
          disabled={!isMyTurn}
          onChange={e => setAns(e.target.value)}
        />
        <button type="submit" className="gp-btn gp-btn-primary" disabled={!isMyTurn}>정답 제출</button>
      </form>
    </div>
  );
}

// 6. RPS Arena
function RpsArena({ gs, currentUser, onAction }) {
  const locked = Boolean(gs.choices && gs.choices[currentUser.id]);
  const items = [
    { id: 'rock', icon: '🪨', label: '바위 (Rock)' },
    { id: 'paper', icon: '📄', label: '보 (Paper)' },
    { id: 'scissors', icon: '✂️', label: '가위 (Scissors)' },
  ];
  return (
    <div className="bb-choice-grid">
      {items.map(it => (
        <button
          key={it.id}
          type="button"
          className="bb-choice-btn"
          disabled={locked}
          onClick={() => onAction({ choice: it.id })}
        >
          <span className="bb-choice-icon">{it.icon}</span>
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// 7. Anagram Sprint
function AnagramArena({ gs, isMyTurn, onAction }) {
  const [guess, setGuess] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    onAction({ guess: guess.trim().toLowerCase() });
    setGuess('');
  };
  return (
    <div className="bb-prompt-wrap">
      <div className="bb-prompt-card bb-big-math">
        철자 배열: <span style={{ letterSpacing: '6px', color: '#ffea00' }}>{(gs.scrambled || '...').toUpperCase()}</span>
      </div>
      <form className="bb-input-row" onSubmit={submit}>
        <input
          type="text"
          className="gp-input"
          placeholder="원래 영단어를 입력하세요..."
          value={guess}
          disabled={!isMyTurn}
          onChange={e => setGuess(e.target.value)}
        />
        <button type="submit" className="gp-btn gp-btn-primary" disabled={!isMyTurn}>제출</button>
      </form>
    </div>
  );
}

// 8. Number Hunt
function NumberHuntArena({ gs, currentUser, onAction }) {
  const [val, setVal] = useState('20');
  const locked = gs.guesses && gs.guesses[currentUser.id] !== undefined;
  const submit = (e) => {
    e.preventDefault();
    onAction({ guess: Number(val) });
  };
  return (
    <div className="bb-prompt-wrap">
      <div className="bb-prompt-card">
        10 ~ 30 사이의 숨겨진 목표 숫자를 추리하세요! (라운드 {gs.round || 1}/{gs.maxRounds || 6})
      </div>
      <form className="bb-input-row" onSubmit={submit}>
        <input
          type="number"
          min={10}
          max={30}
          className="gp-input"
          value={val}
          disabled={locked}
          onChange={e => setVal(e.target.value)}
        />
        <button type="submit" className="gp-btn gp-btn-primary" disabled={locked}>
          {locked ? '제출 완료' : '숫자 선택'}
        </button>
      </form>
    </div>
  );
}

// 9. Memory Match
function MemoryMatchArena({ gs, isMyTurn, onAction }) {
  const cards = Array.isArray(gs.cards) ? gs.cards : Array(16).fill(null);
  const flipped = new Set(gs.flipped || []);
  const matched = new Set(gs.matched || []);

  return (
    <div className="bb-memory-grid">
      {cards.map((symbol, idx) => {
        const isUp = flipped.has(idx) || matched.has(idx);
        return (
          <button
            key={idx}
            type="button"
            className={`bb-memory-card ${isUp ? 'flipped' : ''} ${matched.has(idx) ? 'matched' : ''}`}
            disabled={!isMyTurn || isUp || gs.lockBoard}
            onClick={() => onAction({ cardIndex: idx })}
          >
            {isUp ? (symbol || '❓') : '🎴'}
          </button>
        );
      })}
    </div>
  );
}

// 10. Speed Typing
function SpeedTypingArena({ gs, currentUser, onAction }) {
  const [typed, setTyped] = useState('');
  const word = gs.currentWord || 'ready';
  const wIdx = gs.currentWordIndex || 0;
  const done = (gs.completed?.[currentUser.id] || 0) > wIdx;

  useEffect(() => {
    setTyped('');
  }, [word]);

  const submit = (e) => {
    e.preventDefault();
    if (!typed.trim()) return;
    onAction({ typed: typed.trim() });
    setTyped('');
  };

  return (
    <div className="bb-prompt-wrap">
      <div className="bb-typing-target">{word}</div>
      <form className="bb-input-row" onSubmit={submit}>
        <input
          type="text"
          className="gp-input"
          placeholder="위 단어를 그대로 빠르게 입력 후 Enter!"
          value={typed}
          disabled={done}
          onChange={e => setTyped(e.target.value)}
        />
        <button type="submit" className="gp-btn gp-btn-primary" disabled={done}>
          {done ? '완료!' : '입력'}
        </button>
      </form>
      {gs.wpm !== undefined && <div className="bb-stat-pill">최근 속도: <strong>{gs.wpm} WPM</strong></div>}
    </div>
  );
}

// 11. Color Match
function ColorMatchArena({ gs, currentUser, onAction }) {
  const display = gs.currentDisplay || { word: 'READY', color: '#00f0ff' };
  const locked = gs.answered && gs.answered[currentUser.id] !== undefined;
  const buttons = [
    { id: 'red', label: 'RED (빨강)', bg: '#ff3366', fg: '#fff' },
    { id: 'blue', label: 'BLUE (파랑)', bg: '#4488ff', fg: '#fff' },
    { id: 'green', label: 'GREEN (초록)', bg: '#00ff88', fg: '#000' },
    { id: 'yellow', label: 'YELLOW (노랑)', bg: '#ffea00', fg: '#000' },
  ];
  return (
    <div className="bb-prompt-wrap">
      <p className="bb-hint">단어의 뜻이 아니라 <strong>글자의 실제 색상</strong>을 클릭하세요!</p>
      <div className="bb-color-word" style={{ color: display.color }}>{display.word}</div>
      <div className="bb-color-grid">
        {buttons.map(b => (
          <button
            key={b.id}
            type="button"
            className="bb-color-btn"
            style={{ background: b.bg, color: b.fg }}
            disabled={locked}
            onClick={() => onAction({ color: b.id })}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// 12. Simon Says
function SimonSaysArena({ gs, currentUser, onAction }) {
  const [litColor, setLitColor] = useState(null);
  const seq = gs.sequence || [];
  const showing = !!gs.showingSequence;

  useEffect(() => {
    if (!showing || !seq.length) return;
    const timers = [];
    seq.forEach((col, i) => {
      timers.push(setTimeout(() => setLitColor(col), i * 550));
      timers.push(setTimeout(() => setLitColor(null), i * 550 + 320));
    });
    return () => timers.forEach(clearTimeout);
  }, [showing, gs.round, seq.length]);

  const colors = ['red', 'blue', 'green', 'yellow'];
  const myProgress = (gs.playerSequence?.[currentUser.id] || []).length;

  return (
    <div className="bb-prompt-wrap">
      <p className="bb-hint">
        {showing ? '👀 점등되는 색상 순서를 기억하세요!' : `진행도: ${myProgress} / ${seq.length}`}
      </p>
      <div className="bb-simon-grid">
        {colors.map(c => (
          <button
            key={c}
            type="button"
            className={`bb-simon-btn ${c} ${litColor === c ? 'active' : ''}`}
            disabled={showing || gs.eliminated?.[currentUser.id]}
            onClick={() => {
              setLitColor(c);
              setTimeout(() => setLitColor(null), 180);
              onAction({ sequence: [c] });
            }}
          />
        ))}
      </div>
    </div>
  );
}

// 13. Trivia Challenge
function TriviaArena({ gs, currentUser, onAction }) {
  const options = gs.options || [];
  const locked = gs.answered && gs.answered[currentUser.id] !== undefined;
  return (
    <div className="bb-prompt-wrap">
      <div className="bb-prompt-card">{gs.question || '문제 준비 중...'}</div>
      {gs.timer !== undefined && (
        <div className="bb-timer-bar-wrap">
          <div className="bb-timer-bar" style={{ width: `${Math.max(0, (gs.timer / 15) * 100)}%` }} />
        </div>
      )}
      <div className="bb-trivia-list">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            className="bb-trivia-option"
            disabled={locked}
            onClick={() => onAction({ option: idx })}
          >
            <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// 14. Higher or Lower
function HigherLowerArena({ gs, isMyTurn, onAction }) {
  const locked = !isMyTurn || !!gs.answered;
  return (
    <div className="bb-prompt-wrap">
      <div className="bb-hl-card">
        <small className="gp-muted">현재 숫자 (1 ~ 100)</small>
        <div className="bb-hl-num">{gs.current ?? '?'}</div>
        {gs.next !== undefined && <div className="bb-hl-next">다음 숫자 결과: <strong>{gs.next}</strong></div>}
        <div className="bb-hl-actions">
          <button type="button" className="gp-btn gp-btn-primary" disabled={locked} onClick={() => onAction({ choice: 'higher' })}>
            ⬆️ 더 높다 (Higher)
          </button>
          <button type="button" className="gp-btn gp-btn-secondary" disabled={locked} onClick={() => onAction({ choice: 'lower' })}>
            ⬇️ 더 낮다 (Lower)
          </button>
        </div>
      </div>
    </div>
  );
}

// 15. Odd One Out
function OddOneOutArena({ gs, isMyTurn, onAction }) {
  const grid = Array.isArray(gs.grid) ? gs.grid : Array(9).fill('❓');
  const locked = !isMyTurn || !!gs.answered;
  return (
    <div className="bb-odd-grid">
      {grid.map((item, idx) => (
        <button
          key={idx}
          type="button"
          className={`bb-odd-tile ${gs.answered && gs.answer === idx ? 'correct' : ''}`}
          disabled={locked}
          onClick={() => onAction({ index: idx })}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// 16. Snake Duel (1v1 Realtime Arcade)
function SnakeDuelArena({ gs, currentUser, onAction }) {
  const gridSize = gs.gridSize || 20;
  const snakes = gs.snakes || {};
  const food = gs.food || { x: 10, y: 10 };

  useEffect(() => {
    const onKey = (e) => {
      const map = {
        ArrowUp: 'up', KeyW: 'up',
        ArrowDown: 'down', KeyS: 'down',
        ArrowLeft: 'left', KeyA: 'left',
        ArrowRight: 'right', KeyD: 'right',
      };
      const dir = map[e.code] || map[e.key];
      if (dir) {
        e.preventDefault();
        onAction({ dir });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onAction]);

  const cellMap = new Map();
  Object.values(snakes).forEach(s => {
    (s.body || []).forEach((pt, idx) => {
      cellMap.set(`${pt.x},${pt.y}`, { color: s.color, isHead: idx === 0, alive: s.alive });
    });
  });

  const cells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const key = `${x},${y}`;
      const seg = cellMap.get(key);
      const isFood = food.x === x && food.y === y;
      cells.push(
        <div
          key={key}
          className={`gp-snake-cell ${seg ? 'snake-body' : ''} ${seg?.isHead ? 'snake-head' : ''} ${isFood ? 'snake-food' : ''}`}
          style={seg ? { backgroundColor: seg.color, opacity: seg.alive ? 1 : 0.35 } : undefined}
        >
          {isFood ? '🍎' : ''}
        </div>
      );
    }
  }

  return (
    <div className="gp-arcade-wrap" aria-label="스네이크 듀얼 게임 보드">
      <div className="gp-control-hint">방향키 / WASD로 이동 · 사과를 먹고 벽과 상대 뱀을 피하세요</div>
      <div
        className="gp-snake-board"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        role="grid"
        aria-label={`${gridSize} x ${gridSize} 스네이크 보드`}
      >
        {cells}
      </div>
      <div className="gp-dpad">
        <button type="button" onClick={() => onAction({ dir: 'up' })}>▲</button>
        <div className="gp-dpad-mid">
          <button type="button" onClick={() => onAction({ dir: 'left' })}>◀</button>
          <button type="button" onClick={() => onAction({ dir: 'down' })}>▼</button>
          <button type="button" onClick={() => onAction({ dir: 'right' })}>▶</button>
        </div>
      </div>
    </div>
  );
}

// 17. Bomberman Arena (2~4 Players + BOT AI)
function BombermanArena({ gs, onAction }) {
  const W = gs.width || 11;
  const H = gs.height || 11;
  const grid = gs.grid || [];
  const fighters = Object.values(gs.fighters || {});
  const bombs = gs.bombs || [];
  const explosions = gs.explosions || [];

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        onAction({ type: 'bomb' });
        return;
      }
      const map = {
        ArrowUp: 'up', KeyW: 'up',
        ArrowDown: 'down', KeyS: 'down',
        ArrowLeft: 'left', KeyA: 'left',
        ArrowRight: 'right', KeyD: 'right',
      };
      const dir = map[e.code] || map[e.key];
      if (dir) {
        e.preventDefault();
        onAction({ dir });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onAction]);

  const cells = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const tile = grid[y]?.[x] ?? 0;
      const fighter = fighters.find(f => f.alive && f.x === x && f.y === y);
      const bomb = bombs.find(b => b.x === x && b.y === y);
      const exp = explosions.some(ex => ex.x === x && ex.y === y);

      cells.push(
        <div
          key={`${x},${y}`}
          className={`gp-bomber-cell tile-${tile} ${exp ? 'exploding' : ''}`}
        >
          {exp ? '💥' : bomb ? '💣' : fighter ? (
            <span className="gp-fighter-token" style={{ background: fighter.color }} title={fighter.name}>
              {fighter.isBot ? '🤖' : '🧑'}
            </span>
          ) : tile === 2 ? '📦' : ''}
        </div>
      );
    }
  }

  return (
    <div className="gp-arcade-wrap" aria-label="봄버맨 아레나 게임 보드">
      <div className="gp-control-hint">방향키 / WASD로 이동 · Space로 폭탄 설치</div>
      <div
        className="gp-bomber-board"
        style={{ gridTemplateColumns: `repeat(${W}, 1fr)` }}
        role="grid"
        aria-label={`${W} x ${H} 봄버맨 보드`}
      >
        {cells}
      </div>
      <div className="gp-dpad-row">
        <div className="gp-dpad">
          <button type="button" onClick={() => onAction({ dir: 'up' })}>▲</button>
          <div className="gp-dpad-mid">
            <button type="button" onClick={() => onAction({ dir: 'left' })}>◀</button>
            <button type="button" onClick={() => onAction({ dir: 'down' })}>▼</button>
            <button type="button" onClick={() => onAction({ dir: 'right' })}>▶</button>
          </div>
        </div>
        <button type="button" className="gp-btn gp-btn-danger gp-bomb-btn" onClick={() => onAction({ type: 'bomb' })}>
          💣 폭탄 설치 (Space)
        </button>
      </div>
    </div>
  );
}

// 18. CatchMind / DoodleDash Drawing Game
function DrawingArena({ gs, currentUser, onAction }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [color, setColor] = useState('#2c3e50');
  const [guessText, setGuessText] = useState('');
  const isDrawer = !!gs.isDrawer;
  const strokes = gs.strokes || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const allStrokes = currentPoints.length > 1
      ? [...strokes, { color, width: 5, points: currentPoints }]
      : strokes;

    for (const s of allStrokes) {
      if (!s.points || s.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = s.color || '#2c3e50';
      ctx.lineWidth = s.width || 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(s.points[0][0], s.points[0][1]);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i][0], s.points[i][1]);
      }
      ctx.stroke();
    }
  }, [strokes, currentPoints, color]);

  const getCoord = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return [
      Math.round((e.clientX - rect.left) * scaleX),
      Math.round((e.clientY - rect.top) * scaleY),
    ];
  };

  const handlePointerDown = (e) => {
    if (!isDrawer) return;
    setDrawing(true);
    setCurrentPoints([getCoord(e)]);
  };

  const handlePointerMove = (e) => {
    if (!isDrawer || !drawing) return;
    setCurrentPoints(prev => [...prev, getCoord(e)]);
  };

  const handlePointerUp = () => {
    if (!isDrawer || !drawing) return;
    setDrawing(false);
    if (currentPoints.length > 1) {
      onAction({ type: 'stroke', stroke: { color, width: 5, points: currentPoints } });
    }
    setCurrentPoints([]);
  };

  const submitGuess = (e) => {
    e.preventDefault();
    if (!guessText.trim()) return;
    onAction({ type: 'guess', text: guessText.trim() });
    setGuessText('');
  };

  return (
    <div className="gp-drawing-layout">
      <div className="gp-drawing-canvas-col">
        <div className="gp-drawing-header">
          <span>라운드 {gs.round || 1}/{gs.maxRounds || 3} · 출제자: <strong>{gs.drawerName}</strong></span>
          {isDrawer ? (
            <span className="gp-secret-word">제시어: <strong>{gs.word}</strong></span>
          ) : (
            <span className="gp-hint-badge">카테고리: {gs.category} · 초성 힌트: <strong>{gs.hint}</strong></span>
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={340}
          className={`gp-drawing-canvas ${isDrawer ? 'can-draw' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        {isDrawer && (
          <div className="gp-drawing-toolbar">
            {['#2c3e50', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'].map(c => (
              <button
                key={c}
                type="button"
                className={`gp-color-swatch ${color === c ? 'selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
            <button type="button" className="gp-btn-xs" onClick={() => onAction({ type: 'clear' })}>
              🗑️ 전체 지우기
            </button>
          </div>
        )}
      </div>

      <div className="gp-drawing-chat-col">
        <div className="gp-drawing-chat-log">
          {(gs.chat || []).length === 0 ? (
            <p className="gp-muted">정답을 아래 채팅창에 입력해 보세요!</p>
          ) : (
            (gs.chat || []).map(msg => (
              <div key={msg.id} className={`gp-chat-msg ${msg.isCorrect ? 'correct' : ''}`}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>

        {!isDrawer && (
          <form className="gp-drawing-guess-form" onSubmit={submitGuess}>
            <input
              type="text"
              className="gp-input"
              placeholder="정답 입력..."
              value={guessText}
              disabled={!!gs.guessedIds?.[currentUser.id]}
              onChange={e => setGuessText(e.target.value)}
            />
            <button type="submit" className="gp-btn gp-btn-primary" disabled={!!gs.guessedIds?.[currentUser.id]}>
              정답!
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
