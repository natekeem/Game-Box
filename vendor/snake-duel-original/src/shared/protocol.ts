// Shared by the server and the client: board constants and the shape of the
// messages exchanged over WebSocket. This file imports nothing, so it compiles
// safely in both the server project (CommonJS) and the client project
// (ES modules for the browser).

export const GRID_WIDTH = 30;
export const GRID_HEIGHT = 20;
export const TICK_MS = 150;
export const POINTS_PER_FOOD = 10;

// Input limits. They mirror the maxlength attributes of the lobby form, but the
// server enforces them too, because a client can bypass the form entirely.
export const MAX_NAME_LENGTH = 16;
export const MAX_ROOM_ID_LENGTH = 24;

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type PlayerRole = 1 | 2;

export interface Point {
  x: number;
  y: number;
}

export interface SnakeView {
  role: PlayerRole;
  name: string;
  body: Point[];
  alive: boolean;
  score: number;
}

// --- Client -> server messages ---

export interface JoinMessage {
  type: "join";
  roomId: string;
  name: string;
}

export interface DirectionMessage {
  type: "direction";
  dir: Direction;
}

export interface RematchMessage {
  type: "rematch";
}

export type ClientMessage = JoinMessage | DirectionMessage | RematchMessage;

// --- Server -> client messages ---

export interface JoinedMessage {
  type: "joined";
  role: PlayerRole;
  controls: "WASD" | "ARROWS";
  roomId: string;
}

export interface WaitingMessage {
  type: "waiting_for_opponent";
}

export interface GameStartMessage {
  type: "game_start";
}

export type GameOverReason = "wall" | "self" | "opponent" | "opponent_disconnected" | "draw";

export interface StateMessage {
  type: "state";
  snakes: SnakeView[];
  food: Point;
  gridWidth: number;
  gridHeight: number;
}

export interface GameOverMessage {
  type: "game_over";
  winner: PlayerRole | null;
  reason: GameOverReason;
  scores: Record<PlayerRole, number>;
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export type ServerMessage =
  | JoinedMessage
  | WaitingMessage
  | GameStartMessage
  | StateMessage
  | GameOverMessage
  | ErrorMessage;
