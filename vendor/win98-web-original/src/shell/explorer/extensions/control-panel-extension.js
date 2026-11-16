import { ICONS } from "../../../config/icons.js";
import { apps } from "../../../config/apps.js";
import { launchApp } from "../../../system/app-manager.js";
import { VirtualStats } from "./shell-manager.js";
import { getPathName } from "../navigation/path-utils.js";

/**
 * ControlPanelExtension - Shell extension for the virtual Control Panel folder
 */
export class ControlPanelExtension {
  constructor() {
    this.path = "/Control Panel";
    this.items = [
      {
        id: "display",
        name: "디스플레이",
        appId: "display-properties",
        description: "화면 배경, 화면 보호기, 배색 및 해상도를 변경합니다.",
      },
      {
        id: "themes",
        name: "바탕 화면 테마",
        appId: "desktop-themes",
        description: "바탕 화면의 테마와 아이콘, 소리 구성을 변경합니다.",
      },
      {
        id: "sounds",
        name: "사운드",
        appId: "sound-scheme-explorer",
        description: "시스템 효과음을 탐색하고 미리 듣습니다.",
      },
      {
        id: "themetocss",
        name: "테마 CSS 변환기",
        appId: "theme-to-css",
        description: "Windows 테마 파일을 CSS로 변환합니다.",
      },
      {
        id: "mouse",
        name: "마우스",
        appId: "cursor-explorer",
        description: "마우스 포인터 및 커서 구성표를 변경합니다.",
      },
    ];
  }

  /**
   * Check if this extension handles the given path
   * @param {string} path
   * @returns {boolean}
   */
  handlesPath(path) {
    return path === this.path || path.startsWith(this.path + "/");
  }

  /**
   * Get virtual stats for a path
   * @param {string} path
   * @returns {Promise<VirtualStats>}
   */
  async stat(path) {
    if (path === this.path) {
      return new VirtualStats({ isDirectory: true });
    }

    const name = getPathName(path);
    const item = this.items.find((i) => i.name === name);
    if (item) {
      return new VirtualStats({ isDirectory: false, isVirtual: true });
    }

    throw new Error(`ENOENT: no such file or directory, stat '${path}'`);
  }

  /**
   * Read virtual directory contents
   * @param {string} path
   * @returns {Promise<string[]|null>}
   */
  async readdir(path) {
    if (path === "/") {
      return ["Control Panel"];
    }
    if (path === this.path) {
      return this.items.map((i) => i.name);
    }
    return null;
  }

  /**
   * Get custom icon object for a path
   * @param {string} path
   * @returns {Object|null}
   */
  getIconObj(path) {
    if (path === this.path) {
      return ICONS.controlPanel;
    }

    const name = getPathName(path);
    const item = this.items.find((i) => i.name === name);
    if (item) {
      const app = apps.find((a) => a.id === item.appId);
      return app ? app.icon : ICONS.file;
    }

    return null;
  }

  /**
   * Get custom icon for a path
   * @param {string} path
   * @param {number} size
   * @returns {string|null}
   */
  getIcon(path, size = 32) {
    const iconObj = this.getIconObj(path);
    return iconObj ? iconObj[size] : null;
  }

  /**
   * Get columns for the Control Panel directory
   * @returns {Object[]}
   */
  getColumns() {
    return [
      { label: "Name", key: "name" },
      { label: "Description", key: "description" },
    ];
  }

  /**
   * Get column value for Control Panel items
   * @param {string} fullPath
   * @param {string} columnKey
   * @returns {string|null}
   */
  getColumnValue(fullPath, columnKey) {
    const name = getPathName(fullPath);
    const item = this.items.find((i) => i.name === name);
    if (item && columnKey === "description") {
      return item.description;
    }
    return null;
  }

  /**
   * Handle opening a path
   * @param {string} path
   * @param {Object} app - ZenExplorerApp instance
   * @returns {Promise<boolean>}
   */
  async onOpen(path, app) {
    if (path === this.path) {
      app.navigateTo(this.path);
      return true;
    }

    const name = getPathName(path);
    const item = this.items.find((i) => i.name === name);
    if (item) {
      launchApp(item.appId);
      return true;
    }

    return false;
  }
}
