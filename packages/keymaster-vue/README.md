# @keekuun/keymaster-vue

Vue 3 版 keymaster 键盘快捷键库，为常见快捷键场景（保存、撤销、列表操作等）提供组合式 API 封装。

## 特性

- 基于 Vue 3 组合式 API 的 `useKeyBindingVue`
- 支持组合快捷键（如 `ctrl+s`、`ctrl+shift+z`）
- 默认监听 `window` 的 `keydown` 事件
- TypeScript 完整类型提示

## 安装

```bash
npm install @keekuun/keymaster-vue
# 或者
pnpm add @keekuun/keymaster-vue
```

## 快速开始

```vue
<template>
  <textarea placeholder="在这里输入内容，然后按 Ctrl+S 触发保存" />
</template>

<script setup lang="ts">
import { useKeyBindingVue } from "@keekuun/keymaster-vue";

function onSave() {
  // 在这里执行保存逻辑，例如：调接口 / 更新本地状态
  console.log("保存成功");
}

useKeyBindingVue(
  "ctrl+s",
  () => {
    onSave();
  },
  { preventDefault: true } // 阻止浏览器默认的保存页面行为
);
</script>
```

## API 概览

### `useKeyBindingVue(shortcut, handler, options?)`

- **`shortcut`**: `string`  
  快捷键字符串，例如 `"ctrl+s"`、`"ctrl+shift+z"`。
- **`handler`**: `(event: KeyboardEvent) => void`  
  当捕获到匹配的快捷键时触发的回调。
- **`options`**: `KeymasterVueBindingOptions`（可选）
  - `preventDefault?: boolean` 是否在触发后调用 `event.preventDefault()`  
  - `stopPropagation?: boolean` 是否在触发后调用 `event.stopPropagation()`

### `registerVueKeyBinding(shortcut, handler, options?)`

底层的通用注册函数（非组合式 API），返回一个取消绑定的函数：

```ts
import { registerVueKeyBinding } from "@keekuun/keymaster-vue";

const dispose = registerVueKeyBinding("ctrl+s", (event) => {
  console.log("保存成功");
}, { preventDefault: true });

// 需要时手动解绑
dispose();
```

## 文档与示例

更多交互 Demo、使用场景与设计建议请访问文档站点：

- Vue 文档与 Demo：`https://keymaster-docs.vercel.app/vue/`
