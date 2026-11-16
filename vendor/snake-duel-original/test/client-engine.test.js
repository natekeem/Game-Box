// Verifies that the browser build of the game engine (ES modules, public/js/)
// behaves identically to the server version. It is the same source file but a
// different build, so it's worth confirming that the ESM extension fixup
// (scripts/fix-client-esm-extensions.js) broke nothing and that the import
// chain actually resolves (the way a browser would resolve it).
const path = require("path");

let passed = 0;
let failed = 0;

function assert(label, cond) {
  if (cond) {
    passed++;
    console.log(`  OK   ${label}`);
  } else {
    failed++;
    console.log(`  FAIL ${label}`);
  }
}

async function main() {
  const modUrl = "file://" + path.join(__dirname, "..", "public", "js", "shared", "GameEngine.js");
  const { GameEngine } = await import(modUrl);

  console.log("\nTest: client build of the engine - wall collision");
  const engine = new GameEngine({ 1: "Alice", 2: "Bob" });
  engine.setDirection(1, "UP");
  let result = null;
  for (let i = 0; i < 20 && !result?.gameOver; i++) {
    result = engine.tick();
  }
  assert("ESM import from public/js/ resolves correctly", true);
  assert("game ended", result.gameOver === true);
  assert("reason: wall", result.reason === "wall");
  assert("player 2 wins", result.winner === 2);

  console.log("\nTest: client build of the engine - food and scoring");
  const engine2 = new GameEngine({ 1: "Alice", 2: "Bob" });
  const before = engine2.getSnapshot();
  const head = before.snakes.find((s) => s.role === 1).body[0];
  engine2.food = { x: head.x + 1, y: head.y };
  const tickResult = engine2.tick();
  assert("game continues", tickResult.gameOver === false);
  assert("player 1 score increased by 10", engine2.getScores()[1] === 10);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
