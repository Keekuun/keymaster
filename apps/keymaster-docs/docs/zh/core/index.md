# keymaster-core 核心模块

<VersionBanner />

> 💡 **版本提示**：文档显示的是最新版本（<VersionText />）。如果你使用的是其他版本，请查看 [版本管理文档](/zh/versions) 或 [npm 上的所有版本](https://www.npmjs.com/package/@keekuun/keymaster-core?activeTab=versions)。

`@keekuun/keymaster-core` 是 keymaster 的核心模块，为 React 和 Vue 版本提供共享的类型定义、解析器和工具函数。

## 概述

核心模块的设计目标是：

- **类型统一**：确保 React 和 Vue 版本使用相同的类型系统
- **代码复用**：避免重复实现快捷键解析、匹配等核心逻辑
- **框架无关**：不依赖任何 UI 框架，可在任何 JavaScript/TypeScript 项目中使用
- **类型安全**：完整的 TypeScript 类型定义，零 `any` 类型

## 架构设计

```
┌─────────────────────────────────────┐
│   @keekuun/keymaster-core          │
│   (核心模块 - 框架无关)              │
├─────────────────────────────────────┤
│ • 类型定义 (types.ts)               │
│ • 快捷键解析器 (parser.ts)           │
│ • Electron 支持 (electron.ts)        │
│ • 常量定义 (constants.ts)            │
│ • KeyBindingManager (manager.ts)     │
│ • 工具函数 (manager.ts)              │
└─────────────────────────────────────┘
           │              │
           ▼              ▼
┌─────────────────┐  ┌─────────────────┐
│ keymaster-react │  │  keymaster-vue  │
│  (React Hook)   │  │ (Composition API)│
└─────────────────┘  └─────────────────┘
```

## 核心 API

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

### 快捷键解析

#### `parseShortcut(shortcut: string): ParsedShortcut`

将字符串格式的快捷键解析为结构化对象：

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

const parsed = parseShortcut('ctrl+shift+s');
// 结果: { key: "s", ctrl: true, shift: true, alt: false, meta: false }
```

**支持的格式：**

- `"ctrl+s"` - Ctrl + S
- `"ctrl+shift+z"` - Ctrl + Shift + Z
- `"alt+f4"` - Alt + F4
- `"meta+k"` 或 `"cmd+k"` - Meta/Cmd + K（macOS）

**错误处理：**

- 空字符串会抛出错误
- 缺少主键（只有修饰键）会抛出错误
- 自动转换为小写，忽略大小写差异

### 事件匹配

#### `isMatchingShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean`

判断键盘事件是否匹配解析后的快捷键：

```typescript
import { isMatchingShortcut, parseShortcut } from '@keekuun/keymaster-core';

const parsed = parseShortcut('ctrl+s');
const isMatch = isMatchingShortcut(keyboardEvent, parsed);
```

**匹配规则：**

- 严格匹配所有修饰键状态（Ctrl、Alt、Shift、Meta）
- 主键必须完全匹配（不区分大小写）
- 不支持部分匹配（例如 `ctrl+s` 不会匹配 `ctrl+shift+s`）

### 作用域检查

#### `isEventInScope(event: KeyboardEvent, scopedElement: HTMLElement): boolean`

检查事件是否发生在作用域元素内（包括元素本身及其子元素）：

```typescript
import { isEventInScope } from '@keekuun/keymaster-core';

const editorElement = document.getElementById('editor');
const isInScope = isEventInScope(keyboardEvent, editorElement);
```

**使用场景：**

- 编辑器快捷键：只在编辑器区域内生效
- 对话框快捷键：只在对话框内生效
- 避免全局快捷键冲突

### Electron 支持

#### `isElectronEnvironment(): boolean`

检测当前是否在 Electron 环境中：

```typescript
import { isElectronEnvironment } from '@keekuun/keymaster-core';

if (isElectronEnvironment()) {
  console.log('运行在 Electron 渲染进程中');
}
```

#### `getElectronProcessInfo(): ElectronWindow["process"] | null`

获取 Electron 进程信息（如果可用）：

```typescript
import { getElectronProcessInfo } from '@keekuun/keymaster-core';

const processInfo = getElectronProcessInfo();
if (processInfo) {
  console.log('进程类型:', processInfo.type); // "renderer" 或 "main"
  console.log('Electron 版本:', processInfo.versions?.electron);
}
```

### KeyBindingManager

`KeyBindingManager` 类允许你管理一组相关的快捷键绑定。它是框架无关的，可以在任何 JavaScript/TypeScript 项目中独立使用。

**注意**：要使用 `KeyBindingManager`，你需要提供一个注册函数，该函数匹配你的框架或自定义实现。

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

#### API

- `register(shortcut, handler, options?)`: 注册一个快捷键绑定，返回 `this` 以支持链式调用
- `dispose()`: 清理所有已注册的绑定
- `getBindingCount()`: 获取当前已注册的绑定数量

### 工具函数

#### `isValidShortcut(shortcut: string): boolean`

检查快捷键字符串格式是否有效：

```typescript
import { isValidShortcut } from '@keekuun/keymaster-core';

isValidShortcut('ctrl+s'); // true
isValidShortcut('invalid'); // false
isValidShortcut('ctrl'); // false (缺少主键)
```

#### `formatShortcut(shortcut: string): string`

格式化快捷键字符串（统一大小写和空格）：

```typescript
import { formatShortcut } from '@keekuun/keymaster-core';

formatShortcut('Ctrl+S'); // 'ctrl+s'
formatShortcut('ctrl + shift + z'); // 'ctrl+shift+z'
```

## 构建格式

核心包支持多种构建格式，适用于不同的使用场景：

- **ES Module** (`dist/index.js`): 适用于现代打包工具（Vite、Webpack、Rollup）和 ES 模块环境
- **CommonJS** (`dist/index.cjs`): 适用于 Node.js 和 CommonJS 环境
- **UMD** (`dist/index.umd.js`): 适用于浏览器 `<script>` 标签和 CDN 使用

> **重要提示**：UMD 格式**仅适用于 `@keekuun/keymaster-core`**。React 和 Vue 包（`@keekuun/keymaster-react` 和 `@keekuun/keymaster-vue`）不提供 UMD 构建，因为它们需要框架环境（React/Vue），通常与现代打包工具一起使用。

### 使用 UMD 构建（仅核心包）

你可以直接在浏览器中使用 UMD 构建，无需任何打包工具：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Keymaster Core UMD 示例</title>
  </head>
  <body>
    <!-- 通过 unpkg CDN 加载 -->
    <script src="https://unpkg.com/@keekuun/keymaster-core/dist/index.umd.js"></script>
    <!-- 或通过 jsdelivr CDN -->
    <!-- <script src="https://cdn.jsdelivr.net/npm/@keekuun/keymaster-core/dist/index.umd.js"></script> -->

    <script>
      // 通过全局变量 KeymasterCore 访问
      const { KeyBindingManager, parseShortcut, isValidShortcut, formatShortcut } = KeymasterCore;

      // 使用 KeyBindingManager - 无需提供注册函数！
      const manager = new KeyBindingManager();
      manager
        .register('ctrl+s', () => {
          console.log('保存触发');
          alert('保存！');
        })
        .register('ctrl+z', () => {
          console.log('撤销触发');
          alert('撤销！');
        });

      console.log('快捷键已注册。尝试按 Ctrl+S 或 Ctrl+Z');
    </script>
  </body>
</html>
```

**UMD 使用场景：**

- 无需打包工具的快速原型和演示
- 不使用现代打包工具的遗留项目
- 基于 CDN 的部署
- 独立的 JavaScript 应用
- 学习和实验

**限制：**

- 浏览器环境中无法进行 TypeScript 类型检查
- 需要手动管理依赖
- 不推荐用于生产环境的 React/Vue 应用（应使用 npm 包配合打包工具）
- React/Vue 包不提供 UMD 格式

## 使用示例

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

// 使用
const handler = createCustomKeyHandler('ctrl+k', (event) => {
  console.log('Ctrl+K 被按下');
});

window.addEventListener('keydown', handler);
```

### 快捷键验证工具

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

function validateShortcut(shortcut: string): {
  valid: boolean;
  error?: string;
} {
  try {
    parseShortcut(shortcut);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

// 使用
const result = validateShortcut('ctrl+s');
if (result.valid) {
  console.log('快捷键格式正确');
} else {
  console.error('快捷键格式错误:', result.error);
}
```

### 快捷键格式化

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

function formatShortcut(shortcut: string): string {
  try {
    const parsed = parseShortcut(shortcut);
    const parts: string[] = [];

    if (parsed.ctrl) parts.push('Ctrl');
    if (parsed.alt) parts.push('Alt');
    if (parsed.shift) parts.push('Shift');
    if (parsed.meta) parts.push('Meta');
    parts.push(parsed.key.toUpperCase());

    return parts.join(' + ');
  } catch {
    return shortcut;
  }
}

// 使用
console.log(formatShortcut('ctrl+shift+s')); // "Ctrl + Shift + S"
```

## 常量

核心模块导出了所有修饰键常量：

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

// MODIFIERS = ["ctrl", "alt", "shift", "meta", "cmd"]
```

## 设计原则

1. **类型安全**：所有函数和类型都有完整的 TypeScript 类型定义，零 `any` 类型
2. **框架无关**：核心模块不依赖任何 UI 框架（React/Vue），可在任何项目中使用
3. **可扩展性**：为 React 和 Vue 版本提供统一的基础能力，便于后续扩展
4. **零依赖**：核心模块仅依赖浏览器原生 API，无外部依赖

## 版本兼容性

- **TypeScript**: ^5.0.0
- **浏览器**: 支持所有现代浏览器（ES2020+）
- **Node.js**: 不适用（浏览器环境专用）

## 相关链接

- React 版本文档：[📖](/zh/react/)
- Vue 版本文档：[📖](/zh/vue/)
- GitHub 仓库：[https://github.com/Keekuun/keymaster](https://github.com/Keekuun/keymaster)
- npm 包：[https://www.npmjs.com/package/@keekuun/keymaster-core](https://www.npmjs.com/package/@keekuun/keymaster-core)
