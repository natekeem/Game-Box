import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createGameBoxServer } from '../server/http-app.mjs';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const artifacts = process.env.GAME_DECK_ARTIFACTS;
if (artifacts) await mkdir(artifacts, { recursive: true });

const canvasSelector = '.gb-console-3d-mount canvas';
const capture = async (locator, file) => {
  if (artifacts) await locator.screenshot({ path: path.join(artifacts, file), timeout: 15000 });
};
const geometry = (canvas) => canvas.evaluate((c) => {
  const { x, y, width, height } = c.getBoundingClientRect();
  return [x + scrollX, y + scrollY, width, height, c.width, c.height];
});

async function verifyDeck(browser, origin, viewport, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport, reducedMotion });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.addInitScript(() => {
      localStorage.setItem('gameBox_guest_identity_v1', JSON.stringify({
        guestId: 'guest-ps2-case-flow',
        nickname: 'Deck Tester',
        isRegistered: true,
      }));
    });
    await page.goto(origin + '/game-box/deck');
    const canvas = page.locator(canvasSelector);
    const play = page.locator('.gb-btn-insert-play');
    const state = page.locator('.gb-console-state-badge strong');
    const originalCanvas = await canvas.elementHandle();
    const sameCanvas = () => originalCanvas.evaluate((c, selector) => c === document.querySelector(selector), canvasSelector);
    const standbyGeometry = await geometry(canvas);
    assert.equal(await state.textContent(), 'STANDBY');
    assert.ok(await play.isDisabled());

    await page.locator('.deck-case-bomberman').click();
    await page.locator('.gb-console-preview-card h3').filter({ hasText: 'Blast Arena' }).waitFor();
    assert.deepEqual(await geometry(canvas), standbyGeometry, 'Initial selection must not resize or shift the console');
    await page.locator('.deck-case-snakeduel').click();
    await page.locator('.gb-console-preview-card h3').filter({ hasText: 'Snake Duel' }).waitFor();
    assert.deepEqual(await geometry(canvas), standbyGeometry, 'Switching games must keep the same projection');
    assert.ok(await sameCanvas());
    if (reducedMotion === 'no-preference') {
      await capture(page.locator('.gb-console-unit'), 'game-deck-selected.png');
    }

    await play.click();
    if (reducedMotion === 'no-preference') {
      await state.filter({ hasText: 'INSERTING' }).waitFor();
      await page.locator('.deck-case-bomberman').click();
    }
    const iframe = page.locator('.gb-launcher-iframe');
    await iframe.waitFor({ timeout: reducedMotion === 'reduce' ? 2500 : 12000 });
    assert.match(await iframe.getAttribute('src'), /game=snakeduel/);
    assert.ok(await sameCanvas(), 'The original WebGL scene must survive game launch');
    assert.ok(await canvas.isHidden());

    await page.locator('.gb-launcher-btn-close').click();
    await state.filter({ hasText: 'SELECTED' }).waitFor({ timeout: 12000 });
    assert.ok(await sameCanvas(), 'Eject must return to the scene that held the disc');
    assert.deepEqual(await geometry(canvas), standbyGeometry);
    assert.ok(await iframe.isHidden());
    assert.deepEqual(errors, []);
    console.log('Deck selection, launch and eject passed (' + viewport.width + 'px, ' + reducedMotion + ')');
  } finally {
    await page.close();
  }
}

async function verifyDiscPath(browser, origin) {
  const page = await browser.newPage({ viewport: { width: 720, height: 524 } });
  try {
    await page.route('**/deck-scene-test', (route) => route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><style>body{margin:0}#scene{width:720px;height:524px}</style>
        <script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/":"/node_modules/three/"}}</script>
        <div id="scene"></div>`,
    }));
    await page.goto(origin + '/deck-scene-test');
    await page.evaluate(async () => {
      const { Box3, Vector3, Quaternion } = await import('three');
      const { createGameDeckConsoleScene } = await import('/tool-box/src/features/game-box/deck/console/GameDeckConsoleScene.js');
      const { ARCADE_GAMES } = await import('/tool-box/src/features/game-box/registry/arcadeGames.js');

      // Step frames explicitly so the pose checks and screenshots do not depend on GPU speed.
      let now = 0, id = 0;
      const frames = new Map();
      Object.defineProperty(performance, 'now', { value: () => now });
      window.requestAnimationFrame = (cb) => {
        frames.set(++id, cb);
        return id;
      };
      window.cancelAnimationFrame = (key) => frames.delete(key);
      window.step = (ms) => {
        now += ms;
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((draw) => draw(now));
      };

      const game = ARCADE_GAMES.find(({ id }) => id === 'snakeduel');
      const api = createGameDeckConsoleScene(document.getElementById('scene'));
      await api.selectCase(game);
      window.beginInsert = () => { window.motion = api.insertDisc(game); };
      window.beginEject = () => { window.motion = api.ejectDisc(); };
      const inFrame = (object) => {
        const { min, max } = new Box3().setFromObject(object);
        return [min.x, max.x].every((x) => [min.y, max.y].every((y) => [min.z, max.z].every((z) => {
          const projected = new Vector3(x, y, z).project(api.camera);
          return Math.abs(projected.x) < 0.98 && Math.abs(projected.y) < 0.98;
        })));
      };
      window.pose = () => {
        const disc = api.scene.getObjectByName('game-disc');
        const position = disc.getWorldPosition(new Vector3());
        const normal = new Vector3(0, 1, 0).applyQuaternion(disc.getWorldQuaternion(new Quaternion()));
        const caseSeat = api.scene.getObjectByName('case-disc-seat');
        const traySeat = api.scene.getObjectByName('tray-disc-seat');
        const cover = api.scene.getObjectByName('case-hinge');
        return {
          disc: disc.uuid,
          texture: disc.getObjectByName('disc-print').material.map.uuid,
          parent: disc.parent.name,
          hinge: cover.rotation.y,
          centeredX: caseSeat.getWorldPosition(new Vector3()).project(api.camera).x,
          caseDistance: caseSeat.getWorldPosition(new Vector3()).distanceTo(position),
          trayDistance: traySeat.getWorldPosition(new Vector3()).distanceTo(position),
          propsInFrame: inFrame(caseSeat.parent) && inFrame(traySeat.parent),
          facing: normal.dot(api.camera.position.clone().sub(position).normalize()),
          normal: normal.toArray(),
          position: position.toArray(),
        };
      };
    });
    const step = (ms) => page.evaluate((elapsed) => window.step(elapsed), ms);
    const pose = () => page.evaluate(() => window.pose());
    const canvas = page.locator('#scene canvas');
    await step(16);
    const closed = await pose();
    assert.equal(closed.parent, 'case-disc-seat');
    assert.equal(closed.caseDistance, 0);
    assert.ok(Math.abs(closed.centeredX) < 0.025, 'The closed case should be centered');
    await capture(canvas, '01-case-centered.png');

    await page.evaluate(() => window.beginInsert());
    await step(690);
    const open = await pose();
    assert.ok(open.hinge < -2.4, 'The case must open before the disc moves');
    assert.equal(open.caseDistance, 0);
    assert.ok(open.normal[2] > 0.9, 'The disc must be parallel to the open case');
    await capture(canvas, '02-disc-in-open-case.png');
    await step(140); // Finish extending the tray before transfer begins.
    await step(180);
    const lifted = await pose();
    assert.ok(lifted.caseDistance > 0.01);
    const displacement = lifted.position.map((axis, i) => axis - open.position[i]);
    const liftAlongFace = displacement.reduce((sum, axis, i) => sum + axis * open.normal[i], 0);
    assert.ok(liftAlongFace / Math.hypot(...displacement) > 0.999, 'The disc must clear the hub squarely');
    assert.deepEqual(lifted.normal, open.normal);

    for (let i = 0; i < 10; i += 1) {
      await step(110);
      const flying = await pose();
      assert.equal(flying.disc, closed.disc);
      assert.equal(flying.texture, closed.texture);
      assert.ok(flying.facing > 0.1, 'The printed face should stay visible through the turn');
      if (i === 2) await capture(canvas, '03-disc-spin.png');
    }

    await step(160);
    const seated = await pose();
    assert.equal(seated.parent, 'tray-disc-seat');
    assert.equal(seated.trayDistance, 0);
    assert.deepEqual(seated.normal, [0, 1, 0]);
    assert.ok(seated.propsInFrame, 'The open case and extended tray must fit in the canvas');
    await capture(canvas, '04-disc-seated-in-tray.png');
    await step(420);
    const closing = await pose();
    assert.equal(closing.trayDistance, 0);
    assert.ok(closing.position[2] < seated.position[2] - 0.02, 'The tray must carry the disc into the console');
    await step(400);
    await step(350);
    await page.evaluate(() => window.motion);

    await page.evaluate(() => window.beginEject());
    await step(830);
    await step(1460);
    const returned = await pose();
    assert.equal(returned.parent, 'case-disc-seat');
    assert.equal(returned.caseDistance, 0);
    assert.equal(returned.disc, closed.disc);
    assert.equal(returned.texture, closed.texture);
    await capture(canvas, '05-disc-returned-to-case.png');
    await step(830);
    await page.evaluate(() => window.motion);
    assert.deepEqual((await pose()).position, closed.position);
    console.log('Case alignment, disc print, tray seating and reverse path passed');
  } finally {
    await page.close();
  }
}

const { server } = createGameBoxServer({ staticRoot: path.resolve(rootDir) });
server.listen(0, '127.0.0.1');
await once(server, 'listening');
try {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    args: ['--enable-unsafe-swiftshader'],
  });
  try {
    const origin = 'http://127.0.0.1:' + server.address().port;
    await verifyDiscPath(browser, origin);
    await verifyDeck(browser, origin, { width: 1400, height: 900 });
    await verifyDeck(browser, origin, { width: 390, height: 844 }, 'reduce');
  } finally {
    await browser.close();
  }
} finally {
  server.close();
}
