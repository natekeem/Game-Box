import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = path.join(rootDir, 'tests', 'artifacts', 'hybrid-defect');
fs.mkdirSync(artifactsDir, { recursive: true });

const port = 9880;
const staticRoot = rootDir;
const databasePath = path.resolve(rootDir, 'data', 'game-box-test.sqlite');

console.log('[DEFECT CAPTURE] Starting server on port', port);
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
    guestId: 'guest-defect-inspector',
    nickname: 'DefectInspector',
    isRegistered: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
});

const page = await context.newPage();

console.log('[DEFECT CAPTURE] Loading GAME DECK at /game-box/deck...');
await page.goto(`http://127.0.0.1:${port}/game-box/deck`, { waitUntil: 'networkidle' });
await page.waitForSelector('.gb-btn-insert-play');

// Capture frame 1: Idle selected case and 3D console
const shot1 = path.join(artifactsDir, '01_hybrid_selected_state.png');
await page.screenshot({ path: shot1 });
console.log('Saved:', shot1);

// Click PLAY
console.log('[DEFECT CAPTURE] Clicking PLAY to trigger insertion...');
await page.click('.gb-btn-insert-play');

// Frame 2: Disc extracting from 2D/3D case
await page.waitForTimeout(950);
const shot2 = path.join(artifactsDir, '02_disc_extracted_midair.png');
await page.screenshot({ path: shot2 });
console.log('Saved:', shot2);

// Frame 3: The crucial defect - 2D floating slot/hole renders in mid-air over 3D console
await page.waitForTimeout(550); // t ~ 1500ms
const shot3 = path.join(artifactsDir, '03_disc_entering_floating_hole.png');
await page.screenshot({ path: shot3 });
console.log('Saved:', shot3);

// Frame 4: Tray open in 3D WebGL while 2D disc vanished into 2D clip-path hole
await page.waitForTimeout(200); // t ~ 1700ms
const shot4 = path.join(artifactsDir, '04_coordinate_mismatch_hole_vs_tray.png');
await page.screenshot({ path: shot4 });
console.log('Saved:', shot4);

// Wait until ready/playing
await page.waitForSelector('.gb-launcher-iframe', { timeout: 8000 });
const shot5 = path.join(artifactsDir, '05_iframe_mounted_covering_scene.png');
await page.screenshot({ path: shot5 });
console.log('Saved:', shot5);

await browser.close();
server.close();
console.log('[DEFECT CAPTURE COMPLETE]');
