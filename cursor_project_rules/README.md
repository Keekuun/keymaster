# keymaster 项目开发规则与指南

> 本文档用于指导 keymaster monorepo 项目的后续迭代、代码优化和功能新增工作。

## 📋 项目概览

**keymaster** 是一个现代化的键盘快捷键库 monorepo，包含以下核心包：

- **@keekuun/keymaster-core**: 核心模块，提供类型定义、解析器、工具函数（框架无关）
- **@keekuun/keymaster-react**: React Hook 封装（`useKeyBinding`, `useScopedKeyBinding`, `useEditorKeyBinding`, `useElectronKeyBinding`）
- **@keekuun/keymaster-vue**: Vue Composition API 封装（`useKeyBindingVue`, `useScopedKeyBindingVue`, `useEditorKeyBindingVue`, `useElectronKeyBindingVue`）
- **keymaster-docs**: 基于 VitePress 的文档站点（支持中英文，包含交互式 Demo）

**当前版本**: v0.4.1（所有包版本同步）

**文档站点**: https://keymaster-docs.vercel.app/

---

## 🏗️ 项目架构

### Monorepo 结构

```
keymaster/
├── packages/
│   ├── keymaster-core/      # 核心模块（框架无关）
│   ├── keymaster-react/     # React 封装
│   └── keymaster-vue/       # Vue 封装
├── apps/
│   └── keymaster-docs/       # 文档站点
├── scripts/                  # 工具脚本
└── cursor_project_rules/     # 项目规则（本目录）
```

### 依赖关系

```
@keekuun/keymaster-core (独立包)
    ├── @keekuun/keymaster-react (依赖 core)
    └── @keekuun/keymaster-vue (依赖 core)
```

**重要原则**：

- `keymaster-core` 必须保持框架无关，不能依赖 React 或 Vue
- `keymaster-react` 和 `keymaster-vue` 必须通过 `@keekuun/keymaster-core` 共享核心逻辑
- 三个包的版本号必须保持同步

---

## 🎯 开发原则

### 1. 代码质量

- **TypeScript 优先**：所有代码必须使用 TypeScript，避免使用 `any` 类型
- **类型安全**：确保类型定义完整，导出类型供用户使用
- **代码复用**：核心逻辑放在 `keymaster-core`，React/Vue 包只做框架适配
- **向后兼容**：新增功能时优先考虑向后兼容，破坏性变更需要版本升级

### 2. 测试要求

- **单元测试**：所有新功能必须包含 Vitest 测试用例
- **测试覆盖**：核心逻辑（parser, electron, types）必须有完整测试
- **测试位置**：测试文件放在 `src/` 目录下，命名为 `*.test.ts`
- **运行测试**：使用 `pnpm test` 运行所有包的测试

### 3. 文档要求

- **API 文档**：所有公开 API 必须有清晰的 JSDoc 注释
- **使用示例**：每个功能特性必须提供代码示例
- **交互式 Demo**：重要功能特性需要在文档站点提供可交互的 Demo
- **双语支持**：所有文档必须同时提供英文和中文版本
  - 英文文档：`apps/keymaster-docs/docs/`
  - 中文文档：`apps/keymaster-docs/docs/zh/`
  - **README 文件双语**：所有 README 文件必须同时提供英文和中文版本
    - 根目录：`README.md`（英文）、`README.zh.md`（中文）
    - 各子包：`packages/*/README.md`（英文）、`packages/*/README.zh.md`（中文）
    - 内容必须同步更新，保持一致性
  - **Demo 组件多语言**：所有 Demo 组件必须支持中英文自动切换
    - Vue 组件：使用 `useRoute()` 检测当前路径（`route.path.startsWith('/zh/')`）
    - React 组件：通过 `isZh` prop 接收语言信息（由 `ReactWrapper` 自动传递）
    - 使用 `v-if`/`v-else` 或三元表达式显示对应语言文本
    - 所有用户可见文本（标题、描述、按钮、提示等）都必须适配中英文
  - **主题组件多语言**：主题组件（如 `VersionBanner`）也必须支持中英文
  - **语言检测工具**：可使用 `@theme/utils/lang.ts` 中的 `useIsZh()` 函数

### 4. 版本管理

- **版本同步**：所有包（core, react, vue）的版本号必须保持一致
- **版本工具**：使用 `standard-version` 管理版本和生成 CHANGELOG
- **发布流程**：遵循 `PUBLISH.md` 中的发布步骤
- **README 同步**：发布时使用 `pnpm update:readme` 更新 README 中的版本号

---

## 🚀 功能开发流程

### 新增功能步骤

1. **需求分析**
   - 确定功能属于哪个包（core/react/vue）
   - 评估是否需要修改核心逻辑
   - 考虑向后兼容性

2. **代码实现**
   - 核心逻辑优先在 `keymaster-core` 中实现
   - React/Vue 包只做框架适配
   - 确保类型定义完整

3. **测试编写**
   - 为核心逻辑编写单元测试
   - 确保测试覆盖所有分支

4. **文档更新**
   - 更新 API 文档（JSDoc）
   - 更新使用示例
   - 如有必要，创建交互式 Demo
   - **必须同时更新英文和中文文档**

5. **README 更新**
   - 如有功能变更影响使用方式，更新 README
   - **必须同时更新英文和中文 README**

6. **版本发布**
   - 使用 `pnpm release` 升级版本
   - 使用 `pnpm update:readme` 更新 README 版本号
   - 发布到 npm

---

## 📝 API 设计规范

### 函数命名

- **注册函数**：`registerKeyBinding`, `registerVueKeyBinding`
- **Hook 函数**：`useKeyBinding`, `useScopedKeyBinding`
- **工具函数**：`parseShortcut`, `isMatchingShortcut`
- **类型定义**：使用 PascalCase，如 `KeymasterHandler`, `KeymasterBindingOptions`

### 参数设计

- **快捷键字符串**：统一使用小写，`+` 分隔，如 `"ctrl+s"`, `"cmd+k"`
- **选项对象**：使用可选参数对象，便于扩展
- **返回值**：注册函数返回清理函数 `() => void`

### 示例：API 设计

````typescript
/**
 * 注册键盘快捷键绑定。
 *
 * @param shortcut 快捷键字符串，如 "ctrl+s", "cmd+k"
 * @param handler 事件处理函数
 * @param options 可选的绑定选项（作用域、编辑器模式等）
 * @returns 返回清理函数，用于取消绑定
 *
 * @example
 * ```typescript
 * const cleanup = registerKeyBinding('ctrl+s', (event) => {
 *   event.preventDefault();
 *   console.log('Save');
 * });
 * // 组件卸载时调用 cleanup()
 * ```
 */
export function registerKeyBinding(
  shortcut: string,
  handler: KeymasterHandler,
  options?: KeymasterBindingOptions,
): () => void {
  // 实现...
}
````

---

## 🧪 测试规范

### 测试文件结构

- 测试文件与源文件放在同一目录
- 命名：`源文件名.test.ts`
- 示例：`parser.ts` → `parser.test.ts`

### 测试用例要求

- **核心逻辑**：必须覆盖所有分支和边界情况
- **错误处理**：测试错误输入和异常情况
- **类型安全**：确保类型检查通过

### 示例：测试用例

```typescript
import { describe, it, expect } from 'vitest';
import { parseShortcut } from './parser';

describe('parseShortcut', () => {
  it('应该正确解析简单快捷键', () => {
    const result = parseShortcut('ctrl+s');
    expect(result.modifiers).toContain('ctrl');
    expect(result.key).toBe('s');
  });

  it('应该处理无效输入', () => {
    expect(() => parseShortcut('')).toThrow();
  });
});
```

---

## 📚 文档规范

### 多语言支持规范

**核心原则**：所有包含用户可见文本的组件和文档都必须支持中英文。

#### Demo 组件多语言实现

所有 Demo 组件（位于 `docs/.vitepress/components/`）必须实现中英文自动切换：

**Vue 组件示例**：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();
const isZh = computed(() => route.path.startsWith('/zh/'));
</script>

<template>
  <div>
    <!-- 方式 1: 使用 v-if/v-else -->
    <h3 v-if="isZh">中文标题</h3>
    <h3 v-else>English Title</h3>

    <!-- 方式 2: 使用三元表达式 -->
    <p>{{ isZh ? '中文描述' : 'English Description' }}</p>

    <!-- JavaScript 代码中的文本也需要切换 -->
    <button @click="handleClick">
      {{ isZh ? '按钮' : 'Button' }}
    </button>
  </div>
</template>

<script setup lang="ts">
function handleClick() {
  const message = isZh.value ? '操作成功' : 'Operation successful';
  showMessage(message);
}
</script>
```

**React 组件示例**：

```tsx
import React from 'react';

interface DemoProps {
  isZh?: boolean;
}

export default function Demo({ isZh = false }: DemoProps) {
  return (
    <div>
      <h3>{isZh ? '中文标题' : 'English Title'}</h3>
      <p>{isZh ? '中文描述' : 'English Description'}</p>
      <button
        onClick={() => {
          const message = isZh ? '操作成功' : 'Operation successful';
          showMessage(message);
        }}
      >
        {isZh ? '按钮' : 'Button'}
      </button>
    </div>
  );
}
```

**必须适配的文本类型**：

- 组件标题和描述
- 按钮文字
- 状态提示（如"最近触发"、"暂无"等）
- 操作反馈消息
- 占位符文本（placeholder）
- 提示信息（hint）

#### 主题组件多语言实现

包含用户可见文本的主题组件（如 `VersionBanner`）也必须支持中英文，实现方式与 Demo 组件相同。

纯视觉组件（如 `BackToTop`、`CustomCursor`、`VisualEffects`）如不包含文本，可忽略多语言支持。

#### 文档 Markdown 多语言

- 英文文档：`apps/keymaster-docs/docs/`
- 中文文档：`apps/keymaster-docs/docs/zh/`
- 两个目录下的文件结构必须保持一致
- 内容必须同步更新

#### README 文件多语言

**根目录 README**：

- 英文版：`README.md`
- 中文版：`README.zh.md`
- 两个文件必须同步更新，内容保持一致

**子包 README**：

- 每个子包（`keymaster-core`、`keymaster-react`、`keymaster-vue`）都有：
  - 英文版：`packages/*/README.md`
  - 中文版：`packages/*/README.zh.md`
- 所有 README 文件必须同步更新

**更新时机**：

- 功能变更影响使用方式时
- API 变更时
- 安装或配置说明变更时
- 版本发布时（使用 `pnpm update:readme` 更新版本号）
- 添加新特性或修复重要问题时

**更新要求**：

- 必须同时更新英文和中文版本
- 确保两个版本的内容一致

---

## 📖 文档站点开发

### 文档结构

文档站点使用 VitePress，支持多语言：

- **英文文档**：`apps/keymaster-docs/docs/`
- **中文文档**：`apps/keymaster-docs/docs/zh/`

### 文档页面要求

1. **API 说明**
   - 功能描述
   - 参数说明
   - 返回值说明
   - 使用示例（代码块）
   - 注意事项和最佳实践

2. **交互式 Demo**
   - **框架对应关系（重要）**：
     - **React 文档**（`/react/` 或 `/zh/react/`）：必须使用 React 组件实现的 Demo
     - **Vue 文档**（`/vue/` 或 `/zh/vue/`）：必须使用 Vue 组件实现的 Demo
     - 通过 `AutoDemoWrapper` 组件自动根据路由选择对应框架的 Demo
   - **Demo 组件位置**：
     - Vue 版本：`docs/.vitepress/components/`（Vue 组件，如 `ScopedShortcutDemo.vue`）
     - React 版本：`docs/.vitepress/components/react/`（React TSX 组件 + Vue 包装器，如 `ScopedShortcutDemo.tsx` + `ScopedShortcutDemoWrapper.vue`）
   - **组件注册**：
     - 在 `theme/index.ts` 中使用 `AutoDemoWrapper` 注册，自动根据路由选择版本
     - 示例：

       ```typescript
       import { h } from 'vue';
       import AutoDemoWrapper from '../components/AutoDemoWrapper.vue';
       import ScopedShortcutDemo from '../components/ScopedShortcutDemo.vue';
       import ScopedShortcutDemoWrapper from '../components/react/ScopedShortcutDemoWrapper.vue';

       app.component('ScopedShortcutDemo', () =>
         h(AutoDemoWrapper, {
           vueComponent: ScopedShortcutDemo,
           reactComponent: ScopedShortcutDemoWrapper,
         }),
       );
       ```

   - **在文档中使用**：
     - 在文档中通过 `<ComponentName />` 引用，无需关心框架
     - 系统会根据当前文档路径自动选择对应框架的 Demo
   - Demo 应该展示实际使用场景
   - **注意**：Demo 组件放在 `docs/.vitepress/components/`，主题组件（如 BackToTop、CustomCursor）放在 `theme/components/`
   - **多语言支持（必需）**：
     - 所有 Demo 组件必须支持中英文自动切换
     - Vue 组件：使用 `useRoute()` 和 `computed(() => route.path.startsWith('/zh/'))` 检测当前语言
     - React 组件：通过 `isZh` prop 接收语言信息（由 `ReactWrapper` 自动传递）
     - 所有用户可见文本（标题、描述、按钮、状态提示、操作反馈等）都必须提供中英文版本
     - Vue 组件使用 `v-if`/`v-else` 或三元表达式 `{{ isZh ? '中文' : 'English' }}`
     - React 组件使用三元表达式或条件渲染 `{isZh ? '中文' : 'English'}`

3. **版本信息**
   - 使用 `<VersionBanner />` 显示当前版本
   - 使用 `<VersionText />` 显示版本号文本

### 文档示例

```markdown
## useKeyBinding

注册全局键盘快捷键。

### 参数

- `shortcut: string` - 快捷键字符串
- `handler: KeymasterHandler` - 事件处理函数
- `options?: KeymasterBindingOptions` - 可选配置

### 返回值

返回清理函数，用于取消绑定。

### 示例

<ReactShortcutDemo />

### 注意事项

- 快捷键字符串区分大小写
- 修饰键支持：`ctrl`, `alt`, `shift`, `meta`（Mac 上的 Cmd）
```

---

## 🔧 工具和脚本

### 常用命令

```bash
# 开发
pnpm docs:dev          # 启动文档开发服务器
pnpm build             # 构建所有包
pnpm lint              # 检查代码规范
pnpm lint:fix          # 自动修复代码规范问题
pnpm test              # 运行所有测试

# 发布
pnpm release           # 版本号 patch 升级
pnpm release:minor     # 版本号 minor 升级
pnpm release:major     # 版本号 major 升级
pnpm publish:all       # 发布所有包到 npm
pnpm update:readme     # 更新 README 中的版本号
```

### 构建配置

- **Vite**: 所有包使用 Vite 构建（lib 模式）
- **TypeScript**: 使用 `vite-plugin-dts` 生成类型声明文件
- **输出格式**: ESM + CJS 双格式

---

## 🐛 Bug 修复流程

1. **问题定位**
   - 复现问题
   - 确定问题所在的包（core/react/vue）
   - 分析根本原因

2. **修复实现**
   - 在对应包中修复问题
   - 添加回归测试用例
   - 确保不引入新问题

3. **测试验证**
   - 运行所有测试
   - 在文档 Demo 中验证修复

4. **文档更新**
   - 如有必要，更新文档说明
   - **必须同时更新英文和中文文档**

5. **版本发布**
   - 使用 `pnpm release` 升级 patch 版本
   - 更新 README 版本号（使用 `pnpm update:readme`）
   - 如有功能变更，同步更新 README 的中英文版本
   - 发布到 npm

---

## 🎨 文档站点增强

### 自定义组件

文档站点的组件分为两类：

#### Demo 组件（位于 `apps/keymaster-docs/docs/.vitepress/components/`）

用于在文档中展示功能示例的交互式组件：

**框架对应关系**：

- **React 文档**（`/react/` 或 `/zh/react/`）：使用 React 组件实现的 Demo
- **Vue 文档**（`/vue/` 或 `/zh/vue/`）：使用 Vue 组件实现的 Demo
- 通过 `AutoDemoWrapper` 组件自动根据路由选择对应框架的 Demo

**组件结构**：

- Vue 版本组件：`docs/.vitepress/components/`（如 `VueShortcutDemo.vue`、`ScopedShortcutDemo.vue`）
- React 版本组件：`docs/.vitepress/components/react/`（如 `ReactShortcutDemo.tsx` + `ReactShortcutDemoWrapper.vue`）

**现有 Demo 组件**：

- `ReactShortcutDemo` - React/Vue 基础示例（根据文档路径自动选择）
- `VueShortcutDemo` - Vue 基础示例（仅用于 Vue 文档）
- `ScopedShortcutDemo` - 作用域绑定示例（根据文档路径自动选择）
- `EditorModeDemo` - 编辑器模式示例（根据文档路径自动选择）
- `MultipleShortcutsDemo` - 多快捷键示例（根据文档路径自动选择）
- `KeyBindingManagerDemo` - 快捷键管理器示例（根据文档路径自动选择）
- `ElectronModeDemo` - Electron 模式示例（Vue 版本）

**注意**：

- Demo 组件放在 `docs/.vitepress/components/` 目录下
- React 版本 Demo 放在 `docs/.vitepress/components/react/` 子目录
- 在 `theme/index.ts` 中使用 `AutoDemoWrapper` 注册，自动根据路由选择版本
- 使用相对路径 `../components/` 导入（VitePress 中别名导入可能不稳定）

#### 主题组件（位于 `apps/keymaster-docs/docs/.vitepress/theme/components/`）

用于增强文档站点整体体验的全局组件：

- `BackToTop` - 回到顶部按钮
- `CustomCursor` - 自定义鼠标光标
- `VisualEffects` - 背景视觉效果
- `VersionSelector` - 版本选择器
- `VersionBanner` - 版本横幅
- `VersionText` - 版本文本
- `AllVersions` - 所有版本列表
- `VersionList` - 版本列表

**注意**：主题组件放在 `theme/components/` 目录下，在 `theme/index.ts` 中使用相对路径 `./components/` 导入。

### 添加新 Demo

**重要**：新增 Demo 时必须同时创建 Vue 版本和 React 版本，确保 React 文档使用 React 组件，Vue 文档使用 Vue 组件。

#### 1. 创建 Vue 版本 Demo（用于 Vue 文档）

1. 在 `docs/.vitepress/components/` 创建 Vue 组件（如 `NewDemo.vue`）
2. **实现多语言支持（必需）**：

   ```vue
   <script setup lang="ts">
   import { computed } from 'vue';
   import { useRoute } from 'vitepress';

   const route = useRoute();
   const isZh = computed(() => route.path.startsWith('/zh/'));
   </script>

   <template>
     <div>
       <h3>{{ isZh ? '中文标题' : 'English Title' }}</h3>
       <p>{{ isZh ? '中文描述' : 'English Description' }}</p>
       <button>{{ isZh ? '按钮' : 'Button' }}</button>
     </div>
   </template>
   ```

   - 所有用户可见文本（标题、描述、按钮、状态提示、操作反馈等）都必须提供中英文版本
   - 使用 `v-if`/`v-else` 或三元表达式 `{{ isZh ? '中文' : 'English' }}` 切换语言
   - 在 JavaScript 代码中的文本（如 `showAction()` 函数）也需要根据语言切换

#### 2. 创建 React 版本 Demo（用于 React 文档）

1. 在 `docs/.vitepress/components/react/` 创建 React TSX 组件（如 `NewDemo.tsx`）
2. **实现多语言支持（必需）**：
   - 通过 `isZh` prop 接收语言信息（由 `ReactWrapper` 自动传递）
   - 使用三元表达式或条件渲染显示对应语言文本
   - 示例：

     ```tsx
     interface NewDemoProps {
       isZh?: boolean;
     }

     export default function NewDemo({ isZh = false }: NewDemoProps) {
       return (
         <div>
           <h3>{isZh ? '中文标题' : 'English Title'}</h3>
           <p>{isZh ? '中文描述' : 'English Description'}</p>
         </div>
       );
     }
     ```

3. 创建对应的 CSS 文件（如 `NewDemo.css`）
4. 创建 Vue 包装器组件（如 `NewDemoWrapper.vue`）：
   ```vue
   <template>
     <ReactWrapper :component="NewDemo" />
   </template>
   <script setup lang="ts">
   import ReactWrapper from './ReactWrapper.vue';
   import NewDemo from './NewDemo';
   </script>
   ```

#### 3. 注册组件（自动选择版本）

在 `docs/.vitepress/theme/index.ts` 中使用 `AutoDemoWrapper` 注册，自动根据路由选择版本：

```typescript
import { h } from 'vue';
import AutoDemoWrapper from '../components/AutoDemoWrapper.vue';
import NewDemoVue from '../components/NewDemo.vue';
import NewDemoWrapper from '../components/react/NewDemoWrapper.vue';

app.component('NewDemo', () =>
  h(AutoDemoWrapper, {
    vueComponent: NewDemoVue,
    reactComponent: NewDemoWrapper,
  }),
);
```

#### 4. 在文档中使用

在文档中通过 `<ComponentName />` 引用，系统会根据当前文档路径自动选择对应框架的 Demo：

- React 文档（`/react/` 或 `/zh/react/`）：自动使用 React 版本
- Vue 文档（`/vue/` 或 `/zh/vue/`）：自动使用 Vue 版本

### 添加新主题组件

1. 在 `docs/.vitepress/theme/components/` 创建 Vue 组件（主题组件）
2. **实现多语言支持（如组件包含用户可见文本）**：
   - 如果组件包含用户可见文本（如 `VersionBanner`），必须支持中英文
   - 使用与 Demo 组件相同的方式检测语言
   - 如果组件不包含文本（如纯视觉组件），可忽略多语言支持
3. 在 `docs/.vitepress/theme/index.ts` 中使用相对路径导入：
   ```typescript
   import BackToTop from './components/BackToTop.vue';
   ```
4. 如需全局使用，在 `Layout()` 中渲染或在 `enhanceApp` 中注册

---

## ⚠️ 注意事项

### 禁止事项

- ❌ 在 `keymaster-core` 中引入 React 或 Vue 依赖
- ❌ 破坏性变更不升级主版本号
- ❌ 跳过测试直接提交代码
- ❌ 只更新英文或中文文档（必须双语同步）
- ❌ 只更新英文或中文 README（必须双语同步）
- ❌ 功能变更后不更新 README（影响使用方式的变更必须更新 README）
- ❌ Demo 组件或主题组件缺少多语言支持（包含用户可见文本的组件必须支持中英文）
- ❌ React 文档使用 Vue 组件 Demo，或 Vue 文档使用 React 组件 Demo（必须使用对应框架的组件）
- ❌ 新增 Demo 时只创建 Vue 版本或只创建 React 版本（必须同时创建两个版本）
- ❌ 使用 `any` 类型（除非绝对必要）

### 推荐做法

- ✅ 新功能优先在 core 中实现
- ✅ 保持三个包版本同步
- ✅ 所有公开 API 都有 JSDoc 注释
- ✅ 重要功能提供交互式 Demo
- ✅ Demo 组件和主题组件（包含文本的）都支持中英文自动切换
- ✅ React 文档使用 React 组件 Demo，Vue 文档使用 Vue 组件 Demo（通过 AutoDemoWrapper 自动选择）
- ✅ 每次项目更新时，评估并更新相关文档和 README
- ✅ README 文件保持中英文版本同步更新
- ✅ 遵循现有的代码风格和架构

---

## 📖 参考资源

- **项目 README**: `README.md` / `README.zh.md`
- **发布流程**: `PUBLISH.md`
- **实施计划**: `implementation-plan.mdc`
- **文档站点**: https://keymaster-docs.vercel.app/
- **npm 包**:
  - [@keekuun/keymaster-core](https://www.npmjs.com/package/@keekuun/keymaster-core)
  - [@keekuun/keymaster-react](https://www.npmjs.com/package/@keekuun/keymaster-react)
  - [@keekuun/keymaster-vue](https://www.npmjs.com/package/@keekuun/keymaster-vue)

---

## 🔄 更新日志

- **2024-01-XX**: 添加 React Demo 组件支持，React 文档使用 React 组件，Vue 文档使用 Vue 组件
- **2024-01-XX**: 添加多语言支持规范，要求所有 Demo 和主题组件支持中英文
- **2024-01-XX**: 添加 README 文件双语同步要求
