(() => {
  'use strict';
  const TOKEN_KEY = 'gameBoxAuthToken';
  const EVENT_KEY = 'gameBoxActiveEventId';
  const ATTEMPT_QUEUE_KEY = 'gameBoxPendingAttempts';
  const RECORD_QUEUE_KEY = 'gameBoxPendingRecordSnapshots';
  const token = () => localStorage.getItem(TOKEN_KEY) || '';
  const headers = () => token() ? { Authorization: `Bearer ${token()}` } : {};
  let flushingAttempts = false;
  let flushingRecords = false;

  function pendingAttempts() {
    try {
      const value = JSON.parse(localStorage.getItem(ATTEMPT_QUEUE_KEY) || '[]');
      return Array.isArray(value) ? value.slice(-50) : [];
    } catch { return []; }
  }

  function savePendingAttempts(attempts) {
    attempts.length
      ? localStorage.setItem(ATTEMPT_QUEUE_KEY, JSON.stringify(attempts.slice(-50)))
      : localStorage.removeItem(ATTEMPT_QUEUE_KEY);
  }

  function pendingRecordSnapshots() {
    try {
      const value = JSON.parse(localStorage.getItem(RECORD_QUEUE_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  }

  function savePendingRecordSnapshots(snapshots) {
    Object.keys(snapshots).length
      ? localStorage.setItem(RECORD_QUEUE_KEY, JSON.stringify(snapshots))
      : localStorage.removeItem(RECORD_QUEUE_KEY);
  }

  async function flushAttempts() {
    if (flushingAttempts) return;
    flushingAttempts = true;
    try {
      const queue = pendingAttempts();
      while (queue.length) {
        const response = await fetch('/api/attempts', {
          method: 'POST',
          headers: { ...headers(), 'Content-Type': 'application/json' },
          body: JSON.stringify(queue[0]),
          keepalive: true,
        });
        if (!response.ok) break;
        queue.shift(); savePendingAttempts(queue);
      }
    } catch (error) {
      console.warn('게임 기록 업로드 대기', error);
    } finally { flushingAttempts = false; }
  }

  window.gameBoxAuth = {
    token,
    setToken(value) { value ? localStorage.setItem(TOKEN_KEY, value) : localStorage.removeItem(TOKEN_KEY); },
    activeEventId() { return localStorage.getItem(EVENT_KEY) || ''; },
  };

  async function loadRecords(game) {
    const response = await fetch(`/api/records/${game}`, { headers: headers(), cache: 'no-store' });
    if (response.status === 401 || response.status === 404) return null;
    if (!response.ok) throw new Error(`저장 기록 불러오기 실패 (HTTP ${response.status})`);
    return response.json();
  }

  function uploadRecords(game, detail) {
    const body = JSON.stringify(detail);
    return fetch(`/api/records/${game}`, {
      method: 'PUT',
      headers: { ...headers(), 'Content-Type': 'application/json', 'X-GameBox-Event': window.gameBoxAuth.activeEventId() },
      body,
      // 브라우저 keepalive 본문 한도보다 큰 2007 스냅샷은 일반 요청으로 전송한다.
      keepalive: body.length <= 60 * 1024,
    });
  }

  async function flushRecordSnapshots() {
    if (flushingRecords) return;
    flushingRecords = true;
    try {
      const snapshots = pendingRecordSnapshots();
      for (const [game, snapshot] of Object.entries(snapshots)) {
        const response = await uploadRecords(game, snapshot);
        if (!response.ok) continue;
        const current = pendingRecordSnapshots();
        if (current[game]?.capturedAt === snapshot.capturedAt) {
          delete current[game];
          savePendingRecordSnapshots(current);
        }
      }
    } catch (error) {
      console.warn('원본 기록 업로드 대기', error);
    } finally { flushingRecords = false; }
  }

  function queueRecordSnapshot(game, snapshot) {
    const snapshots = pendingRecordSnapshots();
    snapshots[game] = snapshot;
    savePendingRecordSnapshots(snapshots);
    flushRecordSnapshots();
  }

  window.hancom97LoadRecords = () => loadRecords('hancom97');
  window.hancom2007LoadRecords = () => loadRecords('hancom2007');

  window.addEventListener('hancom97-records', event => {
    if (!event.detail) return;
    queueRecordSnapshot('hancom97', event.detail);
  });

  window.addEventListener('hancom2007-records', event => {
    if (!event.detail) return;
    queueRecordSnapshot('hancom2007', event.detail);
  });

  function queueAttempt(event) {
    if (!event.detail) return;
    const attempt = { ...event.detail, eventId: window.gameBoxAuth.activeEventId() || null };
    const queue = pendingAttempts();
    if (!queue.some(item => item.clientAttemptId === attempt.clientAttemptId)) queue.push(attempt);
    savePendingAttempts(queue);
    flushAttempts();
  }

  window.addEventListener('hancom97-attempt', queueAttempt);
  window.addEventListener('hancom2007-attempt', queueAttempt);
  window.addEventListener('online', () => { flushAttempts(); flushRecordSnapshots(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushRecordSnapshots();
  });

  document.addEventListener('DOMContentLoaded', async () => {
    flushAttempts();
    flushRecordSnapshots();
    const badge = document.getElementById('account-badge');
    if (!badge) return;
    try {
      const response = await fetch('/api/bootstrap', { headers: headers(), cache: 'no-store' });
      if (!response.ok) throw new Error(String(response.status));
      const context = await response.json();
      badge.textContent = context.user.displayName;
      const active = context.events.find(event => event.id === window.gameBoxAuth.activeEventId());
      if (active) badge.title = `이벤트: ${active.name}`;
    } catch {
      badge.textContent = token() ? '로그인 갱신' : '사내 로그인 필요';
      badge.href = './rankings.html';
    }
  });
})();
