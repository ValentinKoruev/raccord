import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup',
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@queries': path.resolve(__dirname, './src/queries'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@config': path.resolve(__dirname, './src/config.ts'),
      '@socket': path.resolve(__dirname, './src/socket.ts'),
      '@tests': path.resolve(__dirname, './src/tests'),
    },
  },
});
