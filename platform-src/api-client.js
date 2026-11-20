/**
 * Platform API & Realtime SSE Client Layer
 * Isolated communication module for easy corporate React portal integration.
 */

export class PlatformApiClient {
  constructor({ baseUrl = '', userProvider = null, getUser = null } = {}) {
    this.baseUrl = String(baseUrl || '')
      .replace(/\/api\/platform\/?$/, '')
      .replace(/\/$/, '');
    this.userProvider = userProvider;
    this.getUser = getUser;
    this.eventSource = null;
  }

  headers(extra = {}) {
    const providerHeaders = this.userProvider?.getHeaders?.() || {};
    const currentUser = this.getUser?.() || this.userProvider?.getCurrentUser?.();
    const fallbackMockHeader =
      !providerHeaders['X-Mock-User-Id'] && currentUser?.id
        ? { 'X-Mock-User-Id': currentUser.id }
        : {};
    const fallbackNickHeader =
      !providerHeaders['X-GameBox-Nickname'] && currentUser?.name
        ? { 'X-GameBox-Nickname': encodeURIComponent(currentUser.name) }
        : {};
    return {
      ...providerHeaders,
      ...fallbackMockHeader,
      ...fallbackNickHeader,
      ...extra,
    };
  }

  async request(path, options = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: this.headers({
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      }),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `요청 실패 (HTTP ${res.status})`);
    }
    return data;
  }

  bootstrap() {
    return this.request('/api/platform/bootstrap');
  }

  listUsers({ departmentId = '', q = '' } = {}) {
    const params = new URLSearchParams();
    if (departmentId) params.set('departmentId', departmentId);
    if (q) params.set('q', q);
    return this.request(`/api/platform/users?${params}`);
  }

  getDirectory({ departmentId = '', q = '' } = {}) {
    return this.listUsers({ departmentId, q });
  }

  listRooms(gameId = '', matchType = '') {
    const params = new URLSearchParams();
    if (gameId) params.set('gameId', gameId);
    if (matchType) params.set('matchType', matchType);
    const query = params.toString();
    return this.request(`/api/platform/rooms${query ? `?${query}` : ''}`);
  }

  createRoom(payload) {
    return this.request('/api/platform/rooms', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  getRoom(code) {
    return this.request(`/api/platform/rooms/${encodeURIComponent(code)}`);
  }

  roomAction(code, actionName, payload = {}) {
    return this.request(`/api/platform/rooms/${encodeURIComponent(code)}/${actionName}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  joinRoom(code) {
    return this.roomAction(code, 'join');
  }

  leaveRoom(code) {
    return this.roomAction(code, 'leave');
  }

  setReady(code, ready) {
    return this.roomAction(code, 'ready', { ready });
  }

  addBot(code, difficulty = 'normal') {
    return this.roomAction(code, 'add-bot', { difficulty });
  }

  removeBot(code, botId = null) {
    return this.roomAction(code, 'remove-bot', { botId });
  }

  startRoom(code) {
    return this.roomAction(code, 'start');
  }

  rematch(code) {
    return this.roomAction(code, 'rematch');
  }

  sendGameAction(code, actionPayload = {}) {
    return this.roomAction(code, 'action', actionPayload);
  }

  // Event Groups
  listEvents() {
    return this.request('/api/platform/events');
  }

  listEventGroups() {
    return this.listEvents();
  }

  createEvent(payload) {
    return this.request('/api/platform/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  createEventGroup(payload) {
    return this.createEvent(payload);
  }

  getEventDetail(eventId) {
    return this.request(`/api/platform/events/${encodeURIComponent(eventId)}`);
  }

  getEventGroup(eventId) {
    return this.getEventDetail(eventId);
  }

  getEventRankings(eventId) {
    return this.getEventDetail(eventId);
  }

  joinEvent(eventId, userId) {
    return this.request(`/api/platform/events/${encodeURIComponent(eventId)}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  setEventStatus(eventId, status) {
    return this.request(`/api/platform/events/${encodeURIComponent(eventId)}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  updateEventStatus(eventId, status) {
    return this.setEventStatus(eventId, status);
  }

  // Rankings & Stats
  async getRankings({ gameId = '', includePractice = false, departmentId = '' } = {}) {
    const params = new URLSearchParams();
    if (gameId) params.set('gameId', gameId);
    if (includePractice) params.set('includePractice', 'true');
    if (departmentId) params.set('departmentId', departmentId);
    const data = await this.request(`/api/platform/rankings?${params}`);
    return {
      ...data,
      rankings: data.rankings || data.individual || [],
      departments: data.departments || [],
    };
  }

  async getDepartmentRankings({ gameId = '', includePractice = false } = {}) {
    return this.getRankings({ gameId, includePractice });
  }

  getUserStats(userId = '') {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return this.request(`/api/platform/stats${params}`);
  }

  // Marble Roulette
  getRouletteData() {
    return this.request('/api/platform/roulette/history');
  }

  recordRouletteDraw(payload) {
    return this.request('/api/platform/roulette/history', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  saveRoulettePreset(payload) {
    return this.request('/api/platform/roulette/presets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Realtime SSE
  subscribeRoomStream(_roomCode, { onEvent } = {}) {
    const currentUser = this.getUser?.() || this.userProvider?.getCurrentUser?.();
    const clientId = currentUser?.id || 'emp-001';
    this.disconnectRealtime();
    const params = new URLSearchParams({ clientId, mockUserId: clientId });
    const es = new EventSource(`${this.baseUrl}/api/platform/stream?${params}`);
    this.eventSource = es;

    const events = [
      'connected',
      'roomSnapshot',
      'roomUpdated',
      'gameStarted',
      'updateGameState',
      'drawingRole',
      'drawingStroke',
      'drawingClear',
      'drawingGuessChat',
      'gameOver',
      'rematchReady',
      'gameAborted',
      'error',
    ];
    for (const evt of events) {
      es.addEventListener(evt, e => {
        try {
          const parsed = JSON.parse(e.data);
          onEvent?.(evt, parsed);
        } catch (err) {
          console.warn('[SSE parse error]', evt, err);
        }
      });
    }
    return () => this.disconnectRealtime();
  }

  disconnectRealtime() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
