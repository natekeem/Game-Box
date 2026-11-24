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
    return (
      <span className="rpz-art-wrap rpz-art-marble">
        <MarbleDisplay />
      </span>
    );
  }
  if (gameId === 'bomb-ladder') {
    return (
      <svg className="rpz-preview-svg rpz-art-ladder" viewBox="0 0 320 200" aria-hidden="true">
        <rect width="320" height="200" rx="6" fill="#141615" />
        {/* Top Player Cards */}
        {[
          { x: 42, name: '김성민', c: '#f43f5e' },
          { x: 101, name: '이지훈', c: '#38bdf8' },
          { x: 160, name: '박수진', c: '#a855f7' },
          { x: 219, name: '최민호', c: '#22c55e' },
          { x: 278, name: '정하늘', c: '#f59e0b' },
        ].map(p => (
          <g key={p.name}>
            <rect x={p.x - 22} y="10" width="44" height="18" rx="4" fill="#242725" stroke={p.c} strokeWidth="1.5" />
            <text x={p.x} y="22" textAnchor="middle" fill="#eee9df" fontSize="8.5" fontWeight="800">{p.name}</text>
            <line x1={p.x} y1="28" x2={p.x} y2="162" stroke="#4b4f4a" strokeWidth="2.5" />
          </g>
        ))}
        {/* Horizontal Rungs */}
        <line x1="42" y1="54" x2="101" y2="54" stroke="#d3a56a" strokeWidth="2.5" />
        <line x1="160" y1="68" x2="219" y2="68" stroke="#d3a56a" strokeWidth="2.5" />
        <line x1="101" y1="94" x2="160" y2="94" stroke="#d3a56a" strokeWidth="2.5" />
        <line x1="219" y1="114" x2="278" y2="114" stroke="#d3a56a" strokeWidth="2.5" />
        <line x1="42" y1="134" x2="101" y2="134" stroke="#d3a56a" strokeWidth="2.5" />
        {/* Semicircular Detour Arches (matching live edit feature!) */}
        <path d="M101 112 Q84 124 101 136" fill="none" stroke="#cf8050" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M278 62 Q296 74 278 86" fill="none" stroke="#cf8050" strokeWidth="2.6" strokeLinecap="round" />
        {/* Active Neon Traces */}
        <path className="rpz-hv-trace" d="M42 28 L42 54 L101 54 L101 94 L160 94 L160 162" fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
        <path className="rpz-hv-trace" d="M219 28 L219 68 L160 68 L160 94 L101 94 L101 134 L42 134 L42 162" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Animated Runner Dots on Hover */}
        <circle className="rpz-hv-runner-1" cx="101" cy="74" r="6" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
        <circle className="rpz-hv-runner-2" cx="160" cy="82" r="6" fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
        <circle className="rpz-hv-spark" cx="160" cy="94" r="5" fill="#facc15" />
        {/* Bottom Outcome Slots */}
        {[42, 101, 160, 219, 278].map((x, idx) => {
          const isBomb = idx === 2 || idx === 3;
          return (
            <g key={x} className={isBomb ? 'rpz-hv-bomb-slot' : ''}>
              <rect x={x - 22} y="166" width="44" height="22" rx="4" fill={isBomb ? 'rgba(155,56,38,0.42)' : '#242725'} stroke={isBomb ? '#d9534f' : '#6ca97a'} strokeWidth="1.5" />
              <text x={x} y="180" textAnchor="middle" fill={isBomb ? '#ffd5cf' : '#cce8d1'} fontSize="8.5" fontWeight="800">
                {isBomb ? '💣 폭탄' : '🛡️ 생존'}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }
  if (gameId === 'lotto-645') {
    return (
      <svg className="rpz-preview-svg rpz-art-lotto" viewBox="0 0 320 200" aria-hidden="true">
        <rect width="320" height="200" rx="6" fill="#151716" />
        {/* Studio Pedestal & Floor */}
        <ellipse cx="144" cy="176" rx="116" ry="18" fill="#1f2220" />
        <path d="M108 154 L180 154 L190 174 L98 174 Z" fill="#2b2e2c" stroke="#cf8050" strokeWidth="1.5" />
        {/* Curved Side-Exit Glass Pipe with Horizontal Elbow */}
        <path d="M144 24 C215 24 252 60 254 128 C255 162 252 178 228 178" fill="none" stroke="#e6dccb" strokeWidth="13" strokeOpacity="0.24" strokeLinecap="round" />
        <ellipse cx="226" cy="178" rx="4" ry="8" fill="none" stroke="#cf8050" strokeWidth="2.2" />
        {/* Top Sliding Mechanical Gate & Aperture Ring */}
        <ellipse cx="144" cy="26" rx="16" ry="5" fill="none" stroke="#d99b43" strokeWidth="2.5" />
        <rect className="rpz-hv-gate" x="110" y="21" width="20" height="5" rx="2" fill="#9b3826" />
        {/* 2 Physical Rotating Mixing Bars */}
        <g className="rpz-hv-paddles">
          <line x1="104" y1="62" x2="184" y2="122" stroke="#d8d3c8" strokeWidth="3.5" opacity="0.72" />
          <line x1="108" y1="126" x2="180" y2="58" stroke="#cf8050" strokeWidth="3.5" opacity="0.82" />
          <circle cx="144" cy="92" r="5" fill="#cf8050" />
        </g>
        {/* Floating 3D Numbered Balls */}
        {[
          { x: 144, y: 44, n: 12, c: '#3b82f6', cls: 'rpz-hv-lball-1' },
          { x: 118, y: 84, n: 7, c: '#eab308', cls: 'rpz-hv-lball-2' },
          { x: 166, y: 78, n: 23, c: '#ef4444', cls: 'rpz-hv-lball-3' },
          { x: 134, y: 112, n: 34, c: '#64748b', cls: 'rpz-hv-lball-1' },
          { x: 160, y: 116, n: 45, c: '#22c55e', cls: 'rpz-hv-lball-2' },
        ].map(b => (
          <g key={b.n} className={`rpz-hv-lball ${b.cls}`}>
            <circle cx={b.x} cy={b.y} r="10.5" fill={b.c} />
            <circle cx={b.x} cy={b.y} r="6.5" fill="#faf6ef" />
            <text x={b.x} y={b.y + 3} textAnchor="middle" fill="#191b1b" fontSize="7.5" fontWeight="900">{b.n}</text>
          </g>
        ))}
        {/* Transparent Acrylic Chamber */}
        <circle cx="144" cy="92" r="64" fill="rgba(244,238,228,0.07)" stroke="#b9b4a8" strokeWidth="2" />
        <ellipse cx="144" cy="92" rx="64" ry="12" fill="none" stroke="#d8d3c8" strokeWidth="1.2" opacity="0.55" />
        {/* Front 6+1 Ball Display Tray (Cleanly Separated from Side Exit) */}
        <rect x="46" y="170" width="184" height="22" rx="4" fill="#222523" stroke="#424642" />
        {[64, 86, 108, 130, 152, 174, 204].map((x, i) => (
          <circle key={x} className={i === 6 ? 'rpz-hv-exit-ball' : ''} cx={x} cy="181" r="7.5" fill={['#eab308', '#3b82f6', '#ef4444', '#64748b', '#22c55e', '#3b82f6', '#eab308'][i]} stroke={i === 6 ? '#facc15' : '#eee9df'} strokeWidth="1.2" />
        ))}
      </svg>
    );
  }
  if (gameId === 'team-draft') {
    return (
      <svg className="rpz-preview-svg rpz-art-draft" viewBox="0 0 320 200" aria-hidden="true">
        <rect width="320" height="200" rx="6" fill="#141615" />
        {/* LIVE PICK Spotlight Bar */}
        <g className="rpz-hv-draft-bar">
          <rect x="14" y="10" width="292" height="32" rx="5" fill="#252826" stroke="#cf8050" strokeWidth="1.5" />
          <rect x="22" y="18" width="60" height="16" rx="3" fill="#cf8050" />
          <text x="52" y="29" textAnchor="middle" fill="#191b1b" fontSize="8" fontWeight="900">LIVE PICK #5</text>
          <text x="184" y="30" textAnchor="middle" fill="#eee9df" fontSize="11" fontWeight="800">🔥 김성민 ➔ ALPHA 팀</text>
        </g>
        {/* 3 Team Columns with Power Bars & Captain Crowns */}
        {[
          { x: 14, title: '🔥 ALPHA', c: '#cf8050', m: ['👑 박수진', '김성민', '이지훈'] },
          { x: 114, title: '⚡ BRAVO', c: '#d3a56a', m: ['👑 류현진', '최민호', '정하늘'] },
          { x: 214, title: '🛡️ CHARLIE', c: '#6ca97a', m: ['👑 오승환', '강동원', '한지민'] },
        ].map((t, tIdx) => (
          <g key={t.title} className={`rpz-hv-team-col rpz-hv-team-${tIdx}`}>
            <rect x={t.x} y="50" width="92" height="140" rx="5" fill="rgba(37,40,38,0.85)" stroke={t.c} strokeWidth="1.5" />
            <text x={t.x + 8} y="67" fill={t.c} fontSize="9.5" fontWeight="900">{t.title}</text>
            {/* Power Bar */}
            <rect x={t.x + 8} y="73" width="76" height="4" rx="2" fill="#191b1b" />
            <rect className="rpz-hv-power-bar" x={t.x + 8} y="73" width="64" height="4" rx="2" fill={t.c} />
            {t.m.map((name, idx) => (
              <g key={name}>
                <rect x={t.x + 8} y={84 + idx * 32} width="76" height="24" rx="3" fill="#191b1b" stroke={idx === 0 ? t.c : '#3c403c'} />
                <text x={t.x + 14} y={99 + idx * 32} fill="#eee9df" fontSize="9" fontWeight="700">{name}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
    );
  }
  if (gameId === 'chaos-wheel') {
    return (
      <svg className="rpz-preview-svg rpz-art-wheel" viewBox="0 0 320 200" aria-hidden="true">
        <rect width="320" height="200" rx="6" fill="#161817" />
        {/* 3D Brushed Stand Base */}
        <rect x="94" y="168" width="32" height="14" fill="#3b332c" />
        <rect x="66" y="180" width="88" height="10" rx="4" fill="#252220" stroke="#c9945a" strokeWidth="1.5" />
        {/* 3D Metallic Bezel */}
        <circle cx="110" cy="100" r="76" fill="#3a2d22" stroke="#d3a56a" strokeWidth="4" />
        {/* Spinning Wheel Disc + 8 Slice Boundary Pegs */}
        <g className="rpz-hv-wheel-spin">
          <g transform="translate(110, 100)">
            <path d="M0 0 L0 -68 A68 68 0 0 1 60 -34 Z" fill="#f4a261" />
            <path d="M0 0 L60 -34 A68 68 0 0 1 60 34 Z" fill="#e76f51" />
            <path d="M0 0 L60 34 A68 68 0 0 1 0 68 Z" fill="#2a9d8f" />
            <path d="M0 0 L0 68 A68 68 0 0 1 -60 34 Z" fill="#e9c46a" />
            <path d="M0 0 L-60 34 A68 68 0 0 1 -60 -34 Z" fill="#264653" />
            <path d="M0 0 L-60 -34 A68 68 0 0 1 0 -68 Z" fill="#ffb703" />
            {/* Rotating Rim Pegs */}
            {[0, 60, 120, 180, 240, 300].map(deg => (
              <rect
                key={deg}
                x="-2.5"
                y="-70"
                width="5"
                height="9"
                rx="2.5"
                fill="#fff6df"
                stroke="#1c1915"
                strokeWidth="1.2"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>
        </g>
        {/* Center SPIN Hub */}
        <circle cx="110" cy="100" r="18" fill="#9b3826" stroke="#f7ecd6" strokeWidth="2.5" />
        <text x="110" y="104" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">SPIN</text>
        {/* Mechanical Top Flapper Pointer */}
        <g className="rpz-hv-flapper">
          <polygon points="110,34 101,15 119,15" fill="#cf8050" stroke="#181614" strokeWidth="1.8" />
          <circle cx="110" cy="21" r="2.8" fill="#222" stroke="#f5d59c" strokeWidth="1" />
        </g>
        {/* Winner Result Card Preview */}
        <g className="rpz-hv-winner-card">
          <rect x="200" y="54" width="106" height="92" rx="6" fill="#222523" stroke="#cf8050" strokeWidth="1.5" />
          <text x="212" y="74" fill="#d3a56a" fontSize="8" fontWeight="900">WINNER</text>
          <text x="212" y="100" fill="#eee9df" fontSize="15" fontWeight="900">박수진</text>
          <text x="212" y="116" fill="#b9b4a8" fontSize="8">공정 확률 12.5%</text>
          <rect x="212" y="126" width="82" height="12" rx="2" fill="#9b3826" />
        </g>
      </svg>
    );
  }
  return (
    <svg className="rpz-preview-svg rpz-art-box" viewBox="0 0 320 200" aria-hidden="true">
      <rect width="320" height="200" rx="6" fill="#161817" />
      {/* Left: 3D Walnut & Acrylic Lottery Box */}
      <g className="rpz-hv-mbox" transform="translate(20, 48)">
        <polygon points="10,22 96,22 114,6 28,6" fill="#5e412c" stroke="#d3a56a" strokeWidth="1.5" />
        <ellipse cx="62" cy="14" rx="22" ry="6" fill="#191b1b" stroke="#d3a56a" strokeWidth="2" />
        {/* Folded slip peeking out */}
        <g className="rpz-hv-mslip">
          <rect x="52" y="-10" width="20" height="24" rx="1.5" fill="#fbf4e3" stroke="#bfa57b" strokeWidth="1" transform="rotate(-8 62 2)" />
          <rect x="54" y="-3" width="16" height="4" fill="#9b3826" transform="rotate(-8 62 2)" />
        </g>
        <rect x="10" y="22" width="86" height="94" fill="#3a281c" stroke="#d3a56a" strokeWidth="2" />
        <polygon points="96,22 114,6 114,100 96,116" fill="#2d1f16" stroke="#d3a56a" strokeWidth="1.5" />
        {/* Acrylic Viewing Window + Folded 3D Slips */}
        <rect x="20" y="34" width="66" height="70" fill="rgba(250,245,235,0.12)" stroke="#8c7a62" />
        <rect x="28" y="84" width="22" height="10" rx="1" fill="#f7eed8" transform="rotate(-12 39 89)" />
        <rect x="48" y="88" width="22" height="10" rx="1" fill="#ead5a8" transform="rotate(14 59 93)" />
        <rect x="36" y="76" width="22" height="10" rx="1" fill="#f2e3be" transform="rotate(5 47 81)" />
      </g>
      {/* Flight Arc */}
      <path d="M98 34 Q138 10 166 50" fill="none" stroke="#cf8050" strokeWidth="2" strokeDasharray="4 3" />
      {/* Right: 3-Fold Realistic Parchment Slip with Crease Lines */}
      <g className="rpz-hv-parchment" transform="translate(166, 36)">
        <rect width="136" height="128" rx="4" fill="#f5ebd6" stroke="#c7b28a" strokeWidth="1.8" />
        <line x1="0" y1="28" x2="136" y2="28" stroke="#bfa57b" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="0" y1="102" x2="136" y2="102" stroke="#bfa57b" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="68" y1="28" x2="68" y2="102" stroke="rgba(92,65,32,0.22)" strokeWidth="2" />
        <text x="68" y="18" textAnchor="middle" fill="#6b4e2b" fontSize="8" fontWeight="800">DRAW SLIP · NO.02</text>
        <text x="68" y="64" textAnchor="middle" fill="#1f1b16" fontSize="13" fontWeight="900">🏆 1등 당첨!</text>
        <rect x="44" y="76" width="48" height="16" rx="2" fill="none" stroke="#9b3826" strokeWidth="1.5" transform="rotate(-4 68 84)" />
        <text x="68" y="87" textAnchor="middle" fill="#9b3826" fontSize="8" fontWeight="900" transform="rotate(-4 68 84)">당첨 확정</text>
      </g>
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
