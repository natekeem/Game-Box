import { emitGameRuntimeEvent } from '../GameEventBridge.js';

/**
 * Hanme Typing Teacher 3.0 Event Adapter
 * Tracks session lifecycle and active typing metrics for HTT.EXE inside js-dos.
 * Never merges with Hancom 97 rankings.
 */
export function createHanme30EventAdapter() {
  const sessionId = `hanme30-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = Date.now();
  let completedCount = 0;

  function emitStart(gameMode = 'venezia') {
    emitGameRuntimeEvent({
      gameId: 'hanme-typing-30',
      gameSessionId: sessionId,
      clientEventId: `${sessionId}-start`,
      gameMode,
      eventType: 'game:start',
      timestamp: new Date().toISOString(),
      durationMs: 0,
      trustLevel: 'dos-session-telemetry',
      metadata: { engine: 'js-dos-8.5.3', executable: 'HTT.EXE' },
    });
  }

  function emitComplete({ gameMode = 'venezia', score = null, typingSpeed = null, accuracy = null, errorCount = null, durationMs = 0, metadata = {} }) {
    completedCount += 1;
    emitGameRuntimeEvent({
      gameId: 'hanme-typing-30',
      gameSessionId: sessionId,
      clientEventId: `${sessionId}-complete-${completedCount}`,
      gameMode,
      eventType: 'game:complete',
      timestamp: new Date().toISOString(),
      score,
      typingSpeed,
      accuracy,
      errorCount,
      durationMs: durationMs || Math.max(1000, Date.now() - startedAt),
      outcome: 'completed',
      recordClassification: 'ranking',
      trustLevel: 'dos-session-telemetry',
      metadata,
    });
  }

  function emitAbortIfIncomplete() {
    if (completedCount === 0) {
      emitGameRuntimeEvent({
        gameId: 'hanme-typing-30',
        gameSessionId: sessionId,
        clientEventId: `${sessionId}-abort`,
        gameMode: 'venezia',
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
    emitAbortIfIncomplete,
  };
}
