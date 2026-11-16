// Regression test for the HTML-escaping helper used by the client when it
// interpolates untrusted text (e.g. an opponent's player name) into innerHTML.
// It loads the browser build (public/js/), exactly as a browser would.
const path = require("path");

let passed = 0;
let failed = 0;

function assert(label, cond, extra) {
  if (cond) {
    passed++;
    console.log(`  OK   ${label}`);
  } else {
    failed++;
    console.log(`  FAIL ${label}${extra ? " -- " + JSON.stringify(extra) : ""}`);
  }
}

async function main() {
  const modUrl = "file://" + path.join(__dirname, "..", "public", "js", "client", "escapeHtml.js");
  const { escapeHtml } = await import(modUrl);

  console.log("\nTest: escapeHtml neutralizes HTML special characters");
  assert("plain text is left unchanged", escapeHtml("Alice") === "Alice");
  assert("empty string stays empty", escapeHtml("") === "");
  assert("< and > are escaped", escapeHtml("<i>hi</i>") === "&lt;i&gt;hi&lt;/i&gt;");
  assert("& is escaped", escapeHtml("Tom & Jerry") === "Tom &amp; Jerry");
  assert('double quotes are escaped', escapeHtml('a"b') === "a&quot;b");
  assert("single quotes are escaped", escapeHtml("a'b") === "a&#39;b");

  const attack = `<img src=x onerror="alert('xss')">`;
  const escaped = escapeHtml(attack);
  assert("a script-injection payload contains no raw angle brackets or quotes", !/[<>"']/.test(escaped), escaped);
  assert("already-escaped input is escaped again (no double-decoding trick)", escapeHtml("&lt;") === "&amp;lt;");

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
