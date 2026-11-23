/**
 * GAMEBOX RANDOM PLAY ZONE — Unbiased Random & Cryptography Engine
 *
 * Adapted & reused from:
 * - Tae-sung-Kim/pickle-eight (src/lib/random.ts, MIT License, Copyright (c) 2025 Tae-sung Kim)
 * - alsatianco/spin-the-wheel (utils.js, MIT License, Copyright (c) 2026 alsatianco)
 *
 * Guarantees:
 * - Uses Web Crypto API (crypto.getRandomValues) with rejection sampling to eliminate modulo bias.
 * - Separates pure deterministic/stochastic draw outcome computation from UI animation state.
 */

const UINT32_RANGE = 0x100000000;
const POOL_SIZE = 256;
const pool = new Uint32Array(POOL_SIZE);
let poolIndex = POOL_SIZE;

function nextUint32() {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    if (poolIndex >= POOL_SIZE) {
      globalThis.crypto.getRandomValues(pool);
      poolIndex = 0;
    }
    return pool[poolIndex++];
  }
  return Math.floor(Math.random() * UINT32_RANGE);
}

/**
 * Unbiased integer in [0, maxExclusive) using rejection sampling
 * (From Tae-sung-Kim/pickle-eight src/lib/random.ts)
 */
export function secureRandomInt(maxExclusive) {
  const n = Math.floor(Number(maxExclusive));
  if (!Number.isFinite(n) || n <= 1) return 0;
  const threshold = Math.floor(UINT32_RANGE / n) * n;
  while (true) {
    const r = nextUint32();
    if (r < threshold) return r % n;
  }
}

/**
 * Unbiased float in [0, 1)
 * (From Tae-sung-Kim/pickle-eight & alsatianco/spin-the-wheel)
 */
export function secureRandomFloat() {
  return nextUint32() / UINT32_RANGE;
}

/**
 * Unbiased Fisher-Yates shuffle returning a new array
 */
export function shuffleUnbiased(items) {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/**
 * Format timestamp for history log
 */
export function formatDrawTime(ts = Date.now()) {
  try {
    return new Date(ts).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return '';
  }
}
