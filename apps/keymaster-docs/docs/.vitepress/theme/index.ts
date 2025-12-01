import DefaultTheme from "vitepress/theme";
import VueShortcutDemo from "./components/VueShortcutDemo.vue";
import ReactShortcutDemo from "./components/ReactShortcutDemo.vue";

// 扩展默认主题：注册自定义 Demo 组件
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("VueShortcutDemo", VueShortcutDemo);
    app.component("ReactShortcutDemo", ReactShortcutDemo);
  }
};
