import { IFrameApplication } from '../../system/iframe-application.js';
import { ICONS } from '../../config/icons.js';
import { ShowDialogWindow } from '../../shared/components/dialog-window.js';

export class HanmeTyping30App extends IFrameApplication {
  static config = {
    id: "hanme-typing-30",
    title: "한메타자교사 3.0",
    description: "1994년 한메소프트 오리지널 한메타자교사 3.0 (베네치아 타자게임, 단문/장문 연습)",
    icon: ICONS.hanme30,
    category: "보조프로그램/게임",
    width: 766,
    height: 642,
    resizable: true,
    isSingleton: true,
  };

  constructor(config) {
    super(config);
  }

  _recordCurrentSession(gameMode, modeLabel) {
    const cw = this.$iframe?.[0]?.contentWindow;
    if (!cw || typeof cw.completeDosTypingSession !== "function") {
      ShowDialogWindow({
        title: "기록 안내",
        text: "게임 화면이 아직 준비되지 않았습니다.",
        modal: true,
      });
      return;
    }
    const res = cw.completeDosTypingSession({ gameMode });
    if (!res?.ok) {
      ShowDialogWindow({
        title: "연습 기록 안내",
        text: res?.error || "실제 타자 연습이나 베네치아 게임을 진행한 뒤 기록을 저장할 수 있습니다.",
        modal: true,
      });
      return;
    }
    const p = res.payload;
    const metricStr = p.score != null ? `${p.score}점` : `${p.typingSpeed} 타/분 (정확도 ${p.accuracy}%)`;
    ShowDialogWindow({
      title: "한메타자연습 기록 저장 완료",
      text: `[${modeLabel}] 기록이 저장되었습니다!\n• 측정 기록: ${metricStr}\n• 오른쪽 GAME RANKING 창에서 순위를 확인하세요.`,
      modal: true,
    });
  }

  _createWindow() {
    let currentNickname = '';
    try {
      const raw = localStorage.getItem('gameBox_guest_identity_v1');
      if (raw) currentNickname = JSON.parse(raw)?.nickname || '';
    } catch {}
    const winTitle = currentNickname ? `${this.title} [플레이어: ${currentNickname}]` : this.title;

    const win = new window.$Window({
      title: winTitle,
      innerWidth: 760,
      innerHeight: 592,
      resizable: this.resizable,
      icons: this.icon,
    });

    const menuBar = new window.MenuBar({
      "게임(&G)": [
        {
          label: "현재 연습/게임 결과 기록하기(&S)",
          submenu: [
            { label: "베네치아 게임 점수 저장", action: () => this._recordCurrentSession("venezia", "베네치아 게임") },
            "MENU_DIVIDER",
            { label: "단문연습 기록 저장", action: () => this._recordCurrentSession("short", "단문연습") },
            { label: "장문연습 기록 저장", action: () => this._recordCurrentSession("long", "장문연습") },
            { label: "자리연습 기록 저장", action: () => this._recordCurrentSession("position", "자리연습") },
            { label: "낱말연습 기록 저장", action: () => this._recordCurrentSession("word", "낱말연습") },
          ],
        },
        "MENU_DIVIDER",
        {
          label: "처음부터 다시 시작(&R)",
          action: () => {
            if (this.$iframe && this.$iframe[0]) {
              const cw = this.$iframe[0].contentWindow;
              if (cw && typeof cw.launchDosGame === "function") {
                cw.launchDosGame("hanme");
              } else {
                this.$iframe.attr("src", "/?v=hanme&embed=win98&t=" + Date.now());
              }
            }
          },
        },
        {
          label: "전체 화면으로 보기(&F)",
          action: () => {
            if (this.$iframe && this.$iframe[0] && this.$iframe[0].requestFullscreen) {
              this.$iframe[0].requestFullscreen();
            }
          },
        },
        "MENU_DIVIDER",
        {
          label: "끝내기(&X)",
          action: () => win.close(),
        },
      ],
      "도움말(&H)": [
        {
          label: "베네치아 및 한/영 전환 안내(&K)",
          action: () => {
            ShowDialogWindow({
              title: "한메타자교사 3.0 조작 안내",
              text:
                "• 화면 안쪽을 마우스로 클릭한 뒤 방향키(↑ ↓ ← →)와 Enter로 메뉴를 선택하세요.\n" +
                "• 대표 게임: [베네치아] — 하늘에서 떨어지는 단어를 입력해 탑을 지키는 전설의 타자 게임!\n" +
                "• DOS 내부 한/영 전환: Shift + Space (PC 한/영키는 영문 상태로 두고 Shift+Space를 누르세요.)",
              modal: true,
            });
          },
        },
        "MENU_DIVIDER",
        {
          label: "한메타자교사 3.0 정보(&A)...",
          action: () => {
            ShowDialogWindow({
              title: "한메타자교사 3.0 정보",
              text:
                "한메소프트 한메타자교사 3.0 (1994, DOS 원본 HTT.EXE)\n\n" +
                "자리연습 · 낱말연습 · 단문연습 · 장문연습 · 베네치아 게임 수록\n" +
                "Windows 98 웹 데스크톱 통합 에디션",
              modal: true,
            });
          },
        },
      ],
    });

    win.setMenuBar(menuBar);

    win.$content.css({
      padding: 0,
      margin: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: "#000",
    });

    this.$iframe = window.$("<iframe>")
      .attr("src", "/?v=hanme&embed=win98")
      .attr("allow", "autoplay; fullscreen")
      .css({
        border: "none",
        width: "100%",
        flex: "1 1 auto",
        height: "570px",
        background: "#000",
        display: "block",
      });

    if (typeof win.onClosed === "function") {
      win.onClosed(() => {
        try {
          const cw = this.$iframe?.[0]?.contentWindow;
          if (cw && typeof cw.getDosSessionStats === "function") {
            const stats = cw.getDosSessionStats();
            if (stats && !stats.completed && stats.keystrokes >= 5) {
              cw.completeDosTypingSession({ gameMode: "venezia" });
            }
          }
        } catch (e) {}
      });
    }

    win.onFocus = () => {
      try {
        this.$iframe?.[0]?.contentWindow?.focus();
      } catch (e) {}
    };
    this.$iframe.on("load", () => {
      try {
        this.$iframe?.[0]?.contentWindow?.focus();
      } catch (e) {}
    });

    const playerTag = currentNickname ? `👤 플레이어: <b>${currentNickname}</b> | ` : '';
    const $statusBar = window.$("<div>")
      .addClass("status-bar")
      .css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px",
        background: "#c0c0c0",
        borderTop: "1px solid #808080",
        fontSize: "11px",
        color: "#000",
        height: "22px",
        lineHeight: "20px",
        flexShrink: 0,
        userSelect: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
      })
      .html(
        `<span>${playerTag}🏰 <b>베네치아 수록</b> · 한/영: <b>Shift+Space</b> · ⚡ <b>ESC 종료 시 자동 저장</b></span>` +
        '<span>한메타자교사 3.0</span>'
      );

    win.$content.append(this.$iframe, $statusBar);

    return win;
  }
}
