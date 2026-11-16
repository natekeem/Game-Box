const IDENTITY_KEY = "gameBox_guest_identity_v1";
const PROCESSED_EVENTS = new Set();

function generateGuestUuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return "guest-" + crypto.randomUUID();
  }
  return "guest-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

export function getWin98PlayerIdentity() {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.guestId) {
        return {
          playerId: parsed.guestId,
          guestId: parsed.guestId,
          nickname: parsed.nickname || "",
          createdAt: parsed.createdAt || null,
          updatedAt: parsed.updatedAt || null,
          isRegistered: Boolean(parsed.nickname),
          identityType: "guest",
        };
      }
    }
  } catch (e) {
    console.warn("[Win98Bridge] Failed to read guest identity:", e);
  }
  const freshId = generateGuestUuid();
  const initial = {
    guestId: freshId,
    nickname: "",
    createdAt: null,
    updatedAt: null,
  };
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(initial));
  } catch {}
  return {
    playerId: freshId,
    guestId: freshId,
    nickname: "",
    createdAt: null,
    updatedAt: null,
    isRegistered: false,
    identityType: "guest",
  };
}

export async function updateWin98PlayerNickname(newNickname) {
  const trimmed = String(newNickname || "")
    .replace(/[<>'"&`\\/\x00-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (trimmed.length < 2 || trimmed.length > 16) {
    throw new Error("닉네임은 특수문자를 제외한 2~16자로 입력해주세요.");
  }

  const current = getWin98PlayerIdentity();
  const now = new Date().toISOString();
  const updated = {
    guestId: current.guestId,
    nickname: trimmed,
    createdAt: current.createdAt || now,
    updatedAt: now,
  };
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(updated));

  const res = await fetch("/api/game-box/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      playerId: updated.guestId,
      guestId: updated.guestId,
      nickname: updated.nickname,
      identityType: "guest",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "닉네임 저장에 실패했습니다.");
  }

  window.dispatchEvent(new CustomEvent("game-box:identity-changed", { detail: updated }));
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { source: "game-box-win98", type: "identity:updated", payload: updated },
        window.location.origin
      );
    }
  } catch {}
  return updated;
}

export async function processWin98GameEvent(rawPayload) {
  if (!rawPayload || typeof rawPayload !== "object") return null;
  const eventType = String(rawPayload.eventType || rawPayload.type || "").trim();
  if (!["game:start", "game:progress", "game:complete", "game:abort"].includes(eventType)) {
    return null;
  }

  const identity = getWin98PlayerIdentity();
  const playerId = rawPayload.playerId || identity.guestId;
  const nickname = rawPayload.nickname || identity.nickname || "게스트";
  const clientEventId = String(
    rawPayload.clientEventId || `${rawPayload.gameSessionId || "sess"}-${eventType}-${Date.now()}`
  );

  if ((eventType === "game:complete" || eventType === "game:abort") && PROCESSED_EVENTS.has(clientEventId)) {
    return { duplicated: true };
  }
  if (eventType === "game:complete" || eventType === "game:abort") {
    PROCESSED_EVENTS.add(clientEventId);
  }

  const normalized = {
    ...rawPayload,
    playerId,
    guestId: playerId,
    nickname,
    eventType,
    clientEventId,
  };

  try {
    // Ensure player is registered in DB before recording session/result
    if (nickname) {
      await fetch("/api/game-box/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, guestId: playerId, nickname, identityType: "guest" }),
      }).catch(() => {});
    }

    if (eventType === "game:start" || eventType === "game:progress") {
      await fetch("/api/game-box/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
    } else if (eventType === "game:complete") {
      const res = await fetch("/api/game-box/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      const saved = await res.json().catch(() => ({}));
      window.dispatchEvent(
        new CustomEvent("game-box:ranking-updated", {
          detail: { event: normalized, saved },
        })
      );
    } else if (eventType === "game:abort") {
      await fetch("/api/game-box/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
    }
  } catch (err) {
    console.warn("[Win98Bridge] Failed to persist game event:", err);
  }

  // Also forward to top-level /game-box host if win98-web is running inside an iframe
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { source: "game-box-runtime", type: eventType, payload: normalized },
        window.location.origin
      );
    }
  } catch {}

  return normalized;
}

export function initGameBoxWin98Bridge() {
  window.GameBoxBridge = {
    getPlayerIdentity: getWin98PlayerIdentity,
    updatePlayerNickname: updateWin98PlayerNickname,
    processGameEvent: processWin98GameEvent,
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;

    if (data.source === "game-box-runtime") {
      processWin98GameEvent(data.payload || data);
    } else if (data.source === "game-box-host" && data.type === "identity:sync" && data.payload) {
      try {
        localStorage.setItem(IDENTITY_KEY, JSON.stringify(data.payload));
        window.dispatchEvent(new CustomEvent("game-box:identity-changed", { detail: data.payload }));
      } catch {}
    }
  });

  // Auto-open GAME RANKING window on the right side of the desktop when ready
  document.addEventListener("desktop-ready-to-launch-apps", () => {
    setTimeout(() => {
      if (window.System && typeof window.System.launchApp === "function") {
        window.System.launchApp("retro-ranking");
      }
    }, 250);
  });
}
