import { defineConfig } from "vitepress";
import reactPkg from "../../../../packages/keymaster-react/package.json";
import vuePkg from "../../../../packages/keymaster-vue/package.json";

const reactVersion = (reactPkg as any).version as string;
const vueVersion = (vuePkg as any).version as string;

// keymaster 文档站点基础配置（自动从包中读取版本号）
export default defineConfig({
  title: "keymaster",
  description: "基于 keymaster 的 React/Vue 键盘快捷键库文档与示例",
  themeConfig: {
    logo: "/keymaster-logo.svg",
    nav: [
      { text: "指南", link: "/" },
      { text: `React 版 v${reactVersion}`, link: "/react/" },
      { text: `Vue 版 v${vueVersion}`, link: "/vue/" },
      { text: "部署", link: "/deploy" },
      { text: "GitHub", link: "https://github.com/Keekuun/keymaster" }
    ],
    sidebar: {
      "/react/": [
        {
          text: `React（当前版本 v${reactVersion}）`,
          items: [{ text: "快速开始", link: "/react/" }]
        }
      ],
      "/vue/": [
        {
          text: `Vue（当前版本 v${vueVersion}）`,
          items: [{ text: "快速开始", link: "/vue/" }]
        }
      ]
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/Keekuun/keymaster" }
    ],
    search: {
      provider: "local"
    },
    footer: {
      message: `当前文档同步版本：React v${reactVersion} / Vue v${vueVersion}`
    }
  }
});

