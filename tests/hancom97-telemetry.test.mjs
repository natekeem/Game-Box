import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createHancom97Telemetry,
  detectPositionTarget,
  isPositionCompletionDialog,
  normalizeFrame,
} from '../original-player-src/hancom97-telemetry.js';

function frame() {
  return { pixels: new Uint8Array(640 * 480 * 3).fill(170), width: 640, height: 480, stride: 3 };
}

function paint(target, x, y, width, height, color) {
  for (let row = y; row < y + height; row++) for (let column = x; column < x + width; column++) {
    const offset = (row * target.width + column) * target.stride;
    target.pixels.set(color, offset);
  }
}

test('자리연습 키 강조와 완료 대화상자를 원본 프레임에서 판별한다', () => {
  const practice = frame();
  paint(practice, 142, 248, 31, 21, [255, 255, 0]);
  assert.equal(detectPositionTarget(practice), 'KeyA');
  assert.equal(isPositionCompletionDialog(practice), false);

  const dialog = frame();
  paint(dialog, 208, 184, 270, 22, [0, 0, 138]);
  assert.equal(isPositionCompletionDialog(dialog), true);
  assert.equal(normalizeFrame(dialog.pixels, null, 640, 480).stride, 3);
});

test('자리연습 완료 순간 타수와 정확도를 한 번만 기록한다', () => {
  let onFrame;
  let keyDown;
  let clock = 0;
  const attempts = [];
  const eventTarget = {
    addEventListener(type, listener) { if (type === 'keydown') keyDown = listener; },
    removeEventListener() {},
  };
  const commandInterface = {
    width: () => 640,
    height: () => 480,
    events: () => ({ onFrame(listener) { onFrame = listener; } }),
  };
  const telemetry = createHancom97Telemetry(commandInterface, { eventTarget, now: () => clock, onAttempt: attempt => attempts.push(attempt) });
  const practice = frame(); paint(practice, 142, 248, 31, 21, [255, 255, 0]);
  onFrame(practice.pixels, null);
  for (let index = 0; index < 10; index++) {
    keyDown({ code: index === 9 ? 'KeyS' : 'KeyA', repeat: false });
    clock += 6_000;
  }
  const dialog = frame(); paint(dialog, 208, 184, 270, 22, [0, 0, 138]);
  onFrame(dialog.pixels, null); onFrame(dialog.pixels, null);

  assert.equal(attempts.length, 1);
  assert.equal(attempts[0].category, 'typing-position');
  assert.equal(attempts[0].accuracy, 90);
  assert.equal(attempts[0].speed, 9);
  telemetry.stop();
});
