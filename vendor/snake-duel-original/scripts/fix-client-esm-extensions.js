// tsc (moduleResolution: "Bundler") lets the sources use plain, extensionless
// relative imports (as in Node), but it does not append the ".js" extension
// when emitting. A browser loading ES modules without a bundler, however,
// requires the full, literal path including the extension.
// This script, run after `tsc -p tsconfig.client.json`, appends ".js" to all
// relative import/export specifiers in public/js/.
const fs = require("fs");
const path = require("path");

const CLIENT_OUT_DIR = path.join(__dirname, "..", "public", "js");

const RELATIVE_SPECIFIER_RE = /((?:import|export)[^;]*?from\s+["'])(\.[^"']+)(["'])/g;

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const fixed = original.replace(RELATIVE_SPECIFIER_RE, (match, prefix, spec, quote) => {
    if (spec.endsWith(".js")) return match;
    return `${prefix}${spec}.js${quote}`;
  });
  if (fixed !== original) {
    fs.writeFileSync(filePath, fixed, "utf8");
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      fixFile(full);
    }
  }
}

if (!fs.existsSync(CLIENT_OUT_DIR)) {
  console.error(`Directory ${CLIENT_OUT_DIR} not found — run tsc first.`);
  process.exit(1);
}
walk(CLIENT_OUT_DIR);
console.log("Fixed ESM import extensions in public/js/.");
