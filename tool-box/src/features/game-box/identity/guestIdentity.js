/**
 * Guest Identity Management (Browser UUID + Mutable Nickname)
 *
 * Security Note:
 * Guest IDs are generated per browser and stored in localStorage.
 * Because a guestId is not a cryptographically verified server session credential,
 * rankings in this stage operate at the 'guest-identified' trust level.
 * When ported to the host Tool Box portal, swap GuestIdentityAdapter with
 * AuthenticatedIdentityAdapter inside GameIdentityProvider without changing any game or ranking UI.
 */

export const GUEST_IDENTITY_STORAGE_KEY = 'gameBox_guest_identity_v1';

function generateBrowserUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `guest-${crypto.randomUUID()}`;
  }
  return 'guest-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Sanitize and validate nickname input.
 * - Length: 2 ~ 16 characters
 * - Allowed characters: Korean syllables/jamo, alphanumeric, spaces, hyphens, underscores
 * - Blocks HTML tags, script characters (<, >, ', ", &, `, /, \)
 */
export function sanitizeAndValidateNickname(rawInput) {
  if (typeof rawInput !== 'string') {
    return { valid: false, value: '', error: '닉네임을 입력해주세요.' };
  }
  const trimmed = rawInput.replace(/\s+/g, ' ').trim();
  if (trimmed.length < 2 || trimmed.length > 16) {
    return {
      valid: false,
      value: trimmed,
      error: '닉네임은 공백 포함 2자 이상 16자 이하로 입력해주세요.',
    };
  }
  if (/[<>'"&`\\/\x00-\x1F\x7F]/.test(trimmed)) {
    return {
      valid: false,
      value: trimmed,
      error: '특수문자(<, >, \', ", &, `, /, \\)는 사용할 수 없습니다.',
    };
  }
  if (!/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 _-]+$/.test(trimmed)) {
    return {
      valid: false,
      value: trimmed,
      error: '닉네임은 한글, 영문, 숫자, 공백, 하이픈(-), 밑줄(_)만 사용할 수 있습니다.',
    };
  }
  return { valid: true, value: trimmed, error: null };
}

/**
 * Read current guest identity from localStorage.
 * Ensures a persistent guestId exists even before a nickname is registered.
 */
export function loadGuestIdentity() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      guestId: generateBrowserUuid(),
      nickname: '',
      createdAt: null,
      updatedAt: null,
      isRegistered: false,
      identityType: 'guest',
    };
  }

  try {
    const raw = window.localStorage.getItem(GUEST_IDENTITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const guestId = typeof parsed.guestId === 'string' && parsed.guestId.length >= 8
        ? parsed.guestId
        : generateBrowserUuid();
      const check = sanitizeAndValidateNickname(parsed.nickname || '');
      const nickname = check.valid ? check.value : '';
      return {
        guestId,
        nickname,
        createdAt: parsed.createdAt || null,
        updatedAt: parsed.updatedAt || parsed.createdAt || null,
        isRegistered: Boolean(nickname),
        identityType: 'guest',
      };
    }
  } catch (err) {
    console.warn('[GameBox] Failed to read guest identity from localStorage:', err);
  }

  const freshGuestId = generateBrowserUuid();
  const initialRecord = {
    guestId: freshGuestId,
    nickname: '',
    createdAt: null,
    updatedAt: null,
  };
  try {
    window.localStorage.setItem(GUEST_IDENTITY_STORAGE_KEY, JSON.stringify(initialRecord));
  } catch {
    // ignore storage quota errors
  }

  return {
    ...initialRecord,
    isRegistered: false,
    identityType: 'guest',
  };
}

/**
 * Save or update the nickname while preserving the existing guestId and createdAt.
 */
export function saveGuestNickname(newNickname) {
  const validation = sanitizeAndValidateNickname(newNickname);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const current = loadGuestIdentity();
  const now = new Date().toISOString();
  const updated = {
    guestId: current.guestId || generateBrowserUuid(),
    nickname: validation.value,
    createdAt: current.createdAt || now,
    updatedAt: now,
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(GUEST_IDENTITY_STORAGE_KEY, JSON.stringify(updated));
  }

  return {
    ...updated,
    isRegistered: true,
    identityType: 'guest',
  };
}
