import React, { useState } from 'react';
import { DRAW_GAMES } from '../registry/drawGames.js';
import GameLauncher from '../runtime/GameLauncher.js';

/**
 * DRAW PACK (/game-box/draw)
 * 뽑기 · 추첨 게임팩. 게임을 고르면 통합 대기실(/platform)이 열립니다.
 */
export default function DrawPack({ onNavigate }) {
  const [activeId, setActiveId] = useState(null);
  const activeGame = DRAW_GAMES.find(g => g.id === activeId) || null;

  return (
    <div className="gb-draw-shell">
      {activeGame ? (
        <div className="gb-draw-stage">
          <GameLauncher
            title={activeGame.name}
            src={activeGame.launchUrl}
            aspectRatio={activeGame.aspectRatio}
            onClose={() => setActiveId(null)}
          />
        </div>
      ) : (
        <div className="gb-draw-body">
          <div className="gb-draw-intro">
            <span className="gb-home-kicker">LUCKY DRAW COLLECTION</span>
            <h2>뽑기 게임을 선택하세요</h2>
            <p>추첨 · 팀 나누기 · 순서 정하기 — 한 번의 클릭으로 공정하게 결정합니다.</p>
          </div>

          <div className="gb-draw-grid">
            {DRAW_GAMES.map(game => (
              <button
                key={game.id}
                type="button"
                className="gb-draw-card"
                style={{ '--case-color': game.caseColor }}
                onClick={() => setActiveId(game.id)}
              >
                <span className="gb-draw-card-icon">{game.icon}</span>
                <span className="gb-draw-card-genre">{game.genre}</span>
                <strong className="gb-draw-card-title">{game.shortName}</strong>
                <span className="gb-draw-card-sub">{game.subtitle}</span>
                <p>{game.description}</p>
                <span className="gb-draw-card-cta">입장 →</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
