/**
 * RetroGameGuide Bridge Reference
 *
 * The native Windows 98 Help viewer (`게임 가이드 — Windows 98 도움말`) is implemented in:
 * `vendor/win98-web-original/src/apps/retro-game-guide/retro-game-guide-app.js`
 * with a classic left table-of-contents pane and right content pane.
 */
export function openOrFocusRetroGameGuide(win98IframeElement) {
  const cw = win98IframeElement?.contentWindow;
  if (cw?.System?.launchApp) {
    return cw.System.launchApp('retro-game-guide');
  }
  return null;
}
