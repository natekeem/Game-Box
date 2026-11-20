# GAME_BOX_GAME_INVENTORY.md — 전체 게임 목록 및 기술 검증 현황

> **작성 기준**: 프로젝트 내 실제 소스 코드, 실행 URL, 화면 비율, 입력 장치, 기록 이벤트 지원 여부를 전수 확인하여 작성함.

---

## 1. RETRO DESKTOP 핵심 게임 (3종) + 내장 고전 게임

| ID | 게임명 | 소스 경로 | 실행 URL | iframe 동작 | 화면 비율 | 입력 장치 | 기록/이벤트 지원 현황 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `hancom-typing-97` | **한컴타자연습 97** | `original-player-src/` (`_HTTD_.EXE`) | `/?v=97&embed=win98` | 정상 (`HancomTyping97App`) | `4:3` | Keyboard (`Shift+Space` 한/영) | `game:start`, `game:progress`(`HTP.SCO`/`HTT.STA`), `game:complete`(자리연습 픽셀 자동 감지 + 세션 측정 기록), `game:abort` |
| `hanme-typing-30` | **한메타자교사 3.0** | `original-player-src/` (`HTT.EXE`) | `/?v=hanme&embed=win98` | 정상 (`HanmeTyping30App`) | `4:3` | Keyboard (`Shift+Space` 한/영) | `game:start`, `game:complete`(베네치아/단문/장문/자리/낱말 세션 측정 기록), `game:abort` |
| `pikachu-volleyball` | **피카츄 배구** | `pikachu-volleyball-src/` | `/pikachu-volleyball/ko/index.html?embed=win98` | 정상 (`PikachuVolleyballApp`) | `432:304` (약 `4:3`) | Keyboard (방향키+Enter/Z, RDFG+Z) | `game:start`, `game:complete`(AI 대전 승리/패배·점수·소요시간 자동 전송), `game:abort`(중도 퇴장 감지) |
| `minesweeper` | **지뢰 찾기 (Win98 내장)** | `vendor/win98-web-original/src/apps/minesweeper/` | Win98 내부 네이티브 실행 | 해당 없음 (`$Window` 직접 렌더링) | 고정 창 (`200×280` 등) | Mouse (좌/우클릭) | Win98 내부 로컬 최고 기록 저장 |
| `pinball` | **3D 핀볼 (Space Cadet)** | `vendor/win98-web-original/src/apps/pinball/` | `/win98-web/games/pinball/index.html` | 정상 (`PinballApp`) | `4:3` (`620×480`) | Keyboard (`Space`, `Z`, `/`) | 플레이 지원 (우선 기록 대상 3종 외 보조 게임) |

---

## 2. GAME DECK 아케이드 컬렉션 (19종)

| # | ID | 게임명 (케이스 코드) | 장르 | 소스 경로 | 실행 URL | iframe 호환 | 화면 비율 | 입력 장치 | 점수·승패·기록 지원 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `bomberman` | **Blast Arena (봄버맨)** (`BLST-001`) | ARCADE ACTION | `vendor/blast-arena-original/` | `/original-blast-arena/index.html?autobot=1` | O | `16:9` | Keyboard (WASD/방향키+Space) | WebSocket 권위 서버 승패 판정 |
| 2 | `bombergirl` | **HTML5 Bombergirl** (`BMbg-002`) | CLASSIC ARCADE | `vendor/html5-bombergirl-original/` | `/original-bombergirl/index.html?mode=single` | O | `4:3` (스케일업) | Keyboard (방향키+Space) | 싱글 AI 3인 대결, 사망 후 관전 지원 |
| 3 | `snakeduel` | **Snake Duel** (`SNKD-003`) | ARCADE DUEL | `vendor/snake-duel-original/` | `/platform/?game=snakeduel` | O | `3:2` (`30×20`) | Keyboard (방향키/WASD) | `platform_matches` 점수/승패 저장 |
| 4 | `drawing` | **CatchMind (캐치마인드)** (`CTCH-005`) | PARTY QUIZ | `platform-src/components/GamePlayStage.jsx` | `/platform/?game=drawing` | O | `16:10` | Mouse(드로잉), Keyboard(채팅) | `platform_matches` 점수/승패 저장 |
| 5 | `reaction` | **Reaction Battle (순발력 대결)** (`BBOX-101`) | BATTLEBOX SPEED | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=reaction` | O | `16:10` | Mouse, Keyboard | `platform_matches` 점수/승패 저장 |
| 6 | `speedtyping` | **Speed Typing (스피드 타이핑)** (`BBOX-102`) | BATTLEBOX SPEED | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=speedtyping` | O | `16:10` | Keyboard | `platform_matches` 점수/승패 저장 |
| 7 | `colormatch` | **Color Match (컬러 매치)** (`BBOX-103`) | BATTLEBOX SPEED | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=colormatch` | O | `16:10` | Mouse, Keyboard | `platform_matches` 점수/승패 저장 |
| 8 | `connectfour` | **Connect Four (사목)** (`BBOX-104`) | BATTLEBOX STRATEGY | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=connectfour` | O | `4:3` | Mouse | `platform_matches` 점수/승패 저장 |
| 9 | `tictactoe` | **Tic Tac Toe (틱택토)** (`BBOX-105`) | BATTLEBOX STRATEGY | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=tictactoe` | O | `4:3` | Mouse | `platform_matches` 점수/승패 저장 |
| 10 | `memorymatch` | **Memory Match (기억력 대결)** (`BBOX-106`) | BATTLEBOX MEMORY | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=memorymatch` | O | `16:10` | Mouse | `platform_matches` 점수/승패 저장 |
| 11 | `simonsays` | **Simon Says (사이먼 세이즈)** (`BBOX-107`) | BATTLEBOX MEMORY | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=simonsays` | O | `16:10` | Mouse | `platform_matches` 점수/승패 저장 |
| 12 | `wordchain` | **Word Chain (영단어 끝말잇기)** (`BBOX-108`) | BATTLEBOX WORD | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=wordchain` | O | `16:10` | Keyboard | `platform_matches` 점수/승패 저장 |
| 13 | `anagram` | **Anagram Sprint (아나그램)** (`BBOX-109`) | BATTLEBOX WORD | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=anagram` | O | `16:10` | Keyboard | `platform_matches` 점수/승패 저장 |
| 14 | `mathduel` | **Math Duel (수학 대결)** (`BBOX-110`) | BATTLEBOX MATH | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=mathduel` | O | `16:10` | Keyboard, Mouse | `platform_matches` 점수/승패 저장 |
| 15 | `numberhunt` | **Number Hunt (넘버 헌트)** (`BBOX-111`) | BATTLEBOX MATH | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=numberhunt` | O | `16:10` | Mouse | `platform_matches` 점수/승패 저장 |
| 16 | `rpsarena` | **RPS Arena (가위바위보)** (`BBOX-112`) | BATTLEBOX CLASSIC | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=rpsarena` | O | `16:10` | Mouse | `platform_matches` 점수/승패 저장 |
| 17 | `trivia` | **Trivia Challenge (스피드 퀴즈)** (`BBOX-113`) | BATTLEBOX TRIVIA | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=trivia` | O | `16:10` | Mouse | `platform_matches` 점수/승패 저장 |
| 18 | `higherlower` | **Higher or Lower (하이 로우)** (`BBOX-114`) | BATTLEBOX SPEED | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=higherlower` | O | `16:10` | Mouse | `platform_matches` 점수/승패 저장 |
| 19 | `oddoneout` | **Odd One Out (다른 그림 찾기)** (`BBOX-115`) | BATTLEBOX STRATEGY | `battlebox/games/` & `server/platform-realtime.mjs` | `/platform/?game=oddoneout` | O | `16:10` | Mouse | `platform_matches` 점수/승패 저장 |

---

## 3. DRAW PACK 뽑기 · 이벤트 추첨 컬렉션 (1종)

| # | ID | 게임명 (식별 코드) | 장르 | 소스 경로 | 실행 URL | iframe 호환 | 화면 비율 | 입력 장치 | 지원 기능 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `roulette` | **Marble Roulette (마블 룰렛)** (`DRAW-001`) | PHYSICS PARTY | `roulette-src/` | `/game-box/draw` (`MarbleRouletteView.jsx`) | O | `16:9` | Mouse, Keyboard | Box2D-WASM 물리 구슬 추첨, 사내 부서/임직원 명단 불러오기, 프리셋 저장, 당첨 기록 보존 |
