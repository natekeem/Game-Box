import { launchApp } from '../system/app-manager.js';
import { ShowRunDialog } from '../shell/run-dialog.js';
import { ICONS } from './icons.js';
import { START_MENU_PATH, FAVORITES_PATH } from '../shell/start-menu/start-menu-utils.js';

const startMenuConfig = [
  {
    label: "프로그램",
    icon: ICONS.programs[32],
    isDynamic: true,
    path: START_MENU_PATH,
    submenu: [
      {
        id: "startup-folder",
        label: "시작 프로그램",
        icon: ICONS.programs[16],
        submenu: [],
      },
    ],
  },
  {
    label: "즐겨찾기",
    icon: ICONS.favorites[32],
    isDynamic: true,
    path: FAVORITES_PATH,
    submenu: [
      {
        label: "채널",
        icon: ICONS.programs[16],
        submenu: [
          {
            label: "AOL",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "aol.com",
            action: () => launchApp("internet-explorer", "aol.com"),
          },
          {
            label: "BBC",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "bbc.com",
            action: () => launchApp("internet-explorer", "bbc.com"),
          },
          {
            label: "CNN",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "cnn.com",
            action: () => launchApp("internet-explorer", "cnn.com"),
          },
          {
            label: "Detik",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "detik.com",
            action: () => launchApp("internet-explorer", "detik.com"),
          },
        ],
      },
      {
        label: "연결",
        icon: ICONS.programs[16],
        submenu: [
          {
            label: "Excite",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "excite.com",
            action: () => launchApp("internet-explorer", "excite.com"),
          },
          {
            label: "Google",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "google.com",
            action: () => launchApp("internet-explorer", "google.com"),
          },
          {
            label: "Infospace",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "infospace.com",
            action: () => launchApp("internet-explorer", "infospace.com"),
          },
          {
            label: "Lycos",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "lycos.com",
            action: () => launchApp("internet-explorer", "lycos.com"),
          },
          {
            label: "Netscape",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "netscape.com",
            action: () => launchApp("internet-explorer", "netscape.com"),
          },
          {
            label: "Yahoo",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "yahoo.com",
            action: () => launchApp("internet-explorer", "yahoo.com"),
          },
        ],
      },
      {
        label: "미디어",
        icon: ICONS.programs[16],
        submenu: [
          {
            label: "Amazon",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "amazon.com",
            action: () => launchApp("internet-explorer", "amazon.com"),
          },
          {
            label: "GeoCities",
            icon: ICONS.htmlFile[16],
            appId: "internet-explorer",
            args: "geocities.com",
            action: () => launchApp("internet-explorer", "geocities.com"),
          },
        ],
      },
      {
        label: "Microsoft",
        icon: ICONS.htmlFile[16],
        appId: "internet-explorer",
        args: "microsoft.com",
        action: () => launchApp("internet-explorer", "microsoft.com"),
      },
      {
        label: "MSN",
        icon: ICONS.htmlFile[16],
        appId: "internet-explorer",
        args: "msn.com",
        action: () => launchApp("internet-explorer", "msn.com"),
      },
    ],
  },
  {
    label: "문서",
    icon: ICONS.documents[32],
    submenu: [
      {
        label: "내 문서",
        icon: ICONS.folder[16],
        action: () =>
          launchApp("explorer", "/C:/My Documents"),
      },
    ],
  },
  {
    label: "설정",
    icon: ICONS.settings[32],
    submenu: [
      {
        label: "제어판",
        icon: ICONS.controlPanel[16],
        action: () => launchApp("control-panel"),
      },
    ],
  },
  {
    label: "찾기",
    icon: ICONS.find[32],
    submenu: [],
  },
  {
    label: "도움말",
    icon: ICONS.help[32],
    action: () => launchApp("help"),
  },
  {
    label: "실행...",
    icon: ICONS.run[32],
    action: () => ShowRunDialog(),
  },
];

export default startMenuConfig;
