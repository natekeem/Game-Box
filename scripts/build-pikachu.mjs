import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '..', 'pikachu-volleyball-src');
const outDir = path.resolve(__dirname, '..', 'pikachu-volleyball');

console.log('[피카츄 배구] 웹팩 프로덕션 빌드 시작...');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npmCmd, ['run', 'build'], {
  cwd: srcDir,
  stdio: 'inherit',
  shell: true,
});

if (result.status !== 0) {
  console.error('[피카츄 배구] 빌드 실패!');
  process.exit(result.status || 1);
}

const checkFiles = [
  path.join(outDir, 'ko', 'index.html'),
  path.join(outDir, 'index.html'),
  path.join(outDir, 'resources', 'assets', 'images', 'sprite_sheet.json'),
  path.join(outDir, 'resources', 'assets', 'sounds', 'bgm.mp3'),
];

for (const file of checkFiles) {
  if (!fs.existsSync(file)) {
    console.error(`[피카츄 배구] 필수 생성 파일 누락: ${file}`);
    process.exit(1);
  }
}

console.log('[피카츄 배구] 빌드 완료 및 검증 성공! 배포 위치:', outDir);
