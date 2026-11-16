import { ShowDialogWindow } from "../shared/components/dialog-window.js";
import { ICONS } from "../config/icons.js";
import { playSound } from "./sound-manager.js";
import { refreshPrograms } from "../shell/start-menu/start-menu-utils.js";

/**
 * Handles the Windows Update logic
 */
export async function showUpdateConfirmation() {
  ShowDialogWindow({
    title: "Windows Update",
    text: "시스템 캐시를 정리하고 시작 메뉴 항목을 새로 고친 뒤 다시 시작하시겠습니까? (사용자 파일 및 설정은 유지됩니다.)",
    modal: true,
    showOverlay: true,
    get contentIconUrl() {
      return ICONS.windowsUpdate[32];
    },
    buttons: [
      {
        label: "예(&Y)",
        isDefault: true,
        action: async () => {
          playSound("SystemExit");

          // Clear Service Workers
          if ("serviceWorker" in navigator) {
            try {
              const registrations = await navigator.serviceWorker.getRegistrations();
              for (const registration of registrations) {
                await registration.unregister();
              }
            } catch (error) {
              console.error("Failed to unregister service workers:", error);
            }
          }

          // Clear Cache API
          if ("caches" in window) {
            try {
              const cacheNames = await caches.keys();
              for (const name of cacheNames) {
                await caches.delete(name);
              }
            } catch (error) {
              console.error("Failed to clear caches:", error);
            }
          }

          // Refresh start menu items
          try {
            await refreshPrograms();
          } catch (error) {
            console.error("Failed to refresh programs:", error);
          }

          // Reload the page
          window.location.reload();
        },
      },
      {
        label: "아니오(&N)",
        action: () => {},
      },
    ],
    soundEvent: "SystemQuestion",
  });
}
