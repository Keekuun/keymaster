# React 版 keymaster 快速开始

这里介绍如何在 React 项目中使用 `@keekuun/keymaster-react` 注册键盘快捷键，并给出基础示例。

## 安装

```bash
npm install @keekuun/keymaster-react
# 或者
pnpm add @keekuun/keymaster-react
```

## 基础示例：保存快捷键 `Ctrl+S`

下面的示例展示如何在编辑器组件中为 `Ctrl+S` 绑定保存逻辑：

```tsx
import React from "react";
import { useKeyBinding } from "@keekuun/keymaster-react";

function Editor() {
  useKeyBinding(
    "ctrl+s",
    () => {
      // 在这里执行保存逻辑，例如：调接口 / 更新本地状态
      console.log("保存成功");
    },
    { preventDefault: true } // 阻止浏览器默认的保存页面行为
  );

  return <textarea placeholder="在这里输入内容，然后按 Ctrl+S 触发保存"></textarea>;
}

export default Editor;
```

要在你的应用中验证行为，只需要把 `Editor` 组件挂载到页面上，然后在浏览器中按下 `Ctrl+S`，观察控制台输出或你的实际保存逻辑是否被触发。

## 多个快捷键示例

你也可以在同一个组件中多次调用 `useKeyBinding`，为不同快捷键绑定不同行为：

```tsx
useKeyBinding("ctrl+s", onSave, { preventDefault: true });
useKeyBinding("ctrl+z", onUndo);
useKeyBinding("ctrl+shift+z", onRedo);
```

