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
    - 使用 `useRoute()` 检测当前路径（`route.path.startsWith('/zh/')`）
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
   - 明确功能需求和使用场景
   - 确定是否需要修改 core、react、vue 或全部
   - 评估对现有 API 的影响

2. **核心实现（如需要）**
   - 在 `keymaster-core` 中实现核心逻辑
   - 添加类型定义（`types.ts`）
   - 编写单元测试（`*.test.ts`）
   - 确保导出到 `index.ts`

3. **框架适配**
   - 在 `keymaster-react` 中添加 React Hook（如需要）
   - 在 `keymaster-vue` 中添加 Vue Composition API（如需要）
   - 确保使用 core 模块的共享逻辑

4. **测试验证**
   - 运行 `pnpm test` 确保所有测试通过
   - 在文档站点的 Demo 中验证功能

5. **文档更新**
   - 更新 API 文档（JSDoc）
   - 在文档站点添加使用示例
   - 创建交互式 Demo（如适用）
     - **必须实现多语言支持**：所有 Demo 组件中的用户可见文本都要提供中英文版本
     - 使用 `useRoute()` 检测当前语言路径（`route.path.startsWith('/zh/')`）
     - 使用 `v-if`/`v-else` 或三元表达式切换显示
     - JavaScript 代码中的文本（如操作反馈）也需要根据语言切换
   - 同步更新中英文文档（Markdown 文件）
   - **更新 README 文件（如需要）**：
     - 如果功能变更影响使用方式、API 或安装说明，必须更新 README
     - 同时更新英文版（`README.md`）和中文版（`README.zh.md`）
     - 根目录和各子包的 README 都需要同步更新
     - 使用 `pnpm update:readme` 更新版本号（发布时）

6. **版本发布**
   - 更新版本号（使用 `standard-version`）
   - 更新 CHANGELOG
   - 更新 README 版本号（使用 `pnpm update:readme`）
   - 如有功能变更，同步更新 README 的中英文版本
   - 发布到 npm
   - 文档站点自动更新（Vercel）

### 代码优化步骤

1. **性能优化**
   - 使用性能分析工具识别瓶颈
   - 优化事件监听器注册/注销逻辑
   - 减少不必要的计算和内存分配

2. **代码重构**
   - 提取公共逻辑到 core 模块
   - 消除重复代码
   - 改进类型定义和接口设计

3. **测试补充**
   - 为重构后的代码补充测试用例
   - 确保测试覆盖率不降低

4. **文档同步**
   - 更新相关文档以反映优化后的实现

---

## 📝 代码规范

### TypeScript

- 使用严格的 TypeScript 配置（`strict: true`）
- 避免使用 `any`，优先使用 `unknown` 或具体类型
- 使用 `interface` 定义对象类型，使用 `type` 定义联合类型或工具类型
- 导出类型时使用 `export type` 或 `export interface`

### 命名规范

- **函数/变量**：使用 camelCase（如 `registerKeyBinding`）
- **类型/接口**：使用 PascalCase（如 `KeymasterHandler`）
- **常量**：使用 UPPER_SNAKE_CASE（如 `MODIFIER_KEYS`）
- **文件**：使用 kebab-case（如 `key-binding.ts`）

### 注释规范

- **JSDoc**：所有公开 API 必须包含 JSDoc 注释
- **示例**：复杂逻辑必须包含注释说明
- **TODO**：使用 `// TODO: 描述` 标记待办事项

### 示例：函数注释

````typescript
/**
 * 注册键盘快捷键绑定
 *
 * @param shortcut - 快捷键字符串，如 'ctrl+s', 'cmd+k'
 * @param handler - 事件处理函数
 * @param options - 可选的绑定选项（作用域、编辑器模式等）
 * @returns 清理函数，调用后取消绑定
 *
 * @example
 * ```ts
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

**必须适配的文本类型**：

- 组件标题和描述
- 按钮文字
- 状态提示（如"最近触发"、"暂无"等）
- 操作反馈消息
- 占位符文本（placeholder）
- 提示信息（hint）
- 错误和成功消息

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
- 保持格式和结构的一致性
- 每次项目更新时，评估是否需要更新 README

### 文档站点结构

```
apps/keymaster-docs/docs/
├── index.md              # 英文首页
├── react/
│   └── index.md          # React 文档
├── vue/
│   └── index.md          # Vue 文档
├── core/
│   └── index.md          # Core 文档
└── zh/                   # 中文文档（相同结构）
    ├── index.md
    ├── react/
    ├── vue/
    └── core/
```

### 文档内容要求

1. **API 文档**
   - 参数说明（类型、是否必需、默认值）
   - 返回值说明
   - 使用示例（代码块）
   - 注意事项和最佳实践

2. **交互式 Demo**
   - 使用 Vue 组件创建 Demo（放在 `docs/.vitepress/components/`）
   - 在 `theme/index.ts` 中使用相对路径 `../components/` 导入（VitePress 中别名导入可能不稳定）
   - 在文档中通过 `<ComponentName />` 引用
   - Demo 应该展示实际使用场景
   - **注意**：Demo 组件放在 `docs/.vitepress/components/`，主题组件（如 BackToTop、CustomCursor）放在 `theme/components/`
   - **多语言支持（必需）**：
     - 所有 Demo 组件必须支持中英文自动切换
     - 使用 `useRoute()` 和 `computed(() => route.path.startsWith('/zh/'))` 检测当前语言
     - 所有用户可见文本（标题、描述、按钮、状态提示、操作反馈等）都必须提供中英文版本
     - 使用 `v-if`/`v-else` 或三元表达式 `{{ isZh ? '中文' : 'English' }}` 显示对应语言
     - 示例代码：

       ```vue
       <script setup lang="ts">
       import { computed } from 'vue';
       import { useRoute } from 'vitepress';

       const route = useRoute();
       const isZh = computed(() => route.path.startsWith('/zh/'));
       </script>

       <template>
         <p>{{ isZh ? '中文文本' : 'English Text' }}</p>
       </template>
       ```

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

- `ReactShortcutDemo` - React 基础示例
- `VueShortcutDemo` - Vue 基础示例
- `ScopedShortcutDemo` - 作用域绑定示例
- `EditorModeDemo` - 编辑器模式示例
- `MultipleShortcutsDemo` - 多快捷键示例
- `KeyBindingManagerDemo` - 快捷键管理器示例
- `ElectronModeDemo` - Electron 模式示例

**注意**：Demo 组件放在 `docs/.vitepress/components/` 目录下，在 `theme/index.ts` 中使用相对路径 `../components/` 导入（VitePress 中别名导入可能不稳定）。

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

1. 在 `docs/.vitepress/components/` 创建 Vue 组件（Demo 组件）
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

3. 在 `docs/.vitepress/theme/index.ts` 中使用相对路径导入：
   ```typescript
   import VueShortcutDemo from '../components/VueShortcutDemo.vue';
   ```
4. 在 `enhanceApp` 中注册组件
5. 在文档中使用 `<ComponentName />` 引用

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
- ❌ 使用 `any` 类型（除非绝对必要）

### 推荐做法

- ✅ 新功能优先在 core 中实现
- ✅ 保持三个包版本同步
- ✅ 所有公开 API 都有 JSDoc 注释
- ✅ 重要功能提供交互式 Demo
- ✅ Demo 组件和主题组件（包含文本的）都支持中英文自动切换
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

本文档会随着项目发展持续更新。主要更新场景：

- 新增功能特性时，更新相关开发流程
- 优化代码架构时，更新架构说明
- 改进开发工具时，更新工具和脚本说明
- 发现最佳实践时，更新推荐做法

---

**最后更新**: 2025-12（项目 v0.4.1 阶段）
