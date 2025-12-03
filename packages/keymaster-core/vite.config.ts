import { defineConfig } from 'vitest/config';
import path from 'node:path';
import dts from 'vite-plugin-dts';

// keymaster-core 的 Vite 配置，使用 lib 模式输出 ES 与 CJS 两种格式。
export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'KeymasterCore',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
  },
  test: {
    environment: 'jsdom',
  },
});
