/**
 * RetroRankingWindow Bridge Reference
 *
 * The actual Windows 98 `$Window` implementation lives inside the existing Windows 98 shell:
 * `vendor/win98-web-original/src/apps/retro-ranking/retro-ranking-app.js`
 * so that it natively shares the Windows 98 WindowManager, z-index focus stack,
 * taskbar button synchronization, and authentic Windows 98 gray bevel styling.
 *
 * This module provides a programmatic controller for host React components.
 */
import { RETRO_RANKING_TABS } from '../ranking/rankingUtils.js';

export { RETRO_RANKING_TABS };

export function openOrFocusRetroRankingWindow(win98IframeElement) {
  const cw = win98IframeElement?.contentWindow;
  if (cw?.System?.launchApp) {
    return cw.System.launchApp('retro-ranking');
  }
  return null;
}
