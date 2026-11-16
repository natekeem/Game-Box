import {
  Direction,
  GRID_HEIGHT,
  GRID_WIDTH,
  GameOverReason,
  POINTS_PER_FOOD,
  Point,
  PlayerRole,
  SnakeView,
} from "./protocol";

interface SnakeState {
  name: string;
  body: Point[]; // body[0] is the head
  direction: Direction;
  pendingDirection: Direction;
  alive: boolean;
  score: number;
}

export interface TickResult {
  gameOver: boolean;
  winner: PlayerRole | null;
  reason: GameOverReason | null;
}

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const DELTA: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export class GameEngine {
  private snakes: Map<PlayerRole, SnakeState> = new Map();
  private food: Point;

  constructor(nameByRole: Record<PlayerRole, string>) {
    this.snakes.set(1, {
      name: nameByRole[1],
      body: [
        { x: 5, y: 7 },
        { x: 4, y: 7 },
        { x: 3, y: 7 },
      ],
      direction: "RIGHT",
      pendingDirection: "RIGHT",
      alive: true,
      score: 0,
    });
    this.snakes.set(2, {
      name: nameByRole[2],
      body: [
        { x: GRID_WIDTH - 6, y: GRID_HEIGHT - 8 },
        { x: GRID_WIDTH - 5, y: GRID_HEIGHT - 8 },
        { x: GRID_WIDTH - 4, y: GRID_HEIGHT - 8 },
      ],
      direction: "LEFT",
      pendingDirection: "LEFT",
      alive: true,
      score: 0,
    });
    this.food = this.spawnFood();
  }

  setDirection(role: PlayerRole, dir: Direction): void {
    const snake = this.snakes.get(role);
    if (!snake || !snake.alive) return;
    // Disallow an instant 180° turn. This isn't a player mistake — we simply
    // ignore the impossible move (otherwise the snake would immediately run
    // into its own neck).
    if (dir === OPPOSITE[snake.direction]) return;
    snake.pendingDirection = dir;
  }

  private spawnFood(): Point {
    const occupied = new Set<string>();
    for (const snake of this.snakes.values()) {
      for (const segment of snake.body) {
        occupied.add(`${segment.x},${segment.y}`);
      }
    }
    const free: Point[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT; y++) {
        if (!occupied.has(`${x},${y}`)) {
          free.push({ x, y });
        }
      }
    }
    if (free.length === 0) {
      // The board is completely full of snakes — a theoretical case, return anything.
      return { x: 0, y: 0 };
    }
    return free[Math.floor(Math.random() * free.length)];
  }

  tick(): TickResult {
    const a = this.snakes.get(1)!;
    const b = this.snakes.get(2)!;

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

    let reasonA: GameOverReason | null = null;
    let reasonB: GameOverReason | null = null;

    // Wall
    if (this.hitsWall(newHeadA)) reasonA = "wall";
    if (this.hitsWall(newHeadB)) reasonB = "wall";

    // Own tail (excluding the tail cell, which is about to vacate anyway, unless the snake is growing)
    if (!reasonA && this.hitsOwnTail(newHeadA, a, willGrowA)) reasonA = "self";
    if (!reasonB && this.hitsOwnTail(newHeadB, b, willGrowB)) reasonB = "self";

    // Head-on collision (both die)
    const headOn = samePoint(newHeadA, newHeadB);
    if (headOn) {
      if (!reasonA) reasonA = "opponent";
      if (!reasonB) reasonB = "opponent";
    } else {
      // Running into the opponent's body (its position from before this tick's move)
      if (!reasonA && b.body.some((seg) => samePoint(seg, newHeadA))) {
        reasonA = "opponent";
      }
      if (!reasonB && a.body.some((seg) => samePoint(seg, newHeadB))) {
        reasonB = "opponent";
      }
    }

    if (reasonA || reasonB) {
      if (reasonA) a.alive = false;
      if (reasonB) b.alive = false;

      if (reasonA && reasonB) {
        return { gameOver: true, winner: null, reason: headOn ? "draw" : reasonA };
      }
      if (reasonA) {
        return { gameOver: true, winner: 2, reason: reasonA };
      }
      return { gameOver: true, winner: 1, reason: reasonB! };
    }

    // No collision — move both snakes.
    this.advance(a, newHeadA, willGrowA);
    this.advance(b, newHeadB, willGrowB);

    if (willGrowA) {
      a.score += POINTS_PER_FOOD;
      this.food = this.spawnFood();
    }
    if (willGrowB) {
      b.score += POINTS_PER_FOOD;
      this.food = this.spawnFood();
    }

    return { gameOver: false, winner: null, reason: null };
  }

  private advance(snake: SnakeState, newHead: Point, grow: boolean): void {
    snake.body.unshift(newHead);
    if (!grow) {
      snake.body.pop();
    }
  }

  private hitsWall(p: Point): boolean {
    return p.x < 0 || p.x >= GRID_WIDTH || p.y < 0 || p.y >= GRID_HEIGHT;
  }

  private hitsOwnTail(newHead: Point, snake: SnakeState, grow: boolean): boolean {
    const segmentsToCheck = grow ? snake.body : snake.body.slice(0, -1);
    return segmentsToCheck.some((seg) => samePoint(seg, newHead));
  }

  getSnapshot(): { snakes: SnakeView[]; food: Point } {
    const snakes: SnakeView[] = [];
    for (const [role, snake] of this.snakes.entries()) {
      snakes.push({
        role,
        name: snake.name,
        body: snake.body,
        alive: snake.alive,
        score: snake.score,
      });
    }
    return { snakes, food: this.food };
  }

  getScores(): Record<PlayerRole, number> {
    return {
      1: this.snakes.get(1)!.score,
      2: this.snakes.get(2)!.score,
    };
  }
}
