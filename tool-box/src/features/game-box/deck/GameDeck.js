import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ARCADE_GAMES } from '../registry/arcadeGames.js';
import { GAME_DECK_CATEGORIES, filterDeckGames, PORTED_3D_ENGINES } from './gameDeckConfig.js';
import GameLauncher from '../runtime/GameLauncher.js';
import GameCaseCard from './cases/GameCaseCard.jsx';
import { ensureCaseStyle, lookFor, runInsert } from './cases/FinallyCaseEngine.js';
import { generateArcadeCoverSvg } from './cases/gameCoverGenerator.js';
import ConsoleView3D from './console/ConsoleView3D.jsx';

function playCrtSound(type = 'power-on') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const t = ctx.currentTime;
    if (type === 'power-on') {
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(1200, t);
      click.frequency.exponentialRampToValueAtTime(120, t + 0.03);
      clickGain.gain.setValueAtTime(0.3, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(t);
      click.stop(t + 0.04);

      const hum = ctx.createOscillator();
      const humGain = ctx.createGain();
      hum.type = 'sine';
      hum.frequency.setValueAtTime(180, t + 0.02);
      hum.frequency.exponentialRampToValueAtTime(60, t + 0.35);
      humGain.gain.setValueAtTime(0.2, t + 0.02);
      humGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      hum.connect(humGain);
      humGain.connect(ctx.destination);
      hum.start(t + 0.02);
      hum.stop(t + 0.4);
    } else {
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'square';
      click.frequency.setValueAtTime(800, t);
      click.frequency.exponentialRampToValueAtTime(80, t + 0.04);
      clickGain.gain.setValueAtTime(0.25, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(t);
      click.stop(t + 0.05);
    }
    setTimeout(() => { try { ctx.close(); } catch {} }, 600);
  } catch {}
}

/**
 * GAME DECK (/game-box/deck)
 * Single Open-Source Base Transition Architecture (Channel 3 CRT TV & Retro Cartridge System)
 * - LEFT: GAME COLLECTION (Cartridge Deck with physical spine, thickness, gloss, wear)
 * - CENTER: GAME CONSOLE (Channel 3 Unified CRT TV & Cartridge host, power relay, iframe launcher)
 * - RIGHT: GAME RANKING & TECHNICAL SPEC (Realtime TOP 10 + Game Metadata)
 */
export default function GameDeck({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState(ARCADE_GAMES[0].id);
  const [animState, setAnimState] = useState('selected'); // idle, selected, opening, extracting, inserting, booting, ready, playing, ejecting, returning
  const [deckRankings, setDeckRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const consoleRef = useRef(null);
  const consoleContainerRef = useRef(null);

  const visibleGames = useMemo(
    () => filterDeckGames(selectedCategory, searchQuery),
    [selectedCategory, searchQuery]
  );

  const selectedGame = useMemo(
    () => ARCADE_GAMES.find(g => g.id === selectedGameId) || ARCADE_GAMES[0],
    [selectedGameId]
  );

  // Initialize Finally 3D Game Cases CSS stylesheet on mount
  useEffect(() => {
    ensureCaseStyle(document);
  }, []);

  // Fetch rankings for selected game
  useEffect(() => {
    let cancelled = false;
    setLoadingRankings(true);
    fetch(`/api/platform/rankings?gameId=${encodeURIComponent(selectedGame.id)}&includePractice=true`, {
      cache: 'no-store',
    })
      .then(res => (res.ok ? res.json() : { individual: [] }))
      .then(data => {
        if (cancelled) return;
        setDeckRankings(Array.isArray(data.individual) ? data.individual.slice(0, 10) : []);
        setLoadingRankings(false);
      })
      .catch(() => {
        if (cancelled) return;
        setDeckRankings([]);
        setLoadingRankings(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedGame.id]);

  // Handle case selection
  const handleSelectCase = async (gameId) => {
    if (['opening', 'extracting', 'inserting', 'ejecting'].includes(animState)) {
      return; // prevent race condition mid-animation
    }

    if (gameId === selectedGameId) return;

    if (animState === 'playing' || animState === 'ready') {
      await handleEjectAndStop();
    }

    setSelectedGameId(gameId);
    setAnimState('selected');
  };

  // Channel 3 Unified Boot Sequence: CRT power relay -> raster warmup -> iframe launch
  // Completely eliminates the fragmented 2D slot-bezel and floating hole defect!
  const handleInsertAndPlay = async () => {
    if (['booting', 'playing', 'ejecting'].includes(animState)) return;

    setAnimState('booting');

    if (soundEnabled) {
      playCrtSound('power-on');
    }

    if (consoleRef.current) {
      await consoleRef.current.insertDisc(selectedGame);
      await consoleRef.current.setPower(true);
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      await new Promise(r => setTimeout(r, 450));
    }

    setAnimState('playing');
  };

  // Channel 3 Unified Power-Off Sequence: CRT beam collapse -> clean return to cartridge shelf
  const handleEjectAndStop = async () => {
    if (['booting', 'ejecting'].includes(animState)) return;

    setAnimState('ejecting');

    if (soundEnabled) {
      playCrtSound('power-off');
    }

    if (consoleRef.current) {
      await consoleRef.current.ejectDisc();
      await consoleRef.current.setPower(false);
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      await new Promise(r => setTimeout(r, 350));
    }

    setAnimState('selected');
  };

  const isPowerOn = animState === 'playing' || animState === 'booting' || animState === 'ready';

  return (
    <div className="gb-deck-shell">
      {/* Subbar Navigation */}
      <div className="gb-subbar gb-subbar-dark">
        <div className="gb-subbar-left">
          <button
            type="button"
            className="gb-subbar-back"
            onClick={() => onNavigate && onNavigate('/game-box')}
          >
            &larr; GAME-BOX 홈으로
          </button>
          <span className="gb-subbar-divider">|</span>
          <strong className="gb-subbar-title">GAME DECK — ARCADE 20 COLLECTION</strong>
          <span className="gb-subbar-hint">
            3D 입체 게임팩을 선택하고 콘솔 트레이에 디스크를 장착하여 게임을 실행하세요.
          </span>
        </div>
        <div className="gb-subbar-actions">
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="효과음 켜기 / 끄기"
          >
            {soundEnabled ? '🔊 SFX ON' : '🔇 MUTE'}
          </button>
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/game-box/deck-lab-single/';
              }
            }}
            title="Channel 3 단일 오픈소스 원본 독립 실행실"
          >
            📺 SINGLE LAB (Channel 3)
          </button>
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => onNavigate && onNavigate('/game-box/deck-lab')}
            title="독립된 개발용 3D 케이스 엔진 테스트 환경"
          >
            🧪 DECK LAB 이동
          </button>
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => onNavigate && onNavigate('/game-box/retro')}
          >
            🪟 RETRO DESKTOP
          </button>
        </div>
      </div>

      <div className="gb-deck-grid">
        {/* LEFT — GAME COLLECTION (3D Game Cases on Shelf) */}
        <aside className="gb-deck-collection" data-testid="deck-collection-zone">
          <div className="gb-deck-panel-header">
            <h2>GAME COLLECTION</h2>
            <span className="gb-deck-badge">{visibleGames.length} 3D PACKS</span>
          </div>

          <div className="gb-deck-filters">
            <div className="gb-deck-cat-row">
              {GAME_DECK_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`gb-deck-cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              className="gb-deck-search"
              placeholder="게임팩 이름, 코드, 장르 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 3D Case Shelf Container */}
          <div className="gb-3d-shelf-container" data-sanso-stage="big">
            {visibleGames.map(game => {
              const isSelected = game.id === selectedGame.id;
              return (
                <div key={game.id} className="gb-shelf-item-wrap">
                  <GameCaseCard
                    game={game}
                    isSelected={isSelected}
                    onClick={() => handleSelectCase(game.id)}
                    width={130}
                    height={195}
                    className={`deck-case-${game.id}`}
                  />
                  <div className="gb-shelf-item-label">
                    <span className="gb-shelf-item-code">{game.discLabel}</span>
                    <strong className="gb-shelf-item-title">{game.name}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER — GAME CONSOLE (Three.js 3D Console & Game Screen) */}
        <section className="gb-deck-console-zone" data-testid="deck-console-zone">
          <div className="gb-console-unit">
            {/* Console Hardware Topbar */}
            <div className="gb-console-hardware-bar">
              <div className="gb-console-led-group">
                <span className={`gb-console-led ${isPowerOn ? 'on' : 'standby'}`} />
                <span className="gb-console-model">
                  TOOL-BOX ARCADE DECK // {selectedGame.discLabel}
                </span>
              </div>
              <div className="gb-console-state-badge">
                상태: <strong>{animState.toUpperCase()}</strong>
              </div>
              <div className="gb-console-slot-status">
                {animState === 'playing'
                  ? 'DISC INSERTED · RUNNING'
                  : animState === 'inserting'
                  ? 'INSERTING DISC...'
                  : animState === 'ejecting'
                  ? 'EJECTING DISC...'
                  : animState === 'booting'
                  ? 'BOOTING ARCADE MATRIX...'
                  : 'READY TO INSERT PACK'}
              </div>
            </div>

            {/* Main Stage: Interactive Screen vs 3D Console Engine */}
            <div className="gb-console-screen" ref={consoleContainerRef}>
              {animState === 'playing' ? (
                <GameLauncher
                  title={selectedGame.name}
                  src={selectedGame.launchUrl}
                  aspectRatio={selectedGame.aspectRatio}
                  game={selectedGame}
                  onClose={handleEjectAndStop}
                />
              ) : (
                <div className="gb-console-3d-stage-wrapper">
                  {/* Three.js 3D Console Model */}
                  <div className="gb-console-threejs-container">
                    <ConsoleView3D ref={consoleRef} />
                  </div>

                  {/* Overlaid Console Interaction Deck */}
                  <div className="gb-console-overlay-panel">
                    <div className="gb-console-preview-card">
                      <span className="gb-preview-kicker">
                        {selectedGame.genre} · {selectedGame.playersLabel} · {selectedGame.discLabel}
                      </span>
                      <h3>{selectedGame.name}</h3>
                      <p>{selectedGame.description}</p>

                      <div className="gb-console-action-row">
                        <button
                          type="button"
                          className="gb-btn-insert-play"
                          onClick={handleInsertAndPlay}
                          disabled={['opening', 'extracting', 'inserting', 'ejecting'].includes(animState)}
                        >
                          ▶ PLAY (3D 디스크 트레이 삽입 및 콘솔 구동)
                        </button>
                        {animState === 'ready' && (
                          <button
                            type="button"
                            className="gb-btn-eject-deck"
                            onClick={handleEjectAndStop}
                          >
                            ⏏ 디스크 배출
                          </button>
                        )}
                        <a
                          href={selectedGame.multiplayerUrl || selectedGame.launchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gb-btn-standalone"
                        >
                          ↗ 독립 창으로 열기
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT — GAME RANKING & TECHNICAL SPEC */}
        <aside className="gb-deck-ranking-zone">
          <div className="gb-deck-panel-header">
            <h2>GAME RANKING &amp; SPEC</h2>
            <span className="gb-deck-badge">TOP 10</span>
          </div>

          <div className="gb-deck-spec-card">
            <div className="gb-spec-row">
              <span>게임명</span>
              <strong>{selectedGame.name}</strong>
            </div>
            <div className="gb-spec-row">
              <span>디스크 식별자</span>
              <code>{selectedGame.discLabel}</code>
            </div>
            <div className="gb-spec-row">
              <span>플레이 인원</span>
              <strong>{selectedGame.playersLabel}</strong>
            </div>
            <div className="gb-spec-row">
              <span>화면 비율 / 입력</span>
              <strong>{selectedGame.aspectRatio} · {selectedGame.inputDevices.join(', ')}</strong>
            </div>
            <div className="gb-spec-row">
              <span>실행 URL</span>
              <code>{selectedGame.launchUrl}</code>
            </div>
            <div className="gb-spec-row">
              <span>기록 연동</span>
              <span>{selectedGame.eventSupport}</span>
            </div>
          </div>

          <div className="gb-deck-ranking-box">
            <h3>🏆 {selectedGame.name} TOP 10</h3>
            {loadingRankings ? (
              <div className="gb-deck-empty">랭킹 데이터를 불러오는 중...</div>
            ) : deckRankings.length === 0 ? (
              <div className="gb-deck-empty">
                아직 이 게임의 대전 완료 기록이 없습니다.<br />
                게임을 플레이하면 순위가 집계됩니다.
              </div>
            ) : (
              <table className="gb-deck-table">
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>플레이어</th>
                    <th>승/패</th>
                    <th>최고점</th>
                  </tr>
                </thead>
                <tbody>
                  {deckRankings.map((row, idx) => (
                    <tr key={row.userId || idx}>
                      <td>#{idx + 1}</td>
                      <td>{row.name}</td>
                      <td>{row.wins}승 {row.losses}패</td>
                      <td>{Math.round(row.bestScore || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
