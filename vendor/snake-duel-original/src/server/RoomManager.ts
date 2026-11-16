import type { WebSocket } from "ws";
import { GameEngine } from "../shared/GameEngine";
import {
  Direction,
  ErrorMessage,
  GameOverMessage,
  GameStartMessage,
  JoinedMessage,
  PlayerRole,
  ServerMessage,
  StateMessage,
  TICK_MS,
  WaitingMessage,
  GRID_WIDTH,
  GRID_HEIGHT,
  MAX_NAME_LENGTH,
  MAX_ROOM_ID_LENGTH,
} from "../shared/protocol";

interface SeatedPlayer {
  ws: WebSocket;
  role: PlayerRole;
  name: string;
}

interface ConnectionContext {
  roomId: string;
  role: PlayerRole;
}

class Room {
  readonly id: string;
  private players: Map<PlayerRole, SeatedPlayer> = new Map();
  private engine: GameEngine | null = null;
  private intervalHandle: ReturnType<typeof setInterval> | null = null;
  private rematchRequests: Set<PlayerRole> = new Set();
  private onEmpty: () => void;

  constructor(id: string, onEmpty: () => void) {
    this.id = id;
    this.onEmpty = onEmpty;
  }

  get isFull(): boolean {
    return this.players.size >= 2;
  }

  /** Returns the assigned role, or null if the room is already full. */
  addPlayer(ws: WebSocket, name: string): PlayerRole | null {
    if (this.isFull) return null;
    const role: PlayerRole = this.players.has(1) ? 2 : 1;
    this.players.set(role, { ws, role, name: name.trim().slice(0, MAX_NAME_LENGTH) || `Player ${role}` });

    const joined: JoinedMessage = {
      type: "joined",
      role,
      controls: role === 1 ? "WASD" : "ARROWS",
      roomId: this.id,
    };
    this.send(ws, joined);

    if (this.isFull) {
      this.startGame();
    } else {
      const waiting: WaitingMessage = { type: "waiting_for_opponent" };
      this.send(ws, waiting);
    }
    return role;
  }

  setDirection(role: PlayerRole, dir: Direction): void {
    this.engine?.setDirection(role, dir);
  }

  removePlayer(role: PlayerRole): void {
    this.players.delete(role);
    this.stopTicking();

    if (this.players.size > 0) {
      const remaining = [...this.players.values()][0];
      const msg: GameOverMessage = {
        type: "game_over",
        winner: remaining.role,
        reason: "opponent_disconnected",
        scores: this.engine?.getScores() ?? { 1: 0, 2: 0 },
      };
      this.send(remaining.ws, msg);
    }

    this.engine = null;
    if (this.players.size === 0) {
      this.onEmpty();
    }
  }

  requestRematch(role: PlayerRole): void {
    if (!this.isFull) return;
    this.rematchRequests.add(role);
    if (this.rematchRequests.size === this.players.size) {
      this.rematchRequests.clear();
      this.startGame();
    }
  }

  private startGame(): void {
    const nameByRole = {
      1: this.players.get(1)?.name ?? "Player 1",
      2: this.players.get(2)?.name ?? "Player 2",
    };
    this.engine = new GameEngine(nameByRole);
    this.broadcast<GameStartMessage>({ type: "game_start" });
    this.stopTicking();
    this.intervalHandle = setInterval(() => this.tick(), TICK_MS);
  }

  private tick(): void {
    if (!this.engine) return;
    const result = this.engine.tick();
    const snapshot = this.engine.getSnapshot();

    const state: StateMessage = {
      type: "state",
      snakes: snapshot.snakes,
      food: snapshot.food,
      gridWidth: GRID_WIDTH,
      gridHeight: GRID_HEIGHT,
    };
    this.broadcast(state);

    if (result.gameOver) {
      this.stopTicking();
      const gameOver: GameOverMessage = {
        type: "game_over",
        winner: result.winner,
        reason: result.reason ?? "draw",
        scores: this.engine.getScores(),
      };
      this.broadcast(gameOver);
    }
  }

  private stopTicking(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  private broadcast<T extends ServerMessage>(msg: T): void {
    for (const player of this.players.values()) {
      this.send(player.ws, msg);
    }
  }

  private send(ws: WebSocket, msg: ServerMessage): void {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private contextByWs: WeakMap<WebSocket, ConnectionContext> = new WeakMap();

  join(ws: WebSocket, roomId: string, name: string): void {
    const normalizedId = roomId.trim();
    if (!normalizedId) {
      this.sendError(ws, "Please enter a room ID.");
      return;
    }
    if (normalizedId.length > MAX_ROOM_ID_LENGTH) {
      this.sendError(ws, `Room ID is too long (max ${MAX_ROOM_ID_LENGTH} characters).`);
      return;
    }
    if (this.contextByWs.has(ws)) {
      this.sendError(ws, "You are already in a room.");
      return;
    }

    let room = this.rooms.get(normalizedId);
    if (!room) {
      room = new Room(normalizedId, () => this.rooms.delete(normalizedId));
      this.rooms.set(normalizedId, room);
    }
    if (room.isFull) {
      this.sendError(ws, "This room is already full (max 2 players).");
      return;
    }

    const role = room.addPlayer(ws, name);
    if (role === null) {
      this.sendError(ws, "This room is already full (max 2 players).");
      return;
    }
    this.contextByWs.set(ws, { roomId: normalizedId, role });
  }

  direction(ws: WebSocket, dir: Direction): void {
    const ctx = this.contextByWs.get(ws);
    if (!ctx) return;
    this.rooms.get(ctx.roomId)?.setDirection(ctx.role, dir);
  }

  rematch(ws: WebSocket): void {
    const ctx = this.contextByWs.get(ws);
    if (!ctx) return;
    this.rooms.get(ctx.roomId)?.requestRematch(ctx.role);
  }

  disconnect(ws: WebSocket): void {
    const ctx = this.contextByWs.get(ws);
    if (!ctx) return;
    this.contextByWs.delete(ws);
    this.rooms.get(ctx.roomId)?.removePlayer(ctx.role);
  }

  private sendError(ws: WebSocket, message: string): void {
    const msg: ErrorMessage = { type: "error", message };
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }
}
