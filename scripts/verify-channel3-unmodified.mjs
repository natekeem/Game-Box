import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createGameBoxServer } from '../server/http-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = path.join(rootDir, 'tests', 'artifacts', 'deck-lab-single');
fs.mkdirSync(artifactsDir, { recursive: true });

const port = 9881;
const staticRoot = rootDir;
const databasePath = path.resolve(rootDir, 'data', 'game-box-test.sqlite');

console.log('[SINGLE BASE VERIFICATION] Starting test server on port', port);
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

const page = await context.newPage();

console.log('[SINGLE BASE VERIFICATION] Navigating to http://127.0.0.1:' + port + '/game-box/deck-lab-single/');
await page.goto(`http://127.0.0.1:${port}/game-box/deck-lab-single/`, { waitUntil: 'networkidle' });

// Verify Channel 3 DOM elements
await page.waitForSelector('#stage');
await page.waitForSelector('#tv-frame');
await page.waitForSelector('#carousel');
await page.waitForSelector('#btn-play');

console.log('1. Capturing Unmodified Channel 3 Main View (TV + Cartridge Carousel)...');
const shot1 = path.join(artifactsDir, '01_unmodified_channel3_shelf_tv.png');
await page.screenshot({ path: shot1 });
console.log('   Saved:', shot1);

// Interact with carousel
console.log('2. Cycling cartridge carousel...');
const carouselItems = await page.$$('#carousel > *');
console.log(`   Found ${carouselItems.length} cartridges in carousel.`);

// Wait a bit for CRT canvas shader to initialize
await page.waitForTimeout(1000);
const shot2 = path.join(artifactsDir, '02_unmodified_channel3_shader_active.png');
await page.screenshot({ path: shot2 });
console.log('   Saved:', shot2);

await browser.close();
server.close();
console.log('[SINGLE BASE UNMODIFIED TEST PASSED]');
