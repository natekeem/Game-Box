# GAME-BOX 참고 저장소 및 디렉터리 구조 가이드

본 문서는 **TOOL BOX — GAME-BOX** 프로젝트에 통합/포팅되거나 참고된 오픈소스 라이브러리 및 벤더 저장소(Reference Repositories) 목록과 프로젝트 전체 디렉터리 구조를 체계적으로 정리합니다.

---

## 1. 참고 및 벤더 오픈소스 저장소 목록 (Reference Repositories)

GAME-BOX는 검증된 오픈소스 프로젝트들을 원본 그대로 보존(`vendor/`)하거나 플랫폼 아키텍처에 맞게 안전하게 포팅하여 단일 진입점(`/game-box`) 환경으로 통합했습니다.

| 구분 | 저장소 / 디렉터리 경로 | 기술 스택 | 라이선스 | 원본 정보 및 역할 |
|---|---|---|---|---|
| **OS 셸** | `vendor/win98-web-original/`<br>`win98-web/` | Vite, OS.js, os-gui, ZenFS | **MIT** | **Windows 98 웹 데스크톱 복원판**<br>한글 Windows 98 데스크톱 환경을 브라우저에 구동하며, 한컴 97, 한메 3.0, 피카츄 배구, 게임 가이드 창을 통합 실행합니다. |
| **봄버맨 1** | `vendor/blast-arena-original/` | picojs, HTML5 Canvas, WebSocket | **MIT / ISC** | **Blast Arena (레트로 아케이드 봄버맨)**<br>그리드 기반 폭탄 배틀 아레나 원본입니다. 닉네임 동기화 및 전용 어댑터(`original-blast-arena-adapter.mjs`)를 통해 무한 리셋 방지 및 컴팩트 로비를 지원합니다. |
| **봄버맨 2** | `vendor/html5-bombergirl-original/` | EaselJS (CreateJS), Canvas | **MIT** | **HTML5 Bombergirl (캐주얼 봄버걸)**<br>EaselJS 2D 캔버스 엔진 기반입니다. 반응형 캔버스 확대, 마우스 스케일 보정, 사망 후 관전 모드 및 대기실 복귀 브리지를 연동했습니다. |
| **스네이크** | `vendor/snake-duel-original/` | Vanilla JS, Canvas 2D | **MIT** | **Snake Duel (스네이크 대전)**<br>30×20 그리드 150ms 틱 레이트 기반 클래식 스네이크 대결 엔진입니다. |
| **3D 콘솔** | `vendor/channel-3/` | Three.js, WebGL | **AGPL-3.0** | **Channel 3 아케이드 콘솔**<br>아케이드 기기 및 게임 선택 콘솔 연출을 위한 오픈소스 베이스 엔진입니다. 원본 `dist/index.html`을 무변경 보존합니다. |
| **3D 케이스**| `vendor/finally-3d-game-cases/`<br>`vendor-src/finally-3d-game-cases-plugin/` | Three.js, TypeScript | **BSD-3-Clause** | **Finally 3D Game Cases Plugin (SANSO)**<br>3D 게임 CD/디스크 케이스 모델링, 회전 및 케이스 열기 애니메이션을 지원하는 플러그인 소스입니다. |
| **3D 셸** | `vendor/ps2-web/`<br>`vendor-src/ps2-web/` | WebGL, Three.js | **BSD-2-Clause** | **PS2 Web 3D 셸**<br>3D 콘솔 덱 회전 메뉴 및 브라우징 인터페이스를 제공하는 오픈소스 셸입니다. |
| **배틀박스** | `battlebox/` | HTML5 Canvas, Vanilla JS | **MIT** | **Battle Box (미니게임 15종)**<br>반응속도 대결, 틱택토, 사목, 오목, 기억력 카드, 숫자 야구 등 15종 실시간/BOT 미니게임 코어 엔진입니다. |
| **레트로 배구**| `pikachu-volleyball-src/`<br>`pikachu-volleyball/` | WebAssembly / C++, JS | **오픈소스** | **피카츄 배구 1997 복원판 (Kyuchumoney)**<br>1997 SACHI SOFT 원작을 웹 및 WebAssembly로 복원한 프로젝트입니다. 1인 AI 대전, 2인 로컬, 퀵 매칭을 지원합니다. |
| **물리 추첨** | `roulette-src/`<br>`roulette/` | Box2D-WASM, HTML5 Canvas | **MIT** | **Marble Roulette (마블 룰렛 - lazygyu)**<br>Box2D 물리 엔진 기반의 구슬 룰렛 추첨기입니다. 사내 부서/임직원 명단 프리셋 불러오기 및 실시간 추첨 결과 기록을 지원합니다. |
| **DOS 원본** | `references/`<br>`original-dos/` | DOS 실행 바이너리 (`.EXE`) | **보존 자료** | **한컴타자연습 (1996~2014) & 한메타자교사 3.0**<br>정품 DOS 원본 파일(`_HTTD_.EXE`, `HTT.EXE`)과 버전별 공식 압축본이 안전하게 보존되어 있으며, js-dos 8.5.3 플레이어를 통해 브라우저에서 구동됩니다. |

---

## 2. 프로젝트 전체 디렉터리 구조 (Project Structure)

```text
Game-box/
├── docs/                                 # 📚 설계, 사양, 아키텍처 및 참고 저장소 기술 문서
│   ├── README.md                         # 문서 전체 인덱스
│   ├── REFERENCE_REPOSITORIES.md         # [본 문서] 참고 저장소 및 디렉터리 가이드
│   ├── architecture/                     # 시스템 아키텍처, 라우트 맵, 게임 인벤토리, 포털 연동
│   ├── specs/                            # 이벤트 규격, DB 스키마, 랭킹 API, 콘솔 구현 계획
│   └── engines/                          # 한컴97 js-dos 런타임, 파일시스템 브리지, 벤더 원본 보존 규칙
│
├── tool-box/                             # 🧰 호스트 본 프로젝트(Tool Box) 이식용 React 프런트엔드
│   └── src/features/game-box/            # GAME-BOX 단일 진입 피처 모듈
│       ├── GameBox.js                    # 메인 셸 & 라우터 (/game-box, /retro, /deck, /draw)
│       ├── GameBoxHome.js / .css         # GAME-BOX 홈 화면 (3대 진입 카드: Retro, Arcade, Draw)
│       ├── identity/                     # 통합 닉네임 공급자 (GameIdentityProvider)
│       ├── registry/                     # 레트로(3종), 아케이드(19종), 뽑기(1종) 레지스트리
│       ├── retro/                        # Windows 98 래퍼, 랭킹 및 가이드 윈도우
│       ├── deck/                         # 아케이드 콘솔 덱 (케이스 컬렉션 + 콘솔 뷰어)
│       ├── draw/                         # DRAW PACK 전용 래퍼 및 룰렛 연동 뷰
│       ├── runtime/                      # GameLauncher, 이벤트 브리지 및 게임 어댑터
│       └── ranking/                      # 랭킹 조회/제출 API 및 통계 유틸리티
│
├── platform-src/                         # 🎮 공통 게임 대기실 & 실시간 아레나 소스 (React)
│   ├── GamePlatformApp.jsx               # 콘솔 아케이드 메인 프레임워크
│   ├── components/
│   │   ├── GameLobby.jsx                 # 통일 대기실 (싱글 BOT 옵션 / 멀티 즉시매칭 및 참여코드)
│   │   ├── GamePlayStage.jsx             # 19종 게임 실시간 스테이지 렌더러
│   │   ├── MarbleRouletteView.jsx        # 마블 룰렛 전용 통합 뷰 (사내 명단 연동)
│   │   ├── OriginalArcadeArenas.jsx      # 봄버맨 / 봄버걸 / 스네이크 듀얼 원본 iframe 어댑터
│   │   └── RankingsAndStatsView.jsx      # 랭킹 및 스펙 뷰어
│   ├── game-guides.js                    # 게임별 상세 조작법 및 키맵핑 안내 가이드
│   └── platform.css                      # 플랫폼 통일 반응형 레이아웃 스타일
│
├── platform/                             # 📦 platform-src 빌드 배포 번들 (bundle.js, bundle.css)
├── game-box/                             # 📦 tool-box 통합 엔트리 빌드 배포 번들
├── win98-web/                            # 📦 한글 Windows 98 데스크톱 빌드 배포 번들
│
├── vendor/                               # 🏛️ 오픈소스 원본 보존 디렉터리 (오프라인 격리 원본)
│   ├── win98-web-original/               # Windows 98 웹 데스크톱 원본 소스
│   ├── blast-arena-original/             # 봄버맨 Blast Arena 원본 소스
│   ├── html5-bombergirl-original/        # HTML5 Bombergirl 원본 소스
│   ├── snake-duel-original/              # Snake Duel 원본 소스
│   ├── channel-3/                        # Channel 3 3D 콘솔 원본
│   ├── finally-3d-game-cases/            # 3D Game Cases Plugin 원본
│   └── ps2-web/                          # PS2 Web 콘솔 셸 원본
│
├── vendor-src/                           # 🔧 3D 케이스 플러그인 및 PS2 셸 소스
├── battlebox/                            # ⚡ Battle Box 15종 미니게임 코어
├── pikachu-volleyball-src/               # ⚡ 피카츄 배구 C++/WASM 복원 소스
├── pikachu-volleyball/                   # ⚡ 피카츄 배구 웹 배포 번들
├── roulette-src/                         # ⚡ 마블 룰렛 Box2D 소스
├── roulette/                             # ⚡ 마블 룰렛 웹 배포 번들
├── original-player-src/                  # ⌨️ 한컴97 / 한메3.0 js-dos 텔레메트리 플레이어 소스
├── original-dos/                         # 💾 한컴97 (_HTTD_.EXE) 실행 번들 및 js-dos 런타임
├── references/                           # 📂 한컴/한메 버전별 정품 실행 아카이브 및 원본 zip 파일
│
├── server/                               # 🖥️ 백엔드 서버 및 영구 저장소
│   ├── http-app.mjs                      # 통합 HTTP 라우터 (정적 서빙, API 라우팅, 리다이렉트)
│   ├── game-box-store.mjs                # SQLite DB 저장소 (game_players, sessions, results)
│   ├── platform-store.mjs                # 플랫폼 아케이드 룸/이벤트 저장소
│   ├── platform-realtime.mjs             # 실시간 웹소켓 룸 & AI BOT 엔진
│   ├── original-blast-arena-adapter.mjs  # 봄버맨 원본 중계 어댑터 (상태 리셋, 룸 동기화)
│   ├── original-bombergirl-adapter.mjs   # 봄버걸 원본 중계 어댑터 (온라인 P2P 입력 릴레이)
│   └── original-bombergirl-online-client.js
│
├── data/                                 # 💾 로컬 SQLite 데이터베이스 파일 (game-box.sqlite)
├── scripts/                              # 🔨 번들 빌드 및 서버 구동 스크립트 모음
│   ├── serve-platform.mjs                # 통합 서버 구동기
│   ├── build-platform.mjs                # platform-src esbuild 번들러
│   └── build-game-box.mjs                # tool-box esbuild 번들러
└── tests/                                # 🧪 전체 단위 및 통합 계약 테스트 스위트 (64개 테스트)
```

---

## 3. 라이선스 준수 및 격리 원칙

1. **원본 보존 및 격리**:
   - `vendor/` 디렉터리에 위치한 모든 오픈소스 프로젝트는 각 프로젝트의 원본 라이선스 파일(`LICENSE`, `LICENSE.md`, `LICENSE.txt`)과 저작권 표시를 엄격하게 보존합니다.
   - 각 게임은 샌드박스형 `iframe` 또는 독립된 어댑터 레이어를 통해 통신하여, 오픈소스 라이선스 간의 오염 및 종속성 충돌을 원천 방지합니다.
2. **AGPL-3.0 고지**:
   - `vendor/channel-3`의 경우 AGPL-3.0 조항을 준수하여 원본 배포본(`dist/index.html`)을 무변경 상태로 보존하고 소스코드를 함께 유지합니다.
3. **BSD / MIT 오픈소스**:
   - `finally-3d-game-cases` (BSD-3-Clause), `ps2-web` (BSD-2-Clause), `win98-web-original` (MIT), `blast-arena-original` (MIT), `html5-bombergirl-original` (MIT)는 해당 라이선스의 전문을 유지하며, 출처와 커밋 해시 메타데이터를 `gameDeckConfig.js`에 명기하고 있습니다.
