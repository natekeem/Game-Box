import React, { useState, useEffect, useCallback } from 'react';
import { PLATFORM_GAMES } from '../registry.js';

export function RankingsAndStatsView({ api, currentUser }) {
  const [selectedGameId, setSelectedGameId] = useState('');
  const [includePractice, setIncludePractice] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [deptRankings, setDeptRankings] = useState([]);
  const [myStats, setMyStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rankRes, deptRes, statRes] = await Promise.all([
        api.getRankings({ gameId: selectedGameId || undefined, includePractice }),
        api.getDepartmentRankings({ gameId: selectedGameId || undefined }),
        currentUser?.id ? api.getUserStats(currentUser.id) : Promise.resolve(null),
      ]);
      setRankings(rankRes.rankings || []);
      setDeptRankings(deptRes.departments || []);
      setMyStats(statRes);
    } catch {
      // ignore transient error
    } finally {
      setLoading(false);
    }
  }, [api, selectedGameId, includePractice, currentUser?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="gp-rankings-view">
      <div className="gp-section-header">
        <div>
          <h2>📊 공식 랭킹 및 부서별 전적</h2>
          <p className="gp-muted">
            모든 기록은 고유 사번/사용자 ID(<code>{currentUser?.id}</code>)를 기준으로 집계되며, 공식 랭킹에서는 AI BOT 대결 기록이 제외됩니다.
          </p>
        </div>
        <div className="gp-filter-controls">
          <select
            className="gp-select"
            value={selectedGameId}
            onChange={e => setSelectedGameId(e.target.value)}
          >
            <option value="">전체 게임 종합</option>
            {PLATFORM_GAMES.filter(g => g.id !== 'marble-roulette').map(g => (
              <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
            ))}
          </select>
          <label className="gp-check-inline">
            <input
              type="checkbox"
              checked={includePractice}
              onChange={e => setIncludePractice(e.target.checked)}
            />
            <span>연습 / BOT 대전 기록 포함하여 보기</span>
          </label>
          <button type="button" className="gp-btn gp-btn-sm gp-btn-secondary" onClick={loadData}>
            새로고침
          </button>
        </div>
      </div>

      {/* Personal Stats Summary Card */}
      {myStats && (
        <div className="gp-my-stats-banner">
          <div className="gp-my-stats-title">
            <span className="gp-user-badge">{currentUser?.departmentName}</span>
            <strong>{currentUser?.name}</strong> 님의 누적 전적
          </div>
          <div className="gp-my-stats-metrics">
            <div className="gp-stat-pill">
              <span className="gp-stat-label">공식 경기수</span>
              <strong>{myStats.official?.matchesPlayed || 0}전</strong>
            </div>
            <div className="gp-stat-pill">
              <span className="gp-stat-label">공식 승 / 패</span>
              <strong>{myStats.official?.wins || 0}승 {myStats.official?.losses || 0}패</strong>
            </div>
            <div className="gp-stat-pill">
              <span className="gp-stat-label">공식 최고 점수</span>
              <strong>{myStats.official?.bestScore || 0}점</strong>
            </div>
            <div className="gp-stat-pill gp-stat-pill-muted">
              <span className="gp-stat-label">BOT / 연습 경기</span>
              <strong>{myStats.practice?.matchesPlayed || 0}전 ({myStats.practice?.wins || 0}승)</strong>
            </div>
          </div>
        </div>
      )}

      <div className="gp-rankings-grid">
        {/* Individual Leaderboard */}
        <div className="gp-panel">
          <h3>
            👤 개인별 {includePractice ? '전체(연습 포함)' : '공식'} 랭킹
            {selectedGameId && ` — ${PLATFORM_GAMES.find(g => g.id === selectedGameId)?.name || selectedGameId}`}
          </h3>
          {loading ? (
            <div className="gp-empty-box">불러오는 중...</div>
          ) : rankings.length === 0 ? (
            <div className="gp-empty-box">
              아직 기록된 {includePractice ? '' : '공식 '}경기 결과가 없습니다.
              {!includePractice && ' (혼자/BOT 대전을 플레이했다면 상단의 "연습 / BOT 대전 기록 포함하여 보기"를 체크해 보세요)'}
            </div>
          ) : (
            <table className="gp-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>이름</th>
                  <th>부서</th>
                  <th>승 / 패 (승률)</th>
                  <th>경기수</th>
                  <th>최고 점수</th>
                  <th>누적 점수</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map(row => (
                  <tr key={row.userId} className={row.userId === currentUser?.id ? 'gp-row-me' : ''}>
                    <td><strong>#{row.rank}</strong></td>
                    <td>{row.name}</td>
                    <td>{row.departmentName}</td>
                    <td>{row.wins}승 {row.losses}패 ({row.winRate}%)</td>
                    <td>{row.matchesPlayed}</td>
                    <td><strong>{row.bestScore}</strong></td>
                    <td>{row.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Department Leaderboard */}
        <div className="gp-panel">
          <h3>🏢 부서별 공식 대항전 랭킹</h3>
          {deptRankings.length === 0 ? (
            <div className="gp-empty-box">아직 부서별 공식 대전 기록이 없습니다.</div>
          ) : (
            <table className="gp-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>부서명</th>
                  <th>참여 인원</th>
                  <th>총 승리</th>
                  <th>총 경기수</th>
                  <th>합산 점수</th>
                </tr>
              </thead>
              <tbody>
                {deptRankings.map(dept => (
                  <tr key={dept.departmentId} className={dept.departmentId === currentUser?.departmentId ? 'gp-row-me' : ''}>
                    <td><strong>#{dept.rank}</strong></td>
                    <td>{dept.departmentName}</td>
                    <td>{dept.activePlayers}명</td>
                    <td><strong>{dept.wins}승</strong></td>
                    <td>{dept.matchesPlayed}</td>
                    <td>{dept.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {myStats?.byGame && myStats.byGame.length > 0 && (
            <div className="gp-my-game-breakdown">
              <h4>🎮 내 종목별 상세 기록</h4>
              <table className="gp-table gp-table-compact">
                <thead>
                  <tr>
                    <th>게임</th>
                    <th>경기수</th>
                    <th>승리</th>
                    <th>최고 점수</th>
                  </tr>
                </thead>
                <tbody>
                  {myStats.byGame.map(item => {
                    const g = PLATFORM_GAMES.find(x => x.id === item.gameId);
                    return (
                      <tr key={item.gameId}>
                        <td>{g ? `${g.icon} ${g.name}` : item.gameId}</td>
                        <td>{item.matchesPlayed}</td>
                        <td>{item.wins}승</td>
                        <td><strong>{item.bestScore}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
