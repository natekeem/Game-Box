# GAME_BOX_AUDIT.md — 기존 프로젝트 구조 및 게임 시스템 전수 조사 보고서

> **작성 시각**: 2026-11-17
> **조사 원칙**: 추측을 배제하고 현재 저장소(`Game-box`)의 실제 파일·빌드 스크립트·런타임·DB 스키마를 직접 확인하여 기록함.

---

## 1. 프로젝트 기술 스택 현황 (실제 저장소 vs 이식 대상 호스트)

| 구분 | 현재 저장소 (`Game-box` 독립 실행 환경) | 향후 이식 대상 (`Tool Box` 본 프로젝트) | 통합/호환 설계 방향 |
| --- | --- | --- | --- |
| **Frontend** | React 호환 JSX (`platform-src/`, `tool-box/src/features/game-box/`) + Vanilla JS (`win98-web`, `original-player-src`, `pikachu-volleyball-src`) | React 18 / JavaScript (`src/features/game-box/`) | `tool-box/src/features/game-box/`에 권장 아키텍처 모듈을 구성하고, `esbuild` 번들러로 `/game-box` 단일 진입점에서도 동일하게 구동 |
| **Build** | `esbuild` (`scripts/build-platform.mjs`), `vite` (`vendor/win98-web-original`), `webpack` (`pikachu-volleyball-src`, `roulette-src`) | CRA + CRACO | 외부 빌드 산출물(`/win98-web/`, `/pikachu-volleyball/`, `/roulette/`, `/?v=97`, `/?v=hanme`)은 정적 경로로 유지하고 React 셸이 `/game-box` 라우트를 제어 |
| **Router** | URL Pathname & History API (`/game-box`, `/game-box/retro`, `/game-box/deck`) | React Router v6 | React Router `<Routes>` 및 독립 실행 History 라우터 양쪽 모두 지원 |
| **Backend** | Node.js 24 내장 HTTP + WebSocket + SSE (`server/http-app.mjs`) | FastAPI (Python) | `/api/game-box/*` 표준 REST API 엔드포인트를 구현하고, FastAPI + MySQL 이식용 스키마/라우터 명세를 `GAME_BOX_RANKING_SPEC.md`에 1:1 정의 |
| **Database** | Node.js 내장 `node:sqlite` (`data/game-box.sqlite`) | MySQL 8.x | `game_players`, `game_sessions`, `game_results` 테이블을 SQLite에 실제 구현·검증하고 MySQL DDL 및 마이그레이션 명세 제공 |

---

## 2. 전체 폴더 및 파일 구조 분석

```text
Game-box/
├── tool-box/src/features/game-box/   # [호스트 이식용] Tool Box React 피처 모듈 디렉터리
│   ├── GameBox.js / GameBox.css      # 초기 프로토타입 (커스텀 캔버스 타자/지뢰찾기 엔진 - 현재 레거시)
│   ├── gameBoxEngine.js / minefield.js # 초기 프로토타입 내장 엔진 (레거시)
│   ├── Hancom97Original.jsx          # 한컴 97 js-dos React 래퍼
│   ├── HancomMultiVersion.jsx        # 멀티 버전 전환 실험 컴포넌트
│   └── hancom97RecordBridge.js       # HTP.SCO / HTT.STA 추출 브리지
│
├── original-player-src/              # [사용 중] DOS 타자연습 원본 실행기 소스 -> 빌드 시 hancom97-original/ 생성
│   ├── index.html / player.js / player.css
│   ├── multi-version-manager.js      # ?v=97 (한컴타자연습 97), ?v=hanme (한메타자교사 3.0) 전환 및 ?embed=win98 지원
│   ├── hancom97-telemetry.js         # 한컴 97 자리연습 프레임 픽셀 감지 및 완료 이벤트(hancom97-attempt) 발생기
│   ├── auth-client.js                # 기존 토큰/오프라인 큐 클라이언트
│   └── rankings.html / rankings.js   # 기존 독립 랭킹 페이지
│
├── hancom97-original/                # [사용 중 / 빌드 산출물] 서버의 기본 staticRoot
│   ├── hancom-typing-1997.jsdos      # 검증된 _HTTD_.EXE + 30개 원본 데이터 번들
│   └── hanme-typing-3.jsdos          # 한메타자교사 3.0 (HTT.EXE) 번들
│
├── hanme30-original/                 # [보조/중복] 한메타자교사 3.0 단독 플레이어 폴더 (현재 통합 플레이어 /?v=hanme 로 대체 가능)
│
├── pikachu-volleyball-src/           # [사용 중] 피카츄 배구 원본 웹 이식 소스 (Webpack)
├── pikachu-volleyball/               # [사용 중 / 빌드 산출물] /pikachu-volleyball/ko/index.html
│
├── vendor/win98-web-original/        # [사용 중] 한글 Windows 98 데스크톱 소스 (Vite + os-gui + ZenFS)
│   ├── src/apps/hancom-typing-97/    # 한컴타자연습 97 Windows 98 창 앱
│   ├── src/apps/hanme-typing-30/     # 한메타자교사 3.0 Windows 98 창 앱
│   ├── src/apps/pikachu-volleyball/  # 피카츄 배구 Windows 98 창 앱
│   └── src/apps/minesweeper/ 등      # 내장 Windows 98 보조프로그램 및 고전 게임
├── win98-web/                        # [사용 중 / 빌드 산출물] /win98-web/ 정적 배포본
│
├── platform-src/                     # [사용 중] 멀티플레이/아케이드 20종 플랫폼 React 소스
│   ├── GamePlatformApp.jsx           # 아케이드/배틀박스 20종 로비 및 대기실
│   ├── registry.js                   # 20종 게임 메타데이터
│   └── components/                   # GamePlayStage.jsx, OriginalArcadeArenas.jsx, MarbleRouletteView.jsx 등
├── platform/                         # [사용 중 / 빌드 산출물] /platform/ 번들
│
├── roulette-src/ & roulette/         # [사용 중] Box2D-WASM 마블 룰렛 소스 및 빌드 산출물
├── battlebox/                        # [사용 중] BattleBox 15종 미니게임 원본 레포지토리
├── vendor/                           # [사용 중] 오픈소스 아케이드 게임 원본 보존 폴더
│   ├── blast-arena-original/         # Bomberman (Blast Arena) 원본 (2~4인 & COM-BOT)
│   ├── html5-bombergirl-original/    # HTML5 Bombergirl 원본 (1~2인)
│   ├── snake-duel-original/          # Snake Duel 원본 (2인)
│   └── bomberman-multiplayer-original/ # [미사용/비교보관] 아이템 미지원으로 미사용
│
└── server/                           # [사용 중] 백엔드 서버 및 SQLite 저장소
    ├── http-app.mjs                  # 메인 HTTP 라우터 및 정적 파일 서버
    ├── ranking-store.mjs             # 고전 게임 기록/랭킹 SQLite 저장소
    ├── platform-store.mjs            # 아케이드 20종 매치/이벤트 SQLite 저장소
    ├── platform-realtime.mjs         # 아케이드 게임 SSE 실시간 룸/BOT 엔진
    ├── original-blast-arena-adapter.mjs # Bomberman WebSocket & HTTP 어댑터
    └── original-bombergirl-adapter.mjs  # Bombergirl 중계 어댑터
```

---

## 3. 중복 컴포넌트·진입점 조사 및 사용/미사용 구분

### 3.1 진입점(Entrypoint) 중복 현황
현재 게임에 접근하는 진입점이 여러 개로 분산되어 있습니다.
1. `/` (`hancom97-original/index.html`) — 한컴 97 / 한메 3.0 / 지뢰찾기 / 한컴 2007 탭 플레이어
2. `/hub.html` — 초기 5종 게임 카드 허브 페이지
3. `/platform/` 및 `/platform.html` — 사내 미니게임 20종 플랫폼 로비
4. `/win98-web/` — 한글 Windows 98 데스크톱 직접 진입 경로
5. `/rankings.html` — 기존 한컴 97 중심 랭킹/조직/이벤트 페이지

👉 **조치 계획**:
- 공식 진입점을 **`/game-box`** 로 단일화하고 하위 라우트 **`/game-box/retro`**, **`/game-box/deck`** 을 제공합니다.
- 기존 `/hub.html`, `/platform.html` 등은 호환성을 위해 유지하되 `/game-box`로의 안내 또는 리다이렉트를 제공하고, 내부 iframe 실행 경로(`/?v=97&embed=win98`, `/?v=hanme&embed=win98`, `/pikachu-volleyball/ko/index.html?embed=win98`, `/win98-web/`, `/original-blast-arena/` 등)는 게임 런타임 경로로서 안전하게 보존합니다.

### 3.2 사용 파일 vs 미사용(레거시) 파일 구분

| 파일 / 디렉터리 | 상태 | 판단 근거 및 처리 방침 |
| --- | --- | --- |
| `GAME_BOX_V4_PLAYABLE.html`, `V5`, `V6` | **미사용 (레거시 단일 HTML)** | 초기 프로토타입 단일 HTML 파일(각 1.3MB). 삭제하지 않고 레거시 보관하되 공식 라우트에서 제외 |
| `MINESWEEPER_WIN98.html`, `original-player-src/minesweeper.html` | **레거시/보조** | `win98-web` 내부에 네이티브 `MinesweeperApp`이 존재함. 기존 링크 호환용으로만 파일 유지 |
| `tool-box/src/features/game-box/gameBoxEngine.js`, `minefield.js` | **미사용 (초기 모작 엔진)** | 원본 DOS 에뮬레이션 도입 이전의 자체 캔버스 모작 코드. 신규 통합 아키텍처(`GameBoxHome`, `RetroDesktop`, `GameDeck` 등)로 `tool-box/src/features/game-box/`를 재구성 |
| `hanme30-original/` | **중복 실행기** | `hancom97-original/?v=hanme`와 동일한 `hanme-typing-3.jsdos`를 실행함. 파일은 보존하되 공식 실행은 통합 플레이어(`/?v=hanme&embed=win98`) 사용 |
| `vendor/bomberman-multiplayer-original/` | **미사용 (비교 보관)** | `docs/ORIGINAL_ARCADE_PROVENANCE.md`에 명시된 대로 아이템 시스템이 없어 `blast-arena-original`로 대체됨 |

---

## 4. 기존 게임 실행 상태 및 기록 수집 현황

1. **한컴타자연습 97 (`hancom-typing-97`)**:
   - 실행 경로: `/?v=97&embed=win98` (js-dos 8.5.3 WASM DOSBox에서 `_HTTD_.EXE` 구동)
   - 기록 수집 현황:
     - `hancom97-telemetry.js`: 자리연습 키 하이라이트 및 완료 대화상자 픽셀을 실시간 감지하여 타수(`speed`), 정확도(`accuracy`), 소요시간(`elapsedMs`)을 추출해 `hancom97-attempt` 이벤트 발생.
     - `record-bridge.js`: DOS 종료/진행 중 생성되는 `HTP.SCO`(330B, 점수 기록), `HTT.STA`(11,718B, 통계 기록) 파일 변경을 감지해 스냅샷 저장 및 복원.
2. **한메타자교사 3.0 (`hanme-typing-30`)**:
   - 실행 경로: `/?v=hanme&embed=win98` (js-dos 8.5.3 WASM DOSBox에서 `HTT.EXE` 구동)
   - 기록 수집 현황:
     - DOSBox `CommandInterface`가 `window.hanmeCommandInterface`에 연결됨. 세션 시작/종료 시간, 플레이 시간(`durationMs`), 키 입력 활동량 및 DOS 내부 파일/화면 상태 기반 어댑터 연동 필요.
3. **피카츄 배구 (`pikachu-volleyball`)**:
   - 실행 경로: `/pikachu-volleyball/ko/index.html?embed=win98`
   - 기록 수집 현황:
     - `pikachu-volleyball-src/src/resources/js/main_online.js`의 `handleGameEnd()`에서 AI 대전(15점 내기) 종료 시 승패(`isWinner`), 점수(`p1Score`, `comScore`, `finalScore`), 플레이 시간(`elapsedMs`)을 계산하여 `/api/attempts`로 전송 중.
     - 로컬 2인 대전 및 P2P 온라인 대전에 대해서도 공통 이벤트 규격(`game:start`, `game:complete`, `game:abort`) 및 `postMessage` 브리지 연동 가능.
4. **아케이드 / GAME DECK 컬렉션 (20종)**:
   - `platform-src/registry.js` 및 `server/platform-realtime.mjs`에 정의된 20종:
     - **아케이드 원본 3종**: `snakeduel` (스네이크 듀얼), `bomberman` (봄버맨 Blast Arena), `bombergirl` (봄버걸 클래식)
     - **추첨/파티 2종**: `roulette` (마블 룰렛), `drawing` (캐치마인드)
     - **BattleBox 15종**: `reaction`, `speedtyping`, `colormatch`, `tictactoe`, `memorymatch`, `simonsays`, `wordchain`, `anagram`, `mathduel`, `numberhunt`, `rpsarena`, `trivia`, `connectfour`, `higherlower`, `oddoneout`
