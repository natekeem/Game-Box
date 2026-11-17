import React, { useState, useEffect, useRef } from 'react';
import { ARCADE_GAMES } from '../../registry/arcadeGames.js';
import GameCaseCard from '../cases/GameCaseCard.jsx';
import { ensureCaseStyle, lookFor, runInsert } from '../cases/FinallyCaseEngine.js';
import { generateArcadeCoverSvg } from '../cases/gameCoverGenerator.js';

// 3 Test Game Packs specified in STEP 3
const TEST_GAME_IDS = ['bomberman', 'snakeduel', 'reaction'];

export default function DeckLab({ onNavigate }) {
  const [selectedGameId, setSelectedGameId] = useState('snakeduel');
  const [animState, setAnimState] = useState('selected'); // idle, selected, opening, extracting, inserting, ready, playing, ejecting, returning
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [logMessages, setLogMessages] = useState([]);
  const slotRef = useRef(null);

  const testGames = ARCADE_GAMES.filter(g => TEST_GAME_IDS.includes(g.id));
  const selectedGame = testGames.find(g => g.id === selectedGameId) || testGames[0];

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogMessages(prev => [`[${time}] ${msg}`, ...prev.slice(0, 19)]);
  };

  useEffect(() => {
    ensureCaseStyle(document);
    addLog('Finally 3D Game Cases Engine 스타일시트 및 Web Audio 초기화 완료.');
  }, []);

  const handleSelect = (game) => {
    if (['opening', 'extracting', 'inserting', 'ejecting'].includes(animState)) {
      return; // prevent switching mid-animation
    }
    setSelectedGameId(game.id);
    setAnimState('selected');
    addLog(`게임팩 선택: ${game.name} (${game.discLabel})`);
  };

  const handlePlayInsert = async () => {
    if (['opening', 'extracting', 'inserting'].includes(animState)) return;

    setAnimState('opening');
    addLog(`PLAY 트리거: 3D 케이스 개폐 및 디스크 추출 시퀀스 시작 [${selectedGame.name}]`);

    const selectedEl = document.querySelector(`[data-game-id="${selectedGame.id}"]`);
    const rect = selectedEl ? selectedEl.getBoundingClientRect() : null;
    const slotRect = slotRef.current ? slotRef.current.getBoundingClientRect() : null;
    const look = lookFor(selectedGame);
    const art = generateArcadeCoverSvg(selectedGame);

    await runInsert(
      document,
      { rect, art, look },
      'auto',
      soundEnabled,
      {
        slotRect,
        onStateChange: (step) => {
          if (step === 'case-flying') {
            setAnimState('opening');
            addLog('상태 전환: 3D 케이스가 컬렉션에서 앞으로 팝업');
          } else if (step === 'case-opened') {
            setAnimState('opening');
            addLog('상태 전환: 케이스 커버 160도 개폐 완료 (내부 트레이 노출)');
          } else if (step === 'disc-extracted') {
            setAnimState('extracting');
            addLog('상태 전환: 디스크가 허브에서 추출되어 공중으로 부유');
          } else if (step === 'disc-inserting') {
            setAnimState('inserting');
            addLog('상태 전환: 디스크 1080도 고속 회전 및 슬롯 진입 궤적 이동');
          } else if (step === 'disc-inserted') {
            setAnimState('ready');
            addLog('상태 전환: 디스크 콘솔 슬롯 삽입 완료 (블루 LED 발광)');
          } else if (step === 'case-closed') {
            addLog('상태 전환: 케이스 스냅 닫힘 및 컬렉션 복귀');
          } else if (step === 'done') {
            setAnimState('playing');
            addLog('완료: 게임 실행 준비 상태 (playing)');
          }
        },
      }
    );
  };

  const handleEject = async () => {
    if (['opening', 'extracting', 'inserting', 'ejecting'].includes(animState)) return;

    setAnimState('ejecting');
    addLog(`EJECT 트리거: 디스크 배출 및 케이스 복귀 시퀀스 시작 [${selectedGame.name}]`);

    const selectedEl = document.querySelector(`[data-game-id="${selectedGame.id}"]`);
    const rect = selectedEl ? selectedEl.getBoundingClientRect() : null;
    const slotRect = slotRef.current ? slotRef.current.getBoundingClientRect() : null;
    const look = lookFor(selectedGame);
    const art = generateArcadeCoverSvg(selectedGame);

    await runInsert(
      document,
      { rect, art, look },
      'auto',
      soundEnabled,
      {
        eject: true,
        slotRect,
        onStateChange: (step) => {
          if (step === 'eject-started') {
            setAnimState('ejecting');
            addLog('상태 전환: 콘솔 슬롯에서 디스크 배출 시작');
          } else if (step === 'disc-ejected') {
            setAnimState('ejecting');
            addLog('상태 전환: 디스크가 슬롯에서 나와 케이스로 궤적 이동');
          } else if (step === 'disc-returned') {
            setAnimState('returning');
            addLog('상태 전환: 디스크가 케이스 트레이로 안착');
          } else if (step === 'case-closed') {
            addLog('상태 전환: 케이스 커버 닫힘');
          } else if (step === 'done') {
            setAnimState('selected');
            addLog('완료: 디스크 배출 및 컬렉션 복귀 완료 (selected)');
          }
        },
      }
    );
  };

  return (
    <div className="gb-deck-lab-shell" data-testid="deck-lab-stage">
      <div className="gb-subbar gb-subbar-dark">
        <div className="gb-subbar-left">
          <button
            type="button"
            className="gb-subbar-back"
            onClick={() => onNavigate && onNavigate('/game-box/deck')}
          >
            &larr; GAME DECK 정식 화면으로
          </button>
          <span className="gb-subbar-divider">|</span>
          <strong className="gb-subbar-title">DECK LAB — 외부 오픈소스 게임팩 엔진 독립 검증 환경</strong>
          <span className="gb-subbar-hint">
            Finally 3D Game Cases 원본 입체 렌더링, Web Audio 효과음, 개폐/추출/삽입/배출 인터랙션 테스트
          </span>
        </div>
        <div className="gb-subbar-actions">
          <button
            type="button"
            className="gb-subbar-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔊 Web Audio 효과음 ON' : '🔇 사운드 MUTE'}
          </button>
        </div>
      </div>

      <div className="gb-deck-lab-content">
        {/* TOP STATUS BAR */}
        <div className="gb-lab-status-panel">
          <div className="gb-lab-state-box">
            <span className="gb-lab-label">인터랙션 상태 머신:</span>
            <span className={`gb-lab-badge badge-${animState}`} data-testid="state-badge">
              {animState.toUpperCase()}
            </span>
          </div>
          <div className="gb-lab-current-box">
            <span className="gb-lab-label">현재 선택된 게임팩:</span>
            <strong>{selectedGame.name}</strong> <code>[{selectedGame.discLabel}]</code>
          </div>
          <div className="gb-lab-btn-group">
            <button
              type="button"
              className="gb-lab-action-btn btn-play"
              data-testid="btn-play"
              onClick={handlePlayInsert}
              disabled={['opening', 'extracting', 'inserting', 'ejecting'].includes(animState)}
            >
              ▶ PLAY (케이스 열림 + 디스크 추출 + 삽입)
            </button>
            <button
              type="button"
              className="gb-lab-action-btn btn-eject"
              data-testid="btn-eject"
              onClick={handleEject}
              disabled={['opening', 'extracting', 'inserting', 'ejecting'].includes(animState) || animState === 'selected' || animState === 'idle'}
            >
              ⏏ EJECT (디스크 배출 + 케이스 복귀)
            </button>
          </div>
        </div>

        {/* 3D GAME PACK SHELF (3 CASES) */}
        <div className="gb-lab-stage-zone" data-sanso-stage="big">
          <div className="gb-lab-section-title">
            <h3>🎮 3D PHYSICAL GAME CASES (FINALLY-3D-GAME-CASES ENGINE)</h3>
            <p>실제 두께, 측면 스파인, 상·하·후면 입체면, 광택(Gloss), 모서리 슬리브 및 그림자 표현</p>
          </div>

          <div className="gb-lab-case-row">
            {testGames.map((game) => (
              <div key={game.id} className="gb-lab-case-wrapper">
                <GameCaseCard
                  game={game}
                  isSelected={game.id === selectedGame.id}
                  onClick={() => handleSelect(game)}
                  width={200}
                  height={300}
                  className={`lab-case-${game.id}`}
                />
                <div className="gb-lab-case-meta">
                  <strong>{game.name}</strong>
                  <span>{game.discLabel}</span>
                  <span className="gb-lab-genre-tag">{game.genre}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SIMULATED CONSOLE SLOT TARGET */}
          <div className="gb-lab-console-slot-container">
            <div className="gb-lab-slot-box" ref={slotRef} data-testid="console-slot-target">
              <div className="gb-lab-slot-hardware">
                <div className="gb-lab-slot-leds">
                  <span className={`gb-lab-led ${animState === 'playing' ? 'on' : 'standby'}`} />
                  <span className="gb-lab-slot-title">GAME DECK OPTICAL DRIVE UNIT</span>
                </div>
                <div className="gb-lab-slot-opening">
                  <div className={`gb-lab-slot-lip ${animState === 'inserting' || animState === 'ready' ? 'active' : ''}`} />
                </div>
                <div className="gb-lab-slot-status">
                  {animState === 'playing'
                    ? 'DISC LOADED · RUNNING'
                    : animState === 'inserting'
                    ? 'INSERTING DISC...'
                    : animState === 'ejecting'
                    ? 'EJECTING DISC...'
                    : 'READY FOR DISC INSERTION'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOG TERMINAL */}
        <div className="gb-lab-log-panel">
          <h4>📋 REALTIME INTERACTION &amp; AUDIO EVENT LOG</h4>
          <div className="gb-lab-log-box" data-testid="log-box">
            {logMessages.map((log, idx) => (
              <div key={idx} className="gb-lab-log-line">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
