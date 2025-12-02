# React 版 keymaster 快速开始

<VersionBanner />

这里介绍如何在 React 项目中使用 <code>@keekuun/keymaster-react</code> 注册键盘快捷键，并给出基础示例。

## 安装

> 💡 **版本提示**：文档显示的是最新版本（<VersionText />）。如果你需要使用特定版本，请查看 [版本管理文档](/versions) 或 [npm 上的所有版本](https://www.npmjs.com/package/@keekuun/keymaster-react?activeTab=versions)。

### 安装最新版本

```bash
npm install @keekuun/keymaster-react
# 或者
pnpm add @keekuun/keymaster-react
```

### 安装特定版本

如果你需要使用特定版本（例如 `0.1.0`），可以指定版本号：

```bash
npm install @keekuun/keymaster-react@0.1.0
# 或者
pnpm add @keekuun/keymaster-react@0.1.0
```

> ⚠️ **注意**：如果使用旧版本，文档中的某些 API 可能不可用。建议查看对应版本的 README（在 npm 包页面）或 [版本管理文档](/versions)。

## 基础示例：保存快捷键 `Ctrl+S`

下面的示例展示如何在编辑器组件中为 `Ctrl+S` 绑定保存逻辑：

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

要在你的应用中验证行为，只需要把 `Editor` 组件挂载到页面上，然后在浏览器中按下 `Ctrl+S`，观察控制台输出或你的实际保存逻辑是否被触发。

## 多个快捷键示例

你也可以在同一个组件中多次调用 `useKeyBinding`，为不同快捷键绑定不同行为：

```tsx
useKeyBinding('ctrl+s', onSave, { preventDefault: true });
useKeyBinding('ctrl+z', onUndo);
useKeyBinding('ctrl+shift+z', onRedo);
```

## 高级 API

### 作用域快捷键（scopedElement）

当你需要在特定元素范围内绑定快捷键时（例如编辑器、对话框），可以使用 `scopedElement` 选项：

```tsx
import React, { useRef } from 'react';
import { useKeyBinding } from '@keekuun/keymaster-react';

function Editor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 只在编辑器区域内生效
  useKeyBinding(
    'ctrl+s',
    () => {
      console.log('保存编辑器内容');
    },
    {
      scopedElement: editorRef.current,
      preventDefault: true,
    },
  );

  return <textarea ref={editorRef} placeholder="按 Ctrl+S 保存" />;
}
```

或者使用便捷的 `useScopedKeyBinding` Hook：

```tsx
import { useScopedKeyBinding } from '@keekuun/keymaster-react';

const containerRef = useRef<HTMLDivElement>(null);
useScopedKeyBinding(
  'ctrl+k',
  () => {
    console.log('只在容器内生效');
  },
  containerRef,
);
```

### 编辑器模式

编辑器模式会自动处理常见的快捷键冲突，特别适合代码编辑器、富文本编辑器等场景：

```tsx
import { useEditorKeyBinding } from '@keekuun/keymaster-react';

function CodeEditor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 编辑器模式会自动阻止默认行为
  useEditorKeyBinding(
    'ctrl+s',
    () => {
      saveCode();
    },
    editorRef.current,
  );

  useEditorKeyBinding(
    'ctrl+z',
    () => {
      undo();
    },
    editorRef.current,
  );

  return <textarea ref={editorRef} />;
}
```

### Electron 模式

在 Electron 应用中，可以使用 `useElectronKeyBinding` 来适配主进程与渲染进程的快捷键协调：

```tsx
import { useElectronKeyBinding } from '@keekuun/keymaster-react';

function ElectronApp() {
  // Electron 模式会自动处理渲染进程的特殊行为
  useElectronKeyBinding('ctrl+alt+r', () => {
    // 重新加载窗口
    window.location.reload();
  });

  return <div>Electron App</div>;
}
```

### 快捷键组合管理

使用 `KeyBindingManager` 管理一组相关的快捷键绑定：

```tsx
import { useEffect } from 'react';
import { createKeyBindingManager, isValidShortcut, formatShortcut } from '@keekuun/keymaster-react';

function Editor() {
  useEffect(() => {
    const manager = createKeyBindingManager();

    // 链式注册多个快捷键
    manager
      .register('ctrl+s', () => save(), { preventDefault: true })
      .register('ctrl+z', () => undo())
      .register('ctrl+shift+z', () => redo());

    // 组件卸载时自动清理所有绑定
    return () => manager.dispose();
  }, []);

  return <textarea />;
}
```

工具函数：

- `isValidShortcut(shortcut)`: 检查快捷键格式是否有效
- `formatShortcut(shortcut)`: 格式化快捷键字符串（统一大小写）

## 交互 Demo

如果你只是想快速体验效果，而不想立刻创建 React 工程，可以在文档站点中直接试一试：

<ReactShortcutDemo />

将页面聚焦在浏览器窗口内后，尝试按下 `Ctrl+S` 或 `Ctrl+Z`，上方 Demo 会实时展示最近捕获到的快捷键，逻辑底层使用的就是 `@keekuun/keymaster-react` 的 `registerKeyBinding`。这样可以帮助你确认库的行为是否符合预期，再决定如何在自己的 React 项目中集成。
