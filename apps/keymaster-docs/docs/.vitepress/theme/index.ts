import DefaultTheme from 'vitepress/theme';
import VueShortcutDemo from './components/VueShortcutDemo.vue';
import ReactShortcutDemo from './components/ReactShortcutDemo.vue';
import VersionSelector from './components/VersionSelector.vue';
import VersionBanner from './components/VersionBanner.vue';
import VersionText from './components/VersionText.vue';
import AllVersions from './components/AllVersions.vue';
import VersionList from './components/VersionList.vue';
import '@theme/custom.css';

// 扩展默认主题：注册自定义 Demo 组件与全局样式
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('VueShortcutDemo', VueShortcutDemo);
    app.component('ReactShortcutDemo', ReactShortcutDemo);
    app.component('VersionSelector', VersionSelector);
    app.component('VersionBanner', VersionBanner);
    app.component('VersionText', VersionText);
    app.component('AllVersions', AllVersions);
    app.component('VersionList', VersionList);
  },
};
