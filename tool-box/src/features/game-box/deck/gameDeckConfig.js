import { ARCADE_GAMES } from '../registry/arcadeGames.js';

export const GAME_DECK_CATEGORIES = Object.freeze([
  { id: 'all', label: 'ALL PACKS (20)' },
  { id: 'ARCADE', label: 'ARCADE ORIGINAL (3)' },
  { id: 'PARTY', label: 'ROULETTE & PARTY (2)' },
  { id: 'BATTLEBOX', label: 'BATTLEBOX COLLECTION (15)' },
]);

export const PORTED_3D_ENGINES = Object.freeze([
  {
    name: 'PS2 Web 3D Console Engine',
    repo: 'brayanspagnol/ps2-web',
    license: 'BSD-2-Clause',
    commit: '654114aed6b85aacb1b3e68793808b3eb3feca13',
    copyright: 'Copyright (c) 2026, Brayan Spagnol',
    portedFiles: [
      'public/js/console-scene.js',
      'public/demo-console.html',
      'LICENSE',
      'CREDITS.md',
    ],
    adoptionScope: 'Three.js 기반 3D 콘솔 하드웨어 모델, 모터 트레이 구동, 디스크 삽입/배출 애니메이션, LED 전원 상태, 카메라 조작',
  },
  {
    name: 'Finally 3D Game Cases Plugin',
    repo: 'otisabiburada/finally-3d-game-cases-plugin',
    license: 'BSD-3-Clause',
    commit: '7e748d4bfad4e22ebccb318827724796bfeaf149',
    copyright: 'Copyright (c) 2026, SANSO',
    portedFiles: [
      'src/engine.ts',
      'README.md',
      'LICENSE',
    ],
    adoptionScope: '3D 게임 케이스 입체 기하학, 스파인/두께/광택/슬리브/그림자 렌더링, Web Audio 합성 효과음, Web Animations API 케이스 개폐 및 디스크 추출 연출',
  },
]);

// Backward compatibility alias
export const FUTURE_3D_REFERENCES = PORTED_3D_ENGINES;

export function filterDeckGames(categoryFilter = 'all', query = '') {
  return ARCADE_GAMES.filter(game => {
    if (categoryFilter !== 'all' && !game.genre.includes(categoryFilter)) {
      return false;
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      return (
        game.name.toLowerCase().includes(q) ||
        game.subtitle.toLowerCase().includes(q) ||
        game.genre.toLowerCase().includes(q) ||
        game.discLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });
}
