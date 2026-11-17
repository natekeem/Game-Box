import React, { useMemo } from 'react';
import { lookFor, WEAR_CSS } from './FinallyCaseEngine.js';
import { generateArcadeCoverSvg } from './gameCoverGenerator.js';

/**
 * GameCaseCard:
 * Renders a complete 3D game case with full physical dimensions, spine, thickness,
 * shadows, and wear effects according to finally-3d-game-cases DOM structure.
 */
export default function GameCaseCard({
  game,
  isSelected = false,
  onClick,
  onPickup,
  customSettings = {},
  width = 160,
  height = 240,
  className = '',
}) {
  const look = useMemo(() => lookFor(game, customSettings), [game, customSettings]);

  const coverSrc = useMemo(() => {
    if (game.coverUrl && !game.coverUrl.includes('terminal-1997')) {
      return game.coverUrl;
    }
    return generateArcadeCoverSvg(game);
  }, [game]);

  const handleClick = (e) => {
    if (onClick) {
      onClick(game, e);
    }
  };

  return (
    <div
      className={`gb-3d-case-container ${isSelected ? 'selected' : ''} ${className}`}
      data-sanso-cell="1"
      data-sanso-pop="1"
      data-sanso-own="1"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'inline-block',
        margin: '12px 10px',
        verticalAlign: 'middle',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${game.name} 게임팩 선택`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      <div
        className="gb-3d-case-box"
        data-sanso-case="box"
        data-game-id={game.id}
        style={{
          '--c3d-a': look.pal.a,
          '--c3d-b': look.pal.b,
          '--c3d-band': look.pal.band,
          '--c3d-text': look.pal.text,
          '--c3d-line': look.pal.line,
          '--c3d-d': `${look.depthPx}px`,
          '--c3d-r': `${look.shape.radius}px`,
          '--c3d-rim': `${look.shape.rim}px`,
          '--c3d-wear': WEAR_CSS[look.wear] || 'none',
          '--c3d-ang': '32deg',
        }}
      >
        <img
          src={coverSrc}
          alt={game.name}
          loading="eager"
          className="gb-3d-case-cover-img"
        />

        <div data-sanso-faces="1">
          <div data-f="front" />
          <div data-f="spine">
            <span>{game.discLabel || game.name}</span>
          </div>
          <div data-f="top" />
          <div data-f="bottom" />
          <div data-f="right" />
          <div data-f="back" />
          <div data-f="shine" />
        </div>
      </div>
    </div>
  );
}
