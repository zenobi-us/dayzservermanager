import { defineConfig } from "vite";
import { vavite } from "vavite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

const uipath = fileURLToPath(new URL("./ui", import.meta.url));
const serverpath = fileURLToPath(new URL("./server", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "&ui": uipath,
      "&server": serverpath,
    },
  },
  buildSteps: [
    {
      name: "ui",

      config: {
        appType: "spa",
        build: {
          emptyOutDir: true,
          outDir: "dist/ui",
          manifest: true,
          copyPublicDir: true,
          rollupOptions: {
            input: "ui/index.html",
          },
        },
        plugins: [
          {
            name: "deep-index",
            configureServer(server) {
              server.middlewares.use((req, res, next) => {
                if (req.url === "/") {
                  req.url = "/ui/index.html";
                }
                next();
              });
            },
          },
        ],
      },
    },
    {
      name: "server",
      config: {
        appType: "custom",
        build: {
          emptyOutDir: true,
          ssr: true,
          outDir: "dist/server",
          rollupOptions: {
            input: "server/main.ts",
          },
        },
      },
    },
  ],

  plugins: [
    vue(),
    vavite({
      handlerEntry: "./server/main.ts",
      serveClientAssetsInDev: true,
      // Don't reload when dynamically imported dependencies change
      reloadOn: "static-deps-change",
    }),
  ],
});
