import React, { useState, useEffect, useRef, useMemo } from 'react';
import { secureRandomInt, shuffleUnbiased, formatDrawTime } from '../shared/randomEngine.js';
import { drawSound } from '../shared/soundEngine.js';

/**
 * MYSTERY BOX — 3D 제비뽑기 미니게임
 *
 * Open-source provenance:
 * - Reference repository: `hongjiapeng/lottery-draw` (`lottery.html`, MIT License, Copyright (c) 2025 hongjiapeng).
 * - Original repo state: `hongjiapeng/lottery-draw` provides a 2D card shake (`@keyframes shake`) and a modal
 *   with non-repeating draw pool tracking (`usedQuestions`).
 * - Implemented directly for GAMEBOX:
 *   1) True 6-face CSS 3D Mystery Box (`transform-style: preserve-3d`) with hinged opening top flaps and visible interior paper slips.
 *   2) 3D Box Shake animation (`shaking`) with rattle SFX.
 *   3) Single folded paper slip extraction (`extracting`) rising out of the 3D box slot.
 *   4) Multi-fold 3D paper unfolding choreography (`unfolding` -> `revealed`) with paper rustle SFX.
 *   5) Strict non-repeating draw pool (`preventDuplicates`: drawn tickets are removed from the box until reset).
 */

const PRESET_MODES = {
  prize: {
    label: '🎁 경품 · 당첨 제비 (1등~꽝)',
    text: [
      '🏆 1등: 백화점 상품권 10만원',
      '🥈 2등: 무선 노이즈캔슬링 이어폰',
      '🥉 3등: 프리미엄 커피 기프티콘',
      '🥉 3등: 프리미엄 커피 기프티콘',
      '🍬 참가상: 비타민 음료',
      '🍬 참가상: 비타민 음료',
      '💨 꽝! 다음 기회에',
      '💨 꽝! 다음 기회에',
    ].join('\n'),
  },
  coffee: {
    label: '☕ 커피 · 간식 내기 제비',
    text: [
      '💣 오늘 커피 전체 쏘기 당첨!',
      '🍰 디저트 쏘기 당첨!',
      '🛡️ 안전 통과 (무료 시음권)',
      '🛡️ 안전 통과 (무료 시음권)',
      '🛡️ 안전 통과 (무료 시음권)',
      '🛡️ 안전 통과 (무료 시음권)',
    ].join('\n'),
  },
  names: {
    label: '🙋 발표자 · 당번 이름 뽑기',
    text: [
      '김성민',
      '이지훈',
      '박수진',
      '최민호',
      '정하늘',
      '강동원',
      '윤서연',
      '한지민',
    ].join('\n'),
  },
  icebreaker: {
    label: '💬 팀 빌딩 질문 제비 (원본 스타일)',
    text: [
      '하루 동안 어느 식당이든 무료로 먹을 수 있다면 어디로 갈까요?',
      '무인도에 딱 한 가지 물건만 가져갈 수 있다면 무엇을 챙기겠습니까?',
      '순간이동 능력이 생겨서 5분 동안만 어디든 다녀올 수 있다면?',
      '오늘 나의 정신 상태를 음식 하나로 표현한다면 무엇인가요?',
      '우리 팀에서 내가 맡고 싶은 숨은 캐릭터(역할)는 무엇인가요?',
      '올해 안에 반드시 마스터하고 싶은 새로운 기술이나 취미가 있다면?',
    ].join('\n'),
  },
};

export default function MysteryBoxGame({ onBack }) {
  const [presetKey, setPresetKey] = useState('prize');
  const [ticketsInput, setTicketsInput] = useState(PRESET_MODES.prize.text);
  const [preventDuplicates, setPreventDuplicates] = useState(true);
  const [drawnTicketIds, setDrawnTicketIds] = useState([]);
  const [boxYaw, setBoxYaw] = useState(-22);
  const [boxPitch, setBoxPitch] = useState(-16);

  // Separated states:
  // 1) Locked drawn ticket (`currentTicket`: { id, label, serialNumber, isHighlight })
  // 2) Animation state (`phase`: 'idle' | 'shaking' | 'extracting' | 'unfolding' | 'revealed')
  const [currentTicket, setCurrentTicket] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [history, setHistory] = useState([]);

  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Build deterministic list of tickets from input text
  const allTickets = useMemo(() => {
    const lines = ticketsInput
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);
    return lines.map((label, idx) => {
      const isHighlight = /1등|2등|3등|당첨|쏘기|🏆|🥈|🥉|💣/.test(label) && !/꽝/.test(label);
      return {
        id: `slip-${idx}-${label}`,
        serialNumber: idx + 1,
        label,
        isHighlight,
      };
    });
  }, [ticketsInput]);

  const drawnSet = useMemo(() => new Set(drawnTicketIds), [drawnTicketIds]);

  const remainingTickets = useMemo(() => {
    if (!preventDuplicates) return allTickets;
    return allTickets.filter(t => !drawnSet.has(t.id));
  }, [allTickets, drawnSet, preventDuplicates]);

  const finalizeTicketReveal = (locked, nextDrawnIds) => {
    clearTimers();
    setCurrentTicket(locked);
    if (preventDuplicates && nextDrawnIds) {
      setDrawnTicketIds(nextDrawnIds);
    }
    setPhase('revealed');
    drawSound.playFanfare();

    setHistory(prev => [
      {
        id: `box-${Date.now()}`,
        time: formatDrawTime(),
        serialNumber: locked.serialNumber,
        label: locked.label,
        remainingAfter: preventDuplicates
          ? Math.max(0, allTickets.length - (nextDrawnIds?.length || drawnTicketIds.length))
          : allTickets.length,
      },
      ...prev.slice(0, 14),
    ]);
  };

  const handleDrawOneTicket = () => {
    if (phase === 'shaking' || phase === 'extracting' || phase === 'unfolding') return;
    if (remainingTickets.length === 0) return;

    clearTimers();

    // 1. Lock the drawn ticket immediately using unbiased Web Crypto RNG
    const pickIdx = secureRandomInt(remainingTickets.length);
    const locked = remainingTickets[pickIdx];
    const nextDrawnIds = preventDuplicates
      ? [...drawnTicketIds, locked.id]
      : drawnTicketIds;

    setCurrentTicket(locked);
    setPhase('shaking');
    drawSound.playBoxShake();

    // Step 2: Lid opens & folded paper slip rises out of the box
    const t1 = setTimeout(() => {
      setPhase('extracting');
      drawSound.playTick(0.4, 'pop');
    }, 550);

    // Step 3: Folded paper slip unfolds in 3D space
    const t2 = setTimeout(() => {
      setPhase('unfolding');
      drawSound.playPaperUnfold();
    }, 1100);

    // Step 4: Final revealed state
    const t3 = setTimeout(() => {
      finalizeTicketReveal(locked, nextDrawnIds);
    }, 1700);

    timersRef.current.push(t1, t2, t3);
  };

  const handleShakeBoxOnly = () => {
    if (phase !== 'idle' && phase !== 'revealed') return;
    clearTimers();
    setPhase('shaking');
    drawSound.playBoxShake();
    const lines = ticketsInput.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const shuffledLines = shuffleUnbiased(lines);
    setTicketsInput(shuffledLines.join('\n'));
    const t = setTimeout(() => {
      setPhase('idle');
    }, 550);
    timersRef.current.push(t);
  };

  const handleInstantUnfold = () => {
    if (!currentTicket) return;
    const nextDrawnIds = preventDuplicates && !drawnSet.has(currentTicket.id)
      ? [...drawnTicketIds, currentTicket.id]
      : drawnTicketIds;
    finalizeTicketReveal(currentTicket, nextDrawnIds);
  };

  const handleResetBox = () => {
    clearTimers();
    setDrawnTicketIds([]);
    setCurrentTicket(null);
    setPhase('idle');
  };

  const handleApplyPreset = (key) => {
    const preset = PRESET_MODES[key];
    if (!preset) return;
    clearTimers();
    setPresetKey(key);
    setTicketsInput(preset.text);
    setDrawnTicketIds([]);
    setCurrentTicket(null);
    setPhase('idle');
  };

  const isLidOpen = phase === 'extracting' || phase === 'unfolding' || phase === 'revealed';

  return (
    <div className="rpz-game-shell" data-testid="game-mystery-box">
      <header className="rpz-game-topbar">
        <div className="rpz-game-title-group">
          <button type="button" className="rpz-back-btn" onClick={onBack}>
            ← RANDOM PLAY ZONE
          </button>
          <div>
            <span className="rpz-game-Tag">GAME 05 · 3D MYSTERY LOTTERY BOX</span>
            <h2>🎁 MYSTERY BOX — 3D 제비뽑기</h2>
          </div>
        </div>

        <div className="rpz-top-actions">
          <button
            type="button"
            className="rpz-btn rpz-btn-secondary"
            data-testid="box-shake-btn"
            onClick={handleShakeBoxOnly}
            disabled={phase === 'shaking' || phase === 'extracting' || phase === 'unfolding'}
          >
            🫨 상자 흔들어 섞기
          </button>

          {(phase === 'idle' || phase === 'revealed') && (
            <button
              type="button"
              className="rpz-btn rpz-btn-primary"
              data-testid="box-draw-btn"
              onClick={handleDrawOneTicket}
              disabled={remainingTickets.length === 0}
            >
              {remainingTickets.length === 0
                ? '모든 제비 소진됨 (리셋 필요)'
                : phase === 'revealed'
                  ? `✋ 다음 제비 뽑기 (남은 ${remainingTickets.length}장)`
                  : `✋ 제비 한 장 뽑기 (남은 ${remainingTickets.length}장)`}
            </button>
          )}

          {(phase === 'shaking' || phase === 'extracting' || phase === 'unfolding') && (
            <button
              type="button"
              className="rpz-btn rpz-btn-accent"
              data-testid="box-instant-btn"
              onClick={handleInstantUnfold}
            >
              ⚡ 종이 즉시 펼치기
            </button>
          )}

          <button
            type="button"
            className="rpz-btn rpz-btn-ghost"
            data-testid="box-reset-btn"
            onClick={handleResetBox}
          >
            ♻️ 상자에 제비 모두 다시 넣기
          </button>
        </div>
      </header>

      <div className="rpz-game-workspace">
        <section className="rpz-stage-panel">
          <div className="rpz-stage-status-bar">
            <span className={`rpz-phase-pill phase-${phase}`} data-testid="box-phase-badge">
              {phase === 'idle' && `3D 제비상자 대기 중 — 상자 안 남은 제비 ${remainingTickets.length}장 / 전체 ${allTickets.length}장`}
              {phase === 'shaking' && '🫨 3D 제비상자를 흔들어 종이 제비를 섞는 중...'}
              {phase === 'extracting' && '✉️ 상자 투입구에서 접힌 종이 제비 한 장을 꺼내는 중...'}
              {phase === 'unfolding' && '📜 접힌 종이 제비를 펼치는 중...'}
              {phase === 'revealed' && currentTicket && `🎉 제비 공개 완료! [제비 #${currentTicket.serialNumber}] ${currentTicket.label}`}
            </span>

            <div className="rpz-mode-badges">
              <button
                type="button"
                data-testid="box-duplicate-toggle"
                className={`rpz-chip ${preventDuplicates ? 'active' : ''}`}
                onClick={() => setPreventDuplicates(v => !v)}
              >
                🔒 중복 추첨 방지 {preventDuplicates ? 'ON (뽑은 제비 제외)' : 'OFF (복원 추출)'}
              </button>
            </div>
          </div>

          {/* 3D Mystery Box & Unfolding Paper Slip Stage */}
          <div className="rpz-mystery-3d-stage" data-testid="box-3d-stage">
            <div className="rpz-mystery-3d-scene">
              <div
                className={`rpz-cube-rig phase-${phase}`}
                style={{
                  transform: `rotateX(${boxPitch}deg) rotateY(${boxYaw}deg)`,
                }}
              >
                {/* 6 Faces of the 3D Mystery Box */}
                <div className="rpz-cube-face rpz-cube-front">
                  <span className="rpz-cube-badge">GAMEBOX RANDOM ZONE</span>
                  <strong>MYSTERY BOX</strong>
                  <span className="rpz-cube-count">
                    남은 제비 <b>{remainingTickets.length}</b> / {allTickets.length}
                  </span>
                </div>
                <div className="rpz-cube-face rpz-cube-back">
                  <span>LUCKY DRAW</span>
                </div>
                <div className="rpz-cube-face rpz-cube-right">
                  <span>🎲</span>
                  <small>NO DUPLICATES</small>
                </div>
                <div className="rpz-cube-face rpz-cube-left">
                  <span>✉️</span>
                  <small>FOLDED SLIPS</small>
                </div>
                <div className="rpz-cube-face rpz-cube-bottom" />

                {/* Hinged 3D Top Lid Flaps */}
                <div className={`rpz-cube-lid-left ${isLidOpen ? 'open' : ''}`} />
                <div className={`rpz-cube-lid-right ${isLidOpen ? 'open' : ''}`} />

                {/* Visible Interior Paper Slips inside the 3D Box */}
                <div className="rpz-cube-interior-slips">
                  {remainingTickets.slice(0, 12).map((slip, idx) => (
                    <span
                      key={slip.id}
                      className="rpz-mini-slip3d"
                      style={{
                        transform: `translate3d(${((idx % 4) - 1.5) * 32}px, ${-10 - (idx % 3) * 8}px, ${(Math.floor(idx / 4) - 1) * 32}px) rotateY(${idx * 37}deg) rotateZ(${(idx % 2 === 0 ? 1 : -1) * 18}deg)`,
                      }}
                    >
                      #{slip.serialNumber}
                    </span>
                  ))}
                </div>

                {/* Extracting Folded Paper Slip rising out of the box */}
                {(phase === 'extracting' || phase === 'unfolding' || phase === 'revealed') && currentTicket && (
                  <div className={`rpz-extracting-slip state-${phase}`}>
                    <span>제비 #{currentTicket.serialNumber}</span>
                  </div>
                )}
              </div>

              {/* Camera Angle Controls */}
              <div className="rpz-camera-rot-controls">
                <button type="button" className="rpz-btn-xs" onClick={() => setBoxYaw(y => y - 25)}>◀ 좌회전</button>
                <button type="button" className="rpz-btn-xs" onClick={() => { setBoxYaw(-22); setBoxPitch(-16); }}>정면 3D 뷰</button>
                <button type="button" className="rpz-btn-xs" onClick={() => setBoxYaw(y => y + 25)}>우회전 ▶</button>
              </div>
            </div>

            {/* 3D Paper Unfolding Showcase Panel */}
            <div className="rpz-paper-unfold-zone">
              {!currentTicket || phase === 'idle' ? (
                <div className="rpz-paper-placeholder" onClick={handleDrawOneTicket}>
                  <span className="rpz-paper-icon">✉️</span>
                  <strong>3D 상자를 클릭하거나 [제비 한 장 뽑기]를 누르세요</strong>
                  <p>상자를 흔든 뒤 접힌 종이 제비 한 장을 꺼내 3단으로 펼쳐 결과를 공개합니다.</p>
                </div>
              ) : (
                <div
                  className={`rpz-folded-paper-card phase-${phase} ${currentTicket.isHighlight ? 'is-highlight' : ''}`}
                  data-testid="box-paper-slip"
                >
                  <div className="rpz-paper-top-flap">
                    <span>GAMEBOX OFFICIAL LOTTERY SLIP · NO.{String(currentTicket.serialNumber).padStart(2, '0')}</span>
                  </div>

                  <div className="rpz-paper-center-body">
                    {phase === 'shaking' && (
                      <div className="rpz-paper-stage-msg">🫨 상자 내부에서 제비를 섞는 중...</div>
                    )}
                    {phase === 'extracting' && (
                      <div className="rpz-paper-stage-msg">✉️ 접힌 제비(#{currentTicket.serialNumber})를 상자 밖으로 꺼냈습니다!</div>
                    )}
                    {phase === 'unfolding' && (
                      <div className="rpz-paper-stage-msg">📜 접힌 종이를 펼치는 중...</div>
                    )}
                    {phase === 'revealed' && (
                      <div className="rpz-paper-revealed-content" data-testid="box-revealed-result">
                        <span className="rpz-paper-serial">제비 번호 #{currentTicket.serialNumber}</span>
                        <strong className="rpz-paper-result-text">{currentTicket.label}</strong>
                        <span className="rpz-paper-stamp">
                          {currentTicket.isHighlight ? '당첨 확정' : '확인 완료'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="rpz-paper-bottom-flap">
                    <span>
                      {preventDuplicates
                        ? `중복 추첨 방지 적용됨 · 남은 제비 ${remainingTickets.length}장`
                        : '복원 추출 모드'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Remaining vs Drawn Tickets Visual Status Grid */}
          <div className="rpz-ticket-pool-strip" data-testid="box-pool-strip">
            <div className="rpz-pool-header">
              <strong>상자 속 제비 현황 ({remainingTickets.length}장 남음 / {drawnTicketIds.length}장 뽑힘)</strong>
            </div>
            <div className="rpz-pool-chips">
              {allTickets.map((t) => {
                const isDrawn = preventDuplicates && drawnSet.has(t.id);
                return (
                  <span
                    key={t.id}
                    className={`rpz-slip-badge ${isDrawn ? 'drawn' : 'inside'}`}
                    title={isDrawn ? `이미 뽑힘: ${t.label}` : '상자 안에 들어있는 미추첨 제비'}
                  >
                    #{t.serialNumber} {isDrawn ? `(${t.label.slice(0, 10)})` : '접힌 제비'}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="rpz-sidebar-panel">
          <div className="rpz-card">
            <h3>1. 제비 프리셋 선택</h3>
            <div className="rpz-preset-col">
              {Object.entries(PRESET_MODES).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={`rpz-preset-btn ${presetKey === key ? 'active' : ''}`}
                  disabled={phase === 'shaking' || phase === 'extracting' || phase === 'unfolding'}
                  onClick={() => handleApplyPreset(key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rpz-card">
            <h3>2. 상자 속 제비 목록 편집 ({allTickets.length}장)</h3>
            <textarea
              className="rpz-textarea"
              rows={6}
              value={ticketsInput}
              disabled={phase === 'shaking' || phase === 'extracting' || phase === 'unfolding'}
              onChange={(e) => {
                setTicketsInput(e.target.value);
                setDrawnTicketIds([]);
                setCurrentTicket(null);
                setPhase('idle');
              }}
              placeholder="한 줄에 제비 한 장씩 내용을 입력하세요"
              data-testid="box-tickets-textarea"
            />
            <small className="rpz-hint">
              한 줄이 접힌 종이 제비 1장이 됩니다. 추첨 중에는 뽑힌 제비가 상자에서 제거되어 중복 당첨되지 않습니다.
            </small>
          </div>

          <div className="rpz-card">
            <h3>3. 뽑은 제비 기록 ({history.length})</h3>
            {history.length === 0 ? (
              <p className="rpz-empty">아직 뽑은 제비가 없습니다.</p>
            ) : (
              <ul className="rpz-history-list" data-testid="box-history-list">
                {history.map(item => (
                  <li key={item.id}>
                    <div className="rpz-history-head">
                      <strong>제비 #{item.serialNumber}: {item.label}</strong>
                      <small>{item.time}</small>
                    </div>
                    <small>추첨 후 상자 잔여: {item.remainingAfter}장</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rpz-license-box">
            <small>
              <strong>오픈소스 라이선스 고지:</strong> 비중복 제비 풀 상태 구조 <code>hongjiapeng/lottery-draw</code> (MIT License, Copyright © 2025 hongjiapeng) 참고 · 6면 입체 CSS 3D 제비상자, 흔들기, 종이 추출 및 3단 펼침 연출 자체 제작.
            </small>
          </div>
        </aside>
      </div>
    </div>
  );
}
