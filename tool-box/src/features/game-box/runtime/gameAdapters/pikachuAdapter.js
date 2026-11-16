import { emitGameRuntimeEvent } from '../GameEventBridge.js';

/**
 * Pikachu Volleyball Event Adapter
 * Connects vs-computer (AI match) and vs-local-2p matches to the GAME-BOX Event Contract.
 * Separates official AI match rankings ('ranking') from local 2P or unilateral P2P claims ('practice').
 */
export function createPikachuEventAdapter() {
  const sessionId = `pikachu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = Date.now();
  let completed = false;

  function emitStart(gameMode = 'vs-computer', opponentType = 'ai') {
    emitGameRuntimeEvent({
      gameId: 'pikachu-volleyball',
      gameSessionId: sessionId,
      clientEventId: `${sessionId}-start`,
      gameMode,
      eventType: 'game:start',
      timestamp: new Date().toISOString(),
      durationMs: 0,
      opponentType,
      metadata: { engine: 'pixi-pikavolley-1997' },
    });
  }

  function emitComplete({
    gameMode = 'vs-computer',
    score,
    playerScore,
    opponentScore,
    isWinner,
    durationMs,
    opponentType = 'ai',
  }) {
    completed = true;
    emitGameRuntimeEvent({
      gameId: 'pikachu-volleyball',
      gameSessionId: sessionId,
      clientEventId: `${sessionId}-complete-${Date.now()}`,
      gameMode,
      eventType: 'game:complete',
      timestamp: new Date().toISOString(),
      score,
      durationMs: durationMs || Math.max(1000, Date.now() - startedAt),
      outcome: isWinner ? 'win' : 'lose',
      opponentType,
      recordClassification: gameMode === 'vs-computer' ? 'ranking' : 'practice',
      trustLevel: 'client-guest-telemetry',
      metadata: {
        playerScore,
        opponentScore,
      },
    });
  }

  function emitAbort(gameMode = 'vs-computer') {
    if (!completed) {
      emitGameRuntimeEvent({
        gameId: 'pikachu-volleyball',
        gameSessionId: sessionId,
        clientEventId: `${sessionId}-abort`,
        gameMode,
        eventType: 'game:abort',
        timestamp: new Date().toISOString(),
        durationMs: Math.max(0, Date.now() - startedAt),
        outcome: 'aborted',
        recordClassification: 'practice',
      });
    }
  }

  return {
    sessionId,
    emitStart,
    emitComplete,
    emitAbort,
  };
}
