# Vue 版 keymaster 快速开始

这里介绍如何在 Vue 项目中使用 `@keekuun/keymaster-vue` 注册键盘快捷键，并给出基础示例。

## 安装

```bash
npm install @keekuun/keymaster-vue
# 或者
pnpm add @keekuun/keymaster-vue
```

## 基础示例：保存快捷键 `Ctrl+S`

下面示例基于 `<script setup>` 语法，在组件中为 `Ctrl+S` 绑定保存逻辑：

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

把该组件放到你的 Vue 应用中，然后在浏览器中按下 `Ctrl+S`，即可验证是否正确触发 `onSave` 逻辑。

## 多个快捷键示例

同样可以在一个组件中绑定多个快捷键：

```ts
useKeyBindingVue("ctrl+s", onSave, { preventDefault: true });
useKeyBindingVue("ctrl+z", onUndo);
useKeyBindingVue("ctrl+shift+z", onRedo);
```

