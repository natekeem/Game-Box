import React, { useState, useEffect, useRef, useMemo } from 'react';
import { WheelEngine } from '../../../../../../vendor/spin-the-wheel/wheel-engine.js';
import { AudioEngine } from '../../../../../../vendor/spin-the-wheel/audio-engine.js';
import { THEME_PRESETS, THEME_ORDER } from '../../../../../../vendor/spin-the-wheel/themes.js';
import { normalizeAngle } from '../../../../../../vendor/spin-the-wheel/utils.js';
import { secureRandomInt, secureRandomFloat, shuffleUnbiased, formatDrawTime } from '../shared/randomEngine.js';

/**
 * CHAOS WHEEL — 룰렛 미니게임
 *
 * Open-source provenance:
 * - Directly reuses `WheelEngine` (`wheel-engine.js`), `AudioEngine` (`audio-engine.js`),
 *   `THEME_PRESETS` (`themes.js`), and angle utilities (`utils.js`) from
 *   `alsatianco/spin-the-wheel` (MIT License, Copyright (c) 2026 alsatianco).
 *
 * Invariants:
 * - Strict separation between unbiased outcome selection and `WheelEngine.spinTo` animation state.
 * - Zero probability manipulation: every active entry has equal 1/N weight using Web Crypto rejection sampling.
 * - Supports entry editing, natural friction physics (`easeOutFriction`), procedural Web Audio ticks & fanfares,
 *   Mystery Mode (`?` slice masking until stop), and Elimination Mode (winner removal & restore).
 */

const TAU = Math.PI * 2;

const INITIAL_WHEEL_ITEMS = [
  '김성민', '이지훈', '박수진', '최민호',
  '정하늘', '강동원', '윤서연', '한지민',
];

function buildEntryObjects(labels, eliminatedSet = new Set()) {
  return labels.map((label, idx) => ({
    id: `entry-${idx}-${label}`,
    label,
    weight: 1,
    enabled: true,
    eliminated: eliminatedSet.has(label),
  }));
}

export default function ChaosWheelGame({ onBack }) {
  const [itemsText, setItemsText] = useState(INITIAL_WHEEL_ITEMS.join('\n'));
  const [newItemInput, setNewItemInput] = useState('');
  const [eliminatedLabels, setEliminatedLabels] = useState([]);
  const [mysteryMode, setMysteryMode] = useState(false);
  const [eliminationMode, setEliminationMode] = useState(false);
  const [themePreset, setThemePreset] = useState('cyberpunk');
  const [tickVariant, setTickVariant] = useState('wooden');
  const [winVariant, setWinVariant] = useState('fanfare');
  const [spinDurationSec, setSpinDurationSec] = useState(3.2);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Separated states:
  // 1) Locked draw outcome (`lastWinner`)
  // 2) Animation state (`phase`: 'idle' | 'spinning' | 'result')
  const [phase, setPhase] = useState('idle');
  const [lastWinner, setLastWinner] = useState(null);
  const [history, setHistory] = useState([]);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const audioRef = useRef(null);

  const parsedLabels = useMemo(() => {
    const raw = itemsText
      .split(/[,\r\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
    return Array.from(new Set(raw));
  }, [itemsText]);

  const eliminatedSet = useMemo(() => new Set(eliminatedLabels), [eliminatedLabels]);

  const entries = useMemo(
    () => buildEntryObjects(parsedLabels, eliminatedSet),
    [parsedLabels, eliminatedSet]
  );

  const activeEntries = useMemo(
    () => entries.filter(e => e.enabled && !e.eliminated),
    [entries]
  );

  // Initialize original WheelEngine and AudioEngine
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return undefined;
    const engine = new WheelEngine({
      canvas: canvasRef.current,
      container: containerRef.current,
    });
    const audio = new AudioEngine();
    engineRef.current = engine;
    audioRef.current = audio;

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => engine.resize())
      : null;
    if (ro) ro.observe(containerRef.current);

    return () => {
      if (ro) ro.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Sync state with WheelEngine
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setWheelState({
      entries,
      settings: {
        showWeights: false,
        mysteryWheel: mysteryMode && phase !== 'result',
        idleAnimationEnabled: phase === 'idle',
      },
      theme: {
        preset: themePreset,
        centerColor: '#0f172a',
      },
    });
  }, [entries, mysteryMode, themePreset, phase]);

  const handleSpin = () => {
    const engine = engineRef.current;
    if (!engine || phase === 'spinning' || activeEntries.length < 1) return;

    // Auto-eliminate previous winner before next spin if Elimination Mode is active and user spins again
    let currentEliminatedSet = new Set(eliminatedLabels);
    let currentEntries = entries;
    if (eliminationMode && lastWinner && phase === 'result' && !currentEliminatedSet.has(lastWinner.label)) {
      if (activeEntries.length > 2) {
        const nextElim = [...eliminatedLabels, lastWinner.label];
        setEliminatedLabels(nextElim);
        currentEliminatedSet = new Set(nextElim);
        currentEntries = buildEntryObjects(parsedLabels, currentEliminatedSet);
      }
    }

    // Re-sync engine with locked entries for this spin
    engine.setWheelState({
      entries: currentEntries,
      settings: {
        showWeights: false,
        mysteryWheel: mysteryMode,
        idleAnimationEnabled: false,
      },
      theme: {
        preset: themePreset,
        centerColor: '#0f172a',
      },
    });

    const segments = engine.getSegments();
    if (!segments || segments.length === 0) return;

    if (soundEnabled && audioRef.current) {
      audioRef.current.ensureReady();
    }

    // 1. Determine winner BEFORE animation starts using unbiased Web Crypto rejection sampling
    const winningIndex = secureRandomInt(segments.length);
    const winningSegment = segments[winningIndex];
    const lockedWinner = {
      id: winningSegment.entry.id,
      label: winningSegment.entry.label,
      color: winningSegment.color,
      segmentIndex: winningIndex,
      totalCandidates: segments.length,
      probabilityPct: ((1 / segments.length) * 100).toFixed(1),
    };

    // 2. Calculate exact physical target rotation that lands inside the winning segment
    const currentRot = engine.getRotation();
    const segSpan = winningSegment.end - winningSegment.start;
    // Land safely inside the middle 65% of the slice
    const jitter = (secureRandomFloat() - 0.5) * segSpan * 0.65;
    const targetAngleOnWheel = winningSegment.center + jitter;
    const desiredNormalized = normalizeAngle(-targetAngleOnWheel);
    const currentNormalized = normalizeAngle(currentRot);
    let delta = desiredNormalized - currentNormalized;
    if (delta <= 0) delta += TAU;

    const fullTurns = 6 + secureRandomInt(3); // 6~8 full turns
    const absoluteTargetRotation = currentRot + fullTurns * TAU + delta;

    setPhase('spinning');
    setLastWinner(null);

    engine.spinTo({
      absoluteTargetRotation,
      durationMs: Math.max(1200, Math.round(spinDurationSec * 1000)),
      pauseAtEndMs: 120,
      reducedMotion: false,
      onTick: (_segIdx, velocity) => {
        if (soundEnabled && audioRef.current) {
          audioRef.current.playTickVariant(tickVariant, velocity);
        }
      },
      onResult: () => {
        engine.holdStillAfterResult();
        setLastWinner(lockedWinner);
        setPhase('result');
        if (soundEnabled && audioRef.current) {
          audioRef.current.playWinVariant(winVariant);
        }
        setHistory(prev => [
          {
            id: `wheel-${Date.now()}`,
            time: formatDrawTime(),
            winner: lockedWinner.label,
            candidates: lockedWinner.totalCandidates,
            probabilityPct: lockedWinner.probabilityPct,
            mystery: mysteryMode,
            elimination: eliminationMode,
          },
          ...prev.slice(0, 14),
        ]);
      },
    });
  };

  const handleEliminateCurrentWinner = () => {
    if (!lastWinner) return;
    if (!eliminatedSet.has(lastWinner.label)) {
      setEliminatedLabels(prev => [...prev, lastWinner.label]);
    }
    setPhase('idle');
  };

  const handleRestoreEliminated = () => {
    setEliminatedLabels([]);
    setPhase('idle');
  };

  const handleAddSingleItem = (e) => {
    e.preventDefault();
    const clean = newItemInput.trim();
    if (!clean) return;
    const next = [...parsedLabels, clean];
    setItemsText(Array.from(new Set(next)).join('\n'));
    setNewItemInput('');
  };

  const handleShuffleEntries = () => {
    const shuffled = shuffleUnbiased(parsedLabels);
    setItemsText(shuffled.join('\n'));
  };

  const handleSortEntries = () => {
    const sorted = [...parsedLabels].sort((a, b) => a.localeCompare(b, 'ko'));
    setItemsText(sorted.join('\n'));
  };

  return (
    <div className="rpz-game-shell" data-testid="game-chaos-wheel">
      <header className="rpz-game-topbar">
        <div className="rpz-game-title-group">
          <button type="button" className="rpz-back-btn" onClick={onBack}>
            ← RANDOM PLAY ZONE
          </button>
          <div>
            <span className="rpz-game-Tag">GAME 04 · SPIN-THE-WHEEL ENGINE</span>
            <h2>🎡 CHAOS WHEEL — 룰렛</h2>
          </div>
        </div>

        <div className="rpz-top-actions">
          <button
            type="button"
            className="rpz-btn rpz-btn-primary"
            data-testid="wheel-spin-btn"
            onClick={handleSpin}
            disabled={phase === 'spinning' || activeEntries.length < 2}
          >
            {phase === 'spinning' ? '🌀 회전 중...' : '🎡 룰렛 돌리기 (SPIN!)'}
          </button>
          {phase === 'result' && lastWinner && (
            <button
              type="button"
              className="rpz-btn rpz-btn-accent"
              data-testid="wheel-eliminate-winner-btn"
              onClick={handleEliminateCurrentWinner}
              disabled={activeEntries.length <= 2}
            >
              ❌ 당첨자 제외 후 계속
            </button>
          )}
          {eliminatedLabels.length > 0 && (
            <button
              type="button"
              className="rpz-btn rpz-btn-ghost"
              data-testid="wheel-restore-btn"
              onClick={handleRestoreEliminated}
            >
              ♻️ 제외 항목 복원 ({eliminatedLabels.length})
            </button>
          )}
        </div>
      </header>

      <div className="rpz-game-workspace">
        <section className="rpz-stage-panel">
          <div className="rpz-stage-status-bar">
            <span className={`rpz-phase-pill phase-${phase}`} data-testid="wheel-phase-badge">
              {phase === 'idle' && `대기 중 — 활성 항목 ${activeEntries.length}개 (균등 확률 ${(100 / Math.max(1, activeEntries.length)).toFixed(1)}%)`}
              {phase === 'spinning' && '관성 회전 물리 감속 진행 중...'}
              {phase === 'result' && lastWinner && `🎉 당첨 확정: ${lastWinner.label}! (공정 확률 ${lastWinner.probabilityPct}%)`}
            </span>

            <div className="rpz-mode-badges">
              <button
                type="button"
                data-testid="wheel-mystery-toggle"
                className={`rpz-chip ${mysteryMode ? 'active' : ''}`}
                onClick={() => setMysteryMode(v => !v)}
              >
                🕵️ 미스터리 모드 {mysteryMode ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                data-testid="wheel-elimination-toggle"
                className={`rpz-chip ${eliminationMode ? 'active' : ''}`}
                onClick={() => setEliminationMode(v => !v)}
              >
                🔥 서바이벌 탈락 모드 {eliminationMode ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                className={`rpz-chip ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(v => !v)}
              >
                {soundEnabled ? '🔊 효과음 ON' : '🔇 효과음 OFF'}
              </button>
            </div>
          </div>

          <div className="rpz-wheel-stage-wrap">
            <div ref={containerRef} className="rpz-wheel-container">
              {/* Top Pointer Pin */}
              <div className="rpz-wheel-pointer" aria-hidden="true">▼</div>
              <canvas
                ref={canvasRef}
                className="rpz-wheel-canvas"
                data-testid="wheel-canvas"
              />
              <button
                type="button"
                className="rpz-wheel-center-btn"
                onClick={handleSpin}
                disabled={phase === 'spinning' || activeEntries.length < 2}
              >
                {phase === 'spinning' ? '•••' : 'SPIN'}
              </button>
            </div>

            {phase === 'result' && lastWinner && (
              <div className="rpz-wheel-winner-card" data-testid="wheel-winner-banner">
                <span className="rpz-winner-kicker">
                  {mysteryMode ? '🕵️ 미스터리 슬라이스 정체 공개!' : '🎊 CHAOS WHEEL WINNER'}
                </span>
                <strong className="rpz-winner-name" style={{ color: lastWinner.color }}>
                  {lastWinner.label}
                </strong>
                <span className="rpz-winner-meta">
                  후보 {lastWinner.totalCandidates}개 중 1/{lastWinner.totalCandidates} ({lastWinner.probabilityPct}%) 무편향 추첨
                </span>
                <div className="rpz-winner-actions">
                  <button
                    type="button"
                    className="rpz-btn rpz-btn-primary rpz-btn-sm"
                    onClick={handleSpin}
                  >
                    🔄 다시 돌리기
                  </button>
                  {activeEntries.length > 2 && (
                    <button
                      type="button"
                      className="rpz-btn rpz-btn-accent rpz-btn-sm"
                      onClick={handleEliminateCurrentWinner}
                    >
                      ❌ 이 항목 탈락시키기
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="rpz-sidebar-panel">
          <div className="rpz-card">
            <h3>1. 룰렛 항목 편집 (활성 {activeEntries.length}개)</h3>
            <form className="rpz-inline-form" onSubmit={handleAddSingleItem}>
              <input
                type="text"
                className="rpz-input"
                value={newItemInput}
                disabled={phase === 'spinning'}
                onChange={e => setNewItemInput(e.target.value)}
                placeholder="새 항목 추가..."
                data-testid="wheel-add-input"
              />
              <button
                type="submit"
                className="rpz-btn rpz-btn-secondary rpz-btn-sm"
                disabled={phase === 'spinning'}
              >
                추가
              </button>
            </form>

            <textarea
              className="rpz-textarea"
              rows={4}
              value={itemsText}
              disabled={phase === 'spinning'}
              onChange={e => setItemsText(e.target.value)}
              placeholder="줄바꿈 또는 쉼표(,)로 항목 입력"
              data-testid="wheel-items-textarea"
            />

            <div className="rpz-preset-row">
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'spinning'}
                onClick={handleShuffleEntries}
              >
                🔀 셔플
              </button>
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'spinning'}
                onClick={handleSortEntries}
              >
                🔤 정렬
              </button>
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'spinning'}
                onClick={() => {
                  setEliminatedLabels([]);
                  setItemsText('한식 국밥\n수제 버거\n초밥 세트\n마라탕\n쌀국수\n돈까스\n김치찌개\n피자');
                }}
              >
                점심 메뉴 프리셋
              </button>
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'spinning'}
                onClick={() => {
                  setEliminatedLabels([]);
                  setItemsText(INITIAL_WHEEL_ITEMS.join('\n'));
                }}
              >
                참가자 프리셋
              </button>
            </div>

            {eliminatedLabels.length > 0 && (
              <div className="rpz-eliminated-box" data-testid="wheel-eliminated-box">
                <small>탈락된 항목 ({eliminatedLabels.length}): {eliminatedLabels.join(', ')}</small>
              </div>
            )}
          </div>

          <div className="rpz-card">
            <h3>2. 물리 · 테마 · 사운드 설정</h3>
            <label className="rpz-field">
              <span>컬러 테마 ({THEME_PRESETS[themePreset]?.label})</span>
              <select
                className="rpz-select"
                value={themePreset}
                onChange={e => setThemePreset(e.target.value)}
              >
                {THEME_ORDER.map(key => (
                  <option key={key} value={key}>
                    {THEME_PRESETS[key].label}
                  </option>
                ))}
              </select>
            </label>

            <label className="rpz-field">
              <span>회전 시간 ({spinDurationSec}초)</span>
              <input
                type="range"
                min="1.5"
                max="6.0"
                step="0.5"
                value={spinDurationSec}
                disabled={phase === 'spinning'}
                onChange={e => setSpinDurationSec(Number(e.target.value))}
              />
            </label>

            <div className="rpz-row-2col">
              <label className="rpz-field">
                <span>틱 효과음</span>
                <select
                  className="rpz-select"
                  value={tickVariant}
                  onChange={e => setTickVariant(e.target.value)}
                >
                  <option value="wooden">우드 핀 (Wooden)</option>
                  <option value="click">메탈 클릭 (Click)</option>
                  <option value="pop">버블 팝 (Pop)</option>
                  <option value="digital">아케이드 (Digital)</option>
                </select>
              </label>
              <label className="rpz-field">
                <span>당첨 효과음</span>
                <select
                  className="rpz-select"
                  value={winVariant}
                  onChange={e => setWinVariant(e.target.value)}
                >
                  <option value="fanfare">팡파르 (Fanfare)</option>
                  <option value="applause">박수 갈채 (Applause)</option>
                  <option value="chime">벨 차임 (Chime)</option>
                  <option value="sparkle">스파클 (Sparkle)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rpz-card">
            <h3>3. 추첨 기록 ({history.length})</h3>
            {history.length === 0 ? (
              <p className="rpz-empty">아직 룰렛 추첨 기록이 없습니다.</p>
            ) : (
              <ul className="rpz-history-list" data-testid="wheel-history-list">
                {history.map(item => (
                  <li key={item.id}>
                    <div className="rpz-history-head">
                      <strong>🎯 {item.winner}</strong>
                      <small>{item.time}</small>
                    </div>
                    <small>
                      후보 {item.candidates}개 ({item.probabilityPct}%)
                      {item.mystery ? ' · 미스터리' : ''}
                      {item.elimination ? ' · 탈락모드' : ''}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rpz-license-box">
            <small>
              <strong>오픈소스 라이선스 고지:</strong> 회전 물리 및 오디오 엔진 <code>alsatianco/spin-the-wheel</code> (MIT License, Copyright © 2026 alsatianco) 원본 모듈 재사용.
            </small>
          </div>
        </aside>
      </div>
    </div>
  );
}
