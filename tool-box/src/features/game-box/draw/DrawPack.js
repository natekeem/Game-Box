import React, { useState, useEffect } from 'react';
import { DRAW_GAMES } from '../registry/drawGames.js';
import GameLauncher from '../runtime/GameLauncher.js';
import BombLadderGame from './games/BombLadderGame.jsx';
import Lotto3DGame from './games/Lotto3DGame.jsx';
import TeamDraftGame from './games/TeamDraftGame.jsx';
import ChaosWheelGame from './games/ChaosWheelGame.jsx';
import MysteryBoxGame from './games/MysteryBoxGame.jsx';
import './randomPlayZone.css';

/**
 * Original Marble Roulette Preview Artwork (Restored 100% intact)
 */
export function MarbleDisplay() {
  return (
    <svg className="gb-marble-display" viewBox="0 0 860 480" role="img" aria-label="마블 룰렛 실제 게임 화면 기반 레이스 미리보기">
      <defs>
        <filter id="neon-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2"/>
          <feMerge>
            <feMergeNode in="blur1"/>
            <feMergeNode in="blur2"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="wall-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ─── 1. Background ─── */}
      <rect width="860" height="480" fill="#000000"/>

      {/* ─── 2. Left Vertical Minimap Panel ─── */}
      <g>
        <rect x="0" y="0" width="124" height="480" fill="#282828"/>
        <path d="M60 0 L60 22 L36 55 L36 90 L68 125 L68 160 L28 200 L28 245 L60 285 L60 355 L42 405 L42 480"
          fill="none" stroke="#666666" strokeWidth="2.5"/>
        <path d="M12 0 L12 30 L68 70 L68 105 L35 140 L35 178 L78 225 L78 268 L45 308 L45 375 L66 422 L66 480"
          fill="none" stroke="#ffffff" strokeWidth="1.6"/>
        <path d="M106 0 L106 35 L52 75 L92 120 L92 168 L46 215 L106 272 L106 480"
          fill="none" stroke="#ffffff" strokeWidth="1.6"/>

        <circle cx="56" cy="115" r="1.5" fill="#80d8ff"/>
        <circle cx="68" cy="115" r="1.5" fill="#80d8ff"/>
        <circle cx="80" cy="115" r="1.5" fill="#80d8ff"/>
        <circle cx="56" cy="125" r="1.5" fill="#80d8ff"/>
        <circle cx="68" cy="125" r="1.5" fill="#80d8ff"/>
        <circle cx="80" cy="125" r="1.5" fill="#80d8ff"/>
        <circle cx="48" cy="415" r="1.5" fill="#80d8ff"/>
        <circle cx="60" cy="415" r="1.5" fill="#80d8ff"/>
        <circle cx="72" cy="415" r="1.5" fill="#80d8ff"/>

        <circle cx="48" cy="110" r="3.2" fill="#ffd54f"/>
        <circle cx="54" cy="250" r="3.2" fill="#00e5ff"/>
        <circle cx="70" cy="275" r="3.2" fill="#ba68c8"/>

        <rect x="6" y="262" width="112" height="70" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2"/>
        <path d="M42 278 l6 4 m6 -4 l6 4 m6 -4 l6 4" stroke="#00f3ff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M42 292 l-6 4 m-6 -4 l-6 4 m-6 -4 l-6 4" stroke="#00f3ff" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="70" cy="278" r="2.8" fill="#ff4081"/>
        <circle cx="82" cy="285" r="2.8" fill="#69f0ae"/>
        <circle cx="52" cy="320" r="2.8" fill="#ff5252"/>
      </g>

      {/* ─── 3. Main Stage White Neon Outer Walls ─── */}
      <path d="M218 -5 L244 26 L218 62 L218 485" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" filter="url(#wall-glow)"/>
      <path d="M682 -5 L656 26 L682 62 L682 485" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" filter="url(#wall-glow)"/>

      {/* ─── 4. Glowing Cyan Slanted Bar Obstacles ─── */}
      <g filter="url(#neon-glow)">
        <rect x="256" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 262 112)"/>
        <rect x="306" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 312 112)"/>
        <rect x="356" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 362 112)"/>
        <rect x="406" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 412 112)"/>
        <rect x="456" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 462 112)"/>
        <rect x="506" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 512 112)"/>
        <rect x="556" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 562 112)"/>

        <rect x="256" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 262 202)"/>
        <rect x="306" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 312 202)"/>
        <rect x="356" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 362 202)"/>
        <rect x="406" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 412 202)"/>
        <rect x="456" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 462 202)"/>
        <rect x="506" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 512 202)"/>
        <rect x="556" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 562 202)"/>

        <rect x="195" y="340" width="15" height="150" rx="5" fill="#00f3ff" transform="rotate(-20 202 415)"/>
        <rect x="330" y="340" width="15" height="150" rx="5" fill="#00f3ff" transform="rotate(20 337 415)"/>
        <rect x="430" y="340" width="15" height="150" rx="5" fill="#00f3ff" transform="rotate(-20 437 415)"/>
        <rect x="565" y="340" width="15" height="150" rx="5" fill="#00f3ff" transform="rotate(20 572 415)"/>
      </g>

      {/* ─── 5. Actual Marbles with Direct Name Labels ─── */}
      <g>
        <circle cx="478" cy="85" r="11" fill="#ff4081"/>
        <circle cx="475" cy="82" r="3.5" fill="#ffffff" opacity="0.6"/>
        <text x="478" y="112" textAnchor="middle" fill="#ff4081"
          fontFamily="Apple SD Gothic Neo, Pretendard, sans-serif" fontSize="13.5" fontWeight="900">키위</text>
      </g>

      <g>
        <circle cx="538" cy="140" r="15" fill="none" stroke="#ff1744" strokeWidth="2.2"/>
        <circle cx="538" cy="140" r="11" fill="#69f0ae"/>
        <circle cx="535" cy="137" r="3.5" fill="#ffffff" opacity="0.6"/>
        <text x="538" y="170" textAnchor="middle" fill="#69f0ae"
          fontFamily="Apple SD Gothic Neo, Pretendard, sans-serif" fontSize="13.5" fontWeight="900">귤</text>
      </g>

      <g>
        <circle cx="282" cy="410" r="15" fill="none" stroke="#ff1744" strokeWidth="2.2"/>
        <circle cx="282" cy="410" r="11" fill="#ff5252"/>
        <circle cx="279" cy="407" r="3.5" fill="#ffffff" opacity="0.6"/>
        <text x="282" y="440" textAnchor="middle" fill="#ff5252"
          fontFamily="Apple SD Gothic Neo, Pretendard, sans-serif" fontSize="13.5" fontWeight="900">키위</text>
      </g>

      {/* ─── 6. Live Leaderboard (Top Right in original game) ─── */}
      <g textAnchor="end" fontFamily="Apple SD Gothic Neo, Pretendard, sans-serif" fontSize="14" fontWeight="800">
        <text x="842" y="22" fill="#ff4081">키위 #1</text>
        <text x="842" y="44" fill="#69f0ae">귤 #2</text>
        <text x="842" y="66" fill="#ff4081">키위 #3</text>
        <text x="842" y="88" fill="#00e5ff">수박 #4</text>
        <text x="842" y="110" fill="#ffd740">귤 #5</text>
        <text x="842" y="132" fill="#ba68c8">수박 #6</text>
      </g>
    </svg>
  );
}

function TicketArtwork({ gameId }) {
  if (gameId === 'roulette') {
    return <MarbleDisplay />;
  }
  if (gameId === 'bomb-ladder') {
    return (
      <svg className="rpz-preview-svg" viewBox="0 0 260 170" aria-hidden="true">
        <rect width="260" height="170" rx="8" fill="#0f172a" />
        <line x1="45" y1="24" x2="45" y2="146" stroke="#475569" strokeWidth="4" />
        <line x1="105" y1="24" x2="105" y2="146" stroke="#475569" strokeWidth="4" />
        <line x1="165" y1="24" x2="165" y2="146" stroke="#475569" strokeWidth="4" />
        <line x1="215" y1="24" x2="215" y2="146" stroke="#475569" strokeWidth="4" />
        <line x1="45" y1="55" x2="105" y2="55" stroke="#94a3b8" strokeWidth="3.5" />
        <line x1="165" y1="68" x2="215" y2="68" stroke="#94a3b8" strokeWidth="3.5" />
        <line x1="105" y1="96" x2="165" y2="96" stroke="#94a3b8" strokeWidth="3.5" />
        <line x1="45" y1="118" x2="105" y2="118" stroke="#94a3b8" strokeWidth="3.5" />
        <path d="M45 24 L45 55 L105 55 L105 96 L165 96 L165 146" fill="none" stroke="#f43f5e" strokeWidth="4.5" />
        <path d="M215 24 L215 68 L165 68 L165 96 L105 96 L105 118 L45 118 L45 146" fill="none" stroke="#38bdf8" strokeWidth="4" />
        <circle cx="165" cy="146" r="14" fill="#ef4444" />
        <text x="165" y="151" textAnchor="middle" fill="#fff" fontSize="14">💣</text>
      </svg>
    );
  }
  if (gameId === 'lotto-645') {
    return (
      <svg className="rpz-preview-svg" viewBox="0 0 260 170" aria-hidden="true">
        <rect width="260" height="170" rx="8" fill="#080c14" />
        <circle cx="115" cy="76" r="54" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M115 22 Q195 22 205 142" fill="none" stroke="#38bdf8" strokeWidth="8" strokeOpacity="0.35" />
        <circle cx="94" cy="68" r="13" fill="#eab308" />
        <text x="94" y="72" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="900">3</text>
        <circle cx="115" cy="36" r="13" fill="#3b82f6" />
        <text x="115" y="40" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">17</text>
        <circle cx="112" cy="96" r="13" fill="#ef4444" />
        <text x="112" y="100" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">29</text>
        <circle cx="142" cy="86" r="12" fill="#22c55e" />
        <text x="142" y="90" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">45</text>
      </svg>
    );
  }
  if (gameId === 'team-draft') {
    return (
      <svg className="rpz-preview-svg" viewBox="0 0 260 170" aria-hidden="true">
        <rect width="260" height="170" rx="8" fill="#0f172a" />
        <rect x="16" y="20" width="108" height="130" rx="8" fill="rgba(56, 189, 248, 0.14)" stroke="#38bdf8" strokeWidth="2" />
        <text x="70" y="44" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="900">TEAM ALPHA</text>
        <rect x="28" y="58" width="84" height="22" rx="4" fill="#1e293b" />
        <rect x="28" y="88" width="84" height="22" rx="4" fill="#1e293b" />
        <rect x="136" y="20" width="108" height="130" rx="8" fill="rgba(34, 197, 94, 0.14)" stroke="#22c55e" strokeWidth="2" />
        <text x="190" y="44" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="900">TEAM BRAVO</text>
        <rect x="148" y="58" width="84" height="22" rx="4" fill="#1e293b" />
        <rect x="148" y="88" width="84" height="22" rx="4" fill="#1e293b" />
      </svg>
    );
  }
  if (gameId === 'chaos-wheel') {
    return (
      <svg className="rpz-preview-svg" viewBox="0 0 260 170" aria-hidden="true">
        <rect width="260" height="170" rx="8" fill="#090d16" />
        <circle cx="130" cy="88" r="60" fill="#1e1b4b" stroke="#a855f7" strokeWidth="3" />
        <path d="M130 88 L130 28 A60 60 0 0 1 182 58 Z" fill="#f43f5e" />
        <path d="M130 88 L182 58 A60 60 0 0 1 182 118 Z" fill="#f59e0b" />
        <path d="M130 88 L182 118 A60 60 0 0 1 130 148 Z" fill="#22c55e" />
        <path d="M130 88 L130 148 A60 60 0 0 1 78 118 Z" fill="#38bdf8" />
        <path d="M130 88 L78 118 A60 60 0 0 1 78 58 Z" fill="#a855f7" />
        <path d="M130 88 L78 58 A60 60 0 0 1 130 28 Z" fill="#ec4899" />
        <circle cx="130" cy="88" r="15" fill="#0f172a" stroke="#fff" strokeWidth="2.5" />
        <polygon points="130,26 122,12 138,12" fill="#facc15" />
      </svg>
    );
  }
  return (
    <svg className="rpz-preview-svg" viewBox="0 0 260 170" aria-hidden="true">
      <rect width="260" height="170" rx="8" fill="#111029" />
      <rect x="85" y="66" width="90" height="78" rx="8" fill="#312e81" stroke="#f59e0b" strokeWidth="2.5" />
      <rect x="98" y="24" width="64" height="46" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
      <text x="130" y="51" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="900">제비 #01</text>
      <text x="130" y="114" textAnchor="middle" fill="#fff" fontSize="26">🎁</text>
    </svg>
  );
}

function getInitialGameFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const g = params.get('game');
  if (g && DRAW_GAMES.some(item => item.id === g)) {
    return g;
  }
  return null;
}

export default function DrawPack() {
  const [activeId, setActiveId] = useState(() => getInitialGameFromUrl());

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onPopState = () => {
      setActiveId(getInitialGameFromUrl());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const selectGame = (gameId) => {
    setActiveId(gameId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (gameId) {
        url.searchParams.set('game', gameId);
      } else {
        url.searchParams.delete('game');
      }
      window.history.pushState({}, '', url.pathname + url.search);
    }
  };

  const activeGame = DRAW_GAMES.find(game => game.id === activeId);

  // 0. Original Marble Roulette (Box2D WASM + Corporate Directory & Presets)
  if (activeId === 'roulette' && activeGame) {
    return (
      <main className="gb-draw-stage">
        <GameLauncher
          title={activeGame.name}
          src={activeGame.launchUrl}
          aspectRatio={activeGame.aspectRatio}
          onClose={() => selectGame(null)}
        />
      </main>
    );
  }

  // 1..5. RANDOM PLAY ZONE Independent Mini-Games
  if (activeId === 'bomb-ladder') {
    return <BombLadderGame onBack={() => selectGame(null)} />;
  }
  if (activeId === 'lotto-645') {
    return <Lotto3DGame onBack={() => selectGame(null)} />;
  }
  if (activeId === 'team-draft') {
    return <TeamDraftGame onBack={() => selectGame(null)} />;
  }
  if (activeId === 'chaos-wheel') {
    return <ChaosWheelGame onBack={() => selectGame(null)} />;
  }
  if (activeId === 'mystery-box') {
    return <MysteryBoxGame onBack={() => selectGame(null)} />;
  }

  return (
    <main className="rpz-hub-board" data-testid="random-play-zone-hub">
      <header className="rpz-hub-header">
        <div>
          <span className="rpz-hub-kicker">GAMEBOX · DRAW PACK & RANDOM PLAY ZONE</span>
          <h1>추첨 게임 — 오리지널 마블 룰렛 & 미니게임 6종</h1>
          <p>모두가 지켜보는 가운데 오늘의 주인공을 뽑아보세요. 구슬 레이스부터 폭탄 사다리, 실제 3D 로또, 팀 드래프트, 카오스 룰렛, 3D 제비상자까지 모두 즐길 수 있습니다.</p>
        </div>

        <div className="rpz-hub-quick-tabs" role="navigation" aria-label="추첨 미니게임 바로가기">
          {DRAW_GAMES.map((g, idx) => (
            <button
              key={g.id}
              type="button"
              className="rpz-hub-pill"
              data-testid={`rpz-quick-tab-${g.id}`}
              onClick={() => selectGame(g.id)}
            >
              <span>0{idx + 1}. {g.icon}</span> <strong>{g.shortName}</strong>
            </button>
          ))}
        </div>
      </header>

      <div className="rpz-tickets-grid">
        {DRAW_GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`rpz-game-ticket ${game.id === 'roulette' ? 'rpz-ticket-featured' : ''}`}
            data-testid={`rpz-ticket-${game.id}`}
            style={{ '--ticket-accent': game.caseColor }}
            onClick={() => selectGame(game.id)}
          >
            <span className="rpz-game-ticket-copy">
              <span className="rpz-ticket-top-meta">
                <span className="rpz-ticket-genre">{game.genre}</span>
                <span className="rpz-ticket-players">{game.playersLabel}</span>
              </span>

              <span>
                <strong>{game.shortName}</strong>
                <span className="rpz-ticket-kor">{game.koreanTitle}</span>
              </span>

              <span className="rpz-ticket-desc">{game.description}</span>

              <span className="rpz-ticket-footer">
                <span className="rpz-ticket-repo">OSS: {game.sourceRepo} ({game.license})</span>
                <span className="rpz-ticket-play-cta">
                  게임 열기 <span aria-hidden="true">↗</span>
                </span>
              </span>
            </span>

            <span className="rpz-game-ticket-art" aria-hidden="true">
              <TicketArtwork gameId={game.id} />
            </span>

            <span className="gb-ticket-stub" aria-hidden="true">
              {game.discLabel}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
