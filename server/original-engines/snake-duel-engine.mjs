/**
 * Platform adapter for PawelN93/snake-duel.
 *
 * This is a direct ESM port of vendor/snake-duel-original/src/shared/GameEngine.ts
 * and protocol.ts. The platform adds only injectable randomness and a plain JS
 * snapshot so the original rules can run inside the existing room lifecycle.
 */
export const SNAKE_GRID_WIDTH = 30;
export const SNAKE_GRID_HEIGHT = 20;
export const SNAKE_TICK_MS = 150;
export const SNAKE_POINTS_PER_FOOD = 10;

const OPPOSITE = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const DELTA = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const samePoint = (a, b) => a.x === b.x && a.y === b.y;

export class SnakeDuelEngine {
  constructor(nameByRole, random = Math.random) {
    this.random = random;
    this.snakes = new Map();
    this.snakes.set(1, {
      name: nameByRole[1],
      body: [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }],
      direction: 'RIGHT',
      pendingDirection: 'RIGHT',
      alive: true,
      score: 0,
    });
    this.snakes.set(2, {
      name: nameByRole[2],
      body: [
        { x: SNAKE_GRID_WIDTH - 6, y: SNAKE_GRID_HEIGHT - 8 },
        { x: SNAKE_GRID_WIDTH - 5, y: SNAKE_GRID_HEIGHT - 8 },
        { x: SNAKE_GRID_WIDTH - 4, y: SNAKE_GRID_HEIGHT - 8 },
      ],
      direction: 'LEFT',
      pendingDirection: 'LEFT',
      alive: true,
      score: 0,
    });
    this.food = this.spawnFood();
  }

  setDirection(role, direction) {
    const snake = this.snakes.get(role);
    if (!snake || !snake.alive || !DELTA[direction]) return;
    if (direction === OPPOSITE[snake.direction]) return;
    snake.pendingDirection = direction;
  }

  spawnFood() {
    const occupied = new Set();
    for (const snake of this.snakes.values()) {
      for (const segment of snake.body) occupied.add(`${segment.x},${segment.y}`);
    }
    const free = [];
    for (let x = 0; x < SNAKE_GRID_WIDTH; x++) {
      for (let y = 0; y < SNAKE_GRID_HEIGHT; y++) {
        if (!occupied.has(`${x},${y}`)) free.push({ x, y });
      }
    }
    if (!free.length) return { x: 0, y: 0 };
    return free[Math.floor(this.random() * free.length)];
  }

  tick() {
    const a = this.snakes.get(1);
    const b = this.snakes.get(2);
    a.direction = a.pendingDirection;
    b.direction = b.pendingDirection;

    const newHeadA = {
      x: a.body[0].x + DELTA[a.direction].x,
      y: a.body[0].y + DELTA[a.direction].y,
    };
    const newHeadB = {
      x: b.body[0].x + DELTA[b.direction].x,
      y: b.body[0].y + DELTA[b.direction].y,
    };

    const willGrowA = samePoint(newHeadA, this.food);
    const willGrowB = samePoint(newHeadB, this.food);
    let reasonA = null;
    let reasonB = null;

    if (this.hitsWall(newHeadA)) reasonA = 'wall';
    if (this.hitsWall(newHeadB)) reasonB = 'wall';
    if (!reasonA && this.hitsOwnTail(newHeadA, a, willGrowA)) reasonA = 'self';
    if (!reasonB && this.hitsOwnTail(newHeadB, b, willGrowB)) reasonB = 'self';

    const headOn = samePoint(newHeadA, newHeadB);
    if (headOn) {
      if (!reasonA) reasonA = 'opponent';
      if (!reasonB) reasonB = 'opponent';
    } else {
      if (!reasonA && b.body.some(segment => samePoint(segment, newHeadA))) reasonA = 'opponent';
      if (!reasonB && a.body.some(segment => samePoint(segment, newHeadB))) reasonB = 'opponent';
    }

    if (reasonA || reasonB) {
      if (reasonA) a.alive = false;
      if (reasonB) b.alive = false;
      if (reasonA && reasonB) {
        return { gameOver: true, winner: null, reason: headOn ? 'draw' : reasonA };
      }
      if (reasonA) return { gameOver: true, winner: 2, reason: reasonA };
      return { gameOver: true, winner: 1, reason: reasonB };
    }

    this.advance(a, newHeadA, willGrowA);
    this.advance(b, newHeadB, willGrowB);
    if (willGrowA) {
      a.score += SNAKE_POINTS_PER_FOOD;
      this.food = this.spawnFood();
    }
    if (willGrowB) {
      b.score += SNAKE_POINTS_PER_FOOD;
      this.food = this.spawnFood();
    }
    return { gameOver: false, winner: null, reason: null };
  }

  advance(snake, newHead, grow) {
    snake.body.unshift(newHead);
    if (!grow) snake.body.pop();
  }

  hitsWall(point) {
    return point.x < 0 || point.x >= SNAKE_GRID_WIDTH || point.y < 0 || point.y >= SNAKE_GRID_HEIGHT;
  }

  hitsOwnTail(newHead, snake, grow) {
    const segments = grow ? snake.body : snake.body.slice(0, -1);
    return segments.some(segment => samePoint(segment, newHead));
  }

  getSnapshot() {
    return {
      snakes: [...this.snakes.entries()].map(([role, snake]) => ({
        role,
        name: snake.name,
        body: snake.body.map(point => ({ ...point })),
        alive: snake.alive,
        score: snake.score,
        direction: snake.direction,
      })),
      food: { ...this.food },
    };
  }

  getScores() {
    return { 1: this.snakes.get(1).score, 2: this.snakes.get(2).score };
  }
}
