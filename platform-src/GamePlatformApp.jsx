import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PLATFORM_GAMES, GAME_CATEGORIES, getGameById } from './registry.js';
import { PlatformApiClient } from './api-client.js';
import { MarbleRouletteView } from './components/MarbleRouletteView.jsx';
import { GamePlayStage } from './components/GamePlayStage.jsx';
import { OriginalBombermanArena, OriginalBombergirlArena } from './components/OriginalArcadeArenas.jsx';
import { EventGroupsView } from './components/EventGroupsView.jsx';
import { RankingsAndStatsView } from './components/RankingsAndStatsView.jsx';

export function GamePlatformApp({ userProvider, apiBaseUrl = '/api/platform' }) {
  const [currentUser, setCurrentUser] = useState(() => userProvider.getCurrentUser());
  const [activeTab, setActiveTab] = useState('arcade'); // arcade | events | rankings
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEventId, setActiveEventId] = useState(null);
  const [activeEventsList, setActiveEventsList] = useState([]);

  // Active Game / Room state
  const [activeGameId, setActiveGameId] = useState(null);
  const [originalBombermanMode, setOriginalBombermanMode] = useState('online');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [publicGameState, setPublicGameState] = useState(null);
  const [privateRoleState, setPrivateRoleState] = useState(null);
  const [drawingStrokes, setDrawingStrokes] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  const [publicRooms, setPublicRooms] = useState([]);
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Quick BOT modal config
  const [botModalGame, setBotModalGame] = useState(null);
  const [botCountOption, setBotCountOption] = useState(1);
  const [botDiffOption, setBotDiffOption] = useState('normal');
  const [lobbyBotDiff, setLobbyBotDiff] = useState('normal');

  const apiRef = useRef(null);
  const launchRequestRef = useRef(0);
  if (!apiRef.current) {
    apiRef.current = new PlatformApiClient({
      baseUrl: apiBaseUrl,
      userProvider,
      getUser: () => userProvider.getCurrentUser(),
    });
  }
  const api = apiRef.current;

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? '' : prev));
    }, 3500);
  }, []);

  useEffect(() => {
    return userProvider.subscribe((nextUser) => {
      setCurrentUser(nextUser);
    });
  }, [userProvider]);

  const refreshLobbyData = useCallback(async () => {
    try {
      const [roomsRes, eventsRes, usersRes] = await Promise.all([
        api.listRooms(),
        api.listEventGroups(),
        api.listUsers(),
      ]);
      setPublicRooms(roomsRes.rooms || []);
      setActiveEventsList((eventsRes.events || []).filter(e => e.status === 'active'));
      setDirectoryUsers(usersRes.users || []);
      setDepartments(usersRes.departments || []);
    } catch {
      // ignore background refresh error
    }
  }, [api]);

  useEffect(() => {
    refreshLobbyData();
    const timer = setInterval(refreshLobbyData, 5000);
    return () => clearInterval(timer);
  }, [refreshLobbyData]);

  // Check URL query parameter for ?room=CODE or ?mockUser=ID
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlMockUser = params.get('mockUser');
    if (urlMockUser && userProvider.allowMockUserSwitch) {
      userProvider.switchMockUser(urlMockUser);
    }
    const urlRoom = params.get('room');
    if (urlRoom) {
      setJoinCodeInput(urlRoom.toUpperCase());
    }
    const urlGame = params.get('game');
    if (urlGame) {
      const targetGame = getGameById(urlGame);
      if (targetGame) {
        setActiveGameId(targetGame.id);
        const autoMode = params.get('mode');
        if (autoMode === 'single') {
          setTimeout(() => {
            handleLaunchSingleVsBot(targetGame, 'normal');
          }, 60);
        }
      }
    }
  }, [userProvider]);

  // Subscribe to SSE when inside a room
  useEffect(() => {
    const roomCode = currentRoom?.code;
    if (!roomCode || !currentUser?.id) return undefined;

    const unsubscribe = api.subscribeRoomStream(roomCode, {
      onEvent: (event, data) => {
        // A user can still belong to an old room after a browser refresh. The
        // SSE transport is user-scoped, so never let another room's rapid
        // arcade updates overwrite the room currently shown on screen.
        const eventRoomCode = data?.roomCode || data?.code || null;
        if (eventRoomCode && eventRoomCode !== roomCode) return;
        if (event === 'roomSnapshot' || event === 'roomUpdated' || event === 'rematchReady') {
          setCurrentRoom(data);
          if (event === 'rematchReady') {
            setMatchResult(null);
            setPublicGameState(null);
            setPrivateRoleState(null);
            setDrawingStrokes([]);
          }
        } else if (event === 'gameStarted') {
          setCurrentRoom(data);
          setMatchResult(null);
          setPrivateRoleState(null);
          setDrawingStrokes([]);
          if (data.lastPublicGameState) {
            setPublicGameState(data.lastPublicGameState);
          }
        } else if (event === 'updateGameState') {
          setPublicGameState(data);
        } else if (event === 'drawingRole') {
          setPrivateRoleState(data);
          setDrawingStrokes([]);
        } else if (event === 'drawingStroke') {
          setDrawingStrokes(prev => [...prev, data]);
        } else if (event === 'drawingClear') {
          setDrawingStrokes([]);
        } else if (event === 'drawingGuessChat') {
          setPublicGameState(prev => ({ ...(prev || {}), lastChat: data }));
        } else if (event === 'gameOver') {
          setMatchResult(data);
          setCurrentRoom(prev => (prev ? { ...prev, state: 'finished', lastResult: data } : prev));
        } else if (event === 'gameAborted') {
          showToast(data?.reason || '게임이 중단되어 대기실로 돌아갑니다.');
          setCurrentRoom(prev => (prev ? { ...prev, state: 'lobby' } : prev));
        } else if (event === 'error') {
          showToast(typeof data === 'string' ? data : data?.message || '오류가 발생했습니다.');
        }
      },
    });

    return () => unsubscribe();
  }, [api, currentRoom?.code, currentUser?.id, showToast]);

  // ─── Game Launchers ─────────────────────────────────────────────────────────
  const isRouletteGame = (gid) => gid === 'roulette' || gid === 'marble-roulette';

  const handleOpenMarbleRoulette = () => {
    launchRequestRef.current += 1;
    setActiveGameId('roulette');
    setCurrentRoom(null);
  };

  const handleOpenOriginalBomberman = (mode = 'online') => {
    launchRequestRef.current += 1;
    setOriginalBombermanMode(mode);
    setActiveGameId('bomberman');
    setCurrentRoom(null);
    setMatchResult(null);
    setPublicGameState(null);
  };

  const handleOpenOriginalBombergirl = () => {
    launchRequestRef.current += 1;
    setActiveGameId('bombergirl');
    setCurrentRoom(null);
    setMatchResult(null);
    setPublicGameState(null);
  };

  const handleLaunchSingleVsBot = async (game, difficulty = 'normal') => {
    if (isRouletteGame(game.id)) {
      handleOpenMarbleRoulette();
      return;
    }
    if (game.id === 'bomberman') {
      handleOpenOriginalBomberman('bot');
      return;
    }
    if (game.id === 'bombergirl') {
      handleOpenOriginalBombergirl();
      return;
    }
    const requestId = ++launchRequestRef.current;
    try {
      const maxBots = Math.max(1, (game.maxPlayers || 2) - 1);
      const count = Math.min(maxBots, 1);
      const res = await api.createRoom({
        gameId: game.id,
        mode: 'bot',
        botCount: count,
        botDifficulty: difficulty || 'normal',
        eventId: activeEventId,
      });
      if (requestId !== launchRequestRef.current) return;
      const room = res.room;
      setCurrentRoom(room);
      setActiveGameId(game.id);
      setMatchResult(null);
      setPublicGameState(null);
      const started = await api.startRoom(room.code);
      if (requestId !== launchRequestRef.current) return;
      setCurrentRoom(started.room);
      if (started.room?.lastPublicGameState) {
        setPublicGameState(started.room.lastPublicGameState);
      }
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleStartSoloPractice = async (game) => {
    return handleLaunchSingleVsBot(game, 'normal');
  };

  const handleOpenBotModal = (game) => {
    if (isRouletteGame(game.id)) {
      handleOpenMarbleRoulette();
      return;
    }
    if (game.id === 'bomberman') {
      handleOpenOriginalBomberman('bot');
      return;
    }
    if (game.id === 'bombergirl') {
      handleOpenOriginalBombergirl();
      return;
    }
    const maxBots = Math.max(1, (game.maxPlayers || 2) - 1);
    setBotCountOption(Math.min(1, maxBots));
    setBotDiffOption('normal');
    setBotModalGame(game);
  };

  const handleLaunchBotMatch = async () => {
    if (!botModalGame) return;
    const game = botModalGame;
    const requestId = ++launchRequestRef.current;
    setBotModalGame(null);
    try {
      const maxBots = Math.max(1, (game.maxPlayers || 2) - 1);
      const count = Math.min(maxBots, Number(botCountOption) || 1);
      const res = await api.createRoom({
        gameId: game.id,
        mode: 'bot',
        botCount: count,
        botDifficulty: botDiffOption,
        eventId: activeEventId,
      });
      if (requestId !== launchRequestRef.current) return;
      const room = res.room;
      setCurrentRoom(room);
      setActiveGameId(game.id);
      setMatchResult(null);
      setPublicGameState(null);
      const started = await api.startRoom(room.code);
      if (requestId !== launchRequestRef.current) return;
      setCurrentRoom(started.room);
      if (started.room?.lastPublicGameState) {
        setPublicGameState(started.room.lastPublicGameState);
      }
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleCreateOnlineRoom = async (game) => {
    if (isRouletteGame(game.id)) {
      handleOpenMarbleRoulette();
      return;
    }
    if (game.id === 'bomberman') {
      handleOpenOriginalBomberman('online');
      return;
    }
    const requestId = ++launchRequestRef.current;
    try {
      const res = await api.createRoom({
        gameId: game.id,
        mode: 'online',
        botCount: 0,
        botDifficulty: 'normal',
        eventId: activeEventId,
      });
      if (requestId !== launchRequestRef.current) return;
      setCurrentRoom(res.room);
      setActiveGameId(game.id);
      setMatchResult(null);
      setPublicGameState(null);
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleJoinRoomByCode = async (codeToJoin) => {
    const clean = String(codeToJoin || joinCodeInput || '').trim().toUpperCase();
    if (!clean) {
      showToast('참가할 방 코드를 입력하세요.');
      return;
    }
    const requestId = ++launchRequestRef.current;
    try {
      const res = await api.joinRoom(clean);
      if (requestId !== launchRequestRef.current) return;
      setCurrentRoom(res.room);
      setActiveGameId(res.room.game);
      setMatchResult(res.room.lastResult || null);
      setPublicGameState(res.room.lastPublicGameState || null);
      setJoinCodeInput('');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleLeaveCurrentRoom = async () => {
    launchRequestRef.current += 1;
    if (currentRoom?.code) {
      try {
        await api.leaveRoom(currentRoom.code);
      } catch {
        // ignore
      }
    }
    setCurrentRoom(null);
    // Preserve activeGameId so we return to this game's dedicated waiting room instead of global catalog
    setPublicGameState(null);
    setPrivateRoleState(null);
    setMatchResult(null);
    setDrawingStrokes([]);
    refreshLobbyData();
  };

  const handleCopyInviteLink = () => {
    if (!currentRoom?.code || typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}?room=${currentRoom.code}`;
    navigator.clipboard?.writeText(url);
    showToast(`초대 링크가 복사되었습니다! (방 코드: ${currentRoom.code})`);
  };

  const handleSendGameAction = async (actionPayload) => {
    if (!currentRoom?.code) return;
    try {
      const res = await api.sendGameAction(currentRoom.code, actionPayload);
      if (res && res.ok === false && res.error) {
        showToast(res.error);
      }
    } catch (err) {
      showToast(err.message);
    }
  };

  const filteredGames = useMemo(() => {
    return PLATFORM_GAMES.filter(g => {
      if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          g.subtitle.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const activeGameMeta = getGameById(currentRoom?.game || activeGameId);
  const roomHostId = currentRoom?.hostId || currentRoom?.host || null;
  const isRoomHost = !!currentRoom && roomHostId === currentUser?.id;
  const myRoomPlayer = currentRoom?.players?.find(p => p.id === currentUser?.id);
  const supportsRoomBots = currentRoom?.game !== 'bombergirl' && activeGameMeta?.supportsBot;

  const isDeckEmbed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('embed') === 'deck' || window.self !== window.top;
  }, []);

  return (
    <div className={`gp-root ${isDeckEmbed ? 'gp-deck-embed' : ''}`}>
      {/* Top Corporate Portal Bar (Hidden in GAME DECK embed mode to avoid 2-layer headers) */}
      {!isDeckEmbed && (
        <header className="gp-topbar">
          <div className="gp-topbar-brand" onClick={handleLeaveCurrentRoom} style={{ cursor: 'pointer' }}>
            <span className="gp-brand-logo">🎯</span>
            <div>
              <h1 className="gp-brand-title">GAME-BOX 사내 미니게임 플랫폼</h1>
              <span className="gp-brand-sub">Marble Roulette · BattleBox 15종 · Snake Duel · Bomberman · Bombergirl · CatchMind</span>
            </div>
          </div>

          <nav className="gp-topbar-nav">
            <button
              type="button"
              className={`gp-nav-btn ${activeTab === 'arcade' && !activeGameId ? 'active' : ''}`}
              onClick={() => {
                handleLeaveCurrentRoom();
                setActiveTab('arcade');
              }}
            >
              🎮 미니게임 로비 (20종)
            </button>
            <button
              type="button"
              className={`gp-nav-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => {
                handleLeaveCurrentRoom();
                setActiveTab('events');
              }}
            >
              🏆 이벤트 그룹 / 대회
            </button>
            <button
              type="button"
              className={`gp-nav-btn ${activeTab === 'rankings' ? 'active' : ''}`}
              onClick={() => {
                handleLeaveCurrentRoom();
                setActiveTab('rankings');
              }}
            >
              📊 공식 랭킹 / 전적
            </button>
            <button
              type="button"
              className={`gp-nav-btn ${activeTab === 'win98' ? 'active' : ''}`}
              onClick={() => {
                handleLeaveCurrentRoom();
                setActiveTab('win98');
              }}
              style={{ border: '1px solid #38bdf8' }}
            >
              🪟 한글 Windows 98 (타자2종·피카츄배구)
            </button>
          </nav>

          <div className="gp-topbar-user">
            {/* Active Event Group selector */}
            <div className="gp-active-event-picker">
              <label title="선택 시 공식 온라인 경기 결과가 해당 이벤트 그룹 점수로도 집계됩니다.">🏆 활성 이벤트:</label>
              <select
                className="gp-select gp-select-sm"
                value={activeEventId || ''}
                onChange={e => setActiveEventId(e.target.value || null)}
              >
                <option value="">일반 공식전 (이벤트 미지정)</option>
                {activeEventsList.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>

            {/* Current Corporate User Identity */}
            <div className="gp-user-card" title={`사번/고유ID: ${currentUser?.id}`}>
              <span className="gp-user-dept">{currentUser?.departmentName}</span>
              <strong className="gp-user-name">{currentUser?.name}</strong>
            </div>

            {/* Dev-Only Mock User Switcher */}
            {userProvider.allowMockUserSwitch && (
              <div className="gp-mock-switcher">
                <label htmlFor="gp-mock-user-select">🧪 테스트 계정:</label>
                <select
                  id="gp-mock-user-select"
                  className="gp-select gp-select-sm"
                  value={currentUser?.id || ''}
                  onChange={e => userProvider.switchMockUser(e.target.value)}
                >
                  {userProvider.listAvailableMockUsers().map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.departmentName})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>
      )}

      {toastMessage && (
        <div className="gp-toast-banner" role="status">
          {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="gp-main">
        {/* 1. Marble Roulette View */}
        {isRouletteGame(activeGameId) ? (
          <MarbleRouletteView
            api={api}
            currentUser={currentUser}
            users={directoryUsers}
            departments={departments}
            activeEventId={activeEventId}
            onBack={handleLeaveCurrentRoom}
          />
        ) : activeGameId === 'bomberman' && !currentRoom ? (
          <div className="gp-room-container gp-original-game-container">
            <div className="gp-room-topbar">
              <div className="gp-room-title-group">
                <span className="gp-game-icon-lg">💣</span>
                <div>
                  <h2>
                    Blast Arena{' '}
                    <span className={`gp-mode-badge mode-${originalBombermanMode === 'bot' ? 'bot' : 'online'}`}>
                      {originalBombermanMode === 'bot' ? '🤖 SINGLE VS COM' : 'ORIGINAL ONLINE'}
                    </span>
                  </h2>
                  <p className="gp-muted">
                    원본 대기실·채팅·게임 화면·아이템·규칙을 그대로 실행합니다.
                    {originalBombermanMode === 'bot' ? ' COM-BOT이 자동으로 참가합니다.' : ''}
                  </p>
                </div>
              </div>
              <button type="button" className="gp-btn gp-btn-secondary" onClick={handleLeaveCurrentRoom}>
                ← 게임 로비로
              </button>
            </div>
            <OriginalBombermanArena mode={originalBombermanMode} />
          </div>
        ) : activeGameId === 'bombergirl' && !currentRoom ? (
          <div className="gp-room-container gp-original-game-container">
            <div className="gp-room-topbar">
              <div className="gp-room-title-group">
                <span className="gp-game-icon-lg">👧</span>
                <div>
                  <h2>HTML5 Bombergirl <span className="gp-mode-badge mode-bot">원본 싱글 · AI 3명</span></h2>
                  <p className="gp-muted">MattSkala 원본의 17×13 화면·스프라이트·폭탄·보너스·AI를 그대로 실행합니다.</p>
                </div>
              </div>
              <button type="button" className="gp-btn gp-btn-secondary" onClick={handleLeaveCurrentRoom}>
                ← 게임 로비로
              </button>
            </div>
            <OriginalBombergirlArena mode="single" currentUser={currentUser} />
          </div>
        ) : currentRoom ? (
          /* 2. Active Room Lobby or Gameplay Stage */
          <div className="gp-room-container">
            <div className="gp-room-topbar">
              <div className="gp-room-title-group">
                <span className="gp-game-icon-lg">{activeGameMeta?.icon || '🎮'}</span>
                <div>
                  <h2>
                    {activeGameMeta?.name || currentRoom.game}
                    <span className="gp-room-code-badge">방 코드: {currentRoom.code}</span>
                    <span className={`gp-mode-badge mode-${currentRoom.mode}`}>
                      {currentRoom.mode === 'solo' ? '혼자 연습' : currentRoom.mode === 'bot' ? '🤖 AI BOT 대결' : '🌐 온라인 대전'}
                    </span>
                  </h2>
                  <p className="gp-muted">{activeGameMeta?.description}</p>
                </div>
              </div>
              <div className="gp-btn-row">
                {currentRoom.mode === 'online' && (
                  <button type="button" className="gp-btn gp-btn-secondary gp-btn-sm" onClick={handleCopyInviteLink}>
                    🔗 초대 링크 복사 ({currentRoom.code})
                  </button>
                )}
                <button type="button" className="gp-btn gp-btn-danger gp-btn-sm" onClick={handleLeaveCurrentRoom}>
                  ← 방 나가기
                </button>
              </div>
            </div>

            {currentRoom.state === 'lobby' ? (
              <div className="gp-room-lobby-grid">
                <div className="gp-panel">
                  <h3>참가자 목록 ({currentRoom.players.length} / {activeGameMeta?.maxPlayers || 8}명)</h3>
                  <ul className="gp-room-player-list">
                    {currentRoom.players.map(p => (
                      <li key={p.id} className={`gp-room-player-item ${p.id === currentUser?.id ? 'is-me' : ''}`}>
                        <div className="gp-room-player-info">
                          <span className="gp-player-avatar">{p.isBot ? '🤖' : '👤'}</span>
                          <div>
                            <strong>{p.name}</strong>
                            {p.id === roomHostId && <span className="gp-host-tag">방장</span>}
                            <div className="gp-muted-sm">
                              {p.isBot ? `AI BOT · 난이도: ${(p.botDifficulty || 'normal').toUpperCase()}` : p.departmentName}
                            </div>
                          </div>
                        </div>
                        <div className="gp-room-player-actions">
                          <span className={`gp-ready-pill ${p.ready ? 'ready' : 'waiting'}`}>
                            {p.ready ? '준비 완료' : '대기 중'}
                          </span>
                          {isRoomHost && p.isBot && (
                            <button
                              type="button"
                              className="gp-btn gp-btn-xs gp-btn-danger"
                              onClick={async () => {
                                try {
                                  const res = await api.removeBot(currentRoom.code, p.id);
                                  setCurrentRoom(res.room);
                                } catch (err) {
                                  showToast(err.message);
                                }
                              }}
                            >
                              제거
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="gp-panel gp-room-controls-panel">
                  <h3>방 설정 및 시작</h3>
                  {supportsRoomBots && (
                    <p className="gp-muted">
                      온라인 방에서도 인원이 부족할 때 AI BOT을 자유롭게 추가하여 함께 플레이할 수 있습니다.
                      (단, BOT이 포함된 경기는 연습 경기로 분류되어 공식 사내 랭킹에는 영향을 주지 않습니다.)
                    </p>
                  )}

                  {isRoomHost && supportsRoomBots && (
                    <div className="gp-bot-adder-box">
                      <label>🤖 대기실에 AI BOT 추가</label>
                      <div className="gp-btn-row">
                        <select
                          className="gp-select gp-select-sm"
                          value={lobbyBotDiff}
                          onChange={e => setLobbyBotDiff(e.target.value)}
                        >
                          <option value="easy">쉬움 (Easy)</option>
                          <option value="normal">보통 (Normal)</option>
                          <option value="hard">어려움 (Hard)</option>
                        </select>
                        <button
                          type="button"
                          className="gp-btn gp-btn-sm gp-btn-secondary"
                          disabled={currentRoom.players.length >= (activeGameMeta?.maxPlayers || 8)}
                          onClick={async () => {
                            try {
                              const res = await api.addBot(currentRoom.code, lobbyBotDiff);
                              setCurrentRoom(res.room);
                            } catch (err) {
                              showToast(err.message);
                            }
                          }}
                        >
                          + BOT 1명 추가
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="gp-lobby-main-actions">
                    {myRoomPlayer && (
                      <button
                        type="button"
                        className="gp-btn gp-btn-secondary gp-btn-lg"
                        onClick={async () => {
                          try {
                            const res = await api.setReady(currentRoom.code, !myRoomPlayer.ready);
                            setCurrentRoom(res.room);
                          } catch (err) {
                            showToast(err.message);
                          }
                        }}
                      >
                        {myRoomPlayer.ready ? '준비 해제' : '✓ 준비 완료'}
                      </button>
                    )}

                    {isRoomHost ? (
                      <button
                        type="button"
                        className="gp-btn gp-btn-primary gp-btn-lg gp-btn-start-game"
                        onClick={async () => {
                          try {
                            const res = await api.startRoom(currentRoom.code);
                            setCurrentRoom(res.room);
                            if (res.room?.lastPublicGameState) {
                              setPublicGameState(res.room.lastPublicGameState);
                            }
                          } catch (err) {
                            showToast(err.message);
                          }
                        }}
                      >
                        🚀 게임 시작하기 (START)
                      </button>
                    ) : (
                      <div className="gp-waiting-host-notice">
                        <span>⏳ 방장이 게임을 시작하기를 기다리고 있습니다... 준비 완료를 눌러주세요.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Playing or Finished State */
              <div className="gp-active-match-area">
                {matchResult && (
                  <div className="gp-match-result-banner">
                    <div className="gp-match-result-header">
                      <h3>
                        🏁 게임 종료!{' '}
                        {matchResult.winner
                          ? `🏆 우승: ${matchResult.winner}`
                          : '무승부 / 경기 완료'}
                      </h3>
                      <span className={`gp-official-pill ${matchResult.isOfficial ? 'official' : 'practice'}`}>
                        {matchResult.isOfficial ? '✓ 공식 랭킹 반영됨' : '연습 / BOT 대결 (공식 랭킹 제외)'}
                      </span>
                    </div>

                    {matchResult.standings && matchResult.standings.length > 0 && (
                      <div className="gp-podium-list">
                        {matchResult.standings.map(st => (
                          <div key={st.id} className={`gp-podium-item rank-${st.rank}`}>
                            <span className="gp-podium-rank">#{st.rank}</span>
                            <strong>{st.name}</strong>
                            <span className="gp-muted-sm">{st.isBot ? 'AI BOT' : st.departmentName}</span>
                            <span className="gp-podium-score">{st.score}점</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="gp-btn-row">
                      <button
                        type="button"
                        className="gp-btn gp-btn-primary"
                        onClick={async () => {
                          try {
                            const res = await api.rematch(currentRoom.code);
                            setCurrentRoom(res.room);
                            setMatchResult(null);
                            if (currentRoom.mode !== 'online') {
                              const started = await api.startRoom(currentRoom.code);
                              setCurrentRoom(started.room);
                              if (started.room?.lastPublicGameState) {
                                setPublicGameState(started.room.lastPublicGameState);
                              }
                            }
                          } catch (err) {
                            showToast(err.message);
                          }
                        }}
                      >
                        🔄 즉시 재대결 (Rematch)
                      </button>
                      <button
                        type="button"
                        className="gp-btn gp-btn-secondary"
                        onClick={handleLeaveCurrentRoom}
                      >
                        ← 대기실로 나가기
                      </button>
                    </div>
                  </div>
                )}

                <GamePlayStage
                  gameId={currentRoom.game}
                  room={currentRoom}
                  currentUser={currentUser}
                  gameStateData={publicGameState || currentRoom.lastPublicGameState}
                  publicState={publicGameState || currentRoom.lastPublicGameState}
                  privateRole={privateRoleState}
                  drawingStrokes={drawingStrokes}
                  onAction={handleSendGameAction}
                />
              </div>
            )}
          </div>
        ) : activeTab === 'win98' ? (
          <div className="gp-room-container gp-original-game-container" style={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
            <div className="gp-room-topbar">
              <div className="gp-room-title-group">
                <span className="gp-game-icon-lg">🪟</span>
                <div>
                  <h2>한글 Windows 98 추억의 컴퓨터 <span className="gp-mode-badge mode-online">WIN98 DESKTOP</span></h2>
                  <p className="gp-muted">바탕 화면에서 [한컴타자연습 97], [한메타자교사 3.0], [피카츄 배구], [지뢰 찾기], [3D 핀볼] 아이콘을 더블클릭해 실행하세요.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href="/win98-web/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gp-btn gp-btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  ↗ 전체 화면 탭으로 열기 (/win98-web/)
                </a>
                <button type="button" className="gp-btn gp-btn-secondary" onClick={() => setActiveTab('arcade')}>
                  ← 미니게임 로비로 (20종)
                </button>
              </div>
            </div>
            <iframe
              src="/win98-web/"
              title="한글 Windows 98 데스크톱"
              style={{ width: '100%', flex: '1 1 auto', border: '2px solid #008080', borderRadius: '8px', background: '#008080' }}
              allow="autoplay; fullscreen"
            />
          </div>
        ) : activeTab === 'events' ? (
          /* 3. Event Groups Tab */
          <EventGroupsView
            api={api}
            currentUser={currentUser}
            activeEventId={activeEventId}
            onSelectActiveEvent={(id) => {
              setActiveEventId(id);
              showToast(id ? '활성 이벤트 그룹이 설정되었습니다.' : '활성 이벤트 그룹이 해제되었습니다.');
            }}
          />
        ) : activeTab === 'rankings' ? (
          /* 4. Rankings & Stats Tab */
          <RankingsAndStatsView api={api} currentUser={currentUser} />
        ) : activeGameMeta ? (
          /* 5. Dedicated Game Waiting Room (Single Mode vs Multi Mode & Join Code) */
          <div className="gp-game-waiting-room">
            <div className="gp-waiting-hero">
              <div className="gp-waiting-hero-left">
                <span className="gp-waiting-game-icon">{activeGameMeta.icon}</span>
                <div>
                  <div className="gp-waiting-tag-row">
                    <span className="gp-waiting-kicker">{activeGameMeta.category?.toUpperCase() || 'ARCADE'}</span>
                    <span className="gp-waiting-players">1~{activeGameMeta.maxPlayers || 8}인 플레이 지원</span>
                  </div>
                  <h2 className="gp-waiting-game-title">{activeGameMeta.name}</h2>
                  <p className="gp-waiting-game-desc">{activeGameMeta.description}</p>
                </div>
              </div>

              <div className="gp-waiting-user-card">
                <span className="gp-waiting-user-label">접속 플레이어</span>
                <strong className="gp-waiting-user-name">👤 {currentUser?.name || '게스트'}</strong>
                <span className="gp-waiting-user-sub">실시간 전적·랭킹 자동 연동</span>
              </div>
            </div>

            <div className="gp-waiting-modes-grid">
              {/* LEFT: 🤖 싱글 모드 (무조건 컴퓨터 AI BOT 대결 / 연습) */}
              <div className="gp-mode-panel gp-mode-single">
                <div className="gp-mode-header">
                  <span className="gp-mode-pill pill-single">SINGLE MODE</span>
                  <h3>🤖 싱글 모드 (컴퓨터와 대결)</h3>
                </div>
                <p className="gp-mode-desc">
                  기다림 없이 즉시 컴퓨터 AI BOT과 1:1 대결을 시작합니다.
                  AI 난이도를 선택하고 플레이를 시작하세요.
                </p>

                <div className="gp-mode-bot-select">
                  <label>AI BOT 난이도 선택:</label>
                  <div className="gp-diff-btn-group">
                    <button
                      type="button"
                      className={`gp-diff-btn ${lobbyBotDiff === 'easy' ? 'active' : ''}`}
                      onClick={() => setLobbyBotDiff('easy')}
                    >
                      쉬움 (Easy)
                    </button>
                    <button
                      type="button"
                      className={`gp-diff-btn ${lobbyBotDiff === 'normal' ? 'active' : ''}`}
                      onClick={() => setLobbyBotDiff('normal')}
                    >
                      보통 (Normal)
                    </button>
                    <button
                      type="button"
                      className={`gp-diff-btn ${lobbyBotDiff === 'hard' ? 'active' : ''}`}
                      onClick={() => setLobbyBotDiff('hard')}
                    >
                      어려움 (Hard)
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="gp-btn gp-btn-primary gp-btn-start-single"
                  onClick={() => handleLaunchSingleVsBot(activeGameMeta, lobbyBotDiff)}
                >
                  ▶ 컴퓨터 AI와 대결 시작 (즉시 플레이)
                </button>
              </div>

              {/* RIGHT: 🌐 멀티 모드 (온라인 대전) */}
              <div className="gp-mode-panel gp-mode-multi">
                <div className="gp-mode-header">
                  <span className="gp-mode-pill pill-multi">MULTI MODE</span>
                  <h3>🌐 멀티 모드 (온라인 대전)</h3>
                </div>
                <p className="gp-mode-desc">
                  온라인 대기실을 만들어 친구를 초대하거나, 6자리 방 코드를 입력해 참가합니다.
                  대기실에서 모든 참가자가 준비되면 방장이 게임을 시작합니다.
                </p>

                <div className="gp-multi-actions-box">
                  {/* Action 1: 새 방 만들기 */}
                  <div className="gp-multi-option">
                    <div className="gp-multi-opt-info">
                      <strong>1. 내가 방장이 되어 시작하기</strong>
                      <span>고유 방 코드가 생성되며, 대기실에서 대기 후 방장이 게임을 시작합니다.</span>
                    </div>
                    <button
                      type="button"
                      className="gp-btn gp-btn-success"
                      onClick={() => handleCreateOnlineRoom(activeGameMeta)}
                    >
                      ➕ 새 온라인 방 만들기
                    </button>
                  </div>

                  <div className="gp-multi-divider">
                    <span>또는</span>
                  </div>

                  {/* Action 2: 코드로 방 입장 */}
                  <div className="gp-multi-option">
                    <div className="gp-multi-opt-info">
                      <strong>2. 방 코드로 대기실 입장하기</strong>
                      <span>공유받은 방 코드를 입력하고 대기실에 참가하세요.</span>
                    </div>
                    <div className="gp-join-bar">
                      <input
                        type="text"
                        className="gp-input gp-input-code"
                        placeholder="방 코드 입력 (예: JVWQ)"
                        maxLength={8}
                        value={joinCodeInput}
                        onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleJoinRoomByCode(joinCodeInput);
                        }}
                      />
                      <button
                        type="button"
                        className="gp-btn gp-btn-secondary"
                        onClick={() => handleJoinRoomByCode(joinCodeInput)}
                      >
                        입장하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 6. Main Arcade Game Catalog (20 Games) */
          <div className="gp-arcade-lobby">
            {/* Quick Online Room Join & Active Rooms Bar */}
            <section className="gp-quick-online-bar">
              <div className="gp-join-code-box">
                <strong>🔑 방 코드로 입장:</strong>
                <input
                  type="text"
                  className="gp-input gp-input-code"
                  placeholder="6자리 코드 (예: AB12CD)"
                  maxLength={8}
                  value={joinCodeInput}
                  onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                />
                <button
                  type="button"
                  className="gp-btn gp-btn-primary gp-btn-sm"
                  onClick={() => handleJoinRoomByCode(joinCodeInput)}
                >
                  입장하기
                </button>
              </div>

              <div className="gp-open-rooms-strip">
                <span className="gp-muted-sm">현재 열린 온라인 대기실 ({publicRooms.length}):</span>
                {publicRooms.length === 0 ? (
                  <span className="gp-muted-sm">대기 중인 방이 없습니다. 원하는 게임 카드에서 [온라인 대전]을 눌러 방을 만들어 보세요!</span>
                ) : (
                  <div className="gp-open-room-pills">
                    {publicRooms.map(r => {
                      const g = getGameById(r.game);
                      return (
                        <button
                          key={r.code}
                          type="button"
                          className="gp-open-room-pill"
                          onClick={() => handleJoinRoomByCode(r.code)}
                        >
                          <span>{g?.icon || '🎮'} {g?.name || r.game}</span>
                          <code>{r.code}</code>
                          <span>({r.players.length}/{g?.maxPlayers || 8}명 · {r.state === 'playing' ? '진행중' : '대기중'})</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Category Filter & Search */}
            <section className="gp-catalog-toolbar">
              <div className="gp-category-tabs">
                {GAME_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`gp-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <input
                type="search"
                className="gp-input gp-search-input"
                placeholder="게임 이름, 장르, 키워드 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </section>

            {/* 20 Games Grid */}
            <section className="gp-games-grid">
              {filteredGames.map(game => (
                <article key={game.id} className="gp-game-card" data-game-id={game.id}>
                  <div className="gp-game-card-header">
                    <span className="gp-game-card-icon">{game.icon}</span>
                    <div className="gp-game-card-titles">
                      <h3>{game.name}</h3>
                      <span className="gp-game-card-sub">{game.subtitle}</span>
                    </div>
                    <span className="gp-players-badge">{game.playersLabel}</span>
                  </div>

                  <p className="gp-game-card-desc">{game.description}</p>

                  <div className="gp-game-card-tags">
                    {game.supportsSolo && <span className="gp-tag gp-tag-solo">혼자 플레이</span>}
                    {game.supportsBot && <span className="gp-tag gp-tag-bot">🤖 AI BOT 지원</span>}
                    {game.supportsOnline && <span className="gp-tag gp-tag-online">🌐 실시간 온라인</span>}
                  </div>

                  <div className="gp-game-card-actions">
                    {isRouletteGame(game.id) ? (
                      <button
                        type="button"
                        className="gp-btn gp-btn-primary gp-btn-block"
                        onClick={handleOpenMarbleRoulette}
                      >
                        🎡 마블 룰렛 추첨기 열기 (사내 명단 연동)
                      </button>
                    ) : game.id === 'bomberman' ? (
                      <>
                        <button
                          type="button"
                          className="gp-btn gp-btn-accent gp-btn-sm"
                          onClick={() => handleOpenOriginalBomberman('bot')}
                        >
                          🤖 싱글 vs 컴퓨터
                        </button>
                        <button
                          type="button"
                          className="gp-btn gp-btn-primary gp-btn-sm"
                          onClick={() => handleOpenOriginalBomberman('online')}
                        >
                          🌐 원본 멀티 (2~4인)
                        </button>
                      </>
                    ) : game.id === 'bombergirl' ? (
                      <>
                        <button
                          type="button"
                          className="gp-btn gp-btn-accent gp-btn-sm"
                          onClick={handleOpenOriginalBombergirl}
                        >
                          🎮 원본 싱글 + AI 3명
                        </button>
                        <button
                          type="button"
                          className="gp-btn gp-btn-primary gp-btn-sm"
                          onClick={() => handleCreateOnlineRoom(game)}
                        >
                          🌐 온라인 2인 방
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="gp-btn gp-btn-secondary gp-btn-sm"
                          onClick={() => handleStartSoloPractice(game)}
                        >
                          혼자 연습
                        </button>
                        <button
                          type="button"
                          className="gp-btn gp-btn-accent gp-btn-sm"
                          onClick={() => handleOpenBotModal(game)}
                        >
                          🤖 BOT 대결
                        </button>
                        <button
                          type="button"
                          className="gp-btn gp-btn-primary gp-btn-sm"
                          onClick={() => handleCreateOnlineRoom(game)}
                        >
                          🌐 온라인 방
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}
      </main>

      {/* Quick BOT Configuration Modal */}
      {botModalGame && (
        <div className="gp-modal-backdrop" onClick={() => setBotModalGame(null)}>
          <div className="gp-modal" onClick={e => e.stopPropagation()}>
            <div className="gp-modal-header">
              <h3>{botModalGame.icon} {botModalGame.name} — 컴퓨터(BOT)와 대결</h3>
              <button type="button" className="gp-close-btn" onClick={() => setBotModalGame(null)}>✕</button>
            </div>
            <div className="gp-modal-body">
              <p className="gp-muted">
                다른 임직원이 접속하지 않아도 즉시 AI BOT과 대결을 시작합니다.
                (최대 정원: {botModalGame.maxPlayers}명)
              </p>

              <div className="gp-form-row">
                <label>함께 플레이할 BOT 수</label>
                <div className="gp-option-buttons">
                  {[1, 3, 7].map(cnt => {
                    const maxAllowed = Math.max(1, (botModalGame.maxPlayers || 2) - 1);
                    const effective = Math.min(cnt, maxAllowed);
                    const disabled = cnt > maxAllowed && cnt !== 1;
                    return (
                      <button
                        key={cnt}
                        type="button"
                        disabled={disabled}
                        className={`gp-btn ${botCountOption === effective && !disabled ? 'gp-btn-primary' : 'gp-btn-secondary'}`}
                        onClick={() => setBotCountOption(effective)}
                      >
                        🤖 BOT {cnt}명 {disabled ? `(최대 ${maxAllowed}명)` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="gp-form-row">
                <label>BOT 인공지능 난이도</label>
                <div className="gp-option-buttons">
                  {[
                    { id: 'easy', label: '🌱 쉬움 (Easy)', desc: '느린 반응과 입문자용 실수 포함' },
                    { id: 'normal', label: '⚡ 보통 (Normal)', desc: '자연스러운 일반 플레이어 수준' },
                    { id: 'hard', label: '🔥 어려움 (Hard)', desc: '빠른 판단과 최적 전략 (Minimax/탐색)' },
                  ].map(lv => (
                    <button
                      key={lv.id}
                      type="button"
                      className={`gp-btn gp-btn-block ${botDiffOption === lv.id ? 'gp-btn-accent' : 'gp-btn-secondary'}`}
                      onClick={() => setBotDiffOption(lv.id)}
                    >
                      <strong>{lv.label}</strong> — <small>{lv.desc}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="gp-modal-footer">
                <button type="button" className="gp-btn gp-btn-secondary" onClick={() => setBotModalGame(null)}>
                  취소
                </button>
                <button type="button" className="gp-btn gp-btn-primary" onClick={handleLaunchBotMatch}>
                  🚀 즉시 BOT 대결 시작
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
