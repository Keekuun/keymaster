import DefaultTheme from "vitepress/theme";
import VueShortcutDemo from "./components/VueShortcutDemo.vue";
import ReactShortcutDemo from "./components/ReactShortcutDemo.vue";
import "./custom.css";

// 扩展默认主题：注册自定义 Demo 组件与全局样式
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("VueShortcutDemo", VueShortcutDemo);
    app.component("ReactShortcutDemo", ReactShortcutDemo);
  }
};
