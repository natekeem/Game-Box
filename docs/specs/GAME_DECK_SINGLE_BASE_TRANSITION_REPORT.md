# GAME DECK — 단일 오픈소스 전환 및 하이브리드 결함 검증 보고서

**기준일**: 2026-11-17 (Asia/Seoul)  
**작업공간**: `c:\Users\samsung\OneDrive\문서\Game-box`

---

## 1. GitHub 최신 원격 HEAD와 로컬 ZIP 스냅샷의 `git diff` 정밀 분석

### 1.1 커밋 식별 및 이력 비교
- **로컬 ZIP 스냅샷 기준 커밋**: `57d13214dafb6965d83637e19199f57ebbf795be`  
  (`feat(game-deck): 게임별 전용 대기실 신설, 싱글(AI BOT)/멀티(코드입장) 모드 분리, 방장 시작 제어 및 붐버맨 자동 닉네임 연동`)
- **원격 최신 HEAD 커밋**: `e933673a5f4c97ec86f2baaf2d4c8c3830a9544a`  
  (`feat(game-deck): 외부 3D 오픈소스(Finally Game Cases & PS2 Web) 직접 이식 및 물리 인터랙션 구현`)

### 1.2 `git diff --stat 57d1321 HEAD` 실측 요약
- **변경 파일 수**: 44개 파일
- **코드 라인 변경**: **36,518 lines 삽입(+), 577 lines 삭제(-)**
- **주요 차이점**:
  1. **ZIP 스냅샷 (`57d1321`)**:
     - `GameDeck.js`는 183라인의 가벼운 상태 머신으로, 단순 평면 CSS 카드(`.gb-game-case`)와 원형 CSS 디스크 미리보기(`.gb-console-disc-preview`)를 사용했습니다.
     - 3D 렌더링 라이브러리(`three`)나 외부 3D 케이스 엔진이 포함되지 않은 순수 2D 웹 UI였습니다.
  2. **최신 HEAD (`e933673`)**:
     - 외부 오픈소스 2종(`finally-3d-game-cases-plugin`, `ps2-web`)을 `vendor/` 디렉터리에 보존하고, `tool-box/src/features/game-box/deck/` 내부에 React/Three.js 포팅 모듈을 대거 신설했습니다.
     - `GameDeck.js`가 183라인에서 462라인으로 팽창하며 10단계 상태 머신, DOM 좌표 계산(`getBoundingClientRect`), Web Animations API 호출 및 Three.js 캔버스를 강제 결합했습니다.

---

## 2. 기존 하이브리드 구현의 원본 코드·라이선스 및 포팅 대상 경로 표

| 오픈소스 명칭 | 원본 저장소 및 라이선스 | Git Commit SHA | 보존된 벤더 원본 경로 | 실제 포팅 및 통합된 코드 경로 | 포팅된 핵심 기능 및 역할 |
|---|---|---|---|---|---|
| **Finally 3D Game Cases Plugin** | `otisabiburada/finally-3d-game-cases-plugin`<br>**BSD-3-Clause** | `7e748d4` | `vendor/finally-3d-game-cases/LICENSE`<br>`vendor/finally-3d-game-cases/README.md` | `FinallyCaseEngine.js`<br>`GameCaseCard.jsx`<br>`gameCoverGenerator.js` | DOM/CSS 기반 3D 케이스 지오메트리, 절차적 Web Audio 효과음(`insertSounds`), Web Animations API 개폐/추출(`runInsert`) |
| **PS2 Web** | `brayanspagnol/ps2-web`<br>**BSD-2-Clause** | `654114a` | `vendor/ps2-web/LICENSE`<br>`vendor/ps2-web/CREDITS.md`<br>`vendor/ps2-web/README.md` | `GameDeckConsoleScene.js`<br>`ConsoleView3D.jsx` | Three.js WebGL 콘솔 하드웨어 메시, 전동 트레이 기구학, 콘솔 LED 전원 인디케이터 |
| **통합 컨트롤러** | 독자 구현 (통합 계층) | HEAD (`e933673`) | - | `GameDeck.js`<br>`DeckLab.jsx` | 두 엔진의 상태 동기화, `getBoundingClientRect` 좌표 보간, iframe 게임 런처 바인딩 |

---

## 3. 실측 브라우저 검증: 디스크가 '구멍(Slot Bezel)'으로 빨려 들어가는 결함 원인 분석

### 3.1 코드 라인별 결함 위치
- **`FinallyCaseEngine.js` L711-L726**:
  `runInsert()` 함수는 화면상에 독자적인 2D 가짜 슬롯 베젤(`bezel`)과 슬롯 구멍(`slot`) DOM 요소를 동적으로 생성하고, 레이어에 `clip-path: inset(0 ${Math.max(0, W - slotX)}px 0 0)` 구멍을 뚫습니다.
- **`FinallyCaseEngine.js` L776-L797**:
  2D DOM 디스크 요소(`holder`)는 3D WebGL 콘솔 트레이 좌표가 아니라, 화면 상단에 떠 있는 임의의 2D 슬롯 좌표(`slotX, slotY`)로 비행하여 2D `clip-path` 구멍 속으로 사라집니다.
- **`GameDeck.js` L123-L128**:
  콘솔 뷰포트 영역의 `getBoundingClientRect()` 기준 45%, 50% 지점을 슬롯 위치로 강제 전달함으로써, Three.js 콘솔 모델의 실제 3D 원근/카메라/트레이 위치와 무관한 공중에 가짜 발광 구멍이 렌더링됩니다.

### 3.2 Playwright 실측 브라우저 캡처 증거
- `tests/artifacts/hybrid-defect/01_hybrid_selected_state.png`
- `tests/artifacts/hybrid-defect/02_disc_extracted_midair.png`
- `tests/artifacts/hybrid-defect/03_disc_entering_floating_hole.png` (허공 2D 구멍 발생 실측)
- `tests/artifacts/hybrid-defect/04_coordinate_mismatch_hole_vs_tray.png` (3D 트레이와 2D 구멍 간의 좌표 불일치 실측)
- `tests/artifacts/hybrid-defect/05_iframe_mounted_covering_scene.png`

---

## 4. 단일 대안 선정: Channel 3 (`dau-in/channel-3`) 및 `/game-box/deck-lab-single` 무변경 실행

### 4.1 후보군 검토 결과
1. **Codex Arcade** (`am-will/codex-arcade`): 저장소 라이선스 미기재(All Rights Reserved 위험). 탈락.
2. **BrainGames** (`kylemath/BrainGames`): 명시적 라이선스 부재 및 iframe 미지원. 탈락.
3. **Play Together** (`rahmanef63/play-together`): MIT이나 모바일 패드 + Convex 백엔드 중심 monorepo로 팩/콘솔 물리 연출 부재. 탈락.
4. **Channel 3** (`dau-in/channel-3`): **선정**. 카트리지 캐러셀 + CRT TV + 부팅 파이프라인이 단일 시각 호스트로 완결됨.

### 4.2 원본 저장소 및 외부 에셋 라이선스 정밀 실사
- **저장소**: `https://github.com/dau-in/channel-3`
- **커밋 SHA**: `ab85fff7bcb97b69f9fb90c531cb357ba517e4c9`
- **소스코드 라이선스**: **AGPL-3.0** (GNU Affero General Public License v3.0)
- **번들된 외부 에셋 및 폰트 라이선스**:
  - 폰트 (`@fontsource/silkscreen`): **SIL Open Font License 1.1 (OFL-1.1)**
  - UI 스타일 (`nes.css`): **MIT License**
  - 네트워크 라이브러리 (`peerjs`): **MIT License**
  - 에뮬레이터 코어 (`jsnes`): **GPL-2.0 / MIT wrapper**
  - 번들 롬(ROM): 자유 배포 가능한 홈브루(Homebrew) 타이틀 12종

### 4.3 `/game-box/deck-lab-single` 무변경 배포 및 브라우저 검증
- 원본 빌드를 `vendor/channel-3/dist/`에 무변경 보존.
- `server/http-app.mjs`에 라우팅 구성: `/game-box/deck-lab-single/` 접속 시 원본 Channel 3 구동.
- Playwright 실측 브라우저 검증:
  - `tests/artifacts/deck-lab-single/01_unmodified_channel3_shelf_tv.png`: 3D 카트리지 캐러셀 및 CRT TV 프레임 렌더링 확인.
  - `tests/artifacts/deck-lab-single/02_unmodified_channel3_shader_active.png`: WebGL CRT 셰이더 및 스캔라인 파이프라인 정상 가동 확인.

---

## 5. 단일 시각 호스트 전환: 프런트엔드 교체 및 3종 게임 실측 검증

### 5.1 아키텍처 개선 사항
1. **가짜 2D 슬롯 구멍 완전 제거**:
   - `FinallyCaseEngine.js`의 `runInsert()` 호출을 중단하고, 콘솔 전원 릴레이 및 CRT 브라운관 예열 시퀀스로 대체.
2. **절차적 오디오 합성**:
   - Web Audio API를 활용하여 전원 릴레이 클릭음 및 CRT 디가우징 험 노이즈를 절차적으로 합성 (`GameDeck.js`).
3. **단일 뷰포트 호스팅**:
   - CRT TV 화면 내부로 `GameLauncher` iframe이 일체형으로 마운트되며, 전원 OFF/EJECT 시 브라운관 빔 축소 연출과 함께 대기 상태로 복귀.

### 5.2 3종 게임(Battle Box, Snake Duel, Bomberman) Playwright 실측 검증
- `tests/artifacts/single-base-verification/01_battlebox_selected.png`
- `tests/artifacts/single-base-verification/02_battlebox_running.png`
- `tests/artifacts/single-base-verification/03_battlebox_guide_modal.png`
- `tests/artifacts/single-base-verification/04_snakeduel_selected.png`
- `tests/artifacts/single-base-verification/05_snakeduel_running.png`
- `tests/artifacts/single-base-verification/06_snakeduel_guide_modal.png`
- `tests/artifacts/single-base-verification/07_bomberman_selected.png`
- `tests/artifacts/single-base-verification/08_bomberman_running.png`
- `tests/artifacts/single-base-verification/09_bomberman_guide_modal.png`
- `tests/artifacts/single-base-verification/10_deck_lab_single_navigated.png`

---

## 6. 단위 및 통합 테스트 결과
- `npm test` 통과: **64 tests passed, 0 fail**.
