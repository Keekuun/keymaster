// 自动从 package.json 读取版本号
import reactPkg from '@keekuun/keymaster-react/package.json' with { type: 'json' };
import vuePkg from '@keekuun/keymaster-vue/package.json' with { type: 'json' };
import corePkg from '@keekuun/keymaster-core/package.json' with { type: 'json' };

export const versions = {
  react: reactPkg.version,
  vue: vuePkg.version,
  core: corePkg.version,
} as const;

export const getVersion = (packageName: 'react' | 'vue' | 'core'): string => {
  return versions[packageName];
};
