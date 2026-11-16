import { IFrameApplication } from '../../system/iframe-application.js';
import { ICONS } from '../../config/icons.js';
import { ShowDialogWindow } from '../../shared/components/dialog-window.js';

export class PikachuVolleyballApp extends IFrameApplication {
  static config = {
    id: "pikachu-volleyball",
    title: "피카츄 배구",
    description: "1997년 SACHI SOFT 원작 피카츄 배구 (1인용 AI 대전, 2인 로컬, 온라인 P2P 매칭)",
    icon: ICONS.pikachuVolleyball,
    category: "보조프로그램/게임",
    width: 840,
    height: 640,
    resizable: true,
    isSingleton: true,
  };

  constructor(config) {
    super(config);
  }

  _clickInIframe(selector) {
    try {
      const doc = this.$iframe?.[0]?.contentDocument;
      const btn = doc?.querySelector(selector);
      if (btn) {
        btn.click();
        this.$iframe[0].contentWindow?.focus();
      }
    } catch (e) {
      console.warn("Iframe action failed:", e);
    }
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
          label: "⚡ 컴퓨터 AI 대전 시작(&A)",
          action: () => this._clickInIframe("#vs-computer-btn"),
        },
        {
          label: "👥 2인용 로컬 대전 시작(&L)",
          action: () => this._clickInIframe("#vs-local-btn"),
        },
        {
          label: "🎲 온라인 퀵 매치(&Q)",
          action: () => this._clickInIframe("#quick-match-btn"),
        },
        {
          label: "🤝 친구와 비공개 방 대전(&F)",
          action: () => this._clickInIframe("#with-your-friend-btn"),
        },
        "MENU_DIVIDER",
        {
          label: "로비 / 처음 화면으로(&R)",
          action: () => {
            if (this.$iframe) {
              this.$iframe.attr("src", "/pikachu-volleyball/ko/index.html?embed=win98&t=" + Date.now());
            }
          },
        },
        {
          label: "전체 화면으로 보기(&M)",
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
          label: "조작키 안내(&K)",
          action: () => {
            ShowDialogWindow({
              title: "피카츄 배구 조작법",
              text:
                "[1인용 AI 대전 / 1P]\n" +
                "• 이동 및 점프: 방향키(← ↑ → ↓) 또는 R, D, F, G\n" +
                "• 스파이크 / 서브: Enter 또는 Z 키\n" +
                "• 다이빙 슬라이딩: 좌우 방향키를 누른 채 Z 또는 Enter\n\n" +
                "[2인용 로컬 플레이]\n" +
                "• 1P(왼쪽): R D F G 이동 / Z 스파이크\n" +
                "• 2P(오른쪽): 방향키 이동 / Enter 스파이크",
              modal: true,
            });
          },
        },
        "MENU_DIVIDER",
        {
          label: "피카츄 배구 정보(&A)...",
          action: () => {
            ShowDialogWindow({
              title: "피카츄 배구 (Pikachu Volleyball) 정보",
              text:
                "1997년 SACHI SOFT / 투니버스 공개자료실 전설의 명작\n\n" +
                "• 1인용 컴퓨터 AI 대전 (명예의 전당 랭킹 연동)\n" +
                "• 2인용 한 키보드 로컬 대전\n" +
                "• WebRTC 기반 온라인 P2P 퀵 매치 및 친구 방 대전",
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
      background: "#0d1117",
    });

    this.$iframe = window.$("<iframe>")
      .attr("src", "/pikachu-volleyball/ko/index.html?embed=win98")
      .attr("allow", "autoplay; fullscreen")
      .css({
        border: "none",
        width: "100%",
        flex: "1 1 auto",
        height: "100%",
        background: "#0d1117",
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
        '<span>⚡ <b>조작키:</b> 방향키 이동 · <b>Enter / Z</b> 스파이크 · 메뉴에서 바로 AI 대전 시작 가능</span>' +
        '<span>SACHI SOFT 1997</span>'
      );

    win.$content.append(this.$iframe, $statusBar);

    return win;
  }
}
