import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTrustedProxyIdentityProvider,
  encodeTrustedProxyIdentity,
} from '../server/trusted-proxy-identity.mjs';

test('신뢰 프록시용 base64url JSON 헤더가 한글 별명과 조직을 보존한다', () => {
  const identity = {
    subject: 'employee-100', displayName: '게임왕',
    organizations: [{ id: 'org-dev', name: '개발팀' }],
  };
  const provider = createTrustedProxyIdentityProvider();
  assert.deepEqual(provider({ headers: { 'x-gamebox-identity': encodeTrustedProxyIdentity(identity) } }), {
    provider: 'company-sso', ...identity,
  });
  assert.equal(provider({ headers: {} }), null);
  assert.throws(() => provider({ headers: { 'x-gamebox-identity': 'not+base64' } }), /형식/);
});
