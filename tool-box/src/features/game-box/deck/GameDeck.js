import React, { useState, useEffect, useMemo } from 'react';
import { ARCADE_GAMES } from '../registry/arcadeGames.js';
import { GAME_DECK_CATEGORIES, filterDeckGames } from './gameDeckConfig.js';
import GameLauncher from '../runtime/GameLauncher.js';

/**
 * GAME DECK (/game-box/deck)
 * 3-Column Console Architecture:
 * - LEFT: GAME COLLECTION (Game Cases / Cartridges)
 * - CENTER: GAME CONSOLE (Main Display + Disc Slot + On-demand Iframe Launcher)
 * - RIGHT: GAME RANKING & SPEC (TOP 10 + Game Metadata)
 */
export default function GameDeck({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState(ARCADE_GAMES[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deckRankings, setDeckRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);

  const visibleGames = useMemo(
    () => filterDeckGames(selectedCategory, searchQuery),
    [selectedCategory, searchQuery]
  );

  const selectedGame = useMemo(
    () => ARCADE_GAMES.find(g => g.id === selectedGameId) || ARCADE_GAMES[0],
    [selectedGameId]
  );

  // Stop running iframe when user switches to a different game case
  const handleSelectCase = (gameId) => {
    if (gameId !== selectedGameId) {
      setIsPlaying(false);
      setSelectedGameId(gameId);
    }
  };

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

  return (
    <div className="gb-deck-shell">
      <div className="gb-subbar gb-subbar-dark">
        <div className="gb-subbar-left">
          <button
            type="button"
            className="gb-subbar-back"
            onClick={() => onNavigate('/game-box')}
          >
            &larr; GAME-BOX 홈으로
          </button>
          <span className="gb-subbar-divider">|</span>
          <strong className="gb-subbar-title">GAME DECK — ARCADE COLLECTION</strong>
          <span className="gb-subbar-hint">
            왼쪽 컬렉션에서 게임 케이스를 선택하고 콘솔의 [PLAY / 디스크 삽입] 버튼을 누르세요.
          </span>
        </div>
        <div className="gb-subbar-actions">
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => onNavigate('/game-box/retro')}
          >
            🪟 RETRO DESKTOP 이동
          </button>
        </div>
      </div>

      <div className="gb-deck-grid">
        {/* LEFT — GAME COLLECTION (Game Cases) */}
        <aside className="gb-deck-collection">
          <div className="gb-deck-panel-header">
            <h2>GAME COLLECTION</h2>
            <span className="gb-deck-badge">{visibleGames.length} CASES</span>
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

          <div className="gb-case-shelf">
            {visibleGames.map(game => {
              const isSelected = game.id === selectedGame.id;
              return (
                <button
                  key={game.id}
                  type="button"
                  className={`gb-game-case ${isSelected ? 'selected' : ''}`}
                  style={{ '--case-accent': game.caseColor }}
                  onClick={() => handleSelectCase(game.id)}
                >
                  <div className="gb-case-spine">
                    <span className="gb-case-code">{game.discLabel}</span>
                  </div>
                  <div className="gb-case-body">
                    <div className="gb-case-top">
                      <span className="gb-case-genre">{game.genre}</span>
                      <span className="gb-case-players">{game.playersLabel}</span>
                    </div>
                    <strong className="gb-case-title">{game.name}</strong>
                    <span className="gb-case-sub">{game.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* CENTER — GAME CONSOLE */}
        <section className="gb-deck-console-zone">
          <div className="gb-console-unit">
            <div className="gb-console-hardware-bar">
              <div className="gb-console-led-group">
                <span className={`gb-console-led ${isPlaying ? 'on' : 'standby'}`} />
                <span className="gb-console-model">TOOL-BOX ARCADE DECK // {selectedGame.discLabel}</span>
              </div>
              <div className="gb-console-slot-status">
                {isPlaying ? 'DISC INSERTED · RUNNING' : 'READY TO INSERT PACK'}
              </div>
            </div>

            <div className="gb-console-screen">
              {isPlaying ? (
                <GameLauncher
                  title={selectedGame.name}
                  src={selectedGame.launchUrl}
                  aspectRatio={selectedGame.aspectRatio}
                  game={selectedGame}
                  onClose={() => setIsPlaying(false)}
                />
              ) : (
                <div className="gb-console-preview">
                  <div className="gb-console-disc-preview" style={{ '--case-accent': selectedGame.caseColor }}>
                    <div className="gb-disc-ring">
                      <span className="gb-disc-code">{selectedGame.discLabel}</span>
                      <strong>{selectedGame.name}</strong>
                      <span>{selectedGame.genre}</span>
                    </div>
                  </div>

                  <div className="gb-console-preview-info">
                    <span className="gb-preview-kicker">{selectedGame.genre} · {selectedGame.playersLabel}</span>
                    <h3>{selectedGame.name}</h3>
                    <p>{selectedGame.description}</p>

                    <div className="gb-console-action-row">
                      <button
                        type="button"
                        className="gb-btn-insert-play"
                        onClick={() => setIsPlaying(true)}
                      >
                        ▶ PLAY (게임팩 삽입 및 즉시 실행)
                      </button>
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
