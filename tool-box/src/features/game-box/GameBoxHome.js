import React from 'react';
import { RETRO_GAMES } from './registry/retroGames.js';
import { ARCADE_GAMES } from './registry/arcadeGames.js';

/**
 * GAME-BOX HOME (/game-box)
 * Official single entrypoint displaying two large entry cards under the main header:
 * - LEFT: RETRO DESKTOP (CLASSIC GAMES — Windows 98 Computer Lab)
 * - RIGHT: GAME DECK (ARCADE COLLECTION — Console & Game Cases)
 */
export default function GameBoxHome({ onNavigate }) {
  const featuredDeckCases = ARCADE_GAMES.slice(0, 6);

  return (
    <div className="gb-home-container">
      <div className="gb-home-intro-bar">
        <div>
          <span className="gb-home-kicker">UNIFIED WORKSPACE ARCADE &amp; RETRO SYSTEM</span>
          <h2 className="gb-home-heading">원하는 게임 공간을 선택하세요</h2>
        </div>
        <p className="gb-home-subtext">
          1990년대 한글 Windows 98 바탕화면에서 즐기는 타자·피카츄배구 랭킹전부터
          현대적인 콘솔 덱 기반의 20종 아케이드 컬렉션까지 하나의 시스템으로 연결됩니다.
        </p>
      </div>

      <div className="gb-home-cards-grid">
        {/* LEFT CARD — RETRO DESKTOP */}
        <article
          className="gb-entry-card gb-entry-card-retro"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('/game-box/retro')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('/game-box/retro');
            }
          }}
        >
          <div className="gb-card-top-meta">
            <div>
              <span className="gb-card-subtitle">CLASSIC GAMES</span>
              <h3 className="gb-card-title">RETRO DESKTOP</h3>
            </div>
            <span className="gb-card-era-badge gb-badge-win98">WINDOWS 98 EDITION</span>
          </div>

          {/* Authentic Windows 98 Preview Frame */}
          <div className="gb-retro-preview-window">
            <div className="gb-win98-titlebar">
              <span className="gb-win98-titlebar-text">🪟 한글 Windows 98 — 레트로 게임 &amp; GAME RANKING</span>
              <div className="gb-win98-controls">
                <span>_</span>
                <span>□</span>
                <span>×</span>
              </div>
            </div>
            <div className="gb-win98-desktop-stage">
              <img
                src="/assets/win98-retro-desktop-preview.png"
                alt="한글 Windows 98 바탕화면 및 한컴타자연습·한메타자·피카츄배구 실행 화면"
                className="gb-win98-screenshot"
              />
              <div className="gb-win98-icon-strip">
                {RETRO_GAMES.map(g => (
                  <div key={g.id} className="gb-win98-mini-icon">
                    <span className="gb-win98-icon-dot">▣</span>
                    <span>{g.name}</span>
                  </div>
                ))}
                <div className="gb-win98-mini-icon">
                  <span className="gb-win98-icon-dot">📖</span>
                  <span>게임 가이드</span>
                </div>
                <div className="gb-win98-mini-icon">
                  <span className="gb-win98-icon-dot">🏆</span>
                  <span>GAME RANKING</span>
                </div>
              </div>
            </div>
          </div>

          <p className="gb-card-desc">
            1990년대 컴퓨터실과 한글 Windows 98 바탕화면 환경을 그대로 체험하는 공간입니다.
            <strong> 한컴타자연습 97</strong>, <strong>한메타자교사 3.0</strong>, <strong>피카츄 배구</strong>와
            우측 고정 <strong>GAME RANKING</strong> 창을 통해 실시간 종목별 TOP 10 순위를 겨룹니다.
          </p>

          <div className="gb-card-footer">
            <div className="gb-card-specs">
              <span>수록: 타자 2종 · 피카츄 배구 · 지뢰찾기 · 핀볼</span>
              <span>실시간 랭킹 창 연동</span>
            </div>
            <span className="gb-card-cta gb-cta-retro">
              RETRO DESKTOP 진입 &rarr;
            </span>
          </div>
        </article>

        {/* RIGHT CARD — GAME DECK */}
        <article
          className="gb-entry-card gb-entry-card-deck"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('/game-box/deck')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('/game-box/deck');
            }
          }}
        >
          <div className="gb-card-top-meta">
            <div>
              <span className="gb-card-subtitle">ARCADE COLLECTION</span>
              <h3 className="gb-card-title">GAME DECK</h3>
            </div>
            <span className="gb-card-era-badge gb-badge-deck">20 ARCADE PACKS</span>
          </div>

          {/* Graphite & Brushed Silver Console + Game Cases Preview */}
          <div className="gb-deck-preview-stage">
            <div className="gb-deck-console-bezel">
              <div className="gb-deck-console-header">
                <span className="gb-deck-console-led" />
                <span className="gb-deck-console-label">CONSOLE DISPLAY // ACTIVE COLLECTION</span>
                <span className="gb-deck-console-slot">SLOT READY</span>
              </div>
              <div className="gb-deck-screen-collage">
                <div className="gb-deck-screen-main">
                  <img
                    src="/pikachu-volleyball/resources/assets/images/screenshot.png"
                    alt="Game Deck Console Display Preview"
                    className="gb-deck-screen-img"
                  />
                  <div className="gb-deck-screen-overlay">
                    <span>BLAST ARENA · SNAKE DUEL · BOMBERGIRL · BATTLEBOX 15</span>
                  </div>
                </div>
                <div className="gb-deck-cases-rack">
                  {featuredDeckCases.map(c => (
                    <div
                      key={c.id}
                      className="gb-mini-game-case"
                      style={{ '--case-color': c.caseColor }}
                    >
                      <span className="gb-mini-case-code">{c.discLabel}</span>
                      <strong className="gb-mini-case-name">{c.name}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="gb-card-desc">
            다크 그래파이트 콘솔과 실버 데크에 게임팩 케이스를 삽입해 즐기는 현대적인 아케이드 컬렉션입니다.
            <strong> 봄버맨(Blast Arena)</strong>, <strong>스네이크 듀얼</strong>, <strong>봄버걸</strong>,
            <strong> 마블 룰렛</strong>, <strong>배틀박스 15종</strong>을 지원합니다.
          </p>

          <div className="gb-card-footer">
            <div className="gb-card-specs">
              <span>수록: 아케이드 3종 · 파티 2종 · 배틀박스 15종</span>
              <span>콘솔 덱 &amp; 멀티 로비 지원</span>
            </div>
            <span className="gb-card-cta gb-cta-deck">
              GAME DECK 진입 &rarr;
            </span>
          </div>
        </article>
      </div>
    </div>
  );
}
