import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = path.join(rootDir, 'tests', 'artifacts', 'single-base-verification');
fs.mkdirSync(artifactsDir, { recursive: true });

const port = 9882;
const staticRoot = rootDir;
const databasePath = path.resolve(rootDir, 'data', 'game-box-test.sqlite');

console.log('[SINGLE BASE VERIFICATION] Starting GAME-BOX server on port', port);
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
    guestId: 'guest-single-tester',
    nickname: 'SingleTester',
    isRegistered: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
});

const page = await context.newPage();

console.log('--- TEST 1: Battle Box (reaction) ---');
await page.goto(`http://127.0.0.1:${port}/game-box/deck`, { waitUntil: 'networkidle' });
await page.waitForSelector('.deck-case-reaction');

// 1. Select Battle Box
await page.click('.deck-case-reaction');
await page.waitForTimeout(300);

const title1 = await page.textContent('.gb-deck-ranking-box h3');
console.log('Battle Box ranking title:', title1);
if (!title1.includes('Reaction Battle')) {
  throw new Error(`Expected Reaction Battle in ranking, got: ${title1}`);
}
const shot1 = path.join(artifactsDir, '01_battlebox_selected.png');
await page.screenshot({ path: shot1 });
console.log('Saved:', shot1);

// 2. Play Battle Box
console.log('Clicking PLAY for Battle Box...');
await page.click('.gb-btn-insert-play');
await page.waitForSelector('.gb-launcher-iframe', { timeout: 8000 });
const src1 = await page.getAttribute('.gb-launcher-iframe', 'src');
console.log('Battle Box iframe src:', src1);
if (!src1.includes('game=reaction')) {
  throw new Error(`Unexpected iframe src for Battle Box: ${src1}`);
}
const shot2 = path.join(artifactsDir, '02_battlebox_running.png');
await page.screenshot({ path: shot2 });
console.log('Saved:', shot2);

// 3. Open guide modal
await page.click('.gb-launcher-btn-guide');
await page.waitForSelector('.gb-guide-modal-content');
const shot3 = path.join(artifactsDir, '03_battlebox_guide_modal.png');
await page.screenshot({ path: shot3 });
console.log('Saved:', shot3);
await page.click('.gb-btn-guide-confirm');
await page.waitForTimeout(200);

// 4. Power off / Eject Battle Box
await page.click('.gb-launcher-btn-close');
await page.waitForFunction(() => {
  const badge = document.querySelector('.gb-console-state-badge strong');
  return badge && badge.textContent.trim() === 'SELECTED';
}, { timeout: 5000 });
console.log('Battle Box successfully powered off and returned to SELECTED.');

console.log('\n--- TEST 2: Snake Duel (snakeduel) ---');
await page.click('.deck-case-snakeduel');
await page.waitForTimeout(300);

const title2 = await page.textContent('.gb-deck-ranking-box h3');
console.log('Snake Duel ranking title:', title2);
if (!title2.includes('Snake Duel')) {
  throw new Error(`Expected Snake Duel in ranking, got: ${title2}`);
}
const shot4 = path.join(artifactsDir, '04_snakeduel_selected.png');
await page.screenshot({ path: shot4 });
console.log('Saved:', shot4);

// Play Snake Duel
console.log('Clicking PLAY for Snake Duel...');
await page.click('.gb-btn-insert-play');
await page.waitForSelector('.gb-launcher-iframe', { timeout: 8000 });
const src2 = await page.getAttribute('.gb-launcher-iframe', 'src');
console.log('Snake Duel iframe src:', src2);
if (!src2.includes('game=snakeduel')) {
  throw new Error(`Unexpected iframe src for Snake Duel: ${src2}`);
}
const shot5 = path.join(artifactsDir, '05_snakeduel_running.png');
await page.screenshot({ path: shot5 });
console.log('Saved:', shot5);

// Guide modal
await page.click('.gb-launcher-btn-guide');
await page.waitForSelector('.gb-guide-modal-content');
const shot6 = path.join(artifactsDir, '06_snakeduel_guide_modal.png');
await page.screenshot({ path: shot6 });
console.log('Saved:', shot6);
await page.click('.gb-btn-guide-confirm');
await page.waitForTimeout(200);

// Power off / Eject Snake Duel
await page.click('.gb-launcher-btn-close');
await page.waitForFunction(() => {
  const badge = document.querySelector('.gb-console-state-badge strong');
  return badge && badge.textContent.trim() === 'SELECTED';
}, { timeout: 5000 });
console.log('Snake Duel successfully powered off and returned to SELECTED.');

console.log('\n--- TEST 3: Bomberman (bomberman) ---');
await page.click('.deck-case-bomberman');
await page.waitForTimeout(300);

const title3 = await page.textContent('.gb-deck-ranking-box h3');
console.log('Bomberman ranking title:', title3);
if (!title3.includes('봄버맨') && !title3.includes('Blast Arena')) {
  throw new Error(`Expected Bomberman / Blast Arena in ranking, got: ${title3}`);
}
const shot7 = path.join(artifactsDir, '07_bomberman_selected.png');
await page.screenshot({ path: shot7 });
console.log('Saved:', shot7);

// Play Bomberman
console.log('Clicking PLAY for Bomberman...');
await page.click('.gb-btn-insert-play');
await page.waitForSelector('.gb-launcher-iframe', { timeout: 8000 });
const src3 = await page.getAttribute('.gb-launcher-iframe', 'src');
console.log('Bomberman iframe src:', src3);
if (!src3.includes('blast-arena') && !src3.includes('bomberman')) {
  throw new Error(`Unexpected iframe src for Bomberman: ${src3}`);
}
const shot8 = path.join(artifactsDir, '08_bomberman_running.png');
await page.screenshot({ path: shot8 });
console.log('Saved:', shot8);

// Guide modal
await page.click('.gb-launcher-btn-guide');
await page.waitForSelector('.gb-guide-modal-content');
const shot9 = path.join(artifactsDir, '09_bomberman_guide_modal.png');
await page.screenshot({ path: shot9 });
console.log('Saved:', shot9);
await page.click('.gb-btn-guide-confirm');
await page.waitForTimeout(200);

// Power off / Eject Bomberman
await page.click('.gb-launcher-btn-close');
await page.waitForFunction(() => {
  const badge = document.querySelector('.gb-console-state-badge strong');
  return badge && badge.textContent.trim() === 'SELECTED';
}, { timeout: 5000 });
console.log('Bomberman successfully powered off and returned to SELECTED.');

console.log('\n--- TEST 4: Navigation to Deck Lab Single (Unmodified Channel 3) ---');
await page.goto(`http://127.0.0.1:${port}/game-box/deck-lab-single/`, { waitUntil: 'networkidle' });
await page.waitForSelector('#tv-frame');
await page.waitForSelector('#carousel');
const shot10 = path.join(artifactsDir, '10_deck_lab_single_navigated.png');
await page.screenshot({ path: shot10 });
console.log('Saved:', shot10);

await browser.close();
server.close();

console.log('\n======================================================');
console.log('🎉 [ALL 3 GAMES & SINGLE LAB VERIFICATION PASSED!]');
console.log('10 screenshots captured in actual browser session.');
console.log('======================================================');
