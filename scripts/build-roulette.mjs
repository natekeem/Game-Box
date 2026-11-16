import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '..', 'roulette-src');
const outDir = path.resolve(__dirname, '..', 'roulette');

console.log('[마블 룰렛] Parcel 프로덕션 번들 빌드 시작...');
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(
  npxCmd,
  ['parcel', 'build', 'index.html', '--dist-dir', outDir, '--public-url', '/roulette/', '--no-cache'],
  {
    cwd: srcDir,
    stdio: 'inherit',
    shell: true,
  }
);

if (result.status !== 0) {
  console.error('[마블 룰렛] 번들 빌드 실패!');
  process.exit(result.status || 1);
}

// service-worker.js 생성
const killSwitch = `self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k.includes('/roulette/')).map(k => caches.delete(k)));
      const clients = await self.clients.matchAll({ type: 'window' });
      await self.registration.unregister();
      for (const client of clients) {
        client.navigate(client.url).catch(() => {});
      }
    })()
  );
});
`;
fs.writeFileSync(path.join(outDir, 'service-worker.js'), killSwitch, 'utf8');

const checkFiles = [
  path.join(outDir, 'index.html'),
  path.join(outDir, 'service-worker.js'),
];

for (const file of checkFiles) {
  if (!fs.existsSync(file)) {
    console.error(`[마블 룰렛] 필수 생성 파일 누락: ${file}`);
    process.exit(1);
  }
}

// wasm 파일 검색 확인
const outFiles = fs.readdirSync(outDir);
const hasWasm = outFiles.some((f) => f.endsWith('.wasm'));
if (!hasWasm) {
  console.error('[마블 룰렛] Box2D WASM 파일이 누락되었습니다!');
  process.exit(1);
}

console.log('[마블 룰렛] 빌드 완료 및 검증 성공! 배포 위치:', outDir);
