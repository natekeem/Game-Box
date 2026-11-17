import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGameIdentity } from '../identity/GameIdentityProvider.js';

/**
 * Detailed control guides and gameplay rules for all arcade games.
 * Displayed inside the unified [📖 조작법 & 가이드] modal popup.
 */
const DEFAULT_GAME_GUIDES = {
  bomberman: {
    title: 'Blast Arena (봄버맨)',
    controls: [
      { key: '방향키 또는 W, A, S, D', desc: '상·하·좌·우 캐릭터 이동' },
      { key: 'Space', desc: '폭탄 설치' },
    ],
    rules: [
      '나무 상자를 폭파하면 폭탄 개수(+1), 화력(+1), 이동 속도(+1) 강화 아이템이 나옵니다.',
      '자신 또는 상대의 폭탄 폭발 반경(십자 모양 화염)에 닿으면 즉시 탈락합니다.',
      '최후까지 생존하는 1인이 해당 라운드의 우승자가 됩니다.',
    ],
    tip: '벽 뒤에 숨어 안전거리를 확보하고, 상대가 이동할 퇴로를 예측해 폭탄을 배치하세요.',
  },
  bombergirl: {
    title: 'HTML5 Bombergirl',
    controls: [
      { key: '방향키 (↑ ↓ ← →)', desc: '1P 이동' },
      { key: 'Space 또는 Alt', desc: '1P 폭탄 설치' },
      { key: 'W, A, S, D', desc: '2P 이동 (로컬 2인 시)' },
      { key: 'Shift', desc: '2P 폭탄 설치 (로컬 2인 시)' },
      { key: 'Enter', desc: '게임 재시작' },
      { key: 'ESC', desc: '메인 메뉴 이동' },
      { key: 'M', desc: '사운드 켜기/끄기 (Mute)' },
    ],
    rules: [
      '17×13 클래식 그리드에서 3명의 AI 플레이어와 서바이벌 대전을 펼칩니다.',
      '상자를 파괴해 불꽃(화력 증가), 롤러스케이트(스피드), 폭탄(설치 한도 증가)을 획득하세요.',
      '화염에 닿으면 탈락하며 마지막 1인이 승리합니다.',
    ],
    tip: '폭탄을 연속 설치할 때 자신이 갇히지 않도록 탈출로를 먼저 계산하세요.',
  },
  snakeduel: {
    title: 'Snake Duel (스네이크 듀얼)',
    controls: [
      { key: '방향키 또는 W, A, S, D', desc: '뱀 머리 진행 방향 전환' },
    ],
    rules: [
      '필드에 생성되는 먹이를 먹으면 몸길이가 1칸 늘어나고 점수를 획득합니다.',
      '외곽 벽이나 자신의 몸통, 또는 상대 뱀의 몸통에 충돌하면 즉시 패배합니다.',
      '상대 뱀이 움직일 공간을 몸통으로 가두거나 차단하는 것이 핵심 전략입니다.',
    ],
    tip: '초반에는 먹이를 먹어 몸집을 불리고, 후반에는 필드 중앙을 장악하여 상대를 구석으로 모세요.',
  },
  roulette: {
    title: 'Marble Roulette (마블 룰렛)',
    controls: [
      { key: '마우스 클릭', desc: '참가자 명단 입력 / 당첨자 수 설정 / 맵 선택' },
      { key: 'PLAY / START 버튼', desc: '물리 구슬 낙하 레이스 시작' },
    ],
    rules: [
      'Box2D 2D 물리 엔진을 기반으로 모든 구슬이 동일한 물리 조건에서 레이스를 시작합니다.',
      '회전 톱니, 핀, 반사판 등의 장애물을 통과해 결승선에 가장 먼저(또는 설정된 순위) 도달한 구슬이 당첨됩니다.',
    ],
    tip: '참가자 이름 뒤에 *2, *3을 붙여 가중치를 주거나, 맵 선택을 바꿔 색다른 물리 트랙을 즐길 수 있습니다.',
  },
  drawing: {
    title: 'CatchMind (캐치마인드)',
    controls: [
      { key: '마우스 드래그', desc: '출제자: 캔버스 자유 곡선 드로잉 / 색상·굵기 선택' },
      { key: '키보드 타이핑 + Enter', desc: '참가자: 하단 채팅창에 정답 키워드 실시간 입력' },
    ],
    rules: [
      '출제자가 제시어를 보고 그림을 그리면 참가자들은 채팅창에 정답을 추측해 맞춥니다.',
      '가장 먼저 정답을 맞힌 참가자와 그림을 그린 출제자 모두 점수를 획득합니다.',
    ],
    tip: '사물의 가장 특징적인 핵심 실루엣부터 빠르게 그리는 것이 득점에 유리합니다.',
  },
  reaction: {
    title: 'Reaction Battle (순발력 대결)',
    controls: [
      { key: '마우스 좌클릭 또는 Space', desc: '신호 반응 시 즉시 입력' },
    ],
    rules: [
      '신호 대기(빨간색) 화면에서 초록색으로 바뀌는 찰나에 가장 빠르게 클릭하세요.',
      '신호가 바뀌기 전에 미리 클릭하면 부정출발(페널티)로 탈락하거나 시간이 가산됩니다.',
    ],
    tip: '화면 중앙의 색상 변화에 시선을 집중하고 심호흡을 하세요.',
  },
  speedtyping: {
    title: 'Speed Typing (스피드 타이핑)',
    controls: [
      { key: '키보드 한/영 타이핑 + Enter', desc: '제시 문장 입력 및 제출' },
    ],
    rules: [
      '화면에 표시된 문장을 오타 없이 가장 빠르게 입력하는 플레이어가 승리합니다.',
      '정확도 100%를 유지해야 라운드 승점을 온전히 획득합니다.',
    ],
    tip: '타이핑 속도보다 오타를 내지 않는 것이 백스페이스 시간을 절약하는 비결입니다.',
  },
  colormatch: {
    title: 'Color Match (컬러 매치)',
    controls: [
      { key: '마우스 클릭 또는 키패드 1~4', desc: '정답 색상 버튼 선택' },
    ],
    rules: [
      '스트룹(Stroop) 효과 훈련 게임입니다. 글자의 의미(예: "파랑")가 아닌 실제 글자 색상(예: 빨간색)을 골라야 합니다.',
      '제한시간 내에 연속으로 올바른 색상을 클릭할수록 콤보 점수가 누적됩니다.',
    ],
    tip: '글자를 소리 내어 읽지 말고, 시각적인 색상 자체에만 집중하세요.',
  },
  connectfour: {
    title: 'Connect Four (사목)',
    controls: [
      { key: '마우스 클릭', desc: '디스크를 떨어뜨릴 열(1~7열) 선택' },
    ],
    rules: [
      '중력에 의해 디스크가 아래로 떨어지는 7×6 수직 격자판입니다.',
      '자신의 색상 디스크 4개를 가로, 세로, 또는 대각선으로 먼저 일렬로 만드는 쪽이 승리합니다.',
    ],
    tip: '가운데 열(4열)을 선점하면 더 많은 대각선 및 가로 연결 기회를 만들 수 있습니다.',
  },
};

/**
 * GameLauncher:
 * - Clean minimal console bar (Single header, no duplicate wrappers)
 * - Embeds iframe on demand with ?embed=deck & ?nickname=... & ?guestId=...
 * - Dedicated [📖 조작법 & 가이드] modal popup for each game
 */
export default function GameLauncher({
  title,
  src,
  aspectRatio = '4:3',
  game = null,
  onClose,
  allowFullscreen = true,
}) {
  const iframeRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const { identity } = useGameIdentity();

  // Inject embed=deck & guest nickname/id into launch URL
  const effectiveSrc = useMemo(() => {
    if (!src) return '';
    try {
      const url = new URL(src, window.location.origin);
      url.searchParams.set('embed', 'deck');
      if (identity?.nickname) {
        url.searchParams.set('nickname', identity.nickname);
      }
      if (identity?.guestId) {
        url.searchParams.set('guestId', identity.guestId);
      }
      return url.pathname + url.search;
    } catch {
      const sep = src.includes('?') ? '&' : '?';
      let res = `${src}${sep}embed=deck`;
      if (identity?.nickname) {
        res += `&nickname=${encodeURIComponent(identity.nickname)}`;
      }
      if (identity?.guestId) {
        res += `&guestId=${encodeURIComponent(identity.guestId)}`;
      }
      return res;
    }
  }, [src, identity?.nickname, identity?.guestId]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.focus();
    }
    return () => {
      if (iframe) {
        try {
          iframe.src = 'about:blank';
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [effectiveSrc]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showGuide) {
        setShowGuide(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGuide]);

  const handleFullscreen = () => {
    if (iframeRef.current?.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    }
  };

  const gameKey = game?.id || '';
  const guideInfo = DEFAULT_GAME_GUIDES[gameKey] || {
    title: game?.name || title,
    controls: (game?.inputDevices || ['Keyboard', 'Mouse']).map(dev => ({
      key: dev,
      desc: '게임 내 안내 및 화면 컨트롤을 따르세요.',
    })),
    rules: [
      game?.description || '실시간 점수 및 승패가 집계되는 아케이드 게임입니다.',
      '상대방 또는 AI BOT보다 높은 점수를 획득하거나 최후까지 생존하세요.',
    ],
    tip: '규칙을 숙지하고 상대의 움직임을 관찰하여 플레이하세요.',
  };

  return (
    <div className="gb-launcher-frame-wrap" data-aspect={aspectRatio}>
      {/* Sleek Minimal Console Topbar */}
      <div className="gb-launcher-toolbar">
        <div className="gb-launcher-left">
          <span className="gb-launcher-led-dot" />
          <span className="gb-launcher-title">{title}</span>
          <button
            type="button"
            className="gb-launcher-btn gb-launcher-btn-guide"
            onClick={() => setShowGuide(true)}
            title="게임 조작 방법 및 상세 규칙 안내 모달 열기"
          >
            📖 조작법 &amp; 가이드
          </button>
        </div>

        <div className="gb-launcher-actions">
          {identity?.nickname && (
            <span className="gb-launcher-player-badge" title="현재 연동된 플레이어 닉네임">
              👤 {identity.nickname}
            </span>
          )}
          {allowFullscreen && (
            <button
              type="button"
              className="gb-launcher-btn"
              onClick={handleFullscreen}
              title="게임 전체 화면으로 전환"
            >
              전체화면
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="gb-launcher-btn gb-launcher-btn-close"
              onClick={onClose}
              title="게임 전원 끄기 / 팩 분리"
            >
              ✕ 전원 끄기
            </button>
          )}
        </div>
      </div>

      {/* Main Centered Game Stage */}
      <div className="gb-launcher-stage-container">
        <iframe
          ref={iframeRef}
          src={effectiveSrc}
          title={title}
          className="gb-launcher-iframe"
          allow="autoplay; fullscreen"
        />
      </div>

      {/* Unified Controls & Guide Modal Popup */}
      {showGuide && (
        <div
          className="gb-guide-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="gb-guide-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="gb-guide-modal-header">
              <div className="gb-guide-header-title">
                <span className="gb-guide-badge">GAME MANUAL</span>
                <h3>🎮 {guideInfo.title} 조작법 &amp; 가이드</h3>
              </div>
              <button
                type="button"
                className="gb-guide-close-btn"
                onClick={() => setShowGuide(false)}
                title="닫기 (ESC)"
              >
                ✕
              </button>
            </div>

            <div className="gb-guide-modal-body">
              {/* Controls Section */}
              <section className="gb-guide-section">
                <h4>⌨️ 조작 방법</h4>
                <div className="gb-guide-key-list">
                  {guideInfo.controls.map((item, idx) => (
                    <div key={idx} className="gb-guide-key-row">
                      <span className="gb-guide-keycap">{item.key}</span>
                      <span className="gb-guide-keydesc">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Rules Section */}
              <section className="gb-guide-section">
                <h4>🎯 게임 규칙 &amp; 승리 조건</h4>
                <ul className="gb-guide-rule-list">
                  {guideInfo.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </section>

              {/* Tips Section */}
              {guideInfo.tip && (
                <section className="gb-guide-section gb-guide-tip-box">
                  <strong>💡 플레이 팁:</strong>
                  <p>{guideInfo.tip}</p>
                </section>
              )}

              {/* Auto Identity Binding Note */}
              <section className="gb-guide-section gb-guide-identity-note">
                <span className="gb-note-icon">👤</span>
                <div>
                  <strong>플레이어 닉네임 자동 연동 안내</strong>
                  <p>
                    현재 플레이어 <strong>[{identity?.nickname || '게스트'}]</strong> 님의 닉네임이
                    게임 세션과 랭킹에 자동으로 연결되어 있습니다. 별도의 입력 없이 대전을 완료하면 자동으로 전적이 저장됩니다.
                  </p>
                </div>
              </section>
            </div>

            <div className="gb-guide-modal-footer">
              <button
                type="button"
                className="gb-btn-guide-confirm"
                onClick={() => setShowGuide(false)}
              >
                확인 / 게임으로 돌아가기 (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
