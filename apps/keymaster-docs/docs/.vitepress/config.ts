import { defineConfig } from 'vitepress';
import path from 'node:path';
import { versions } from './theme/utils/versions';

const reactVersion = versions.react;
const vueVersion = versions.vue;
const coreVersion = versions.core;

// keymaster 文档站点基础配置（自动从包中读取版本号，支持多语言）
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
  description: 'Modern keyboard shortcut library for React/Vue based on keymaster',
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'keymaster',
      description: 'Modern keyboard shortcut library for React/Vue based on keymaster',
      themeConfig: {
        logo: '/keymaster-logo.svg',
        nav: [
          { text: 'Guide', link: '/' },
          { text: `React v${reactVersion}`, link: '/react/' },
          { text: `Vue v${vueVersion}`, link: '/vue/' },
          { text: `Core v${coreVersion}`, link: '/core/' },
          { text: 'Versions', link: '/versions' },
          { text: 'Publish', link: '/publish' },
          { text: 'Deploy', link: '/deploy' },
          { text: 'GitHub', link: 'https://github.com/Keekuun/keymaster' },
        ],
        sidebar: {
          '/react/': [
            {
              text: `React (v${reactVersion})`,
              items: [{ text: 'Quick Start', link: '/react/' }],
            },
          ],
          '/vue/': [
            {
              text: `Vue (v${vueVersion})`,
              items: [{ text: 'Quick Start', link: '/vue/' }],
            },
          ],
          '/core/': [
            {
              text: `Core Module (v${coreVersion})`,
              items: [{ text: 'Core API', link: '/core/' }],
            },
          ],
        },
        footer: {
          message: `Current versions: React v${reactVersion} / Vue v${vueVersion} / Core v${coreVersion}`,
        },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: 'keymaster',
      description: '基于 keymaster 的 React/Vue 键盘快捷键库文档与示例',
      link: '/zh/',
      themeConfig: {
        logo: '/keymaster-logo.svg',
        nav: [
          { text: '指南', link: '/zh/' },
          { text: `React 版 v${reactVersion}`, link: '/zh/react/' },
          { text: `Vue 版 v${vueVersion}`, link: '/zh/vue/' },
          { text: `Core 模块 v${coreVersion}`, link: '/zh/core/' },
          { text: '版本管理', link: '/zh/versions' },
          { text: '发布', link: '/zh/publish' },
          { text: '部署', link: '/zh/deploy' },
          { text: 'GitHub', link: 'https://github.com/Keekuun/keymaster' },
        ],
        sidebar: {
          '/zh/react/': [
            {
              text: `React（当前版本 v${reactVersion}）`,
              items: [{ text: '快速开始', link: '/zh/react/' }],
            },
          ],
          '/zh/vue/': [
            {
              text: `Vue（当前版本 v${vueVersion}）`,
              items: [{ text: '快速开始', link: '/zh/vue/' }],
            },
          ],
          '/zh/core/': [
            {
              text: `Core 模块（当前版本 v${coreVersion}）`,
              items: [{ text: '核心 API', link: '/zh/core/' }],
            },
          ],
        },
        footer: {
          message: `当前文档同步版本：React v${reactVersion} / Vue v${vueVersion} / Core v${coreVersion}`,
        },
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/Keekuun/keymaster' }],
    search: {
      provider: 'local',
    },
  },
});
