# GAME_BOX_RANKING_SPEC.md — 게임 결과 DB 스키마 및 랭킹 API 명세

> **구현 파일**:
> - 저장소 계층: `server/game-box-store.mjs` (Node.js `node:sqlite` 실제 구동 및 테스트 완료)
> - HTTP 라우터: `server/http-app.mjs` (`/api/game-box/*`)
> - 프런트엔드 클라이언트: `tool-box/src/features/game-box/ranking/rankingApi.js`

---

## 1. 데이터베이스 스키마 (SQLite 실제 구현 & MySQL 8.x 이식 호환 DDL)

### 1.1 `game_players` (Game Player)
사용자를 닉네임이 아닌 고유 식별자(`player_id`)로 구분합니다. 닉네임을 변경해도 `player_id`가 유지되므로 기존 모든 기록과 랭킹 연결이 그대로 유지됩니다.

```sql
CREATE TABLE IF NOT EXISTS game_players (
  player_id VARCHAR(64) PRIMARY KEY,
  identity_type VARCHAR(16) NOT NULL DEFAULT 'guest', -- 'guest' | 'authenticated'
  nickname VARCHAR(32) NOT NULL,
  external_user_id VARCHAR(64) NULL,
  created_at VARCHAR(32) NOT NULL,
  updated_at VARCHAR(32) NOT NULL
);
```

### 1.2 `game_sessions` (Game Session)
게임 실행 단위(`game:start` ~ `game:progress` ~ `game:complete` / `game:abort`)의 생명주기를 기록합니다.

```sql
CREATE TABLE IF NOT EXISTS game_sessions (
  session_id VARCHAR(64) PRIMARY KEY,
  player_id VARCHAR(64) NOT NULL,
  game_id VARCHAR(48) NOT NULL,
  game_mode VARCHAR(48) NOT NULL DEFAULT 'general',
  status VARCHAR(16) NOT NULL DEFAULT 'started', -- 'started' | 'progress' | 'completed' | 'aborted'
  started_at VARCHAR(32) NOT NULL,
  ended_at VARCHAR(32) NULL,
  duration_ms INT NOT NULL DEFAULT 0,
  last_event_type VARCHAR(32) NOT NULL DEFAULT 'game:start',
  metadata_json TEXT NOT NULL,
  FOREIGN KEY (player_id) REFERENCES game_players(player_id) ON DELETE CASCADE
);
```

### 1.3 `game_results` (Game Result)
완료된 게임 결과를 저장하며, `record_classification` 컬럼으로 공식 랭킹 반영 대상(`'ranking'`)과 연습/중단 기록(`'practice'`)을 엄격히 분리합니다. 또한 `UNIQUE(player_id, client_event_id)` 제약 조건으로 중복 제출을 원천 차단합니다.

```sql
CREATE TABLE IF NOT EXISTS game_results (
  result_id VARCHAR(64) PRIMARY KEY,
  session_id VARCHAR(64) NULL,
  client_event_id VARCHAR(128) NOT NULL,
  player_id VARCHAR(64) NOT NULL,
  game_id VARCHAR(48) NOT NULL,
  game_mode VARCHAR(48) NOT NULL,
  record_classification VARCHAR(16) NOT NULL DEFAULT 'ranking', -- 'ranking' | 'practice'
  score DOUBLE NULL,
  typing_speed DOUBLE NULL,
  accuracy DOUBLE NULL,
  error_count INT NULL,
  duration_ms INT NOT NULL DEFAULT 0,
  outcome VARCHAR(16) NOT NULL DEFAULT 'completed', -- 'win' | 'lose' | 'draw' | 'completed' | 'aborted'
  opponent_type VARCHAR(32) NOT NULL DEFAULT 'none',
  trust_level VARCHAR(48) NOT NULL DEFAULT 'client-guest-telemetry',
  metadata_json TEXT NOT NULL,
  recorded_at VARCHAR(32) NOT NULL,
  created_at VARCHAR(32) NOT NULL,
  UNIQUE (player_id, client_event_id),
  FOREIGN KEY (player_id) REFERENCES game_players(player_id) ON DELETE CASCADE
);
```

---

## 2. REST API 명세 (`/api/game-box/*`)

### 2.1 게스트/플레이어 등록 및 조회
- **`POST /api/game-box/players`**
  - Request: `{ "playerId": "guest-...", "nickname": "타자왕김대리", "identityType": "guest" }`
  - Response `200 OK`: `{ "player": { "playerId": "guest-...", "nickname": "타자왕김대리", "identityType": "guest", "createdAt": "...", "updatedAt": "..." } }`
- **`GET /api/game-box/players/:playerId`**
  - Response `200 OK`: `{ "player": { ... } }`

### 2.2 닉네임 변경 (기존 기록 연결 유지)
- **`PUT /api/game-box/players/:playerId/nickname`** (또는 `PATCH /api/game-box/players/:playerId`)
  - Request: `{ "nickname": "새닉네임" }`
  - 동작: `game_players.nickname`을 갱신합니다. `game_results`와 `game_sessions`는 `player_id`를 외래키로 참조하므로, 이후 랭킹 조회 시 변경된 닉네임이 모든 과거 기록에 즉시 반영됩니다.

### 2.3 게임 세션 기록 (`game:start`, `game:progress`, `game:abort`)
- **`POST /api/game-box/sessions`**
  - Request: `{ "playerId": "guest-...", "gameId": "hancom-typing-97", "gameSessionId": "sess-1", "gameMode": "position", "eventType": "game:start", "durationMs": 0 }`
  - Response `200 OK`: `{ "session": { "sessionId": "sess-1", "status": "started", ... } }`

### 2.4 최종 게임 결과 저장 (`game:complete`)
- **`POST /api/game-box/results`**
  - Request:
    ```json
    {
      "playerId": "guest-...",
      "gameId": "pikachu-volleyball",
      "gameSessionId": "pika-1",
      "clientEventId": "pika-1-complete",
      "gameMode": "vs-computer",
      "score": 16400,
      "durationMs": 62000,
      "outcome": "win",
      "opponentType": "ai",
      "metadata": { "playerScore": 15, "opponentScore": 5 }
    }
    ```
  - 서버 검증:
    - 허용된 `gameId` (`hancom-typing-97`, `hanme-typing-30`, `pikachu-volleyball`) 여부 확인
    - 수치 범위 검증 (`score`: `0 ~ 1,000,000`, `typingSpeed`: `0 ~ 3,500`, `accuracy`: `0 ~ 100`)
    - `(player_id, client_event_id)` 중복 제출 시 신규 행을 생성하지 않고 `{ "duplicated": true, "result": ... }` 반환

### 2.5 게임별·모드별 랭킹 조회
- **`GET /api/game-box/rankings?gameId=hancom-typing-97&gameMode=position&limit=10&playerId=guest-...`**
  - Response `200 OK`:
    ```json
    {
      "gameId": "hancom-typing-97",
      "gameMode": "position",
      "modeLabel": "자리연습 (타수)",
      "metric": "typing_speed",
      "unit": "타/분",
      "entries": [
        {
          "rank": 1,
          "playerId": "guest-...",
          "nickname": "타자왕김대리",
          "metricValue": 412,
          "unit": "타/분",
          "accuracy": 98.5,
          "durationMs": 45200,
          "recordedAt": "2026-11-17T00:20:00.000Z"
        }
      ],
      "myBest": {
        "metricValue": 412,
        "unit": "타/분",
        "accuracy": 98.5,
        "recordedAt": "2026-11-17T00:20:00.000Z"
      }
    }
    ```

### 2.6 내 기록 조회
- **`GET /api/game-box/players/:playerId/records?gameId=hancom-typing-97&limit=25`**
  - Response `200 OK`: `{ "player": { ... }, "records": [ ... ] }`

---

## 3. 신뢰 수준(Trust Level) 및 검증 한계 명시

1. **게스트 식별 기반 랭킹**:
   - 현재 개발 단계에서는 브라우저가 생성한 `guestId`를 사용합니다. `guestId`만으로는 암호학적 사용자 인증을 대체할 수 없으므로 모든 게스트 기록은 `identity_type = 'guest'`로 구분됩니다.
   - 향후 Tool Box 본 프로젝트로 이식 시 `AuthenticatedIdentityAdapter`를 주입하면 백엔드가 세션/JWT 토큰에서 검증한 `user_id`를 `player_id`로 사용하게 됩니다.
2. **클라이언트 텔레메트리의 한계**:
   - 브라우저 내부에서 실행되는 WASM DOSBox 및 캔버스 게임의 특성상 클라이언트가 전송한 결과 페이로드는 범위 검증(`0 <= typingSpeed <= 3500` 등)을 거치더라도 완벽한 메모리 변조 방지를 보장하지 않습니다.
   - 따라서 `trust_level` 컬럼에 `'original-screen-telemetry'`, `'dos-session-telemetry'`, `'client-guest-telemetry'`를 명시하여 서버 권위 엔진(`'server-verified'`) 결과와 구분합니다.
