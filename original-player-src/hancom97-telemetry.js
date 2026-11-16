const KEY_RECTS = Object.freeze([
  ...['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backslash']
    .map((code, index) => ({ code, x: 78 + index * 32, y: 184, width: 31, height: 21 })),
  ...['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight']
    .map((code, index) => ({ code, x: 110 + index * 32, y: 216, width: 31, height: 21 })),
  ...['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote']
    .map((code, index) => ({ code, x: 142 + index * 32, y: 248, width: 31, height: 21 })),
  ...['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash']
    .map((code, index) => ({ code, x: 158 + index * 32, y: 280, width: 31, height: 21 })),
]);

function pixel(frame, x, y) {
  const offset = (y * frame.width + x) * frame.stride;
  return [frame.pixels[offset], frame.pixels[offset + 1], frame.pixels[offset + 2]];
}

function countColor(frame, rect, predicate) {
  let count = 0;
  const maxX = Math.min(frame.width, rect.x + rect.width);
  const maxY = Math.min(frame.height, rect.y + rect.height);
  for (let y = Math.max(0, rect.y); y < maxY; y++) {
    for (let x = Math.max(0, rect.x); x < maxX; x++) {
      if (predicate(...pixel(frame, x, y))) count++;
    }
  }
  return count;
}

export function normalizeFrame(rgb, rgba, width, height) {
  const source = rgb || rgba;
  if (!source || !width || !height) return null;
  const pixels = source instanceof Uint8Array ? source : new Uint8Array(source);
  const stride = pixels.length >= width * height * 4 ? 4 : 3;
  if (pixels.length < width * height * stride) return null;
  return { pixels, width, height, stride };
}

export function detectPositionTarget(frame) {
  if (!frame || frame.width < 600 || frame.height < 400) return null;
  let best = null;
  for (const rect of KEY_RECTS) {
    const yellow = countColor(frame, rect, (red, green, blue) => red > 200 && green > 200 && blue < 130);
    if (yellow >= 6 && (!best || yellow > best.yellow)) best = { code: rect.code, yellow };
  }
  return best?.code || null;
}

export function isPositionCompletionDialog(frame) {
  if (!frame || frame.width < 600 || frame.height < 400) return false;
  const navy = countColor(frame, { x: 208, y: 184, width: 270, height: 22 },
    (red, green, blue) => red < 20 && green < 20 && blue > 100 && blue < 180);
  return navy > 3000;
}

export function createHancom97Telemetry(commandInterface, {
  eventTarget = globalThis.window,
  now = () => performance.now(),
  onAttempt = attempt => eventTarget?.dispatchEvent(new CustomEvent('hancom97-attempt', { detail: attempt })),
} = {}) {
  if (!commandInterface?.events || !commandInterface?.width || !commandInterface?.height) {
    throw new Error('유효한 js-dos CommandInterface가 필요합니다.');
  }

  let stopped = false;
  let currentTarget = null;
  let session = null;
  let dialogVisible = false;

  function resetSession() {
    session = { startedAt: null, total: 0, correct: 0 };
  }

  function onKeyDown(event) {
    if (stopped || dialogVisible || !currentTarget || event.repeat) return;
    if (!KEY_RECTS.some(rect => rect.code === event.code)) return;
    if (!session) resetSession();
    if (session.startedAt == null) session.startedAt = now();
    session.total++;
    if (event.code === currentTarget) session.correct++;
  }

  function onFrame(rgb, rgba) {
    if (stopped) return;
    const frame = normalizeFrame(rgb, rgba, commandInterface.width(), commandInterface.height());
    if (!frame) return;
    const completed = isPositionCompletionDialog(frame);
    if (completed && !dialogVisible && session?.startedAt != null && session.correct >= 5) {
      const elapsedMs = Math.max(1, now() - session.startedAt);
      const accuracy = Math.min(100, session.total ? session.correct / session.total * 100 : 0);
      onAttempt({
        category: 'typing-position',
        speed: Math.min(5000, Math.round(session.correct / (elapsedMs / 60_000))),
        accuracy: Math.round(accuracy * 10) / 10,
        elapsedMs: Math.round(elapsedMs),
        source: 'original-screen-telemetry',
        clientAttemptId: crypto.randomUUID(),
        occurredAt: new Date().toISOString(),
      });
      session = null;
    }
    dialogVisible = completed;
    currentTarget = completed ? null : detectPositionTarget(frame);
    if (!completed && currentTarget && !session) resetSession();
  }

  eventTarget?.addEventListener('keydown', onKeyDown, true);
  commandInterface.events().onFrame(onFrame);

  return {
    stop() {
      stopped = true;
      eventTarget?.removeEventListener('keydown', onKeyDown, true);
    },
  };
}

export const HANCOM97_POSITION_KEYS = Object.freeze(KEY_RECTS.map(rect => rect.code));
