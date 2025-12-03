import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import dts from 'vite-plugin-dts';

// Vue 版 keymaster 库的 Vite 配置，使用 lib 模式输出 ES 与 CJS 两种格式。
export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: 'dist',
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.vue', 'src/**/*.spec.ts', 'src/**/*.spec.vue'],
    }),
  ],
  resolve: {
    alias: {
      '@vue': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'KeymasterVue',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', '@keekuun/keymaster-core'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
