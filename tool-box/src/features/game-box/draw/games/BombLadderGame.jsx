import React, { useState, useEffect, useRef, useMemo } from 'react';
import { secureRandomInt, secureRandomFloat, shuffleUnbiased, formatDrawTime } from '../shared/randomEngine.js';
import { drawSound } from '../shared/soundEngine.js';

/**
 * BOMB LADDER — 폭탄 사다리 미니게임
 *
 * Open-source provenance:
 * - Random Engine: Reuses Web Crypto rejection-sampling RNG (`secureRandomInt`, `secureRandomFloat`)
 *   from `Tae-sung-Kim/pickle-eight` (`src/lib/random.ts`, MIT License, Copyright (c) 2025 Tae-sung Kim).
 * - Note on original repo state: `Tae-sung-Kim/pickle-eight` lists ladder game ("사다리타기") in `REFACTORING.md`
 *   as a planned tool, so the Amidakuji ladder graph generator, multi-runner simultaneous path tracer,
 *   spark collision & bomb explosion canvas effects are implemented directly for GAMEBOX.
 *
 * Invariants:
 * - Pure separation between deterministic Amidakuji graph/outcome calculation and canvas animation state.
 * - Valid Amidakuji bijection: no two adjacent horizontal rungs share the same row level; paths and outcomes
 *   are never altered or forged during or after generation.
 */

const PLAYER_COLORS = [
  '#f43f5e', '#38bdf8', '#a855f7', '#22c55e',
  '#f59e0b', '#ec4899', '#14b8a6', '#eab308',
  '#6366f1', '#fb7185', '#34d399', '#60a5fa',
];

const DEFAULT_PLAYERS = ['김성민', '이지훈', '박수진', '최민호', '정하늘', '강동원'];

/**
 * Pure Amidakuji Ladder Generator & Path Solver
 * Guarantees a 1-to-1 permutation without adjacent rung collisions.
 */
export function buildAmidakujiLadder({
  participants,
  outcomes,
  rowsCount = 12,
}) {
  const numCols = participants.length;
  // rungs[row][col] = true means horizontal bridge between col and col + 1 at row
  const rungs = Array.from({ length: rowsCount }, () => Array(Math.max(0, numCols - 1)).fill(false));

  if (numCols >= 2) {
    for (let r = 0; r < rowsCount; r += 1) {
      let c = 0;
      while (c < numCols - 1) {
        const leftHasRung = c > 0 && rungs[r][c - 1];
        if (!leftHasRung && secureRandomFloat() < 0.48) {
          rungs[r][c] = true;
          c += 2; // Skip adjacent column on same row to preserve valid Amidakuji
        } else {
          c += 1;
        }
      }
    }
    // Ensure every column pair has at least 1 bridge so no column goes straight down trivially
    for (let c = 0; c < numCols - 1; c += 1) {
      const hasAny = rungs.some(row => row[c]);
      if (!hasAny) {
        const candidateRows = [];
        for (let r = 0; r < rowsCount; r += 1) {
          const leftOccupied = c > 0 && rungs[r][c - 1];
          const rightOccupied = c < numCols - 2 && rungs[r][c + 1];
          if (!leftOccupied && !rightOccupied) candidateRows.push(r);
        }
        if (candidateRows.length > 0) {
          const pickRow = candidateRows[secureRandomInt(candidateRows.length)];
          rungs[pickRow][c] = true;
        }
      }
    }
  }

  // Trace exact deterministic path for each starting column
  // Normalised coordinates: x in [0..numCols-1], y in [0..rowsCount+1]
  const traces = participants.map((name, startCol) => {
    let curCol = startCol;
    const points = [{ col: curCol, row: 0 }];

    for (let r = 0; r < rowsCount; r += 1) {
      const yLevel = r + 1;
      points.push({ col: curCol, row: yLevel });
      if (curCol < numCols - 1 && rungs[r][curCol]) {
        curCol += 1;
        points.push({ col: curCol, row: yLevel, isBridge: true, bridgeRow: r, bridgeCol: curCol - 1 });
      } else if (curCol > 0 && rungs[r][curCol - 1]) {
        curCol -= 1;
        points.push({ col: curCol, row: yLevel, isBridge: true, bridgeRow: r, bridgeCol: curCol });
      }
    }
    points.push({ col: curCol, row: rowsCount + 1 });

    // Compute cumulative distance along segments for uniform speed interpolation
    let totalLength = 0;
    const segments = [];
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i];
      const b = points[i + 1];
      const len = Math.hypot(b.col - a.col, b.row - a.row) || 0.001;
      segments.push({
        a,
        b,
        startDist: totalLength,
        endDist: totalLength + len,
        len,
      });
      totalLength += len;
    }

    const destOutcome = outcomes[curCol] || { label: '통과', isBomb: false };

    return {
      playerIndex: startCol,
      playerName: name,
      color: PLAYER_COLORS[startCol % PLAYER_COLORS.length],
      startCol,
      destCol: curCol,
      outcomeLabel: destOutcome.label,
      isBomb: Boolean(destOutcome.isBomb),
      points,
      segments,
      totalLength,
    };
  });

  return {
    numCols,
    rowsCount,
    participants: [...participants],
    outcomes: outcomes.map(o => ({ ...o })),
    rungs,
    traces,
  };
}

function interpolateTrace(trace, progress01) {
  const clamped = Math.max(0, Math.min(1, progress01));
  const targetDist = clamped * trace.totalLength;
  const walkedPoints = [trace.points[0]];

  for (let i = 0; i < trace.segments.length; i += 1) {
    const seg = trace.segments[i];
    if (targetDist >= seg.endDist) {
      walkedPoints.push(seg.b);
    } else {
      const localT = (targetDist - seg.startDist) / seg.len;
      const curPos = {
        col: seg.a.col + (seg.b.col - seg.a.col) * localT,
        row: seg.a.row + (seg.b.row - seg.a.row) * localT,
        onBridge: seg.a.row === seg.b.row,
      };
      walkedPoints.push(curPos);
      return { current: curPos, walkedPoints };
    }
  }

  const last = trace.points[trace.points.length - 1];
  return { current: last, walkedPoints };
}

export default function BombLadderGame({ onBack }) {
  const [playersInput, setPlayersInput] = useState(DEFAULT_PLAYERS.join(', '));
  const [bombCount, setBombCount] = useState(2);
  const [bombLabel, setBombLabel] = useState('💣 폭탄 당첨!');
  const [safeLabel, setSafeLabel] = useState('🛡️ 생존 통과');
  const [hideRungsUntilStart, setHideRungsUntilStart] = useState(false);
  const [focusedPlayerIdx, setFocusedPlayerIdx] = useState(null);

  // Separated states:
  // 1) Locked draw snapshot & mathematical result (`ladderData`)
  // 2) Animation progress state (`phase`: 'idle' | 'running' | 'revealed', `progress`: 0..1)
  const [ladderData, setLadderData] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const lastSoundStepRef = useRef(-1);

  const parsedPlayers = useMemo(() => {
    const list = playersInput
      .split(/[,\r\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
    return list.slice(0, 12);
  }, [playersInput]);

  // Build initial preview ladder when idle
  useEffect(() => {
    if (phase === 'idle') {
      const validPlayers = parsedPlayers.length >= 2 ? parsedPlayers : ['참가자1', '참가자2'];
      const actualBombs = Math.max(1, Math.min(validPlayers.length - 1, Number(bombCount) || 1));
      const rawOutcomes = validPlayers.map((_, idx) => ({
        label: idx < actualBombs ? bombLabel : safeLabel,
        isBomb: idx < actualBombs,
      }));
      const shuffledOutcomes = shuffleUnbiased(rawOutcomes);
      setLadderData(
        buildAmidakujiLadder({
          participants: validPlayers,
          outcomes: shuffledOutcomes,
          rowsCount: 12,
        })
      );
      setProgress(0);
      setFocusedPlayerIdx(null);
    }
  }, [parsedPlayers.join('|'), bombCount, bombLabel, safeLabel]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const spawnBombExplosions = (data, canvasWidth, canvasHeight) => {
    const numCols = data.numCols;
    const padX = Math.max(58, canvasWidth * 0.08);
    const usableW = Math.max(120, canvasWidth - padX * 2);
    const colX = (c) => (numCols <= 1 ? canvasWidth / 2 : padX + (c / (numCols - 1)) * usableW);
    const botY = canvasHeight - 46;

    const nextParticles = [];
    data.outcomes.forEach((out, colIdx) => {
      if (!out.isBomb) return;
      const cx = colX(colIdx);
      const cy = botY;
      for (let i = 0; i < 36; i += 1) {
        const angle = (Math.PI * 2 * i) / 36 + (Math.random() - 0.5) * 0.25;
        const speed = 1.8 + Math.random() * 5.2;
        nextParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          radius: 3 + Math.random() * 5,
          color: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#f97316' : '#facc15',
          alpha: 1,
        });
      }
    });
    particlesRef.current = nextParticles;
  };

  const finalizeReveal = (lockedLadder) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setProgress(1);
    setPhase('revealed');

    const hasBombs = lockedLadder.traces.some(t => t.isBomb);
    if (hasBombs) {
      drawSound.playExplosion();
    } else {
      drawSound.playFanfare();
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      spawnBombExplosions(lockedLadder, rect.width || 860, rect.height || 480);
    }

    const bombWinners = lockedLadder.traces.filter(t => t.isBomb).map(t => t.playerName);
    const safeWinners = lockedLadder.traces.filter(t => !t.isBomb).map(t => t.playerName);

    setHistory(prev => [
      {
        id: `ladder-${Date.now()}`,
        time: formatDrawTime(),
        participantsCount: lockedLadder.participants.length,
        bombWinners,
        safeWinners,
        pairs: lockedLadder.traces.map(t => ({
          name: t.playerName,
          outcome: t.outcomeLabel,
          isBomb: t.isBomb,
        })),
      },
      ...prev.slice(0, 14),
    ]);
  };

  const handleStartAll = () => {
    const validPlayers = parsedPlayers.length >= 2 ? parsedPlayers : ['참가자1', '참가자2'];
    const actualBombs = Math.max(1, Math.min(validPlayers.length - 1, Number(bombCount) || 1));
    const rawOutcomes = validPlayers.map((_, idx) => ({
      label: idx < actualBombs ? bombLabel : safeLabel,
      isBomb: idx < actualBombs,
    }));
    const shuffledOutcomes = shuffleUnbiased(rawOutcomes);

    // Lock participant list, ladder rungs, and deterministic outcomes at start
    const locked = buildAmidakujiLadder({
      participants: validPlayers,
      outcomes: shuffledOutcomes,
      rowsCount: 12,
    });

    setLadderData(locked);
    setPhase('running');
    setProgress(0);
    setFocusedPlayerIdx(null);
    particlesRef.current = [];
    lastSoundStepRef.current = -1;

    const durationMs = 3200;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / durationMs);
      setProgress(p);

      const stepBucket = Math.floor(p * 18);
      if (stepBucket !== lastSoundStepRef.current) {
        lastSoundStepRef.current = stepBucket;
        drawSound.playTick(0.25 + p * 0.5, 'wooden');
      }

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        finalizeReveal(locked);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  const handleInstantReveal = () => {
    if (!ladderData) return;
    if (phase === 'idle') {
      const validPlayers = parsedPlayers.length >= 2 ? parsedPlayers : ['참가자1', '참가자2'];
      const actualBombs = Math.max(1, Math.min(validPlayers.length - 1, Number(bombCount) || 1));
      const rawOutcomes = validPlayers.map((_, idx) => ({
        label: idx < actualBombs ? bombLabel : safeLabel,
        isBomb: idx < actualBombs,
      }));
      const locked = buildAmidakujiLadder({
        participants: validPlayers,
        outcomes: shuffleUnbiased(rawOutcomes),
        rowsCount: 12,
      });
      setLadderData(locked);
      finalizeReveal(locked);
    } else if (phase === 'running') {
      finalizeReveal(ladderData);
    }
  };

  const handleReset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    particlesRef.current = [];
    setPhase('idle');
    setProgress(0);
    setFocusedPlayerIdx(null);
  };

  // Render Ladder & simultaneous multi-runner paths on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ladderData) return undefined;

    let animId = null;
    const renderFrame = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(480, rect.width || 860);
      const h = Math.max(360, rect.height || 480);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.scale(dpr, dpr);

      // Background
      ctx.fillStyle = '#0f141c';
      ctx.fillRect(0, 0, w, h);

      const numCols = ladderData.numCols;
      const rowsCount = ladderData.rowsCount;
      const padX = Math.max(58, w * 0.08);
      const topY = 58;
      const botY = h - 56;
      const usableW = Math.max(120, w - padX * 2);
      const usableH = Math.max(160, botY - topY);

      const colX = (c) => (numCols <= 1 ? w / 2 : padX + (c / (numCols - 1)) * usableW);
      const rowY = (r) => topY + (r / (rowsCount + 1)) * usableH;

      // Subtle grid lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= rowsCount; r += 1) {
        const y = rowY(r);
        ctx.beginPath();
        ctx.moveTo(padX - 24, y);
        ctx.lineTo(w - padX + 24, y);
        ctx.stroke();
      }

      // Vertical rails
      for (let c = 0; c < numCols; c += 1) {
        const x = colX(c);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, botY);
        ctx.stroke();
      }

      // Horizontal bridges (rungs)
      const showRungs = !hideRungsUntilStart || phase !== 'idle';
      if (showRungs) {
        for (let r = 0; r < rowsCount; r += 1) {
          const y = rowY(r + 1);
          for (let c = 0; c < numCols - 1; c += 1) {
            if (ladderData.rungs[r][c]) {
              const x1 = colX(c);
              const x2 = colX(c + 1);
              ctx.strokeStyle = 'rgba(226, 232, 240, 0.42)';
              ctx.lineWidth = 3.5;
              ctx.beginPath();
              ctx.moveTo(x1, y);
              ctx.lineTo(x2, y);
              ctx.stroke();

              // Node joints
              ctx.fillStyle = '#94a3b8';
              ctx.beginPath();
              ctx.arc(x1, y, 3.2, 0, Math.PI * 2);
              ctx.arc(x2, y, 3.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      } else {
        // Mystery blind curtain over middle ladder
        ctx.fillStyle = 'rgba(30, 41, 59, 0.88)';
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(padX - 26, topY + 22, usableW + 52, usableH - 44, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 16px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣 BLIND LADDER MODE — 출발 시 사다리 경로가 공개됩니다', w / 2, topY + usableH / 2);
      }

      // Draw active traces & runners
      const activeProgress = phase === 'idle' ? 0 : phase === 'revealed' ? 1 : progress;
      const runnerPositions = [];

      if (activeProgress > 0 || focusedPlayerIdx !== null) {
        ladderData.traces.forEach((trace, idx) => {
          const isFocused = focusedPlayerIdx === null || focusedPlayerIdx === idx;
          const traceProg = phase === 'idle' && focusedPlayerIdx === idx ? 1 : activeProgress;
          if (traceProg <= 0) return;

          const { current, walkedPoints } = interpolateTrace(trace, traceProg);
          ctx.save();
          ctx.strokeStyle = trace.color;
          ctx.lineWidth = isFocused ? 4.5 : 2;
          ctx.globalAlpha = isFocused ? 0.96 : 0.22;
          ctx.shadowColor = trace.color;
          ctx.shadowBlur = isFocused ? 10 : 0;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          walkedPoints.forEach((pt, pIdx) => {
            const px = colX(pt.col);
            const py = rowY(pt.row);
            if (pIdx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
          ctx.restore();

          const curX = colX(current.col);
          const curY = rowY(current.row);
          runnerPositions.push({
            idx,
            name: trace.playerName,
            color: trace.color,
            x: curX,
            y: curY,
            onBridge: current.onBridge,
            isFocused,
            isBomb: trace.isBomb,
          });
        });
      }

      // Check close proximity / bridge crossing sparks between runners during running phase
      if (phase === 'running') {
        for (let i = 0; i < runnerPositions.length; i += 1) {
          for (let j = i + 1; j < runnerPositions.length; j += 1) {
            const a = runnerPositions[i];
            const b = runnerPositions[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 38) {
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              ctx.save();
              ctx.strokeStyle = '#facc15';
              ctx.fillStyle = '#fef08a';
              ctx.lineWidth = 2;
              for (let k = 0; k < 6; k += 1) {
                const ang = (Math.PI * 2 * k) / 6 + activeProgress * 18;
                ctx.beginPath();
                ctx.moveTo(mx + Math.cos(ang) * 4, my + Math.sin(ang) * 4);
                ctx.lineTo(mx + Math.cos(ang) * 14, my + Math.sin(ang) * 14);
                ctx.stroke();
              }
              ctx.font = '800 11px Pretendard, sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('⚡충돌!', mx, my - 15);
              ctx.restore();
            }
          }
        }
      }

      // Draw runner avatars
      runnerPositions.forEach((runner) => {
        if (!runner.isFocused && focusedPlayerIdx !== null) return;
        ctx.save();
        ctx.fillStyle = runner.color;
        ctx.shadowColor = runner.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(runner.x, runner.y, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0f172a';
        ctx.font = '800 10.5px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(runner.name.slice(0, 2), runner.x, runner.y);
        ctx.restore();
      });

      // Top Participant Nodes
      ladderData.participants.forEach((name, c) => {
        const x = colX(c);
        const color = PLAYER_COLORS[c % PLAYER_COLORS.length];
        const isFocused = focusedPlayerIdx === c;

        ctx.save();
        ctx.fillStyle = isFocused ? color : '#1e293b';
        ctx.strokeStyle = color;
        ctx.lineWidth = isFocused ? 3 : 2;
        ctx.beginPath();
        ctx.roundRect(x - 38, 12, 76, 32, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isFocused ? '#0f172a' : '#f8fafc';
        ctx.font = '800 12.5px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name.length > 5 ? `${name.slice(0, 5)}…` : name, x, 28);
        ctx.restore();
      });

      // Bottom Outcome Nodes (Bombs & Safe slots)
      ladderData.outcomes.forEach((out, c) => {
        const x = colX(c);
        const arrivedTrace = phase === 'revealed'
          ? ladderData.traces.find(t => t.destCol === c)
          : null;

        ctx.save();
        const isBomb = out.isBomb;
        if (phase === 'revealed') {
          ctx.fillStyle = isBomb ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.2)';
          ctx.strokeStyle = isBomb ? '#ef4444' : '#22c55e';
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = isBomb ? 'rgba(244, 63, 94, 0.65)' : 'rgba(56, 189, 248, 0.5)';
        }
        ctx.lineWidth = phase === 'revealed' && isBomb ? 3 : 2;
        ctx.beginPath();
        ctx.roundRect(x - 42, botY + 10, 84, 36, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isBomb ? '#fda4af' : '#bae6fd';
        ctx.font = '800 11.5px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const displayLabel = isBomb ? '💣 폭탄' : '🛡️ 생존';
        ctx.fillText(displayLabel, x, botY + 22);

        if (arrivedTrace) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '800 11px Pretendard, sans-serif';
          ctx.fillText(arrivedTrace.playerName.slice(0, 5), x, botY + 37);
        }
        ctx.restore();
      });

      // Update & draw explosion particles
      if (particlesRef.current.length > 0) {
        let alive = false;
        particlesRef.current.forEach((p) => {
          if (p.alpha <= 0.02) return;
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.14;
          p.alpha *= 0.94;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        if (alive) {
          animId = requestAnimationFrame(renderFrame);
        }
      }

      ctx.restore();
    };

    renderFrame();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => renderFrame()) : null;
    if (ro) ro.observe(canvas);
    window.addEventListener('resize', renderFrame);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', renderFrame);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [ladderData, phase, progress, hideRungsUntilStart, focusedPlayerIdx]);

  const bombTraces = ladderData ? ladderData.traces.filter(t => t.isBomb) : [];

  return (
    <div className="rpz-game-shell" data-testid="game-bomb-ladder">
      <header className="rpz-game-topbar">
        <div className="rpz-game-title-group">
          <button type="button" className="rpz-back-btn" onClick={onBack}>
            ← RANDOM PLAY ZONE
          </button>
          <div>
            <span className="rpz-game-Tag">GAME 01 · AMIDAKUJI BIJECTION ENGINE</span>
            <h2>💣 BOMB LADDER — 폭탄 사다리</h2>
          </div>
        </div>

        <div className="rpz-top-actions">
          {phase === 'idle' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-primary"
              data-testid="ladder-start-btn"
              onClick={handleStartAll}
              disabled={parsedPlayers.length < 2}
            >
              🚀 전원 동시 출발!
            </button>
          )}
          {phase === 'running' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-accent"
              data-testid="ladder-instant-btn"
              onClick={handleInstantReveal}
            >
              ⚡ 결과 일괄 공개
            </button>
          )}
          {phase === 'revealed' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-primary"
              data-testid="ladder-reroll-btn"
              onClick={handleStartAll}
            >
              🔄 사다리 재추첨
            </button>
          )}
          <button
            type="button"
            className="rpz-btn rpz-btn-ghost"
            onClick={handleReset}
          >
            초기화
          </button>
        </div>
      </header>

      <div className="rpz-game-workspace">
        <section className="rpz-stage-panel">
          <div className="rpz-stage-status-bar">
            <span className={`rpz-phase-pill phase-${phase}`} data-testid="ladder-phase-badge">
              {phase === 'idle' && '대기 중 — 참가자와 폭탄 수를 설정하고 출발하세요'}
              {phase === 'running' && `추첨 진행 중 (${Math.round(progress * 100)}%) — 다인 동시 경로 추적`}
              {phase === 'revealed' && `추첨 완료! 폭탄 당첨: ${bombTraces.map(t => t.playerName).join(', ')}`}
            </span>

            {ladderData && (
              <div className="rpz-player-filter-chips">
                <button
                  type="button"
                  className={`rpz-chip ${focusedPlayerIdx === null ? 'active' : ''}`}
                  onClick={() => setFocusedPlayerIdx(null)}
                >
                  전체 경로 보기
                </button>
                {ladderData.participants.map((name, idx) => (
                  <button
                    key={`${name}-${idx}`}
                    type="button"
                    className={`rpz-chip ${focusedPlayerIdx === idx ? 'active' : ''}`}
                    style={{ borderColor: PLAYER_COLORS[idx % PLAYER_COLORS.length] }}
                    onClick={() => setFocusedPlayerIdx(prev => (prev === idx ? null : idx))}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rpz-canvas-box">
            <canvas
              ref={canvasRef}
              className="rpz-main-canvas"
              data-testid="ladder-canvas"
            />
          </div>

          {phase === 'revealed' && ladderData && (
            <div className="rpz-result-banner" data-testid="ladder-result-panel">
              <div className="rpz-result-summary">
                <strong>💥 폭탄 당첨자 ({bombTraces.length}명):</strong>
                <span className="rpz-highlight-danger">
                  {bombTraces.map(t => t.playerName).join(', ')}
                </span>
              </div>
              <div className="rpz-result-grid">
                {ladderData.traces.map((t) => (
                  <div
                    key={t.playerIndex}
                    className={`rpz-result-card ${t.isBomb ? 'is-bomb' : 'is-safe'}`}
                    onClick={() => setFocusedPlayerIdx(t.playerIndex)}
                  >
                    <span className="rpz-result-player" style={{ color: t.color }}>
                      {t.playerName}
                    </span>
                    <span className="rpz-result-arrow">→</span>
                    <strong className="rpz-result-outcome">
                      {t.isBomb ? `💣 ${t.outcomeLabel}` : `🛡️ ${t.outcomeLabel}`}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="rpz-sidebar-panel">
          <div className="rpz-card">
            <h3>1. 참가자 명단 (2~12명)</h3>
            <textarea
              className="rpz-textarea"
              rows={3}
              value={playersInput}
              disabled={phase === 'running'}
              onChange={e => setPlayersInput(e.target.value)}
              placeholder="쉼표(,) 또는 줄바꿈으로 구분"
              data-testid="ladder-players-input"
            />
            <div className="rpz-preset-row">
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'running'}
                onClick={() => setPlayersInput('김성민, 이지훈, 박수진, 최민호, 정하늘, 강동원')}
              >
                6인 기본
              </button>
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'running'}
                onClick={() => setPlayersInput('기획팀, 개발팀, 디자인팀, QA팀')}
              >
                4개 팀
              </button>
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'running'}
                onClick={() => setPlayersInput('김성민, 이지훈, 박수진, 최민호, 정하늘, 강동원, 윤서연, 한지민')}
              >
                8인 파티
              </button>
            </div>
          </div>

          <div className="rpz-card">
            <h3>2. 폭탄 및 사다리 옵션</h3>
            <label className="rpz-field">
              <span>폭탄 개수 (1 ~ {Math.max(1, parsedPlayers.length - 1)}개)</span>
              <input
                type="number"
                className="rpz-input"
                min={1}
                max={Math.max(1, parsedPlayers.length - 1)}
                value={bombCount}
                disabled={phase === 'running'}
                onChange={e => setBombCount(Math.max(1, Math.min(parsedPlayers.length - 1, Number(e.target.value) || 1)))}
                data-testid="ladder-bomb-count"
              />
            </label>
            <label className="rpz-field">
              <span>폭탄 벌칙 문구</span>
              <input
                type="text"
                className="rpz-input"
                value={bombLabel}
                disabled={phase === 'running'}
                onChange={e => setBombLabel(e.target.value)}
              />
            </label>
            <label className="rpz-check-row">
              <input
                type="checkbox"
                checked={hideRungsUntilStart}
                disabled={phase === 'running'}
                onChange={e => setHideRungsUntilStart(e.target.checked)}
              />
              <span>출발 전까지 가로줄 가리기 (블라인드 모드)</span>
            </label>
          </div>

          <div className="rpz-card">
            <h3>3. 추첨 기록 ({history.length})</h3>
            {history.length === 0 ? (
              <p className="rpz-empty">아직 사다리 추첨 기록이 없습니다.</p>
            ) : (
              <ul className="rpz-history-list" data-testid="ladder-history-list">
                {history.map(item => (
                  <li key={item.id}>
                    <div className="rpz-history-head">
                      <strong>💣 {item.bombWinners.join(', ')}</strong>
                      <small>{item.time}</small>
                    </div>
                    <small>참가 {item.participantsCount}명 · 생존: {item.safeWinners.join(', ')}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rpz-license-box">
            <small>
              <strong>오픈소스 라이선스 고지:</strong> 난수 엔진 <code>Tae-sung-Kim/pickle-eight</code> (MIT License, Copyright © 2025 Tae-sung Kim) 활용 · 아미다쿠지 전단사 경로 추적 및 폭탄 충돌 연출 자체 구현.
            </small>
          </div>
        </aside>
      </div>
    </div>
  );
}
