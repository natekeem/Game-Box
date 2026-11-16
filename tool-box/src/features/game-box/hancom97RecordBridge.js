const RECORD_FILES = new Set(['HTP.SCO', 'HTT.STA']);
const MAX_RECORD_BYTES = 128 * 1024;

function recordName(filePath) {
  const normalized = String(filePath || '').replaceAll('\\', '/').replace(/^\.\//, '');
  if (!normalized || normalized.includes('..') || normalized.includes('/')) return null;
  const upper = normalized.toUpperCase();
  return RECORD_FILES.has(upper) ? upper : null;
}

function flattenTree(node, prefix = '') {
  if (!node) return [];
  if (Array.isArray(node)) return node.flatMap(child => flattenTree(child, prefix));
  const name = node.name === '.' ? '' : String(node.name || '');
  const current = name ? (prefix ? `${prefix}/${name}` : name) : prefix;
  if (Array.isArray(node.nodes)) return node.nodes.flatMap(child => flattenTree(child, current));
  return current ? [current] : [];
}

function bytesToBase64(bytes) {
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64');
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  if (typeof value !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw new Error('기록 파일의 base64 데이터가 올바르지 않습니다.');
  }
  if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(value, 'base64'));
  const binary = atob(value);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function snapshotSignature(files) {
  return files.map(file => `${file.path}:${file.base64}`).join('|');
}

export function snapshotToInitFs(snapshot) {
  if (snapshot == null) return [];
  if (snapshot.version !== 1 || snapshot.game !== 'hancom97' || !Array.isArray(snapshot.files)) {
    throw new Error('지원하지 않는 한컴타자연습 기록 스냅샷입니다.');
  }
  const seen = new Set();
  return snapshot.files.map(file => {
    const path = recordName(file?.path);
    if (!path || seen.has(path)) throw new Error('허용되지 않거나 중복된 기록 파일 경로입니다.');
    seen.add(path);
    const contents = base64ToBytes(file.base64);
    if (contents.byteLength > MAX_RECORD_BYTES) throw new Error(`${path} 기록 파일이 허용 크기를 넘었습니다.`);
    if (Number.isFinite(file.byteLength) && file.byteLength !== contents.byteLength) {
      throw new Error(`${path} 기록 파일 크기가 일치하지 않습니다.`);
    }
    return { path, contents };
  });
}

export function createRecordBridge(commandInterface, {
  intervalMs = 1000,
  onSnapshot = () => {},
  onError = error => console.warn('Hancom 97 record bridge failed', error),
} = {}) {
  if (!commandInterface?.fsTree || !commandInterface?.fsReadFile) {
    throw new Error('유효한 js-dos CommandInterface가 필요합니다.');
  }

  let timer = null;
  let pending = Promise.resolve(null);
  let lastSignature = '';

  async function readSnapshot(force = false) {
    const paths = flattenTree(await commandInterface.fsTree());
    const selected = paths
      .map(path => ({ source: path, path: recordName(path) }))
      .filter(file => file.path)
      .sort((a, b) => a.path.localeCompare(b.path));
    const files = [];
    for (const file of selected) {
      const contents = new Uint8Array(await commandInterface.fsReadFile(file.source));
      if (contents.byteLength > MAX_RECORD_BYTES) throw new Error(`${file.path} 기록 파일이 허용 크기를 넘었습니다.`);
      files.push({ path: file.path, byteLength: contents.byteLength, base64: bytesToBase64(contents) });
    }
    const signature = snapshotSignature(files);
    if (!force && signature === lastSignature) return null;
    lastSignature = signature;
    if (!files.length) return null;
    const snapshot = {
      version: 1,
      game: 'hancom97',
      capturedAt: new Date().toISOString(),
      files,
    };
    await onSnapshot(snapshot);
    return snapshot;
  }

  function capture({ force = false } = {}) {
    const run = pending.then(() => readSnapshot(force));
    pending = run.catch(error => {
      try { onError(error instanceof Error ? error : new Error(String(error))); } catch { /* 호스트 오류는 에뮬레이터를 중단하지 않는다. */ }
      return null;
    });
    return pending;
  }

  function start() {
    if (timer !== null) return;
    capture();
    timer = setInterval(() => capture(), Math.max(250, intervalMs));
  }

  function stop() {
    if (timer !== null) clearInterval(timer);
    timer = null;
  }

  return { capture, start, stop };
}

export const HANCOM97_RECORD_FILES = Object.freeze([...RECORD_FILES]);
