import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PLATFORM_GAMES, GAME_CATEGORIES, getGameById } from './registry.js';
import { PlatformApiClient } from './api-client.js';
import { MarbleRouletteView } from './components/MarbleRouletteView.jsx';
import { GamePlayStage } from './components/GamePlayStage.jsx';
import { OriginalBombermanArena, OriginalBombergirlArena } from './components/OriginalArcadeArenas.jsx';
import { EventGroupsView } from './components/EventGroupsView.jsx';
import { RankingsAndStatsView } from './components/RankingsAndStatsView.jsx';
import { GameLobby, RoomWaiting, GuideModal, getLobbyConfig } from './components/GameLobby.jsx';

const QUICK_MATCH_COUNTDOWN_SECONDS = 4;

export function GamePlatformApp({ userProvider, apiBaseUrl = '/api/platform' }) {
  const [currentUser, setCurrentUser] = useState(() => userProvider.getCurrentUser());
  const [activeTab, setActiveTab] = useState('arcade'); // arcade | events | rankings | win98
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEventId, setActiveEventId] = useState(null);
  const [activeEventsList, setActiveEventsList] = useState([]);

  // Active game / room state
  const [activeGameId, setActiveGameId] = useState(null);
  const [originalLaunch, setOriginalLaunch] = useState(null); // { gameId, mode, bots }
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [publicGameState, setPublicGameState] = useState(null);
  const [privateRoleState, setPrivateRoleState] = useState(null);
  const [drawingStrokes, setDrawingStrokes] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  const [publicRooms, setPublicRooms] = useState([]);
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [initialJoinCode, setInitialJoinCode] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [roomBotDiff, setRoomBotDiff] = useState('normal');
  const [countdown, setCountdown] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

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

  // URL: ?game=ID (대기실 바로 열기) · ?mode=single (기본 옵션으로 즉시 시작) · ?room=CODE (참여 코드 미리 입력)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlMockUser = params.get('mockUser');
    if (urlMockUser && userProvider.allowMockUserSwitch) {
      userProvider.switchMockUser(urlMockUser);
    }
    const urlRoom = params.get('room');
    if (urlRoom) {
      setInitialJoinCode(urlRoom.toUpperCase());
    }
    const urlGame = params.get('game');
    if (urlGame) {
      const targetGame = getGameById(urlGame);
      if (targetGame) {
        setActiveGameId(targetGame.id);
        if (params.get('mode') === 'single') {
          const cfg = getLobbyConfig(targetGame);
          setTimeout(() => {
            if (cfg?.kind === 'draw') setRouletteOpen(true);
            else handleStartSingle(targetGame, { botCount: cfg?.bots?.def || 1, difficulty: 'normal' });
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

  // ─── Derived ────────────────────────────────────────────────────────────────
  const activeGameMeta = getGameById(currentRoom?.game || originalLaunch?.gameId || activeGameId);
  const roomHostId = currentRoom?.hostId || currentRoom?.host || null;
  const isRoomHost = !!currentRoom && roomHostId === currentUser?.id;
  const lobbyGameMeta = getGameById(activeGameId);
  const quickWaitingCount = useMemo(
    () => publicRooms.filter(r => r.game === activeGameId && r.matchType === 'quick' && r.state === 'lobby').length,
    [publicRooms, activeGameId],
  );

  const isDeckEmbed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('embed') === 'deck' || window.self !== window.top;
  }, []);

  // ─── Room helpers ───────────────────────────────────────────────────────────
  const resetPlayState = () => {
    setMatchResult(null);
    setPublicGameState(null);
    setPrivateRoleState(null);
    setDrawingStrokes([]);
  };

  const enterRoom = (room, { started = false } = {}) => {
    setCurrentRoom(room);
    setActiveGameId(room.game);
    if (!started) resetPlayState();
    if (room.lastPublicGameState) setPublicGameState(room.lastPublicGameState);
  };

  const startRoomNow = useCallback(async (code) => {
    try {
      const res = await api.startRoom(code);
      setCurrentRoom(res.room);
      if (res.room?.lastPublicGameState) setPublicGameState(res.room.lastPublicGameState);
    } catch (err) {
      showToast(err.message);
    }
  }, [api, showToast]);

  // 즉시 매칭 방: 2명 이상 모이면 카운트다운 후 방장이 자동 시작
  const humanCount = currentRoom ? currentRoom.players.filter(p => !p.isBot).length : 0;
  useEffect(() => {
    if (!currentRoom || currentRoom.state !== 'lobby' || currentRoom.matchType !== 'quick' || humanCount < 2) {
      setCountdown(null);
      return undefined;
    }
    let remaining = QUICK_MATCH_COUNTDOWN_SECONDS;
    setCountdown(remaining);
    const timer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(timer);
        setCountdown(0);
        if (isRoomHost) startRoomNow(currentRoom.code);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentRoom?.code, currentRoom?.state, currentRoom?.matchType, humanCount, isRoomHost, startRoomNow]);

  // ─── Game launchers ─────────────────────────────────────────────────────────
  const openGame = (gameId) => {
    launchRequestRef.current += 1;
    setActiveGameId(gameId);
    setOriginalLaunch(null);
    setRouletteOpen(false);
    setCurrentRoom(null);
    resetPlayState();
  };

  const handleStartSingle = async (game, { botCount = 1, difficulty = 'normal' } = {}) => {
    if (game.id === 'bomberman') {
      setOriginalLaunch({ gameId: 'bomberman', mode: 'bot', bots: botCount });
      return;
    }
    if (game.id === 'bombergirl') {
      setOriginalLaunch({ gameId: 'bombergirl', mode: 'single', bots: botCount });
      return;
    }
    const requestId = ++launchRequestRef.current;
    setBusy(true);
    try {
      const maxBots = Math.max(1, (game.maxPlayers || 2) - 1);
      const res = await api.createRoom({
        gameId: game.id,
        mode: 'bot',
        botCount: Math.min(maxBots, botCount),
        botDifficulty: difficulty,
        eventId: activeEventId,
      });
      if (requestId !== launchRequestRef.current) return;
      enterRoom(res.room);
      const started = await api.startRoom(res.room.code);
      if (requestId !== launchRequestRef.current) return;
      setCurrentRoom(started.room);
      if (started.room?.lastPublicGameState) setPublicGameState(started.room.lastPublicGameState);
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleQuickMatch = async (game) => {
    const requestId = ++launchRequestRef.current;
    setBusy(true);
    try {
      const { rooms = [] } = await api.listRooms(game.id, 'quick');
      const cfg = getLobbyConfig(game);
      const open = rooms.find(r =>
        r.state === 'lobby'
        && r.players.length < (cfg?.multiMax || game.maxPlayers || 2)
        && !r.players.some(p => p.id === currentUser?.id));
      let res;
      if (open) {
        res = await api.joinRoom(open.code);
      } else {
        res = await api.createRoom({
          gameId: game.id,
          mode: 'online',
          matchType: 'quick',
          botCount: 0,
          botDifficulty: 'normal',
          eventId: activeEventId,
        });
      }
      if (requestId !== launchRequestRef.current) return;
      enterRoom(res.room);
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleCreateCodeRoom = async (game) => {
    const requestId = ++launchRequestRef.current;
    setBusy(true);
    try {
      const res = await api.createRoom({
        gameId: game.id,
        mode: 'online',
        matchType: 'code',
        botCount: 0,
        botDifficulty: 'normal',
        eventId: activeEventId,
      });
      if (requestId !== launchRequestRef.current) return;
      enterRoom(res.room);
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleJoinByCode = async (game, rawCode) => {
    const clean = String(rawCode || '').trim().toUpperCase();
    if (!clean) {
      showToast('참여 코드를 입력하세요.');
      return;
    }
    const requestId = ++launchRequestRef.current;
    setBusy(true);
    try {
      const res = await api.joinRoom(clean);
      if (requestId !== launchRequestRef.current) return;
      if (game && res.room.game !== game.id) {
        await api.leaveRoom(clean).catch(() => {});
        const other = getGameById(res.room.game);
        showToast(`이 코드는 ${other?.name || res.room.game} 방입니다. 해당 게임 대기실에서 입장해 주세요.`);
        return;
      }
      enterRoom(res.room, { started: true });
      setMatchResult(res.room.lastResult || null);
      setInitialJoinCode('');
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusy(false);
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
    // activeGameId 유지 → 해당 게임 대기실로 복귀
    resetPlayState();
    refreshLobbyData();
  };

  const handleBackToLobby = () => {
    setOriginalLaunch(null);
    setRouletteOpen(false);
  };

  const goCatalog = async () => {
    await handleLeaveCurrentRoom();
    setOriginalLaunch(null);
    setRouletteOpen(false);
    setActiveGameId(null);
    setActiveTab('arcade');
  };

  const handleCopyInviteLink = () => {
    if (!currentRoom?.code || typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}?game=${currentRoom.game}&room=${currentRoom.code}`;
    navigator.clipboard?.writeText(url);
    showToast(`초대 링크가 복사되었습니다. (참여 코드: ${currentRoom.code})`);
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

  const modeLabel = (room) => (room.mode === 'bot' ? '🤖 컴퓨터 대결' : '🌐 온라인 대전');

  // ─── Render ─────────────────────────────────────────────────────────────────
  const renderOriginalGame = () => {
    const meta = getGameById(originalLaunch.gameId);
    return (
      <div className="gp-room-container gp-original-game-container">
        <div className="gp-room-topbar">
          <div className="gp-room-title-group">
            <span className="gp-game-icon-lg">{meta?.icon}</span>
            <div>
              <h2>
                {meta?.name}
                <span className="gp-mode-badge mode-bot">🤖 컴퓨터 대결 · {originalLaunch.bots}명</span>
              </h2>
            </div>
          </div>
          <div className="gp-btn-row">
            <button type="button" className="gl-btn gl-btn-ghost gl-btn-sm" onClick={() => setShowGuide(true)}>📖 조작법</button>
            <button type="button" className="gl-btn gl-btn-ghost gl-btn-sm" onClick={handleBackToLobby}>← 대기실</button>
          </div>
        </div>
        {originalLaunch.gameId === 'bomberman' ? (
          <OriginalBombermanArena mode={originalLaunch.mode} bots={originalLaunch.bots} currentUser={currentUser} />
        ) : (
          <OriginalBombergirlArena mode="single" bots={originalLaunch.bots} currentUser={currentUser} onBackToLobby={handleBackToLobby} />
        )}
      </div>
    );
  };

  const renderRoom = () => {
    if (currentRoom.state === 'lobby') {
      return (
        <RoomWaiting
          game={activeGameMeta}
          room={currentRoom}
          me={currentUser}
          isHost={isRoomHost}
          countdown={countdown}
          botDifficulty={roomBotDiff}
          onBotDifficulty={setRoomBotDiff}
          onAddBot={async () => {
            try {
              const res = await api.addBot(currentRoom.code, roomBotDiff);
              setCurrentRoom(res.room);
            } catch (err) {
              showToast(err.message);
            }
          }}
          onRemoveBot={async (botId) => {
            try {
              const res = await api.removeBot(currentRoom.code, botId);
              setCurrentRoom(res.room);
            } catch (err) {
              showToast(err.message);
            }
          }}
          onStart={() => startRoomNow(currentRoom.code)}
          onCopyLink={handleCopyInviteLink}
          onLeave={handleLeaveCurrentRoom}
        />
      );
    }

    return (
      <div className="gp-room-container">
        <div className="gp-room-topbar">
          <div className="gp-room-title-group">
            <span className="gp-game-icon-lg">{activeGameMeta?.icon || '🎮'}</span>
            <div>
              <h2>
                {activeGameMeta?.name || currentRoom.game}
                {currentRoom.mode === 'online' && <span className="gp-room-code-badge">코드 {currentRoom.code}</span>}
                <span className={`gp-mode-badge mode-${currentRoom.mode}`}>{modeLabel(currentRoom)}</span>
              </h2>
            </div>
          </div>
          <div className="gp-btn-row">
            <button type="button" className="gl-btn gl-btn-ghost gl-btn-sm" onClick={() => setShowGuide(true)}>📖 조작법</button>
            <button type="button" className="gl-btn gl-btn-ghost gl-btn-sm" onClick={handleLeaveCurrentRoom}>← 대기실</button>
          </div>
        </div>

        <div className="gp-active-match-area">
          {matchResult && (
            <div className="gp-match-result-banner">
              <div className="gp-match-result-header">
                <h3>
                  🏁 게임 종료{' '}
                  {matchResult.winner ? `· 🏆 ${matchResult.winner}` : '· 무승부'}
                </h3>
                <span className={`gp-official-pill ${matchResult.isOfficial ? 'official' : 'practice'}`}>
                  {matchResult.isOfficial ? '✓ 공식 랭킹 반영' : '연습 경기 (랭킹 제외)'}
                </span>
              </div>

              {matchResult.standings && matchResult.standings.length > 0 && (
                <div className="gp-podium-list">
                  {matchResult.standings.map(st => (
                    <div key={st.id} className={`gp-podium-item rank-${st.rank}`}>
                      <span className="gp-podium-rank">#{st.rank}</span>
                      <strong>{st.name}</strong>
                      <span className="gp-muted-sm">{st.isBot ? '컴퓨터' : '플레이어'}</span>
                      <span className="gp-podium-score">{st.score}점</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="gp-btn-row">
                <button
                  type="button"
                  className="gl-btn gl-btn-primary"
                  onClick={async () => {
                    try {
                      const res = await api.rematch(currentRoom.code);
                      setCurrentRoom(res.room);
                      setMatchResult(null);
                      if (currentRoom.mode !== 'online') {
                        const started = await api.startRoom(currentRoom.code);
                        setCurrentRoom(started.room);
                        if (started.room?.lastPublicGameState) setPublicGameState(started.room.lastPublicGameState);
                      }
                    } catch (err) {
                      showToast(err.message);
                    }
                  }}
                >
                  🔄 다시 하기
                </button>
                <button type="button" className="gl-btn gl-btn-secondary" onClick={handleLeaveCurrentRoom}>
                  대기실로
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
      </div>
    );
  };

  const renderCatalog = () => (
    <div className="gp-arcade-lobby">
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

      <section className="gp-games-grid">
        {filteredGames.map(game => (
          <article
            key={game.id}
            className="gp-game-card"
            data-game-id={game.id}
            role="button"
            tabIndex={0}
            onClick={() => openGame(game.id)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGame(game.id); } }}
          >
            <div className="gp-game-card-header">
              <span className="gp-game-card-icon">{game.icon}</span>
              <div className="gp-game-card-titles">
                <h3>{game.name}</h3>
                <span className="gp-game-card-sub">{game.subtitle}</span>
              </div>
              <span className="gp-players-badge">{game.playersLabel}</span>
            </div>
            <p className="gp-game-card-desc">{game.description}</p>
            <div className="gp-game-card-actions">
              <span className="gp-btn gp-btn-primary gp-btn-block">입장하기 →</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );

  const renderMain = () => {
    if (originalLaunch) return renderOriginalGame();
    if (currentRoom) return renderRoom();

    if (activeTab === 'win98') {
      return (
        <div className="gp-room-container gp-original-game-container" style={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
          <div className="gp-room-topbar">
            <div className="gp-room-title-group">
              <span className="gp-game-icon-lg">🪟</span>
              <h2>한글 Windows 98 <span className="gp-mode-badge mode-online">RETRO</span></h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="/win98-web/" target="_blank" rel="noopener noreferrer" className="gl-btn gl-btn-primary gl-btn-sm" style={{ textDecoration: 'none' }}>
                ↗ 새 탭으로 열기
              </a>
              <button type="button" className="gl-btn gl-btn-ghost gl-btn-sm" onClick={() => setActiveTab('arcade')}>
                ← 게임 목록
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
      );
    }
    if (activeTab === 'events') {
      return (
        <EventGroupsView
          api={api}
          currentUser={currentUser}
          activeEventId={activeEventId}
          onSelectActiveEvent={(id) => {
            setActiveEventId(id);
            showToast(id ? '활성 이벤트 그룹이 설정되었습니다.' : '활성 이벤트 그룹이 해제되었습니다.');
          }}
        />
      );
    }
    if (activeTab === 'rankings') {
      return <RankingsAndStatsView api={api} currentUser={currentUser} />;
    }

    if (lobbyGameMeta && lobbyGameMeta.id === 'roulette' && rouletteOpen) {
      return (
        <MarbleRouletteView
          api={api}
          currentUser={currentUser}
          users={directoryUsers}
          departments={departments}
          activeEventId={activeEventId}
          onBack={handleBackToLobby}
        />
      );
    }

    if (lobbyGameMeta) {
      return (
        <GameLobby
          game={lobbyGameMeta}
          userName={currentUser?.name}
          quickWaiting={quickWaitingCount}
          initialCode={initialJoinCode}
          busy={busy}
          onBack={isDeckEmbed ? null : goCatalog}
          onStartSingle={(opts) => handleStartSingle(lobbyGameMeta, opts)}
          onQuickMatch={() => handleQuickMatch(lobbyGameMeta)}
          onCreateRoom={() => handleCreateCodeRoom(lobbyGameMeta)}
          onJoinCode={(code) => handleJoinByCode(lobbyGameMeta, code)}
          onStartDraw={() => setRouletteOpen(true)}
        />
      );
    }

    return renderCatalog();
  };

  return (
    <div className={`gp-root ${isDeckEmbed ? 'gp-deck-embed' : ''}`}>
      {/* 상단 포털 바 (GAME DECK 임베드 시 숨김: 헤더 이중화 방지) */}
      {!isDeckEmbed && (
        <header className="gp-topbar">
          <div className="gp-topbar-brand" onClick={goCatalog} style={{ cursor: 'pointer' }}>
            <span className="gp-brand-logo">🎯</span>
            <div>
              <h1 className="gp-brand-title">GAME-BOX 미니게임 플랫폼</h1>
              <span className="gp-brand-sub">게임을 고르면 대기실에서 싱글 · 멀티를 선택합니다</span>
            </div>
          </div>

          <nav className="gp-topbar-nav">
            <button
              type="button"
              className={`gp-nav-btn ${activeTab === 'arcade' && !activeGameId ? 'active' : ''}`}
              onClick={goCatalog}
            >
              🎮 게임 목록
            </button>
            <button
              type="button"
              className={`gp-nav-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => { handleLeaveCurrentRoom(); setOriginalLaunch(null); setActiveTab('events'); }}
            >
              🏆 이벤트 / 대회
            </button>
            <button
              type="button"
              className={`gp-nav-btn ${activeTab === 'rankings' ? 'active' : ''}`}
              onClick={() => { handleLeaveCurrentRoom(); setOriginalLaunch(null); setActiveTab('rankings'); }}
            >
              📊 랭킹 / 전적
            </button>
            <button
              type="button"
              className={`gp-nav-btn ${activeTab === 'win98' ? 'active' : ''}`}
              onClick={() => { handleLeaveCurrentRoom(); setOriginalLaunch(null); setActiveTab('win98'); }}
            >
              🪟 레트로 데스크톱
            </button>
          </nav>

          <div className="gp-topbar-user">
            <div className="gp-active-event-picker">
              <label title="선택 시 공식 온라인 경기 결과가 해당 이벤트 그룹 점수로도 집계됩니다.">🏆 이벤트:</label>
              <select
                className="gp-select gp-select-sm"
                value={activeEventId || ''}
                onChange={e => setActiveEventId(e.target.value || null)}
              >
                <option value="">일반 공식전</option>
                {activeEventsList.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>

            <div className="gp-user-card" title={`고유ID: ${currentUser?.id}`}>
              <span className="gp-user-dept">{currentUser?.departmentName}</span>
              <strong className="gp-user-name">{currentUser?.name}</strong>
            </div>

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

      <main className="gp-main">{renderMain()}</main>

      {showGuide && activeGameMeta && (
        <GuideModal game={activeGameMeta} onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
}
