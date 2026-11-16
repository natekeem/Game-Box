const WebSocket = require("ws");

const PORT = process.env.TEST_PORT || 3001;
const URL = `ws://localhost:${PORT}`;

let passed = 0;
let failed = 0;

function assert(label, cond, extra) {
  if (cond) {
    passed++;
    console.log(`  OK   ${label}`);
  } else {
    failed++;
    console.log(`  FAIL ${label}${extra ? " -- " + JSON.stringify(extra) : ""}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

function makeClient() {
  const ws = new WebSocket(URL);
  const inbox = [];
  const waiters = [];
  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    inbox.push(msg);
    for (let i = waiters.length - 1; i >= 0; i--) {
      if (waiters[i].pred(msg)) {
        waiters[i].resolve(msg);
        waiters.splice(i, 1);
      }
    }
  });
  function waitFor(pred, timeoutMs = 4000) {
    const found = inbox.find(pred);
    if (found) return Promise.resolve(found);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const idx = waiters.findIndex((w) => w.resolve === resolve);
        if (idx >= 0) waiters.splice(idx, 1);
        reject(new Error("timeout waiting for message; inbox=" + JSON.stringify(inbox.slice(-5))));
      }, timeoutMs);
      waiters.push({
        pred,
        resolve: (m) => {
          clearTimeout(timer);
          resolve(m);
        },
      });
    });
  }
  function waitOpen() {
    return new Promise((resolve, reject) => {
      ws.on("open", resolve);
      ws.on("error", reject);
    });
  }
  function send(obj) {
    ws.send(JSON.stringify(obj));
  }
  async function waitForCount(type, minCount, timeoutMs = 3000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (inbox.filter((m) => m.type === type).length >= minCount) return;
      await new Promise((r) => setTimeout(r, 50));
    }
    throw new Error(`timed out waiting for ${minCount}x "${type}"; inbox=${JSON.stringify(inbox.map((m) => m.type))}`);
  }
  return { ws, inbox, waitFor, waitForCount, waitOpen, send };
}

async function main() {
  // --- Test A: matching 2 players in one room ---
  section("Test A: two players join room TEST1");
  const c1 = makeClient();
  const c2 = makeClient();
  await c1.waitOpen();
  await c2.waitOpen();

  c1.send({ type: "join", roomId: "TEST1", name: "Alice" });
  const joined1 = await c1.waitFor((m) => m.type === "joined");
  assert("player 1 gets role=1", joined1.role === 1, joined1);
  assert("player 1 gets controls=WASD", joined1.controls === "WASD", joined1);
  await c1.waitFor((m) => m.type === "waiting_for_opponent");
  assert("player 1 is waiting for an opponent", true);

  c2.send({ type: "join", roomId: "TEST1", name: "Bob" });
  const joined2 = await c2.waitFor((m) => m.type === "joined");
  assert("player 2 gets role=2", joined2.role === 2, joined2);
  assert("player 2 gets controls=ARROWS", joined2.controls === "ARROWS", joined2);

  await c1.waitFor((m) => m.type === "game_start");
  await c2.waitFor((m) => m.type === "game_start");
  assert("both players receive game_start", true);

  const state1 = await c1.waitFor((m) => m.type === "state");
  assert("player 1 receives a state with a 30x20 grid", state1.gridWidth === 30 && state1.gridHeight === 20, state1);
  assert("state contains 2 snakes", state1.snakes.length === 2, state1);

  // --- Test B: a third player cannot join a full room ---
  section("Test B: room TEST1 is full for a third player");
  const c3 = makeClient();
  await c3.waitOpen();
  c3.send({ type: "join", roomId: "TEST1", name: "Charlie" });
  const err = await c3.waitFor((m) => m.type === "error");
  assert("third player gets a room-full error", /full/i.test(err.message), err);
  c3.ws.close();

  // --- Test C: room isolation ---
  section("Test C: another room (TEST2) works independently");
  const c4 = makeClient();
  const c5 = makeClient();
  await c4.waitOpen();
  await c5.waitOpen();
  c4.send({ type: "join", roomId: "TEST2", name: "Diana" });
  const j4 = await c4.waitFor((m) => m.type === "joined");
  assert("new room: first player is role=1", j4.role === 1, j4);
  c5.send({ type: "join", roomId: "TEST2", name: "Eric" });
  const j5 = await c5.waitFor((m) => m.type === "joined");
  assert("new room: second player is role=2", j5.role === 2, j5);
  await c4.waitFor((m) => m.type === "game_start");
  await c5.waitFor((m) => m.type === "game_start");
  assert("TEST2 starts independently of TEST1", true);

  // --- Test D: full game up to a wall hit, end-to-end game over ---
  section("Test D: player 1 in TEST2 hits the wall -> game_over");
  c4.send({ type: "direction", dir: "UP" });
  const gameOver = await c4.waitFor((m) => m.type === "game_over", 6000);
  assert("game_over reached player 1", gameOver.reason === "wall", gameOver);
  assert("player 2 wins", gameOver.winner === 2, gameOver);
  assert("scores include both players", typeof gameOver.scores[1] === "number" && typeof gameOver.scores[2] === "number", gameOver);
  const gameOver5 = await c5.waitFor((m) => m.type === "game_over", 2000);
  assert("game_over reached player 2 as well", gameOver5.reason === "wall", gameOver5);

  // --- Test E: rematch ---
  section("Test E: a rematch requested by both sides starts a new round");
  c4.send({ type: "rematch" });
  c5.send({ type: "rematch" });
  let rematchError = null;
  try {
    await c4.waitForCount("game_start", 2, 3000);
  } catch (e) {
    rematchError = e;
  }
  assert("player 1 received a second game_start after the rematch", rematchError === null, rematchError?.message);

  // --- Test F: disconnect mid-game (room TEST1) ---
  section("Test F: a player disconnecting ends the game as a win for the other");
  c1.ws.close();
  const disconnectMsg = await c2.waitFor((m) => m.type === "game_over" && m.reason === "opponent_disconnected", 3000);
  assert("player 2 wins by the opponent disconnecting", disconnectMsg.winner === 2, disconnectMsg);

  // --- Test G: server-side input limits ---
  section("Test G: the server enforces limits on names and room IDs");
  const longName = "x".repeat(200);
  const c6 = makeClient();
  const c7 = makeClient();
  await c6.waitOpen();
  await c7.waitOpen();
  c6.send({ type: "join", roomId: "TEST3", name: longName });
  await c6.waitFor((m) => m.type === "joined"); // make sure c6 gets role 1 (deterministic order)
  c7.send({ type: "join", roomId: "TEST3", name: "<i>hi</i>" });
  const state3 = await c6.waitFor((m) => m.type === "state");
  const names3 = state3.snakes.map((s) => s.name);
  assert("an over-long player name is truncated to 16 characters", names3[0] === "x".repeat(16), names3);
  assert("a name is passed through as plain text (escaping is the client's job)", names3[1] === "<i>hi</i>", names3);

  const c8 = makeClient();
  await c8.waitOpen();
  c8.send({ type: "join", roomId: "R".repeat(25), name: "Frank" });
  const idErr = await c8.waitFor((m) => m.type === "error");
  assert("a room ID longer than 24 characters is rejected", /too long/i.test(idErr.message), idErr);

  // --- Test H: oversized WebSocket messages are refused ---
  section("Test H: an oversized message closes the connection");
  const c9 = makeClient();
  await c9.waitOpen();
  const closeCode = new Promise((resolve) => c9.ws.on("close", (code) => resolve(code)));
  c9.ws.send(JSON.stringify({ type: "join", roomId: "TEST4", name: "y".repeat(5000) }));
  const code = await Promise.race([closeCode, new Promise((r) => setTimeout(() => r(null), 3000))]);
  assert("the server closes the connection with code 1009 (message too big)", code === 1009, { code });

  c2.ws.close();
  c4.ws.close();
  c5.ws.close();
  c6.ws.close();
  c7.ws.close();
  c8.ws.close();

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("TEST ERROR:", err);
  process.exit(1);
});
