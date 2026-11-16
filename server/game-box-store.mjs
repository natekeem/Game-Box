import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const nowIso = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

/**
 * Validated & documented ranking modes per game.
 * - Hancom 97 and Hanme 3.0 are never merged.
 * - Typing speed (타/분) and Game score (점) are never mixed in the same ranking table.
 */
export const GAME_RANKING_MODES = Object.freeze({
  'hancom-typing-97': [
    { modeId: 'position', label: '자리연습 (타수)', metric: 'typing_speed', unit: '타/분', direction: 'DESC', isRankingEligible: true },
    { modeId: 'word', label: '낱말연습 (타수)', metric: 'typing_speed', unit: '타/분', direction: 'DESC', isRankingEligible: true },
    { modeId: 'short', label: '짧은글 연습 (타수)', metric: 'typing_speed', unit: '타/분', direction: 'DESC', isRankingEligible: true },
    { modeId: 'long', label: '긴글 연습 (타수)', metric: 'typing_speed', unit: '타/분', direction: 'DESC', isRankingEligible: true },
    { modeId: 'acid-rain', label: '산성비 (최고 점수)', metric: 'score', unit: '점', direction: 'DESC', isRankingEligible: true },
    { modeId: 'invader', label: '침략자 (최고 점수)', metric: 'score', unit: '점', direction: 'DESC', isRankingEligible: true },
  ],
  'hanme-typing-30': [
    { modeId: 'venezia', label: '베네치아 게임 (최고 점수)', metric: 'score', unit: '점', direction: 'DESC', isRankingEligible: true },
    { modeId: 'short', label: '단문연습 (타수)', metric: 'typing_speed', unit: '타/분', direction: 'DESC', isRankingEligible: true },
    { modeId: 'long', label: '장문연습 (타수)', metric: 'typing_speed', unit: '타/분', direction: 'DESC', isRankingEligible: true },
    { modeId: 'position', label: '자리연습 (타수)', metric: 'typing_speed', unit: '타/분', direction: 'DESC', isRankingEligible: true },
    { modeId: 'word', label: '낱말연습 (타수)', metric: 'typing_speed', unit: '타/분', direction: 'DESC', isRankingEligible: true },
  ],
  'pikachu-volleyball': [
    { modeId: 'vs-computer', label: 'AI 대전 (승점/최고점)', metric: 'score', unit: '점', direction: 'DESC', isRankingEligible: true },
    { modeId: 'vs-computer-wins', label: 'AI 대전 (다승 순위)', metric: 'wins', unit: '승', direction: 'DESC', isRankingEligible: true },
  ],
});

/**
 * Sanitize and validate player nickname (2~16 chars, no HTML/script tags or control chars).
 */
export function validateNickname(raw) {
  if (typeof raw !== 'string') {
    throw new Error('닉네임을 문자열로 입력해주세요.');
  }
  const stripped = raw
    .replace(/[<>'"&`\\/\x00-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (stripped.length < 2 || stripped.length > 16) {
    throw new Error('닉네임은 특수문자(<, >, \', ", &, /, \\)를 제외한 2~16자로 입력해주세요.');
  }
  return stripped;
}

export function validateGuestId(raw) {
  const clean = String(raw || '').trim();
  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(clean)) {
    throw new Error('유효하지 않은 게스트 식별자(guestId) 형식입니다.');
  }
  return clean;
}

export class GameBoxStore {
  constructor(databasePath = ':memory:') {
    if (databasePath !== ':memory:') {
      fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    }
    this.db = new DatabaseSync(databasePath);
    this.db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
    this.initSchema();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS game_players (
        player_id TEXT PRIMARY KEY,
        identity_type TEXT NOT NULL DEFAULT 'guest' CHECK(identity_type IN ('guest', 'authenticated')),
        nickname TEXT NOT NULL,
        external_user_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS game_sessions (
        session_id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL REFERENCES game_players(player_id) ON DELETE CASCADE,
        game_id TEXT NOT NULL,
        game_mode TEXT NOT NULL DEFAULT 'general',
        status TEXT NOT NULL DEFAULT 'started' CHECK(status IN ('started', 'progress', 'completed', 'aborted')),
        started_at TEXT NOT NULL,
        ended_at TEXT,
        duration_ms INTEGER NOT NULL DEFAULT 0,
        last_event_type TEXT NOT NULL DEFAULT 'game:start',
        metadata_json TEXT NOT NULL DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS game_results (
        result_id TEXT PRIMARY KEY,
        session_id TEXT REFERENCES game_sessions(session_id) ON DELETE SET NULL,
        client_event_id TEXT NOT NULL,
        player_id TEXT NOT NULL REFERENCES game_players(player_id) ON DELETE CASCADE,
        game_id TEXT NOT NULL,
        game_mode TEXT NOT NULL,
        record_classification TEXT NOT NULL DEFAULT 'ranking' CHECK(record_classification IN ('ranking', 'practice')),
        score REAL,
        typing_speed REAL,
        accuracy REAL,
        error_count INTEGER,
        duration_ms INTEGER NOT NULL DEFAULT 0,
        outcome TEXT NOT NULL DEFAULT 'completed' CHECK(outcome IN ('win', 'lose', 'draw', 'completed', 'aborted')),
        opponent_type TEXT NOT NULL DEFAULT 'none',
        trust_level TEXT NOT NULL DEFAULT 'client-guest-telemetry',
        metadata_json TEXT NOT NULL DEFAULT '{}',
        recorded_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(player_id, client_event_id)
      );

      CREATE INDEX IF NOT EXISTS idx_game_results_ranking
        ON game_results(game_id, game_mode, record_classification, score DESC, typing_speed DESC);
      CREATE INDEX IF NOT EXISTS idx_game_results_player
        ON game_results(player_id, game_id, recorded_at DESC);
      CREATE INDEX IF NOT EXISTS idx_game_sessions_player
        ON game_sessions(player_id, started_at DESC);
    `);
  }

  close() {
    this.db.close();
  }

  /**
   * Register or retrieve a player by unique playerId (guestId or authenticated user ID).
   */
  upsertPlayer({ playerId, nickname, identityType = 'guest', externalUserId = null }) {
    const validId = validateGuestId(playerId);
    const existing = this.getPlayer(validId);
    const now = nowIso();

    if (existing) {
      if (nickname !== undefined && nickname !== null && String(nickname).trim() !== '') {
        const validNick = validateNickname(nickname);
        this.db.prepare(`
          UPDATE game_players
          SET nickname = ?, updated_at = ?
          WHERE player_id = ?
        `).run(validNick, now, validId);
      }
      return this.getPlayer(validId);
    }

    const validNick = validateNickname(nickname);
    const type = identityType === 'authenticated' ? 'authenticated' : 'guest';
    this.db.prepare(`
      INSERT INTO game_players (player_id, identity_type, nickname, external_user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(validId, type, validNick, externalUserId, now, now);

    return this.getPlayer(validId);
  }

  getPlayer(playerId) {
    if (!playerId) return null;
    const row = this.db.prepare('SELECT * FROM game_players WHERE player_id = ?').get(String(playerId));
    if (!row) return null;
    return {
      playerId: row.player_id,
      guestId: row.player_id,
      identityType: row.identity_type,
      nickname: row.nickname,
      externalUserId: row.external_user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  updateNickname(playerId, newNickname) {
    const validId = validateGuestId(playerId);
    const validNick = validateNickname(newNickname);
    const existing = this.getPlayer(validId);
    const now = nowIso();

    if (!existing) {
      this.db.prepare(`
        INSERT INTO game_players (player_id, identity_type, nickname, external_user_id, created_at, updated_at)
        VALUES (?, 'guest', ?, NULL, ?, ?)
      `).run(validId, validNick, now, now);
    } else {
      this.db.prepare(`
        UPDATE game_players
        SET nickname = ?, updated_at = ?
        WHERE player_id = ?
      `).run(validNick, now, validId);
    }
    return this.getPlayer(validId);
  }

  /**
   * Start or update a game session (game:start, game:progress, game:abort)
   */
  recordSessionEvent(payload = {}) {
    const playerId = validateGuestId(payload.playerId || payload.guestId);
    const player = this.getPlayer(playerId);
    if (!player) {
      throw new Error('등록된 플레이어 정보가 없습니다. 먼저 닉네임을 등록해주세요.');
    }

    const gameId = String(payload.gameId || '').trim();
    if (!gameId) throw new Error('gameId가 필요합니다.');

    const gameMode = String(payload.gameMode || 'general').trim();
    const eventType = String(payload.eventType || 'game:start').trim();
    const sessionId = payload.gameSessionId && /^[a-zA-Z0-9_-]{8,64}$/.test(payload.gameSessionId)
      ? payload.gameSessionId
      : uuid();
    const now = nowIso();
    const durationMs = Math.max(0, Math.min(86_400_000, Math.round(Number(payload.durationMs) || 0)));
    const metadataJson = JSON.stringify(payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {});

    const existing = this.db.prepare('SELECT * FROM game_sessions WHERE session_id = ?').get(sessionId);
    let status = 'started';
    if (eventType === 'game:progress') status = 'progress';
    else if (eventType === 'game:complete') status = 'completed';
    else if (eventType === 'game:abort') status = 'aborted';

    if (!existing) {
      this.db.prepare(`
        INSERT INTO game_sessions (
          session_id, player_id, game_id, game_mode, status,
          started_at, ended_at, duration_ms, last_event_type, metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        sessionId,
        playerId,
        gameId,
        gameMode,
        status,
        now,
        status === 'completed' || status === 'aborted' ? now : null,
        durationMs,
        eventType,
        metadataJson
      );
    } else {
      this.db.prepare(`
        UPDATE game_sessions
        SET game_mode = ?,
            status = ?,
            ended_at = CASE WHEN ? IN ('completed', 'aborted') THEN ? ELSE ended_at END,
            duration_ms = MAX(duration_ms, ?),
            last_event_type = ?,
            metadata_json = ?
        WHERE session_id = ?
      `).run(
        gameMode || existing.game_mode,
        status,
        status,
        now,
        durationMs,
        eventType,
        metadataJson,
        sessionId
      );
    }

    return {
      sessionId,
      playerId,
      gameId,
      gameMode,
      status,
      durationMs,
      updatedAt: now,
    };
  }

  /**
   * Record a completed or aborted game result (game:complete).
   * Enforces idempotency via (player_id, client_event_id) and validates bounds.
   */
  recordGameResult(payload = {}) {
    const playerId = validateGuestId(payload.playerId || payload.guestId);
    let player = this.getPlayer(playerId);
    if (!player && payload.nickname) {
      player = this.upsertPlayer({ playerId, nickname: payload.nickname });
    }
    if (!player) {
      throw new Error('등록된 플레이어 정보가 없습니다. 먼저 닉네임을 등록해주세요.');
    }

    const gameId = String(payload.gameId || '').trim();
    const allowedGames = new Set([
      'hancom-typing-97',
      'hanme-typing-30',
      'pikachu-volleyball',
    ]);
    if (!allowedGames.has(gameId)) {
      throw new Error(`지원하지 않는 게임 ID입니다: ${gameId}`);
    }

    const gameMode = String(payload.gameMode || 'general').trim();
    const clientEventId = String(payload.clientEventId || payload.gameSessionId || uuid()).trim();

    // Idempotency check: if already recorded for (player_id, client_event_id), return existing without duplicating
    const duplicate = this.db.prepare(`
      SELECT * FROM game_results WHERE player_id = ? AND client_event_id = ?
    `).get(playerId, clientEventId);
    if (duplicate) {
      return {
        duplicated: true,
        result: this._mapResultRow(duplicate, player.nickname),
      };
    }

    // Validate metrics so invalid/spoofed numbers are rejected
    let score = payload.score !== undefined && payload.score !== null ? Number(payload.score) : null;
    let typingSpeed = payload.typingSpeed !== undefined && payload.typingSpeed !== null ? Number(payload.typingSpeed) : null;
    let accuracy = payload.accuracy !== undefined && payload.accuracy !== null ? Number(payload.accuracy) : null;
    let errorCount = payload.errorCount !== undefined && payload.errorCount !== null ? Math.round(Number(payload.errorCount)) : null;
    const durationMs = Math.max(0, Math.min(86_400_000, Math.round(Number(payload.durationMs) || 0)));

    if (score !== null && (!Number.isFinite(score) || score < 0 || score > 1_000_000)) {
      throw new Error('유효하지 않은 점수(score) 범위입니다 (0 ~ 1,000,000).');
    }
    if (typingSpeed !== null && (!Number.isFinite(typingSpeed) || typingSpeed < 0 || typingSpeed > 3_500)) {
      throw new Error('유효하지 않은 타수(typingSpeed) 범위입니다 (0 ~ 3,500 타/분).');
    }
    if (accuracy !== null && (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100)) {
      throw new Error('유효하지 않은 정확도(accuracy) 범위입니다 (0 ~ 100%).');
    }
    if (errorCount !== null && (!Number.isFinite(errorCount) || errorCount < 0 || errorCount > 10_000)) {
      throw new Error('유효하지 않은 오타 수(errorCount)입니다.');
    }

    const outcomeRaw = String(payload.outcome || payload.result || 'completed').toLowerCase();
    const outcome = ['win', 'lose', 'draw', 'completed', 'aborted'].includes(outcomeRaw)
      ? outcomeRaw
      : 'completed';

    const opponentType = String(payload.opponentType || 'none').trim();

    // Determine classification:
    // Aborted games, local 2P practice, or unverified P2P claims are stored as 'practice' so they don't pollute official rankings.
    let classification = payload.recordClassification === 'practice' ? 'practice' : 'ranking';
    if (outcome === 'aborted') {
      classification = 'practice';
    }
    if (gameId === 'pikachu-volleyball' && gameMode !== 'vs-computer') {
      // Local 2P or unilateral P2P online claims are recorded as practice/match history, not AI leaderboard
      classification = 'practice';
    }
    if (score === null && typingSpeed === null) {
      classification = 'practice';
    }

    // Ensure session exists or is updated
    let sessionId = null;
    if (payload.gameSessionId) {
      const sess = this.recordSessionEvent({
        playerId,
        gameId,
        gameMode,
        gameSessionId: payload.gameSessionId,
        eventType: outcome === 'aborted' ? 'game:abort' : 'game:complete',
        durationMs,
        metadata: payload.metadata,
      });
      sessionId = sess.sessionId;
    }

    const resultId = uuid();
    const now = nowIso();
    const metadataJson = JSON.stringify(payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {});
    const trustLevel = String(payload.trustLevel || 'client-guest-telemetry');

    this.db.prepare(`
      INSERT INTO game_results (
        result_id, session_id, client_event_id, player_id,
        game_id, game_mode, record_classification,
        score, typing_speed, accuracy, error_count, duration_ms,
        outcome, opponent_type, trust_level, metadata_json,
        recorded_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      resultId,
      sessionId,
      clientEventId,
      playerId,
      gameId,
      gameMode,
      classification,
      score,
      typingSpeed,
      accuracy,
      errorCount,
      durationMs,
      outcome,
      opponentType,
      trustLevel,
      metadataJson,
      now,
      now
    );

    const inserted = this.db.prepare('SELECT * FROM game_results WHERE result_id = ?').get(resultId);
    return {
      duplicated: false,
      result: this._mapResultRow(inserted, player.nickname),
    };
  }

  /**
   * Query rankings for a specific gameId and gameMode.
   * Never fabricates dummy rankings. Joins game_players so updated nicknames are reflected automatically.
   */
  getRankings({ gameId, gameMode, limit = 10, playerId = null }) {
    const cleanGameId = String(gameId || 'hancom-typing-97').trim();
    const modesForGame = GAME_RANKING_MODES[cleanGameId] || [];
    const selectedMode = modesForGame.find(m => m.modeId === gameMode) || modesForGame[0] || {
      modeId: gameMode || 'position',
      label: gameMode || '기본 모드',
      metric: 'score',
      unit: '점',
      direction: 'DESC',
    };

    const maxLimit = Math.max(1, Math.min(50, Number(limit) || 10));

    // Special case: Pikachu Volleyball multi-win leaderboard
    if (cleanGameId === 'pikachu-volleyball' && selectedMode.modeId === 'vs-computer-wins') {
      const rows = this.db.prepare(`
        SELECT
          r.player_id,
          p.nickname,
          COUNT(*) AS win_count,
          MAX(r.score) AS best_score,
          MAX(r.recorded_at) AS last_played_at
        FROM game_results r
        JOIN game_players p ON p.player_id = r.player_id
        WHERE r.game_id = 'pikachu-volleyball'
          AND r.game_mode = 'vs-computer'
          AND r.record_classification = 'ranking'
          AND r.outcome = 'win'
        GROUP BY r.player_id
        ORDER BY win_count DESC, best_score DESC, last_played_at ASC
        LIMIT ?
      `).all(maxLimit);

      const entries = rows.map((row, idx) => ({
        rank: idx + 1,
        playerId: row.player_id,
        nickname: row.nickname,
        metricValue: row.win_count,
        unit: '승',
        secondaryText: row.best_score ? `최고 ${Math.round(row.best_score).toLocaleString()}점` : '',
        recordedAt: row.last_played_at,
      }));

      let myBest = null;
      if (playerId) {
        const myRow = this.db.prepare(`
          SELECT
            COUNT(*) AS win_count,
            MAX(r.score) AS best_score,
            MAX(r.recorded_at) AS last_played_at
          FROM game_results r
          WHERE r.player_id = ?
            AND r.game_id = 'pikachu-volleyball'
            AND r.game_mode = 'vs-computer'
            AND r.record_classification = 'ranking'
            AND r.outcome = 'win'
        `).get(String(playerId));
        if (myRow && myRow.win_count > 0) {
          myBest = {
            metricValue: myRow.win_count,
            unit: '승',
            secondaryText: myRow.best_score ? `최고 ${Math.round(myRow.best_score).toLocaleString()}점` : '',
            recordedAt: myRow.last_played_at,
          };
        }
      }

      return {
        gameId: cleanGameId,
        gameMode: selectedMode.modeId,
        modeLabel: selectedMode.label,
        metric: selectedMode.metric,
        unit: selectedMode.unit,
        availableModes: modesForGame,
        entries,
        myBest,
      };
    }

    const metricCol = selectedMode.metric === 'typing_speed' ? 'typing_speed' : 'score';

    // Best record per player for the selected (game_id, game_mode)
    const rows = this.db.prepare(`
      SELECT
        r.player_id,
        p.nickname,
        MAX(r.${metricCol}) AS best_metric,
        MAX(r.accuracy) AS best_accuracy,
        MIN(r.duration_ms) AS best_duration_ms,
        MAX(r.recorded_at) AS last_recorded_at
      FROM game_results r
      JOIN game_players p ON p.player_id = r.player_id
      WHERE r.game_id = ?
        AND r.game_mode = ?
        AND r.record_classification = 'ranking'
        AND r.${metricCol} IS NOT NULL
      GROUP BY r.player_id
      ORDER BY best_metric DESC, best_accuracy DESC, last_recorded_at ASC
      LIMIT ?
    `).all(cleanGameId, selectedMode.modeId, maxLimit);

    const entries = rows.map((row, idx) => ({
      rank: idx + 1,
      playerId: row.player_id,
      nickname: row.nickname,
      metricValue: Math.round(row.best_metric * 10) / 10,
      unit: selectedMode.unit,
      accuracy: row.best_accuracy !== null ? Math.round(row.best_accuracy * 10) / 10 : null,
      durationMs: row.best_duration_ms,
      recordedAt: row.last_recorded_at,
    }));

    let myBest = null;
    if (playerId) {
      const myRow = this.db.prepare(`
        SELECT
          MAX(r.${metricCol}) AS best_metric,
          MAX(r.accuracy) AS best_accuracy,
          MAX(r.recorded_at) AS last_recorded_at
        FROM game_results r
        WHERE r.player_id = ?
          AND r.game_id = ?
          AND r.game_mode = ?
          AND r.record_classification = 'ranking'
          AND r.${metricCol} IS NOT NULL
      `).get(String(playerId), cleanGameId, selectedMode.modeId);

      if (myRow && myRow.best_metric !== null) {
        myBest = {
          metricValue: Math.round(myRow.best_metric * 10) / 10,
          unit: selectedMode.unit,
          accuracy: myRow.best_accuracy !== null ? Math.round(myRow.best_accuracy * 10) / 10 : null,
          recordedAt: myRow.last_recorded_at,
        };
      }
    }

    return {
      gameId: cleanGameId,
      gameMode: selectedMode.modeId,
      modeLabel: selectedMode.label,
      metric: selectedMode.metric,
      unit: selectedMode.unit,
      availableModes: modesForGame,
      entries,
      myBest,
    };
  }

  /**
   * Retrieve a player's recent records (both practice and ranking)
   */
  getPlayerRecords(playerId, { gameId = null, limit = 25 } = {}) {
    const validId = validateGuestId(playerId);
    const player = this.getPlayer(validId);
    const maxLimit = Math.max(1, Math.min(100, Number(limit) || 25));

    const rows = gameId
      ? this.db.prepare(`
          SELECT * FROM game_results
          WHERE player_id = ? AND game_id = ?
          ORDER BY recorded_at DESC
          LIMIT ?
        `).all(validId, String(gameId), maxLimit)
      : this.db.prepare(`
          SELECT * FROM game_results
          WHERE player_id = ?
          ORDER BY recorded_at DESC
          LIMIT ?
        `).all(validId, maxLimit);

    return {
      player,
      records: rows.map(r => this._mapResultRow(r, player?.nickname || '')),
    };
  }

  _mapResultRow(row, nickname = '') {
    let metadata = {};
    try {
      metadata = JSON.parse(row.metadata_json || '{}');
    } catch {
      metadata = {};
    }
    return {
      resultId: row.result_id,
      sessionId: row.session_id,
      clientEventId: row.client_event_id,
      playerId: row.player_id,
      nickname,
      gameId: row.game_id,
      gameMode: row.game_mode,
      recordClassification: row.record_classification,
      score: row.score,
      typingSpeed: row.typing_speed,
      accuracy: row.accuracy,
      errorCount: row.error_count,
      durationMs: row.duration_ms,
      outcome: row.outcome,
      opponentType: row.opponent_type,
      trustLevel: row.trust_level,
      metadata,
      recordedAt: row.recorded_at,
    };
  }
}
