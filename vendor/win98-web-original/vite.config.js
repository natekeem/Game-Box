import { defineConfig } from "vite";
import { readFileSync } from "fs";
import { resolve } from "path";

const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf-8"),
);
const appVersion = packageJson.version;

export default defineConfig({
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(appVersion),
  },
  assetsInclude: ["**/*.ani"],
  base: "/win98-web/",
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
  build: {
    outDir: resolve(__dirname, "../../win98-web"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        404: resolve(__dirname, "404.html"),
        about: resolve(__dirname, "about.html"),
      },
      output: {
        manualChunks: {
          xterm: ["@xterm/xterm", "@xterm/addon-fit", "@xterm/addon-image"],
          zenfs: ["@zenfs/core", "@zenfs/dom", "@zenfs/archives", "@zenfs/emscripten"],
        },
      },
    },
  },
  plugins: [],
});
