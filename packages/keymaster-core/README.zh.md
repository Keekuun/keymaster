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

## 设计原则

1. **类型安全**：所有函数和类型都有完整的 TypeScript 类型定义
2. **框架无关**：核心模块不依赖任何 UI 框架（React/Vue）
3. **可扩展性**：为 React 和 Vue 版本提供统一的基础能力
4. **零依赖**：核心模块仅依赖浏览器原生 API

## 版本兼容性

- TypeScript: ^5.0.0
- 浏览器: 支持所有现代浏览器（ES2020+）

## 相关链接

- React 版本：`@keekuun/keymaster-react`
- Vue 版本：`@keekuun/keymaster-vue`
- 文档站点：[https://keymaster-docs.vercel.app/zh/core/](https://keymaster-docs.vercel.app/zh/core/)
- GitHub 仓库：[https://github.com/Keekuun/keymaster](https://github.com/Keekuun/keymaster)
