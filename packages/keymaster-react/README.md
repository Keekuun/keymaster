# @keekuun/keymaster-react

React 版 keymaster 键盘快捷键库，通过 Hook 帮助你在组件中优雅地绑定键盘快捷键。

## 特性

- 使用 `useKeyBinding` 一行代码绑定快捷键
- 支持组合快捷键（如 `ctrl+s`、`ctrl+shift+z`）
- 默认监听 `window` 的 `keydown` 事件，使用简单
- **作用域快捷键**：支持在特定元素范围内绑定快捷键（`scopedElement`）
- **编辑器模式**：自动处理编辑器场景的快捷键冲突
- **Electron 模式**：适配 Electron 应用的特殊需求
- TypeScript 完整类型提示

## 安装

```bash
npm install @keekuun/keymaster-react
# 或者
pnpm add @keekuun/keymaster-react
```

## 快速开始

```tsx
import React from 'react';
import { useKeyBinding } from '@keekuun/keymaster-react';

function Editor() {
  useKeyBinding(
    'ctrl+s',
    () => {
      // 在这里执行保存逻辑，例如：调接口 / 更新本地状态
      console.log('保存成功');
    },
    { preventDefault: true }, // 阻止浏览器默认的保存页面行为
  );

  return <textarea placeholder="在这里输入内容，然后按 Ctrl+S 触发保存"></textarea>;
}

export default Editor;
```

## 高级功能

### 作用域快捷键

在特定元素范围内绑定快捷键，适用于编辑器、对话框等场景：

```tsx
import { useScopedKeyBinding } from '@keekuun/keymaster-react';

const editorRef = useRef<HTMLTextAreaElement>(null);
useScopedKeyBinding(
  'ctrl+s',
  () => {
    saveContent();
  },
  editorRef,
);
```

### 编辑器模式

自动处理编辑器场景的快捷键冲突：

```tsx
import { useEditorKeyBinding } from '@keekuun/keymaster-react';

const editorRef = useRef<HTMLTextAreaElement>(null);
useEditorKeyBinding(
  'ctrl+s',
  () => {
    saveCode();
  },
  editorRef.current,
);
```

### Electron 模式

适配 Electron 应用：

```tsx
import { useElectronKeyBinding } from '@keekuun/keymaster-react';

useElectronKeyBinding('ctrl+alt+r', () => {
  window.location.reload();
});
```

## API 概览

### `useKeyBinding(shortcut, handler, options?)`

- **`shortcut`**: `string`  
  快捷键字符串，例如 `"ctrl+s"`、`"ctrl+shift+z"`。
- **`handler`**: `(event: KeyboardEvent) => void`  
  当捕获到匹配的快捷键时触发的回调。
- **`options`**: `KeymasterBindingOptions`（可选）
  - `preventDefault?: boolean` 是否在触发后调用 `event.preventDefault()`
  - `stopPropagation?: boolean` 是否在触发后调用 `event.stopPropagation()`
  - `scopedElement?: HTMLElement | null` 作用域元素，快捷键仅在元素内生效
  - `editorMode?: boolean` 编辑器模式，自动处理快捷键冲突
  - `electronMode?: boolean` Electron 模式，适配 Electron 应用

### `registerKeyBinding(shortcut, handler, options?)`

底层的通用注册函数（非 Hook），返回一个取消绑定的函数：

```ts
import { registerKeyBinding } from '@keekuun/keymaster-react';

const dispose = registerKeyBinding(
  'ctrl+s',
  (event) => {
    console.log('保存成功');
  },
  { preventDefault: true },
);

// 需要时手动解绑
dispose();
```

## 文档与示例

更多交互 Demo、使用场景与设计建议请访问文档站点：

- React 文档与 Demo：[https://keymaster-docs.vercel.app/react/](https://keymaster-docs.vercel.app/react/)
