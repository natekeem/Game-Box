import React, { useState, useEffect, useRef, useMemo } from 'react';
import { shuffleUnbiased, formatDrawTime } from '../shared/randomEngine.js';
import { drawSound } from '../shared/soundEngine.js';

/**
 * TEAM DRAFT — 팀 나누기 미니게임
 *
 * Open-source provenance:
 * - Core Balanced Team Allocation Algorithm adapted from `iamsujanstha/random-team-generator`
 *   (`src/utils/generateBalancedTeams.ts`, MIT License, Copyright (c) 2025 Sujan Shrestha).
 * - Extended for GAMEBOX:
 *   1) Unbiased pre-shuffle (`shuffleUnbiased`) so equal-rated participants are distributed randomly without input-order bias.
 *   2) Strict team size capacity guard (`ceil(N / teamCount)`) guaranteeing uniform headcount across teams.
 *   3) Separated draw state vs. step-by-step live Draft Pick reveal animation, team re-draw, and 1-click result copy.
 */

const TEAM_PALETTE = [
  { badge: 'ALPHA', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  { badge: 'BRAVO', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)' },
  { badge: 'CHARLIE', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)' },
  { badge: 'DELTA', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  { badge: 'ECHO', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  { badge: 'FOXTROT', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  { badge: 'GOLF', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.12)' },
  { badge: 'HOTEL', color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)' },
];

const DEFAULT_ROSTER_TEXT = [
  '김성민', '이지훈', '박수진', '최민호',
  '정하늘', '강동원', '윤서연', '한지민',
  '오승환', '배수지', '류현진', '손흥민',
].join(', ');

/**
 * Pure Team Allocation Function
 * Reuses `generateBalancedTeams` greedy rating-balance logic from `iamsujanstha/random-team-generator`
 * combined with unbiased pre-shuffling and strict headcount equality.
 */
export function computeBalancedTeamDraft({
  participants,
  teamNames,
  useRatings = false,
}) {
  const numTeams = Math.max(2, teamNames.length);
  const shuffled = shuffleUnbiased(participants);
  const ordered = useRatings
    ? [...shuffled].sort((a, b) => (b.rating || 1) - (a.rating || 1))
    : shuffled;

  const teams = teamNames.map((name, index) => ({
    teamIndex: index,
    teamName: name || `TEAM ${index + 1}`,
    palette: TEAM_PALETTE[index % TEAM_PALETTE.length],
    members: [],
    totalRating: 0,
  }));

  const draftQueue = [];

  ordered.forEach((participant, pickIndex) => {
    // Pick the team with the fewest members first; tie-break by lowest totalRating
    // (Preserves random-team-generator's totalRating balance while ensuring equal team sizes!)
    const candidateTeams = [...teams].sort((a, b) => {
      if (a.members.length !== b.members.length) {
        return a.members.length - b.members.length;
      }
      return a.totalRating - b.totalRating;
    });

    const targetTeam = candidateTeams[0];
    const memberRecord = {
      id: participant.id || `p-${pickIndex}`,
      name: participant.name,
      rating: Number(participant.rating) || 1,
      pickNumber: pickIndex + 1,
      teamIndex: targetTeam.teamIndex,
      teamName: targetTeam.teamName,
    };

    targetTeam.members.push(memberRecord);
    targetTeam.totalRating += memberRecord.rating;
    draftQueue.push(memberRecord);
  });

  // Interleave draft reveal order by round (Round 1: Team 1..K, Round 2: Team 1..K) for dramatic draft tension
  const maxMembers = Math.max(...teams.map(t => t.members.length), 0);
  const revealSequence = [];
  for (let round = 0; round < maxMembers; round += 1) {
    for (let t = 0; t < numTeams; t += 1) {
      const m = teams[t].members[round];
      if (m) {
        revealSequence.push({
          ...m,
          round: round + 1,
          orderIndex: revealSequence.length + 1,
        });
      }
    }
  }

  return {
    teams,
    revealSequence,
    totalParticipants: participants.length,
    useRatings,
  };
}

export default function TeamDraftGame({ onBack }) {
  const [rosterInput, setRosterInput] = useState(DEFAULT_ROSTER_TEXT);
  const [teamCount, setTeamCount] = useState(3);
  const [customTeamNames, setCustomTeamNames] = useState([
    'ALPHA 팀', 'BRAVO 팀', 'CHARLIE 팀', 'DELTA 팀',
    'ECHO 팀', 'FOXTROT 팀', 'GOLF 팀', 'HOTEL 팀',
  ]);
  const [useSkillBalance, setUseSkillBalance] = useState(false);
  const [ratingsMap, setRatingsMap] = useState({});

  // Separated states:
  // 1) Locked draw result (`draftPlan`)
  // 2) Animation state (`phase`: 'idle' | 'drafting' | 'completed', `revealedCount`)
  const [draftPlan, setDraftPlan] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [revealedCount, setRevealedCount] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [history, setHistory] = useState([]);

  const timerRef = useRef(null);

  const parsedParticipants = useMemo(() => {
    const raw = rosterInput
      .split(/[,\r\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
    return raw.map((entry, idx) => {
      // Allow optional "이름:점수" syntax or fallback to ratingsMap
      const match = entry.match(/^(.+?)\s*[:/]\s*([1-5])$/);
      const cleanName = match ? match[1].trim() : entry;
      const rating = match
        ? Number(match[2])
        : Number(ratingsMap[cleanName]) || 3;
      return {
        id: `member-${idx}-${cleanName}`,
        name: cleanName,
        rating: Math.max(1, Math.min(5, rating)),
      };
    });
  }, [rosterInput, ratingsMap]);

  const activeTeamNames = useMemo(
    () => Array.from({ length: teamCount }, (_, i) => customTeamNames[i] || `TEAM ${i + 1}`),
    [teamCount, customTeamNames]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const recordHistory = (plan) => {
    setHistory(prev => [
      {
        id: `draft-${Date.now()}`,
        time: formatDrawTime(),
        totalParticipants: plan.totalParticipants,
        teamCount: plan.teams.length,
        summary: plan.teams.map(t => `${t.teamName}(${t.members.length}명)`).join(' · '),
        teams: plan.teams,
      },
      ...prev.slice(0, 14),
    ]);
  };

  const handleStartDraft = () => {
    if (parsedParticipants.length < 2) return;
    if (timerRef.current) clearInterval(timerRef.current);

    // 1. Lock participants & compute full unbiased team assignment immediately
    const lockedPlan = computeBalancedTeamDraft({
      participants: parsedParticipants,
      teamNames: activeTeamNames,
      useRatings: useSkillBalance,
    });

    setDraftPlan(lockedPlan);
    setPhase('drafting');
    setRevealedCount(1);
    setCopyFeedback('');
    drawSound.playDraftPick();

    let currentCount = 1;
    const total = lockedPlan.revealSequence.length;

    if (total <= 1) {
      setPhase('completed');
      drawSound.playFanfare();
      recordHistory(lockedPlan);
      return;
    }

    timerRef.current = setInterval(() => {
      currentCount += 1;
      if (currentCount < total) {
        setRevealedCount(currentCount);
        drawSound.playDraftPick();
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRevealedCount(total);
        setPhase('completed');
        drawSound.playFanfare();
        recordHistory(lockedPlan);
      }
    }, 340);
  };

  const handleRevealAllNow = () => {
    if (!draftPlan) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRevealedCount(draftPlan.revealSequence.length);
    if (phase !== 'completed') {
      setPhase('completed');
      drawSound.playFanfare();
      recordHistory(draftPlan);
    }
  };

  const handleCopyResult = async () => {
    if (!draftPlan) return;
    const lines = draftPlan.teams.map((t) => {
      const names = t.members.map(m => (useSkillBalance ? `${m.name}(★${m.rating})` : m.name)).join(', ');
      return `[${t.teamName}] (${t.members.length}명): ${names}`;
    });
    const text = `🏆 [GAMEBOX TEAM DRAFT 결과]\n${lines.join('\n')}`;

    try {
      await navigator.clipboard?.writeText(text);
      setCopyFeedback('✓ 클립보드에 팀 배정 결과가 복사되었습니다!');
    } catch {
      setCopyFeedback('✓ 결과 텍스트가 생성되었습니다.');
    }
    setTimeout(() => setCopyFeedback(''), 3000);
  };

  const revealedSet = useMemo(() => {
    if (!draftPlan) return new Set();
    return new Set(
      draftPlan.revealSequence.slice(0, revealedCount).map(item => item.id)
    );
  }, [draftPlan, revealedCount]);

  const currentPick = useMemo(() => {
    if (!draftPlan || revealedCount <= 0) return null;
    return draftPlan.revealSequence[Math.min(revealedCount - 1, draftPlan.revealSequence.length - 1)] || null;
  }, [draftPlan, revealedCount]);

  return (
    <div className="rpz-game-shell" data-testid="game-team-draft">
      <header className="rpz-game-topbar">
        <div className="rpz-game-title-group">
          <button type="button" className="rpz-back-btn" onClick={onBack}>
            ← RANDOM PLAY ZONE
          </button>
          <div>
            <span className="rpz-game-Tag">GAME 03 · BALANCED TEAM GENERATOR</span>
            <h2>⚡ TEAM DRAFT — 팀 나누기</h2>
          </div>
        </div>

        <div className="rpz-top-actions">
          {phase === 'idle' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-primary"
              data-testid="draft-start-btn"
              onClick={handleStartDraft}
              disabled={parsedParticipants.length < 2}
            >
              🎯 드래프트 추첨 시작
            </button>
          )}
          {phase === 'drafting' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-accent"
              data-testid="draft-skip-btn"
              onClick={handleRevealAllNow}
            >
              ⚡ 전원 즉시 공개 ({revealedCount}/{draftPlan?.totalParticipants || 0})
            </button>
          )}
          {phase === 'completed' && (
            <>
              <button
                type="button"
                className="rpz-btn rpz-btn-primary"
                data-testid="draft-reroll-btn"
                onClick={handleStartDraft}
              >
                🔄 팀 재추첨
              </button>
              <button
                type="button"
                className="rpz-btn rpz-btn-accent"
                data-testid="draft-copy-btn"
                onClick={handleCopyResult}
              >
                📋 결과 복사
              </button>
            </>
          )}
          {phase !== 'idle' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-ghost"
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                setPhase('idle');
                setDraftPlan(null);
                setRevealedCount(0);
              }}
            >
              명단 편집으로
            </button>
          )}
        </div>
      </header>

      <div className="rpz-game-workspace">
        <section className="rpz-stage-panel">
          <div className="rpz-stage-status-bar">
            <span className={`rpz-phase-pill phase-${phase}`} data-testid="draft-phase-badge">
              {phase === 'idle' && `대기 중 — 총 ${parsedParticipants.length}명을 ${teamCount}개 팀으로 균등 배정합니다`}
              {phase === 'drafting' && `LIVE DRAFT PICK #${revealedCount} / ${draftPlan?.totalParticipants} — 한 명씩 팀을 호명하는 중...`}
              {phase === 'completed' && `드래프트 완료! 총 ${draftPlan?.totalParticipants}명 · ${draftPlan?.teams.length}개 팀 균등 배정 확정`}
            </span>
            {copyFeedback && (
              <span className="rpz-copy-toast" data-testid="draft-copy-toast">
                {copyFeedback}
              </span>
            )}
          </div>

          {/* Live Spotlight Banner during / after draft */}
          {currentPick && (
            <div className="rpz-draft-spotlight" data-testid="draft-spotlight">
              <div className="rpz-spotlight-badge">
                {phase === 'drafting' ? `LIVE PICK #${currentPick.orderIndex}` : 'FINAL PICK'}
              </div>
              <div className="rpz-spotlight-main">
                <span className="rpz-spotlight-player">{currentPick.name}</span>
                <span className="rpz-spotlight-arrow">➔</span>
                <strong
                  className="rpz-spotlight-team"
                  style={{ color: TEAM_PALETTE[currentPick.teamIndex % TEAM_PALETTE.length].color }}
                >
                  {currentPick.teamName}
                </strong>
              </div>
              <div className="rpz-spotlight-progress">
                <div
                  className="rpz-spotlight-bar"
                  style={{
                    width: `${Math.round((revealedCount / (draftPlan?.totalParticipants || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Teams Grid */}
          <div className="rpz-teams-board" data-testid="draft-teams-board">
            {(draftPlan ? draftPlan.teams : activeTeamNames.map((name, i) => ({
              teamIndex: i,
              teamName: name,
              palette: TEAM_PALETTE[i % TEAM_PALETTE.length],
              members: [],
              totalRating: 0,
            }))).map((team) => {
              const visibleMembers = draftPlan
                ? team.members.filter(m => revealedSet.has(m.id))
                : [];
              const visibleRating = visibleMembers.reduce((acc, m) => acc + (m.rating || 1), 0);

              return (
                <div
                  key={team.teamIndex}
                  className="rpz-team-column"
                  data-testid={`draft-team-card-${team.teamIndex}`}
                  style={{
                    borderColor: team.palette.color,
                    background: team.palette.bg,
                  }}
                >
                  <div className="rpz-team-header">
                    <div>
                      <span className="rpz-team-code" style={{ color: team.palette.color }}>
                        TEAM 0{team.teamIndex + 1}
                      </span>
                      <h3>{team.teamName}</h3>
                    </div>
                    <div className="rpz-team-meta">
                      <span className="rpz-team-count">{visibleMembers.length}명</span>
                      {useSkillBalance && (
                        <span className="rpz-team-rating">★ {visibleRating}</span>
                      )}
                    </div>
                  </div>

                  <ul className="rpz-team-member-list">
                    {visibleMembers.length === 0 ? (
                      <li className="rpz-team-placeholder">
                        {phase === 'idle' ? '드래프트 대기 중' : '호명 대기 중...'}
                      </li>
                    ) : (
                      visibleMembers.map((member, mIdx) => (
                        <li
                          key={member.id}
                          className={`rpz-team-member-item ${currentPick?.id === member.id && phase === 'drafting' ? 'just-picked' : ''}`}
                        >
                          <span className="rpz-member-order">#{mIdx + 1}</span>
                          <strong className="rpz-member-name">{member.name}</strong>
                          {useSkillBalance && (
                            <span className="rpz-member-tier">★{member.rating}</span>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="rpz-sidebar-panel">
          <div className="rpz-card">
            <h3>1. 참가자 명단 등록 ({parsedParticipants.length}명)</h3>
            <textarea
              className="rpz-textarea"
              rows={4}
              value={rosterInput}
              disabled={phase === 'drafting'}
              onChange={e => setRosterInput(e.target.value)}
              placeholder="쉼표(,) 또는 줄바꿈으로 이름 입력 (예: 김성민, 이지훈, 박수진)"
              data-testid="draft-roster-input"
            />
            <div className="rpz-preset-row">
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'drafting'}
                onClick={() => setRosterInput(DEFAULT_ROSTER_TEXT)}
              >
                12인 기본
              </button>
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'drafting'}
                onClick={() => setRosterInput('김성민:5, 이지훈:5, 박수진:4, 최민호:4, 정하늘:3, 강동원:3, 윤서연:2, 한지민:2')}
              >
                8인 실력밸런스
              </button>
              <button
                type="button"
                className="rpz-btn-xs"
                disabled={phase === 'drafting'}
                onClick={() => setRosterInput('김성민, 이지훈, 박수진, 최민호, 정하늘, 강동원, 윤서연, 한지민, 오승환, 배수지, 류현진, 손흥민, 박지성, 김연아, 이상혁, 정지훈')}
              >
                16인 토너먼트
              </button>
            </div>
          </div>

          <div className="rpz-card">
            <h3>2. 팀 수 및 밸런스 설정</h3>
            <label className="rpz-field">
              <span>팀 개수 설정 (2 ~ 8팀)</span>
              <div className="rpz-team-count-selector">
                {[2, 3, 4, 5, 6].map(n => (
                  <button
                    key={n}
                    type="button"
                    disabled={phase === 'drafting'}
                    data-testid={`draft-team-count-${n}`}
                    className={`rpz-count-btn ${teamCount === n ? 'active' : ''}`}
                    onClick={() => setTeamCount(n)}
                  >
                    {n}팀
                  </button>
                ))}
              </div>
            </label>

            <div className="rpz-team-names-grid">
              {Array.from({ length: teamCount }, (_, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="rpz-input rpz-input-sm"
                  value={customTeamNames[idx] || ''}
                  disabled={phase === 'drafting'}
                  placeholder={`TEAM ${idx + 1}`}
                  onChange={(e) => {
                    const next = [...customTeamNames];
                    next[idx] = e.target.value;
                    setCustomTeamNames(next);
                  }}
                />
              ))}
            </div>

            <label className="rpz-check-row">
              <input
                type="checkbox"
                checked={useSkillBalance}
                disabled={phase === 'drafting'}
                onChange={e => setUseSkillBalance(e.target.checked)}
              />
              <span>실력 점수(★1~5) 균등 배분 활성화 (이름:점수 지원)</span>
            </label>

            {useSkillBalance && (
              <div className="rpz-rating-editor">
                {parsedParticipants.slice(0, 12).map(p => (
                  <div key={p.id} className="rpz-rating-row">
                    <span>{p.name}</span>
                    <div className="rpz-star-group">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          className={`rpz-star-btn ${p.rating >= star ? 'lit' : ''}`}
                          onClick={() => setRatingsMap(prev => ({ ...prev, [p.name]: star }))}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rpz-card">
            <h3>3. 드래프트 기록 ({history.length})</h3>
            {history.length === 0 ? (
              <p className="rpz-empty">아직 팀 추첨 기록이 없습니다.</p>
            ) : (
              <ul className="rpz-history-list" data-testid="draft-history-list">
                {history.map(item => (
                  <li key={item.id}>
                    <div className="rpz-history-head">
                      <strong>{item.teamCount}개 팀 ({item.totalParticipants}명)</strong>
                      <small>{item.time}</small>
                    </div>
                    <small>{item.summary}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rpz-license-box">
            <small>
              <strong>오픈소스 라이선스 고지:</strong> 팀 균등 배정 엔진 <code>iamsujanstha/random-team-generator</code> (MIT License, Copyright © 2025 Sujan Shrestha) 재사용 · 한 명씩 드래프트 공개 연출 및 클립보드 복사 통합.
            </small>
          </div>
        </aside>
      </div>
    </div>
  );
}
