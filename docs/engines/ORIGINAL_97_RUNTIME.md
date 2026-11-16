# 한컴타자연습 97 원본 웹 실행 구조

## 원칙

`hancom97-original`은 한컴타자연습 화면을 HTML로 다시 그리지 않는다. 사용자가 지정한
`references/한컴타자연습 1997/_HTTD_.EXE`와 `APP/HNCTT` 자료를 브라우저의 DOSBox
WebAssembly 안에서 직접 실행한다. CRT 이미지는 원본 캔버스 바깥 프레임일 뿐이며,
모니터 안의 메뉴·대화상자·연습 화면·점수 계산은 모두 1997 실행 파일이 그린다.

## 배포 흐름

```text
사내 React 앱 / 정적 서버
  ├─ js-dos UI 런타임 (고정 8.5.3)
  ├─ emulators/DOSBox WASM (고정 8.5.2)
  ├─ hancom-typing-1997.jsdos
  │    ├─ _HTTD_.EXE
  │    └─ APP/HNCTT/*
  └─ 사내 API
       ├─ 사용자/세션
       ├─ 플레이 기록
       └─ 순위/집계
```

각 사용자 브라우저가 DOSBox를 로컬로 실행하므로 게임 화면을 서버에서 스트리밍하지 않는다.
서버는 정적 파일을 제공하고 일반 React API 호출을 처리하면 된다. `.wasm`은
`application/wasm`, `.jsdos`는 `application/zip` 또는 `application/octet-stream`으로 제공한다.

## 빌드가 일반 ZIP을 그대로 쓰지 않는 이유

처음 만든 자료 번들의 31개 파일 바이트는 원본과 같았지만, 일반 ZIP 메타데이터를 js-dos의
libzip이 해석하지 못해 `APP/HNCTT: No such file or directory`로 종료됐다. 현재 빌드는 다음을 한다.

1. 원본 EXE와 자료 30개를 SHA-256으로 검증한다.
2. `emulators`의 `InitFileEntry`로 파일을 DOS 파일시스템에 직접 적재한다.
3. js-dos가 그 파일시스템을 네이티브 `.jsdos`로 패키징한다.
4. `mount c .` 후 `_HTTD_.EXE`를 실행하도록 설정한다.
5. 생성 번들 해시를 `player.js`에 넣고 URL 쿼리에도 붙인다.

마지막 단계는 js-dos가 OPFS에 번들을 URL 기준으로 캐시하기 때문에 필요하다. 해시가 바뀌면
URL도 바뀌므로 이전 손상 번들이 다시 사용되지 않는다.

## React와 백엔드 순위 연동

js-dos는 React나 백엔드를 대체하지 않는다. `player.js`는 부팅이 끝나면 하위
`CommandInterface`를 `window.hancom97CommandInterface`로 노출한다. React 통합 시에는 이를
전역 대신 콜백/`ref`로 넘기면 된다.

이 저장소에는 완성된 React 앱 엔트리나 라우터가 없으므로 기존 V6 엔진에 결합하지 않았다.
대신 `tool-box/src/features/game-box/Hancom97Original.jsx`에 호스트용 어댑터를 제공한다.
실제 React 앱의 `public/games/hancom97/`에 `hancom97-original`의 내용을 배치한 뒤 다음처럼 쓴다.

```jsx
<Hancom97Original
  assetBaseUrl="/games/hancom97"
  loadRecords={() => loadSavedRecords()}
  onReady={commandInterface => setDos(commandInterface)}
  onRecords={snapshot => saveRecords(snapshot)}
  onExit={() => closeSession()}
/>
```

우선 저장 가능한 이벤트:

- 사용자 ID, 세션 시작/종료 시각
- 선택 게임/연습 종류
- 브라우저·클라이언트 버전
- 정상 종료/중단 상태

실제 원본 실행 조사에서 정상 종료 시 `HTP.SCO`와 `HTT.STA`가 생성되는 것을 확인했다.
현재 어댑터는 두 파일이 변경될 때 `onRecords`로 안전한 스냅샷을 보내고,
`initialRecordSnapshot`으로 다음 세션에 복원한다. 따라서 계정별 원본 기록 보존과 백엔드
동기화는 가능하다. 회사 순위에 필요한 개별 타수·정확도 필드는 바이너리 오프셋을 더
해석해야 하며, 조사 근거와 API 예시는 `docs/HANCOM97_RECORDS.md`에 정리했다.

## 실행

```powershell
npm install
npm start
```

브라우저에서 `http://127.0.0.1:8765/`를 연다. `file://` 더블클릭 실행은 WASM과 번들 fetch를
사용할 수 없으므로 지원하지 않는다. Windows에서는 `START_HANCOM_97.cmd`를 실행해도 된다.

사내 배포 전에는 원본 프로그램과 상표의 사내 재배포 권한을 별도로 확인해야 한다.
