import React, { useState } from 'react';
import { DRAW_GAMES } from '../registry/drawGames.js';
import GameLauncher from '../runtime/GameLauncher.js';

export function MarbleDisplay() {
  return (
    <svg className="gb-marble-display" viewBox="0 0 860 480" role="img" aria-label="마블 룰렛 실제 게임 화면 기반 레이스 미리보기">
      <defs>
        {/* Neon Glow Filters */}
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
        {/* Track outlines inside minimap */}
        <path d="M60 0 L60 22 L36 55 L36 90 L68 125 L68 160 L28 200 L28 245 L60 285 L60 355 L42 405 L42 480"
          fill="none" stroke="#666666" strokeWidth="2.5"/>
        <path d="M12 0 L12 30 L68 70 L68 105 L35 140 L35 178 L78 225 L78 268 L45 308 L45 375 L66 422 L66 480"
          fill="none" stroke="#ffffff" strokeWidth="1.6"/>
        <path d="M106 0 L106 35 L52 75 L92 120 L92 168 L46 215 L106 272 L106 480"
          fill="none" stroke="#ffffff" strokeWidth="1.6"/>

        {/* Peg dots in minimap */}
        <circle cx="56" cy="115" r="1.5" fill="#80d8ff"/>
        <circle cx="68" cy="115" r="1.5" fill="#80d8ff"/>
        <circle cx="80" cy="115" r="1.5" fill="#80d8ff"/>
        <circle cx="56" cy="125" r="1.5" fill="#80d8ff"/>
        <circle cx="68" cy="125" r="1.5" fill="#80d8ff"/>
        <circle cx="80" cy="125" r="1.5" fill="#80d8ff"/>
        <circle cx="48" cy="415" r="1.5" fill="#80d8ff"/>
        <circle cx="60" cy="415" r="1.5" fill="#80d8ff"/>
        <circle cx="72" cy="415" r="1.5" fill="#80d8ff"/>

        {/* Marbles inside minimap */}
        <circle cx="48" cy="110" r="3.2" fill="#ffd54f"/>
        <circle cx="54" cy="250" r="3.2" fill="#00e5ff"/>
        <circle cx="70" cy="275" r="3.2" fill="#ba68c8"/>

        {/* Current Camera Viewport Rect Box */}
        <rect x="6" y="262" width="112" height="70" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2"/>
        {/* Elements inside current viewport rect */}
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
        {/* Row 1: 7 downward slanted bars \ \ \ \ \ \ \ */}
        <rect x="256" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 262 112)"/>
        <rect x="306" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 312 112)"/>
        <rect x="356" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 362 112)"/>
        <rect x="406" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 412 112)"/>
        <rect x="456" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 462 112)"/>
        <rect x="506" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 512 112)"/>
        <rect x="556" y="90" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(-30 562 112)"/>

        {/* Row 2: 7 upward slanted bars / / / / / / / */}
        <rect x="256" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 262 202)"/>
        <rect x="306" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 312 202)"/>
        <rect x="356" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 362 202)"/>
        <rect x="406" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 412 202)"/>
        <rect x="456" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 462 202)"/>
        <rect x="506" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 512 202)"/>
        <rect x="556" y="180" width="13" height="44" rx="4.5" fill="#00f3ff" transform="rotate(30 562 202)"/>

        {/* Row 3: 4 Long slanted pillars \ / \ / */}
        <rect x="195" y="340" width="15" height="150" rx="5" fill="#00f3ff" transform="rotate(-20 202 415)"/>
        <rect x="330" y="340" width="15" height="150" rx="5" fill="#00f3ff" transform="rotate(20 337 415)"/>
        <rect x="430" y="340" width="15" height="150" rx="5" fill="#00f3ff" transform="rotate(-20 437 415)"/>
        <rect x="565" y="340" width="15" height="150" rx="5" fill="#00f3ff" transform="rotate(20 572 415)"/>
      </g>

      {/* ─── 5. Actual Marbles with Direct Name Labels ─── */}
      {/* Marble 1 (Pink) */}
      <g>
        <circle cx="478" cy="85" r="11" fill="#ff4081"/>
        <circle cx="475" cy="82" r="3.5" fill="#ffffff" opacity="0.6"/>
        <text x="478" y="112" textAnchor="middle" fill="#ff4081"
          fontFamily="Apple SD Gothic Neo, Pretendard, sans-serif" fontSize="13.5" fontWeight="900">키위</text>
      </g>

      {/* Marble 2 (Green with red target ring) */}
      <g>
        <circle cx="538" cy="140" r="15" fill="none" stroke="#ff1744" strokeWidth="2.2"/>
        <circle cx="538" cy="140" r="11" fill="#69f0ae"/>
        <circle cx="535" cy="137" r="3.5" fill="#ffffff" opacity="0.6"/>
        <text x="538" y="170" textAnchor="middle" fill="#69f0ae"
          fontFamily="Apple SD Gothic Neo, Pretendard, sans-serif" fontSize="13.5" fontWeight="900">귤</text>
      </g>

      {/* Marble 3 (Coral Red with red target ring) */}
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

export default function DrawPack() {
  const [activeId, setActiveId] = useState(null);
  const activeGame = DRAW_GAMES.find(game => game.id === activeId);

  if (activeGame) {
    return (
      <main className="gb-draw-stage">
        <GameLauncher title={activeGame.name} src={activeGame.launchUrl}
          aspectRatio={activeGame.aspectRatio} onClose={() => setActiveId(null)} />
      </main>
    );
  }

  return (
    <main className="gb-draw-board">
      <header className="gb-room-heading">
        <h1>추첨 게임</h1>
        <p>모두가 지켜보는 가운데 오늘의 주인공을 뽑아보세요.</p>
      </header>
      <div className="gb-draw-tickets">
        {DRAW_GAMES.map(game => (
          <button key={game.id} type="button" className="gb-draw-ticket" onClick={() => setActiveId(game.id)}>
            <span className="gb-ticket-copy">
              <span className="gb-ticket-meta">{game.playersLabel}</span>
              <strong>{game.shortName}</strong>
              <span>{game.description}</span>
              <span className="gb-ticket-action">게임 열기 <span aria-hidden="true">↗</span></span>
            </span>
            <span className="gb-ticket-art" aria-hidden="true">
              {game.id === 'roulette' ? <MarbleDisplay /> : <span>{game.icon}</span>}
            </span>
            <span className="gb-ticket-stub" aria-hidden="true">{game.discLabel}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
