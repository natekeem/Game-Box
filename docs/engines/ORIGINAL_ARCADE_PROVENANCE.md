# Original Arcade Provenance

스네이크 듀얼, 붐버맨, 붐버걸의 화면 및 규칙이 임의 재해석으로 다시 흐르지 않도록 원본 기준점을 고정합니다.

| 게임 | 벤더 원본 | 고정 커밋 | 플랫폼 어댑터 |
|---|---|---|---|
| Snake Duel | `vendor/snake-duel-original/` | `364d80f455b16b71471d4290c5eaf872d4d59ed6` | `server/original-engines/snake-duel-engine.mjs`, `platform-src/components/OriginalArcadeArenas.jsx` |
| Blast Arena | `vendor/blast-arena-original/` | `695312427af46af0c4997a45e4813bb309cc030a` | `server/original-blast-arena-adapter.mjs`, `platform-src/components/OriginalArcadeArenas.jsx` |
| HTML5 Bombergirl | `vendor/html5-bombergirl-original/` | `0044a17d794bbfe05841a04328ccfd07146cb1b7` | `server/original-bombergirl-adapter.mjs`, `server/original-bombergirl-online-client.js`, `platform-src/components/OriginalArcadeArenas.jsx` |
| statist32 Bomberman | `vendor/bomberman-multiplayer-original/` | `20750b9c37a069831fbb88a41300b815ea006e0d` | 비교용만 보존. 아이템 시스템 부재로 미사용 |

## 변경 경계

- 플랫폼 로그인, 방 코드, BOT, 랭킹 연결은 원본 화면·루프를 변경하지 않는 별도 어댑터에서만 추가해야 합니다.
- Snake Duel의 보드 크기, 시작 위치, 충돌 판정, 먹이 점수, tick은 원본 엔진과 일치해야 합니다.
- Blast Arena는 벤더 원본의 HTML/CSS/JS, 27×15 맵, 15ms 루프, 대기실, 채팅, 폭탄·화염·속도 아이템, 2.5초 퓨즈를 직접 실행합니다.
- `server/original-blast-arena-adapter.mjs`는 같은 HTTP 서버의 `/original-blast-arena/` 경로와 WebSocket upgrade 경로만 연결합니다. 화면·게임 로직을 재구현하지 않습니다.
- Blast Arena 싱글 모드는 원본 권위 서버에 `COM-BOT` 입력만 공급하며, 원본 맵·폭탄·아이템·승패 로직은 그대로 사용합니다. 온라인 모드는 원본 2~4인 대기실을 그대로 사용합니다.
- HTML5 Bombergirl 싱글은 원본 `single` 모드(사람 1명 + 원본 AI 3명)를 그대로 자동 시작합니다.
- HTML5 Bombergirl 온라인은 원본 17×13 Canvas, 스프라이트, 맵 생성, 폭탄, 보너스, 충돌 규칙을 양쪽 브라우저에서 그대로 실행하고 플랫폼 어댑터가 방 코드와 두 플레이어의 입력만 중계합니다.
- 룰렛과 BattleBox 코드는 이 이식 범위에서 변경하지 않습니다.
