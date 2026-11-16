import express from "express";
import http from "http";
import path from "path";
import { WebSocket, WebSocketServer } from "ws";
import { RoomManager } from "./RoomManager";
import { ClientMessage, Direction } from "../shared/protocol";

const PORT = Number(process.env.PORT) || 3000;
const VALID_DIRECTIONS = new Set<Direction>(["UP", "DOWN", "LEFT", "RIGHT"]);

const app = express();
app.use(express.static(path.join(__dirname, "..", "..", "public")));

const httpServer = http.createServer(app);
// Every legitimate message is a tiny JSON object, so a small cap is plenty.
// A larger payload makes the ws library close the connection (code 1009).
const MAX_MESSAGE_BYTES = 1024;
const wss = new WebSocketServer({ server: httpServer, maxPayload: MAX_MESSAGE_BYTES });
const roomManager = new RoomManager();

function parseMessage(raw: unknown): ClientMessage | null {
  let data: unknown;
  try {
    data = JSON.parse(String(raw));
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null || !("type" in data)) {
    return null;
  }
  return data as ClientMessage;
}

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (raw) => {
    const msg = parseMessage(raw);
    if (!msg) return;

    switch (msg.type) {
      case "join": {
        if (typeof msg.roomId === "string" && typeof msg.name === "string") {
          roomManager.join(ws, msg.roomId, msg.name);
        }
        break;
      }
      case "direction": {
        if (VALID_DIRECTIONS.has(msg.dir)) {
          roomManager.direction(ws, msg.dir);
        }
        break;
      }
      case "rematch": {
        roomManager.rematch(ws);
        break;
      }
    }
  });

  ws.on("close", () => {
    roomManager.disconnect(ws);
  });

  ws.on("error", () => {
    roomManager.disconnect(ws);
  });
});

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Snake Duel server running on http://localhost:${PORT}`);
});
