import { ARCADE_GAMES } from '../registry/arcadeGames.js';

export const GAME_DECK_CATEGORIES = Object.freeze([
  { id: 'all', label: 'ALL PACKS (20)' },
  { id: 'ARCADE', label: 'ARCADE ORIGINAL (3)' },
  { id: 'PARTY', label: 'ROULETTE & PARTY (2)' },
  { id: 'BATTLEBOX', label: 'BATTLEBOX COLLECTION (15)' },
]);

export const FUTURE_3D_REFERENCES = Object.freeze([
  {
    repo: 'brayanspagnol/ps2-web',
    license: 'MIT / Open Reference',
    referenceFiles: [
      'public/js/console-scene.js',
      'public/js/crt-tv.js',
      'public/demo-console.html',
    ],
    adoptionScope: '콘솔 본체 트레이 연출, 디스크 삽입/배출 애니메이션 타이밍, 화면 전환 카메라 워크 참고 (PS2 상표/로고 및 에뮬레이터는 제외)',
  },
  {
    repo: 'otisabiburada/finally-3d-game-cases-plugin',
    license: 'BSD-3-Clause / Open Reference',
    referenceFiles: [
      'src/engine.ts',
      'README.md',
      'LICENSE',
    ],
    adoptionScope: '게임 케이스 입체 회전, 선택 시 케이스 개폐 및 디스크 추출 연출 참고 (Steam Deck 플러그인 런타임은 제외)',
  },
]);

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
