import { IFrameApplication } from '../../system/iframe-application.js';
import { ICONS } from '../../config/icons.js';
import { ShowDialogWindow } from '../../shared/components/dialog-window.js';

export class HancomTyping97App extends IFrameApplication {
  static config = {
    id: "hancom-typing-97",
    title: "한컴타자연습",
    description: "1997년 오리지널 도스용 한컴타자연습 (산성비, 자리·낱말·짧은글·긴글 연습)",
    icon: ICONS.hancom97,
    category: "보조프로그램/게임",
    width: 700,
    height: 550,
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
        text: res?.error || "실제 타자 연습을 진행한 뒤 기록을 저장할 수 있습니다.",
        modal: true,
      });
      return;
    }
    const p = res.payload;
    const metricStr = p.score != null ? `${p.score}점` : `${p.typingSpeed} 타/분 (정확도 ${p.accuracy}%)`;
    ShowDialogWindow({
      title: "한컴타자연습 기록 저장 완료",
      text: `[${modeLabel}] 기록이 저장되었습니다!\n• 측정 기록: ${metricStr}\n• 오른쪽 GAME RANKING 창에서 순위를 확인하세요.`,
      modal: true,
    });
  }

  _createWindow() {
    const win = new window.$Window({
      title: this.title,
      outerWidth: this.width,
      outerHeight: this.height,
      resizable: this.resizable,
      icons: this.icon,
    });

    const menuBar = new window.MenuBar({
      "게임(&G)": [
        {
          label: "현재 연습/게임 결과 기록하기(&S)",
          submenu: [
            { label: "자리연습 기록 저장", action: () => this._recordCurrentSession("position", "자리연습") },
            { label: "낱말연습 기록 저장", action: () => this._recordCurrentSession("word", "낱말연습") },
            { label: "짧은글 연습 기록 저장", action: () => this._recordCurrentSession("short", "짧은글 연습") },
            { label: "긴글 연습 기록 저장", action: () => this._recordCurrentSession("long", "긴글 연습") },
            "MENU_DIVIDER",
            { label: "산성비 게임 점수 저장", action: () => this._recordCurrentSession("acid-rain", "산성비") },
            { label: "침략자 게임 점수 저장", action: () => this._recordCurrentSession("invader", "침략자") },
          ],
        },
        "MENU_DIVIDER",
        {
          label: "처음부터 다시 시작(&R)",
          action: () => {
            if (this.$iframe && this.$iframe[0]) {
              const cw = this.$iframe[0].contentWindow;
              if (cw && typeof cw.launchDosGame === "function") {
                cw.launchDosGame("97");
              } else {
                this.$iframe.attr("src", "/?v=97&embed=win98&t=" + Date.now());
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
          label: "한/영 전환 및 조작 안내(&K)",
          action: () => {
            ShowDialogWindow({
              title: "한컴타자연습 97 조작 안내",
              text:
                "• 화면 안쪽을 마우스로 한 번 클릭한 뒤 키보드로 조작하세요.\n" +
                "• 메뉴 이동: 방향키(↑ ↓ ← →) 및 Enter / ESC\n" +
                "• DOS 내부 한/영 전환: Shift + Space 또는 오른쪽 Alt(한/영) 키\n" +
                "  (브라우저/OS의 한/영 상태는 '영문(A)'으로 두고 게임 내부에서 Shift+Space로 전환하면 가장 정확합니다.)",
              modal: true,
            });
          },
        },
        "MENU_DIVIDER",
        {
          label: "한컴타자연습 97 정보(&A)...",
          action: () => {
            ShowDialogWindow({
              title: "한컴타자연습 97 정보",
              text:
                "한글과컴퓨터 한컴타자연습 97 (DOS 원본 에뮬레이션)\n\n" +
                "자리연습 · 낱말연습 · 짧은글 · 긴글 · 산성비 타자게임 지원\n" +
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
      .attr("src", "/?v=97&embed=win98")
      .attr("allow", "autoplay; fullscreen")
      .css({
        border: "none",
        width: "100%",
        flex: "1 1 auto",
        height: "100%",
        background: "#000",
      });

    const $statusBar = window.$("<div>")
      .addClass("status-bar")
      .css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "2px 6px",
        background: "#c0c0c0",
        borderTop: "1px solid #808080",
        fontSize: "11px",
        color: "#000",
        flexShrink: 0,
        userSelect: "none",
      })
      .html(
        '<span>💡 <b>한/영 전환:</b> 영문(A) 상태에서 <b>Shift + Space</b> (또는 한/영키)</span>' +
        '<span>방향키 · Enter · ESC</span>'
      );

    win.$content.append(this.$iframe, $statusBar);

    return win;
  }
}
