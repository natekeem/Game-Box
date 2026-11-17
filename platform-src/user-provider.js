/**
 * Corporate User Identity Provider & Adapter Layer
 *
 * Separates:
 * 1. MockUserProvider (External Development & Testing)
 * 2. ExternalUserProvider (Corporate React Portal Integration via AD SSO)
 *
 * Standard GameUser Interface:
 * {
 *   id: string;
 *   name: string;
 *   departmentId: string;
 *   departmentName: string;
 * }
 */

const MOCK_USER_STORAGE_KEY = 'gamePlatformMockUserId';

export const DEFAULT_MOCK_USERS = Object.freeze([
  { id: 'emp-001', name: '김성민', departmentId: 'dept-auto', departmentName: '자동화운영팀' },
  { id: 'emp-002', name: '이지훈', departmentId: 'dept-infra', departmentName: '인프라팀' },
  { id: 'emp-003', name: '박수진', departmentId: 'dept-dev', departmentName: '개발팀' },
  { id: 'emp-004', name: '최민호', departmentId: 'dept-auto', departmentName: '자동화운영팀' },
  { id: 'emp-005', name: '정하늘', departmentId: 'dept-plan', departmentName: '기획팀' },
  { id: 'emp-006', name: '한지우', departmentId: 'dept-dev', departmentName: '개발팀' },
  { id: 'emp-007', name: '송유진', departmentId: 'dept-infra', departmentName: '인프라팀' },
  { id: 'emp-008', name: '강도윤', departmentId: 'dept-plan', departmentName: '기획팀' },
]);

export function adaptCorporateUser(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || raw.userId || raw.empNo || raw.subject || '').trim();
  const name = String(raw.name || raw.userName || raw.displayName || raw.nickname || '').trim();
  const org = Array.isArray(raw.organizations) && raw.organizations[0] ? raw.organizations[0] : (raw.organization || {});
  const departmentId = String(raw.departmentId || raw.deptId || org.id || org.subject || 'dept-general').trim();
  const departmentName = String(raw.departmentName || raw.deptName || org.name || '사내공통').trim();
  if (!id || !name) return null;
  return { id, name, departmentId, departmentName };
}

export class MockUserProvider {
  constructor(options = {}) {
    this.mode = 'mock';
    this.allowMockUserSwitch = true;
    this.mockUsers = options.mockUsers || DEFAULT_MOCK_USERS;
    this.listeners = new Set();
    this.selectedUserId = options.initialUserId || null;
    if (options.initialUserId) {
      this.setSelectedMockUserId(options.initialUserId);
    }
  }

  getSelectedMockUserId() {
    if (this.selectedUserId) return this.selectedUserId;
    try {
      return localStorage.getItem(MOCK_USER_STORAGE_KEY) || 'emp-001';
    } catch {
      return 'emp-001';
    }
  }

  setSelectedMockUserId(userId) {
    this.selectedUserId = String(userId);
    try {
      localStorage.setItem(MOCK_USER_STORAGE_KEY, String(userId));
    } catch {
      // ignore storage errors
    }
    const current = this.getCurrentUser();
    this.listeners.forEach(fn => fn(current));
  }

  switchMockUser(userId) {
    this.setSelectedMockUserId(userId);
    return this.getCurrentUser();
  }

  listAvailableMockUsers() {
    return this.mockUsers;
  }

  getCurrentUser() {
    let guestNickname = '';
    let guestId = '';
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        guestNickname = (params.get('nickname') || '').trim();
        guestId = (params.get('guestId') || '').trim();
        if (!guestNickname) {
          const raw = localStorage.getItem('gameBox_guest_identity_v1');
          if (raw) {
            const parsed = JSON.parse(raw);
            guestNickname = (parsed.nickname || '').trim();
            guestId = (parsed.guestId || '').trim();
          }
        }
      }
    } catch {
      // ignore parsing errors
    }

    const id = this.getSelectedMockUserId();
    const base = this.mockUsers.find(u => u.id === id) || this.mockUsers[0];
    if (guestNickname) {
      return {
        ...base,
        id: guestId || base.id,
        name: guestNickname,
        departmentName: '게스트 플레이어',
      };
    }
    return base;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getHeaders() {
    const cur = this.getCurrentUser();
    return {
      'X-Mock-User-Id': this.getSelectedMockUserId(),
      'X-GameBox-Nickname': encodeURIComponent(cur.name || ''),
    };
  }
}

export class ExternalUserProvider {
  /**
   * @param {{ user?: any, externalUser?: any, getUserFn?: () => any, getAuthHeaders?: () => Record<string, string> }} options
   */
  constructor(options = {}) {
    this.mode = 'external';
    this.allowMockUserSwitch = false;
    const rawUser = options.user || options.externalUser || (typeof options.getUserFn === 'function' ? options.getUserFn() : null);
    this.externalUser = rawUser ? adaptCorporateUser(rawUser) : null;
    this.getUserFn = options.getUserFn || null;
    this.getAuthHeaders = options.getAuthHeaders || (() => ({}));
    this.listeners = new Set();
  }

  getSelectedMockUserId() {
    return null;
  }

  setSelectedMockUserId() {
    throw new Error('운영 환경(ExternalUserProvider)에서는 임의 테스트 사용자 전환이 비활성화되어 있습니다.');
  }

  switchMockUser() {
    throw new Error('운영 환경(ExternalUserProvider)에서는 임의 테스트 사용자 전환이 비활성화되어 있습니다.');
  }

  listAvailableMockUsers() {
    return [];
  }

  getCurrentUser() {
    if (typeof this.getUserFn === 'function') {
      const adapted = adaptCorporateUser(this.getUserFn());
      if (adapted) return adapted;
    }
    return this.externalUser;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getHeaders() {
    return {
      ...this.getAuthHeaders(),
    };
  }
}

export function createUserProvider(config = {}) {
  if (config.mode === 'external' || config.externalUser || config.user) {
    return new ExternalUserProvider({
      user: config.externalUser || config.user,
      getUserFn: config.getUserFn,
      getAuthHeaders: config.getAuthHeaders,
    });
  }
  return new MockUserProvider({
    initialUserId: config.initialUserId,
    mockUsers: config.mockUsers,
  });
}
