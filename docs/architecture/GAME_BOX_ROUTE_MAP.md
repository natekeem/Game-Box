# GAME_BOX_ROUTE_MAP.md — 공식 라우팅 및 게임 실행 경로 명세

> **작성 기준**: 실제 `server/http-app.mjs` 및 `tool-box/src/features/game-box/GameBox.js`에 구현·검증된 라우트 체계.

---

## 1. 공식 사용자 접근 라우트 (SPA Entrypoints)

```text
/game-box
    ├── GAME-BOX HOME (메인 헤더 + 3대 진입 카드: RETRO DESKTOP / GAME DECK / DRAW PACK)
    │
/game-box/retro
    ├── Windows 98 RETRO DESKTOP (한글 Windows 98 바탕화면 + 우측 GAME RANKING 창 + 게임 가이드)
    │
/game-box/deck
    ├── GAME DECK (LEFT: 19종 게임 케이스 컬렉션 + CENTER: 통일 대기실 및 콘솔 스테이지 + RIGHT: 랭킹 및 스펙 패널)
    │
/game-box/draw
    └── DRAW PACK (마블 룰렛 추첨기 + 사내 부서/임직원 명단 불러오기/저장 + 실시간 추첨 결과 기록)
```

- **직접 URL 접근 / 새로고침 / 뒤로 가기 지원**:
  - `server/http-app.mjs`에서 `/game-box`, `/game-box/retro`, `/game-box/deck`, `/game-box/draw` 경로 요청 시 모두 `game-box/index.html`을 반환하고, 클라이언트 `GameBox.js`가 `window.location.pathname` 및 `popstate` 이벤트를 감지하여 즉시 해당 화면을 렌더링합니다.
  - Tool Box 본 프로젝트(React Router v6)로 이식할 때도 `<Route path="/game-box/*" element={<GameBox />} />` 형태로 1:1 매핑됩니다.

---

## 2. 내부 게임 런타임 실행 경로 (Iframe Runtime Endpoints)

공식 진입점(`/game-box`)과 별개로, 각 게임 엔진이 iframe 내부에서 독립된 실행 컨텍스트(WebAssembly DOSBox, Pixi.js, Box2D, WebSocket 캔버스 등)를 유지하기 위해 사용하는 내부 정적/동적 경로입니다.

| 게임 구분 | 내부 실행 URL | 호출 주체 | 비고 |
| --- | --- | --- | --- |
| **한글 Windows 98 데스크톱** | `/win98-web/` | `/game-box/retro` (`RetroDesktop.js`) | 기존 `win98-web` 구현체 보존 |
| **한컴타자연습 97** | `/?v=97&embed=win98` | `win98-web` 내부 `HancomTyping97App` (`$Window`) | 외부 CRT 베젤 제거, 창 내부 100% 맞춤 |
| **한메타자교사 3.0** | `/?v=hanme&embed=win98` | `win98-web` 내부 `HanmeTyping30App` (`$Window`) | `hanme-typing-3.jsdos` (`HTT.EXE`) 실행 |
| **피카츄 배구** | `/pikachu-volleyball/ko/index.html?embed=win98` | `win98-web` 내부 `PikachuVolleyballApp` (`$Window`) | 허브 상단바 숨김 및 `postMessage` 브리지 활성화 |
| **Blast Arena (봄버맨)** | `/original-blast-arena/index.html?autobot=1` | `/game-box/deck` (`GameLauncher.js`) | WebSocket 권위 서버 연동 |
| **HTML5 Bombergirl** | `/original-bombergirl/index.html?mode=single` | `/game-box/deck` (`GameLauncher.js`) | 17×13 원본 캔버스 엔진, 사망 후 관전 지원 |
| **Marble Roulette** | `/roulette/index.html` | `/game-box/draw` (`MarbleRouletteView.jsx`) | Box2D-WASM 구슬 추첨기, 사내 명단 연동 |
| **Snake Duel / CatchMind / BattleBox 15종** | `/platform/?game=<gameId>` | `/game-box/deck` (`GameLauncher.js`) | 통일 대기실 (싱글 BOT / 멀티 매칭) |

---

## 3. 레거시 경로 자동 리다이렉트 (`302 Redirect`)

중복 페이지(`hub.html`, `platform.html`, `rankings.html`, `MINESWEEPER_WIN98.html`, `GAME_BOX_V4~V6_PLAYABLE.html`)는 모두 제거되었으며, 이전 북마크로 접근하더라도 `server/http-app.mjs`에서 공식 진입점인 **`/game-box`** 로 자동 `302 Redirect` 처리합니다.

- `/` (쿼리 파라미터 `?v=` 또는 `?embed=`가 없는 일반 접속) &rarr; `302 /game-box`
- `/hub.html` &rarr; `302 /game-box`
- `/platform.html` &rarr; `302 /game-box`
- `/rankings.html` &rarr; `302 /game-box`
