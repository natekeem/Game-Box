import ClipboardManager from "../file-operations/clipboard-manager.js";
import UndoManager from "../file-operations/undo-manager.js";
import { getParentPath, getDisplayName } from "../navigation/path-utils.js";
import { PropertiesManager } from "../file-operations/properties-manager.js";
import { launchApp } from "../../../system/app-manager.js";

/**
 * ToolbarBuilder - Constructs toolbar items for ZenExplorer
 */

export function getToolbarItems(app) {
  if (app.isWebPath(app.currentPath)) {
    return [
      "handler",
      {
        label: "Back",
        iconName: "back",
        action: () => app.goBack(),
        enabled: () => app.navHistory?.canGoBack(),
        submenu: () => {
          const history = app.navHistory.history;
          const index = app.navHistory.historyIndex;
          return history
            .slice(0, index)
            .reverse()
            .slice(0, 10)
            .map((path, i) => ({
              label: path,
              action: () => {
                const steps = i + 1;
                for (let s = 0; s < steps; s++) {
                  app.goBack();
                }
              },
            }));
        },
      },
      {
        label: "Forward",
        iconName: "forward",
        action: () => app.goForward(),
        enabled: () => app.navHistory?.canGoForward(),
        submenu: () => {
          const history = app.navHistory.history;
          const index = app.navHistory.historyIndex;
          return history
            .slice(index + 1)
            .slice(0, 10)
            .map((path, i) => ({
              label: path,
              action: () => {
                const steps = i + 1;
                for (let s = 0; s < steps; s++) {
                  app.goForward();
                }
              },
            }));
        },
      },
      {
        label: "Stop",
        iconName: "stop",
        action: () => {
          if (app.iframe && app.iframe.contentWindow) {
            app.iframe.contentWindow.stop();
          }
        },
      },
      {
        label: "Refresh",
        iconName: "refresh",
        action: () => {
          if (app.iframe && app.iframe.contentWindow) {
            app.iframe.contentWindow.location.reload();
          }
        },
      },
      {
        label: "Home",
        iconName: "home",
        action: () => app.navigateTo("azay.rahmad"),
      },
      "divider",
      {
        label: "Search",
        iconName: "search",
        enabled: false,
      },
      {
        label: "Favorites",
        iconName: "favorites",
        enabled: false,
      },
      {
        label: "History",
        iconName: "history",
        enabled: false,
      },
      "divider",
      {
        label: "Print",
        iconName: "print",
        enabled: false,
      },
    ];
  }

  const getSelectedPaths = () => {
    const selectedIcons = app.iconManager?.selectedIcons || new Set();
    return [...selectedIcons].map((icon) => icon.getAttribute("data-path"));
  };

  const isRoot = () => app.currentPath === "/";

  const getBackSubmenu = () => {
    const history = app.navHistory.history;
    const index = app.navHistory.historyIndex;
    return history
      .slice(0, index)
      .reverse()
      .map((path, i) => ({
        label: getDisplayName(path),
        action: () => {
          const steps = i + 1;
          for (let s = 0; s < steps; s++) {
            app.goBack();
          }
        },
      }));
  };

  const getForwardSubmenu = () => {
    const history = app.navHistory.history;
    const index = app.navHistory.historyIndex;
    return history.slice(index + 1).map((path, i) => ({
      label: getDisplayName(path),
      action: () => {
        const steps = i + 1;
        for (let s = 0; s < steps; s++) {
          app.goForward();
        }
      },
    }));
  };

  const cycleViewMode = () => {
    const modes = ["large", "small", "list", "details"];
    const currentIndex = modes.indexOf(app.viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    app.setViewMode(modes[nextIndex]);
  };

  const getViewIcon = () => {
    const iconMap = {
      large: "view_large_icons",
      small: "view_small_icons",
      list: "view_list",
      details: "view_details",
    };
    return iconMap[app.viewMode] || "view_large_icons";
  };

  return [
    {
      label: "뒤로",
      iconName: "back_explorer",
      action: () => app.goBack(),
      enabled: () => app.navHistory.canGoBack(),
      submenu: getBackSubmenu,
    },
    {
      label: "앞으로",
      iconName: "forward_explorer",
      action: () => app.goForward(),
      enabled: () => app.navHistory.canGoForward(),
      submenu: getForwardSubmenu,
    },
    {
      label: "위로",
      iconName: "up",
      action: () => app.goUp(),
      enabled: () => !isRoot(),
    },
    "divider",
    {
      label: "잘라내기",
      iconName: "cut",
      action: () => {
        app.fileOps.cutItems(getSelectedPaths());
      },
      enabled: () => {
        const paths = getSelectedPaths();
        return paths.length > 0 && !paths.some((p) => getParentPath(p) === "/");
      },
    },
    {
      label: "복사",
      iconName: "copy",
      action: () => {
        app.fileOps.copyItems(getSelectedPaths());
      },
      enabled: () => getSelectedPaths().length > 0,
    },
    {
      label: "붙여넣기",
      iconName: "paste",
      action: () => app.fileOps.pasteItems(app.currentPath),
      enabled: () => !ClipboardManager.isEmpty() && !isRoot(),
    },
    "divider",
    {
      label: "실행 취소",
      iconName: "undo",
      action: () => app.fileOps.undo(),
      enabled: () => UndoManager.canUndo(),
    },
    "divider",
    {
      label: "삭제",
      iconName: "delete",
      action: () => {
        app.fileOps.deleteItems(getSelectedPaths());
      },
      enabled: () => {
        const paths = getSelectedPaths();
        return paths.length > 0 && !paths.some((p) => getParentPath(p) === "/");
      },
    },
    {
      label: "등록 정보",
      iconName: "properties",
      action: async () => {
        const paths = getSelectedPaths();
        const targets = paths.length > 0 ? paths : [app.currentPath];
        const isMyComputerSelected = targets.some(
          (p) => p === "/" || p === "/Desktop/My Computer",
        );

        if (isMyComputerSelected) {
          const { launchAboutApp } = await import("../../about/index.js");
          launchAboutApp();
          return;
        }

        PropertiesManager.show(targets);
      },
    },
    "divider",
    {
      label: "보기",
      iconName: getViewIcon,
      action: cycleViewMode,
      submenu: [
        {
          radioItems: [
            { label: "큰 아이콘", value: "large" },
            { label: "작은 아이콘", value: "small" },
            { label: "간단히", value: "list" },
            { label: "자세히", value: "details" },
          ],
          getValue: () => app.viewMode,
          setValue: (value) => app.setViewMode(value),
        },
      ],
    },
  ];
}
