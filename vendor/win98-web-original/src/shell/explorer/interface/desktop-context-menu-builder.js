import { ContextMenuBuilder } from "./context-menu-builder.js";
import {
  getThemes,
  getCurrentTheme,
  setTheme,
} from "../../../system/theme-manager.js";
import {
  setColorMode,
  getCurrentColorMode,
  getColorModes,
} from "../../../system/color-mode-manager.js";
import screensaver from "../../../system/screensaver-utils.js";
import {
  getAvailableResolutions,
  setResolution,
  getCurrentResolutionId,
} from "../../../system/screen-manager.js";
import {
  getItem,
  setItem,
  removeItem,
  LOCAL_STORAGE_KEYS,
} from "../../../system/local-storage.js";
import { launchApp } from "../../../system/app-manager.js";
import ClipboardManager from "../file-operations/clipboard-manager.js";
import { launchDisplayPropertiesApp } from "../../display-properties/index.js";

export class DesktopContextMenuBuilder extends ContextMenuBuilder {
  buildBackgroundMenu(e) {
    const themes = getThemes();

    const setWallpaper = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (readerEvent) => {
            const dataUrl = readerEvent.target.result;
            setItem(LOCAL_STORAGE_KEYS.WALLPAPER, dataUrl);
            document.dispatchEvent(new CustomEvent("wallpaper-changed"));
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };

    const removeWallpaper = () => {
      removeItem(LOCAL_STORAGE_KEYS.WALLPAPER);
      document.dispatchEvent(new CustomEvent("wallpaper-changed"));
    };

    const getWallpaperMode = () =>
      getItem(LOCAL_STORAGE_KEYS.WALLPAPER_MODE) || "tile";
    const setWallpaperMode = (mode) => {
      setItem(LOCAL_STORAGE_KEYS.WALLPAPER_MODE, mode);
      document.dispatchEvent(new CustomEvent("wallpaper-changed"));
    };

    const getMonitorType = () =>
      getItem(LOCAL_STORAGE_KEYS.MONITOR_TYPE) || "TFT";
    const setMonitorType = (type) => {
      setItem(LOCAL_STORAGE_KEYS.MONITOR_TYPE, type);
      if (type === "CRT") {
        document.body.classList.add("scanlines");
      } else {
        document.body.classList.remove("scanlines");
      }
    };

    const menuItems = [
      {
        label: "아이콘 정렬(&I)",
        submenu: [
          { label: "이름순(&N)", action: () => this.app.sortIcons("name") },
          { label: "크기순(&S)", action: () => this.app.sortIcons("size") },
          { label: "종류순(&T)", action: () => this.app.sortIcons("type") },
          { label: "날짜순(&D)", action: () => this.app.sortIcons("date") },
          "MENU_DIVIDER",
          {
            label: "자동 정렬(&A)",
            checkbox: {
              check: () => this.app.autoArrange,
              toggle: () => this.app.toggleAutoArrange(),
            },
          },
        ],
      },
      "MENU_DIVIDER",
      {
        label: "붙여넣기(&P)",
        action: () => this.app.fileOps.pasteItems(this.app.currentPath),
        enabled: () => !ClipboardManager.isEmpty(),
      },
      {
        label: "바로 가기 붙여넣기(&S)",
        action: () => this.app.fileOps.pasteShortcuts(this.app.currentPath),
        enabled: () =>
          !ClipboardManager.isEmpty() && ClipboardManager.operation === "copy",
      },
      "MENU_DIVIDER",
      {
        label: "새로 만들기(&W)",
        submenu: [
          {
            label: "폴더(&F)",
            action: () => this.app.fileOps.createNewFolder(),
          },
          {
            label: "텍스트 문서(&T)",
            action: () => this.app.fileOps.createNewTextFile(),
          },
        ],
      },
      "MENU_DIVIDER",
      {
        label: "배경 무늬(&B)",
        submenu: [
          {
            label: "배경 무늬 설정...",
            action: setWallpaper,
          },
          {
            label: "배경 무늬 제거",
            action: removeWallpaper,
          },
          "MENU_DIVIDER",
          {
            radioItems: [
              { label: "가운데", value: "center" },
              { label: "바둑판식", value: "tile" },
              { label: "늘이기", value: "stretch" },
            ],
            getValue: () => getWallpaperMode(),
            setValue: (value) => setWallpaperMode(value),
            ariaLabel: "배경 무늬 표시 방식",
          },
        ],
      },
      {
        label: "색상 모드",
        submenu: [
          {
            radioItems: Object.entries(getColorModes()).map(([id, mode]) => ({
              label: mode.name,
              value: id,
            })),
            getValue: () => getCurrentColorMode(),
            setValue: (value) => setColorMode(value),
            ariaLabel: "색상 모드",
          },
        ],
      },
      "MENU_DIVIDER",
      {
        label: "바탕 화면 테마",
        submenu: [
          {
            radioItems: Object.values(themes).map((theme) => ({
              label: theme.name,
              value: theme.id,
            })),
            getValue: () => getCurrentTheme(),
            setValue: async (value) => {
              await setTheme(value);
            },
            ariaLabel: "바탕 화면 테마",
          },
        ],
      },
      {
        label: "모니터 종류",
        submenu: [
          {
            radioItems: [
              { label: "LCD 평면 모니터 (선명함)", value: "TFT" },
              { label: "CRT 볼록 모니터 (주사선)", value: "CRT" },
            ],
            getValue: () => getMonitorType(),
            setValue: (value) => setMonitorType(value),
            ariaLabel: "모니터 종류",
          },
        ],
      },
      "MENU_DIVIDER",
      {
        label: "화면 해상도",
        submenu: [
          {
            radioItems: getAvailableResolutions().map((res) => ({
              label: res === "fit" ? "창 크기에 맞춤" : res,
              value: res,
            })),
            getValue: () => getCurrentResolutionId(),
            setValue: (value) => setResolution(value),
            ariaLabel: "화면 해상도",
          },
        ],
      },
      "MENU_DIVIDER",
      {
        label: "화면 보호기",
        submenu: [
          {
            radioItems: [
              { label: "(없음)", value: "none" },
              { label: "3D 꽃상자 (FlowerBox)", value: "flowerbox" },
              { label: "3D 미로 (3D Maze)", value: "maze" },
            ],
            getValue: () => screensaver.getCurrentScreensaver(),
            setValue: (value) => {
              screensaver.setCurrentScreensaver(value);
            },
            ariaLabel: "화면 보호기 선택",
          },
          "MENU_DIVIDER",
          {
            label: "대기 시간",
            submenu: [
              {
                radioItems: [
                  { label: "1분", value: 60000 },
                  { label: "5분", value: 300000 },
                  { label: "30분", value: 1800000 },
                  { label: "1시간", value: 3600000 },
                ],
                getValue: () =>
                  getItem(LOCAL_STORAGE_KEYS.SCREENSAVER_TIMEOUT) || 300000,
                setValue: (value) => {
                  setItem(LOCAL_STORAGE_KEYS.SCREENSAVER_TIMEOUT, value);
                },
                ariaLabel: "화면 보호기 대기 시간",
              },
            ],
          },
        ],
      },
      "MENU_DIVIDER",
      {
        label: "등록 정보(&R)",
        action: () => launchDisplayPropertiesApp(),
      },
    ];

    return menuItems;
  }
}
