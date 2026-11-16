# 사내 React 포털 이식 및 연동 가이드 (Corporate Portal Integration Guide)

본 문서는 사외 개발 환경에서 구축된 **GAME-BOX 사내 미니게임 플랫폼(20종)**을 사내 React 포털 레포지토리로 이전·통합할 때 필요한 아키텍처, AD SSO 사용자 공급자 연결 방법, 환경설정, 그리고 오픈소스 라이선스 고지 사항을 안내합니다.

---

## 1. 아키텍처 및 디렉터리 구조

기존 Windows 98 기반 추억의 게임(`hub.html`, `hancom97-original`, `hanme30-original`, `MINESWEEPER_WIN98.html`, `pikachu-volleyball` 등)과 완전히 분리된 독립 모듈로 설계되었습니다.

```text
Game-box/
├── platform-src/                     # 사내 React 포털 이식용 프론트엔드 모듈 원본
│   ├── index.js                      # 포털 임베딩용 Public Exports (GamePlatformApp, ExternalUserProvider 등)
│   ├── main.jsx                      # 독립 실행 및 포털 마운트 헬퍼 (mountGamePlatform)
│   ├── user-provider.js              # MockUserProvider / ExternalUserProvider 및 AD SSO 어댑터
│   ├── api-client.js                 # REST + SSE 실시간 통신 분리 계층 (PlatformApiClient)
│   ├── registry.js                   # 20종 미니게임 메타데이터 레지스트리
│   ├── platform.css                  # .gp-root / .bb-* 범위 제한(Scoped) 스타일시트
│   └── components/
│       ├── MarbleRouletteView.jsx    # 마블 룰렛 + 사내 조직/직원 명단 연동 뷰
│       ├── GamePlayStage.jsx         # BattleBox 15종 + 추가 4종 실시간 게임 스테이지
│       ├── EventGroupsView.jsx       # 부서 연합 이벤트 그룹 생성 및 집계 뷰
│       └── RankingsAndStatsView.jsx  # 사번(user.id) 기준 공식 랭킹 및 부서 대항전 뷰
├── platform/                         # 빌드된 정적 번들 (/platform/index.html, bundle.js, bundle.css)
├── server/
│   ├── platform-store.mjs            # SQLite 기반 게임 전적, 이벤트 그룹, 룰렛 히스토리 저장소
│   ├── platform-realtime.mjs         # SSE 실시간 허브, BattleBox 15종 어댑터, AI BOT 엔진
│   └── http-app.mjs                  # /api/platform/* 엔드포인트 및 AD SSO identityProvider 연동
└── tests/
    └── platform.test.mjs             # 20종 전 게임 E2E, BOT, 온라인 방, 이벤트 그룹, AD SSO 검증 테스트
```

---

## 2. 사용자 정보 인터페이스 및 공급자 교체 (`ExternalUserProvider`)

게임 플랫폼은 자체 로그인/회원가입/닉네임 변경 UI를 갖지 않으며, 사내 AD SSO 시스템이 전달하는 표준 `GameUser` 인터페이스를 사용합니다.

```typescript
export interface GameUser {
  id: string;             // 사번 또는 AD 고유 사용자 식별자 (랭킹/전적의 기준 Key)
  name: string;           // 게임 화면에 그대로 표시할 임직원 성명
  departmentId: string;   // 부서 코드
  departmentName: string; // 부서명
}
```

### 2.1 어댑터 계층 (`adaptCorporateUser` / `adaptExternalUser`)
사내 API의 필드명이 `empNo`, `userId`, `subject`, `displayName`, `organizations[0]` 등으로 상이하더라도 `platform-src/user-provider.js`의 `adaptCorporateUser(raw)` 및 `server/platform-store.mjs`의 `adaptExternalUser(raw)`에서 표준 `GameUser`로 자동 매핑합니다.

### 2.2 사내 React 포털 컴포넌트 내부에 직접 임베딩하는 방법
사내 React 포털의 라우터(예: `/portal/minigames`)에서 `<GamePlatformApp />`을 직접 렌더링할 수 있습니다.

```jsx
import React, { useMemo } from 'react';
import { GamePlatformApp, ExternalUserProvider } from './platform-src/index.js';
import './platform-src/platform.css';

export function CorporateMiniGamePage({ ssoUser, accessToken }) {
  const userProvider = useMemo(
    () =>
      new ExternalUserProvider({
        user: {
          id: ssoUser.empNo,
          name: ssoUser.userName,
          departmentId: ssoUser.deptCode,
          departmentName: ssoUser.deptName,
        },
        getAuthHeaders: () => ({
          Authorization: `Bearer ${accessToken}`,
        }),
      }),
    [ssoUser, accessToken]
  );

  return <GamePlatformApp userProvider={userProvider} apiBaseUrl="/api/platform" />;
}
```
- `ExternalUserProvider` 사용 시 상단의 **테스트 계정 전환 드롭다운이 자동으로 비활성화**되며, `switchMockUser()` 호출 시 예외를 발생시켜 임의 사용자 전환을 차단합니다.

### 2.3 백엔드 서버에서 사내 AD SSO 세션 검증 연결
`server/http-app.mjs`의 `createGameBoxServer` 호출 시 `identityProvider` 콜백과 `allowMockUserSwitch: false`를 주입하면 클라이언트가 보낸 `X-Mock-User-Id` 헤더를 완전히 무시하고 서버가 검증한 AD SSO 세션 정보만 신뢰합니다.

```javascript
import { createGameBoxServer } from './server/http-app.mjs';

const { server } = createGameBoxServer({
  staticRoot: process.cwd(),
  databasePath: process.env.GAMEBOX_DB_PATH || './data/gamebox.sqlite',
  allowMockUserSwitch: false,
  identityProvider: async (request) => {
    // 사내 SSO 게이트웨이 헤더 또는 JWT 쿠키/토큰 검증
    const sessionUser = await verifyCorporateAdSsoRequest(request);
    if (!sessionUser) return null;
    return {
      id: sessionUser.empNo,
      name: sessionUser.name,
      departmentId: sessionUser.deptId,
      departmentName: sessionUser.deptName,
    };
  },
});
```

---

## 3. 오픈소스 라이선스 고지 (Open-Source Notices)

1. **Marble Roulette (`roulette-src/`)**
   - 원본: [lazygyu/roulette](https://github.com/lazygyu/roulette)
   - 라이선스: **MIT License** (`roulette-src/LICENSE` 유지)
2. **BattleBox 15 Games (`battlebox/`)**
   - 원본: [assishmoncs/battlebox](https://github.com/assishmoncs/battlebox)
   - 라이선스: **MIT License** (`battlebox/LICENSE` 유지)
3. **Snake Duel (`vendor/snake-duel-original/`, `server/original-engines/snake-duel-engine.mjs`)**
   - 원본: [PawelN93/snake-duel](https://github.com/PawelN93/snake-duel)
   - 라이선스: **MIT License** (`vendor/snake-duel-original/LICENSE` 유지)
   - 원본 30×20 게임 규칙, 150ms tick, Canvas 렌더러와 화면 팔레트를 보존하고 플랫폼 방/BOT/온라인 수명주기만 어댑터로 연결했습니다.
4. **Bomberman / Blast Arena (`vendor/blast-arena-original/`, `server/original-blast-arena-adapter.mjs`)**
   - 원본: [sayedahmedhusain/blast-arena](https://github.com/sayedahmedhusain/blast-arena)
   - 라이선스: **MIT License** (`vendor/blast-arena-original/LICENSE.md` 유지)
   - React로 재구현하지 않고 원본 HTML/CSS/JS, 에셋, 대기실, 채팅, 15ms 게임 루프를 `/original-blast-arena/` 경로에서 직접 실행합니다.
   - 어댑터는 같은 플랫폼 HTTP/WebSocket 서버에 원본을 마운트하는 연결 코드만 담고, 원본 화면·규칙·아이템 로직은 변경하지 않습니다.
   - 원본 2~4인 멀티플레이와 같은 권위 서버에 연결되는 1인 `COM-BOT` 모드를 함께 제공합니다.
   - 비교용 `statist32/bomberman_multiplayer` 원본도 `vendor/bomberman-multiplayer-original/`에 보존하지만, 해당 원본에는 아이템 시스템이 없어 실제 플랫폼 게임 엔진으로 사용하지 않습니다.
5. **HTML5 Bombergirl (`vendor/html5-bombergirl-original/`, `server/original-bombergirl-adapter.mjs`)**
   - 원본: [MattSkala/html5-bombergirl](https://github.com/MattSkala/html5-bombergirl)
   - 소스 코드 라이선스: **MIT License** (`vendor/html5-bombergirl-original/LICENSE.txt` 유지)
   - 원본 싱글 모드(사람 1명 + AI 3명), 17×13 Canvas, 스프라이트, 폭탄, 보너스와 게임 규칙을 직접 실행합니다.
   - 온라인 2인 모드는 플랫폼 방 코드에 맞춰 양쪽 원본 클라이언트의 입력을 중계하며, 원본 화면과 게임 엔진은 재구현하지 않습니다.
