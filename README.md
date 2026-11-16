# TOOL BOX — GAME-BOX 통합 게임 플랫폼

**GAME-BOX**는 1990년대 컴퓨터실 감성의 **한글 Windows 98 레트로 데스크톱(`RETRO DESKTOP`)**과 20종 멀티/아케이드 게임팩을 콘솔에 삽입해 즐기는 **아케이드 콘솔 덱(`GAME DECK`)**을 단일 진입점(`/game-box`)으로 통합한 웹 게임 시스템입니다.

---

## 1. 빠른 시작 (Quick Start)

```powershell
# 의존성 설치
npm install

# 서버 시작 (자동으로 http://127.0.0.1:8765/game-box 오픈)
npm start
```

Windows 환경에서는 루트 폴더의 **`START_GAME_BOX.cmd`** 파일을 더블클릭하여 바로 실행할 수도 있습니다.

### 공식 라우트 구조
| 경로 | 화면 설명 |
| --- | --- |
| **`/game-box`** | **GAME-BOX 메인 홈** — 상단 Tool Box 헤더(닉네임 등록/변경) 및 좌우 2대 진입 카드 (`RETRO DESKTOP` / `GAME DECK`) |
| **`/game-box/retro`** | **RETRO DESKTOP (한글 Windows 98)** — `한컴타자연습 97`, `한메타자교사 3.0`, `피카츄 배구`, `게임 가이드`, 우측 고정 `GAME RANKING` 창 |
| **`/game-box/deck`** | **GAME DECK (아케이드 컬렉션)** — 20종 게임 케이스 컬렉션 + 중앙 콘솔 디스플레이(온디맨드 실행) + 우측 랭킹/스펙 패널 |

> 루트(`/`) 및 구 버전 경로(`/hub.html`, `/platform.html`, `/rankings.html`)로 접속 시 공식 진입점인 **`/game-box`** 로 자동 리다이렉트됩니다.

---

## 2. 프로젝트 디렉터리 구조

```text
Game-box/
├── tool-box/src/features/game-box/   # [프런트엔드 통합 모듈] Tool Box 본 프로젝트 이식용 React 피처
│   ├── GameBox.js                    # 라우터(/game-box, /game-box/retro, /game-box/deck) 및 닉네임 모달
│   ├── GameBoxHome.js / GameBoxHome.css
│   ├── identity/                     # GameIdentityProvider & guestIdentity (UUID + 닉네임 분리)
│   ├── registry/                     # retroGames.js (3종) & arcadeGames.js (20종)
│   ├── retro/                        # RetroDesktop.js, RetroRankingWindow.js, RetroGameGuide.js
│   ├── deck/                         # GameDeck.js, gameDeckConfig.js
│   ├── runtime/                      # GameLauncher.js, GameEventBridge.js, gameAdapters/
│   ├── ranking/                      # rankingApi.js, rankingUtils.js
│   └── styles/gameBox.css
│
├── vendor/win98-web-original/        # [RETRO DESKTOP 소스] 한글 Windows 98 데스크톱 (Vite + os-gui + ZenFS)
│   ├── src/apps/hancom-typing-97/    # 한컴타자연습 97 창 앱
│   ├── src/apps/hanme-typing-30/     # 한메타자교사 3.0 창 앱
│   ├── src/apps/pikachu-volleyball/  # 피카츄 배구 창 앱
│   ├── src/apps/retro-ranking/       # 우측 자동 배치 GAME RANKING 창 앱
│   ├── src/apps/retro-game-guide/    # Windows 98 도움말 스타일 게임 가이드 앱
│   └── src/system/game-box-win98-bridge.js
│
├── original-player-src/              # [DOS 타자 런타임 소스] 한컴 97(_HTTD_.EXE) & 한메 3.0(HTT.EXE) js-dos 플레이어
├── pikachu-volleyball-src/           # [피카츄 배구 소스] 1997 SACHI SOFT 웹 복원판 (AI 대전 / 2P 로컬 / P2P)
├── roulette-src/                     # [마블 룰렛 소스] Box2D-WASM 물리 추첨기
├── battlebox/                        # [배틀박스 15종] 실시간/BOT 미니게임 엔진
├── platform-src/                     # [아케이드 러너] 스네이크 듀얼 / 캐치마인드 / 배틀박스 스테이지
├── vendor/                           # [아케이드 원본 보존] blast-arena-original, html5-bombergirl-original, snake-duel-original
│
├── server/                           # [백엔드 & SQLite DB]
│   ├── http-app.mjs                  # 통합 HTTP/WebSocket/SSE 서버 및 정적 라우터
│   ├── game-box-store.mjs            # game_players, game_sessions, game_results 저장소 및 랭킹 집계
│   ├── platform-store.mjs            # 아케이드 매치/이벤트 저장소
│   └── platform-realtime.mjs         # 실시간 룸 및 AI BOT 엔진
│
├── scripts/                          # 빌드 및 서버 구동 스크립트 모음
├── tests/                            # Node.js 내장 테스트 러너 검증 스위트 (npm test)
└── docs/                             # 아키텍처, 스펙, 엔진 상세 문서
```

---

## 3. 문서 안내 (`docs/`)

전체 설계 및 기술 명세 문서는 [`docs/README.md`](docs/README.md)에서 확인할 수 있습니다.

- **아키텍처 (`docs/architecture/`)**
  - [`GAME_BOX_AUDIT.md`](docs/architecture/GAME_BOX_AUDIT.md) — 프로젝트 구조 분석 및 정리 내역
  - [`GAME_BOX_ROUTE_MAP.md`](docs/architecture/GAME_BOX_ROUTE_MAP.md) — 공식 라우팅 및 게임 실행 경로 명세
  - [`GAME_BOX_GAME_INVENTORY.md`](docs/architecture/GAME_BOX_GAME_INVENTORY.md) — 레트로 3종 + 아케이드 20종 전체 게임 인벤토리
  - [`CORPORATE_PORTAL_INTEGRATION.md`](docs/architecture/CORPORATE_PORTAL_INTEGRATION.md) — 호스트 포털 이식 및 로그인 Identity 연동 가이드
- **시스템 명세 (`docs/specs/`)**
  - [`GAME_BOX_EVENT_CONTRACT.md`](docs/specs/GAME_BOX_EVENT_CONTRACT.md) — 공통 게임 이벤트(`game:start`, `game:progress`, `game:complete`, `game:abort`) 규격
  - [`GAME_BOX_RANKING_SPEC.md`](docs/specs/GAME_BOX_RANKING_SPEC.md) — DB 스키마(SQLite / MySQL 8.x) 및 `/api/game-box/*` API 명세
  - [`GAME_DECK_IMPLEMENTATION_PLAN.md`](docs/specs/GAME_DECK_IMPLEMENTATION_PLAN.md) — GAME DECK 콘솔 아키텍처 및 향후 3D 연출 로드맵
- **엔진 및 원본 검증 (`docs/engines/`)**
  - [`ORIGINAL_97_RUNTIME.md`](docs/engines/ORIGINAL_97_RUNTIME.md) — 한컴타자연습 97 원본 검증 및 js-dos 런타임
  - [`HANCOM97_RECORDS.md`](docs/engines/HANCOM97_RECORDS.md) — `HTP.SCO` / `HTT.STA` 원본 기록 스냅샷 브리지
  - [`ORIGINAL_ARCADE_PROVENANCE.md`](docs/engines/ORIGINAL_ARCADE_PROVENANCE.md) — 스네이크 듀얼 / 봄버맨 / 봄버걸 원본 보존 기준

---

## 4. 빌드 및 테스트 명령어

```powershell
# 전체 게임 및 통합 엔트리 빌드
npm run build:all

# 개별 타겟 빌드
npm run build:gamebox   # /game-box 통합 셸 빌드
npm run build:win98     # /win98-web/ 한글 Windows 98 데스크톱 빌드
npm run build:original  # 한컴 97 / 한메 3.0 js-dos 런타임 빌드
npm run build:platform  # 아케이드 게임 러너 빌드

# 전체 자동화 테스트 실행
npm test
```
