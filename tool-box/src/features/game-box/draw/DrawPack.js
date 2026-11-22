import React, { useState } from 'react';
import { DRAW_GAMES } from '../registry/drawGames.js';
import GameLauncher from '../runtime/GameLauncher.js';

export function MarbleDisplay() {
  return (
    <svg className="gb-marble-display" viewBox="0 0 860 520" role="img" aria-label="마블 룰렛 실제 플레이 화면을 바탕으로 한 구슬 레이스 미리보기">
      <defs>
        {/* Background & Grid */}
        <linearGradient id="roulette-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c131c"/>
          <stop offset="100%" stopColor="#14202d"/>
        </linearGradient>
        <pattern id="r-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0v28" fill="none" stroke="#7fa2b6" strokeWidth="1" strokeOpacity="0.06"/>
        </pattern>

        {/* Rails */}
        <linearGradient id="rail-track" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#627885"/>
          <stop offset="35%" stopColor="#334652"/>
          <stop offset="100%" stopColor="#18242c"/>
        </linearGradient>
        <linearGradient id="rail-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#253540"/>
          <stop offset="100%" stopColor="#111c23"/>
        </linearGradient>

        {/* Spinners & Pins */}
        <linearGradient id="spin-blade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffca28"/>
          <stop offset="100%" stopColor="#e65100"/>
        </linearGradient>
        <radialGradient id="pin-metal" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="45%" stopColor="#b0bec5"/>
          <stop offset="100%" stopColor="#37474f"/>
        </radialGradient>

        {/* Marbles (3D Spheres with Highlights) */}
        <radialGradient id="m-red" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#ffcdd2"/>
          <stop offset="25%" stopColor="#ff5252"/>
          <stop offset="70%" stopColor="#d50000"/>
          <stop offset="100%" stopColor="#5b0007"/>
        </radialGradient>
        <radialGradient id="m-cyan" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#e0f7fa"/>
          <stop offset="25%" stopColor="#18ffff"/>
          <stop offset="70%" stopColor="#00b0ff"/>
          <stop offset="100%" stopColor="#003566"/>
        </radialGradient>
        <radialGradient id="m-gold" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#fff8e1"/>
          <stop offset="25%" stopColor="#ffd740"/>
          <stop offset="70%" stopColor="#ff9100"/>
          <stop offset="100%" stopColor="#7a3600"/>
        </radialGradient>
        <radialGradient id="m-green" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#f1f8e9"/>
          <stop offset="25%" stopColor="#76ff03"/>
          <stop offset="70%" stopColor="#00c853"/>
          <stop offset="100%" stopColor="#00431a"/>
        </radialGradient>
        <radialGradient id="m-purple" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#f3e5f5"/>
          <stop offset="25%" stopColor="#e040fb"/>
          <stop offset="70%" stopColor="#aa00ff"/>
          <stop offset="100%" stopColor="#4a0072"/>
        </radialGradient>
        <radialGradient id="m-orange" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#fbe9e7"/>
          <stop offset="25%" stopColor="#ff9e80"/>
          <stop offset="70%" stopColor="#ff3d00"/>
          <stop offset="100%" stopColor="#801300"/>
        </radialGradient>
        <radialGradient id="m-pink" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#fce4ec"/>
          <stop offset="25%" stopColor="#ff80ab"/>
          <stop offset="70%" stopColor="#f50057"/>
          <stop offset="100%" stopColor="#660024"/>
        </radialGradient>
        <radialGradient id="m-blue" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#e8eaf6"/>
          <stop offset="25%" stopColor="#82b1ff"/>
          <stop offset="70%" stopColor="#2979ff"/>
          <stop offset="100%" stopColor="#0d2b7a"/>
        </radialGradient>

        {/* Checker pattern for Finish Line */}
        <pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#e2b755"/>
          <rect x="8" width="8" height="8" fill="#1b242a"/>
          <rect y="8" width="8" height="8" fill="#1b242a"/>
          <rect x="8" y="8" width="8" height="8" fill="#e2b755"/>
        </pattern>

        {/* Drop shadow filters */}
        <filter id="m-shadow" x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#000" floodOpacity="0.6"/>
        </filter>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Main Game Stage Canvas */}
      <rect x="2" y="2" width="856" height="516" rx="14" fill="url(#roulette-bg)" stroke="#394f5e" strokeWidth="2.5"/>
      <rect x="2" y="2" width="856" height="516" rx="14" fill="url(#r-grid)"/>

      {/* ─── Track & Obstacles (Physical Courses) ─── */}
      {/* Start Chamber */}
      <path d="M120 32h110l-28 64h-54z" fill="#172733" stroke="#486374" strokeWidth="2.5"/>
      <path d="M148 96h54v30h-54z" fill="#203444" stroke="#486374" strokeWidth="2"/>
      <text x="175" y="58" textAnchor="middle" fill="#89a7ba" fontFamily="monospace" fontSize="10" fontWeight="700" letterSpacing="1">START GATE</text>

      {/* Track Rail Layer 1 - Shadow */}
      <path d="M175 126 v44 h96 v58 h98 v-34 h110 v86 h-90 v62 h210 v58 h115"
        fill="none" stroke="#060c11" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      {/* Track Rail Layer 1 - Metal Base */}
      <path d="M175 126 v44 h96 v58 h98 v-34 h110 v86 h-90 v62 h210 v58 h115"
        fill="none" stroke="url(#rail-track)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Track Rail Layer 1 - Inner Groove */}
      <path d="M175 126 v44 h96 v58 h98 v-34 h110 v86 h-90 v62 h210 v58 h115"
        fill="none" stroke="url(#rail-inner)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Track Rail Layer 1 - Highlight Edge */}
      <path d="M175 126 v44 h96 v58 h98 v-34 h110 v86 h-90 v62 h210 v58 h115"
        fill="none" stroke="#90afbf" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Track Rail Layer 2 (Alternative path & Branch) */}
      <path d="M271 228 v64 h-84 v60 h165 v-42 h140 v62 h90"
        fill="none" stroke="#060c11" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
      <path d="M271 228 v64 h-84 v60 h165 v-42 h140 v62 h90"
        fill="none" stroke="url(#rail-track)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M271 228 v64 h-84 v60 h165 v-42 h140 v62 h90"
        fill="none" stroke="url(#rail-inner)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Plinko Peg Matrix (Obstacle Pins) */}
      <g>
        {[
          [480, 85], [530, 85], [580, 85], [630, 85],
          [455, 120], [505, 120], [555, 120], [605, 120], [655, 120],
          [480, 155], [530, 155], [580, 155], [630, 155],
          [505, 190], [555, 190], [605, 190],
        ].map(([px, py], i) => (
          <g key={i}>
            <circle cx={px} cy={py + 3} r="6.5" fill="#070d13" opacity="0.6"/>
            <circle cx={px} cy={py} r="6" fill="url(#pin-metal)"/>
            <circle cx={px - 1.5} cy={py - 1.5} r="1.8" fill="#fff" opacity="0.8"/>
          </g>
        ))}
      </g>

      {/* Rotating Spinner 1 (Left) */}
      <g transform="translate(345, 240)">
        <circle r="36" fill="none" stroke="#e67e22" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.45"/>
        <g transform="rotate(35)">
          <rect x="-30" y="-5" width="60" height="10" rx="4" fill="url(#spin-blade)"/>
          <rect x="-5" y="-30" width="10" height="60" rx="4" fill="url(#spin-blade)"/>
          <circle r="7" fill="#263238" stroke="#ffd54f" strokeWidth="2.5"/>
          <circle r="2.5" fill="#fff"/>
        </g>
      </g>

      {/* Rotating Spinner 2 (Right) */}
      <g transform="translate(565, 285)">
        <circle r="38" fill="none" stroke="#ffb300" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.45"/>
        <g transform="rotate(70)">
          <rect x="-32" y="-5.5" width="64" height="11" rx="4" fill="url(#spin-blade)"/>
          <rect x="-5.5" y="-32" width="11" height="64" rx="4" fill="url(#spin-blade)"/>
          <circle r="7.5" fill="#263238" stroke="#ffd54f" strokeWidth="2.5"/>
          <circle r="2.5" fill="#fff"/>
        </g>
      </g>

      {/* Finish Area (Goal Podiums & Finish Gate) */}
      <g transform="translate(680, 395)">
        <rect x="0" y="0" width="86" height="58" rx="8" fill="#1b2832" stroke="#d4af37" strokeWidth="2.5"/>
        <rect x="6" y="6" width="74" height="20" fill="url(#checker)"/>
        <text x="43" y="21" textAnchor="middle" fill="#000" fontFamily="sans-serif" fontSize="11" fontWeight="900" letterSpacing="2">FINISH</text>
        {/* Podium Slots (1st, 2nd, 3rd) */}
        <rect x="8" y="30" width="20" height="22" rx="3" fill="#d4af37"/>
        <text x="18" y="45" textAnchor="middle" fill="#111" fontFamily="sans-serif" fontSize="11" fontWeight="900">1</text>
        <rect x="33" y="34" width="20" height="18" rx="3" fill="#cfd8dc"/>
        <text x="43" y="47" textAnchor="middle" fill="#111" fontFamily="sans-serif" fontSize="10" fontWeight="900">2</text>
        <rect x="58" y="37" width="20" height="15" rx="3" fill="#b08d57"/>
        <text x="68" y="49" textAnchor="middle" fill="#111" fontFamily="sans-serif" fontSize="9" fontWeight="900">3</text>
      </g>

      {/* Sparkles / Collision Stars */}
      <path d="M515 155 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#ffe082" filter="url(#glow)"/>
      <path d="M375 225 l2 3 3 2 -3 2 -2 3 -2 -3 -3 -2 3 -2z" fill="#80d8ff" filter="url(#glow)"/>
      <path d="M605 400 l3 5 5 3 -5 3 -3 5 -3 -5 -5 -3 5 -3z" fill="#ff80ab" filter="url(#glow)"/>

      {/* ─── Live Marbles with Participant Name Badges ─── */}
      <g filter="url(#m-shadow)">
        {/* Marble 1 (Leader nearing finish line) */}
        <g transform="translate(615, 420)">
          <circle r="19" fill="url(#m-red)"/>
          <ellipse cx="-5" cy="-6" rx="6" ry="4" fill="#fff" opacity="0.65"/>
          {/* Name Tag Pill */}
          <rect x="-38" y="-39" width="76" height="18" rx="9" fill="rgba(15,23,30,0.92)" stroke="#ff5252" strokeWidth="1.5"/>
          <circle cx="-28" cy="-30" r="3.5" fill="#ffd700"/>
          <text x="-20" y="-27" fill="#fff" fontFamily="sans-serif" fontSize="10" fontWeight="800">김민수</text>
          <text x="26" y="-27" textAnchor="end" fill="#ffd700" fontFamily="sans-serif" fontSize="9" fontWeight="900">1위</text>
        </g>

        {/* Marble 2 (Close second) */}
        <g transform="translate(510, 368)">
          <circle r="18" fill="url(#m-cyan)"/>
          <ellipse cx="-5" cy="-5" rx="5.5" ry="3.5" fill="#fff" opacity="0.7"/>
          <rect x="-35" y="-37" width="70" height="18" rx="9" fill="rgba(15,23,30,0.92)" stroke="#00b0ff" strokeWidth="1.5"/>
          <text x="-24" y="-25" fill="#fff" fontFamily="sans-serif" fontSize="10" fontWeight="800">이서연</text>
          <text x="24" y="-25" textAnchor="end" fill="#80d8ff" fontFamily="sans-serif" fontSize="9" fontWeight="800">2위</text>
        </g>

        {/* Marble 3 (Past spinner 1) */}
        <g transform="translate(360, 215)">
          <circle r="17.5" fill="url(#m-gold)"/>
          <ellipse cx="-4.5" cy="-5" rx="5" ry="3.5" fill="#fff" opacity="0.7"/>
          <rect x="-33" y="-35" width="66" height="17" rx="8.5" fill="rgba(15,23,30,0.92)" stroke="#ffb300" strokeWidth="1.4"/>
          <text x="-22" y="-23" fill="#fff" fontFamily="sans-serif" fontSize="9.5" fontWeight="800">박지훈</text>
          <text x="22" y="-23" textAnchor="end" fill="#ffe082" fontFamily="sans-serif" fontSize="8.5" fontWeight="800">3위</text>
        </g>

        {/* Marble 4 (Bouncing in Peg matrix) */}
        <g transform="translate(535, 142)">
          <circle r="17" fill="url(#m-green)"/>
          <ellipse cx="-4.5" cy="-4.5" rx="5" ry="3" fill="#fff" opacity="0.65"/>
          <rect x="-30" y="-33" width="60" height="16" rx="8" fill="rgba(15,23,30,0.9)" stroke="#00e676" strokeWidth="1.2"/>
          <text x="0" y="-21" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="9.5" fontWeight="700">최동현</text>
        </g>

        {/* Marble 5 (Deflecting off Pegs) */}
        <g transform="translate(635, 172)">
          <circle r="17" fill="url(#m-purple)"/>
          <ellipse cx="-4.5" cy="-4.5" rx="5" ry="3" fill="#fff" opacity="0.65"/>
          <rect x="-30" y="-33" width="60" height="16" rx="8" fill="rgba(15,23,30,0.9)" stroke="#e040fb" strokeWidth="1.2"/>
          <text x="0" y="-21" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="9.5" fontWeight="700">정유진</text>
        </g>

        {/* Marble 6 (Branch track descent) */}
        <g transform="translate(210, 248)">
          <circle r="16.5" fill="url(#m-orange)"/>
          <ellipse cx="-4" cy="-4" rx="5" ry="3" fill="#fff" opacity="0.65"/>
          <rect x="-30" y="-33" width="60" height="16" rx="8" fill="rgba(15,23,30,0.9)" stroke="#ff7043" strokeWidth="1.2"/>
          <text x="0" y="-21" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="9.5" fontWeight="700">강현우</text>
        </g>

        {/* Marble 7 (Dropping from Start Gate) */}
        <g transform="translate(175, 118)">
          <circle r="16" fill="url(#m-pink)"/>
          <ellipse cx="-4" cy="-4" rx="4.5" ry="3" fill="#fff" opacity="0.65"/>
          <rect x="-30" y="-32" width="60" height="16" rx="8" fill="rgba(15,23,30,0.9)" stroke="#ff4081" strokeWidth="1.2"/>
          <text x="0" y="-20" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="9.5" fontWeight="700">윤아름</text>
        </g>

        {/* Marble 8 (Mid-air drop toward Spinner 2) */}
        <g transform="translate(425, 290)">
          <circle r="16.5" fill="url(#m-blue)"/>
          <ellipse cx="-4" cy="-4" rx="5" ry="3" fill="#fff" opacity="0.7"/>
          <rect x="-30" y="-33" width="60" height="16" rx="8" fill="rgba(15,23,30,0.9)" stroke="#448aff" strokeWidth="1.2"/>
          <text x="0" y="-21" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="9.5" fontWeight="700">한도윤</text>
        </g>
      </g>

      {/* ─── In-Game HUD Elements ─── */}
      {/* Top Left: Live Match Status Badge */}
      <g transform="translate(20, 20)">
        <rect width="180" height="34" rx="8" fill="rgba(12, 19, 28, 0.82)" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="1"/>
        <circle cx="18" cy="17" r="5" fill="#f44336"/>
        <circle cx="18" cy="17" r="2.5" fill="#fff"/>
        <text x="31" y="21" fill="#ff5252" fontFamily="sans-serif" fontSize="11" fontWeight="800" letterSpacing="0.5">LIVE RACE</text>
        <line x1="98" y1="9" x2="98" y2="25" stroke="rgba(255,255,255,0.18)"/>
        <text x="108" y="21" fill="#b0bec5" fontFamily="sans-serif" fontSize="10.5" fontWeight="700">32 GU-SEUL</text>
      </g>

      {/* Right: Vertical Minimap Track Bar (Roulette Signature UI) */}
      <g transform="translate(798, 20)">
        <rect width="42" height="476" rx="9" fill="rgba(10, 16, 24, 0.88)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1"/>
        <text x="21" y="20" textAnchor="middle" fill="#78909c" fontFamily="monospace" fontSize="8.5" fontWeight="700">START</text>
        {/* Track Line in Minimap */}
        <line x1="21" y1="30" x2="21" y2="445" stroke="#37474f" strokeWidth="3" strokeLinecap="round"/>
        {/* Marble Positions on Minimap */}
        <circle cx="21" cy="425" r="4.5" fill="#ff5252"/>
        <circle cx="21" cy="380" r="4.5" fill="#00e5ff"/>
        <circle cx="21" cy="270" r="4" fill="#ffd740"/>
        <circle cx="21" cy="210" r="4" fill="#69f0ae"/>
        <circle cx="21" cy="180" r="4" fill="#e040fb"/>
        <circle cx="21" cy="145" r="4" fill="#ff9e80"/>
        <circle cx="21" cy="95" r="3.5" fill="#ff80ab"/>
        <circle cx="21" cy="65" r="3.5" fill="#448aff"/>
        {/* Goal Indicator */}
        <rect x="7" y="450" width="28" height="15" rx="3" fill="#d4af37"/>
        <text x="21" y="461" textAnchor="middle" fill="#000" fontFamily="sans-serif" fontSize="8" fontWeight="900">GOAL</text>
      </g>

      {/* Bottom: Live Top 4 Standings Ticker */}
      <g transform="translate(20, 466)">
        <rect width="766" height="34" rx="8" fill="rgba(12, 19, 28, 0.88)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1"/>
        <text x="16" y="21" fill="#ffd54f" fontFamily="sans-serif" fontSize="10.5" fontWeight="800">🏆 LIVE LEADERS</text>
        <line x1="112" y1="8" x2="112" y2="26" stroke="rgba(255,255,255,0.18)"/>
        <text x="126" y="21" fill="#fff" fontFamily="sans-serif" fontSize="11" fontWeight="600">
          <tspan fill="#ffd700" fontWeight="800">1위</tspan> 김민수
          <tspan fill="#90a4ae" dx="18">·</tspan>
          <tspan fill="#cfd8dc" fontWeight="800" dx="18">2위</tspan> 이서연
          <tspan fill="#90a4ae" dx="18">·</tspan>
          <tspan fill="#b08d57" fontWeight="800" dx="18">3위</tspan> 박지훈
          <tspan fill="#90a4ae" dx="18">·</tspan>
          <tspan fill="#81d4fa" fontWeight="800" dx="18">4위</tspan> 최동현
        </text>
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
