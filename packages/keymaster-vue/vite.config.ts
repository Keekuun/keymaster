import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Vue 版 keymaster 库的 Vite 配置，使用 lib 模式输出 ES 与 CJS 两种格式。
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "KeymasterVue",
      fileName: "index",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});


