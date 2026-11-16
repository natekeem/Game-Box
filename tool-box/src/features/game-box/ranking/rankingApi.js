const API_BASE = '/api/game-box';
const FAILED_RESULTS_QUEUE_KEY = 'gameBox_pending_results_v1';

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `요청 처리 중 오류가 발생했습니다 (HTTP ${response.status})`);
  }
  return data;
}

export async function registerOrSyncPlayerApi({ playerId, guestId, nickname, identityType = 'guest' }) {
  return requestJson(`${API_BASE}/players`, {
    method: 'POST',
    body: JSON.stringify({
      playerId: playerId || guestId,
      guestId: guestId || playerId,
      nickname,
      identityType,
    }),
  });
}

export async function updatePlayerNicknameApi(playerId, nickname) {
  return requestJson(`${API_BASE}/players/${encodeURIComponent(playerId)}/nickname`, {
    method: 'PUT',
    body: JSON.stringify({ nickname }),
  });
}

export async function recordSessionEventApi(eventPayload) {
  return requestJson(`${API_BASE}/sessions`, {
    method: 'POST',
    body: JSON.stringify(eventPayload),
  });
}

export function getPendingResultsQueue() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(FAILED_RESULTS_QUEUE_KEY);
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed.slice(-30) : [];
  } catch {
    return [];
  }
}

function savePendingResultsQueue(items) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(FAILED_RESULTS_QUEUE_KEY);
    } else {
      window.localStorage.setItem(FAILED_RESULTS_QUEUE_KEY, JSON.stringify(items.slice(-30)));
    }
  } catch {
    // ignore storage errors
  }
}

export async function flushPendingResultsApi() {
  const queue = getPendingResultsQueue();
  if (queue.length === 0) return { flushed: 0, remaining: 0 };

  const remaining = [];
  let flushed = 0;

  for (const item of queue) {
    try {
      await requestJson(`${API_BASE}/results`, {
        method: 'POST',
        body: JSON.stringify(item),
      });
      flushed += 1;
    } catch {
      remaining.push(item);
    }
  }

  savePendingResultsQueue(remaining);
  return { flushed, remaining: remaining.length };
}

/**
 * Submit a completed game result to the backend.
 * If a network error occurs, queues for retry and returns { savedToServer: false, queuedForRetry: true, error }
 * so the UI never falsely claims a record was saved when the server is unreachable.
 */
export async function submitGameResultApi(resultPayload) {
  try {
    const response = await requestJson(`${API_BASE}/results`, {
      method: 'POST',
      body: JSON.stringify(resultPayload),
    });
    return {
      savedToServer: true,
      queuedForRetry: false,
      duplicated: Boolean(response.duplicated),
      result: response.result,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const queue = getPendingResultsQueue();
    if (
      resultPayload.clientEventId &&
      !queue.some(q => q.clientEventId === resultPayload.clientEventId)
    ) {
      queue.push(resultPayload);
      savePendingResultsQueue(queue);
    }
    return {
      savedToServer: false,
      queuedForRetry: true,
      duplicated: false,
      result: null,
      error: message,
    };
  }
}

export async function fetchGameRankingsApi({ gameId, gameMode = '', playerId = '', limit = 10 }) {
  const params = new URLSearchParams();
  if (gameId) params.set('gameId', gameId);
  if (gameMode) params.set('gameMode', gameMode);
  if (playerId) params.set('playerId', playerId);
  if (limit) params.set('limit', String(limit));
  return requestJson(`${API_BASE}/rankings?${params.toString()}`);
}

export async function fetchPlayerRecordsApi(playerId, { gameId = '', limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (gameId) params.set('gameId', gameId);
  if (limit) params.set('limit', String(limit));
  return requestJson(`${API_BASE}/players/${encodeURIComponent(playerId)}/records?${params.toString()}`);
}
