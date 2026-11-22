import React, { useState } from 'react';
import { DRAW_GAMES } from '../registry/drawGames.js';
import GameLauncher from '../runtime/GameLauncher.js';

export function MarbleDisplay() {
  return (
    <svg className="gb-marble-display" viewBox="0 0 860 500" role="img" aria-label="마블 룰렛 실제 플레이 화면을 바탕으로 한 구슬 레이스 미리보기">
      <defs>
        <linearGradient id="marble-screen" x2="0" y2="1"><stop stopColor="#172431"/><stop offset="1" stopColor="#0a1119"/></linearGradient>
        <linearGradient id="track-metal" x2="0" y2="1"><stop stopColor="#5f7784"/><stop offset=".45" stopColor="#283c48"/><stop offset="1" stopColor="#14232d"/></linearGradient>
        <radialGradient id="marble-cyan" cx="30%" cy="25%"><stop stopColor="#f0ffff"/><stop offset=".22" stopColor="#82efff"/><stop offset=".65" stopColor="#14a9cf"/><stop offset="1" stopColor="#07516f"/></radialGradient>
        <radialGradient id="marble-amber" cx="30%" cy="25%"><stop stopColor="#fff4cd"/><stop offset=".24" stopColor="#ffd66e"/><stop offset=".68" stopColor="#e48324"/><stop offset="1" stopColor="#7a351c"/></radialGradient>
        <radialGradient id="marble-rose" cx="30%" cy="25%"><stop stopColor="#fff0ee"/><stop offset=".25" stopColor="#ff9d91"/><stop offset=".7" stopColor="#d34257"/><stop offset="1" stopColor="#672333"/></radialGradient>
        <radialGradient id="marble-lime" cx="30%" cy="25%"><stop stopColor="#f4ffe5"/><stop offset=".25" stopColor="#b8eb74"/><stop offset=".7" stopColor="#58a44e"/><stop offset="1" stopColor="#24543a"/></radialGradient>
        <pattern id="roulette-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0v32" fill="none" stroke="#90b0bd" strokeOpacity=".08"/></pattern>
        <filter id="marble-shadow" x="-60%" y="-60%" width="220%" height="240%"><feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#000" floodOpacity=".55"/></filter>
      </defs>
      <rect x="4" y="4" width="852" height="492" rx="24" fill="#080d12" stroke="#748590" strokeWidth="5"/>
      <rect x="14" y="14" width="832" height="472" rx="17" fill="url(#marble-screen)"/>
      <path d="M14 31q0-17 17-17h798q17 0 17 17v50H14z" fill="#202b32"/>
      <circle cx="44" cy="46" r="7" fill="#f0715f"/><circle cx="68" cy="46" r="7" fill="#e7bb65"/><circle cx="92" cy="46" r="7" fill="#73b38e"/>
      <text x="430" y="53" textAnchor="middle" fill="#e7e2d7" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="700" letterSpacing="4">MARBLE ROULETTE</text>
      <rect x="34" y="96" width="792" height="344" rx="12" fill="#101b24" stroke="#415662" strokeWidth="2"/>
      <rect x="34" y="96" width="792" height="344" rx="12" fill="url(#roulette-grid)"/>
      <path d="M70 140h106v58h86v-36h75v76h96v-34h75v88h95v-43h93" fill="none" stroke="#080e14" strokeWidth="37" strokeLinecap="round" strokeLinejoin="round" opacity=".78"/>
      <path d="M70 132h106v58h86v-36h75v76h96v-34h75v88h95v-43h93" fill="none" stroke="url(#track-metal)" strokeWidth="29" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M70 132h106v58h86v-36h75v76h96v-34h75v88h95v-43h93" fill="none" stroke="#9ab0b6" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M166 190v72h-54v57h108v-44h95v79h73v-35h97v48h91v-55h145" fill="none" stroke="#080e14" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" opacity=".72"/>
      <path d="M166 184v72h-54v57h108v-44h95v79h73v-35h97v48h91v-55h145" fill="none" stroke="#344b57" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M71 111v44m-11-34 11 11 11-11" fill="none" stroke="#edc574" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="739" y="296" width="54" height="72" rx="8" fill="#263c46" stroke="#b79453" strokeWidth="3"/>
      <path d="M751 309h30v12h-30zm0 21h30v25h-30z" fill="#d7b66a" opacity=".9"/>
      <g filter="url(#marble-shadow)">
        <circle cx="139" cy="132" r="20" fill="url(#marble-cyan)"/><circle cx="246" cy="183" r="19" fill="url(#marble-amber)"/>
        <circle cx="344" cy="151" r="21" fill="url(#marble-rose)"/><circle cx="435" cy="230" r="18" fill="url(#marble-lime)"/>
        <circle cx="538" cy="194" r="21" fill="url(#marble-cyan)"/><circle cx="627" cy="280" r="19" fill="url(#marble-amber)"/>
      </g>
      <rect x="36" y="454" width="788" height="13" rx="6" fill="#28363d"/>
      <rect x="36" y="454" width="506" height="13" rx="6" fill="#d3a85d"/>
      <circle cx="544" cy="460" r="8" fill="#f4dfaa"/>
      <text x="38" y="479" fill="#aebbc0" fontFamily="Arial,sans-serif" fontSize="11" letterSpacing="1.6">PHYSICS COURSE · LIVE DRAW</text>
      <text x="822" y="479" textAnchor="end" fill="#d7b66a" fontFamily="Arial,sans-serif" fontSize="11" letterSpacing="1.6">FINISH</text>
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
