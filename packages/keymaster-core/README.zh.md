# @keekuun/keymaster-core

### 🌐 语言

- [English](README.md)
- [中文](README.zh.md) (当前)

keymaster 核心模块，提供 React 和 Vue 版本共享的类型定义、解析器和工具函数。

> **注意**：通常你不需要直接安装此包。它作为 `@keekuun/keymaster-react` 和 `@keekuun/keymaster-vue` 的依赖自动安装。如果你需要在其他项目中使用核心功能，可以单独安装。

## 概述

`@keekuun/keymaster-core` 是 `@keekuun/keymaster-react` 和 `@keekuun/keymaster-vue` 的底层核心模块，包含：

- **类型定义**：统一的类型系统，确保 React 和 Vue 版本的类型一致性
- **快捷键解析器**：将字符串格式的快捷键（如 `"ctrl+s"`）解析为结构化对象
- **事件匹配器**：判断键盘事件是否匹配预期的快捷键组合
- **作用域检查**：验证事件是否发生在特定元素范围内
- **Electron 支持**：检测和处理 Electron 环境的特殊需求
- **KeyBindingManager**：框架无关的快捷键绑定管理器，用于管理一组相关的快捷键
- **工具函数**：`isValidShortcut()` 和 `formatShortcut()` 用于快捷键验证和格式化

## 安装

### 作为依赖自动安装

当你安装 `@keekuun/keymaster-react` 或 `@keekuun/keymaster-vue` 时，`keymaster-core` 会自动作为依赖安装：

```bash
npm install @keekuun/keymaster-react
# keymaster-core 会自动安装
```

### 单独安装（可选）

如果你需要在其他项目中使用核心功能，可以单独安装：

```bash
npm install @keekuun/keymaster-core
# 或者
pnpm add @keekuun/keymaster-core
```

## API 文档

### 类型定义

#### `KeymasterHandler`

键盘事件处理函数类型：

```typescript
type KeymasterHandler = (event: KeyboardEvent) => void;
```

#### `KeymasterBindingOptionsBase`

快捷键绑定选项的基础接口：

```typescript
interface KeymasterBindingOptionsBase {
  preventDefault?: boolean; // 是否阻止默认行为
  stopPropagation?: boolean; // 是否阻止事件冒泡
  scopedElement?: HTMLElement | null; // 作用域元素
  editorMode?: boolean; // 编辑器模式
  electronMode?: boolean; // Electron 模式
}
```

#### `ParsedShortcut`

解析后的快捷键结构：

```typescript
interface ParsedShortcut {
  key: string; // 主键（如 "s", "enter"）
  ctrl: boolean; // 是否按下 Ctrl
  alt: boolean; // 是否按下 Alt
  shift: boolean; // 是否按下 Shift
  meta: boolean; // 是否按下 Meta/Cmd
}
```

#### `ElectronWindow`

Electron 环境的 Window 类型扩展：

```typescript
interface ElectronWindow extends Window {
  process?: {
    type?: string;
    versions?: {
      electron?: string;
      node?: string;
      chrome?: string;
    };
  };
}
```

### 核心函数

#### `parseShortcut(shortcut: string): ParsedShortcut`

解析快捷键字符串为结构化对象：

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

const parsed = parseShortcut('ctrl+shift+s');
// { key: "s", ctrl: true, shift: true, alt: false, meta: false }
```

#### `isMatchingShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean`

判断键盘事件是否匹配解析后的快捷键：

```typescript
import { isMatchingShortcut, parseShortcut } from '@keekuun/keymaster-core';

const parsed = parseShortcut('ctrl+s');
const isMatch = isMatchingShortcut(keyboardEvent, parsed);
```

#### `isEventInScope(event: KeyboardEvent, scopedElement: HTMLElement): boolean`

检查事件是否发生在作用域元素内：

```typescript
import { isEventInScope } from '@keekuun/keymaster-core';

const isInScope = isEventInScope(keyboardEvent, editorElement);
```

#### `isElectronEnvironment(): boolean`

检测当前是否在 Electron 环境中：

```typescript
import { isElectronEnvironment } from '@keekuun/keymaster-core';

if (isElectronEnvironment()) {
  // 处理 Electron 特定逻辑
}
```

#### `getElectronProcessInfo(): ElectronWindow["process"] | null`

获取 Electron 进程信息（如果可用）：

```typescript
import { getElectronProcessInfo } from '@keekuun/keymaster-core';

const processInfo = getElectronProcessInfo();
if (processInfo) {
  console.log(processInfo.type); // "renderer" 或 "main"
}
```

### KeyBindingManager

`KeyBindingManager` 类允许你管理一组相关的快捷键绑定。它是框架无关的，可以在任何 JavaScript/TypeScript 项目中独立使用。

**注意**：`KeyBindingManager` 可以直接使用，无需提供注册函数。它默认使用浏览器原生 API。你也可以选择提供自定义注册函数以获得更好的框架集成。

#### 基础用法

```typescript
import { KeyBindingManager } from '@keekuun/keymaster-core';

// 创建管理器实例 - 无需提供注册函数！
const manager = new KeyBindingManager();

// 链式注册多个快捷键
manager
  .register('ctrl+s', () => console.log('保存'))
  .register('ctrl+z', () => console.log('撤销'))
  .register('ctrl+shift+z', () => console.log('重做'));

// 清理所有绑定
manager.dispose();
```

#### 高级用法（带选项）

```typescript
import { KeyBindingManager } from '@keekuun/keymaster-core';

const manager = new KeyBindingManager();

// 注册时使用选项（作用域元素、阻止默认行为等）
const editorElement = document.getElementById('editor');
manager
  .register('ctrl+s', () => console.log('保存'), {
    scopedElement: editorElement,
    preventDefault: true,
  })
  .register('ctrl+k', () => console.log('搜索'), {
    scopedElement: editorElement,
    preventDefault: true,
    stopPropagation: true,
  });
```

#### 自定义注册函数（可选）

如果你想使用自定义注册函数（例如来自 React/Vue 包），可以将其作为参数传递：

```typescript
import { KeyBindingManager } from '@keekuun/keymaster-core';
import { registerKeyBinding } from '@keekuun/keymaster-react';

// 使用 React 的注册函数以获得更好的框架集成
const manager = new KeyBindingManager(registerKeyBinding);
manager.register('ctrl+s', () => console.log('保存')).register('ctrl+z', () => console.log('撤销'));
```

// 链式注册多个快捷键
manager
.register('ctrl+s', () => console.log('保存'))
.register('ctrl+z', () => console.log('撤销'))
.register('ctrl+shift+z', () => console.log('重做'));

// 清理所有绑定
manager.dispose();

````

#### 与 React/Vue 一起使用

当与 React 或 Vue 一起使用时，可以使用框架特定的 `createKeyBindingManager`：

```typescript
// React
import { createKeyBindingManager } from '@keekuun/keymaster-react';
const manager = createKeyBindingManager();

// Vue
import { createKeyBindingManager } from '@keekuun/keymaster-vue';
const manager = createKeyBindingManager();
````

#### 工具函数

```typescript
import { isValidShortcut, formatShortcut } from '@keekuun/keymaster-core';

// 验证快捷键格式
isValidShortcut('ctrl+s'); // true
isValidShortcut('invalid'); // false

// 格式化快捷键字符串
formatShortcut('Ctrl+S'); // 'ctrl+s'
formatShortcut('ctrl + shift + z'); // 'ctrl+shift+z'
```

### 常量

```typescript
import {
  MODIFIER_CTRL,
  MODIFIER_ALT,
  MODIFIER_SHIFT,
  MODIFIER_META,
  MODIFIER_CMD,
  PLUS_SEPARATOR,
  MODIFIERS,
} from '@keekuun/keymaster-core';
```

## 使用场景

### 自定义快捷键处理

如果你需要实现自定义的快捷键处理逻辑，可以直接使用核心模块：

```typescript
import { parseShortcut, isMatchingShortcut, type KeymasterHandler } from '@keekuun/keymaster-core';

function createCustomKeyHandler(shortcut: string, handler: KeymasterHandler) {
  const parsed = parseShortcut(shortcut);

  return (event: KeyboardEvent) => {
    if (isMatchingShortcut(event, parsed)) {
      handler(event);
    }
  };
}
```

### 快捷键验证工具

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

function validateShortcut(shortcut: string): boolean {
  try {
    parseShortcut(shortcut);
    return true;
  } catch {
    return false;
  }
}
```

## 构建格式

核心包支持多种构建格式，适用于不同的使用场景：

- **ES Module** (`dist/index.js`): 适用于现代打包工具和 ES 模块环境
- **CommonJS** (`dist/index.cjs`): 适用于 Node.js 和 CommonJS 环境
- **UMD** (`dist/index.umd.js`): 适用于浏览器 `<script>` 标签和 CDN 使用（仅核心包）

### UMD 使用方式（仅核心包）

> **注意**：UMD 格式仅适用于 `@keekuun/keymaster-core`。React 和 Vue 包（`@keekuun/keymaster-react` 和 `@keekuun/keymaster-vue`）不提供 UMD 构建，因为它们需要框架环境，通常与现代打包工具一起使用。

你可以直接在浏览器中使用核心包的 UMD 构建：

```html
<!-- 通过 unpkg CDN -->
<script src="https://unpkg.com/@keekuun/keymaster-core/dist/index.umd.js"></script>
<!-- 或通过 jsdelivr CDN -->
<script src="https://cdn.jsdelivr.net/npm/@keekuun/keymaster-core/dist/index.umd.js"></script>
<script>
  // 通过全局变量 KeymasterCore 访问
  const { KeyBindingManager, parseShortcut, isValidShortcut, formatShortcut } = KeymasterCore;

  // 示例：使用 KeyBindingManager 和你自己的注册函数
  function myRegisterKeyBinding(shortcut, handler, options) {
    const listener = (event) => {
      // 你的自定义匹配逻辑
      handler(event);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }

  const manager = new KeyBindingManager(myRegisterKeyBinding);
  manager
    .register('ctrl+s', () => console.log('保存'))
    .register('ctrl+z', () => console.log('撤销'));
</script>
```

**UMD 使用场景：**

- 无需打包工具的快速原型和演示
- 不使用现代打包工具的遗留项目
- 基于 CDN 的部署
- 独立的 JavaScript 应用

**限制：**

- 浏览器环境中无法进行 TypeScript 类型检查
- 需要手动管理依赖
- 不推荐用于生产环境的 React/Vue 应用（应使用 npm 包）

## 设计原则

1. **类型安全**：所有函数和类型都有完整的 TypeScript 类型定义
2. **框架无关**：核心模块不依赖任何 UI 框架（React/Vue）
3. **可扩展性**：为 React 和 Vue 版本提供统一的基础能力
4. **零依赖**：核心模块仅依赖浏览器原生 API
5. **可独立使用**：可以在任何 JavaScript/TypeScript 项目中独立使用

## 版本兼容性

- TypeScript: ^5.0.0
- 浏览器: 支持所有现代浏览器（ES2020+）

## 相关链接

- React 版本：`@keekuun/keymaster-react`
- Vue 版本：`@keekuun/keymaster-vue`
- 文档站点：[https://keymaster-docs.vercel.app/zh/core/](https://keymaster-docs.vercel.app/zh/core/)
- GitHub 仓库：[https://github.com/Keekuun/keymaster](https://github.com/Keekuun/keymaster)
