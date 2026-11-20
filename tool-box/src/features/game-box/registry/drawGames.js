/**
 * DRAW PACK — 뽑기 · 추첨 게임팩 레지스트리
 * 모든 게임은 /platform 통합 대기실을 통해 실행됩니다.
 */
export const DRAW_GAMES = Object.freeze([
  {
    id: 'roulette',
    name: 'Marble Roulette (마블 룰렛)',
    shortName: '마블 룰렛',
    subtitle: 'Box2D 물리 구슬 레이스 추첨기',
    genre: 'DRAW · PHYSICS',
    icon: '🔮',
    caseColor: '#db2777',
    discLabel: 'MRBL-004',
    playersLabel: '1~100명 추첨',
    sourcePath: 'roulette-src/ & roulette/index.html',
    launchUrl: '/platform/?game=roulette',
    directUrl: '/roulette/index.html',
    aspectRatio: '16:9',
    description: '참가자 이름을 입력하고 구슬 레이스로 당첨자를 공정하게 뽑는 물리 추첨기입니다.',
  },
]);
