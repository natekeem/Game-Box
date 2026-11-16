// Simple unit test of the game engine (no networking) — it drives movement
// manually by calling setDirection()/tick() directly, so that every type of
// collision can be forced deterministically.
const { GameEngine } = require("../dist/shared/GameEngine");

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

function section(title) {
  console.log(`\n${title}`);
}

// --- Test 1: wall collision ---
section("Test 1: player 1 hits the top wall");
{
  const engine = new GameEngine({ 1: "Alice", 2: "Bob" });
  // start: head (5,7), direction RIGHT -> turn up and drive into the wall (y=0)
  engine.setDirection(1, "UP");
  let result = null;
  for (let i = 0; i < 20 && !result?.gameOver; i++) {
    result = engine.tick();
  }
  assert("game ended", result.gameOver === true);
  assert("reason: wall", result.reason === "wall");
  assert("player 2 wins", result.winner === 2);
}

// --- Test 2: own tail ---
section("Test 2: player 1 runs into its own tail");
{
  const engine = new GameEngine({ 1: "Alice", 2: "Bob" });
  // Set the snake's shape directly so that moving RIGHT drives the head
  // into a middle body segment (not the tail, which would have vacated anyway).
  const p1 = engine.snakes.get(1);
  p1.body = [
    { x: 5, y: 7 }, // head
    { x: 6, y: 7 }, // the new head will move in here
    { x: 6, y: 8 },
    { x: 5, y: 8 },
    { x: 4, y: 8 }, // tail
  ];
  p1.direction = "RIGHT";
  p1.pendingDirection = "RIGHT";

  const result = engine.tick();
  assert("game ended with a self-collision", result.gameOver === true && result.reason === "self");
  assert("player 2 wins", result.winner === 2);
}

// --- Test 3: no 180-degree turns ---
section("Test 3: cannot reverse direction by 180 degrees");
{
  const engine = new GameEngine({ 1: "Alice", 2: "Bob" });
  // player 1 is moving RIGHT; trying to set LEFT (the opposite direction)
  // should be ignored - otherwise it would immediately run into its own neck.
  engine.setDirection(1, "LEFT");
  const result = engine.tick();
  assert("LEFT move ignored, game continues", result.gameOver === false);
}

// --- Test 4a: head-on collision of both players ---
section("Test 4a: head-on collision of both players -> draw");
{
  const engine = new GameEngine({ 1: "Alice", 2: "Bob" });
  const p1 = engine.snakes.get(1);
  const p2 = engine.snakes.get(2);
  // Position the players so that within a single tick their heads
  // move into the same cell.
  p1.body = [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }];
  p1.direction = "RIGHT";
  p1.pendingDirection = "RIGHT";
  p2.body = [{ x: 12, y: 7 }, { x: 13, y: 7 }, { x: 14, y: 7 }];
  p2.direction = "LEFT";
  p2.pendingDirection = "LEFT";

  const result = engine.tick();
  assert("game ended", result.gameOver === true);
  assert("draw (winner=null, reason=draw)", result.winner === null && result.reason === "draw");
}

// --- Test 4b: player runs into the opponent's body (not head-on) ---
section("Test 4b: player 1 runs into player 2's body");
{
  const engine = new GameEngine({ 1: "Alice", 2: "Bob" });
  const p1 = engine.snakes.get(1);
  const p2 = engine.snakes.get(2);
  p1.body = [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }];
  p1.direction = "RIGHT";
  p1.pendingDirection = "RIGHT";
  // A segment of player 2's body sits exactly where player 1's head is about
  // to move — (11,7) — while player 2 moves in a completely different direction.
  p2.body = [{ x: 15, y: 3 }, { x: 14, y: 3 }, { x: 11, y: 7 }];
  p2.direction = "UP";
  p2.pendingDirection = "UP";

  const result = engine.tick();
  assert("game ended", result.gameOver === true);
  assert("reason: opponent, player 2 wins", result.reason === "opponent" && result.winner === 2);
}

// --- Test 5: food and scoring ---
section("Test 5: eating food raises the score and lengthens the snake");
{
  const engine = new GameEngine({ 1: "Alice", 2: "Bob" });
  const before = engine.getSnapshot();
  const beforeLen = before.snakes.find((s) => s.role === 1).body.length;
  const beforeScore = engine.getScores()[1];

  // Move the food directly to the cell right in front of player 1's head,
  // so the test is deterministic (no dependence on random spawning).
  engine.food = { x: before.snakes.find((s) => s.role === 1).body[0].x + 1, y: 7 };

  const result = engine.tick();
  const after = engine.getSnapshot();
  const afterLen = after.snakes.find((s) => s.role === 1).body.length;
  const afterScore = engine.getScores()[1];

  assert("game continues", result.gameOver === false);
  assert("player 1 score increased by 10", afterScore === beforeScore + 10);
  assert("player 1 snake grew by 1 segment", afterLen === beforeLen + 1);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
