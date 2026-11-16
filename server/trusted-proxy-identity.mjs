const DEFAULT_HEADER = 'x-gamebox-identity';

export function encodeTrustedProxyIdentity(identity) {
  return Buffer.from(JSON.stringify(identity), 'utf8').toString('base64url');
}

export function createTrustedProxyIdentityProvider({ headerName = DEFAULT_HEADER } = {}) {
  const normalizedHeader = String(headerName || DEFAULT_HEADER).trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(normalizedHeader)) throw new Error('사내 인증 헤더 이름이 올바르지 않습니다.');
  return request => {
    const encoded = request.headers[normalizedHeader];
    if (!encoded || Array.isArray(encoded)) return null;
    if (encoded.length > 16 * 1024 || !/^[A-Za-z0-9_-]+$/.test(encoded)) throw new Error('사내 인증 헤더 형식이 올바르지 않습니다.');
    let identity;
    try { identity = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')); }
    catch { throw new Error('사내 인증 헤더를 해석할 수 없습니다.'); }
    if (!identity || typeof identity !== 'object' || Array.isArray(identity)) throw new Error('사내 인증 정보가 올바르지 않습니다.');
    return { provider: 'company-sso', ...identity };
  };
}
