import React, { useState, useEffect, useCallback } from 'react';
import { PLATFORM_GAMES } from '../registry.js';

export function EventGroupsView({ api, currentUser, activeEventId, onSelectActiveEvent }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(activeEventId || null);
  const [eventDetail, setEventDetail] = useState(null);
  const [eventRankings, setEventRankings] = useState(null);
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create form state
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState(() => new Set([currentUser?.id].filter(Boolean)));
  const [selectedGameIds, setSelectedGameIds] = useState(() => new Set(['marble-roulette', 'reaction', 'speedtyping', 'bomberman', 'drawing']));
  const [deptFilter, setDeptFilter] = useState('');
  const [pointFirst, setPointFirst] = useState(10);
  const [pointSecond, setPointSecond] = useState(6);
  const [pointThird, setPointThird] = useState(3);
  const [pointPart, setPointPart] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  const loadEvents = useCallback(async () => {
    try {
      const [evRes, dirRes] = await Promise.all([
        api.listEventGroups(),
        api.getDirectory(),
      ]);
      const list = evRes.events || [];
      setEvents(list);
      setDirectoryUsers(dirRes.users || []);
      setDepartments(dirRes.departments || []);
      if (!selectedEventId && list.length > 0) {
        setSelectedEventId(list[0].id);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  }, [api, selectedEventId]);

  const loadSelectedDetail = useCallback(async (id) => {
    if (!id) {
      setEventDetail(null);
      setEventRankings(null);
      return;
    }
    try {
      const [detailRes, rankRes] = await Promise.all([
        api.getEventGroup(id),
        api.getEventRankings(id),
      ]);
      setEventDetail(detailRes.event);
      setEventRankings(rankRes);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }, [api]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (selectedEventId) {
      loadSelectedDetail(selectedEventId);
    }
  }, [selectedEventId, loadSelectedDetail]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newEventName.trim()) {
      setErrorMsg('이벤트 그룹 이름을 입력하세요.');
      return;
    }
    try {
      const res = await api.createEventGroup({
        name: newEventName.trim(),
        description: newEventDesc.trim(),
        participantIds: Array.from(selectedUserIds),
        gameIds: Array.from(selectedGameIds),
        pointPolicy: {
          first: Number(pointFirst) || 10,
          second: Number(pointSecond) || 6,
          third: Number(pointThird) || 3,
          participation: Number(pointPart) || 1,
        },
      });
      setShowCreateModal(false);
      setNewEventName('');
      setNewEventDesc('');
      await loadEvents();
      if (res.event?.id) {
        setSelectedEventId(res.event.id);
        onSelectActiveEvent?.(res.event.id);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleStatusChange = async (eventId, status) => {
    try {
      await api.updateEventStatus(eventId, status);
      await loadEvents();
      await loadSelectedDetail(eventId);
      if (status === 'completed' && activeEventId === eventId) {
        onSelectActiveEvent?.(null);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const toggleUserSelection = (uid) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  const selectAllFilteredUsers = () => {
    const filtered = directoryUsers.filter(u => !deptFilter || u.departmentId === deptFilter);
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      filtered.forEach(u => next.add(u.id));
      return next;
    });
  };

  const toggleGameSelection = (gid) => {
    setSelectedGameIds(prev => {
      const next = new Set(prev);
      if (next.has(gid)) next.delete(gid);
      else next.add(gid);
      return next;
    });
  };

  return (
    <div className="gp-events-view">
      <div className="gp-section-header">
        <div>
          <h2>🏆 사내 이벤트 그룹 & 토너먼트</h2>
          <p className="gp-muted">
            여러 부서의 임직원을 하나의 이벤트 그룹으로 묶어 대회 점수와 이벤트별 랭킹을 집계합니다.
          </p>
        </div>
        <button type="button" className="gp-btn gp-btn-primary" onClick={() => setShowCreateModal(true)}>
          + 새 이벤트 그룹 생성
        </button>
      </div>

      {errorMsg && <div className="gp-alert gp-alert-error">{errorMsg}</div>}

      <div className="gp-events-grid">
        {/* Left: Event List */}
        <div className="gp-panel gp-events-list-panel">
          <h3>이벤트 그룹 목록 ({events.length})</h3>
          {events.length === 0 ? (
            <div className="gp-empty-box">
              생성된 이벤트 그룹이 없습니다. 우측 상단 버튼으로 대회나 친선전을 만들어 보세요!
            </div>
          ) : (
            <ul className="gp-event-cards">
              {events.map(ev => {
                const isSelected = ev.id === selectedEventId;
                const isActive = ev.id === activeEventId;
                return (
                  <li
                    key={ev.id}
                    className={`gp-event-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedEventId(ev.id)}
                  >
                    <div className="gp-event-card-top">
                      <strong>{ev.name}</strong>
                      <span className={`gp-status-badge status-${ev.status}`}>
                        {ev.status === 'active' ? '진행 중' : '종료됨'}
                      </span>
                    </div>
                    {ev.description && <p className="gp-event-desc">{ev.description}</p>}
                    <div className="gp-event-meta">
                      <span>생성자: {ev.creatorName}</span>
                      <span>참가자: {ev.participantIds?.length || 0}명</span>
                      <span>종목: {ev.gameIds?.length || 0}개</span>
                    </div>
                    <div className="gp-event-card-actions" onClick={e => e.stopPropagation()}>
                      {ev.status === 'active' && (
                        <button
                          type="button"
                          className={`gp-btn gp-btn-xs ${isActive ? 'gp-btn-accent' : 'gp-btn-secondary'}`}
                          onClick={() => onSelectActiveEvent?.(isActive ? null : ev.id)}
                        >
                          {isActive ? '✓ 현재 게임에 적용 중' : '현재 게임에 이 이벤트 적용'}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right: Event Detail & Leaderboard */}
        <div className="gp-panel gp-event-detail-panel">
          {!eventDetail ? (
            <div className="gp-empty-box">좌측에서 이벤트 그룹을 선택하면 상세 정보와 실시간 랭킹이 표시됩니다.</div>
          ) : (
            <div>
              <div className="gp-event-detail-header">
                <div>
                  <h3>{eventDetail.name}</h3>
                  <p className="gp-muted">{eventDetail.description || '설명 없음'} · 생성자: {eventDetail.creatorName}</p>
                </div>
                <div className="gp-btn-row">
                  {eventDetail.status === 'active' ? (
                    <>
                      <button
                        type="button"
                        className={`gp-btn gp-btn-sm ${activeEventId === eventDetail.id ? 'gp-btn-accent' : 'gp-btn-primary'}`}
                        onClick={() => onSelectActiveEvent?.(activeEventId === eventDetail.id ? null : eventDetail.id)}
                      >
                        {activeEventId === eventDetail.id ? '✓ 현재 활성 이벤트 (해제)' : '이 이벤트로 게임 점수 기록하기'}
                      </button>
                      <button
                        type="button"
                        className="gp-btn gp-btn-sm gp-btn-danger"
                        onClick={() => handleStatusChange(eventDetail.id, 'completed')}
                      >
                        이벤트 종료
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="gp-btn gp-btn-sm gp-btn-secondary"
                      onClick={() => handleStatusChange(eventDetail.id, 'active')}
                    >
                      이벤트 다시 시작
                    </button>
                  )}
                </div>
              </div>

              <div className="gp-event-policy-bar">
                <span><strong>배점 정책:</strong></span>
                <span>🥇 1위 +{eventDetail.pointPolicy?.first ?? 10}점</span>
                <span>🥈 2위 +{eventDetail.pointPolicy?.second ?? 6}점</span>
                <span>🥉 3위 +{eventDetail.pointPolicy?.third ?? 3}점</span>
                <span>🎮 참가 +{eventDetail.pointPolicy?.participation ?? 1}점</span>
                <span className="gp-muted">(* BOT 대결을 제외한 공식 온라인 대전 결과가 자동 반영됩니다)</span>
              </div>

              <div className="gp-event-tags-section">
                <div>
                  <strong>포함된 게임 종목 ({eventDetail.gameIds?.length || 0}개):</strong>
                  <div className="gp-chip-list">
                    {(eventDetail.gameIds || []).map(gid => {
                      const g = PLATFORM_GAMES.find(item => item.id === gid);
                      return (
                        <span key={gid} className="gp-chip">
                          {g ? `${g.icon} ${g.name}` : gid}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="gp-event-rankings-split">
                <div>
                  <h4>개인별 이벤트 랭킹</h4>
                  <table className="gp-table">
                    <thead>
                      <tr>
                        <th>순위</th>
                        <th>이름</th>
                        <th>부서</th>
                        <th>승 / 패</th>
                        <th>경기수</th>
                        <th>이벤트 승점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(eventRankings?.standings || []).length === 0 ? (
                        <tr><td colSpan={6} className="gp-muted">참가자가 없습니다.</td></tr>
                      ) : (
                        eventRankings.standings.map(row => (
                          <tr key={row.userId} className={row.userId === currentUser?.id ? 'gp-row-me' : ''}>
                            <td><strong>#{row.rank}</strong></td>
                            <td>{row.name}</td>
                            <td>{row.departmentName}</td>
                            <td>{row.wins}승 {row.losses}패</td>
                            <td>{row.matchesPlayed}</td>
                            <td><strong className="gp-points-cell">{row.eventPoints}점</strong></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4>부서별 이벤트 합산 랭킹</h4>
                  <table className="gp-table">
                    <thead>
                      <tr>
                        <th>순위</th>
                        <th>부서명</th>
                        <th>참가 인원</th>
                        <th>총 승리</th>
                        <th>합산 승점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(eventRankings?.departmentStandings || []).length === 0 ? (
                        <tr><td colSpan={5} className="gp-muted">부서 데이터가 없습니다.</td></tr>
                      ) : (
                        eventRankings.departmentStandings.map(dept => (
                          <tr key={dept.departmentId}>
                            <td><strong>#{dept.rank}</strong></td>
                            <td>{dept.departmentName}</td>
                            <td>{dept.memberCount}명</td>
                            <td>{dept.wins}승</td>
                            <td><strong className="gp-points-cell">{dept.eventPoints}점</strong></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="gp-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="gp-modal gp-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="gp-modal-header">
              <h3>새 이벤트 그룹 생성</h3>
              <button type="button" className="gp-close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateEvent} className="gp-modal-body">
              <div className="gp-form-row">
                <label>이벤트 이름 *</label>
                <input
                  type="text"
                  className="gp-input"
                  placeholder="예: 2026 봄 워크숍 미니게임 대회 / 자동화운영팀 vs 인프라팀 친선전"
                  value={newEventName}
                  onChange={e => setNewEventName(e.target.value)}
                  required
                />
              </div>
              <div className="gp-form-row">
                <label>이벤트 설명</label>
                <input
                  type="text"
                  className="gp-input"
                  placeholder="예: 금요일 오후 4시 간식 내기 토너먼트"
                  value={newEventDesc}
                  onChange={e => setNewEventDesc(e.target.value)}
                />
              </div>

              <div className="gp-form-row">
                <label>승점 배점 기준 (1위 / 2위 / 3위 / 참가)</label>
                <div className="gp-points-inputs">
                  <span>1위 <input type="number" className="gp-input gp-input-xs" value={pointFirst} onChange={e => setPointFirst(e.target.value)} /></span>
                  <span>2위 <input type="number" className="gp-input gp-input-xs" value={pointSecond} onChange={e => setPointSecond(e.target.value)} /></span>
                  <span>3위 <input type="number" className="gp-input gp-input-xs" value={pointThird} onChange={e => setPointThird(e.target.value)} /></span>
                  <span>참가 <input type="number" className="gp-input gp-input-xs" value={pointPart} onChange={e => setPointPart(e.target.value)} /></span>
                </div>
              </div>

              <div className="gp-form-row">
                <div className="gp-label-with-actions">
                  <label>참가 임직원 선택 ({selectedUserIds.size}명 선택됨)</label>
                  <div className="gp-btn-row">
                    <select className="gp-select gp-select-sm" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                      <option value="">전체 부서</option>
                      {departments.map(d => (
                        <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
                      ))}
                    </select>
                    <button type="button" className="gp-btn gp-btn-xs gp-btn-secondary" onClick={selectAllFilteredUsers}>
                      표시된 인원 전체 선택
                    </button>
                  </div>
                </div>
                <div className="gp-checkbox-grid">
                  {directoryUsers
                    .filter(u => !deptFilter || u.departmentId === deptFilter)
                    .map(u => (
                      <label key={u.id} className="gp-check-item">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.has(u.id)}
                          onChange={() => toggleUserSelection(u.id)}
                        />
                        <span>{u.name} <small>({u.departmentName})</small></span>
                      </label>
                    ))}
                </div>
              </div>

              <div className="gp-form-row">
                <label>포함할 게임 종목 선택 ({selectedGameIds.size}개)</label>
                <div className="gp-checkbox-grid">
                  {PLATFORM_GAMES.map(g => (
                    <label key={g.id} className="gp-check-item">
                      <input
                        type="checkbox"
                        checked={selectedGameIds.has(g.id)}
                        onChange={() => toggleGameSelection(g.id)}
                      />
                      <span>{g.icon} {g.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="gp-modal-footer">
                <button type="button" className="gp-btn gp-btn-secondary" onClick={() => setShowCreateModal(false)}>취소</button>
                <button type="submit" className="gp-btn gp-btn-primary">이벤트 그룹 생성</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
