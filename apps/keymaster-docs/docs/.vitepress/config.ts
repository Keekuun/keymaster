import { defineConfig } from 'vitepress';
import path from 'node:path';
import { versions } from './theme/utils/versions';

const reactVersion = versions.react;
const vueVersion = versions.vue;
const coreVersion = versions.core;

// keymaster 文档站点基础配置（自动从包中读取版本号）
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@packages': path.resolve(__dirname, '../../../../packages'),
        '@packages/*': path.resolve(__dirname, '../../../../packages/*'),
        '@theme': path.resolve(__dirname, '../.vitepress/theme'),
        '@theme/*': path.resolve(__dirname, '../.vitepress/theme/*'),
        '@docs': path.resolve(__dirname, '..'),
        '@docs/*': path.resolve(__dirname, '../*'),
      },
    },
  },
  title: 'keymaster',
  description: '基于 keymaster 的 React/Vue 键盘快捷键库文档与示例',
  themeConfig: {
    logo: '/keymaster-logo.svg',
    nav: [
      { text: '指南', link: '/' },
      { text: `React 版 v${reactVersion}`, link: '/react/' },
      { text: `Vue 版 v${vueVersion}`, link: '/vue/' },
      { text: `Core 模块 v${coreVersion}`, link: '/core/' },
      { text: '版本管理', link: '/versions' },
      { text: '发布', link: '/publish' },
      { text: '部署', link: '/deploy' },
      { text: 'GitHub', link: 'https://github.com/Keekuun/keymaster' },
    ],
    sidebar: {
      '/react/': [
        {
          text: `React（当前版本 v${reactVersion}）`,
          items: [{ text: '快速开始', link: '/react/' }],
        },
      ],
      '/vue/': [
        {
          text: `Vue（当前版本 v${vueVersion}）`,
          items: [{ text: '快速开始', link: '/vue/' }],
        },
      ],
      '/core/': [
        {
          text: `Core 模块（当前版本 v${coreVersion}）`,
          items: [{ text: '核心 API', link: '/core/' }],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Keekuun/keymaster' }],
    search: {
      provider: 'local',
    },
    footer: {
      message: `当前文档同步版本：React v${reactVersion} / Vue v${vueVersion} / Core v${coreVersion}`,
    },
  },
});
