import React, { useEffect, useState } from 'react';
import { getGameGuide } from '../game-guides.js';

/**
 * 모든 게임 공통 대기실 UI.
 *  - GuideModal : [조작법] 팝업 (키캡 + 규칙 + 팁)
 *  - GameLobby  : 게임 진입 대기실 (싱글 vs 컴퓨터 / 멀티: 즉시 매칭 · 참여 코드)
 *  - RoomWaiting: 멀티 방 대기실 (참가자 · 시작)
 * 닉네임은 홈에서 정해진 값을 읽기 전용으로만 표시한다.
 */

export const DIFFICULTIES = [
  { id: 'easy', label: '쉬움' },
  { id: 'normal', label: '보통' },
  { id: 'hard', label: '어려움' },
];

/** 게임별 대기실 옵션 정의 */
export function getLobbyConfig(game) {
  if (!game) return null;
  if (game.id === 'roulette') return { kind: 'draw' };
  const maxPlayers = game.maxPlayers || 2;
  if (game.id === 'bombergirl') {
    return { kind: 'game', bots: { min: 1, max: 3, def: 3 }, difficulty: false, multiMax: 2, botNote: '원본 AI 상대 (최대 3명)' };
  }
  if (game.id === 'bomberman') {
    return { kind: 'game', bots: { min: 1, max: 3, def: 1 }, difficulty: false, multiMax: 4, botNote: '원본 COM-BOT (최대 3명)' };
  }
  const max = Math.max(1, maxPlayers - 1);
  return {
    kind: 'game',
    bots: { min: 1, max, def: Math.min(max, game.id === 'drawing' ? 2 : 1) },
    difficulty: true,
    multiMax: maxPlayers,
    botNote: null,
  };
}

export function GuideModal({ game, onClose }) {
  const guide = getGameGuide(game?.id);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="gl-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="gl-modal" onClick={(e) => e.stopPropagation()}>
        <header className="gl-modal-head">
          <div>
            <span className="gl-eyebrow">HOW TO PLAY</span>
            <h3>{game?.icon} {game?.name} 조작법</h3>
            <p>{guide.summary}</p>
          </div>
          <button type="button" className="gl-icon-btn" onClick={onClose} aria-label="닫기">✕</button>
        </header>

        <div className="gl-modal-body">
          <section>
            <h4>⌨️ 키 · 입력</h4>
            <ul className="gl-key-list">
              {guide.controls.map((c, i) => (
                <li key={i}>
                  <span className="gl-keys">
                    {c.keys.map((k, ki) => (
                      <React.Fragment key={ki}>
                        {ki > 0 && <i>/</i>}
                        <kbd>{k}</kbd>
                      </React.Fragment>
                    ))}
                  </span>
                  <span className="gl-key-desc">{c.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4>🎯 규칙</h4>
            <ul className="gl-rule-list">
              {guide.rules.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </section>

          {guide.tips?.length > 0 && (
            <section className="gl-tip-box">
              <h4>💡 팁</h4>
              <ul className="gl-rule-list">
                {guide.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </section>
          )}
        </div>

        <footer className="gl-modal-foot">
          <button type="button" className="gl-btn gl-btn-primary" onClick={onClose}>확인 (ESC)</button>
        </footer>
      </div>
    </div>
  );
}

function Stepper({ label, value, min, max, onChange, disabled }) {
  return (
    <div className="gl-field">
      <span className="gl-field-label">{label}</span>
      <div className="gl-stepper">
        <button type="button" disabled={disabled || value <= min} onClick={() => onChange(value - 1)} aria-label="줄이기">−</button>
        <strong>{value}</strong>
        <button type="button" disabled={disabled || value >= max} onClick={() => onChange(value + 1)} aria-label="늘리기">+</button>
      </div>
      <span className="gl-field-hint">{min === max ? '고정' : `${min} ~ ${max}`}</span>
    </div>
  );
}

export function GameLobby({
  game,
  userName,
  quickWaiting = 0,
  initialCode = '',
  busy = false,
  onBack = null,
  onStartSingle,
  onQuickMatch,
  onCreateRoom,
  onJoinCode,
  onStartDraw,
}) {
  const config = getLobbyConfig(game);
  const guide = getGameGuide(game?.id);
  const [mode, setMode] = useState('single');
  const [showGuide, setShowGuide] = useState(false);
  const [botCount, setBotCount] = useState(config?.bots?.def || 1);
  const [difficulty, setDifficulty] = useState('normal');
  const [code, setCode] = useState(initialCode || '');

  useEffect(() => {
    setBotCount(config?.bots?.def || 1);
    setMode(initialCode ? 'multi' : 'single');
  }, [game?.id]);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      setMode('multi');
    }
  }, [initialCode]);

  if (!game || !config) return null;
  const isDraw = config.kind === 'draw';

  return (
    <div className="gl-lobby">
      <header className="gl-hero">
        <div className="gl-hero-icon">{game.icon}</div>
        <div className="gl-hero-main">
          <div className="gl-chip-row">
            <span className="gl-chip">{game.badge || game.category}</span>
            {!isDraw && <span className="gl-chip gl-chip-soft">1 ~ {config.multiMax}인</span>}
          </div>
          <h2>{game.name}</h2>
          <p>{game.description}</p>
        </div>
        <div className="gl-hero-side">
          <span className="gl-player-badge" title="닉네임은 GAME-BOX 홈에서 변경할 수 있습니다">
            👤 <strong>{userName || '게스트'}</strong>
          </span>
          <button type="button" className="gl-btn gl-btn-ghost" onClick={() => setShowGuide(true)}>
            📖 조작법 팝업
          </button>
          {onBack && (
            <button type="button" className="gl-btn gl-btn-ghost" onClick={onBack}>← 게임 목록</button>
          )}
        </div>
      </header>

      <div className={`gl-dashboard-grid ${isDraw ? 'gl-dashboard-grid-draw' : ''}`}>
        <div className="gl-dashboard-main">
          {isDraw ? (
            <section className="gl-panel gl-panel-draw">
              <div className="gl-panel-head">
                <span className="gl-pill gl-pill-draw">DRAW</span>
                <h3>🎯 마블 룰렛 추첨</h3>
              </div>
              <p className="gl-panel-desc">
                참가자 명단을 입력하고 Box2D 물리 엔진의 박진감 넘치는 구슬 레이스로 공정하게 당첨자를 선발하세요.
              </p>

              <div className="gl-draw-feature-grid">
                <div className="gl-draw-feature-card">
                  <span className="gl-draw-feature-icon">🏢</span>
                  <div>
                    <strong>사내 부서 명단 연동</strong>
                    <p>부서별/전체 직원 명단을 원클릭으로 불러와 참가자로 설정</p>
                  </div>
                </div>
                <div className="gl-draw-feature-card">
                  <span className="gl-draw-feature-icon">⚖️</span>
                  <div>
                    <strong>Box2D 물리 시뮬레이션</strong>
                    <p>모든 구슬이 동일한 물리 조건에서 충돌하며 공정하게 낙하</p>
                  </div>
                </div>
                <div className="gl-draw-feature-card">
                  <span className="gl-draw-feature-icon">🎢</span>
                  <div>
                    <strong>다양한 맵 & 멀티 구슬</strong>
                    <p>10종 이상의 트랙과 이름*N 배수 참가 기능 지원</p>
                  </div>
                </div>
                <div className="gl-draw-feature-card">
                  <span className="gl-draw-feature-icon">📊</span>
                  <div>
                    <strong>당첨 히스토리 보관</strong>
                    <p>추첨 결과를 자동 저장하고 이전 당첨 내역 열람</p>
                  </div>
                </div>
              </div>

              <div className="gl-draw-cta-box">
                <button type="button" className="gl-btn gl-btn-primary gl-btn-lg gl-draw-start-btn" onClick={onStartDraw}>
                  ▶ 룰렛 열기 (추첨 시작)
                </button>
                <p className="gl-footnote">룰렛 화면으로 이동하여 참가자 명단 편집 및 맵 선택을 진행할 수 있습니다.</p>
              </div>
            </section>
          ) : (
            <>
              <div className="gl-tabs" role="tablist" aria-label="플레이 방식">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'single'}
                  className={mode === 'single' ? 'active' : ''}
                  onClick={() => setMode('single')}
                >
                  🤖 싱글 <small>컴퓨터와 대결</small>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'multi'}
                  className={mode === 'multi' ? 'active' : ''}
                  onClick={() => setMode('multi')}
                >
                  🌐 멀티 <small>2~{config.multiMax}인 온라인</small>
                </button>
              </div>

              {mode === 'single' ? (
                <section className="gl-panel" data-lobby-mode="single">
                  <div className="gl-options">
                    <Stepper
                      label="컴퓨터 수"
                      value={botCount}
                      min={config.bots.min}
                      max={config.bots.max}
                      onChange={setBotCount}
                    />
                    {config.difficulty ? (
                      <div className="gl-field">
                        <span className="gl-field-label">난이도</span>
                        <div className="gl-seg">
                          {DIFFICULTIES.map(d => (
                            <button
                              key={d.id}
                              type="button"
                              className={difficulty === d.id ? 'active' : ''}
                              onClick={() => setDifficulty(d.id)}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                        <span className="gl-field-hint">컴퓨터의 반응 속도와 전략이 달라집니다</span>
                      </div>
                    ) : (
                      <div className="gl-field">
                        <span className="gl-field-label">난이도</span>
                        <strong className="gl-field-static">원본 AI</strong>
                        <span className="gl-field-hint">{config.botNote}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="gl-btn gl-btn-primary gl-btn-lg"
                    disabled={busy}
                    onClick={() => onStartSingle({ botCount, difficulty })}
                  >
                    {busy ? '준비 중...' : '▶ 게임 시작'}
                  </button>
                  <p className="gl-footnote">컴퓨터와의 대결은 연습 경기로 기록되며 공식 랭킹에는 반영되지 않습니다.</p>
                </section>
              ) : (
                <section className="gl-panel gl-multi" data-lobby-mode="multi">
                  <article className="gl-multi-card">
                    <div className="gl-panel-head">
                      <span className="gl-pill gl-pill-quick">QUICK</span>
                      <h3>⚡ 즉시 매칭</h3>
                    </div>
                    <p className="gl-panel-desc">
                      대기 중인 방에 바로 입장합니다. 없으면 새 방을 만들어 상대를 기다리고,
                      2명이 모이면 자동으로 시작됩니다.
                    </p>
                    <button type="button" className="gl-btn gl-btn-primary gl-btn-lg" disabled={busy} onClick={onQuickMatch}>
                      매칭 시작
                    </button>
                    <span className="gl-footnote">
                      {quickWaiting > 0 ? `지금 ${quickWaiting}개 방이 상대를 기다리는 중` : '현재 대기 중인 방 없음 — 내가 첫 번째!'}
                    </span>
                  </article>

                  <article className="gl-multi-card">
                    <div className="gl-panel-head">
                      <span className="gl-pill gl-pill-code">CODE</span>
                      <h3>🔑 참여 코드</h3>
                    </div>
                    <p className="gl-panel-desc">친구와 함께라면 방을 만들어 코드를 공유하거나, 받은 코드를 입력하세요.</p>
                    <button type="button" className="gl-btn gl-btn-secondary" disabled={busy} onClick={onCreateRoom}>
                      ➕ 새 방 만들기
                    </button>
                    <div className="gl-code-row">
                      <input
                        type="text"
                        className="gl-input"
                        placeholder="참여 코드 입력"
                        maxLength={8}
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => { if (e.key === 'Enter') onJoinCode(code); }}
                      />
                      <button type="button" className="gl-btn gl-btn-primary" disabled={busy || !code.trim()} onClick={() => onJoinCode(code)}>
                        입장
                      </button>
                    </div>
                  </article>
                </section>
              )}
            </>
          )}
        </div>

        {/* RIGHT — LIVE GAME GUIDE & RULES DASHBOARD */}
        <aside className="gl-dashboard-side">
          <div className="gl-side-card">
            <div className="gl-side-head">
              <span className="gl-pill gl-pill-info">GUIDE</span>
              <h3>⌨️ 조작법 및 키맵핑</h3>
            </div>
            <ul className="gl-side-key-list">
              {guide.controls.map((c, i) => (
                <li key={i}>
                  <span className="gl-keys">
                    {c.keys.map((k, ki) => (
                      <React.Fragment key={ki}>
                        {ki > 0 && <i>/</i>}
                        <kbd>{k}</kbd>
                      </React.Fragment>
                    ))}
                  </span>
                  <span className="gl-side-key-desc">{c.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="gl-side-card">
            <div className="gl-side-head">
              <span className="gl-pill gl-pill-rule">RULES</span>
              <h3>🎯 핵심 규칙</h3>
            </div>
            <ul className="gl-side-rule-list">
              {guide.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {guide.tips?.length > 0 && (
            <div className="gl-side-card gl-side-card-tip">
              <div className="gl-side-head">
                <span className="gl-pill gl-pill-tip">TIP</span>
                <h3>💡 플레이 공략</h3>
              </div>
              <ul className="gl-side-rule-list">
                {guide.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {showGuide && <GuideModal game={game} onClose={() => setShowGuide(false)} />}
    </div>
  );
}

/** 멀티 방 대기실 */
export function RoomWaiting({
  game,
  room,
  me,
  isHost,
  countdown = null,
  botDifficulty,
  onBotDifficulty,
  onAddBot,
  onRemoveBot,
  onStart,
  onCopyLink,
  onLeave,
}) {
  const [showGuide, setShowGuide] = useState(false);
  const maxPlayers = game?.maxPlayers || 8;
  const isQuick = room.matchType === 'quick';
  const humans = room.players.filter(p => !p.isBot).length;
  const canStart = room.players.length >= 2;
  const supportsBots = game?.supportsBot && room.game !== 'bombergirl';

  return (
    <div className="gl-lobby gl-room">
      <header className="gl-hero">
        <div className="gl-hero-icon">{game?.icon || '🎮'}</div>
        <div className="gl-hero-main">
          <div className="gl-chip-row">
            <span className="gl-chip">{isQuick ? '⚡ 즉시 매칭' : '🔑 참여 코드 방'}</span>
            <span className="gl-chip gl-chip-soft">{room.players.length} / {maxPlayers}명</span>
          </div>
          <h2>{game?.name || room.game}</h2>
          {isQuick ? (
            <p>{canStart ? '상대를 찾았습니다!' : '상대 플레이어를 찾는 중입니다...'}</p>
          ) : (
            <p>아래 코드를 친구에게 공유하세요. 방장이 시작하면 게임이 열립니다.</p>
          )}
        </div>
        <div className="gl-hero-side">
          <button type="button" className="gl-btn gl-btn-ghost" onClick={() => setShowGuide(true)}>📖 조작법</button>
          <button type="button" className="gl-btn gl-btn-ghost" onClick={onLeave}>← 나가기</button>
        </div>
      </header>

      <div className="gl-room-grid">
        <section className="gl-panel">
          <div className="gl-code-banner">
            <div>
              <span className="gl-field-label">참여 코드</span>
              <strong className="gl-code-value">{room.code}</strong>
            </div>
            <button type="button" className="gl-btn gl-btn-secondary gl-btn-sm" onClick={onCopyLink}>🔗 링크 복사</button>
          </div>

          <ul className="gl-player-list">
            {room.players.map(p => (
              <li key={p.id} className={p.id === me?.id ? 'is-me' : ''}>
                <span className="gl-avatar">{p.isBot ? '🤖' : '👤'}</span>
                <div className="gl-player-main">
                  <strong>{p.name}</strong>
                  <small>{p.isBot ? `컴퓨터 · ${(p.botDifficulty || 'normal').toUpperCase()}` : '플레이어'}</small>
                </div>
                {p.id === (room.hostId || room.host) && <span className="gl-tag">방장</span>}
                {isHost && p.isBot && (
                  <button type="button" className="gl-btn gl-btn-ghost gl-btn-sm" onClick={() => onRemoveBot(p.id)}>제거</button>
                )}
              </li>
            ))}
            {Array.from({ length: Math.max(0, maxPlayers - room.players.length) }).slice(0, 4).map((_, i) => (
              <li key={`empty-${i}`} className="is-empty">
                <span className="gl-avatar">＋</span>
                <div className="gl-player-main"><small>빈 자리</small></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="gl-panel gl-room-actions">
          {isHost && supportsBots && !isQuick && (
            <div className="gl-field">
              <span className="gl-field-label">컴퓨터 추가</span>
              <div className="gl-bot-row">
                <div className="gl-seg">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      className={botDifficulty === d.id ? 'active' : ''}
                      onClick={() => onBotDifficulty(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="gl-btn gl-btn-secondary gl-btn-sm"
                  disabled={room.players.length >= maxPlayers}
                  onClick={onAddBot}
                >
                  + 추가
                </button>
              </div>
              <span className="gl-field-hint">컴퓨터가 포함된 경기는 연습 경기로 처리됩니다.</span>
            </div>
          )}

          {isQuick && countdown != null && (
            <div className="gl-countdown">
              <strong>{countdown}</strong>
              <span>초 후 자동 시작</span>
            </div>
          )}

          {isHost ? (
            <button type="button" className="gl-btn gl-btn-primary gl-btn-lg" disabled={!canStart} onClick={onStart}>
              {canStart ? '▶ 지금 시작' : `최소 2명 필요 (현재 ${humans}명)`}
            </button>
          ) : (
            <div className="gl-waiting-note">⏳ 방장이 시작하기를 기다리는 중...</div>
          )}
        </section>
      </div>

      {showGuide && <GuideModal game={game} onClose={() => setShowGuide(false)} />}
    </div>
  );
}
