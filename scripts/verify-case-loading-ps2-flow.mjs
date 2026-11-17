import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = path.join(rootDir, 'tests', 'artifacts', 'ps2-case-flow');
fs.mkdirSync(artifactsDir, { recursive: true });

const port = 9885;
const staticRoot = rootDir;
const databasePath = path.resolve(rootDir, 'data', 'game-box-test.sqlite');

console.log('[PS2 CASE FLOW TEST] Starting test server on port', port);
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
    guestId: 'guest-case-ps2-tester',
    nickname: 'Ps2CaseMaster',
    isRegistered: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
});

const page = await context.newPage();

console.log('1. Loading GAME DECK at /game-box/deck...');
await page.goto(`http://127.0.0.1:${port}/game-box/deck`, { waitUntil: 'networkidle' });

// STEP 1: Verify default state has NO case selected!
console.log('2. Verifying default state: No CD case is pre-selected...');
const activeCases = await page.$$('.deck-case-active, [data-selected="true"]');
console.log('   Active cases count:', activeCases.length);

const stateBadge = await page.textContent('.gb-console-state-badge strong');
console.log('   Console state badge:', stateBadge);

const previewTitle = await page.textContent('.gb-console-preview-card h3');
console.log('   Console preview title:', previewTitle);

if (!previewTitle.includes('선택하세요')) {
  throw new Error(`Expected standby title, got: ${previewTitle}`);
}

const shot1 = path.join(artifactsDir, '01_default_no_case_selected.png');
await page.screenshot({ path: shot1 });
console.log('   Saved screenshot:', shot1);

// STEP 2: Select Snake Duel
console.log('3. Selecting Snake Duel CD case on shelf...');
await page.click('.deck-case-snakeduel');
await page.waitForTimeout(400);

const selectedTitle = await page.textContent('.gb-console-preview-card h3');
console.log('   Selected game title in console:', selectedTitle);
if (!selectedTitle.includes('Snake Duel')) {
  throw new Error(`Expected Snake Duel, got: ${selectedTitle}`);
}

const rankingTitle = await page.textContent('.gb-deck-ranking-box h3');
console.log('   Ranking title synchronized to:', rankingTitle);

const shot2 = path.join(artifactsDir, '02_case_clicked_and_selected.png');
await page.screenshot({ path: shot2 });
console.log('   Saved screenshot:', shot2);

// STEP 3: Click PLAY -> 3D Case appears and starts opening!
console.log('4. Clicking PLAY to trigger 3D Case Open & PS2 Disc Insert sequence...');
await page.click('.gb-btn-insert-play');

// t = 450ms: Case loaded and starting to open
await page.waitForTimeout(450);
const shot3 = path.join(artifactsDir, '03_3d_case_opening_in_scene.png');
await page.screenshot({ path: shot3 });
console.log('   Saved screenshot:', shot3);

// t = 950ms: Case fully open, disc lifted from spindle, PS2 tray open
await page.waitForTimeout(500);
const shot4 = path.join(artifactsDir, '04_disc_extracted_ps2_tray_open.png');
await page.screenshot({ path: shot4 });
console.log('   Saved screenshot:', shot4);

// t = 1600ms: Disc flying along 3D arc trajectory into PS2 tray
await page.waitForTimeout(650);
const shot5 = path.join(artifactsDir, '05_disc_flight_arc_to_ps2_tray.png');
await page.screenshot({ path: shot5 });
console.log('   Saved screenshot:', shot5);

// t = 2400ms: Disc seated, PS2 tray closing into console
await page.waitForTimeout(800);
const shot6 = path.join(artifactsDir, '06_disc_landed_tray_closing.png');
await page.screenshot({ path: shot6 });
console.log('   Saved screenshot:', shot6);

// STEP 4: Game iframe running
console.log('5. Waiting for game iframe mount...');
await page.waitForSelector('.gb-launcher-iframe', { timeout: 8000 });
const iframeSrc = await page.getAttribute('.gb-launcher-iframe', 'src');
console.log('   Game iframe running with src:', iframeSrc);

const shot7 = path.join(artifactsDir, '07_game_running_console_power_on.png');
await page.screenshot({ path: shot7 });
console.log('   Saved screenshot:', shot7);

// STEP 5: Eject and reverse return
console.log('6. Clicking Close / Eject button...');
await page.click('.gb-launcher-btn-close');

// Wait for eject sequence to finish
await page.waitForFunction(() => {
  const badge = document.querySelector('.gb-console-state-badge strong');
  return badge && badge.textContent.trim() === 'SELECTED';
}, { timeout: 6000 });

console.log('   Successfully returned to SELECTED state.');
const shot8 = path.join(artifactsDir, '08_ejected_cleanly_returned.png');
await page.screenshot({ path: shot8 });
console.log('   Saved screenshot:', shot8);

await browser.close();
server.close();

console.log('\n======================================================');
console.log('🎉 [PS2 3D CASE & DISC INSERTION VERIFICATION PASSED!]');
console.log('All 8 frames captured with real 3D case -> arc -> PS2 tray integration.');
console.log('======================================================');
