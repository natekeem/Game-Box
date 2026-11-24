import React from 'react';
import { RETRO_GAMES } from './registry/retroGames.js';
import { ARCADE_GAMES } from './registry/arcadeGames.js';
import { DRAW_GAMES } from './registry/drawGames.js';
import { getGameCaseCoverSrc } from './deck/cases/gameCoverGenerator.js';

function DrawLobbyDisplay() {
  return (
    <span className="gb-lobby-draw-set" aria-hidden="true">
      <svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" className="gb-lobby-draw-svg">
        <defs>
          <radialGradient id="gbDrawGlass" cx="36%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#fff8ea" stopOpacity="0.45" />
            <stop offset="48%" stopColor="#d8cdb8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#1b1815" stopOpacity="0.46" />
          </radialGradient>
          <linearGradient id="gbDrawBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8c38d" />
            <stop offset="55%" stopColor="#c7884e" />
            <stop offset="100%" stopColor="#7a4c28" />
          </linearGradient>
          <linearGradient id="gbDrawWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#69452e" />
            <stop offset="100%" stopColor="#352216" />
          </linearGradient>
          <linearGradient id="gbDrawPaper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbf4e3" />
            <stop offset="100%" stopColor="#e5d3b0" />
          </linearGradient>
          <filter id="gbDrawShadow" x="-15%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="6" dy="12" stdDeviation="8" floodColor="#18120d" floodOpacity="0.58" />
          </filter>
        </defs>

        {/* Ground cast shadows */}
        <ellipse cx="145" cy="238" rx="84" ry="16" fill="#1b1410" opacity="0.55" />
        <ellipse cx="262" cy="240" rx="64" ry="14" fill="#1b1410" opacity="0.55" />

        {/* Physical 3D-Styled Lotto Glass Sphere Machine (Left-Center) */}
        <g filter="url(#gbDrawShadow)">
          {/* Pedestal Base */}
          <path d="M98,200 L192,200 L204,232 L86,232 Z" fill="#2a2824" stroke="#4f483e" strokeWidth="1.5" />
          <ellipse cx="145" cy="200" rx="50" ry="9" fill="url(#gbDrawBrass)" />
          <rect x="131" y="182" width="28" height="18" rx="3" fill="#cfc7b8" />

          {/* Top Brass Funnel & Curved Chute */}
          <path d="M145,42 C145,22 208,22 216,74 C223,120 220,174 205,212" fill="none" stroke="#e9dec9" strokeOpacity="0.35" strokeWidth="14" strokeLinecap="round" />
          <path d="M145,42 C145,22 208,22 216,74 C223,120 220,174 205,212" fill="none" stroke="#f7eedd" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="145" cy="48" rx="18" ry="6" fill="url(#gbDrawBrass)" />

          {/* Mixing Paddle Bars Inside Sphere */}
          <g className="gb-draw-paddles">
            <line x1="94" y1="90" x2="196" y2="162" stroke="#c8c0b2" strokeWidth="5" strokeLinecap="round" opacity="0.72" />
            <line x1="194" y1="88" x2="96" y2="164" stroke="url(#gbDrawBrass)" strokeWidth="5" strokeLinecap="round" opacity="0.78" />
            <circle cx="145" cy="126" r="8" fill="url(#gbDrawBrass)" />
          </g>

          {/* Warm Numbered Lotto Balls */}
          <g className="gb-draw-balls">
            <g className="gb-draw-ball gb-draw-ball-1">
              <circle cx="118" cy="148" r="15" fill="#d9a438" />
              <circle cx="118" cy="148" r="8.5" fill="#fbf4e4" />
              <text x="118" y="151.5" textAnchor="middle" fill="#1e1b18" fontSize="10" fontWeight="900">7</text>
            </g>

            <g className="gb-draw-ball gb-draw-ball-2">
              <circle cx="150" cy="156" r="15" fill="#4f7496" />
              <circle cx="150" cy="156" r="8.5" fill="#fbf4e4" />
              <text x="150" y="159.5" textAnchor="middle" fill="#1e1b18" fontSize="9.5" fontWeight="900">19</text>
            </g>

            <g className="gb-draw-ball gb-draw-ball-3">
              <circle cx="176" cy="142" r="14.5" fill="#b84a39" />
              <circle cx="176" cy="142" r="8" fill="#fbf4e4" />
              <text x="176" y="145.5" textAnchor="middle" fill="#1e1b18" fontSize="9.5" fontWeight="900">28</text>
            </g>

            <g className="gb-draw-ball gb-draw-ball-4">
              <circle cx="134" cy="112" r="14.5" fill="#528264" />
              <circle cx="134" cy="112" r="8" fill="#fbf4e4" />
              <text x="134" y="115.5" textAnchor="middle" fill="#1e1b18" fontSize="9.5" fontWeight="900">42</text>
            </g>

            <g className="gb-draw-ball gb-draw-ball-5">
              <circle cx="163" cy="96" r="13.5" fill="#cf8050" />
              <circle cx="163" cy="96" r="7.5" fill="#fbf4e4" />
              <text x="163" y="99.5" textAnchor="middle" fill="#1e1b18" fontSize="9" fontWeight="900">11</text>
            </g>

            <g className="gb-draw-ball gb-draw-ball-6">
              <circle cx="106" cy="120" r="13" fill="#6b706d" />
              <circle cx="106" cy="120" r="7.2" fill="#fbf4e4" />
              <text x="106" y="123.5" textAnchor="middle" fill="#1e1b18" fontSize="8.5" fontWeight="900">35</text>
            </g>
          </g>

          {/* Smoked Glass Chamber Shell & Specular Highlight */}
          <circle cx="145" cy="126" r="74" fill="url(#gbDrawGlass)" stroke="#efe4ce" strokeOpacity="0.52" strokeWidth="2.5" />
          <path d="M96,92 A62,62 0 0,1 140,63" fill="none" stroke="#fff9ee" strokeOpacity="0.62" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* Tactile Tilted Walnut & Brass Mystery Draw Box + Folded Paper Slip (Right Foreground) */}
        <g transform="translate(262 186)" filter="url(#gbDrawShadow)">
          <g className="gb-draw-box">
            {/* Box Top Perspective Face */}
            <polygon points="-48,-36 48,-36 36,-58 -36,-58" fill="#774e34" stroke="#d3a56a" strokeWidth="2" />
            {/* Circular Hand-Hole Slot */}
            <ellipse cx="0" cy="-47" rx="18" ry="6.5" fill="#1d1510" stroke="#e4bc82" strokeWidth="2.2" />

            {/* Folded Parchment Paper Slip Rising Out of the Hole */}
            <g className="gb-draw-slip">
              <g transform="translate(2 -64) rotate(-11)">
                <polygon points="-16,18 16,18 22,-22 -12,-22" fill="url(#gbDrawPaper)" stroke="#bfa67e" strokeWidth="1.2" />
                <line x1="-13" y1="-2" x2="19" y2="-2" stroke="#b99c70" strokeWidth="1.2" strokeDasharray="3 2" />
                <rect x="-11" y="-15" width="22" height="6" rx="1" fill="#9b3826" opacity="0.88" />
              </g>
            </g>

            {/* Box Front Walnut Frame + Acrylic Window */}
            <rect x="-48" y="-36" width="96" height="84" rx="4" fill="url(#gbDrawWood)" stroke="#d3a56a" strokeWidth="2.5" />
            <rect x="-36" y="-24" width="72" height="60" rx="2" fill="#231a14" stroke="#c89b62" strokeWidth="1.5" />

            {/* Visible Folded Slips Piled Inside Acrylic Window */}
            <g opacity="0.92">
              <rect x="-26" y="16" width="26" height="9" rx="1.5" fill="#f3e5c8" transform="rotate(-8 -13 20)" />
              <rect x="-2" y="18" width="28" height="9" rx="1.5" fill="#e8d2a6" transform="rotate(6 12 22)" />
              <rect x="-18" y="6" width="25" height="8.5" rx="1.5" fill="#faf1df" transform="rotate(9 -5 10)" />
              <rect x="4" y="4" width="24" height="8.5" rx="1.5" fill="#eddab6" transform="rotate(-11 16 8)" />
            </g>
            {/* Acrylic Glass Glare */}
            <polygon points="-36,-24 6,-24 -22,36 -36,36" fill="#fff8ea" opacity="0.1" />
          </g>
        </g>

        {/* Extracted Front Display Ball Accent */}
        <g filter="url(#gbDrawShadow)">
          <g className="gb-draw-front-ball">
            <circle cx="195" cy="228" r="14" fill="#d9a438" stroke="#1e1b18" strokeWidth="1.2" />
            <circle cx="195" cy="228" r="8" fill="#fbf4e4" />
            <text x="195" y="231.5" textAnchor="middle" fill="#1e1b18" fontSize="9.5" fontWeight="900">1</text>
          </g>
        </g>
      </svg>
    </span>
  );
}

const rooms = [
  { id: 'deck', title: '게임팩 대여점', description: '선반에서 게임팩을 골라 콘솔에 디스크를 넣어보세요.', count: ARCADE_GAMES.length },
  { id: 'retro', title: '레트로 PC방', description: 'Windows 98에서 다시 만나는 추억의 게임.', count: RETRO_GAMES.length },
  { id: 'draw', title: '추첨 게임', description: '오늘의 주인공을 뽑아보세요.', count: DRAW_GAMES.length },
];

export default function GameBoxHome({ onNavigate }) {
  return (
    <main className="gb-lobby">
      <div className="gb-lobby-intro">
        <h1>GAME<span>BOX</span></h1>
        <p>오늘은 어디에서 놀까요?</p>
      </div>
      <div className="gb-room-grid">
        {rooms.map(room => (
          <button key={room.id} type="button" className={`gb-room gb-room-${room.id}`}
            onClick={() => onNavigate(`/game-box/${room.id}`)}>
            <span className="gb-room-art" aria-hidden="true">
              {room.id === 'deck' && (
                <span className="gb-lobby-cases">
                  {[ARCADE_GAMES[0], ARCADE_GAMES[2], ARCADE_GAMES[3]].map(game => (
                    <img key={game.id} src={getGameCaseCoverSrc(game)} alt="" />
                  ))}
                </span>
              )}
              {room.id === 'retro' && <span className="gb-lobby-monitor" style={{ '--retro-preview': 'url(/assets/win98-retro-desktop-preview.png)' }}><span /></span>}
              {room.id === 'draw' && <DrawLobbyDisplay />}
            </span>
            <span className="gb-room-copy">
              <span className="gb-room-count">게임 {room.count}개</span>
              <strong>{room.title}</strong>
              <span>{room.description}</span>
              <span className="gb-room-arrow" aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
