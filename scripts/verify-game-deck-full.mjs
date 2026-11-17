import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = path.join(rootDir, 'tests', 'artifacts', 'game-deck');
fs.mkdirSync(artifactsDir, { recursive: true });

const port = 9877;
const staticRoot = rootDir;
const databasePath = path.resolve(rootDir, 'data', 'game-box-test.sqlite');

console.log('[FULL VERIFICATION] Starting GAME-BOX server on port', port);
const { server } = createGameBoxServer({
  staticRoot,
  databasePath,
  identityProvider: null,
});

await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));

const browser = await chromium.launch({
  executablePath: 'C:\\Users\\samsung\\AppData\\Local\\ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe',
  headless: true,
});

const context = await browser.newContext({
  viewport: { width: 1400, height: 900 },
});

await context.addInitScript(() => {
  localStorage.setItem('gameBox_guest_identity_v1', JSON.stringify({
    guestId: 'guest-deck-master',
    nickname: 'ArcadeMaster',
    isRegistered: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
});

const page = await context.newPage();

console.log('[FULL VERIFICATION] 1. Loading GAME DECK at /game-box/deck...');
await page.goto(`http://127.0.0.1:${port}/game-box/deck`, { waitUntil: 'networkidle' });

// Verify 3 columns and Three.js canvas
await page.waitForSelector('[data-testid="deck-collection-zone"]');
await page.waitForSelector('[data-testid="deck-console-zone"]');
await page.waitForSelector('.gb-console-3d-mount canvas');

const cases = await page.$$('.gb-3d-case-box');
console.log(`   Found ${cases.length} 3D physical game cases in collection.`);
if (cases.length < 20) {
  throw new Error(`Expected at least 20 cases, found ${cases.length}`);
}

const shot1 = path.join(artifactsDir, '01_game_deck_main_view.png');
await page.screenshot({ path: shot1 });
console.log('   Saved screenshot:', shot1);

// 2. Select Snake Duel
console.log('[FULL VERIFICATION] 2. Selecting Snake Duel and checking ranking synchronization...');
await page.click('.deck-case-snakeduel');
await page.waitForTimeout(400);

const rankingTitle = await page.textContent('.gb-deck-ranking-box h3');
console.log('   Ranking title updated to:', rankingTitle);
if (!rankingTitle.includes('Snake Duel')) {
  throw new Error(`Ranking title mismatch: ${rankingTitle}`);
}

const shot2 = path.join(artifactsDir, '02_game_selected_ranking_sync.png');
await page.screenshot({ path: shot2 });
console.log('   Saved screenshot:', shot2);

// 3. Play trigger & insert
console.log('[FULL VERIFICATION] 3. Triggering PLAY & Disc Insert sequence...');
await page.click('.gb-btn-insert-play');

await page.waitForTimeout(650);
const shot3 = path.join(artifactsDir, '03_case_open_disc_extraction.png');
await page.screenshot({ path: shot3 });
console.log('   Saved screenshot:', shot3);

await page.waitForTimeout(700);
const shot4 = path.join(artifactsDir, '04_console_boot_sequence.png');
await page.screenshot({ path: shot4 });
console.log('   Saved screenshot:', shot4);

// 4. Wait for iframe execution
console.log('[FULL VERIFICATION] 4. Waiting for game iframe mount (PLAYING state)...');
await page.waitForSelector('.gb-launcher-iframe', { timeout: 8000 });
const iframeSrc = await page.getAttribute('.gb-launcher-iframe', 'src');
console.log('   Game iframe src:', iframeSrc);
if (!iframeSrc.includes('game=snakeduel') || !iframeSrc.includes('embed=deck')) {
  throw new Error(`Unexpected iframe src: ${iframeSrc}`);
}

const shot5 = path.join(artifactsDir, '05_game_iframe_running.png');
await page.screenshot({ path: shot5 });
console.log('   Saved screenshot:', shot5);

// 5. Open controls guide modal
console.log('[FULL VERIFICATION] 5. Opening controls & rules guide modal...');
await page.click('.gb-launcher-btn-guide');
await page.waitForSelector('.gb-guide-modal-content');
const shot6 = path.join(artifactsDir, '06_game_controls_guide_modal.png');
await page.screenshot({ path: shot6 });
console.log('   Saved screenshot:', shot6);

// Close modal
await page.click('.gb-btn-guide-confirm');
await page.waitForTimeout(200);

// 6. Eject and return to collection
console.log('[FULL VERIFICATION] 6. Triggering Power OFF & Disc Eject sequence...');
await page.click('.gb-launcher-btn-close');

await page.waitForTimeout(600);
const shot7 = path.join(artifactsDir, '07_game_eject_sequence.png');
await page.screenshot({ path: shot7 });
console.log('   Saved screenshot:', shot7);

// Wait for return to selected
await page.waitForFunction(() => {
  const badge = document.querySelector('.gb-console-state-badge strong');
  return badge && badge.textContent.trim() === 'SELECTED';
}, { timeout: 5000 });

// 7. Switch to Bomberman
console.log('[FULL VERIFICATION] 7. Switching to Bomberman...');
await page.click('.deck-case-bomberman');
await page.waitForTimeout(300);
const shot8 = path.join(artifactsDir, '08_switch_to_bomberman.png');
await page.screenshot({ path: shot8 });
console.log('   Saved screenshot:', shot8);

// 8. Test Retro Desktop integration
console.log('[FULL VERIFICATION] 8. Testing Retro Desktop navigation...');
await page.click('button:has-text("RETRO DESKTOP")');
await page.waitForSelector('.gb-retro-desktop, iframe[src*="win98"]', { timeout: 5000 });
const shot9 = path.join(artifactsDir, '09_retro_desktop_intact.png');
await page.screenshot({ path: shot9 });
console.log('   Saved screenshot:', shot9);

// 9. Back navigation to deck
console.log('[FULL VERIFICATION] 9. Navigating back to GAME DECK...');
await page.goto(`http://127.0.0.1:${port}/game-box/deck`, { waitUntil: 'networkidle' });
await page.waitForSelector('.gb-3d-shelf-container');
const shot10 = path.join(artifactsDir, '10_return_to_deck.png');
await page.screenshot({ path: shot10 });
console.log('   Saved screenshot:', shot10);

await browser.close();
server.close();

console.log('\n======================================================');
console.log('🎉 [FULL VERIFICATION SUCCESSFUL]');
console.log('All 10 stages validated in actual browser with 10 screenshots!');
console.log('======================================================');
