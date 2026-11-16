import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const requireFromRoulette = createRequire(path.join(rootDir, 'roulette-src', 'package.json'));
const esbuild = requireFromRoulette('esbuild');

const srcEntry = path.join(rootDir, 'tool-box', 'src', 'features', 'game-box', 'standalone-entry.jsx');
const outDir = path.join(rootDir, 'game-box');

fs.mkdirSync(outDir, { recursive: true });

console.log('[GAME-BOX] 통합 엔트리 번들 빌드 시작 (/game-box)...');

await esbuild.build({
  entryPoints: [srcEntry],
  bundle: true,
  outfile: path.join(outDir, 'bundle.js'),
  format: 'iife',
  globalName: 'ToolBoxGameBox',
  platform: 'browser',
  target: ['es2020'],
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
  },
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
  <title>TOOL BOX — GAME-BOX</title>
  <link rel="stylesheet" href="/game-box/bundle.css" />
</head>
<body style="margin:0;padding:0;background:#0d1117;">
  <div id="game-box-root"></div>
  <script src="/game-box/bundle.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'index.html'), htmlContent, 'utf8');
console.log('[GAME-BOX] 통합 번들 빌드 완료! 배포 위치:', outDir);
