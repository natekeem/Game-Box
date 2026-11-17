import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ARCADE_GAMES } from '../registry/arcadeGames.js';
import { GAME_DECK_CATEGORIES, filterDeckGames } from './gameDeckConfig.js';
import GameLauncher from '../runtime/GameLauncher.js';
import GameCaseCard from './cases/GameCaseCard.jsx';
import { ensureCaseStyle } from './cases/FinallyCaseEngine.js';
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
            왼쪽 진열대에서 CD 케이스를 선택하고 PLAY를 누르면 3D 케이스가 개방되어 PS2 콘솔 트레이로 디스크가 장착됩니다.
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
              const isSelected = selectedGame && game.id === selectedGame.id;
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
                <span className={`gb-console-led ${isPlaying ? 'on' : 'standby'}`} />
                <span className="gb-console-model">
                  TOOL-BOX ARCADE DECK // {selectedGame ? selectedGame.discLabel : 'PS2 SYSTEM STANDBY'}
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
                        : 'ARCADE 20 COLLECTION · SELECTION MODE'}
                    </span>
                    <h3>{selectedGame?.name || '게임 CD 케이스를 선택하세요'}</h3>
                    <p>
                      {selectedGame?.description || '진열대에서 게임을 고르고 PLAY를 누르면 CD가 케이스에서 나와 콘솔에 들어갑니다.'}
                    </p>
                    <div className="gb-console-action-row">
                      <button
                        type="button"
                        className="gb-btn-insert-play"
                        onClick={handleInsertAndPlay}
                        disabled={!selectedGame || isMovingDisc}
                      >
                        {selectedGame ? '▶ PLAY' : 'CD 케이스를 먼저 선택해주세요'}
                      </button>
                      {selectedGame && (
                        <a
                          href={selectedGame.multiplayerUrl || selectedGame.launchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gb-btn-standalone"
                        >
                          ↗ 독립 창으로 열기
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT — GAME RANKING & TECHNICAL SPEC */}
        <aside className="gb-deck-ranking-zone">
          <div className="gb-deck-panel-header">
            <h2>GAME RANKING &amp; SPEC</h2>
            <span className="gb-deck-badge">TOP 10</span>
          </div>

          {selectedGame ? (
            <>
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
            </>
          ) : (
            <div className="gb-deck-ranking-box">
              <h3>🏆 실시간 랭킹 &amp; 사양</h3>
              <div className="gb-deck-empty" style={{ padding: '36px 16px', lineHeight: 1.7 }}>
                왼쪽 진열대에서 원하는 <strong>게임 CD 케이스</strong>를 선택하면<br />
                해당 게임의 공식 사양 정보와 실시간 TOP 10 랭킹이 표시됩니다.
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
