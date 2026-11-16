# GAME_BOX_EVENT_CONTRACT.md — 공통 게임 이벤트 및 기록 수집 명세

> **구현 파일**:
> - `tool-box/src/features/game-box/runtime/GameEventBridge.js`
> - `vendor/win98-web-original/src/system/game-box-win98-bridge.js`
> - `original-player-src/player.js`
> - `pikachu-volleyball/ko/index.html`

---

## 1. 공통 이벤트 메시지 포맷 (`postMessage` & CustomEvent)

모든 iframe 게임은 동일 출처(`window.location.origin`)로 다음과 같은 envelope 구조의 메시지를 전송합니다.

```json
{
  "source": "game-box-runtime",
  "type": "game:complete",
  "payload": {
    "playerId": "guest-8c2f3a10-...",
    "nickname": "타자왕김대리",
    "gameId": "hancom-typing-97",
    "gameSessionId": "9f12c400-...",
    "clientEventId": "9f12c400-...-complete-1",
    "gameMode": "position",
    "eventType": "game:complete",
    "timestamp": "2026-11-17T00:20:00.000Z",
    "score": null,
    "typingSpeed": 412,
    "accuracy": 98.5,
    "errorCount": 2,
    "durationMs": 45200,
    "outcome": "completed",
    "opponentType": "none",
    "recordClassification": "ranking",
    "trustLevel": "original-screen-telemetry",
    "metadata": {
      "keystrokes": 185,
      "backspaces": 2
    }
  }
}
```

### 1.1 허용 이벤트 타입 (`ALLOWED_GAME_EVENT_TYPES`)
1. `game:start` — 게임 엔진 부팅 완료 또는 대전 시작 시 1회 발생 (`POST /api/game-box/sessions`)
2. `game:progress` — 원본 기록 파일(`HTP.SCO`, `HTT.STA`) 스냅샷 갱신 등 주요 체크포인트 발생 시 (`POST /api/game-box/sessions`) — **개별 키 입력마다 서버 요청을 보내지 않음**
3. `game:complete` — 연습 단계 완료 또는 경기 종료 시 최종 결과 저장 (`POST /api/game-box/results`)
4. `game:abort` — 경기/연습 도중 창을 닫거나 로비로 퇴장한 경우 세션 중단 상태 기록 (`POST /api/game-box/sessions`, `outcome: 'aborted'`, `recordClassification: 'practice'`)

### 1.2 보안 및 멱등성(Idempotency) 검증
- **Origin & Source 검증**: `event.origin === window.location.origin` 및 `event.data.source === 'game-box-runtime'`가 일치하는 메시지만 처리합니다.
- **중복 수신 방지(Idempotency)**:
  - 클라이언트 `GameEventBridge` 및 `game-box-win98-bridge.js`의 `PROCESSED_EVENTS` Set에서 `clientEventId`로 1차 중복 차단.
  - 서버 DB `game_results` 테이블의 `UNIQUE(player_id, client_event_id)` 제약 조건으로 2차 완벽 중복 차단.

---

## 2. 게임별 실제 수집 가능 데이터와 한계 구분

| 게임 | 모드 (`gameMode`) | 자동/수동 수집 방식 | 수집 필드 | 랭킹 반영 여부 (`recordClassification`) | 기술적 한계 및 문서화 |
| --- | --- | --- | --- | --- | --- |
| **한컴타자연습 97** (`hancom-typing-97`) | `position` (자리연습) | **100% 자동** (`hancom97-telemetry.js` VGA 픽셀 감지) + 메뉴 수동 저장 지원 | `typingSpeed`(타/분), `accuracy`(%), `durationMs` | `ranking` (자리연습 타수 순위) | 원본 DOS 프로그램이 자리연습은 디스크 파일에 쓰지 않으므로 VGA 프레임의 노란 키 하이라이트와 완료 대화상자 픽셀을 감지하여 정확히 추출함 |
| **한컴타자연습 97** (`hancom-typing-97`) | `word`, `short`, `long`, `acid-rain`, `invader` | **DOS 세션 키스트로크 측정 + `HTP.SCO`/`HTT.STA` 스냅샷 보존** | `typingSpeed`(타/분), `score`(점), `accuracy`(%), `errorCount`, `durationMs` | `ranking` (각 종목별 독립 순위) | 16비트 DOS 그래픽 모드 내부 텍스트를 임의 OCR 추측하지 않고, 실제 DOSBox 세션의 유효 타자 입력(최소 5타 이상)·백스페이스율·활성 시간을 측정해 종목별로 기록하며 원본 바이너리(`HTP.SCO`, `HTT.STA`)를 함께 보존함 |
| **한메타자교사 3.0** (`hanme-typing-30`) | `venezia`, `short`, `long`, `position`, `word` | **DOS 세션 키스트로크 측정** (`completeDosTypingSession`) | `score`(점), `typingSpeed`(타/분), `accuracy`(%), `errorCount`, `durationMs` | `ranking` (한컴 97과 완전히 분리된 한메 3.0 전용 순위) | `HTT.EXE` 원본 바이너리를 수정하지 않고 js-dos 세션의 실제 키 입력/시간 지표를 기반으로 기록함 |
| **피카츄 배구** (`pikachu-volleyball`) | `vs-computer` (1인용 AI 대전) | **100% 자동** (`#game-result-modal` 및 `handleGameEnd` 훅) | `score`(점), `outcome`(`win`/`lose`), `durationMs`, `metadata.playerScore`, `metadata.opponentScore` | `ranking` (AI 대전 최고점 / 다승 순위) | 15점 경기 정상 완료 시에만 `game:complete` 발생. 경기 도중 `로비로 나가기` 클릭 시 `game:abort` 발생 |
| **피카츄 배구** (`pikachu-volleyball`) | `vs-local-2p`, `p2p-online` | 세션 및 연습 기록 | `durationMs`, `outcome` | `practice` (공식 랭킹 제외) | 한 키보드 2인 로컬 플레이나 한쪽 클라이언트의 일방적 WebRTC P2P 승리 신고는 어뷰징 방지를 위해 공식 랭킹(`ranking`)에 반영하지 않고 `practice`로 분리함 |
