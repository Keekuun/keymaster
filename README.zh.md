## keymaster monorepo

<div align="center">

<img src="https://img.shields.io/npm/v/@keekuun/keymaster-react?label=react&style=flat-square" alt="@keekuun/keymaster-react version" />
<img src="https://img.shields.io/npm/v/@keekuun/keymaster-vue?label=vue&style=flat-square" alt="@keekuun/keymaster-vue version" />
<img src="https://img.shields.io/npm/v/@keekuun/keymaster-core?label=core&style=flat-square" alt="@keekuun/keymaster-core version" />

<br />

<img src="https://img.shields.io/npm/l/@keekuun/keymaster-react?style=flat-square" alt="License" />
<img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript Ready" />
<img src="https://img.shields.io/badge/Docs-Vercel-success?style=flat-square&logo=vercel" alt="Docs on Vercel" />

<p><strong>一个面向 React / Vue / 核心工具的现代化键盘快捷键库 monorepo，支持作用域绑定、编辑器模式与 Electron 场景。</strong></p>

<p>
<a href="#-特性">特性</a> •
<a href="#-安装">安装</a> •
<a href="#-快速开始">快速开始</a> •
<a href="#-包与版本">包与版本</a> •
<a href="#-monorepo-开发">Monorepo 开发</a> •
<a href="#-发布流程">发布流程</a>
</p>

</div>

---

### ✨ 特性

- 🎯 **精确快捷键解析**：支持组合键、多按键映射与跨平台修饰键处理
- 🧠 **共享核心模块**：`@keekuun/keymaster-core` 统一管理解析、匹配、类型与工具函数
- 🧩 **作用域绑定（scopedElement）**：只在指定容器 / 编辑器内响应快捷键
- ✏️ **编辑器模式（editorMode）**：自动 `preventDefault`，适配编辑器类产品
- 🖥️ **Electron 模式（electronMode）**：为桌面应用预留扩展点
- ⚛️ **React Hook 封装**：`useKeyBinding` / `useScopedKeyBinding` / `useEditorKeyBinding` / `useElectronKeyBinding`
- 🧪 **Vue 组合式 API**：`useKeyBindingVue` / `useScopedKeyBindingVue` / `useEditorKeyBindingVue` / `useElectronKeyBindingVue`
- 📦 **TypeScript 优先**：完整的声明文件，由 `vite-plugin-dts` 自动生成
- 📚 **完善文档站点**：基于 VitePress 的交互式文档，支持多版本管理与在线 Demo

---

### 📦 安装

**React 版本：**

```bash
npm install @keekuun/keymaster-react
# 或
pnpm add @keekuun/keymaster-react
# 或
yarn add @keekuun/keymaster-react
```

**Vue 版本：**

```bash
npm install @keekuun/keymaster-vue
# 或
pnpm add @keekuun/keymaster-vue
# 或
yarn add @keekuun/keymaster-vue
```

**核心模块（通常作为依赖自动安装，也可单独使用）：**

```bash
npm install @keekuun/keymaster-core
```

---

### 🚀 快速开始

#### React 基础用法

```tsx
import { useKeyBinding } from '@keekuun/keymaster-react';

function App() {
  useKeyBinding('ctrl+s', (event) => {
    event.preventDefault();
    console.log('保存操作');
  });

  return <div>按 Ctrl + S 触发保存</div>;
}
```

**作用域绑定示例：**

```tsx
import { useRef } from 'react';
import { useScopedKeyBinding } from '@keekuun/keymaster-react';

function Editor() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useScopedKeyBinding(
    'ctrl+k',
    () => {
      console.log('只在容器内触发的快捷键');
    },
    containerRef,
  );

  return <div ref={containerRef}>这里的 Ctrl + K 才会生效</div>;
}
```

#### Vue 基础用法

```vue
<script setup lang="ts">
import { useKeyBindingVue } from '@keekuun/keymaster-vue';

useKeyBindingVue('ctrl+s', (event) => {
  event.preventDefault();
  console.log('保存操作');
});
</script>

<template>
  <div>按 Ctrl + S 触发保存</div>
</template>
```

**编辑器模式示例：**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useEditorKeyBindingVue } from '@keekuun/keymaster-vue';

const editorRef = ref<HTMLTextAreaElement | null>(null);

useEditorKeyBindingVue(
  'ctrl+s',
  () => {
    console.log('编辑器内保存，不触发浏览器默认行为');
  },
  editorRef.value || undefined,
);
</script>

<template>
  <textarea ref="editorRef" rows="6" cols="40" />
</template>
```

更多示例（包括 Electron 模式与高级用法）可在文档站点中查看。

---

### 📦 包与版本

当前 monorepo 包含以下子包：

- `@keekuun/keymaster-core`：核心解析 / 匹配 / 类型定义模块
- `@keekuun/keymaster-react`：React Hook 封装
- `@keekuun/keymaster-vue`：Vue 组合式 API 封装
- `keymaster-docs`：基于 VitePress 的文档与示例站点

#### 当前已发布版本

- `@keekuun/keymaster-core`: **v0.2.0** - [npm](https://www.npmjs.com/package/@keekuun/keymaster-core)
- `@keekuun/keymaster-react`: **v0.2.0** - [npm](https://www.npmjs.com/package/@keekuun/keymaster-react)
- `@keekuun/keymaster-vue`: **v0.2.0** - [npm](https://www.npmjs.com/package/@keekuun/keymaster-vue)

#### 文档站点

- 在线文档：[https://keymaster-docs.vercel.app/](https://keymaster-docs.vercel.app/)
  - React 文档：`/react/`
  - Vue 文档：`/vue/`
  - Core 文档：`/core/`
  - 版本管理说明：`/versions/`

#### 包依赖关系

```text
@keekuun/keymaster-core (核心模块)
    ├── @keekuun/keymaster-react (依赖 core)
    └── @keekuun/keymaster-vue (依赖 core)
```

**重要说明：**

- `keymaster-core` 是 `keymaster-react` 和 `keymaster-vue` 的运行时依赖
- 安装 `@keekuun/keymaster-react` 或 `@keekuun/keymaster-vue` 时，`@keekuun/keymaster-core` 会自动安装
- 只有在单独使用核心工具函数时，才需要单独安装 `@keekuun/keymaster-core`

---

### 🧱 Monorepo 开发

本仓库使用 **pnpm workspace** 管理多包结构，根目录脚本：

- `pnpm build`：递归构建所有包（core / react / vue / docs）
- `pnpm lint`：对所有包及根目录运行 ESLint 检查
- `pnpm lint:fix`：对所有包及根目录运行 ESLint 自动修复
- `pnpm format`：使用 Prettier 检查格式
- `pnpm format:write`：使用 Prettier 自动格式化
- `pnpm docs:dev`：在 `apps/keymaster-docs` 中启动文档开发服务器
- `pnpm docs:build`：构建所有库 + 文档站点
- `pnpm docs:preview`：预览构建后的文档站点

提交前会通过 Husky 自动执行：

- ESLint 自动修复（所有包）
- Prettier 自动格式化

---

### 🚢 发布流程（概览）

详细步骤见 `PUBLISH.md`，这里给出简要概览：

1. 确认代码已经通过 `pnpm lint`、`pnpm test`（如果有）、`pnpm docs:build`
2. 使用 `standard-version` 管理版本与 `CHANGELOG.md`：
   - `pnpm release`：补丁版本
   - `pnpm release:minor`：次版本
   - `pnpm release:major`：主版本
3. 使用发布脚本发布到 npm：
   - `pnpm publish:core`
   - `pnpm publish:react`
   - `pnpm publish:vue`
   - 或 `pnpm publish:all` 一键发布三个包
4. 推送代码与 tag，Vercel 会自动触发文档站点更新

---

### 📮 反馈与支持

- 仓库地址：[https://github.com/Keekuun/keymaster](https://github.com/Keekuun/keymaster)
- 问题反馈 / 新特性建议：在 GitHub Issues 中创建条目
- 使用问题与 API 细节：优先参考文档站点 [https://keymaster-docs.vercel.app/](https://keymaster-docs.vercel.app/)

---

### 🌐 语言

- [English](README.md)
- [中文](README.zh.md) (当前)
