# GAME-BOX / GAME DECK 3D 외부 오픈소스 직접 이식 및 인터랙션 구현 보고서

## 1. 개요 (Executive Summary)

GAME-BOX의 `/game-box/deck` 화면에 존재하던 단순 CSS/SVG 기반의 평면적 카드 및 콘솔 목업을 전면 제거하고, 검증된 2개의 외부 오픈소스 엔진을 소스코드 수준에서 직접 이식·통합하여 실감 나는 물리적 3D 게임 케이스 및 콘솔 하드웨어 인터랙션을 구현하였습니다.

---

## 2. 외부 오픈소스 확보 및 라이선스 고지 (Source Provenance & Licenses)

### 2.1 PRIMARY SOURCE — 게임팩 케이스 & 디스크 추출 엔진
- **Repository**: `otisabiburada/finally-3d-game-cases-plugin`
- **GitHub**: https://github.com/otisabiburada/finally-3d-game-cases-plugin
- **License**: **BSD-3-Clause**
- **Git Commit SHA**: `7e748d4bfad4e22ebccb318827724796bfeaf149` (Release v1.11.1)
- **Original Copyright**: Copyright (c) 2026, SANSO
- **보존 원본 위치**:
  - [LICENSE](file:///c:/Users/samsung/OneDrive/문서/Game-box/vendor/finally-3d-game-cases/LICENSE)
  - [README.md](file:///c:/Users/samsung/OneDrive/문서/Game-box/vendor/finally-3d-game-cases/README.md)
- **이식된 핵심 파일**:
  - [FinallyCaseEngine.js](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/cases/FinallyCaseEngine.js): 원본 `src/engine.ts`의 3D 케이스 지오메트리, CSS 생성기(`buildCss`), 절차적 Web Audio 신시사이저(`insertSounds`), Web Animations API(`runInsert`) 완전 이식.
  - [GameCaseCard.jsx](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/cases/GameCaseCard.jsx): `[data-sanso-case="box"]` DOM 구조(6개 면 + 스파인 + 슬리브 + 광택 레이어) React 래퍼.
  - [gameCoverGenerator.js](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/cases/gameCoverGenerator.js): 2:3 물리적 게임팩 규격에 맞춘 20종 타이틀 표지 SVG 생성기.

### 2.2 SECONDARY SOURCE — 콘솔 하드웨어 & 트레이 구동 엔진
- **Repository**: `brayanspagnol/ps2-web`
- **GitHub**: https://github.com/brayanspagnol/ps2-web
- **License**: **BSD-2-Clause**
- **Git Commit SHA**: `654114aed6b85aacb1b3e68793808b3eb3feca13`
- **Original Copyright**: Copyright (c) 2026, Brayan Spagnol
- **보존 원본 위치**:
  - [LICENSE](file:///c:/Users/samsung/OneDrive/문서/Game-box/vendor/ps2-web/LICENSE)
  - [CREDITS.md](file:///c:/Users/samsung/OneDrive/문서/Game-box/vendor/ps2-web/CREDITS.md)
  - [README.md](file:///c:/Users/samsung/OneDrive/문서/Game-box/vendor/ps2-web/README.md)
- **이식된 핵심 파일**:
  - [GameDeckConsoleScene.js](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/console/GameDeckConsoleScene.js): 원본 `public/js/console-scene.js`의 Three.js 콘솔 지오메트리, 전동식 디스크 트레이 열림/닫힘 기구학, 디스크 궤적 보간, LED 전원 인디케이터 이식.
  - [ConsoleView3D.jsx](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/console/ConsoleView3D.jsx): Three.js 씬 라이프사이클 관리 및 명령형 애니메이션 제어 React 컴포넌트.
- **브랜딩 수정 사항**:
  - 타사 상표(Sony, PlayStation, PS2 로고)를 전면 제거하고 독자 브랜드인 **"GAME DECK" / "TOOL-BOX ARCADE DECK"** 캔버스 텍스처로 대체.

---

## 3. 아키텍처 및 상태 머신 (State Machine & Transition Flow)

### 3.1 상태 전이도
```text
           [idle]
             │  (게임팩 클릭)
             ▼
        [selected]
             │  (PLAY 클릭 / 트레이 오픈)
             ▼
        [opening] ──(케이스 -160도 회전 오픈)
             │
             ▼
       [extracting] ──(디스크 상승 및 와블 애니메이션)
             │
             ▼
       [inserting] ──(3D 콘솔 슬롯/트레이로 아크 이동 & 모터 수납)
             │
             ▼
        [booting] ──(콘솔 파워 ON, LED 블루 점등, 부트 시퀀스)
             │
             ▼
         [ready]
             │
             ▼
        [playing] ──(고립된 Sandbox iframe 마운트, 게임 런타임 활성화)
             │  (게임 종료 / EJECT 클릭)
             ▼
        [ejecting] ──(트레이 오픈, 디스크 방출 및 역방향 궤적 비행)
             │
             ▼
       [returning] ──(디스크가 케이스 트레이로 복귀, 케이스 닫힘)
             │
             ▼
        [selected] (컬렉션 진열 복귀)
```

### 3.2 핵심 안전 장치
1. **중복 클릭 방지 (Debounce & Guard)**: 애니메이션 진행 중(`opening`, `extracting`, `inserting`, `booting`, `ejecting`, `returning`)에는 다른 팩 선택이나 조작 버튼 클릭이 상태 머신에 의해 원천 차단됩니다.
2. **모션 감소(prefers-reduced-motion) 지원**: 시스템 설정 또는 토글 시 복잡한 3D 아크 보간을 즉시 건너뛰고 안전한 최종 상태(`ready`/`idle`)로 점진적 전환됩니다.
3. **오디오 안전성**: 외부 오디오 파일 다운로드 없이 브라우저 Web Audio API의 `AudioContext`와 `OscillatorNode` / `BiquadFilterNode`를 조합하여 모터 구동음, 스핀업, 래치 클릭음을 절차적으로 실시간 합성합니다.
4. **기존 시스템 완벽 보존**:
   - `ARCADE_GAMES` 20종 레지스트리 및 iframe 런타임(`GameLauncher.js`) 100% 호환.
   - Retro Desktop, Windows 98, 한컴 타자연습, 피카츄 배구, 백엔드 랭킹 DB API 일체 무영향.

---

## 4. 검증 결과 (Verification Results)

### 4.1 STEP 3: Deck Lab (`/game-box/deck-lab`) 독립 검증
독립된 테스트 환경에서 3종 게임팩(Battle Box, Snake Duel, Bomberman)을 대상으로 인터랙션을 검증하고 Playwright 실 브라우저 스크린샷 8종을 확보하였습니다.

| 번호 | 검증 단계 | 스크린샷 링크 |
|:---:|:---|:---|
| 01 | 기본 입체 배치 (실제 두께, 스파인, 그림자) | [01_default_state_three_cases.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/deck-lab/01_default_state_three_cases.png) |
| 02 | 게임팩 선택 (3D 전진 및 입체 틸트) | [02_case_selected_transformed.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/deck-lab/02_case_selected_transformed.png) |
| 03 | 케이스 오픈 (전면 커버 회전 및 내부 트레이 노출) | [03_case_opening_tray_revealed.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/deck-lab/03_case_opening_tray_revealed.png) |
| 04 | 디스크 추출 (허브 탈착 및 공중 와블) | [04_disc_extraction.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/deck-lab/04_disc_extraction.png) |
| 05 | 슬롯 삽입 (3D 공간 비행 및 콘솔 슬롯 흡입) | [05_disc_insertion_slot_glow.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/deck-lab/05_disc_insertion_slot_glow.png) |
| 06 | 게임 플레이 준비 (부팅 완료 및 파워 LED 점등) | [06_playing_ready_state.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/deck-lab/06_playing_ready_state.png) |
| 07 | 디스크 배출 (슬롯에서 사출되어 케이스 방향 회전) | [07_disc_ejection.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/deck-lab/07_disc_ejection.png) |
| 08 | 복귀 및 케이스 닫힘 (선택 상태 복귀) | [08_returned_to_collection.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/deck-lab/08_returned_to_collection.png) |

### 4.2 STEP 5 ~ 8: GAME DECK 메인 화면 (`/game-box/deck`) 통합 검증
20종 전체 게임팩 진열 선반(Left), 3D 콘솔 & iframe 실행기(Center), 실시간 랭킹 시스템(Right) 3단 레이아웃 통합 검증을 완료하고 10종의 스크린샷을 확보하였습니다.

| 번호 | 통합 검증 시나리오 | 스크린샷 링크 |
|:---:|:---|:---|
| 01 | 20종 3D 케이스 선반 렌더링 확인 | [01_game_deck_main_view.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/01_game_deck_main_view.png) |
| 02 | Snake Duel 선택 및 우측 랭킹 동기화 | [02_game_selected_ranking_sync.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/02_game_selected_ranking_sync.png) |
| 03 | PLAY 클릭 시 케이스 개방 및 디스크 추출 | [03_case_open_disc_extraction.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/03_case_open_disc_extraction.png) |
| 04 | 콘솔 트레이 수납 및 부트 시퀀스 | [04_console_boot_sequence.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/04_console_boot_sequence.png) |
| 05 | 실제 플레이 iframe 마운트 및 실행 | [05_game_iframe_running.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/05_game_iframe_running.png) |
| 06 | 조작법 & 룰 가이드 모달 정상 오픈 | [06_game_controls_guide_modal.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/06_game_controls_guide_modal.png) |
| 07 | 전원 끄기 / EJECT 시 디스크 배출 연출 | [07_game_eject_sequence.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/07_game_eject_sequence.png) |
| 08 | Bomberman 팩 선택 및 랭킹 전환 | [08_switch_to_bomberman.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/08_switch_to_bomberman.png) |
| 09 | Retro Desktop 내비게이션 및 무손상 확인 | [09_retro_desktop_intact.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/09_retro_desktop_intact.png) |
| 10 | Game Deck 재진입 및 상태 안정성 확인 | [10_return_to_deck.png](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/artifacts/game-deck/10_return_to_deck.png) |

### 4.3 자동화 단위/통합 테스트 (59개 전 항목 통과)
`npm test` 실행 결과 기존 53개 회귀 테스트에 더하여 신규 3D 엔진 포팅 및 라이선스 검증 테스트가 모두 정상 통과되었습니다.
```text
✔ 3D 오픈소스 원본 라이선스 및 포팅 메타데이터가 완벽하게 보존되어 있다
  ✔ Finally 3D Game Cases Plugin 라이선스 (BSD-3-Clause) 검증
  ✔ PS2 Web 라이선스 (BSD-2-Clause) 및 CREDITS 검증
  ✔ gameDeckConfig.js에 포팅된 오픈소스 정보 및 Git commit SHA 기록 확인
✔ 포팅된 FinallyCaseEngine 모듈이 원본 engine.ts 핵심 API를 제공한다
✔ 기존 20종의 아케이드 게임 레지스트리가 보존되고 GameDeck 3D 환경에 정상 바인딩된다
...
ℹ tests 59
ℹ pass 59
ℹ fail 0
```

---

## 5. 결론 및 산출물 파일 요약

1. **설정 및 명세**:
   - [gameDeckConfig.js](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/gameDeckConfig.js)
2. **케이스 3D 물리 엔진**:
   - [FinallyCaseEngine.js](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/cases/FinallyCaseEngine.js)
   - [GameCaseCard.jsx](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/cases/GameCaseCard.jsx)
   - [gameCoverGenerator.js](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/cases/gameCoverGenerator.js)
3. **콘솔 3D 하드웨어 엔진**:
   - [GameDeckConsoleScene.js](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/console/GameDeckConsoleScene.js)
   - [ConsoleView3D.jsx](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/console/ConsoleView3D.jsx)
4. **독립 개발 검증실 (STEP 3)**:
   - [DeckLab.jsx](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/lab/DeckLab.jsx)
   - [deckLab.css](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/lab/deckLab.css)
5. **통합 메인 덱 (STEP 7, 8)**:
   - [GameDeck.js](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/deck/GameDeck.js)
   - [gameBox.css](file:///c:/Users/samsung/OneDrive/문서/Game-box/tool-box/src/features/game-box/styles/gameBox.css) (더미 CSS 클래스 정리 완료)
6. **검증 스크립트 및 테스트**:
   - [verify-deck-lab.mjs](file:///c:/Users/samsung/OneDrive/문서/Game-box/scripts/verify-deck-lab.mjs)
   - [verify-game-deck-full.mjs](file:///c:/Users/samsung/OneDrive/문서/Game-box/scripts/verify-game-deck-full.mjs)
   - [game-deck-3d-porting.test.mjs](file:///c:/Users/samsung/OneDrive/문서/Game-box/tests/game-deck-3d-porting.test.mjs)
