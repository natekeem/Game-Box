import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createGameBoxServer } from '../server/http-app.mjs';

async function request(base, pathname, { token, method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${base}${pathname}`, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, body: await response.json() };
}

test('HTTP API에서 사용자, 조직, 이벤트, 기록, 랭킹 흐름이 연결된다', async t => {
  const { server } = createGameBoxServer({ databasePath: ':memory:' });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;

  const unauthenticated = await request(base, '/api/bootstrap');
  assert.equal(unauthenticated.status, 401);
  const created = await request(base, '/api/users', { method: 'POST', body: { displayName: 'API 사용자' } });
  assert.equal(created.status, 201);
  const token = created.body.token;
  const organization = await request(base, '/api/organizations', { token, method: 'POST', body: { name: 'API 조직' } });
  assert.equal(organization.status, 201);
  const event = await request(base, '/api/events', { token, method: 'POST', body: {
    name: 'API 이벤트', startAt: new Date(Date.now() - 1000).toISOString(), endAt: new Date(Date.now() + 60_000).toISOString(), categoryIds: ['game-rain'],
  } });
  assert.equal(event.status, 201);
  assert.equal((await request(base, '/api/attempts', { token, method: 'POST', body: { category: 'game-rain', score: 777, eventId: event.body.id, source: 'api-test' } })).status, 201);
  const ranking = await request(base, `/api/rankings?category=game-rain&scope=event&scopeId=${event.body.id}&period=all`, { token });
  assert.equal(ranking.body.entries[0].value, 777);
  const bootstrap = await request(base, '/api/bootstrap', { token });
  assert.equal(bootstrap.body.organizations[0].name, 'API 조직');
  assert.equal(bootstrap.body.events[0].name, 'API 이벤트');

  const records2007 = {
    version: 1,
    game: 'hancom2007',
    capturedAt: new Date().toISOString(),
    files: [{ path: 'speed.dat', byteLength: 1, base64: 'cg==' }],
  };
  assert.equal((await request(base, '/api/records/hancom2007', { token, method: 'PUT', body: records2007 })).status, 200);
  const restored2007 = await request(base, '/api/records/hancom2007', { token });
  assert.equal(restored2007.status, 200);
  assert.deepEqual(restored2007.body, records2007);
  assert.equal((await request(base, '/api/attempts', {
    token,
    method: 'POST',
    body: { category: 'hancom2007-typing-short', speed: 114, accuracy: 100, source: 'api-test' },
  })).status, 201);
  const ranking2007 = await request(base, '/api/rankings?category=hancom2007-typing-short&period=all', { token });
  assert.equal(ranking2007.body.entries[0].value, 114);
});

test('사내 인증 어댑터가 사용자와 조직을 주입하고 로컬 가입을 막는다', async t => {
  const { server } = createGameBoxServer({
    databasePath: ':memory:',
    identityProvider(request) {
      const subject = request.headers['x-test-user'];
      if (!subject) return null;
      return {
        provider: 'test-sso', subject, displayName: request.headers['x-test-nickname'],
        organizations: [{ id: request.headers['x-test-org'], name: request.headers['x-test-org-name'] }],
      };
    },
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const headers = {
    'X-Test-User': 'employee-7', 'X-Test-Nickname': 'company-user',
    'X-Test-Org': 'org-7', 'X-Test-Org-Name': 'service-dev',
  };

  assert.equal((await request(base, '/api/users', { method: 'POST', body: { displayName: '직접가입' } })).status, 403);
  const bootstrap = await request(base, '/api/bootstrap', { headers });
  assert.equal(bootstrap.status, 200);
  assert.equal(bootstrap.body.authMode, 'external');
  assert.equal(bootstrap.body.user.displayName, 'company-user');
  assert.equal(bootstrap.body.organizations[0].name, 'service-dev');
});
