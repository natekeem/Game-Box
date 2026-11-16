import {
  Direction,
  GameOverReason,
  GRID_HEIGHT,
  GRID_WIDTH,
  PlayerRole,
  ServerMessage,
  SnakeView,
  StateMessage,
  TICK_MS,
} from "../shared/protocol";
import { GameEngine } from "../shared/GameEngine";
import { escapeHtml } from "./escapeHtml";

type Mode = "online" | "local";

const COLORS = {
  bg: "#1f1a16",
  grid: "#2a221c",
  p1: "#e8b34a",
  p1Dim: "#7a6534",
  p2: "#4fd1c5",
  p2Dim: "#2f6b64",
  food: "#e85d4e",
};

const REASON_TEXT: Record<GameOverReason, string> = {
  wall: "Wall collision",
  self: "Collision with own tail",
  opponent: "Collision with opponent",
  opponent_disconnected: "Opponent disconnected",
  draw: "Head-on collision — draw",
};

const WASD_MAP: Record<string, Direction> = { w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT" };
const ARROW_MAP: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
};

function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found in the DOM`);
  return el as T;
}

const viewLobby = $<HTMLElement>("view-lobby");
const viewGame = $<HTMLElement>("view-game");

const tabOnline = $<HTMLButtonElement>("tab-online");
const tabLocal = $<HTMLButtonElement>("tab-local");

const joinForm = $<HTMLFormElement>("join-form");
const inputRoom = $<HTMLInputElement>("input-room");
const inputName = $<HTMLInputElement>("input-name");
const joinButton = $<HTMLButtonElement>("join-button");

const localForm = $<HTMLFormElement>("local-form");
const inputLocalName1 = $<HTMLInputElement>("input-local-name1");
const inputLocalName2 = $<HTMLInputElement>("input-local-name2");

const legendOnline = $<HTMLParagraphElement>("legend-online");
const legendLocal = $<HTMLParagraphElement>("legend-local");
const lobbyError = $<HTMLParagraphElement>("lobby-error");

const nameP1 = $<HTMLSpanElement>("name-p1");
const nameP2 = $<HTMLSpanElement>("name-p2");
const scoreP1 = $<HTMLSpanElement>("score-p1");
const scoreP2 = $<HTMLSpanElement>("score-p2");
const roomTagLabel = $<HTMLSpanElement>("room-tag-label");
const roomCode = $<HTMLSpanElement>("room-code");

const canvas = $<HTMLCanvasElement>("board");
const ctx = canvas.getContext("2d")!;
const overlay = $<HTMLDivElement>("overlay");
const overlayContent = $<HTMLDivElement>("overlay-content");

let mode: Mode = "online";
let isPlaying = false;

// --- online mode state ---
let ws: WebSocket | null = null;
let myRole: PlayerRole | null = null;
let myControls: "WASD" | "ARROWS" | null = null;

// --- local mode state ---
let localEngine: GameEngine | null = null;
let localTickHandle: number | null = null;

function showError(message: string): void {
  lobbyError.textContent = message;
  lobbyError.hidden = false;
}

// --- Switching mode tabs in the lobby ---

function setActiveTab(target: Mode): void {
  const isOnline = target === "online";
  tabOnline.classList.toggle("active", isOnline);
  tabOnline.setAttribute("aria-selected", String(isOnline));
  tabLocal.classList.toggle("active", !isOnline);
  tabLocal.setAttribute("aria-selected", String(!isOnline));
  joinForm.hidden = !isOnline;
  localForm.hidden = isOnline;
  legendOnline.hidden = !isOnline;
  legendLocal.hidden = isOnline;
  lobbyError.hidden = true;
}

tabOnline.addEventListener("click", () => setActiveTab("online"));
tabLocal.addEventListener("click", () => setActiveTab("local"));

// --- Online mode ---

function connect(): WebSocket {
  const protocol = location.protocol === "https:" ? "wss://" : "ws://";
  return new WebSocket(`${protocol}${location.host}`);
}

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const roomId = inputRoom.value.trim();
  const name = inputName.value.trim();
  if (!roomId || !name) return;

  mode = "online";
  lobbyError.hidden = true;
  joinButton.disabled = true;

  ws = connect();
  ws.addEventListener("open", () => {
    ws!.send(JSON.stringify({ type: "join", roomId, name }));
  });
  ws.addEventListener("message", (event) => {
    handleServerMessage(JSON.parse(event.data) as ServerMessage);
  });
  ws.addEventListener("close", () => {
    if (isPlaying) {
      isPlaying = false;
      showOverlay(overlayGameOverHtml(null, "opponent_disconnected", { 1: 0, 2: 0 }));
    } else {
      joinButton.disabled = false;
      showError("Lost connection to the server. Please try again.");
    }
  });
  ws.addEventListener("error", () => {
    joinButton.disabled = false;
    showError("Could not connect to the server.");
  });
});

function handleServerMessage(msg: ServerMessage): void {
  switch (msg.type) {
    case "joined": {
      myRole = msg.role;
      myControls = msg.controls;
      roomTagLabel.textContent = "Room";
      roomCode.textContent = msg.roomId;
      viewLobby.hidden = true;
      viewGame.hidden = false;
      document.querySelector(`.badge-p${myRole}`)?.classList.add("badge-mine");
      break;
    }
    case "waiting_for_opponent": {
      showOverlay(overlayWaitingHtml());
      break;
    }
    case "game_start": {
      isPlaying = true;
      hideOverlay();
      break;
    }
    case "state": {
      renderState(msg);
      break;
    }
    case "game_over": {
      isPlaying = false;
      renderFinalScores(msg.scores);
      showOverlay(overlayGameOverHtml(msg.winner, msg.reason, msg.scores));
      break;
    }
    case "error": {
      if (myRole === null) {
        joinButton.disabled = false;
        showError(msg.message);
      }
      break;
    }
  }
}

// --- Local mode ---

localForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name1 = inputLocalName1.value.trim() || "Player 1";
  const name2 = inputLocalName2.value.trim() || "Player 2";
  startLocalGame(name1, name2);
});

function startLocalGame(name1: string, name2: string): void {
  mode = "local";
  localEngine = new GameEngine({ 1: name1, 2: name2 });
  isPlaying = true;

  viewLobby.hidden = true;
  viewGame.hidden = false;
  roomTagLabel.textContent = "Mode";
  roomCode.textContent = "local game";
  document.querySelectorAll(".badge-mine").forEach((el) => el.classList.remove("badge-mine"));
  hideOverlay();

  if (localTickHandle !== null) {
    window.clearInterval(localTickHandle);
  }
  localTickHandle = window.setInterval(runLocalTick, TICK_MS);
}

function runLocalTick(): void {
  if (!localEngine) return;
  const result = localEngine.tick();
  const snapshot = localEngine.getSnapshot();
  renderState({
    type: "state",
    snakes: snapshot.snakes,
    food: snapshot.food,
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
  });

  if (result.gameOver) {
    isPlaying = false;
    if (localTickHandle !== null) {
      window.clearInterval(localTickHandle);
      localTickHandle = null;
    }
    showOverlay(overlayGameOverHtml(result.winner, result.reason ?? "draw", localEngine.getScores()));
  }
}

// --- Shared rendering (used by both modes) ---

function renderState(state: StateMessage): void {
  for (const snake of state.snakes) {
    updateBadge(snake);
  }
  draw(state);
}

function renderFinalScores(scores: Record<PlayerRole, number>): void {
  scoreP1.textContent = String(scores[1]);
  scoreP2.textContent = String(scores[2]);
}

function updateBadge(snake: SnakeView): void {
  if (snake.role === 1) {
    nameP1.textContent = snake.name;
    scoreP1.textContent = String(snake.score);
  } else {
    nameP2.textContent = snake.name;
    scoreP2.textContent = String(snake.score);
  }
}

function draw(state: StateMessage): void {
  const cellW = canvas.width / state.gridWidth;
  const cellH = canvas.height / state.gridHeight;

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let x = 1; x < state.gridWidth; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellW, 0);
    ctx.lineTo(x * cellW, canvas.height);
    ctx.stroke();
  }
  for (let y = 1; y < state.gridHeight; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellH);
    ctx.lineTo(canvas.width, y * cellH);
    ctx.stroke();
  }

  ctx.fillStyle = COLORS.food;
  drawCell(state.food.x, state.food.y, cellW, cellH, 0.35);

  for (const snake of state.snakes) {
    const [main, dim] = snake.role === 1 ? [COLORS.p1, COLORS.p1Dim] : [COLORS.p2, COLORS.p2Dim];
    snake.body.forEach((segment, index) => {
      ctx.fillStyle = snake.alive ? (index === 0 ? main : dim) : "#4a4239";
      drawCell(segment.x, segment.y, cellW, cellH, index === 0 ? 0.15 : 0.25);
    });
  }
}

function drawCell(x: number, y: number, w: number, h: number, inset: number): void {
  const pad = Math.min(w, h) * inset * 0.5;
  ctx.fillRect(x * w + pad, y * h + pad, w - pad * 2, h - pad * 2);
}

// --- Overlay (waiting / game over) ---

function showOverlay(html: string): void {
  overlayContent.innerHTML = html;
  overlay.hidden = false;

  overlayContent.querySelector("#rematch-btn")?.addEventListener("click", () => {
    if (mode === "online") {
      ws?.send(JSON.stringify({ type: "rematch" }));
      const btn = overlayContent.querySelector("#rematch-btn") as HTMLButtonElement;
      btn.textContent = "Waiting for opponent…";
      btn.disabled = true;
    } else {
      startLocalGame(nameP1.textContent || "Player 1", nameP2.textContent || "Player 2");
    }
  });
  overlayContent.querySelector("#new-room-btn")?.addEventListener("click", () => {
    location.reload();
  });
}

function hideOverlay(): void {
  overlay.hidden = true;
}

function overlayWaitingHtml(): string {
  return `
    <div>
      <div class="pulse-dot"></div>
      <p class="overlay-title">Waiting for opponent</p>
      <p class="overlay-sub">Give the other player this room code: <strong>${escapeHtml(roomCode.textContent ?? "")}</strong></p>
    </div>
  `;
}

function overlayGameOverHtml(
  winner: PlayerRole | null,
  reason: GameOverReason,
  scores: Record<PlayerRole, number>
): string {
  // Player names come from other clients, so they must be escaped before
  // being interpolated into the HTML template below.
  const name1 = escapeHtml(nameP1.textContent ?? "");
  const name2 = escapeHtml(nameP2.textContent ?? "");

  let title: string;
  if (mode === "online") {
    title = winner === null ? "Draw" : winner === myRole ? "You won!" : "You lost";
  } else {
    title = winner === null ? "Draw" : `${winner === 1 ? name1 : name2} wins`;
  }
  const secondaryLabel = mode === "online" ? "New room" : "Main menu";

  return `
    <div>
      <p class="overlay-title">${title}</p>
      <p class="overlay-sub">${REASON_TEXT[reason]}</p>
      <div class="overlay-scores">
        <span>${name1}: ${scores[1]}</span>
        <span>${name2}: ${scores[2]}</span>
      </div>
      <div class="overlay-actions">
        <button id="rematch-btn" class="primary" type="button">Rematch</button>
        <button id="new-room-btn" type="button">${secondaryLabel}</button>
      </div>
    </div>
  `;
}

// --- Keyboard: WASD + arrow keys simultaneously in local mode,
//     only the assigned set in online mode ---

window.addEventListener("keydown", (event) => {
  if (!isPlaying) return;

  if (mode === "local") {
    const dir1 = WASD_MAP[event.key.toLowerCase()];
    const dir2 = ARROW_MAP[event.key];
    if (dir1) {
      event.preventDefault();
      localEngine?.setDirection(1, dir1);
    } else if (dir2) {
      event.preventDefault();
      localEngine?.setDirection(2, dir2);
    }
    return;
  }

  if (!myControls || !ws) return;
  const map = myControls === "WASD" ? WASD_MAP : ARROW_MAP;
  const key = myControls === "WASD" ? event.key.toLowerCase() : event.key;
  const dir = map[key];
  if (!dir) return;
  event.preventDefault();
  ws.send(JSON.stringify({ type: "direction", dir }));
});
