# GAME-BOX 문서 인덱스 (`docs/`)

본 디렉터리는 **TOOL BOX — GAME-BOX** 프로젝트의 아키텍처, 라우팅, 이벤트 계약, 랭킹 DB 스키마 및 개별 게임 엔진의 기술 문서를 체계적으로 관리합니다.

---

## 1. 아키텍처 및 라우팅 (`docs/architecture/`)

- **[`REFERENCE_REPOSITORIES.md`](REFERENCE_REPOSITORIES.md)**
  - 오픈소스 참고 저장소(Vendor Repositories) 일람표, 라이선스, 원작자 정보 및 프로젝트 전체 디렉터리 구조 가이드
- **[`GAME_BOX_AUDIT.md`](architecture/GAME_BOX_AUDIT.md)**
  - 기존 코드 조사, 중복 진입점 제거(`hub.html`, `platform.html`, 레거시 단일 HTML 삭제), 디렉터리 정리 결과
- **[`GAME_BOX_ROUTE_MAP.md`](architecture/GAME_BOX_ROUTE_MAP.md)**
  - 공식 진입점(`/game-box`, `/game-box/retro`, `/game-box/deck`), 레거시 리다이렉트, 내부 iframe 런타임 경로
- **[`GAME_BOX_GAME_INVENTORY.md`](architecture/GAME_BOX_GAME_INVENTORY.md)**
  - RETRO DESKTOP 핵심 3종(`한컴타자연습 97`, `한메타자교사 3.0`, `피카츄 배구`) + 내장 게임 + GAME DECK 20종의 소스 경로, URL, 화면 비율, 입력 장치, 기록 지원 현황
- **[`CORPORATE_PORTAL_INTEGRATION.md`](architecture/CORPORATE_PORTAL_INTEGRATION.md)**
  - 향후 호스트 프로젝트(Tool Box) 이식 시 `GameIdentityProvider` / `AuthenticatedIdentityAdapter` 교체 가이드 및 오픈소스 라이선스 고지

---

## 2. 이벤트 및 랭킹 명세 (`docs/specs/`)

- **[`GAME_BOX_EVENT_CONTRACT.md`](specs/GAME_BOX_EVENT_CONTRACT.md)**
  - `game:start`, `game:progress`, `game:complete`, `game:abort` 공통 이벤트 인터페이스, `postMessage` 검증, 멱등성 처리, 게임별 수집 범위와 한계
- **[`GAME_BOX_RANKING_SPEC.md`](specs/GAME_BOX_RANKING_SPEC.md)**
  - `game_players`, `game_sessions`, `game_results` 데이터베이스 스키마(SQLite 실제 구현 및 MySQL 8.x 호환 DDL)와 `/api/game-box/*` REST API 명세
- **[`GAME_DECK_IMPLEMENTATION_PLAN.md`](specs/GAME_DECK_IMPLEMENTATION_PLAN.md)**
  - `/game-box/deck` 3단 콘솔 아키텍처 및 `ps2-web` / `finally-3d-game-cases-plugin` 참고 향후 고도화 계획

---

## 3. 게임 엔진 상세 (`docs/engines/`)

- **[`ORIGINAL_97_RUNTIME.md`](engines/ORIGINAL_97_RUNTIME.md)**
  - 한컴타자연습 97 원본 `_HTTD_.EXE` 무결성 검증 및 js-dos 8.5.3 패키징 구조
- **[`HANCOM97_RECORDS.md`](engines/HANCOM97_RECORDS.md)**
  - DOSBox 파일시스템 내 `HTP.SCO` / `HTT.STA` 추출 및 복원 브리지 명세
- **[`ORIGINAL_ARCADE_PROVENANCE.md`](engines/ORIGINAL_ARCADE_PROVENANCE.md)**
  - Snake Duel, Blast Arena(봄버맨), HTML5 Bombergirl 벤더 원본 보존 및 어댑터 경계
