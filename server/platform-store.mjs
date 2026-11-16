import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

// Default Mock Users for External Development & Testing (as requested in prompt)
export const MOCK_USERS = Object.freeze([
  { id: 'emp-001', name: '김성민', departmentId: 'dept-auto', departmentName: '자동화운영팀' },
  { id: 'emp-002', name: '이지훈', departmentId: 'dept-infra', departmentName: '인프라팀' },
  { id: 'emp-003', name: '박수진', departmentId: 'dept-dev', departmentName: '개발팀' },
  { id: 'emp-004', name: '최민호', departmentId: 'dept-auto', departmentName: '자동화운영팀' },
  { id: 'emp-005', name: '정하늘', departmentId: 'dept-plan', departmentName: '기획팀' },
  { id: 'emp-006', name: '한지우', departmentId: 'dept-dev', departmentName: '개발팀' },
  { id: 'emp-007', name: '송유진', departmentId: 'dept-infra', departmentName: '인프라팀' },
  { id: 'emp-008', name: '강도윤', departmentId: 'dept-plan', departmentName: '기획팀' },
]);

export const DEFAULT_EVENT_POINTS = Object.freeze({
  1: 100,
  2: 70,
  3: 50,
  participation: 10,
});

export const GAME_REGISTRY_META = Object.freeze([
  { id: 'roulette', name: '마블 룰렛', nameEn: 'Marble Roulette', category: 'draw', metric: 'score', direction: 'desc', unit: '회', minPlayers: 1, maxPlayers: 100, supportsBot: false, supportsOnline: false, supportsSolo: true },
  { id: 'reaction', name: '순발력 대결', nameEn: 'Reaction Battle', category: 'speed', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'speedtyping', name: '스피드 타이핑', nameEn: 'Speed Typing', category: 'speed', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'colormatch', name: '컬러 매치', nameEn: 'Color Match', category: 'speed', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'tictactoe', name: '틱택토', nameEn: 'Tic Tac Toe', category: 'strategy', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 2, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'memorymatch', name: '기억력 대결', nameEn: 'Memory Match', category: 'strategy', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'simonsays', name: '사이먼 세이즈', nameEn: 'Simon Says', category: 'strategy', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'wordchain', name: '끝말잇기 (영단어)', nameEn: 'Word Chain', category: 'word', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'anagram', name: '아나그램 스프린트', nameEn: 'Anagram Sprint', category: 'word', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'mathduel', name: '수학 대결', nameEn: 'Math Duel', category: 'math', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'numberhunt', name: '넘버 헌트', nameEn: 'Number Hunt', category: 'math', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'rpsarena', name: '가위바위보 아레나', nameEn: 'RPS Arena', category: 'classic', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 2, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'trivia', name: '스피드 퀴즈', nameEn: 'Trivia Challenge', category: 'trivia', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'connectfour', name: '사목 (Connect Four)', nameEn: 'Connect Four', category: 'strategy', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 2, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'higherlower', name: '하이 로우', nameEn: 'Higher or Lower', category: 'speed', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 2, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'oddoneout', name: '다른 그림 찾기', nameEn: 'Odd One Out', category: 'strategy', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 2, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'snakeduel', name: '스네이크 듀얼', nameEn: 'Snake Duel', category: 'arcade', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 2, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'bomberman', name: '봄버맨 아레나', nameEn: 'Bomberman', category: 'arcade', metric: 'score', direction: 'desc', unit: '점', minPlayers: 2, maxPlayers: 4, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'bombergirl', name: '봄버걸 클래식', nameEn: 'HTML5 Bombergirl', category: 'arcade', metric: 'score', direction: 'desc', unit: '점', minPlayers: 1, maxPlayers: 2, supportsBot: true, supportsOnline: true, supportsSolo: true },
  { id: 'drawing', name: '캐치마인드 (그림 맞추기)', nameEn: 'Doodle Dash', category: 'party', metric: 'score', direction: 'desc', unit: '점', minPlayers: 3, maxPlayers: 8, supportsBot: true, supportsOnline: true, supportsSolo: true },
]);

const GAME_MAP = new Map(GAME_REGISTRY_META.map(g => [g.id, g]));
const nowIso = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

/**
 * Adapter to normalize raw corporate API user payload into standard GameUser
 * @param {any} raw
 * @returns {{ id: string, name: string, departmentId: string, departmentName: string } | null}
 */
export function adaptExternalUser(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || raw.userId || raw.empNo || raw.subject || '').trim();
  const name = String(raw.name || raw.userName || raw.displayName || raw.nickname || '').trim();
  const org = Array.isArray(raw.organizations) && raw.organizations[0] ? raw.organizations[0] : raw.organization || {};
  const departmentId = String(raw.departmentId || raw.deptId || org.id || org.subject || 'dept-general').trim();
  const departmentName = String(raw.departmentName || raw.deptName || org.name || '사내공통').trim();
  if (!id || !name) return null;
  return { id, name, departmentId, departmentName };
}

export class PlatformStore {
  constructor(databasePath = ':memory:') {
    if (databasePath !== ':memory:') fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    this.db = new DatabaseSync(databasePath);
    this.db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS platform_users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department_id TEXT NOT NULL,
        department_name TEXT NOT NULL,
        is_mock INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS platform_matches (
        id TEXT PRIMARY KEY,
        game_id TEXT NOT NULL,
        mode TEXT NOT NULL CHECK(mode IN ('solo', 'bot', 'online')),
        has_bots INTEGER NOT NULL DEFAULT 0,
        is_official INTEGER NOT NULL DEFAULT 0,
        room_code TEXT,
        event_id TEXT,
        winner_user_id TEXT,
        is_tie INTEGER NOT NULL DEFAULT 0,
        duration_ms INTEGER NOT NULL DEFAULT 0,
        occurred_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS platform_match_participants (
        match_id TEXT NOT NULL REFERENCES platform_matches(id) ON DELETE CASCADE,
        participant_id TEXT NOT NULL,
        user_id TEXT REFERENCES platform_users(id) ON DELETE SET NULL,
        display_name TEXT NOT NULL,
        department_id TEXT,
        department_name TEXT,
        is_bot INTEGER NOT NULL DEFAULT 0,
        bot_difficulty TEXT,
        rank INTEGER NOT NULL,
        score REAL NOT NULL DEFAULT 0,
        outcome TEXT NOT NULL CHECK(outcome IN ('win', 'loss', 'tie', 'completed')),
        metric_value REAL,
        event_points INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (match_id, participant_id)
      );

      CREATE TABLE IF NOT EXISTS platform_event_groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        creator_user_id TEXT NOT NULL REFERENCES platform_users(id),
        game_ids_json TEXT NOT NULL,
        point_policy_json TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('active', 'ended')) DEFAULT 'active',
        start_at TEXT NOT NULL,
        end_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS platform_event_participants (
        event_id TEXT NOT NULL REFERENCES platform_event_groups(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
        joined_at TEXT NOT NULL,
        PRIMARY KEY (event_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS platform_roulette_history (
        id TEXT PRIMARY KEY,
        host_user_id TEXT NOT NULL REFERENCES platform_users(id),
        title TEXT NOT NULL,
        map_title TEXT NOT NULL,
        winner_type TEXT NOT NULL,
        participants_json TEXT NOT NULL,
        winners_json TEXT NOT NULL,
        occurred_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS platform_roulette_presets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES platform_users(id),
        title TEXT NOT NULL,
        participants_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_platform_matches_game ON platform_matches(game_id, is_official, occurred_at DESC);
      CREATE INDEX IF NOT EXISTS idx_platform_matches_event ON platform_matches(event_id, is_official);
      CREATE INDEX IF NOT EXISTS idx_platform_mp_user ON platform_match_participants(user_id, is_bot);
    `);

    this.seedMockUsers();
  }

  close() {
    this.db.close();
  }

  seedMockUsers() {
    const now = nowIso();
    const stmt = this.db.prepare(`
      INSERT INTO platform_users (id, name, department_id, department_name, is_mock, updated_at)
      VALUES (?, ?, ?, ?, 1, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        department_id = excluded.department_id,
        department_name = excluded.department_name,
        updated_at = excluded.updated_at
    `);
    for (const u of MOCK_USERS) {
      stmt.run(u.id, u.name, u.departmentId, u.departmentName, now);
    }
  }

  upsertUser(rawUser, isMock = false) {
    const adapted = adaptExternalUser(rawUser);
    if (!adapted) throw new Error('유효하지 않은 사용자 정보입니다.');
    const now = nowIso();
    this.db.prepare(`
      INSERT INTO platform_users (id, name, department_id, department_name, is_mock, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        department_id = excluded.department_id,
        department_name = excluded.department_name,
        updated_at = excluded.updated_at
    `).run(adapted.id, adapted.name, adapted.departmentId, adapted.departmentName, isMock ? 1 : 0, now);
    return this.getUser(adapted.id);
  }

  getUser(userId) {
    if (!userId) return null;
    const row = this.db.prepare('SELECT * FROM platform_users WHERE id = ?').get(userId);
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      departmentId: row.department_id,
      departmentName: row.department_name,
    };
  }

  listUsers({ departmentId = null, query = '' } = {}) {
    let sql = 'SELECT * FROM platform_users WHERE 1=1';
    const params = [];
    if (departmentId) {
      sql += ' AND department_id = ?';
      params.push(departmentId);
    }
    if (query && query.trim()) {
      sql += ' AND (name LIKE ? OR department_name LIKE ?)';
      const q = `%${query.trim()}%`;
      params.push(q, q);
    }
    sql += ' ORDER BY department_name ASC, name ASC';
    return this.db.prepare(sql).all(...params).map(row => ({
      id: row.id,
      name: row.name,
      departmentId: row.department_id,
      departmentName: row.department_name,
    }));
  }

  listDepartments() {
    const rows = this.db.prepare(`
      SELECT department_id, department_name, COUNT(*) as member_count
      FROM platform_users
      GROUP BY department_id, department_name
      ORDER BY department_name ASC
    `).all();
    return rows.map(r => ({
      id: r.department_id,
      name: r.department_name,
      memberCount: r.member_count,
    }));
  }

  // ─── Event Groups ─────────────────────────────────────────────────────────────
  createEventGroup(creatorUserId, input) {
    const creator = this.getUser(creatorUserId);
    if (!creator) throw new Error('생성자 정보를 찾을 수 없습니다.');
    const name = String(input?.name || '').trim();
    if (name.length < 2 || name.length > 80) throw new Error('이벤트 그룹 이름은 2~80자로 입력하세요.');
    const description = String(input?.description || '').trim().slice(0, 500);
    const gameIds = Array.isArray(input?.gameIds) && input.gameIds.length
      ? [...new Set(input.gameIds.filter(id => GAME_MAP.has(id)))]
      : GAME_REGISTRY_META.filter(g => g.id !== 'roulette').map(g => g.id);
    if (!gameIds.length) throw new Error('이벤트에 포함할 게임을 최소 1개 이상 선택하세요.');

    const participantIds = new Set([creator.id]);
    if (Array.isArray(input?.participantIds)) {
      for (const pid of input.participantIds) {
        if (this.getUser(pid)) participantIds.add(pid);
      }
    }

    const pointPolicy = {
      ...DEFAULT_EVENT_POINTS,
      ...(input?.pointPolicy && typeof input.pointPolicy === 'object' ? input.pointPolicy : {}),
    };

    const now = nowIso();
    const startAt = input?.startAt ? new Date(input.startAt).toISOString() : new Date(Date.now() - 60000).toISOString();
    const endAt = input?.endAt ? new Date(input.endAt).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString();
    const id = `evt-${uuid().slice(0, 8)}`;

    this.db.exec('BEGIN');
    try {
      this.db.prepare(`
        INSERT INTO platform_event_groups (id, name, description, creator_user_id, game_ids_json, point_policy_json, status, start_at, end_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
      `).run(id, name, description, creator.id, JSON.stringify(gameIds), JSON.stringify(pointPolicy), startAt, endAt, now);

      const pStmt = this.db.prepare(`
        INSERT INTO platform_event_participants (event_id, user_id, joined_at)
        VALUES (?, ?, ?)
      `);
      for (const uid of participantIds) {
        pStmt.run(id, uid, now);
      }
      this.db.exec('COMMIT');
    } catch (e) {
      this.db.exec('ROLLBACK');
      throw e;
    }

    return this.getEventGroup(id);
  }

  updateEventGroupStatus(actorUserId, eventId, status) {
    const evt = this.getEventGroup(eventId);
    if (!evt) throw new Error('이벤트 그룹을 찾을 수 없습니다.');
    if (!['active', 'ended'].includes(status)) throw new Error('올바르지 않은 상태입니다.');
    this.db.prepare('UPDATE platform_event_groups SET status = ? WHERE id = ?').run(status, eventId);
    return this.getEventGroup(eventId);
  }

  addEventParticipant(eventId, userId) {
    const evt = this.getEventGroup(eventId);
    if (!evt) throw new Error('이벤트 그룹을 찾을 수 없습니다.');
    const user = this.getUser(userId);
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    this.db.prepare(`
      INSERT INTO platform_event_participants (event_id, user_id, joined_at)
      VALUES (?, ?, ?)
      ON CONFLICT(event_id, user_id) DO NOTHING
    `).run(eventId, userId, nowIso());
    return this.getEventGroup(eventId);
  }

  getEventGroup(eventId) {
    const row = this.db.prepare(`
      SELECT e.*, u.name as creator_name, u.department_name as creator_dept
      FROM platform_event_groups e
      JOIN platform_users u ON u.id = e.creator_user_id
      WHERE e.id = ?
    `).get(eventId);
    if (!row) return null;

    const participants = this.db.prepare(`
      SELECT u.id, u.name, u.department_id, u.department_name, ep.joined_at
      FROM platform_event_participants ep
      JOIN platform_users u ON u.id = ep.user_id
      WHERE ep.event_id = ?
      ORDER BY u.department_name ASC, u.name ASC
    `).all(eventId).map(p => ({
      id: p.id,
      name: p.name,
      departmentId: p.department_id,
      departmentName: p.department_name,
      joinedAt: p.joined_at,
    }));

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      creatorUserId: row.creator_user_id,
      creatorName: row.creator_name,
      creatorDepartmentName: row.creator_dept,
      gameIds: JSON.parse(row.game_ids_json),
      pointPolicy: JSON.parse(row.point_policy_json),
      status: row.status,
      startAt: row.start_at,
      endAt: row.end_at,
      createdAt: row.created_at,
      participants,
    };
  }

  listEventGroups() {
    const rows = this.db.prepare('SELECT id FROM platform_event_groups ORDER BY created_at DESC').all();
    return rows.map(r => this.getEventGroup(r.id));
  }

  // ─── Match Recording & Rankings ───────────────────────────────────────────────
  recordMatchResult(input) {
    const game = GAME_MAP.get(input?.gameId);
    if (!game) throw new Error(`지원하지 않는 게임입니다: ${input?.gameId}`);
    const mode = ['solo', 'bot', 'online'].includes(input?.mode) ? input.mode : 'bot';
    const rawParticipants = Array.isArray(input?.participants) ? input.participants : [];
    if (!rawParticipants.length) throw new Error('참가자 정보가 없습니다.');

    const hasBots = rawParticipants.some(p => !!p.isBot);
    const humanCount = rawParticipants.filter(p => !p.isBot && p.userId).length;
    // Official competitive ranking excludes BOT/practice matches unless explicitly online human vs human (or solo speed/record if no bots and allowed, but prompt says: "BOT과의 대전 결과는 기본적으로 연습 기록으로 분류하며, 공식 사내 경쟁 랭킹에는 합산하지 마세요." and "연습 모드나 BOT 상대 기록은 공식 이벤트 점수에 반영하지 않습니다.")
    const isOfficial = mode === 'online' && !hasBots && humanCount >= 2;

    const eventId = input?.eventId || null;
    let eventGroup = null;
    if (eventId) {
      eventGroup = this.getEventGroup(eventId);
    }

    const sorted = [...rawParticipants].sort((a, b) => (b.score || 0) - (a.score || 0));
    const topScore = sorted[0]?.score ?? 0;
    const winners = sorted.filter(p => (p.score || 0) === topScore);
    const isTie = sorted.length > 1 && winners.length > 1;
    const winnerUserId = !isTie && !winners[0]?.isBot ? (winners[0]?.userId || null) : null;

    const matchId = `match-${uuid()}`;
    const occurredAt = nowIso();
    const durationMs = Math.max(0, Number(input?.durationMs) || 0);

    // Assign ranks (1-based, ties share rank)
    let currentRank = 1;
    const rankedParticipants = sorted.map((p, idx) => {
      if (idx > 0 && (p.score || 0) < (sorted[idx - 1].score || 0)) {
        currentRank = idx + 1;
      }
      let outcome = 'completed';
      if (sorted.length > 1) {
        if (isTie && (p.score || 0) === topScore) outcome = 'tie';
        else if (currentRank === 1) outcome = 'win';
        else outcome = 'loss';
      }

      const userObj = !p.isBot && p.userId ? this.getUser(p.userId) : null;
      let eventPoints = 0;
      if (isOfficial && eventGroup && eventGroup.status === 'active' && eventGroup.gameIds.includes(game.id) && userObj) {
        const isEventMember = eventGroup.participants.some(ep => ep.id === userObj.id);
        if (isEventMember) {
          const policy = eventGroup.pointPolicy || DEFAULT_EVENT_POINTS;
          eventPoints = Number(policy[currentRank] ?? policy.participation ?? 10);
        }
      }

      return {
        participantId: p.isBot ? `bot:${p.id || p.name || idx}` : `user:${userObj?.id || p.userId || idx}`,
        userId: userObj ? userObj.id : null,
        displayName: userObj ? userObj.name : String(p.name || `BOT ${idx + 1}`),
        departmentId: userObj ? userObj.departmentId : null,
        departmentName: userObj ? userObj.departmentName : null,
        isBot: p.isBot ? 1 : 0,
        botDifficulty: p.isBot ? (p.botDifficulty || 'normal') : null,
        rank: currentRank,
        score: Number(p.score) || 0,
        outcome,
        metricValue: p.metricValue != null ? Number(p.metricValue) : (Number(p.score) || 0),
        eventPoints,
      };
    });

    this.db.exec('BEGIN');
    try {
      this.db.prepare(`
        INSERT INTO platform_matches (id, game_id, mode, has_bots, is_official, room_code, event_id, winner_user_id, is_tie, duration_ms, occurred_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        matchId,
        game.id,
        mode,
        hasBots ? 1 : 0,
        isOfficial ? 1 : 0,
        input?.roomCode || null,
        eventGroup ? eventGroup.id : null,
        winnerUserId,
        isTie ? 1 : 0,
        durationMs,
        occurredAt
      );

      const mpStmt = this.db.prepare(`
        INSERT INTO platform_match_participants (
          match_id, participant_id, user_id, display_name, department_id, department_name,
          is_bot, bot_difficulty, rank, score, outcome, metric_value, event_points
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const rp of rankedParticipants) {
        mpStmt.run(
          matchId,
          rp.participantId,
          rp.userId,
          rp.displayName,
          rp.departmentId,
          rp.departmentName,
          rp.isBot,
          rp.botDifficulty,
          rp.rank,
          rp.score,
          rp.outcome,
          rp.metricValue,
          rp.eventPoints
        );
      }
      this.db.exec('COMMIT');
    } catch (e) {
      this.db.exec('ROLLBACK');
      throw e;
    }

    return {
      matchId,
      gameId: game.id,
      mode,
      hasBots,
      isOfficial,
      eventId: eventGroup ? eventGroup.id : null,
      winnerUserId,
      isTie,
      occurredAt,
      participants: rankedParticipants,
    };
  }

  getRankings({ gameId = null, includePractice = false, departmentId = null, limit = 50 } = {}) {
    // Aggregate official rankings by userId (excluding BOTs)
    let where = 'WHERE mp.is_bot = 0 AND mp.user_id IS NOT NULL';
    const params = [];
    if (!includePractice) {
      where += ' AND m.is_official = 1';
    }
    if (gameId) {
      where += ' AND m.game_id = ?';
      params.push(gameId);
    }
    if (departmentId) {
      where += ' AND u.department_id = ?';
      params.push(departmentId);
    }

    const rows = this.db.prepare(`
      SELECT
        u.id as user_id,
        u.name as user_name,
        u.department_id,
        u.department_name,
        COUNT(mp.match_id) as matches_played,
        SUM(CASE WHEN mp.outcome = 'win' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN mp.outcome = 'loss' THEN 1 ELSE 0 END) as losses,
        SUM(CASE WHEN mp.outcome = 'tie' THEN 1 ELSE 0 END) as ties,
        MAX(mp.score) as best_score,
        SUM(mp.score) as total_score,
        MAX(m.occurred_at) as last_played_at
      FROM platform_match_participants mp
      JOIN platform_matches m ON m.id = mp.match_id
      JOIN platform_users u ON u.id = mp.user_id
      ${where}
      GROUP BY u.id, u.name, u.department_id, u.department_name
      ORDER BY wins DESC, best_score DESC, total_score DESC
      LIMIT ?
    `).all(...params, Math.min(Number(limit) || 50, 200));

    return rows.map((r, idx) => ({
      rank: idx + 1,
      userId: r.user_id,
      name: r.user_name,
      departmentId: r.department_id,
      departmentName: r.department_name,
      matchesPlayed: r.matches_played,
      wins: r.wins,
      losses: r.losses,
      ties: r.ties,
      winRate: r.matches_played > 0 ? Math.round((r.wins / r.matches_played) * 100) : 0,
      bestScore: r.best_score,
      totalScore: r.total_score,
      lastPlayedAt: r.last_played_at,
    }));
  }

  getDepartmentRankings({ gameId = null, includePractice = false } = {}) {
    let where = 'WHERE mp.is_bot = 0 AND mp.user_id IS NOT NULL';
    const params = [];
    if (!includePractice) {
      where += ' AND m.is_official = 1';
    }
    if (gameId) {
      where += ' AND m.game_id = ?';
      params.push(gameId);
    }

    const rows = this.db.prepare(`
      SELECT
        u.department_id,
        u.department_name,
        COUNT(DISTINCT u.id) as active_members,
        COUNT(mp.match_id) as matches_played,
        SUM(CASE WHEN mp.outcome = 'win' THEN 1 ELSE 0 END) as total_wins,
        SUM(mp.score) as total_score,
        SUM(mp.event_points) as total_event_points
      FROM platform_match_participants mp
      JOIN platform_matches m ON m.id = mp.match_id
      JOIN platform_users u ON u.id = mp.user_id
      ${where}
      GROUP BY u.department_id, u.department_name
      ORDER BY total_wins DESC, total_score DESC
    `).all(...params);

    return rows.map((r, idx) => ({
      rank: idx + 1,
      departmentId: r.department_id,
      departmentName: r.department_name,
      activeMembers: r.active_members,
      activePlayers: r.active_members,
      matchesPlayed: r.matches_played,
      totalWins: r.total_wins,
      wins: r.total_wins,
      totalScore: r.total_score,
      totalEventPoints: r.total_event_points,
    }));
  }

  getEventRankings(eventId) {
    const evt = this.getEventGroup(eventId);
    if (!evt) throw new Error('이벤트 그룹을 찾을 수 없습니다.');

    const rows = this.db.prepare(`
      SELECT
        u.id as user_id,
        u.name as user_name,
        u.department_id,
        u.department_name,
        SUM(CASE WHEN m.id IS NOT NULL THEN 1 ELSE 0 END) as matches_played,
        SUM(CASE WHEN m.id IS NOT NULL AND mp.outcome = 'win' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN m.id IS NOT NULL AND mp.outcome = 'loss' THEN 1 ELSE 0 END) as losses,
        SUM(CASE WHEN m.id IS NOT NULL THEN mp.event_points ELSE 0 END) as event_points,
        SUM(CASE WHEN m.id IS NOT NULL THEN mp.score ELSE 0 END) as total_game_score
      FROM platform_event_participants ep
      JOIN platform_users u ON u.id = ep.user_id
      LEFT JOIN platform_match_participants mp ON mp.user_id = u.id AND mp.is_bot = 0
      LEFT JOIN platform_matches m ON m.id = mp.match_id AND m.event_id = ep.event_id AND m.is_official = 1
      WHERE ep.event_id = ?
      GROUP BY u.id, u.name, u.department_id, u.department_name
      ORDER BY COALESCE(SUM(CASE WHEN m.id IS NOT NULL THEN mp.event_points ELSE 0 END), 0) DESC,
               COALESCE(SUM(CASE WHEN m.id IS NOT NULL AND mp.outcome = 'win' THEN 1 ELSE 0 END), 0) DESC,
               u.name ASC
    `).all(eventId);

    const individual = rows.map((r, idx) => ({
      rank: idx + 1,
      userId: r.user_id,
      name: r.user_name,
      departmentId: r.department_id,
      departmentName: r.department_name,
      matchesPlayed: r.matches_played || 0,
      wins: r.wins || 0,
      losses: r.losses || 0,
      eventPoints: r.event_points || 0,
      totalGameScore: r.total_game_score || 0,
    }));

    // Department aggregation within event
    const deptMap = new Map();
    for (const item of individual) {
      const d = deptMap.get(item.departmentId) || {
        departmentId: item.departmentId,
        departmentName: item.departmentName,
        memberCount: 0,
        eventPoints: 0,
        wins: 0,
      };
      d.memberCount += 1;
      d.eventPoints += item.eventPoints;
      d.wins += item.wins;
      deptMap.set(item.departmentId, d);
    }
    const departments = [...deptMap.values()]
      .sort((a, b) => b.eventPoints - a.eventPoints || b.wins - a.wins)
      .map((d, idx) => ({ rank: idx + 1, ...d }));

    return {
      event: evt,
      individual,
      departments,
      standings: individual,
      departmentStandings: departments,
    };
  }

  getUserStats(userId) {
    const user = this.getUser(userId);
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');

    const byGame = this.db.prepare(`
      SELECT
        m.game_id,
        m.is_official,
        COUNT(mp.match_id) as played,
        SUM(CASE WHEN mp.outcome = 'win' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN mp.outcome = 'loss' THEN 1 ELSE 0 END) as losses,
        SUM(CASE WHEN mp.outcome = 'tie' THEN 1 ELSE 0 END) as ties,
        MAX(mp.score) as best_score,
        MAX(m.occurred_at) as last_played_at
      FROM platform_match_participants mp
      JOIN platform_matches m ON m.id = mp.match_id
      WHERE mp.user_id = ? AND mp.is_bot = 0
      GROUP BY m.game_id, m.is_official
    `).all(userId);

    const recentMatches = this.db.prepare(`
      SELECT
        m.id as match_id,
        m.game_id,
        m.mode,
        m.has_bots,
        m.is_official,
        m.event_id,
        m.occurred_at,
        mp.rank,
        mp.score,
        mp.outcome,
        mp.event_points
      FROM platform_match_participants mp
      JOIN platform_matches m ON m.id = mp.match_id
      WHERE mp.user_id = ? AND mp.is_bot = 0
      ORDER BY m.occurred_at DESC
      LIMIT 30
    `).all(userId);

    return {
      user,
      byGame,
      recentMatches,
    };
  }

  // ─── Marble Roulette History & Presets ─────────────────────────────────────────
  recordRouletteDraw(hostUserId, input) {
    const host = this.getUser(hostUserId);
    if (!host) throw new Error('진행자 정보를 찾을 수 없습니다.');
    const participants = Array.isArray(input?.participants) ? input.participants : [];
    const winners = Array.isArray(input?.winners) ? input.winners : [];
    if (!participants.length || !winners.length) throw new Error('참가자 및 당첨자 정보가 필요합니다.');

    const id = `rl-${uuid().slice(0, 8)}`;
    const occurredAt = nowIso();
    const title = String(input?.title || '사내 마블 룰렛 추첨').trim().slice(0, 100);
    const mapTitle = String(input?.mapTitle || '기본 맵').trim().slice(0, 80);
    const winnerType = String(input?.winnerType || 'first').trim().slice(0, 40);

    this.db.prepare(`
      INSERT INTO platform_roulette_history (id, host_user_id, title, map_title, winner_type, participants_json, winners_json, occurred_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, host.id, title, mapTitle, winnerType, JSON.stringify(participants), JSON.stringify(winners), occurredAt);

    return { id, hostUserId: host.id, hostName: host.name, title, mapTitle, winnerType, participants, winners, occurredAt };
  }

  listRouletteHistory(limit = 30) {
    const rows = this.db.prepare(`
      SELECT h.*, u.name as host_name, u.department_name as host_dept
      FROM platform_roulette_history h
      JOIN platform_users u ON u.id = h.host_user_id
      ORDER BY h.occurred_at DESC
      LIMIT ?
    `).all(Math.min(Number(limit) || 30, 100));

    return rows.map(r => ({
      id: r.id,
      hostUserId: r.host_user_id,
      hostName: r.host_name,
      hostDepartmentName: r.host_dept,
      title: r.title,
      mapTitle: r.map_title,
      winnerType: r.winner_type,
      participants: JSON.parse(r.participants_json),
      winners: JSON.parse(r.winners_json),
      occurredAt: r.occurred_at,
    }));
  }

  saveRoulettePreset(userId, input) {
    const user = this.getUser(userId);
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    const title = String(input?.title || '').trim();
    if (!title) throw new Error('프리셋 이름을 입력하세요.');
    const participants = Array.isArray(input?.participants) ? input.participants : [];
    if (!participants.length) throw new Error('저장할 참가자 명단이 비어 있습니다.');

    const id = input?.id || `preset-${uuid().slice(0, 8)}`;
    const updatedAt = nowIso();
    this.db.prepare(`
      INSERT INTO platform_roulette_presets (id, user_id, title, participants_json, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        participants_json = excluded.participants_json,
        updated_at = excluded.updated_at
    `).run(id, user.id, title.slice(0, 60), JSON.stringify(participants), updatedAt);

    return { id, userId: user.id, title, participants, updatedAt };
  }

  listRoulettePresets(userId = null) {
    const rows = userId
      ? this.db.prepare('SELECT * FROM platform_roulette_presets WHERE user_id = ? ORDER BY updated_at DESC').all(userId)
      : this.db.prepare('SELECT * FROM platform_roulette_presets ORDER BY updated_at DESC LIMIT 50').all();
    return rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      title: r.title,
      participants: JSON.parse(r.participants_json),
      updatedAt: r.updated_at,
    }));
  }
}
