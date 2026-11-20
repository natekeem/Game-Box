import React, { useState, useEffect, useCallback } from 'react';
import { GameIdentityProvider, useGameIdentity } from './identity/GameIdentityProvider.js';
import { GameEventBridge } from './runtime/GameEventBridge.js';
import GameBoxHome from './GameBoxHome.js';
import RetroDesktop from './retro/RetroDesktop.js';
import GameDeck from './deck/GameDeck.js';
import DrawPack from './draw/DrawPack.js';
import DeckLab from './deck/lab/DeckLab.jsx';
import './deck/lab/deckLab.css';
import './styles/gameBox.css';
import './GameBoxHome.css';

function normalizeRoutePath(pathname) {
  const clean = String(pathname || '/game-box').replace(/\/+$/, '') || '/game-box';
  if (clean === '/game-box/retro') return '/game-box/retro';
  if (clean === '/game-box/deck') return '/game-box/deck';
  if (clean === '/game-box/draw') return '/game-box/draw';
  if (clean === '/game-box/deck-lab') return '/game-box/deck-lab';
  return '/game-box';
}

function NicknameModal() {
  const {
    identity,
    isNicknameModalOpen,
    closeNicknameModal,
    registerOrChangeNickname,
    syncError,
  } = useGameIdentity();

  const [inputValue, setInputValue] = useState(identity.nickname || '');
  const [localError, setLocalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isNicknameModalOpen) {
      setInputValue(identity.nickname || '');
      setLocalError(null);
    }
  }, [isNicknameModalOpen, identity.nickname]);

  if (!isNicknameModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    const res = await registerOrChangeNickname(inputValue);
    setSubmitting(false);
    if (!res.ok) {
      setLocalError(res.error);
    }
  };

  return (
    <div className="gb-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="gb-nick-modal-title">
      <form className="gb-modal-card" onSubmit={handleSubmit}>
        <h3 id="gb-nick-modal-title">
          {identity.isRegistered ? '플레이어 닉네임 변경' : 'GAME-BOX 플레이어 닉네임 등록'}
        </h3>
        <p>
          {identity.isRegistered
            ? '변경할 닉네임을 입력하세요. 고유 식별자(guestId)가 유지되므로 기존 게임 기록과 랭킹 연결이 그대로 보존됩니다.'
            : '게임을 시작하기 전에 랭킹 및 기록 저장에 사용할 닉네임(2~16자)을 등록해주세요. 한 번 등록하면 다음 접속부터 자동 로그인됩니다.'}
        </p>

        <input
          type="text"
          className="gb-modal-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="닉네임 입력 (한글, 영문, 숫자 2~16자)"
          maxLength={16}
          autoFocus
        />

        {(localError || syncError) && (
          <div className="gb-modal-error" role="alert">
            {localError || syncError}
          </div>
        )}

        <div className="gb-modal-meta">
          고유 식별자 (guestId): {identity.guestId}
        </div>

        <div className="gb-modal-actions">
          {identity.isRegistered && (
            <button
              type="button"
              className="gb-modal-btn-secondary"
              onClick={closeNicknameModal}
              disabled={submitting}
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="gb-modal-btn-primary"
            disabled={submitting}
          >
            {submitting ? '저장 중...' : identity.isRegistered ? '닉네임 변경 저장' : '닉네임 등록 및 시작'}
          </button>
        </div>
      </form>
    </div>
  );
}

function GameBoxInner({ initialRoute }) {
  const { identity, openNicknameModal } = useGameIdentity();
  const [route, setRoute] = useState(() =>
    normalizeRoutePath(initialRoute || (typeof window !== 'undefined' ? window.location.pathname : '/game-box'))
  );

  const navigate = useCallback((targetPath) => {
    const normalized = normalizeRoutePath(targetPath);
    if (typeof window !== 'undefined' && window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setRoute(normalized);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onPopState = () => {
      setRoute(normalizeRoutePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Start global GameEventBridge for postMessage events from embedded game iframes
  useEffect(() => {
    const bridge = new GameEventBridge({
      getIdentity: () => identity,
    });
    bridge.start();
    return () => bridge.stop();
  }, [identity]);

  return (
    <div className="gb-shell">
      <header className="gb-main-header">
        <div
          className="gb-header-brand"
          onClick={() => navigate('/game-box')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/game-box')}
        >
          <span className="gb-header-badge">TOOL BOX</span>
          <h1 className="gb-header-title">GAME-BOX</h1>
        </div>

        <nav className="gb-header-nav" aria-label="GAME-BOX 공간 이동">
          <button
            type="button"
            className={`gb-header-tab ${route === '/game-box' ? 'active' : ''}`}
            onClick={() => navigate('/game-box')}
          >
            HOME
          </button>
          <button
            type="button"
            className={`gb-header-tab ${route === '/game-box/retro' ? 'active' : ''}`}
            onClick={() => navigate('/game-box/retro')}
          >
            RETRO DESKTOP (Win98)
          </button>
          <button
            type="button"
            className={`gb-header-tab ${route === '/game-box/deck' ? 'active' : ''}`}
            onClick={() => navigate('/game-box/deck')}
          >
            GAME DECK (Arcade)
          </button>
          <button
            type="button"
            className={`gb-header-tab ${route === '/game-box/draw' ? 'active' : ''}`}
            onClick={() => navigate('/game-box/draw')}
          >
            DRAW PACK (뽑기)
          </button>
        </nav>

        <div className="gb-header-identity">
          <div className="gb-identity-pill" title={`고유 ID: ${identity.guestId}`}>
            <span>👤</span>
            <strong>{identity.nickname || '닉네임 미등록'}</strong>
            <span className="gb-identity-guest-tag">
              {identity.identityType === 'authenticated' ? 'SSO' : 'GUEST'}
            </span>
          </div>
          <button
            type="button"
            className="gb-identity-edit-btn"
            onClick={openNicknameModal}
          >
            닉네임 변경
          </button>
        </div>
      </header>

      {route === '/game-box/retro' ? (
        <RetroDesktop onNavigate={navigate} />
      ) : route === '/game-box/deck' ? (
        <GameDeck onNavigate={navigate} />
      ) : route === '/game-box/draw' ? (
        <DrawPack onNavigate={navigate} />
      ) : route === '/game-box/deck-lab' ? (
        <DeckLab onNavigate={navigate} />
      ) : (
        <GameBoxHome onNavigate={navigate} />
      )}

      <NicknameModal />
    </div>
  );
}

export default function GameBox({ identityAdapter = null, initialRoute = null }) {
  return (
    <GameIdentityProvider adapter={identityAdapter}>
      <GameBoxInner initialRoute={initialRoute} />
    </GameIdentityProvider>
  );
}
