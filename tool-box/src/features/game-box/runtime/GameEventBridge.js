import { recordSessionEventApi, submitGameResultApi, flushPendingResultsApi } from '../ranking/rankingApi.js';
import { loadGuestIdentity } from '../identity/guestIdentity.js';

export const ALLOWED_GAME_EVENT_TYPES = new Set([
  'game:start',
  'game:progress',
  'game:complete',
  'game:abort',
]);

export const GAME_EVENT_MESSAGE_SOURCE = 'game-box-runtime';

/**
 * Normalize and validate a raw game event payload against the common GAME-BOX Event Contract.
 */
export function normalizeGameEvent(raw = {}, fallbackIdentity = null) {
  const identity = fallbackIdentity || loadGuestIdentity();
  const eventType = String(raw.eventType || raw.type || '').trim();
  if (!ALLOWED_GAME_EVENT_TYPES.has(eventType)) {
    return null;
  }

  const gameId = String(raw.gameId || '').trim();
  if (!gameId) return null;

  const gameMode = String(raw.gameMode || 'general').trim();
  const gameSessionId = String(raw.gameSessionId || raw.sessionId || `sess-${Date.now()}`).trim();
  const clientEventId = String(
    raw.clientEventId ||
    `${gameSessionId}-${eventType}-${raw.timestamp || Date.now()}`
  ).trim();

  return {
    playerId: raw.playerId || identity.guestId,
    guestId: raw.guestId || identity.guestId,
    nickname: raw.nickname || identity.nickname || '게스트',
    gameId,
    gameSessionId,
    clientEventId,
    gameMode,
    eventType,
    timestamp: raw.timestamp || new Date().toISOString(),
    score: raw.score !== undefined && raw.score !== null ? Number(raw.score) : null,
    accuracy: raw.accuracy !== undefined && raw.accuracy !== null ? Number(raw.accuracy) : null,
    typingSpeed: raw.typingSpeed !== undefined && raw.typingSpeed !== null ? Number(raw.typingSpeed) : null,
    errorCount: raw.errorCount !== undefined && raw.errorCount !== null ? Number(raw.errorCount) : null,
    durationMs: Math.max(0, Math.round(Number(raw.durationMs) || 0)),
    outcome: raw.outcome || raw.winLoseDraw || (eventType === 'game:abort' ? 'aborted' : 'completed'),
    opponentType: raw.opponentType || 'none',
    recordClassification: raw.recordClassification || (eventType === 'game:abort' ? 'practice' : 'ranking'),
    trustLevel: raw.trustLevel || 'client-guest-telemetry',
    metadata: raw.metadata && typeof raw.metadata === 'object' ? raw.metadata : {},
  };
}

/**
 * GameEventBridge:
 * Listens for postMessage events from same-origin game iframes,
 * deduplicates by clientEventId, persists to backend API, and notifies listeners.
 */
export class GameEventBridge {
  constructor({ getIdentity = loadGuestIdentity, onEventProcessed = null } = {}) {
    this.getIdentity = getIdentity;
    this.onEventProcessed = onEventProcessed;
    this.processedEventIds = new Set();
    this._boundOnMessage = this._handleWindowMessage.bind(this);
    this._boundOnCustom = this._handleCustomEvent.bind(this);
    this.active = false;
  }

  start() {
    if (this.active || typeof window === 'undefined') return;
    this.active = true;
    window.addEventListener('message', this._boundOnMessage);
    window.addEventListener('game-box:runtime-event', this._boundOnCustom);
    flushPendingResultsApi().catch(() => {});
  }

  stop() {
    if (!this.active || typeof window === 'undefined') return;
    this.active = false;
    window.removeEventListener('message', this._boundOnMessage);
    window.removeEventListener('game-box:runtime-event', this._boundOnCustom);
  }

  async _handleWindowMessage(event) {
    // 1. Verify same origin
    if (typeof window !== 'undefined' && event.origin !== window.location.origin) {
      return;
    }
    // 2. Verify message source and allowed type
    const data = event.data;
    if (!data || typeof data !== 'object' || data.source !== GAME_EVENT_MESSAGE_SOURCE) {
      return;
    }
    const payload = data.payload || data;
    await this.processEvent(payload);
  }

  async _handleCustomEvent(event) {
    if (!event?.detail) return;
    await this.processEvent(event.detail);
  }

  async processEvent(rawPayload) {
    const identity = this.getIdentity ? this.getIdentity() : loadGuestIdentity();
    const normalized = normalizeGameEvent(rawPayload, identity);
    if (!normalized) return null;

    // 3. Idempotency check in memory
    if (
      (normalized.eventType === 'game:complete' || normalized.eventType === 'game:abort') &&
      this.processedEventIds.has(normalized.clientEventId)
    ) {
      return { duplicated: true, event: normalized };
    }

    if (normalized.eventType === 'game:complete' || normalized.eventType === 'game:abort') {
      this.processedEventIds.add(normalized.clientEventId);
    }

    let apiOutcome = null;
    try {
      if (normalized.eventType === 'game:start' || normalized.eventType === 'game:progress') {
        apiOutcome = await recordSessionEventApi(normalized);
      } else if (normalized.eventType === 'game:complete') {
        apiOutcome = await submitGameResultApi(normalized);
      } else if (normalized.eventType === 'game:abort') {
        await recordSessionEventApi(normalized).catch(() => {});
        if (normalized.score !== null || normalized.typingSpeed !== null) {
          apiOutcome = await submitGameResultApi({
            ...normalized,
            recordClassification: 'practice',
            outcome: 'aborted',
          });
        }
      }
    } catch (err) {
      apiOutcome = {
        savedToServer: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    if (typeof this.onEventProcessed === 'function') {
      this.onEventProcessed({ event: normalized, apiOutcome });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('game-box:ranking-updated', {
          detail: { event: normalized, apiOutcome },
        })
      );
    }

    return { duplicated: false, event: normalized, apiOutcome };
  }
}

/**
 * Helper used inside game iframes to emit a standard event to parent and current window.
 */
export function emitGameRuntimeEvent(payload) {
  if (typeof window === 'undefined') return;
  const message = {
    source: GAME_EVENT_MESSAGE_SOURCE,
    type: payload.eventType,
    payload,
  };
  window.dispatchEvent(new CustomEvent('game-box:runtime-event', { detail: payload }));
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, window.location.origin);
    }
    if (window.top && window.top !== window && window.top !== window.parent) {
      window.top.postMessage(message, window.location.origin);
    }
  } catch (err) {
    console.warn('[GameEventBridge] postMessage failed:', err);
  }
}
