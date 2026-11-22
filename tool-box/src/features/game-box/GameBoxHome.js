import React from 'react';
import { RETRO_GAMES } from './registry/retroGames.js';
import { ARCADE_GAMES } from './registry/arcadeGames.js';
import { DRAW_GAMES } from './registry/drawGames.js';
import { getGameCaseCoverSrc } from './deck/cases/gameCoverGenerator.js';
import { MarbleDisplay } from './draw/DrawPack.js';

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
              {room.id === 'draw' && <MarbleDisplay />}
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
