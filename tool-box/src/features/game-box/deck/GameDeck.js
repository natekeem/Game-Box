import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ARCADE_GAMES } from '../registry/arcadeGames.js';
import { GAME_DECK_CATEGORIES, filterDeckGames } from './gameDeckConfig.js';
import GameLauncher from '../runtime/GameLauncher.js';
import GameCaseCard from './cases/GameCaseCard.jsx';
import { ensureCaseStyle } from './cases/FinallyCaseEngine.js';
import ConsoleView3D from './console/ConsoleView3D.jsx';
import './arcadeDeck.css';

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

const shouldAnimateDisc = () => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function GameDeck({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [animState, setAnimState] = useState('selected');
  const [deckRankings, setDeckRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const consoleRef = useRef(null);
  const rankingRef = useRef(null);
  const isPlaying = animState === 'playing';
  const isMovingDisc = animState === 'inserting' || animState === 'ejecting';

  const visibleGames = useMemo(
    () => filterDeckGames(selectedCategory, searchQuery),
    [selectedCategory, searchQuery]
  );

  const selectedGame = useMemo(
    () => (selectedGameId ? ARCADE_GAMES.find(g => g.id === selectedGameId) || null : null),
    [selectedGameId]
  );

  // Initialize Finally 3D Game Cases CSS stylesheet on mount
  useEffect(() => {
    ensureCaseStyle(document);
  }, []);

  // Fetch rankings for selected game
  useEffect(() => {
    if (!selectedGame) {
      setDeckRankings([]);
      setLoadingRankings(false);
      return;
    }
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
  }, [selectedGame ? selectedGame.id : null]);

  // Handle case selection
  const handleSelectCase = async (gameId) => {
    if (isMovingDisc || gameId === selectedGameId) return;
    if (isPlaying) await handleEjectAndStop();

    setSelectedGameId(gameId);
    setAnimState('selected');
  };

  const handleInsertAndPlay = async () => {
    if (!selectedGame || isPlaying || isMovingDisc) return;

    setAnimState('inserting');

    if (soundEnabled) {
      playCrtSound('power-on');
    }

    await consoleRef.current?.insertDisc(selectedGame, { animate: shouldAnimateDisc() });
    setAnimState('playing');
  };

  const handleEjectAndStop = async () => {
    if (!isPlaying) return;

    setAnimState('ejecting');

    if (soundEnabled) {
      playCrtSound('power-off');
    }

    await consoleRef.current?.ejectDisc({ animate: shouldAnimateDisc() });
    setAnimState('selected');
  };

  return (
    <div className="gb-deck-shell">
      <div className="gb-deck-grid">
        {/* LEFT — GAME COLLECTION (3D Game Cases on Shelf) */}
        <aside className="gb-deck-collection" data-testid="deck-collection-zone">
          <div className="gb-deck-panel-header">
            <div>
              <h2>게임 케이스</h2>
              <span className="gb-deck-badge">{visibleGames.length} GAMES</span>
            </div>
            <button
              type="button"
              className="gb-sfx-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="효과음 켜기 / 끄기"
            >
              {soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
            </button>
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
              placeholder="게임 검색"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 3D Case Shelf Container */}
          <div className="gb-3d-shelf-container" data-sanso-stage="big">
            {visibleGames.map(game => {
              const isSelected = selectedGame && game.id === selectedGame.id;
              return (
                <div key={game.id} className={`gb-shelf-item-wrap ${isSelected ? 'is-selected' : ''}`}>
                  <GameCaseCard
                    game={game}
                    isSelected={isSelected}
                    onClick={() => handleSelectCase(game.id)}
                    width={92}
                    height={138}
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
                <span className={`gb-console-led ${isPlaying ? 'on' : 'standby'}`} />
                <span className="gb-console-model">
                  GAME-BOX ARCADE // {selectedGame ? selectedGame.discLabel : 'PS2 READY'}
                </span>
              </div>
              <div className="gb-console-state-badge">
                상태: <strong>{animState === 'selected' && !selectedGame ? 'STANDBY' : animState.toUpperCase()}</strong>
              </div>
              <div className="gb-console-slot-status">
                {animState === 'playing'
                  ? 'DISC INSERTED · RUNNING'
                  : animState === 'inserting'
                  ? '3D CASE OPENING & INSERTING DISC...'
                  : animState === 'ejecting'
                  ? 'EJECTING DISC TO 3D CASE...'
                  : !selectedGame
                  ? 'WAITING FOR GAME SELECTION'
                  : 'READY TO INSERT PACK'}
              </div>
            </div>

            <div className="gb-console-screen">
              {isPlaying && selectedGame && (
                <GameLauncher
                  title={selectedGame.name}
                  src={selectedGame.launchUrl}
                  aspectRatio={selectedGame.aspectRatio}
                  game={selectedGame}
                  onClose={handleEjectAndStop}
                />
              )}
              <div className="gb-console-3d-stage-wrapper" hidden={isPlaying}>
                <div className="gb-console-threejs-container">
                  <ConsoleView3D ref={consoleRef} game={selectedGame} />
                </div>
                <div className="gb-console-overlay-panel">
                  <div className="gb-console-preview-card">
                    <span className="gb-preview-kicker">
                      {selectedGame
                        ? `${selectedGame.genre} · ${selectedGame.playersLabel} · ${selectedGame.discLabel}`
                        : 'ARCADE 19 COLLECTION · SELECTION MODE'}
                    </span>
                    <h3>{selectedGame?.name || '게임 CD 케이스를 선택하세요'}</h3>
                    <p>
                      {selectedGame?.description || '진열대에서 게임을 고르고 PLAY를 누르면 CD가 케이스에서 나와 콘솔에 들어갑니다.'}
                    </p>
                    <div className="gb-console-action-row">
                      {selectedGame && (
                        <button
                          type="button"
                          className="gb-btn-standalone"
                          onClick={() => rankingRef.current?.showModal()}
                        >
                          순위 보기
                        </button>
                      )}
                      <button
                        type="button"
                        className="gb-btn-insert-play"
                        onClick={handleInsertAndPlay}
                        disabled={!selectedGame || isMovingDisc}
                      >
                        {selectedGame ? '▶ PLAY (대기실 입장)' : 'CD 케이스를 먼저 선택해주세요'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>

      <dialog className="gb-arcade-ranking-dialog" ref={rankingRef}>
        <form method="dialog">
          <button type="submit" className="gb-launcher-btn">닫기</button>
        </form>
        <h2>{selectedGame?.name} TOP 10</h2>
        {loadingRankings ? (
          <p>순위를 불러오는 중이에요.</p>
        ) : deckRankings.length ? (
          <table className="gb-deck-table">
            <thead><tr><th>순위</th><th>플레이어</th><th>승/패</th><th>최고 점수</th></tr></thead>
            <tbody>
              {deckRankings.map((row, index) => (
                <tr key={row.userId || index}>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.wins}승 {row.losses}패</td>
                  <td>{Math.round(row.bestScore || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>아직 등록된 기록이 없어요.</p>
        )}
      </dialog>
    </div>
  );
}
