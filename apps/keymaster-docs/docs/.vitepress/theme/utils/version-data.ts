// 导出版本数据供 Markdown 使用
import { versions } from './versions';

export const versionData = {
  react: versions.react,
  vue: versions.vue,
  core: versions.core,
  // 格式化版本号字符串（用于 Markdown）
  reactFormatted: `v${versions.react}`,
  vueFormatted: `v${versions.vue}`,
  coreFormatted: `v${versions.core}`,
  // 完整版本信息字符串
  allVersions: `React v${versions.react} / Vue v${versions.vue} / Core v${versions.core}`,
};
