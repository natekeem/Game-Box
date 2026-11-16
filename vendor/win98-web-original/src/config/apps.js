// src/config/apps.js
import { ZenExplorerApp } from '../shell/explorer/explorer-app.js';
import { ShowDialogWindow } from '../shared/components/dialog-window.js';
import { getIcon } from '../shared/utils/icon-resolver.js';
import {
  getRecycleBinItems,
} from '../system/recycle-bin-utils.js';
import { SPECIAL_FOLDER_PATHS } from './special-folders.js';
import { appRegistry } from './app-registry.js';

// --- Dynamic App Loading ---

const KO_APP_TRANSLATIONS = {
  "about": { title: "시스템 정보 (Windows 98)", category: "보조프로그램/시스템 도구" },
  "agent": { title: "길잡이 (Clippy)", category: "보조프로그램" },
  "app-maker": { title: "웹 바로 가기 만들기", category: "보조프로그램/시스템 도구" },
  "buggy-program": { title: "오류 테스트 프로그램", category: "" },
  "buy-me-a-coffee": { title: "원작자 후원 안내", category: "" },
  "calculator": { title: "계산기", category: "보조프로그램" },
  "command": { title: "MS-DOS 프롬프트", category: "" },
  "cursor-explorer": { title: "마우스 커서 탐색기", category: "보조프로그램/시스템 도구" },
  "defrag": { title: "디스크 조각 모음", category: "보조프로그램/시스템 도구" },
  "desktop-themes": { title: "바탕 화면 테마", category: "제어판" },
  "display-properties": { title: "디스플레이 등록 정보", category: "제어판" },
  "diablo": { title: "디아블로 (Diablo)", category: "보조프로그램/게임" },
  "doom": { title: "둠 (DOOM)", category: "보조프로그램/게임" },
  "keen": { title: "커맨더 킨 (Commander Keen)", category: "보조프로그램/게임" },
  "prince-of-persia": { title: "페르시아의 왕자", category: "보조프로그램/게임" },
  "quake": { title: "퀘이크 (Quake)", category: "보조프로그램/게임" },
  "sim-city-2000": { title: "심시티 2000 (SimCity 2000)", category: "보조프로그램/게임" },
  "dos-games-downloader": { title: "고전 DOS 게임 다운로더", category: "보조프로그램/게임" },
  "dx-ball": { title: "DX-Ball (벽돌깨기)", category: "보조프로그램/게임" },
  "esheep": { title: "귀여운 양 (eSheep)", category: "보조프로그램/엔터테인먼트" },
  "flash-player": { title: "Macromedia 플래시 플레이어 6", category: "보조프로그램/엔터테인먼트" },
  "freecell": { title: "프리셀 (FreeCell)", category: "보조프로그램/게임" },
  "help": { title: "Windows 도움말", category: "" },
  "image-viewer": { title: "이미지 뷰어", category: "보조프로그램" },
  "media-player": { title: "Windows 미디어 플레이어", category: "보조프로그램/엔터테인먼트" },
  "minesweeper": { title: "지뢰 찾기", category: "보조프로그램/게임" },
  "mouse-properties": { title: "마우스 등록 정보", category: "제어판" },
  "notepad": { title: "메모장", category: "보조프로그램" },
  "paint": { title: "그림판", category: "보조프로그램" },
  "pdf-viewer": { title: "Acrobat PDF 리더", category: "보조프로그램" },
  "pinball": { title: "3D 핀볼 (Space Cadet)", category: "보조프로그램/게임" },
  "solitaire": { title: "카드놀이 (Solitaire)", category: "보조프로그램/게임" },
  "sound-scheme-explorer": { title: "시스템 소리 탐색기", category: "보조프로그램/엔터테인먼트" },
  "spider-solitaire": { title: "스파이더 카드놀이", category: "보조프로그램/게임" },
  "task-manager": { title: "작업 관리자", category: "보조프로그램/시스템 도구" },
  "tips": { title: "Windows 98 시작 안내", category: "보조프로그램/시스템 도구" },
  "webamp": { title: "Winamp", category: "보조프로그램/엔터테인먼트" },
  "win-98-camera": { title: "디지털 카메라", category: "보조프로그램/엔터테인먼트" },
  "wordpad": { title: "워드패드", category: "보조프로그램" },
  "explorer": { title: "Windows 탐색기", category: "" },
  "hancom-typing-97": { title: "한컴타자연습", category: "보조프로그램/게임" },
  "hanme-typing-30": { title: "한메타자연습", category: "보조프로그램/게임" },
  "pikachu-volleyball": { title: "피카츄 배구", category: "보조프로그램/게임" },
  "retro-game-guide": { title: "게임 가이드", category: "보조프로그램/게임" },
  "retro-ranking": { title: "GAME RANKING", category: "보조프로그램/게임" },
};

const KO_CATEGORY_MAP = {
  "Accessories": "보조프로그램",
  "Accessories/Games": "보조프로그램/게임",
  "Accessories/Entertainment": "보조프로그램/엔터테인먼트",
  "Accessories/System Tools": "보조프로그램/시스템 도구",
};

export const appClasses = {};
const staticConfigs = [];

for (const key in appRegistry) {
  const { config, importApp } = appRegistry[key];
  const configs = Array.isArray(config) ? config : [config];
  configs.forEach((c) => {
    if (c.id) {
      const ko = KO_APP_TRANSLATIONS[c.id];
      const localizedConfig = {
        ...c,
        title: ko?.title ?? c.title,
        category: ko?.category !== undefined ? ko.category : (KO_CATEGORY_MAP[c.category] ?? c.category),
      };
      appClasses[c.id] = importApp;
      staticConfigs.push({ ...localizedConfig, appClass: importApp });
    }
  });
}

// --- Static & System App Definitions ---

const systemApps = [
  {
    id: "my-computer",
    title: "내 컴퓨터",
    description: "컴퓨터의 디스크 드라이브와 폴더를 찾아봅니다.",
    get icon() {
      return getIcon("myComputer");
    },
    action: {
      type: "function",
      handler: () => {
        window.System.launchApp("explorer", {
          filePath: "/",
          windowId: "my-computer",
        });
      },
    },
  },
  {
    id: "internet-explorer",
    title: "Internet Explorer",
    description: "인터넷 웹 페이지를 탐색합니다.", category: "",
    get icon() {
      return getIcon("internet-explorer");
    },
    action: {
      type: "function",
      handler: (data) => {
        window.System.launchApp("explorer", data || "azay.rahmad");
      },
    },
  },
  {
    id: "my-briefcase",
    title: "내 서류 가방",
    description: "파일을 보관하고 동기화합니다.",
    get icon() {
      return getIcon("briefcase");
    },
    action: {
      type: "function",
      handler: () => {
        window.System.launchApp("explorer", {
          filePath: "/folder-briefcase",
          windowId: "my-briefcase",
        });
      },
    },
  },
  {
    id: "recycle-bin",
    title: "휴지통",
    description:
      "삭제한 파일과 폴더가 들어 있으며, 복원하거나 완전히 삭제할 수 있습니다.",
    get icon() {
      const items = getRecycleBinItems();
      return items.length > 0
        ? getIcon("recycleBinFull")
        : getIcon("recycleBinEmpty");
    },
    action: {
      type: "function",
      handler: () => {
        window.System.launchApp("explorer", {
          filePath: "/Recycle Bin",
          windowId: "recycle-bin",
        });
      },
    },
    contextMenu: [
      {
        label: "휴지통 비우기(&B)",
        action: () => {
          ShowDialogWindow({
            title: "휴지통 비우기 확인",
            text: "휴지통에 있는 모든 항목을 영구히 삭제하시겠습니까?",
            modal: true,
            buttons: [
              {
                label: "예(&Y)",
                isDefault: true,
                action: async () => {
                  if (window.RecycleBinManager) {
                    await window.RecycleBinManager.emptyAllRecycleBins();
                    playSound("EmptyRecycleBin");
                  }
                },
              },
              { label: "아니오(&N)" },
            ],
          });
        },
        enabled: () => {
            return true;
        },
      },
      "MENU_DIVIDER",
      {
        label: "열기(&O)",
        action: "open",
        default: true,
      },
      {
        label: "등록 정보(&R)",
        action: "properties",
      },
    ],
  },
  {
    id: "network-neighborhood",
    title: "네트워크 환경",
    description: "네트워크 리소스를 탐색합니다.",
    get icon() {
      return getIcon("networkNeighborhood");
    },
    action: {
      type: "function",
      handler: () => {
        window.System.launchApp("explorer", {
          filePath: "/Network Neighborhood",
          windowId: "network-neighborhood",
        });
      },
    },
  },
  {
    id: "my-documents",
    title: "내 문서",
    description: "문서, 그래픽 및 기타 파일을 저장하는 기본 폴더입니다.",
    get icon() {
      return getIcon("folder");
    },
    action: {
      type: "function",
      handler: () => {
        window.System.launchApp("explorer", {
          filePath: SPECIAL_FOLDER_PATHS["my-documents"],
          windowId: "my-documents",
        });
      },
    },
  },
  {
    id: "control-panel",
    title: "제어판",
    description: "시스템 설정 및 환경을 변경합니다.",
    get icon() {
      return getIcon("controlPanel");
    },
    action: {
      type: "function",
      handler: () => {
        window.System.launchApp("explorer", {
          filePath: "/Control Panel",
          windowId: "control-panel",
        });
      },
    },
  },
  {
    id: "songs",
    title: "음악 폴더",
    description: "음악 폴더 바로 가기입니다.",
    get icon() {
      return getIcon("folderClosed");
    },
    action: {
      type: "function",
      handler: () => {
        window.System.launchApp("explorer", {
          filePath: "/drive-d/folder-songs",
          windowId: "songs",
        });
      },
    },
  },
  {
    id: "alertTest",
    title: "알림 테스트",
    description: "대화 상자 테스트입니다.",
    get icon() {
      return getIcon("about");
    },
    action: {
      type: "function",
      handler: () => {
        ShowDialogWindow({
          title: "알림",
          text: "알림 창이 정상적으로 작동합니다.",
          soundEvent: "SystemHand",
          get contentIconUrl() {
            return getIcon("about", 32);
          },
          buttons: [{ label: "확인", isDefault: true }],
        });
      },
    },
  },
  {
    id: "windows-update",
    title: "Windows Update",
    description: "웹 애플리케이션을 최신 버전으로 업데이트합니다.",
    get icon() {
      return getIcon("windowsUpdate");
    },
    action: {
      type: "function",
      handler: async () => {
        const { showUpdateConfirmation } = await import("../system/update-manager.js");
        await showUpdateConfirmation();
      },
    },
  },
];

// --- Combine and Export ---

if (ZenExplorerApp.config) {
  const explorerKoConfig = {
    ...ZenExplorerApp.config,
    title: "Windows 탐색기",
  };
  appClasses[ZenExplorerApp.config.id] = ZenExplorerApp;
  staticConfigs.push({ ...explorerKoConfig, appClass: ZenExplorerApp });
}

export const apps = [...systemApps, ...staticConfigs];
