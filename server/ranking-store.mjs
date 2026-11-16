import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export const CATEGORIES = Object.freeze([
  { id: 'typing-position', game: 'hancom97', label: '자리 연습', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'typing-word', game: 'hancom97', label: '낱말 연습', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'typing-short', game: 'hancom97', label: '짧은글 연습', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'typing-long', game: 'hancom97', label: '긴글 연습', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'typing-test', game: 'hancom97', label: '타자 검정', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'game-rain', game: 'hancom97', label: '산성비', metric: 'score', direction: 'desc', unit: '점' },
  { id: 'game-invader', game: 'hancom97', label: '침략자', metric: 'score', direction: 'desc', unit: '점' },
  { id: 'hancom2007-typing-position', game: 'hancom2007', label: '2007 · 자리 연습', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'hancom2007-typing-word', game: 'hancom2007', label: '2007 · 낱말 연습', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'hancom2007-typing-short', game: 'hancom2007', label: '2007 · 짧은글 연습', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'hancom2007-typing-long', game: 'hancom2007', label: '2007 · 긴글 연습', metric: 'speed', direction: 'desc', unit: '타/분' },
  { id: 'hancom2007-game-sos', game: 'hancom2007', label: '2007 · 해상구조 SOS', metric: 'score', direction: 'desc', unit: '점' },
  { id: 'hancom2007-game-cake', game: 'hancom2007', label: '2007 · 케이크 던지기', metric: 'score', direction: 'desc', unit: '점' },
  { id: 'mines-beginner', game: 'minesweeper98', label: '지뢰찾기 초급', metric: 'elapsedMs', direction: 'asc', unit: '초' },
  { id: 'mines-intermediate', game: 'minesweeper98', label: '지뢰찾기 중급', metric: 'elapsedMs', direction: 'asc', unit: '초' },
  { id: 'mines-expert', game: 'minesweeper98', label: '지뢰찾기 고급', metric: 'elapsedMs', direction: 'asc', unit: '초' },
  { id: 'pikachu-vs-com', game: 'pikachu', label: '피카츄 배구 · AI 대전', metric: 'score', direction: 'desc', unit: '점' },
]);

const CATEGORY_MAP = new Map(CATEGORIES.map(category => [category.id, category]));
const nowIso = () => new Date().toISOString();
const id = () => crypto.randomUUID();
const tokenHash = token => crypto.createHash('sha256').update(token).digest('hex');

function text(value, label, min = 1, max = 80) {
  const normalized = String(value ?? '').trim();
  if (normalized.length < min || normalized.length > max) throw new Error(`${label}은(는) ${min}~${max}자로 입력하세요.`);
  return normalized;
}

function iso(value, label) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) throw new Error(`${label} 날짜가 올바르지 않습니다.`);
  return date.toISOString();
}

function finite(value, label, { min = 0, max = Number.MAX_SAFE_INTEGER, optional = true } = {}) {
  if (value == null && optional) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new Error(`${label} 값이 올바르지 않습니다.`);
  return number;
}

function periodStart(period, from) {
  if (period === 'all') return null;
  if (period === 'custom') return iso(from, '시작');
  const date = new Date();
  if (period === 'today') date.setHours(0, 0, 0, 0);
  else if (period === '7d') date.setDate(date.getDate() - 7);
  else if (period === '30d') date.setDate(date.getDate() - 30);
  else throw new Error('지원하지 않는 기간입니다.');
  return date.toISOString();
}

function rowUser(row) {
  return { id: row.id, displayName: row.display_name, createdAt: row.created_at };
}

const HANCOM97_RECORD_FILES = new Set(['HTP.SCO', 'HTT.STA']);
const HANCOM2007_RECORD_FILES = new Set([
  'USERDATA.IDX', 'USRLIST.DAT', 'LASTUSER.DAT', 'SCORES.DAT', 'SPEED.DAT', '.DAT',
]);

function recordFileName(game, value) {
  const normalized = String(value || '').replaceAll('\\', '/').replace(/^\.\//, '');
  if (!normalized || normalized.includes('..') || normalized.includes('/')) return null;
  const upper = normalized.toUpperCase();
  if (game === 'hancom97') return HANCOM97_RECORD_FILES.has(upper) ? upper : null;
  if (game === 'hancom2007') {
    if (HANCOM2007_RECORD_FILES.has(upper) || /^USERDATA\.\d{1,2}$/.test(upper)) return upper;
  }
  return null;
}

function validateHancomSnapshot(game, snapshot) {
  const maxFiles = game === 'hancom97' ? 2 : game === 'hancom2007' ? 16 : 0;
  if (!maxFiles || snapshot?.version !== 1 || snapshot?.game !== game || !Array.isArray(snapshot.files) || snapshot.files.length > maxFiles) {
    throw new Error('지원하지 않는 한컴타자연습 기록 스냅샷입니다.');
  }
  const seen = new Set();
  for (const file of snapshot.files) {
    const name = recordFileName(game, file?.path);
    if (!name || seen.has(name)) throw new Error('허용되지 않거나 중복된 원본 기록 파일입니다.');
    if (typeof file.base64 !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.base64)) {
      throw new Error('원본 기록 데이터가 올바르지 않습니다.');
    }
    const bytes = Buffer.from(file.base64, 'base64');
    if (bytes.length > 128 * 1024 || file.byteLength !== bytes.length) throw new Error('원본 기록 파일 크기가 올바르지 않습니다.');
    seen.add(name);
  }
}

export class RankingStore {
  constructor(databasePath = ':memory:') {
    if (databasePath !== ':memory:') fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    this.db = new DatabaseSync(databasePath);
    this.db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS auth_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        last_used_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS external_identities (
        provider TEXT NOT NULL,
        subject TEXT NOT NULL,
        user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL,
        last_synced_at TEXT NOT NULL,
        PRIMARY KEY (provider, subject)
      );
      CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE COLLATE NOCASE,
        owner_user_id TEXT NOT NULL REFERENCES users(id),
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS organization_members (
        organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK(role IN ('owner','member')),
        created_at TEXT NOT NULL,
        PRIMARY KEY (organization_id, user_id)
      );
      CREATE TABLE IF NOT EXISTS external_organizations (
        provider TEXT NOT NULL,
        subject TEXT NOT NULL,
        organization_id TEXT NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL,
        last_synced_at TEXT NOT NULL,
        PRIMARY KEY (provider, subject)
      );
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        owner_user_id TEXT NOT NULL REFERENCES users(id),
        organization_id TEXT REFERENCES organizations(id),
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        start_at TEXT NOT NULL,
        end_at TEXT NOT NULL,
        category_ids TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS event_members (
        event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT NOT NULL CHECK(status IN ('invited','accepted')),
        invited_by TEXT NOT NULL REFERENCES users(id),
        created_at TEXT NOT NULL,
        accepted_at TEXT,
        PRIMARY KEY (event_id, user_id)
      );
      CREATE TABLE IF NOT EXISTS attempts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
        game TEXT NOT NULL,
        category TEXT NOT NULL,
        score REAL,
        speed REAL,
        accuracy REAL,
        elapsed_ms INTEGER,
        occurred_at TEXT NOT NULL,
        source TEXT NOT NULL,
        integrity TEXT NOT NULL,
        client_attempt_id TEXT,
        created_at TEXT NOT NULL,
        UNIQUE(user_id, client_attempt_id)
      );
      CREATE TABLE IF NOT EXISTS raw_record_snapshots (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        game TEXT NOT NULL,
        snapshot_json TEXT NOT NULL,
        snapshot_sha256 TEXT NOT NULL,
        captured_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(user_id, game)
      );
      CREATE INDEX IF NOT EXISTS idx_attempt_category_time ON attempts(category, occurred_at DESC);
      CREATE INDEX IF NOT EXISTS idx_attempt_event ON attempts(event_id, category, occurred_at DESC);
      CREATE INDEX IF NOT EXISTS idx_org_member_user ON organization_members(user_id, organization_id);
    `);
  }

  close() { this.db.close(); }

  createUser(displayName) {
    const createdAt = nowIso();
    const user = { id: id(), displayName: text(displayName, '사용자 이름', 2, 30), createdAt };
    const token = crypto.randomBytes(32).toString('base64url');
    this.db.prepare('INSERT INTO users VALUES (?, ?, ?)').run(user.id, user.displayName, createdAt);
    this.db.prepare('INSERT INTO auth_tokens VALUES (?, ?, ?, ?, ?)').run(id(), user.id, tokenHash(token), createdAt, createdAt);
    return { user, token };
  }

  authenticate(token) {
    if (!token) return null;
    const row = this.db.prepare(`
      SELECT u.* FROM auth_tokens t JOIN users u ON u.id=t.user_id WHERE t.token_hash=?
    `).get(tokenHash(token));
    if (!row) return null;
    this.db.prepare('UPDATE auth_tokens SET last_used_at=? WHERE token_hash=?').run(nowIso(), tokenHash(token));
    return rowUser(row);
  }

  syncExternalIdentity(identity) {
    const provider = text(identity?.provider || 'company-sso', '인증 제공자', 2, 80);
    const subject = text(identity?.subject ?? identity?.id, '외부 사용자 ID', 1, 160);
    const displayName = text(identity?.displayName ?? identity?.nickname, '사용자 이름', 1, 60);
    const organizations = Array.isArray(identity?.organizations)
      ? identity.organizations
      : identity?.organization ? [identity.organization] : [];
    const syncedAt = nowIso();

    this.db.exec('BEGIN');
    try {
      let link = this.db.prepare('SELECT user_id FROM external_identities WHERE provider=? AND subject=?').get(provider, subject);
      let userId = link?.user_id;
      if (!userId) {
        userId = id();
        this.db.prepare('INSERT INTO users VALUES (?, ?, ?)').run(userId, displayName, syncedAt);
        this.db.prepare('INSERT INTO external_identities VALUES (?, ?, ?, ?, ?)')
          .run(provider, subject, userId, syncedAt, syncedAt);
      } else {
        this.db.prepare('UPDATE users SET display_name=? WHERE id=?').run(displayName, userId);
        this.db.prepare('UPDATE external_identities SET last_synced_at=? WHERE provider=? AND subject=?')
          .run(syncedAt, provider, subject);
      }

      const activeOrganizationIds = new Set();
      for (const rawOrganization of organizations) {
        const organizationSubject = text(rawOrganization?.subject ?? rawOrganization?.id, '외부 조직 ID', 1, 160);
        const organizationName = text(rawOrganization?.name, '조직 이름', 1, 80);
        const role = rawOrganization?.role === 'owner' ? 'owner' : 'member';
        let organizationLink = this.db.prepare(
          'SELECT organization_id FROM external_organizations WHERE provider=? AND subject=?',
        ).get(provider, organizationSubject);
        let organizationId = organizationLink?.organization_id;
        if (!organizationId) {
          const sameName = this.db.prepare('SELECT id FROM organizations WHERE name=? COLLATE NOCASE').get(organizationName);
          organizationId = sameName?.id || id();
          if (!sameName) {
            this.db.prepare('INSERT INTO organizations VALUES (?, ?, ?, ?)')
              .run(organizationId, organizationName, userId, syncedAt);
          }
          this.db.prepare('INSERT INTO external_organizations VALUES (?, ?, ?, ?, ?)')
            .run(provider, organizationSubject, organizationId, syncedAt, syncedAt);
        } else {
          this.db.prepare('UPDATE organizations SET name=? WHERE id=?').run(organizationName, organizationId);
          this.db.prepare('UPDATE external_organizations SET last_synced_at=? WHERE provider=? AND subject=?')
            .run(syncedAt, provider, organizationSubject);
        }
        if (role === 'owner') this.db.prepare('UPDATE organizations SET owner_user_id=? WHERE id=?').run(userId, organizationId);
        this.db.prepare(`INSERT INTO organization_members VALUES (?, ?, ?, ?)
          ON CONFLICT(organization_id,user_id) DO UPDATE SET role=excluded.role`).run(organizationId, userId, role, syncedAt);
        activeOrganizationIds.add(organizationId);
      }

      const knownExternalOrganizations = this.db.prepare(
        `SELECT eo.organization_id FROM external_organizations eo
         JOIN organization_members om ON om.organization_id=eo.organization_id
         WHERE eo.provider=? AND om.user_id=?`,
      ).all(provider, userId);
      for (const row of knownExternalOrganizations) {
        if (!activeOrganizationIds.has(row.organization_id)) {
          this.db.prepare('DELETE FROM organization_members WHERE organization_id=? AND user_id=?')
            .run(row.organization_id, userId);
        }
      }

      this.db.exec('COMMIT');
      return this.getUser(userId);
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  getUser(userId) {
    const row = this.db.prepare('SELECT * FROM users WHERE id=?').get(userId);
    if (!row) throw new Error('사용자를 찾을 수 없습니다.');
    return rowUser(row);
  }

  searchUsers(query, excludeUserId) {
    const q = `%${String(query ?? '').trim().slice(0, 30)}%`;
    return this.db.prepare('SELECT * FROM users WHERE display_name LIKE ? AND id<>? ORDER BY display_name LIMIT 20')
      .all(q, excludeUserId).map(rowUser);
  }

  createOrganization(userId, name) {
    const organization = { id: id(), name: text(name, '조직 이름', 2, 50), createdAt: nowIso() };
    this.db.exec('BEGIN');
    try {
      this.db.prepare('INSERT INTO organizations VALUES (?, ?, ?, ?)').run(organization.id, organization.name, userId, organization.createdAt);
      this.db.prepare('INSERT INTO organization_members VALUES (?, ?, ?, ?)').run(organization.id, userId, 'owner', organization.createdAt);
      this.db.exec('COMMIT');
    } catch (error) {
      this.db.exec('ROLLBACK');
      if (String(error).includes('UNIQUE')) throw new Error('같은 이름의 조직이 이미 있습니다.');
      throw error;
    }
    return organization;
  }

  addOrganizationMember(actorUserId, organizationId, memberUserId) {
    const organization = this.db.prepare('SELECT * FROM organizations WHERE id=?').get(organizationId);
    if (!organization || organization.owner_user_id !== actorUserId) throw new Error('조직 관리자만 구성원을 추가할 수 있습니다.');
    this.getUser(memberUserId);
    this.db.prepare(`INSERT INTO organization_members VALUES (?, ?, 'member', ?)
      ON CONFLICT(organization_id,user_id) DO NOTHING`).run(organizationId, memberUserId, nowIso());
    return this.getOrganization(organizationId);
  }

  getOrganization(organizationId, viewerUserId = null) {
    const row = this.db.prepare('SELECT * FROM organizations WHERE id=?').get(organizationId);
    if (!row) throw new Error('조직을 찾을 수 없습니다.');
    if (viewerUserId && !this.db.prepare('SELECT 1 FROM organization_members WHERE organization_id=? AND user_id=?').get(organizationId, viewerUserId)) {
      throw new Error('이 조직의 구성원만 조회할 수 있습니다.');
    }
    const members = this.db.prepare(`SELECT u.id,u.display_name,u.created_at,om.role
      FROM organization_members om JOIN users u ON u.id=om.user_id WHERE om.organization_id=? ORDER BY om.role DESC,u.display_name`)
      .all(organizationId).map(member => ({ ...rowUser(member), role: member.role }));
    return { id: row.id, name: row.name, ownerUserId: row.owner_user_id, createdAt: row.created_at, members };
  }

  createEvent(userId, input) {
    const startAt = iso(input.startAt, '시작');
    const endAt = iso(input.endAt, '종료');
    if (endAt <= startAt) throw new Error('이벤트 종료는 시작 이후여야 합니다.');
    const categories = [...new Set(input.categoryIds || [])];
    if (!categories.length || categories.some(category => !CATEGORY_MAP.has(category))) throw new Error('이벤트 종목을 하나 이상 선택하세요.');
    if (input.organizationId) {
      const membership = this.db.prepare('SELECT 1 FROM organization_members WHERE organization_id=? AND user_id=?').get(input.organizationId, userId);
      if (!membership) throw new Error('소속된 조직의 이벤트만 만들 수 있습니다.');
    }
    const event = {
      id: id(), ownerUserId: userId, organizationId: input.organizationId || null,
      name: text(input.name, '이벤트 이름', 2, 60), description: String(input.description || '').trim().slice(0, 500),
      startAt, endAt, categoryIds: categories, createdAt: nowIso(),
    };
    this.db.exec('BEGIN');
    try {
      this.db.prepare('INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(event.id, userId, event.organizationId, event.name, event.description, startAt, endAt, JSON.stringify(categories), event.createdAt);
      this.db.prepare(`INSERT INTO event_members VALUES (?, ?, 'accepted', ?, ?, ?)`)
        .run(event.id, userId, userId, event.createdAt, event.createdAt);
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
    return event;
  }

  inviteToEvent(actorUserId, eventId, invitedUserId) {
    const event = this.db.prepare('SELECT * FROM events WHERE id=?').get(eventId);
    if (!event || event.owner_user_id !== actorUserId) throw new Error('이벤트 생성자만 초대할 수 있습니다.');
    this.getUser(invitedUserId);
    this.db.prepare(`INSERT INTO event_members VALUES (?, ?, 'invited', ?, ?, NULL)
      ON CONFLICT(event_id,user_id) DO UPDATE SET status=CASE WHEN status='accepted' THEN status ELSE 'invited' END`)
      .run(eventId, invitedUserId, actorUserId, nowIso());
    return this.getEvent(eventId, actorUserId);
  }

  acceptEvent(userId, eventId) {
    const result = this.db.prepare(`UPDATE event_members SET status='accepted',accepted_at=?
      WHERE event_id=? AND user_id=? AND status='invited'`).run(nowIso(), eventId, userId);
    if (!result.changes) throw new Error('수락할 초대가 없습니다.');
    return this.getEvent(eventId, userId);
  }

  getEvent(eventId, viewerUserId) {
    const row = this.db.prepare(`SELECT e.*,em.status member_status FROM events e
      LEFT JOIN event_members em ON em.event_id=e.id AND em.user_id=? WHERE e.id=?`).get(viewerUserId, eventId);
    if (!row) throw new Error('이벤트를 찾을 수 없습니다.');
    if (viewerUserId && !row.member_status && row.owner_user_id !== viewerUserId) throw new Error('이 이벤트의 초대 또는 참가 권한이 없습니다.');
    const members = this.db.prepare(`SELECT u.id,u.display_name,u.created_at,em.status
      FROM event_members em JOIN users u ON u.id=em.user_id WHERE em.event_id=? ORDER BY em.status,u.display_name`)
      .all(eventId).map(member => ({ ...rowUser(member), status: member.status }));
    return {
      id: row.id, ownerUserId: row.owner_user_id, organizationId: row.organization_id,
      name: row.name, description: row.description, startAt: row.start_at, endAt: row.end_at,
      categoryIds: JSON.parse(row.category_ids), createdAt: row.created_at, memberStatus: row.member_status, members,
    };
  }

  listContext(userId) {
    const organizations = this.db.prepare(`SELECT o.id,o.name,o.owner_user_id,o.created_at,om.role
      FROM organization_members om JOIN organizations o ON o.id=om.organization_id WHERE om.user_id=? ORDER BY o.name`)
      .all(userId).map(row => ({ id: row.id, name: row.name, ownerUserId: row.owner_user_id, role: row.role, createdAt: row.created_at }));
    const eventIds = this.db.prepare('SELECT event_id FROM event_members WHERE user_id=? ORDER BY created_at DESC').all(userId);
    return { user: this.getUser(userId), organizations, events: eventIds.map(row => this.getEvent(row.event_id, userId)), categories: CATEGORIES };
  }

  submitAttempt(userId, input) {
    const category = CATEGORY_MAP.get(input.category);
    if (!category) throw new Error('지원하지 않는 랭킹 종목입니다.');
    const occurredAt = input.occurredAt ? iso(input.occurredAt, '기록') : nowIso();
    if (new Date(occurredAt).getTime() > Date.now() + 5 * 60_000) throw new Error('미래 시각의 기록은 제출할 수 없습니다.');
    const values = {
      score: finite(input.score, '점수', { max: 100_000_000 }),
      speed: finite(input.speed, '타수', { max: 5000 }),
      accuracy: finite(input.accuracy, '정확도', { max: 100 }),
      elapsedMs: finite(input.elapsedMs, '소요 시간', { max: 86_400_000 }),
    };
    if (values[category.metric] == null) throw new Error(`${category.label} 순위에 필요한 ${category.metric} 값이 없습니다.`);
    if (category.game.startsWith('hancom') && category.metric === 'speed' && values.accuracy == null) throw new Error('타자 순위에는 정확도가 필요합니다.');
    if (input.eventId) {
      const event = this.getEvent(input.eventId, userId);
      if (event.memberStatus !== 'accepted') throw new Error('이벤트 참가자만 이벤트 기록을 제출할 수 있습니다.');
      if (!event.categoryIds.includes(category.id)) throw new Error('이 이벤트에 포함되지 않은 종목입니다.');
      if (occurredAt < event.startAt || occurredAt > event.endAt) throw new Error('이벤트 기간 밖의 기록입니다.');
    }
    const attempt = {
      id: id(), userId, eventId: input.eventId || null, game: category.game, category: category.id,
      ...values, occurredAt, source: text(input.source || 'web-client', '기록 출처', 2, 40),
      integrity: 'client-claimed',
      clientAttemptId: input.clientAttemptId ? String(input.clientAttemptId).slice(0, 80) : null,
      createdAt: nowIso(),
    };
    try {
      this.db.prepare(`INSERT INTO attempts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(attempt.id, userId, attempt.eventId, attempt.game, attempt.category, attempt.score, attempt.speed,
          attempt.accuracy, attempt.elapsedMs, attempt.occurredAt, attempt.source, attempt.integrity,
          attempt.clientAttemptId, attempt.createdAt);
    } catch (error) {
      if (attempt.clientAttemptId && String(error).includes('UNIQUE')) {
        return this.db.prepare('SELECT * FROM attempts WHERE user_id=? AND client_attempt_id=?').get(userId, attempt.clientAttemptId);
      }
      throw error;
    }
    return attempt;
  }

  saveRecordSnapshot(userId, game, snapshot) {
    if (!['hancom97', 'hancom2007'].includes(game)) throw new Error('지원하지 않는 원본 기록 종류입니다.');
    validateHancomSnapshot(game, snapshot);
    const json = JSON.stringify(snapshot);
    const maxSnapshotBytes = game === 'hancom2007' ? 2 * 1024 * 1024 : 256 * 1024;
    if (Buffer.byteLength(json) > maxSnapshotBytes) throw new Error('원본 기록 스냅샷이 너무 큽니다.');
    const hash = crypto.createHash('sha256').update(json).digest('hex');
    const capturedAt = iso(snapshot?.capturedAt || nowIso(), '기록 캡처');
    this.db.prepare(`INSERT INTO raw_record_snapshots VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id,game) DO UPDATE SET snapshot_json=excluded.snapshot_json,snapshot_sha256=excluded.snapshot_sha256,
      captured_at=excluded.captured_at,created_at=excluded.created_at`)
      .run(id(), userId, game, json, hash, capturedAt, nowIso());
    return { game, sha256: hash, capturedAt };
  }

  getRecordSnapshot(userId, game) {
    const row = this.db.prepare('SELECT snapshot_json FROM raw_record_snapshots WHERE user_id=? AND game=?').get(userId, game);
    return row ? JSON.parse(row.snapshot_json) : null;
  }

  rankings({ category: categoryId, scope = 'global', scopeId, period = 'all', from, to, limit = 100 }) {
    const category = CATEGORY_MAP.get(categoryId);
    if (!category) throw new Error('지원하지 않는 랭킹 종목입니다.');
    const start = periodStart(period, from);
    const end = to ? iso(to, '종료') : null;
    let rows = this.db.prepare(`SELECT a.*,u.display_name FROM attempts a JOIN users u ON u.id=a.user_id
      WHERE a.category=? ORDER BY a.occurred_at DESC`).all(categoryId);
    if (start) rows = rows.filter(row => row.occurred_at >= start);
    if (end) rows = rows.filter(row => row.occurred_at <= end);
    if (scope === 'event') rows = rows.filter(row => row.event_id === scopeId);
    if (scope === 'organization') {
      const memberIds = new Set(this.db.prepare('SELECT user_id FROM organization_members WHERE organization_id=?').all(scopeId).map(row => row.user_id));
      rows = rows.filter(row => memberIds.has(row.user_id));
    }
    if (!['global', 'organization', 'organizations', 'event'].includes(scope)) throw new Error('지원하지 않는 랭킹 범위입니다.');

    const better = (a, b) => category.direction === 'asc' ? a < b : a > b;
    const bestByUser = new Map();
    for (const row of rows) {
      const value = row[category.metric === 'elapsedMs' ? 'elapsed_ms' : category.metric];
      const current = bestByUser.get(row.user_id);
      if (!current || better(value, current.value) || value === current.value && (row.accuracy || 0) > (current.row.accuracy || 0)) {
        bestByUser.set(row.user_id, { value, row });
      }
    }

    if (scope === 'organizations') {
      const memberships = this.db.prepare(`SELECT om.user_id,o.id,o.name FROM organization_members om
        JOIN organizations o ON o.id=om.organization_id`).all();
      const groups = new Map();
      for (const membership of memberships) {
        const best = bestByUser.get(membership.user_id);
        if (!best) continue;
        const group = groups.get(membership.id) || { id: membership.id, name: membership.name, values: [] };
        group.values.push(best.value); groups.set(membership.id, group);
      }
      const entries = [...groups.values()].map(group => {
        const top = group.values.sort((a, b) => category.direction === 'asc' ? a - b : b - a).slice(0, 5);
        return { organizationId: group.id, displayName: group.name, value: top.reduce((sum, value) => sum + value, 0) / top.length, participantCount: group.values.length };
      }).sort((a, b) => category.direction === 'asc' ? a.value - b.value : b.value - a.value).slice(0, Math.min(Number(limit) || 100, 200));
      return { category, scope, period, aggregation: '조직별 상위 5명 평균', entries: entries.map((entry, index) => ({ rank: index + 1, ...entry })) };
    }

    const entries = [...bestByUser.values()].sort((a, b) => {
      const primary = category.direction === 'asc' ? a.value - b.value : b.value - a.value;
      return primary || (b.row.accuracy || 0) - (a.row.accuracy || 0) || a.row.occurred_at.localeCompare(b.row.occurred_at);
    }).slice(0, Math.min(Number(limit) || 100, 200)).map((entry, index) => ({
      rank: index + 1, userId: entry.row.user_id, displayName: entry.row.display_name,
      value: entry.value, accuracy: entry.row.accuracy, score: entry.row.score, speed: entry.row.speed,
      elapsedMs: entry.row.elapsed_ms, occurredAt: entry.row.occurred_at, integrity: entry.row.integrity,
    }));
    return { category, scope, period, entries };
  }
}
