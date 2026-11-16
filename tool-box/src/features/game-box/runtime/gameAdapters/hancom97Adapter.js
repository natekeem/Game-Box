import { emitGameRuntimeEvent } from '../GameEventBridge.js';

/**
 * Hancom Typing 97 Event Adapter
 * Connects original-player-src / hancom97-telemetry.js and record-bridge.js events
 * to the standard GAME-BOX event contract (game:start, game:progress, game:complete, game:abort).
 */
export function createHancom97EventAdapter() {
  const sessionId = `hancom97-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = Date.now();
  let completedCount = 0;

  function emitStart(gameMode = 'position') {
    emitGameRuntimeEvent({
      gameId: 'hancom-typing-97',
      gameSessionId: sessionId,
      clientEventId: `${sessionId}-start`,
      gameMode,
      eventType: 'game:start',
      timestamp: new Date().toISOString(),
      durationMs: 0,
      trustLevel: 'original-screen-telemetry',
      metadata: { engine: 'js-dos-8.5.3', executable: '_HTTD_.EXE' },
    });
  }

  function emitCompleteFromTelemetry(attempt) {
    completedCount += 1;
    const modeMap = {
      'typing-position': 'position',
      'typing-word': 'word',
      'typing-short': 'short',
      'typing-long': 'long',
      'game-rain': 'acid-rain',
      'game-invader': 'invader',
    };
    const gameMode = modeMap[attempt.category] || attempt.gameMode || 'position';

    emitGameRuntimeEvent({
      gameId: 'hancom-typing-97',
      gameSessionId: sessionId,
      clientEventId: attempt.clientAttemptId || `${sessionId}-complete-${completedCount}`,
      gameMode,
      eventType: 'game:complete',
      timestamp: attempt.occurredAt || new Date().toISOString(),
      typingSpeed: attempt.speed ?? attempt.typingSpeed ?? null,
      score: attempt.score ?? null,
      accuracy: attempt.accuracy ?? null,
      errorCount: attempt.errorCount ?? null,
      durationMs: attempt.elapsedMs || Math.max(1000, Date.now() - startedAt),
      outcome: 'completed',
      recordClassification: 'ranking',
      trustLevel: attempt.source || 'original-screen-telemetry',
      metadata: attempt.metadata || {},
    });
  }

  function emitSnapshotProgress(snapshot) {
    emitGameRuntimeEvent({
      gameId: 'hancom-typing-97',
      gameSessionId: sessionId,
      clientEventId: `${sessionId}-snapshot-${snapshot?.capturedAt || Date.now()}`,
      gameMode: 'position',
      eventType: 'game:progress',
      timestamp: snapshot?.capturedAt || new Date().toISOString(),
      durationMs: Math.max(0, Date.now() - startedAt),
      trustLevel: 'dos-binary-snapshot',
      metadata: {
        files: Array.isArray(snapshot?.files) ? snapshot.files.map(f => ({ path: f.path, byteLength: f.byteLength })) : [],
      },
    });
  }

  function emitAbortIfIncomplete() {
    if (completedCount === 0) {
      emitGameRuntimeEvent({
        gameId: 'hancom-typing-97',
        gameSessionId: sessionId,
        clientEventId: `${sessionId}-abort`,
        gameMode: 'position',
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
    emitCompleteFromTelemetry,
    emitSnapshotProgress,
    emitAbortIfIncomplete,
  };
}
