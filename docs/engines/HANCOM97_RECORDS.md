# 한컴타자연습 97 기록 파일과 백엔드 연동

## 원본에서 확인된 저장 동작

`_HTTD_.EXE`를 실제 DOSBox 런타임에서 실행하고 원본 메뉴의 `끝`으로 정상 종료한 뒤
파일시스템을 비교했다. 실행 전에는 없던 다음 두 파일이 프로그램 루트에 생성됐다.

| 파일 | 확인된 크기 | 용도 단서 |
| --- | ---: | --- |
| `HTP.SCO` | 330 bytes | 점수 파일명과 `_ScoreFileOpen` 심볼 |
| `HTT.STA` | 11,718 bytes | 통계 파일명과 `STATIST_.C`, `_T_Score` 심볼 |

재현 자료는 로컬 `docs/RECORD_PROBE/`에 보관하며 Git에는 포함하지 않는다. 원본 데이터와
사용자 기록이 섞이지 않도록 정상 종료 시점에만 생성되는 것도 확인했다.

## 현재 연결 방식

`hancom97RecordBridge.js`는 js-dos의 공개 `CommandInterface`만 사용한다.

1. `fsTree()`로 `HTP.SCO`, `HTT.STA` 존재 여부를 확인한다.
2. `fsReadFile()`로 두 파일의 바이트를 읽는다.
3. 내용이 달라졌을 때만 version 1 JSON 스냅샷을 호스트에 보낸다.
4. 다음 로그인 때 받은 스냅샷은 검증 후 js-dos `initFs`로 복원한다.

경로는 두 파일로만 제한되며, 경로 탈출·중복 파일·128 KiB 초과 파일·잘못된 base64를
거부한다. EXE나 설정 파일은 웹 API로 전송하지 않는다.

```json
{
  "version": 1,
  "game": "hancom97",
  "capturedAt": "2026-11-14T00:00:00.000Z",
  "files": [
    { "path": "HTP.SCO", "byteLength": 330, "base64": "..." },
    { "path": "HTT.STA", "byteLength": 11718, "base64": "..." }
  ]
}
```

## React/API 예시

```jsx
<Hancom97Original
  assetBaseUrl="/games/hancom97"
  loadRecords={() => fetch('/api/game-box/hancom97/records').then(response => response.json())}
  onRecords={snapshot => fetch('/api/game-box/hancom97/records', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(snapshot),
  })}
/>
```

독립 실행 페이지도 같은 기능을 제공한다. 실행 전에 `window.hancom97LoadRecords`를
비동기 함수로 지정하면 복원하고, 새 기록은 `hancom97-records` CustomEvent로 전달한다.

## 순위 집계 범위

원본 기록의 **보존과 계정별 동기화는 현재 구조로 가능**하다. 다만 회사 전체 순위를 만들려면
두 바이너리 파일 안에서 타수·정확도·연습 종류·날짜가 저장되는 정확한 오프셋을 추가로
해석해야 한다. 필드가 완전히 해석되기 전에는 서버가 스냅샷 원본과 해시를 보관하고,
검증되지 않은 숫자를 순위로 노출하지 않는 것이 안전하다.
