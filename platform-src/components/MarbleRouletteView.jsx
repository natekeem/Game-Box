import React, { useState, useEffect, useRef } from 'react';

/**
 * Marble Roulette Integrated Host View
 * Wraps the original Box2D WebAssembly Marble Roulette (/roulette/index.html)
 * and provides corporate AD SSO / Department Employee Selector, Preset Management,
 * and Draw Result Recording without altering the physics engine or original UI.
 */
export function MarbleRouletteView({ api, currentUser, users, departments, onBack }) {
  const iframeRef = useRef(null);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [manualText, setManualText] = useState('김성민,이지훈,박수진,최민호,정하늘');
  const [drawTitle, setDrawTitle] = useState('사내 이벤트 경품 추첨');
  const [history, setHistory] = useState([]);
  const [presets, setPresets] = useState([]);
  const [presetTitle, setPresetTitle] = useState('');
  const [lastWinnerBanner, setLastWinnerBanner] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await api.getRouletteData();
      setHistory(res.history || []);
      setPresets(res.presets || []);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const onMessage = async (e) => {
      const data = e?.data;
      if (!data || data.type !== 'gamebox-roulette-goal') return;
      setLastWinnerBanner({
        winners: data.winners || [data.winner],
        mapTitle: data.mapTitle,
      });
      try {
        await api.recordRouletteDraw({
          title: drawTitle || '마블 룰렛 추첨',
          mapTitle: data.mapTitle || '기본 맵',
          winnerType: data.winnerType || 'first',
          participants: data.participants || [],
          winners: data.winners || [data.winner],
        });
        await loadHistory();
      } catch (err) {
        console.warn('Failed to save roulette history:', err);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [api, drawTitle]);

  const filteredUsers = selectedDept
    ? users.filter(u => u.departmentId === selectedDept)
    : users;

  const toggleUser = (id) => {
    const next = new Set(selectedUserIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUserIds(next);
  };

  const selectAllFiltered = () => {
    const next = new Set(selectedUserIds);
    filteredUsers.forEach(u => next.add(u.id));
    setSelectedUserIds(next);
  };

  const pushNamesToRoulette = (namesArray, append = false) => {
    const clean = namesArray.map(s => String(s).trim()).filter(Boolean);
    if (!clean.length) return;
    const nextList = append
      ? [...manualText.split(/[,\r\n]+/).map(s => s.trim()).filter(Boolean), ...clean]
      : clean;
    setManualText(nextList.join(', '));
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'gamebox-roulette-set-names', names: nextList },
      '*'
    );
  };

  const addSelectedEmployeesToRoulette = () => {
    const picked = users.filter(u => selectedUserIds.has(u.id)).map(u => `${u.name}(${u.departmentName})`);
    if (!picked.length) return;
    pushNamesToRoulette(picked, true);
  };

  const replaceWithSelectedEmployees = () => {
    const picked = users.filter(u => selectedUserIds.has(u.id)).map(u => u.name);
    if (!picked.length) return;
    pushNamesToRoulette(picked, false);
  };

  const applyManualText = () => {
    const list = manualText.split(/[,\r\n]+/).map(s => s.trim()).filter(Boolean);
    pushNamesToRoulette(list, false);
  };

  const handleSavePreset = async () => {
    const list = manualText.split(/[,\r\n]+/).map(s => s.trim()).filter(Boolean);
    if (!list.length || !presetTitle.trim()) return;
    await api.saveRoulettePreset({ title: presetTitle.trim(), participants: list });
    setPresetTitle('');
    await loadHistory();
  };

  return (
    <div className="gp-roulette-layout">
      <div className="gp-roulette-topbar">
        <div className="gp-roulette-title-wrap">
          <button type="button" className="gp-btn gp-btn-outline" onClick={onBack}>
            ← 게임 목록으로
          </button>
          <div>
            <h2>🔮 마블 룰렛 (Marble Roulette)</h2>
            <small>Box2D 물리 엔진 원본 · 사내 부서/임직원 명단 연동 및 추첨 결과 자동 기록</small>
          </div>
        </div>
        <div className="gp-roulette-top-actions">
          <button
            type="button"
            className="gp-btn gp-btn-secondary"
            onClick={() => setSidebarOpen(v => !v)}
          >
            {sidebarOpen ? '명단/기록 패널 접기 ▶' : '◀ 사내 명단 & 기록 열기'}
          </button>
        </div>
      </div>

      {lastWinnerBanner && (
        <div className="gp-winner-banner">
          <span>🎉 추첨 완료! 당첨자: <strong>{lastWinnerBanner.winners.join(', ')}</strong> ({lastWinnerBanner.mapTitle})</span>
          <button type="button" className="gp-btn-xs" onClick={() => setLastWinnerBanner(null)}>닫기</button>
        </div>
      )}

      <div className="gp-roulette-body">
        <div className="gp-roulette-stage">
          <iframe
            ref={iframeRef}
            src="/roulette/index.html"
            title="Marble Roulette Box2D"
            className="gp-roulette-iframe"
          />
        </div>

        {sidebarOpen && (
          <aside className="gp-roulette-sidebar">
            <div className="gp-panel-block">
              <h3>1. 추첨 제목 설정</h3>
              <input
                type="text"
                className="gp-input"
                value={drawTitle}
                onChange={e => setDrawTitle(e.target.value)}
                placeholder="예: 11월 전사 간식 추첨"
              />
            </div>

            <div className="gp-panel-block">
              <h3>2. 사내 임직원 / 부서별 불러오기</h3>
              <div className="gp-row-gap">
                <select
                  className="gp-select"
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                >
                  <option value="">전체 부서 ({users.length}명)</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.memberCount}명)</option>
                  ))}
                </select>
                <button type="button" className="gp-btn-xs" onClick={selectAllFiltered}>
                  부서 전체선택
                </button>
              </div>

              <div className="gp-emp-checklist">
                {filteredUsers.map(u => (
                  <label key={u.id} className="gp-emp-check-item">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.has(u.id)}
                      onChange={() => toggleUser(u.id)}
                    />
                    <span>{u.name}</span>
                    <small>{u.departmentName}</small>
                  </label>
                ))}
              </div>

              <div className="gp-btn-row">
                <button type="button" className="gp-btn gp-btn-primary gp-btn-sm" onClick={replaceWithSelectedEmployees}>
                  선택 직원으로 교체
                </button>
                <button type="button" className="gp-btn gp-btn-secondary gp-btn-sm" onClick={addSelectedEmployeesToRoulette}>
                  + 명단에 추가
                </button>
              </div>
            </div>

            <div className="gp-panel-block">
              <h3>3. 참가자 명단 편집 / 붙여넣기</h3>
              <textarea
                className="gp-textarea"
                rows={3}
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                placeholder="이름을 쉼표(,) 또는 줄바꿈으로 구분해 입력 (예: 김성민*2, 이지훈/3)"
              />
              <div className="gp-btn-row">
                <button type="button" className="gp-btn gp-btn-primary gp-btn-sm" onClick={applyManualText}>
                  룰렛 구슬에 즉시 반영
                </button>
              </div>

              <div className="gp-preset-save-row">
                <input
                  type="text"
                  className="gp-input gp-input-sm"
                  placeholder="명단 프리셋 이름 저장..."
                  value={presetTitle}
                  onChange={e => setPresetTitle(e.target.value)}
                />
                <button type="button" className="gp-btn gp-btn-outline gp-btn-sm" onClick={handleSavePreset}>
                  명단 저장
                </button>
              </div>

              {presets.length > 0 && (
                <div className="gp-preset-list">
                  <small className="gp-muted">저장된 참가자 명단 재사용:</small>
                  <div className="gp-chip-wrap">
                    {presets.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className="gp-chip"
                        onClick={() => pushNamesToRoulette(p.participants, false)}
                      >
                        📋 {p.title} ({p.participants.length}명)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="gp-panel-block">
              <h3>4. 최근 추첨 결과 기록</h3>
              {history.length === 0 ? (
                <p className="gp-muted">아직 기록된 추첨 내역이 없습니다.</p>
              ) : (
                <ul className="gp-history-list">
                  {history.slice(0, 8).map(h => (
                    <li key={h.id}>
                      <div className="gp-history-top">
                        <strong>{h.title}</strong>
                        <small>{new Date(h.occurredAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</small>
                      </div>
                      <div className="gp-history-winner">
                        🏆 당첨: <span>{h.winners.join(', ')}</span>
                      </div>
                      <small className="gp-muted">진행: {h.hostName} · 참가 {h.participants.length}명</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
