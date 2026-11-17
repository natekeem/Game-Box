import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = path.join(rootDir, 'tests', 'artifacts', 'deck-lab');
fs.mkdirSync(artifactsDir, { recursive: true });

const port = 9876;
const staticRoot = rootDir;
const databasePath = path.resolve(rootDir, 'data', 'game-box-test.sqlite');

console.log('[STEP 3 VERIFICATION] Starting test server on port', port);
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
  viewport: { width: 1280, height: 860 },
});

await context.addInitScript(() => {
  localStorage.setItem('gameBox_guest_identity_v1', JSON.stringify({
    guestId: 'guest-deck-tester',
    nickname: 'DeckTester',
    isRegistered: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
});

const page = await context.newPage();

console.log('[STEP 3 VERIFICATION] Navigating to http://127.0.0.1:' + port + '/game-box/deck-lab');
await page.goto(`http://127.0.0.1:${port}/game-box/deck-lab`, { waitUntil: 'networkidle' });

// 1. Verify default state
console.log('1. Verifying Default State (3 3D Cases with thickness, spine, and shadows)...');
await page.waitForSelector('[data-testid="deck-lab-stage"]');
const caseBoxes = await page.$$('.gb-3d-case-box');
if (caseBoxes.length !== 3) {
  throw new Error(`Expected 3 case boxes, found ${caseBoxes.length}`);
}

const shot1 = path.join(artifactsDir, '01_default_state_three_cases.png');
await page.screenshot({ path: shot1 });
console.log('   Saved screenshot:', shot1);

// 2. Select Battle Box case
console.log('2. Selecting Battle Box case...');
await page.click('.lab-case-reaction');
await page.waitForTimeout(300);
const shot2 = path.join(artifactsDir, '02_case_selected_transformed.png');
await page.screenshot({ path: shot2 });
console.log('   Saved screenshot:', shot2);

// 3. Select Bomberman case and trigger PLAY
console.log('3. Selecting Bomberman case and pressing PLAY...');
await page.click('.lab-case-bomberman');
await page.waitForTimeout(300);

await page.click('[data-testid="btn-play"]');
console.log('   PLAY clicked! Capturing Case Open animation at t=550ms...');
await page.waitForTimeout(550);
const shot3 = path.join(artifactsDir, '03_case_opening_tray_revealed.png');
await page.screenshot({ path: shot3 });
console.log('   Saved screenshot:', shot3);

console.log('   Capturing Disc Extraction animation at t=1050ms...');
await page.waitForTimeout(500);
const shot4 = path.join(artifactsDir, '04_disc_extraction.png');
await page.screenshot({ path: shot4 });
console.log('   Saved screenshot:', shot4);

console.log('   Capturing Disc Insertion into console slot at t=1550ms...');
await page.waitForTimeout(500);
const shot5 = path.join(artifactsDir, '05_disc_insertion_slot_glow.png');
await page.screenshot({ path: shot5 });
console.log('   Saved screenshot:', shot5);

console.log('   Waiting for animation completion (PLAYING state)...');
await page.waitForFunction(() => {
  const badge = document.querySelector('[data-testid="state-badge"]');
  return badge && badge.textContent.trim() === 'PLAYING';
}, { timeout: 4000 });

const shot6 = path.join(artifactsDir, '06_playing_ready_state.png');
await page.screenshot({ path: shot6 });
console.log('   Saved screenshot:', shot6);

// 4. Eject sequence
console.log('4. Pressing EJECT button...');
await page.click('[data-testid="btn-eject"]');
await page.waitForTimeout(500);
const shot7 = path.join(artifactsDir, '07_disc_ejection.png');
await page.screenshot({ path: shot7 });
console.log('   Saved screenshot:', shot7);

console.log('   Waiting for eject completion (SELECTED state)...');
await page.waitForFunction(() => {
  const badge = document.querySelector('[data-testid="state-badge"]');
  return badge && badge.textContent.trim() === 'SELECTED';
}, { timeout: 4000 });

const shot8 = path.join(artifactsDir, '08_returned_to_collection.png');
await page.screenshot({ path: shot8 });
console.log('   Saved screenshot:', shot8);

await browser.close();
server.close();

console.log('\n[STEP 3 VERIFICATION PASSED!] All 8 physical interaction frames captured successfully.');
