import test from 'node:test';
import assert from 'node:assert/strict';
import { RankingStore, CATEGORIES } from '../server/ranking-store.mjs';

function setup() {
  const store = new RankingStore(':memory:');
  const alice = store.createUser('앨리스');
  const bob = store.createUser('밥게임');
  return { store, alice, bob };
}

test('사용자를 만들고 발급 토큰으로 다시 인증한다', t => {
  const { store, alice } = setup(); t.after(() => store.close());
  assert.equal(store.authenticate(alice.token).displayName, '앨리스');
  assert.equal(store.authenticate('wrong-token'), null);
  assert.ok(CATEGORIES.some(category => category.id === 'typing-short'));
  assert.ok(CATEGORIES.some(category => category.id === 'game-rain'));
  assert.ok(CATEGORIES.some(category => category.id === 'hancom2007-typing-short'));
});

test('사내 인증 사용자의 별명과 조직을 외부 ID 기준으로 동기화한다', t => {
  const store = new RankingStore(':memory:'); t.after(() => store.close());
  const first = store.syncExternalIdentity({
    provider: 'company-sso', subject: 'employee-42', nickname: '첫 별명',
    organizations: [{ id: 'org-dev', name: '개발본부' }],
  });
  const second = store.syncExternalIdentity({
    provider: 'company-sso', subject: 'employee-42', nickname: '새 별명',
    organizations: [{ id: 'org-platform', name: '플랫폼팀', role: 'owner' }],
  });

  assert.equal(second.id, first.id);
  assert.equal(second.displayName, '새 별명');
  assert.deepEqual(store.listContext(first.id).organizations.map(organization => organization.name), ['플랫폼팀']);
});

test('조직 생성과 구성원 추가 후 조직 내부 랭킹을 계산한다', t => {
  const { store, alice, bob } = setup(); t.after(() => store.close());
  const organization = store.createOrganization(alice.user.id, '개발 1팀');
  store.addOrganizationMember(alice.user.id, organization.id, bob.user.id);
  store.submitAttempt(alice.user.id, { category: 'typing-short', speed: 390, accuracy: 97, source: 'test' });
  store.submitAttempt(bob.user.id, { category: 'typing-short', speed: 420, accuracy: 95, source: 'test' });
  store.submitAttempt(bob.user.id, { category: 'typing-short', speed: 400, accuracy: 100, source: 'test' });

  const result = store.rankings({ category: 'typing-short', scope: 'organization', scopeId: organization.id, period: 'all' });
  assert.deepEqual(result.entries.map(entry => entry.displayName), ['밥게임', '앨리스']);
  assert.deepEqual(result.entries.map(entry => entry.value), [420, 390]);
});

test('조직 간 랭킹은 종목별 상위 5명 평균으로 비교한다', t => {
  const { store, alice, bob } = setup(); t.after(() => store.close());
  const red = store.createOrganization(alice.user.id, '레드팀');
  const blue = store.createOrganization(bob.user.id, '블루팀');
  store.submitAttempt(alice.user.id, { category: 'game-rain', score: 900, source: 'test' });
  store.submitAttempt(bob.user.id, { category: 'game-rain', score: 1200, source: 'test' });

  const result = store.rankings({ category: 'game-rain', scope: 'organizations', period: 'all' });
  assert.equal(result.aggregation, '조직별 상위 5명 평균');
  assert.equal(result.entries[0].organizationId, blue.id);
  assert.equal(result.entries[1].organizationId, red.id);
});

test('이벤트 초대 수락, 종목과 기간 제한, 이벤트 전용 랭킹이 동작한다', t => {
  const { store, alice, bob } = setup(); t.after(() => store.close());
  const start = new Date(Date.now() - 60_000).toISOString();
  const end = new Date(Date.now() + 3_600_000).toISOString();
  const event = store.createEvent(alice.user.id, { name: '가을 타자왕', startAt: start, endAt: end, categoryIds: ['typing-long'] });
  store.inviteToEvent(alice.user.id, event.id, bob.user.id);
  assert.throws(() => store.submitAttempt(bob.user.id, { eventId: event.id, category: 'typing-long', speed: 500, accuracy: 98, source: 'test' }), /참가자/);
  store.acceptEvent(bob.user.id, event.id);
  store.submitAttempt(alice.user.id, { eventId: event.id, category: 'typing-long', speed: 430, accuracy: 99, source: 'test' });
  store.submitAttempt(bob.user.id, { eventId: event.id, category: 'typing-long', speed: 510, accuracy: 96, source: 'test' });
  assert.throws(() => store.submitAttempt(bob.user.id, { eventId: event.id, category: 'game-rain', score: 100, source: 'test' }), /포함되지 않은/);

  const result = store.rankings({ category: 'typing-long', scope: 'event', scopeId: event.id, period: 'all' });
  assert.deepEqual(result.entries.map(entry => entry.displayName), ['밥게임', '앨리스']);
});

test('지뢰찾기 기록은 짧은 시간이 상위이고 중복 제출은 멱등 처리한다', t => {
  const { store, alice, bob } = setup(); t.after(() => store.close());
  store.submitAttempt(alice.user.id, { category: 'mines-beginner', elapsedMs: 35_000, source: 'test', clientAttemptId: 'a-1' });
  const first = store.submitAttempt(bob.user.id, { category: 'mines-beginner', elapsedMs: 28_000, source: 'test', clientAttemptId: 'b-1' });
  const duplicate = store.submitAttempt(bob.user.id, { category: 'mines-beginner', elapsedMs: 10_000, source: 'test', clientAttemptId: 'b-1' });
  assert.equal(duplicate.id, first.id);
  const result = store.rankings({ category: 'mines-beginner', scope: 'global', period: 'all' });
  assert.deepEqual(result.entries.map(entry => entry.value), [28_000, 35_000]);
});

test('한컴 원본 기록 스냅샷을 사용자별로 저장하고 복원한다', t => {
  const { store, alice } = setup(); t.after(() => store.close());
  const snapshot = { version: 1, game: 'hancom97', capturedAt: new Date().toISOString(), files: [{ path: 'HTP.SCO', byteLength: 1, base64: 'AQ==' }] };
  const saved = store.saveRecordSnapshot(alice.user.id, 'hancom97', snapshot);
  assert.match(saved.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(store.getRecordSnapshot(alice.user.id, 'hancom97'), snapshot);
  assert.throws(() => store.saveRecordSnapshot(alice.user.id, 'hancom97', { ...snapshot, files: [{ path: 'AUTOEXEC.BAT', byteLength: 0, base64: '' }] }), /허용되지/);
});

test('2007 원본 기록과 랭킹을 97 기록과 분리해 저장한다', t => {
  const { store, alice } = setup(); t.after(() => store.close());
  const snapshot = {
    version: 1,
    game: 'hancom2007',
    capturedAt: new Date().toISOString(),
    files: [
      { path: 'userdata.0', byteLength: 2, base64: 'AQI=' },
      { path: 'speed.dat', byteLength: 1, base64: 'cw==' },
    ],
  };
  store.saveRecordSnapshot(alice.user.id, 'hancom2007', snapshot);
  assert.deepEqual(store.getRecordSnapshot(alice.user.id, 'hancom2007'), snapshot);
  const attempt = store.submitAttempt(alice.user.id, {
    category: 'hancom2007-typing-short', speed: 114, accuracy: 100, source: 'win32-runtime',
  });
  assert.equal(attempt.game, 'hancom2007');
  assert.equal(store.rankings({ category: 'hancom2007-typing-short' }).entries[0].value, 114);
  assert.throws(() => store.saveRecordSnapshot(alice.user.id, 'hancom2007', {
    ...snapshot,
    files: [{ path: '../speed.dat', byteLength: 0, base64: '' }],
  }), /허용되지/);
});
