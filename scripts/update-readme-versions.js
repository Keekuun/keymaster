#!/usr/bin/env node
/**
 * 自动更新 README.md 中的版本号
 * 从 package.json 读取版本号并替换 README.md 中的硬编码版本号
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// 读取各包的版本号
const corePkg = JSON.parse(
  readFileSync(resolve(rootDir, 'packages/keymaster-core/package.json'), 'utf-8'),
);
const reactPkg = JSON.parse(
  readFileSync(resolve(rootDir, 'packages/keymaster-react/package.json'), 'utf-8'),
);
const vuePkg = JSON.parse(
  readFileSync(resolve(rootDir, 'packages/keymaster-vue/package.json'), 'utf-8'),
);

const coreVersion = corePkg.version;
const reactVersion = reactPkg.version;
const vueVersion = vuePkg.version;

// 读取 README.md
const readmePath = resolve(rootDir, 'README.md');
let readmeContent = readFileSync(readmePath, 'utf-8');

// 替换版本号（匹配格式：**v0.2.0** 或 v0.2.0）
readmeContent = readmeContent.replace(
  /`@keekuun\/keymaster-core`:\s*\*\*v\d+\.\d+\.\d+\*\*/g,
  `\`@keekuun/keymaster-core\`: **v${coreVersion}**`,
);
readmeContent = readmeContent.replace(
  /`@keekuun\/keymaster-react`:\s*\*\*v\d+\.\d+\.\d+\*\*/g,
  `\`@keekuun/keymaster-react\`: **v${reactVersion}**`,
);
readmeContent = readmeContent.replace(
  /`@keekuun\/keymaster-vue`:\s*\*\*v\d+\.\d+\.\d+\*\*/g,
  `\`@keekuun/keymaster-vue\`: **v${vueVersion}**`,
);

// 写回文件
writeFileSync(readmePath, readmeContent, 'utf-8');

// eslint-disable-next-line no-console
console.log('✅ README.md 版本号已更新:');
// eslint-disable-next-line no-console
console.log(`   Core: v${coreVersion}`);
// eslint-disable-next-line no-console
console.log(`   React: v${reactVersion}`);
// eslint-disable-next-line no-console
console.log(`   Vue: v${vueVersion}`);
