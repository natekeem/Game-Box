import { mounts } from "@zenfs/core";
import { ICONS } from "../../../config/icons.js";
import {
  requestBusyState,
  releaseBusyState,
} from "../../../system/busy-state-manager.js";
import { RecycleBinManager } from "../file-operations/recycle-bin-manager.js";
import { PropertiesManager } from "../file-operations/properties-manager.js";
import { RemovableDiskManager } from "../drives/removable-disk-manager.js";
import { getParentPath, getPathName } from "../navigation/path-utils.js";
import ClipboardManager from "../file-operations/clipboard-manager.js";
import { ShellManager } from "../extensions/shell-manager.js";
import { ShowDialogWindow } from "../../../shared/components/dialog-window.js";
import { playSound } from "../../../system/sound-manager.js";
import { launchApp } from "../../../system/app-manager.js";

export class ContextMenuBuilder {
  constructor(app) {
    this.app = app;
  }

  buildItemMenu(e, icon) {
    const path = icon.getAttribute("data-path");
    const type = icon.getAttribute("data-type");
    const selectedIcons = [...this.app.iconManager.selectedIcons];
    const selectedPaths = selectedIcons.map((i) => i.getAttribute("data-path"));
    const isRootItem = selectedPaths.some((p) => getParentPath(p) === "/");
    const anyVirtual = selectedIcons.some(
      (i) => i.getAttribute("data-is-virtual") === "true",
    );
    const isOnReadOnlyDrive = selectedPaths.some((p) => p.startsWith("/E:"));
    const isFloppy = path === "/A:";
    const isFloppyMounted = mounts.has("/A:");
    const isCD = path === "/E:";
    const isCDMounted = mounts.has("/E:");
    const driveLetterMatch = path.match(/^\/([A-Z]):$/);
    const driveLetter = driveLetterMatch
      ? driveLetterMatch[1].toUpperCase()
      : null;
    const isRemovableDiskMounted =
      driveLetter && RemovableDiskManager.isMounted(driveLetter);
    const isRecycledItem = RecycleBinManager.isRecycledItemPath(path);
    const isRecycleBin = RecycleBinManager.isRecycleBinPath(path);
    const isGlobalRecycleBin =
      path === "/Recycle Bin" || path === "/Desktop/Recycle Bin";

    let menuItems = [];

    if (isRecycledItem) {
      menuItems = [
        {
          label: "복원(&R)",
          action: () => this.app.fileOps.restoreItems(selectedPaths),
          default: true,
        },
        "MENU_DIVIDER",
        {
          label: "잘라내기(&T)",
          action: () => this.app.fileOps.cutItems(selectedPaths),
        },
        {
          label: "삭제(&D)",
          action: () => this.app.fileOps.deleteItems(selectedPaths, true),
        },
        "MENU_DIVIDER",
        {
          label: "등록 정보(&P)",
          action: async () => {
            const isMyComputerSelected = selectedPaths.some(
              (p) => p === "/" || p === "/Desktop/My Computer",
            );
            if (isMyComputerSelected) {
              const { launchAboutApp } = await import("../../about/index.js");
              launchAboutApp();
              return;
            }
            const busyId = `properties-${Math.random()}`;
            requestBusyState(busyId, this.app.win.element);
            try {
              await PropertiesManager.show(selectedPaths);
            } finally {
              releaseBusyState(busyId, this.app.win.element);
            }
          },
        },
      ];
    } else {
      menuItems = [
        {
          label: "열기(&O)",
          action: async () => {
            const handled = await ShellManager.onOpen(path, this.app);
            if (handled) return;

            if (type === "directory") {
              this.app.navigateTo(path);
            } else {
              this.app.openFile(icon);
            }
          },
          default: true,
        },
      ];

      if (isFloppy) {
        if (isFloppyMounted) {
          menuItems.push({
            label: "꺼내기(&J)",
            action: () => this.app.driveManager.ejectFloppy(),
          });
        } else {
          menuItems.push({
            label: "넣기(&I)",
            action: () => this.app.driveManager.insertFloppy(),
          });
        }
      }

      if (isCD) {
        if (isCDMounted) {
          menuItems.push({
            label: "꺼내기(&J)",
            action: () => this.app.driveManager.ejectCD(),
          });
        } else {
          menuItems.push({
            label: "넣기(&I)",
            action: () => this.app.driveManager.insertCD(),
          });
        }
      }

      if (isRemovableDiskMounted) {
        menuItems.push({
          label: "꺼내기(&J)",
          action: () => this.app.driveManager.ejectRemovableDisk(driveLetter),
        });
      }

      if (isRecycleBin) {
        menuItems.push({
          label: "휴지통 비우기(&B)",
          action: () => this.app.fileOps.emptyRecycleBin(path),
          enabled: () => RecycleBinManager.isFullSync(path),
        });
        menuItems.push("MENU_DIVIDER");
      }

      menuItems.push(
        "MENU_DIVIDER",
        {
          label: "보내기(&N)",
          enabled: () => !isRootItem && !isRecycleBin && !anyVirtual,
          submenu: [
            {
              label: "바탕 화면 (바로 가기 만들기)",
              icon: ICONS.desktop_old[16],
              action: () =>
                this.app.fileOps.createShortcuts(
                  selectedPaths,
                  "/C:/WINDOWS/Desktop",
                ),
            },
          ],
        },
        "MENU_DIVIDER",
        {
          label: "잘라내기(&T)",
          action: () => this.app.fileOps.cutItems(selectedPaths),
          enabled: () => !isRootItem && !isRecycleBin && !anyVirtual,
        },
        {
          label: "복사(&C)",
          action: () => this.app.fileOps.copyItems(selectedPaths),
          enabled: () => !isRecycleBin,
        },
        {
          label: "붙여넣기(&P)",
          action: () => this.app.fileOps.pasteItems(path),
          enabled: () => !ClipboardManager.isEmpty() && type === "directory",
        },
        {
          label: "바로 가기 붙여넣기(&S)",
          action: () => this.app.fileOps.pasteShortcuts(path),
          enabled: () =>
            !ClipboardManager.isEmpty() &&
            ClipboardManager.operation === "copy" &&
            type === "directory",
        },
        {
          label: "바로 가기 만들기(&S)",
          action: () => this.app.fileOps.createShortcuts(selectedPaths),
          enabled: () => !isRootItem && !isRecycleBin && !anyVirtual,
        },
        "MENU_DIVIDER",
        {
          label: "삭제(&D)",
          action: () => this.app.fileOps.deleteItems(selectedPaths),
          enabled: () =>
            !isRootItem && !isRecycleBin && !isOnReadOnlyDrive && !anyVirtual,
        },
        {
          label: "이름 바꾸기(&M)",
          action: () => this.app.fileOps.renameItem(path),
          enabled: () =>
            !isRootItem &&
            selectedPaths.length === 1 &&
            !isRecycleBin &&
            !anyVirtual,
        },
        "MENU_DIVIDER",
        {
          label: "등록 정보(&R)",
          action: async () => {
            const isMyComputerSelected = selectedPaths.some(
              (p) => p === "/" || p === "/Desktop/My Computer",
            );
            if (isMyComputerSelected) {
              const { launchAboutApp } = await import("../../about/index.js");
              launchAboutApp();
              return;
            }
            const busyId = `properties-${Math.random()}`;
            requestBusyState(busyId, this.app.win.element);
            try {
              await PropertiesManager.show(selectedPaths);
            } finally {
              releaseBusyState(busyId, this.app.win.element);
            }
          },
        },
      );
    }
    return menuItems;
  }

  buildBackgroundMenu(e) {
    const isRoot = this.app.currentPath === "/";
    const isVirtualDesktop = this.app.currentPath === "/Desktop";
    const isGlobalRecycleBin = this.app.currentPath === "/Recycle Bin";
    const menuItems = [];

    if (isGlobalRecycleBin) {
      menuItems.push({
        label: "휴지통 비우기(&B)",
        action: () => this.app.fileOps.emptyRecycleBin("/Recycle Bin"),
        enabled: () => RecycleBinManager.isFullSync("/Recycle Bin"),
      });
      menuItems.push("MENU_DIVIDER");
    }

    menuItems.push(
      {
        label: "보기(&V)",
        submenu: [
          {
            radioItems: [
              { label: "큰 아이콘(&G)", value: "large" },
              { label: "작은 아이콘(&M)", value: "small" },
              { label: "간단히(&L)", value: "list" },
              { label: "자세히(&D)", value: "details" },
            ],
            getValue: () => this.app.viewMode,
            setValue: (value) => this.app.setViewMode(value),
          },
        ],
      },
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
            enabled: () =>
              this.app.viewMode === "large" || this.app.viewMode === "small",
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
        enabled: () =>
          !ClipboardManager.isEmpty() &&
          (!isRoot || isVirtualDesktop) &&
          !isGlobalRecycleBin,
      },
      {
        label: "바로 가기 붙여넣기(&S)",
        action: () => this.app.fileOps.pasteShortcuts(this.app.currentPath),
        enabled: () =>
          !ClipboardManager.isEmpty() &&
          ClipboardManager.operation === "copy" &&
          (!isRoot || isVirtualDesktop) &&
          !isGlobalRecycleBin,
      },
      "MENU_DIVIDER",
      {
        label: "새로 만들기(&W)",
        enabled: () => (!isRoot || isVirtualDesktop) && !isGlobalRecycleBin,
        submenu: [
          {
            label: "폴더(&F)",
            action: () => this.app.fileOps.createNewFolder(),
            enabled: () => (!isRoot || isVirtualDesktop) && !isGlobalRecycleBin,
          },
          {
            label: "텍스트 문서(&T)",
            action: () => this.app.fileOps.createNewTextFile(),
          },
        ],
      },
      "MENU_DIVIDER",
      {
        label: "등록 정보(&R)",
        action: async () => {
          if (
            this.app.currentPath === "/" ||
            this.app.currentPath === "/Desktop/My Computer"
          ) {
            const { launchAboutApp } = await import("../../about/index.js");
            launchAboutApp();
            return;
          }
          const busyId = `properties-${Math.random()}`;
          requestBusyState(busyId, this.app.win.element);
          try {
            await PropertiesManager.show([this.app.currentPath]);
          } finally {
            releaseBusyState(busyId, this.app.win.element);
          }
        },
      },
    );
    return menuItems;
  }
}
