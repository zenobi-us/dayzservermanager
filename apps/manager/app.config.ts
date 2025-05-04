import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from '@tanstack/react-start/config';
import tsConfigPaths from 'vite-tsconfig-paths';

import type { App } from 'vinxi';

const config: Promise<App> = defineConfig({
  vite: {
    build: {
      sourcemap: true,
    },
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      {
        name: 'report-hmr-ports',
        configureServer: ({ config }) => {
          const hmr = config.server.hmr;
          if (typeof hmr === 'object' && 'port' in hmr) {
            console.log(
              `\x1b[34mHMR\x1b[0m is listening to \x1b[32mhttp://localhost:${hmr.port}\x1b[0m`,
            );
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
  },
});

export default config;
