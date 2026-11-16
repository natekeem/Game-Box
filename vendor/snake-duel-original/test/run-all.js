const { spawn, spawnSync } = require("child_process");
const path = require("path");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const PORT = 3001;

function waitForServer(url, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function attempt() {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error("server did not respond within the allotted time"));
        } else {
          setTimeout(attempt, 150);
        }
      });
    }
    attempt();
  });
}

async function main() {
  console.log("=== Game engine unit test (server build) ===");
  const unitResult = spawnSync("node", ["test/engine.test.js"], {
    cwd: ROOT,
    stdio: "inherit",
  });

  console.log("\n=== Game engine test (client build, local mode) ===");
  const clientEngineResult = spawnSync("node", ["test/client-engine.test.js"], {
    cwd: ROOT,
    stdio: "inherit",
  });

  console.log("\n=== HTML escaping test (client build) ===");
  const escapeHtmlResult = spawnSync("node", ["test/escape-html.test.js"], {
    cwd: ROOT,
    stdio: "inherit",
  });

  console.log("\n=== Starting server (subprocess) on port " + PORT + " ===");
  const server = spawn("node", ["dist/server/index.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let serverOutput = "";
  server.stdout.on("data", (d) => (serverOutput += d.toString()));
  server.stderr.on("data", (d) => (serverOutput += d.toString()));

  let integrationCode = 1;
  try {
    await waitForServer(`http://localhost:${PORT}/`, 5000);
    console.log("Server ready.\n=== WebSocket integration test ===");

    const integration = spawnSync("node", ["test/integration.test.js"], {
      cwd: ROOT,
      env: { ...process.env, TEST_PORT: String(PORT) },
      stdio: "inherit",
      timeout: 20000,
    });
    integrationCode = integration.status ?? 1;
  } catch (err) {
    console.error("ERROR: " + err.message);
    console.error("Server log:\n" + serverOutput);
  } finally {
    server.kill("SIGTERM");
  }

  const unitCode = unitResult.status ?? 1;
  const clientEngineCode = clientEngineResult.status ?? 1;
  const escapeHtmlCode = escapeHtmlResult.status ?? 1;
  console.log(
    `\n=== Summary === unit(server): ${unitCode === 0 ? "OK" : "FAIL"}, unit(client): ${clientEngineCode === 0 ? "OK" : "FAIL"}, escapeHtml: ${escapeHtmlCode === 0 ? "OK" : "FAIL"}, integration: ${integrationCode === 0 ? "OK" : "FAIL"}`
  );
  process.exit(unitCode === 0 && clientEngineCode === 0 && escapeHtmlCode === 0 && integrationCode === 0 ? 0 : 1);
}

main();
