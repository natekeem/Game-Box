import React from 'react';
import { useGameIdentity } from './identity/GameIdentityProvider.js';
import { RETRO_GAMES } from './registry/retroGames.js';
import { ARCADE_GAMES } from './registry/arcadeGames.js';
import { DRAW_GAMES } from './registry/drawGames.js';

/**
 * GAME-BOX HOME (/game-box)
 * 닉네임을 정하고 세 개의 게임팩 중 하나로 입장합니다.
 *  - RETRO DESKTOP : 한글 Windows 98 추억의 게임
 *  - GAME DECK     : 콘솔 덱에서 즐기는 아케이드 · 파티 게임
 *  - DRAW PACK     : 뽑기 · 추첨 게임
 */
export default function GameBoxHome({ onNavigate }) {
  const { identity, openNicknameModal } = useGameIdentity();

  const packs = [
    {
      id: 'retro',
      route: '/game-box/retro',
      kicker: 'CLASSIC GAMES',
      title: 'RETRO DESKTOP',
      icon: '🪟',
      tagline: '한글 Windows 98 바탕화면에서 즐기는 추억의 게임',
      items: ['한컴타자연습 97', '한메타자교사 3.0', '피카츄 배구', '실시간 GAME RANKING'],
      count: `${RETRO_GAMES.length}종`,
      cta: '데스크톱 열기',
    },
    {
      id: 'deck',
      route: '/game-box/deck',
      kicker: 'ARCADE COLLECTION',
      title: 'GAME DECK',
      icon: '🎮',
      tagline: 'CD 케이스를 고르고 콘솔에 넣어 시작하는 아케이드 · 파티 게임',
      items: ARCADE_GAMES.slice(0, 4).map(g => g.name.replace(/\s*\(.*\)/, '')).concat('외 다수'),
      count: `${ARCADE_GAMES.length}종`,
      cta: '콘솔 열기',
    },
    {
      id: 'draw',
      route: '/game-box/draw',
      kicker: 'LUCKY DRAW',
      title: 'DRAW PACK',
      icon: '🎲',
      tagline: '구슬 레이스로 공정하게 뽑는 추첨 · 뽑기 게임',
      items: DRAW_GAMES.map(g => g.shortName),
      count: `${DRAW_GAMES.length}종`,
      cta: '뽑기 시작',
    },
  ];

  return (
    <div className="gb-home-container">
      <section className="gb-home-hero">
        <div>
          <span className="gb-home-kicker">WELCOME TO GAME-BOX</span>
          <h2 className="gb-home-heading">닉네임을 정하고 게임팩을 선택하세요</h2>
          <p className="gb-home-subtext">
            여기서 정한 닉네임이 모든 게임팩의 대기실과 랭킹에 자동으로 사용됩니다.
            게임에 들어가면 싱글(컴퓨터 대결) 또는 멀티(즉시 매칭 · 참여 코드)를 고를 수 있어요.
          </p>
        </div>
        <div className="gb-home-player">
          <span className="gb-home-player-label">PLAYER</span>
          <strong className="gb-home-player-name">👤 {identity.nickname || '닉네임 미등록'}</strong>
          <button type="button" className="gb-home-player-btn" onClick={openNicknameModal}>
            {identity.isRegistered ? '닉네임 변경' : '닉네임 등록'}
          </button>
        </div>
      </section>

      <div className="gb-home-cards-grid">
        {packs.map(pack => (
          <article
            key={pack.id}
            className={`gb-entry-card gb-entry-card-${pack.id}`}
            role="button"
            tabIndex={0}
            onClick={() => onNavigate(pack.route)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate(pack.route);
              }
            }}
          >
            <div className="gb-card-top-meta">
              <span className="gb-card-subtitle">{pack.kicker}</span>
              <span className="gb-card-count">{pack.count}</span>
            </div>

            <div className="gb-card-visual" aria-hidden="true">
              <span>{pack.icon}</span>
            </div>

            <h3 className="gb-card-title">{pack.title}</h3>
            <p className="gb-card-desc">{pack.tagline}</p>

            <ul className="gb-card-items">
              {pack.items.map(item => <li key={item}>{item}</li>)}
            </ul>

            <span className="gb-card-cta">{pack.cta} →</span>
          </article>
        ))}
      </div>
    </div>
  );
}
