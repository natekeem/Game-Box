# GAME_DECK_IMPLEMENTATION_PLAN.md — 오른쪽 GAME DECK 아키텍처 및 단계별 구현 계획

> **현재 구현 위치**:
> - 라우트: `/game-box/deck`
> - 컴포넌트: `tool-box/src/features/game-box/deck/GameDeck.js`
> - 설정 및 레지스트리: `tool-box/src/features/game-box/deck/gameDeckConfig.js`, `tool-box/src/features/game-box/registry/arcadeGames.js`

---

## 1. 이번 단계 구현 완료 범위 (2D 콘솔 덱 + 20종 케이스 컬렉션 + 온디맨드 런처)

1. **3단 레이아웃 구축 완료**:
   - **LEFT — GAME COLLECTION**: 실제 저장소에서 검증된 20종 게임(`Blast Arena 봄버맨`, `HTML5 Bombergirl`, `Snake Duel`, `Marble Roulette`, `CatchMind`, `BattleBox 15종`)을 스파인 코드(`BLST-001` 등)와 장르 배지가 포함된 게임 케이스 형태로 진열.
   - **CENTER — GAME CONSOLE**: 다크 그래파이트 & 실버 콘솔 데크와 평면 디스플레이 배치. 게임팩 선택 시 디스크 프리뷰 및 설명을 표시하며, **`[PLAY (게임팩 삽입 및 즉시 실행)]`** 클릭 시에만 `<GameLauncher />`가 선택된 게임 1개의 iframe을 마운트(동시 다중 iframe 로딩 방지).
   - **RIGHT — GAME RANKING & SPEC**: 선택된 게임의 화면 비율, 입력 장치, 실행 URL, 이벤트 지원 현황 및 `/api/platform/rankings` 연동 TOP 10 순위 표시.

---

## 2. 참고 오픈소스 분석 및 향후 3D 연출 고도화 계획

### 2.1 `brayanspagnol/ps2-web`
- **검토 대상 원본 파일**:
  - `public/js/console-scene.js`: Three.js 기반 콘솔 메시 배치, 디스크 트레이 오픈/클로즈 트윈 애니메이션, 카메라 포커스 이동.
  - `public/js/crt-tv.js`: 셰이더/텍스처 기반 디스플레이 전원 켜짐 연출.
  - `public/demo-console.html`: DOM 오버레이와 3D 캔버스 결합 구조.
- **재사용 및 제외 범위**:
  - **재사용**: 디스크 트레이 개폐 타이밍(약 600~800ms), 디스크 회전 후 화면 전환 시퀀스.
  - **제외**: 실제 콘솔 브랜드(PlayStation 2) 로고·상표·바이오스 사운드 및 에뮬레이터 코어는 일절 사용하지 않고 자체 중립 콘솔 디자인(`TOOL-BOX ARCADE DECK`)만 사용.

### 2.2 `otisabiburada/finally-3d-game-cases-plugin`
- **검토 대상 파일**:
  - `src/engine.ts`, `README.md`, `LICENSE`
- **재사용 및 제외 범위**:
  - **재사용**: CSS 3D Transform / WebGL 기반의 게임 케이스 입체 두께감 표현, 호버/선택 시 케이스가 앞으로 나오는 트랜지션, 케이스가 열리며 내부 디스크가 보이는 연출.
  - **제외**: Steam Deck Decky Loader 플러그인 종속 코드는 제외하고 순수 웹 컴포넌트 레이어로만 참조.

---

## 3. 향후 GAME DECK 이식 작업량 및 단계별 로드맵

| 단계 | 작업 항목 | 예상 공수 | 상세 내용 |
| --- | --- | --- | --- |
| **Phase 1 (완료)** | 20종 인벤토리 전수 조사 및 `/game-box/deck` 3단 콘솔 UI 구축 | 완료 | 20종 전체 실행 URL, 화면 비율, 입력 장치 검증 및 온디맨드 `<GameLauncher />` 연동 완료 |
| **Phase 2** | 게임별 전용 커버 아트 에셋 제작 (20종) | 1~2일 | 현재 공통/대표 프리뷰 이미지를 사용 중인 BattleBox 15종에 대해 각 게임의 실제 플레이 스크린샷 기반 고해상도 박스 커버 이미지 적용 |
| **Phase 3** | CSS 3D / Three.js 경량 케이스 개폐 & 디스크 삽입 애니메이션 | 2일 | `React.lazy` 동적 import로 3D 케이스 개폐 및 콘솔 슬롯 삽입(0.7초) 연출 추가 (저사양 환경에서는 즉시 실행 폴백 유지) |
| **Phase 4** | 아케이드 20종 결과의 `GameEventBridge` 단일 통합 | 1~2일 | 현재 `/api/platform/rankings`에 저장되는 아케이드/배틀박스 결과를 `/api/game-box/results`와 단일 스키마로 통합 조회하도록 연결 |
