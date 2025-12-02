# @keekuun/keymaster-vue

Vue 3 版 keymaster 键盘快捷键库，为常见快捷键场景（保存、撤销、列表操作等）提供组合式 API 封装。

## 特性

- 基于 Vue 3 组合式 API 的 `useKeyBindingVue`
- 支持组合快捷键（如 `ctrl+s`、`ctrl+shift+z`）
- 默认监听 `window` 的 `keydown` 事件
- **作用域快捷键**：支持在特定元素范围内绑定快捷键（`scopedElement`）
- **编辑器模式**：自动处理编辑器场景的快捷键冲突
- **Electron 模式**：适配 Electron 应用的特殊需求
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
import { useKeyBindingVue } from '@keekuun/keymaster-vue';

function onSave() {
  // 在这里执行保存逻辑，例如：调接口 / 更新本地状态
  console.log('保存成功');
}

useKeyBindingVue(
  'ctrl+s',
  () => {
    onSave();
  },
  { preventDefault: true }, // 阻止浏览器默认的保存页面行为
);
</script>
```

## 高级功能

### 作用域快捷键

在特定元素范围内绑定快捷键，适用于编辑器、对话框等场景：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useScopedKeyBindingVue } from '@keekuun/keymaster-vue';

const editorRef = ref<HTMLTextAreaElement | null>(null);
useScopedKeyBindingVue(
  'ctrl+s',
  () => {
    saveContent();
  },
  editorRef,
);
</script>
```

### 编辑器模式

自动处理编辑器场景的快捷键冲突：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useEditorKeyBindingVue } from '@keekuun/keymaster-vue';

const editorRef = ref<HTMLTextAreaElement | null>(null);
useEditorKeyBindingVue(
  'ctrl+s',
  () => {
    saveCode();
  },
  editorRef.value,
);
</script>
```

### Electron 模式

适配 Electron 应用：

```vue
<script setup lang="ts">
import { useElectronKeyBindingVue } from '@keekuun/keymaster-vue';

useElectronKeyBindingVue('ctrl+alt+r', () => {
  window.location.reload();
});
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
  - `scopedElement?: HTMLElement | null` 作用域元素，快捷键仅在元素内生效
  - `editorMode?: boolean` 编辑器模式，自动处理快捷键冲突
  - `electronMode?: boolean` Electron 模式，适配 Electron 应用

### `registerVueKeyBinding(shortcut, handler, options?)`

底层的通用注册函数（非组合式 API），返回一个取消绑定的函数：

```ts
import { registerVueKeyBinding } from '@keekuun/keymaster-vue';

const dispose = registerVueKeyBinding(
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

- Vue 文档与 Demo：[https://keymaster-docs.vercel.app/vue/](https://keymaster-docs.vercel.app/vue/)
