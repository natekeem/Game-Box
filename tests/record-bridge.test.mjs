import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRecordBridge,
  HANCOM97_RECORD_FILES,
  snapshotToInitFs,
} from '../tool-box/src/features/game-box/hancom97RecordBridge.js';

function fakeCommandInterface(files = {}) {
  return {
    async fsTree() {
      return {
        name: '.',
        nodes: Object.keys(files).map(name => ({ name })),
      };
    },
    async fsReadFile(path) {
      if (!(path in files)) throw new Error(`missing ${path}`);
      return files[path];
    },
  };
}

test('원본 기록 파일 두 종류만 스냅샷으로 내보낸다', async () => {
  const files = {
    'HTP.SCO': Uint8Array.from([1, 2, 3]),
    'HTT.STA': Uint8Array.from([4, 5]),
    'OTHER.DAT': Uint8Array.from([9]),
  };
  const snapshots = [];
  const bridge = createRecordBridge(fakeCommandInterface(files), { onSnapshot: snapshot => snapshots.push(snapshot) });
  const snapshot = await bridge.capture();

  assert.deepEqual(HANCOM97_RECORD_FILES, ['HTP.SCO', 'HTT.STA']);
  assert.equal(snapshot.game, 'hancom97');
  assert.deepEqual(snapshot.files.map(file => file.path), ['HTP.SCO', 'HTT.STA']);
  assert.equal(snapshot.files[0].base64, 'AQID');
  assert.equal(snapshots.length, 1);
});

test('바뀌지 않은 기록은 중복 전송하지 않고 변경 후에만 다시 전송한다', async () => {
  const files = { 'HTP.SCO': Uint8Array.from([1]) };
  let calls = 0;
  const bridge = createRecordBridge(fakeCommandInterface(files), { onSnapshot: () => { calls++; } });

  assert.ok(await bridge.capture());
  assert.equal(await bridge.capture(), null);
  files['HTP.SCO'] = Uint8Array.from([2]);
  assert.ok(await bridge.capture());
  assert.equal(calls, 2);
});

test('스냅샷을 다음 DOS 세션의 initFs로 안전하게 복원한다', () => {
  const restored = snapshotToInitFs({
    version: 1,
    game: 'hancom97',
    files: [{ path: 'htt.sta', byteLength: 3, base64: 'CQgH' }],
  });
  assert.equal(restored[0].path, 'HTT.STA');
  assert.deepEqual([...restored[0].contents], [9, 8, 7]);
  assert.deepEqual(snapshotToInitFs(null), []);
});

test('경로 탈출, 임의 파일, 크기 불일치 스냅샷은 거부한다', () => {
  const base = { version: 1, game: 'hancom97' };
  assert.throws(() => snapshotToInitFs({ ...base, files: [{ path: '../HTT.STA', base64: '' }] }), /허용되지/);
  assert.throws(() => snapshotToInitFs({ ...base, files: [{ path: 'AUTOEXEC.BAT', base64: '' }] }), /허용되지/);
  assert.throws(() => snapshotToInitFs({ ...base, files: [{ path: 'HTP.SCO', byteLength: 2, base64: 'AQ==' }] }), /크기/);
});

test('파일시스템 오류는 호스트 콜백에 전달하고 에뮬레이터 흐름을 유지한다', async () => {
  const errors = [];
  const bridge = createRecordBridge({
    async fsTree() { throw new Error('filesystem unavailable'); },
    async fsReadFile() { return new Uint8Array(); },
  }, { onError: error => errors.push(error) });

  assert.equal(await bridge.capture(), null);
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /filesystem unavailable/);
});
