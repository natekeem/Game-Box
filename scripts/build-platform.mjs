import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const requireFromRoulette = createRequire(path.join(rootDir, 'roulette-src', 'package.json'));
const esbuild = requireFromRoulette('esbuild');

const srcEntry = path.join(rootDir, 'platform-src', 'main.jsx');
const outDir = path.join(rootDir, 'platform');

fs.mkdirSync(outDir, { recursive: true });

console.log('[사내 미니게임 플랫폼] React 번들 빌드 시작...');

await esbuild.build({
  entryPoints: [srcEntry],
  bundle: true,
  outfile: path.join(outDir, 'bundle.js'),
  format: 'iife',
  globalName: 'GameBoxPlatform',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  minify: false,
  sourcemap: false,
  nodePaths: [path.join(rootDir, 'node_modules')],
  alias: {
    'react': path.join(rootDir, 'node_modules', 'preact', 'compat'),
    'react-dom': path.join(rootDir, 'node_modules', 'preact', 'compat'),
    'react-dom/client': path.join(rootDir, 'node_modules', 'preact', 'compat', 'client.mjs'),
    'react/jsx-runtime': path.join(rootDir, 'node_modules', 'preact', 'compat', 'jsx-runtime.mjs'),
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

const htmlContent = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GAME-BOX 사내 미니게임 플랫폼</title>
  <link rel="stylesheet" href="/platform/bundle.css" />
</head>
<body style="margin:0;padding:0;background:#0f172a;">
  <div id="gamebox-platform-root"></div>
  <script src="/platform/bundle.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'index.html'), htmlContent, 'utf8');

console.log('[사내 미니게임 플랫폼] 번들 빌드 완료! 배포 위치:', outDir);
