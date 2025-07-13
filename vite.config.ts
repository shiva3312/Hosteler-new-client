//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  // Load default .env file
  config({ path: resolve(__dirname, `.env`) });

  // Load mode-specific .env file
  const envFilePath = resolve(__dirname, `.env.${mode}.local`);
  config({ path: envFilePath });

  // Extract environment variables
  const {
    VITE_APP_PORT,
    VITE_APP_ALLOWED_HOSTS,
    VITE_APP_ENVIRONMENT,
    VITE_APP_API_URL,
    VITE_APP_DEPLOYED,
  } = process.env;

  // Log the current environment to the system console
  console.log('========================================');
  console.log(`Running in ${VITE_APP_ENVIRONMENT} environment`);
  console.log(`API URL: ${VITE_APP_API_URL}`);
  console.log(`Local: ${!VITE_APP_DEPLOYED}`);
  console.log('========================================');

  const isProd = mode === 'prod' && VITE_APP_ENVIRONMENT === 'prod';

  return {
    base: `./dist/${VITE_APP_ENVIRONMENT}/`,
    plugins: [react(), viteTsconfigPaths()],
    server: {
      port: VITE_APP_PORT ? parseInt(VITE_APP_PORT, 10) : 3000,
      allowedHosts: VITE_APP_ALLOWED_HOSTS
        ? VITE_APP_ALLOWED_HOSTS.split(',').map((host) => host.trim())
        : [],
    },
    preview: {
      port: VITE_APP_PORT ? parseInt(VITE_APP_PORT, 10) : 3000,
      allowedHosts: VITE_APP_ALLOWED_HOSTS
        ? VITE_APP_ALLOWED_HOSTS.split(',').map((host) => host.trim())
        : [],
    },
    optimizeDeps: { exclude: ['fsevents'] },
    build: {
      outDir: `dist/${VITE_APP_ENVIRONMENT}`,
      sourcemap: isProd ? false : true,
      minify: isProd ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: true,
        },
        mangle: true,
      },
      rollupOptions: {
        output: {
          entryFileNames: `[name].${VITE_APP_ENVIRONMENT}.js`,
          chunkFileNames: `[name].${VITE_APP_ENVIRONMENT}.js`,
          assetFileNames: `[name].${VITE_APP_ENVIRONMENT}.[ext]`,
        },
      },
    },
  };
});
