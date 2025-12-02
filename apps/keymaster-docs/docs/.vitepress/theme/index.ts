import DefaultTheme from 'vitepress/theme';
import VueShortcutDemo from './components/VueShortcutDemo.vue';
import ReactShortcutDemo from './components/ReactShortcutDemo.vue';
import VersionSelector from './components/VersionSelector.vue';
import VersionBanner from './components/VersionBanner.vue';
import VersionText from './components/VersionText.vue';
import AllVersions from './components/AllVersions.vue';
import VersionList from './components/VersionList.vue';
import '@theme/custom.css';

// 扩展默认主题：注册自定义 Demo 组件与全局样式，并根据浏览器语言做一次性语言重定向
export default {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('VueShortcutDemo', VueShortcutDemo);
    app.component('ReactShortcutDemo', ReactShortcutDemo);
    app.component('VersionSelector', VersionSelector);
    app.component('VersionBanner', VersionBanner);
    app.component('VersionText', VersionText);
    app.component('AllVersions', AllVersions);
    app.component('VersionList', VersionList);

    if (typeof window !== 'undefined') {
      router.onBeforeRouteChange = (to) => {
        // 访问根路径时，根据浏览器语言做一次性重定向（默认 en，中文跳转到 /zh/）
        if (to === '/' || to === '/index.html') {
          const lang = window.navigator.language || window.navigator.languages?.[0] || 'en';
          const isZh = lang.toLowerCase().startsWith('zh');

          if (isZh) {
            router.go('/zh/');
            return;
          }
        }

        // 兼容旧链接：如果访问了 /en 或 /en/...，统一重定向到去掉 /en 前缀的路径
        if (to === '/en' || to === '/en/') {
          router.go('/');
          return;
        }

        if (to.startsWith('/en/')) {
          const withoutPrefix = to.replace(/^\/en/, '') || '/';
          router.go(withoutPrefix);
        }
      };
    }
  },
};
