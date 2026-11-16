import { Application } from "../../system/application.js";
import { ICONS } from "../../config/icons.js";
import { ShowDialogWindow } from "../../shared/components/dialog-window.js";
import {
  getWin98PlayerIdentity,
  updateWin98PlayerNickname,
} from "../../system/game-box-win98-bridge.js";

const GAME_TABS = [
  {
    gameId: "hancom-typing-97",
    label: "한컴타자",
    title: "한컴타자연습 97",
    modes: [
      { modeId: "position", label: "자리연습 (타수)", unit: "타/분" },
      { modeId: "word", label: "낱말연습 (타수)", unit: "타/분" },
      { modeId: "short", label: "짧은글 연습 (타수)", unit: "타/분" },
      { modeId: "long", label: "긴글 연습 (타수)", unit: "타/분" },
      { modeId: "acid-rain", label: "산성비 (최고 점수)", unit: "점" },
      { modeId: "invader", label: "침략자 (최고 점수)", unit: "점" },
    ],
  },
  {
    gameId: "hanme-typing-30",
    label: "한메타자",
    title: "한메타자교사 3.0",
    modes: [
      { modeId: "venezia", label: "베네치아 게임 (최고 점수)", unit: "점" },
      { modeId: "short", label: "단문연습 (타수)", unit: "타/분" },
      { modeId: "long", label: "장문연습 (타수)", unit: "타/분" },
      { modeId: "position", label: "자리연습 (타수)", unit: "타/분" },
      { modeId: "word", label: "낱말연습 (타수)", unit: "타/분" },
    ],
  },
  {
    gameId: "pikachu-volleyball",
    label: "피카츄배구",
    title: "피카츄 배구",
    modes: [
      { modeId: "vs-computer", label: "AI 대전 (승점/최고점)", unit: "점" },
      { modeId: "vs-computer-wins", label: "AI 대전 (다승 순위)", unit: "승" },
    ],
  },
];

function formatDateShort(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}.${mm}.${dd}`;
}

export class RetroRankingApp extends Application {
  static config = {
    id: "retro-ranking",
    title: "GAME RANKING",
    description: "한컴타자 · 한메타자 · 피카츄 배구 공식 랭킹 및 내 최고 기록",
    icon: ICONS.gameRanking,
    category: "보조프로그램/게임",
    width: 340,
    height: 495,
    resizable: true,
    isSingleton: true,
  };

  constructor(config) {
    super(config);
    this.selectedGameId = "hancom-typing-97";
    this.selectedModeByGame = {
      "hancom-typing-97": "position",
      "hanme-typing-30": "venezia",
      "pikachu-volleyball": "vs-computer",
    };
    this._boundRefresh = () => this.fetchAndRenderRankings();
  }

  _positionRightSide(win) {
    setTimeout(() => {
      const screen = document.getElementById("screen") || document.body;
      const screenRect = screen.getBoundingClientRect();
      const winWidth = this.width || 340;
      const left = Math.max(12, screenRect.width - winWidth - 16);
      const top = 16;
      win.css({
        left: `${left}px`,
        top: `${top}px`,
      });
    }, 30);
  }

  _createWindow() {
    const win = new window.$Window({
      title: "GAME RANKING",
      icons: this.icon,
      outerWidth: this.width,
      outerHeight: this.height,
      resizable: true,
      minimizeButton: true,
      maximizeButton: false,
    });

    const menuBar = new window.MenuBar({
      "랭킹(&R)": [
        {
          label: "순위 새로 고침(&F)",
          action: () => this.fetchAndRenderRankings(),
        },
        {
          label: "내 닉네임 변경(&N)...",
          action: () => this.openNicknameDialog(),
        },
        "MENU_DIVIDER",
        {
          label: "닫기(&X)",
          action: () => win.close(),
        },
      ],
      "게임 실행(&G)": [
        {
          label: "한컴타자연습 97 열기(&H)",
          action: () => window.System?.launchApp("hancom-typing-97"),
        },
        {
          label: "한메타자교사 3.0 열기(&M)",
          action: () => window.System?.launchApp("hanme-typing-30"),
        },
        {
          label: "피카츄 배구 열기(&P)",
          action: () => window.System?.launchApp("pikachu-volleyball"),
        },
        "MENU_DIVIDER",
        {
          label: "게임 가이드 열기(&I)",
          action: () => window.System?.launchApp("retro-game-guide"),
        },
      ],
    });
    win.setMenuBar(menuBar);

    win.$content.css({
      padding: "6px",
      background: "#c0c0c0",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      fontFamily: '"Pixelated MS Sans Serif", "굴림", "Gulim", Tahoma, sans-serif',
      fontSize: "12px",
      color: "#000",
      overflow: "hidden",
      userSelect: "none",
    });

    win.$content.html(`
      <div class="win98-ranking-tabs" style="display:flex;gap:2px;border-bottom:2px solid #ffffff;padding-bottom:2px;"></div>
      <div class="win98-ranking-filter-row" style="display:flex;align-items:center;justify-content:space-between;gap:4px;background:#dfdfdf;padding:4px 6px;border:1px solid #808080;">
        <label for="win98-ranking-mode-select" style="font-weight:bold;white-space:nowrap;">세부 종목:</label>
        <select id="win98-ranking-mode-select" style="flex:1;font-family:inherit;font-size:11px;padding:1px 2px;"></select>
        <button type="button" class="win98-ranking-refresh-btn" style="min-width:52px;padding:1px 6px;font-size:11px;">새로고침</button>
      </div>
      <div class="win98-ranking-table-wrap inset-deep" style="flex:1 1 auto;background:#ffffff;overflow-y:auto;border:2px inset #808080;">
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="background:#000080;color:#ffffff;text-align:left;">
              <th style="padding:3px 5px;width:36px;text-align:center;">순위</th>
              <th style="padding:3px 5px;">닉네임</th>
              <th style="padding:3px 5px;text-align:right;">기록</th>
              <th style="padding:3px 5px;text-align:right;width:68px;">날짜</th>
            </tr>
          </thead>
          <tbody class="win98-ranking-tbody"></tbody>
        </table>
      </div>
      <fieldset style="margin:0;padding:5px 7px;border:1px groove #ffffff;">
        <legend style="font-weight:bold;padding:0 4px;">나의 최고 기록 (게스트 식별 기준)</legend>
        <div class="win98-my-best-box" style="font-family:monospace,'굴림';font-size:11px;line-height:1.45;color:#000080;font-weight:bold;">
          조회 중...
        </div>
      </fieldset>
      <div class="win98-ranking-footer" style="display:flex;align-items:center;justify-content:space-between;gap:4px;padding-top:2px;border-top:1px solid #808080;font-size:11px;">
        <span class="win98-player-badge" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">플레이어: 확인 중...</span>
        <button type="button" class="win98-nickname-btn" style="padding:2px 8px;font-size:11px;">닉네임 변경...</button>
      </div>
    `);

    this.$root = win.$content;
    this._bindUIEvents();
    this._renderTabsAndModes();
    this.fetchAndRenderRankings();
    this._positionRightSide(win);

    window.addEventListener("game-box:ranking-updated", this._boundRefresh);
    window.addEventListener("game-box:identity-changed", this._boundRefresh);

    win.onClosed(() => {
      window.removeEventListener("game-box:ranking-updated", this._boundRefresh);
      window.removeEventListener("game-box:identity-changed", this._boundRefresh);
    });

    return win;
  }

  _bindUIEvents() {
    const modeSelect = this.$root.find("#win98-ranking-mode-select")[0];
    if (modeSelect) {
      modeSelect.addEventListener("change", (e) => {
        this.selectedModeByGame[this.selectedGameId] = e.target.value;
        this.fetchAndRenderRankings();
      });
    }

    const refreshBtn = this.$root.find(".win98-ranking-refresh-btn")[0];
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => this.fetchAndRenderRankings());
    }

    const nickBtn = this.$root.find(".win98-nickname-btn")[0];
    if (nickBtn) {
      nickBtn.addEventListener("click", () => this.openNicknameDialog());
    }
  }

  _renderTabsAndModes() {
    const $tabs = this.$root.find(".win98-ranking-tabs");
    $tabs.empty();

    GAME_TABS.forEach((tab) => {
      const isActive = tab.gameId === this.selectedGameId;
      const $btn = window
        .$("<button type='button'>")
        .text(tab.label)
        .css({
          flex: "1 1 0",
          padding: "4px 4px",
          fontWeight: isActive ? "bold" : "normal",
          background: isActive ? "#000080" : "#c0c0c0",
          color: isActive ? "#ffffff" : "#000000",
          border: "2px outset #ffffff",
          cursor: "pointer",
          fontSize: "11px",
        })
        .on("click", () => {
          this.selectedGameId = tab.gameId;
          this._renderTabsAndModes();
          this.fetchAndRenderRankings();
        });
      $tabs.append($btn);
    });

    const activeTab = GAME_TABS.find((t) => t.gameId === this.selectedGameId) || GAME_TABS[0];
    const currentMode = this.selectedModeByGame[this.selectedGameId] || activeTab.modes[0].modeId;

    const $select = this.$root.find("#win98-ranking-mode-select");
    $select.empty();
    activeTab.modes.forEach((m) => {
      const $opt = window
        .$("<option>")
        .val(m.modeId)
        .text(m.label)
        .prop("selected", m.modeId === currentMode);
      $select.append($opt);
    });
  }

  async fetchAndRenderRankings() {
    if (!this.$root) return;
    const identity = getWin98PlayerIdentity();
    const $badge = this.$root.find(".win98-player-badge");
    $badge.text(
      identity.nickname
        ? `👤 닉네임: ${identity.nickname}`
        : `👤 미등록 게스트 (${identity.guestId.slice(0, 10)}…)`
    );

    const gameId = this.selectedGameId;
    const gameMode = this.selectedModeByGame[gameId];
    const $tbody = this.$root.find(".win98-ranking-tbody");
    const $myBest = this.$root.find(".win98-my-best-box");

    try {
      const params = new URLSearchParams({
        gameId,
        gameMode,
        limit: "10",
        playerId: identity.guestId,
      });
      const res = await fetch(`/api/game-box/rankings?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      $tbody.empty();
      const entries = Array.isArray(data.entries) ? data.entries : [];

      if (entries.length === 0) {
        $tbody.append(`
          <tr>
            <td colspan="4" style="padding:28px 10px;text-align:center;color:#555555;line-height:1.5;">
              현재 이 종목에 등록된 랭킹 기록이 없습니다.<br>
              게임을 완료하면 TOP 10 순위가 이곳에 표시됩니다.
            </td>
          </tr>
        `);
      } else {
        entries.forEach((entry) => {
          const isMe = entry.playerId === identity.guestId;
          const tr = document.createElement("tr");
          tr.style.background = isMe ? "#ffffcc" : entry.rank % 2 === 0 ? "#f5f5f5" : "#ffffff";
          tr.style.borderBottom = "1px solid #e0e0e0";

          const tdRank = document.createElement("td");
          tdRank.style.cssText = "padding:3px 5px;text-align:center;font-family:monospace;font-weight:bold;";
          tdRank.textContent = `${entry.rank}위`;

          const tdNick = document.createElement("td");
          tdNick.style.cssText = "padding:3px 5px;font-weight:" + (isMe ? "bold" : "normal") + ";";
          tdNick.textContent = entry.nickname + (isMe ? " (나)" : "");

          const tdValue = document.createElement("td");
          tdValue.style.cssText = "padding:3px 5px;text-align:right;font-family:monospace;font-weight:bold;color:#000080;";
          const valFormatted = Number(entry.metricValue || 0).toLocaleString("ko-KR");
          tdValue.textContent = `${valFormatted} ${entry.unit || data.unit || ""}`;

          const tdDate = document.createElement("td");
          tdDate.style.cssText = "padding:3px 5px;text-align:right;font-family:monospace;color:#444;";
          tdDate.textContent = formatDateShort(entry.recordedAt);

          tr.append(tdRank, tdNick, tdValue, tdDate);
          $tbody[0].appendChild(tr);
        });
      }

      if (data.myBest) {
        const val = Number(data.myBest.metricValue || 0).toLocaleString("ko-KR");
        const acc = data.myBest.accuracy != null ? ` (정확도 ${data.myBest.accuracy}%)` : "";
        const dt = formatDateShort(data.myBest.recordedAt);
        $myBest.text(`최고 기록: ${val} ${data.myBest.unit || data.unit || ""}${acc} · ${dt}`);
      } else {
        $myBest.text("아직 내 완료 기록이 없습니다.");
      }
    } catch (err) {
      $tbody.html(`
        <tr>
          <td colspan="4" style="padding:18px 8px;text-align:center;color:#800000;">
            랭킹 조회 실패: 서버 연결을 확인하세요.
          </td>
        </tr>
      `);
      $myBest.text("서버 연결 오류");
    }
  }

  openNicknameDialog() {
    const identity = getWin98PlayerIdentity();
    const container = document.createElement("div");
    container.style.cssText = "padding:6px 4px;display:flex;flex-direction:column;gap:8px;font-size:12px;";

    const desc = document.createElement("div");
    desc.textContent =
      "사용할 닉네임(2~16자)을 입력하세요. 닉네임을 변경해도 고유 게스트 ID가 유지되어 기존 게임 기록과 랭킹이 그대로 연결됩니다.";

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 16;
    input.value = identity.nickname || "";
    input.placeholder = "예: 타자왕김대리";
    input.style.cssText = "padding:4px 6px;font-size:12px;width:100%;box-sizing:border-box;";

    const idInfo = document.createElement("div");
    idInfo.style.cssText = "font-size:11px;color:#555;font-family:monospace;";
    idInfo.textContent = `고유 식별자(guestId): ${identity.guestId}`;

    container.append(desc, input, idInfo);

    ShowDialogWindow({
      title: "닉네임 등록 / 변경",
      content: container,
      modal: true,
      buttons: [
        {
          label: "저장",
          isDefault: true,
          action: async () => {
            try {
              await updateWin98PlayerNickname(input.value);
              await this.fetchAndRenderRankings();
            } catch (err) {
              ShowDialogWindow({
                title: "닉네임 입력 오류",
                text: err.message || "닉네임을 저장할 수 없습니다.",
                modal: true,
              });
            }
          },
        },
        { label: "취소", action: () => {} },
      ],
    });
    setTimeout(() => input.focus(), 50);
  }
}
