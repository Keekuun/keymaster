import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// React 版 keymaster 库的 Vite 配置，使用 lib 模式输出 ES 与 CJS 两种格式。
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "KeymasterReact",
      fileName: "index",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});


