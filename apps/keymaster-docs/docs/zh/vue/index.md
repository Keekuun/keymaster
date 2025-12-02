# Vue 版 keymaster 快速开始

<VersionBanner />

这里介绍如何在 Vue 项目中使用 <code>@keekuun/keymaster-vue</code> 注册键盘快捷键，并给出基础示例。

## 安装

> 💡 **版本提示**：文档显示的是最新版本（<VersionText />）。如果你需要使用特定版本，请查看 [版本管理文档](/zh/versions) 或 [npm 上的所有版本](https://www.npmjs.com/package/@keekuun/keymaster-vue?activeTab=versions)。

### 安装最新版本

```bash
npm install @keekuun/keymaster-vue
# 或者
pnpm add @keekuun/keymaster-vue
```

### 安装特定版本

如果你需要使用特定版本（例如 `0.1.0`），可以指定版本号：

```bash
npm install @keekuun/keymaster-vue@0.1.0
# 或者
pnpm add @keekuun/keymaster-vue@0.1.0
```

> ⚠️ **注意**：如果使用旧版本，文档中的某些 API 可能不可用。建议查看对应版本的 README（在 npm 包页面）或 [版本管理文档](/zh/versions)。

## 基础示例：保存快捷键 `Ctrl+S`

下面示例基于 `<script setup>` 语法，在组件中为 `Ctrl+S` 绑定保存逻辑：

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

把该组件放到你的 Vue 应用中，然后在浏览器中按下 `Ctrl+S`，即可验证是否正确触发 `onSave` 逻辑。

**试试看：**

<VueShortcutDemo />

## 多个快捷键示例

同样可以在一个组件中绑定多个快捷键：

```ts
useKeyBindingVue('ctrl+s', onSave, { preventDefault: true });
useKeyBindingVue('ctrl+z', onUndo);
useKeyBindingVue('ctrl+shift+z', onRedo);
```

**交互演示：**

<MultipleShortcutsDemo />

## 高级 API

### 作用域快捷键（scopedElement）

当你需要在特定元素范围内绑定快捷键时（例如编辑器、对话框），可以使用 `scopedElement` 选项：

```vue
<template>
  <textarea ref="editorRef" placeholder="按 Ctrl+S 保存" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useKeyBindingVue } from '@keekuun/keymaster-vue';

const editorRef = ref<HTMLTextAreaElement | null>(null);

// 只在编辑器区域内生效
useKeyBindingVue(
  'ctrl+s',
  () => {
    console.log('保存编辑器内容');
  },
  {
    scopedElement: editorRef.value,
    preventDefault: true,
  },
);
</script>
```

或者使用便捷的 `useScopedKeyBindingVue` 组合式 API：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useScopedKeyBindingVue } from '@keekuun/keymaster-vue';

const containerRef = ref<HTMLDivElement | null>(null);
useScopedKeyBindingVue(
  'ctrl+k',
  () => {
    console.log('只在容器内生效');
  },
  containerRef,
);
</script>
```

**交互演示：**

<ScopedShortcutDemo />

### 编辑器模式

编辑器模式会自动处理常见的快捷键冲突，特别适合代码编辑器、富文本编辑器等场景：

```vue
<template>
  <textarea ref="editorRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEditorKeyBindingVue } from '@keekuun/keymaster-vue';

const editorRef = ref<HTMLTextAreaElement | null>(null);

// 编辑器模式会自动阻止默认行为
useEditorKeyBindingVue(
  'ctrl+s',
  () => {
    saveCode();
  },
  editorRef.value,
);

useEditorKeyBindingVue(
  'ctrl+z',
  () => {
    undo();
  },
  editorRef.value,
);
</script>
```

**交互演示：**

<EditorModeDemo />

### Electron 模式

在 Electron 应用中，可以使用 `useElectronKeyBindingVue` 来适配主进程与渲染进程的快捷键协调：

```vue
<script setup lang="ts">
import { useElectronKeyBindingVue } from '@keekuun/keymaster-vue';

useElectronKeyBindingVue(
  'ctrl+alt+r',
  () => {
    window.electron?.ipcRenderer?.send('shortcut:reload');
  },
  {
    electronHook: ({ parsed, processInfo, versions }) => {
      console.log('[vue electron shortcut]', parsed, processInfo, versions);
      return true;
    },
  },
);
</script>
```

#### Electron 钩子（`electronHook`）

同样可以在 Vue 中通过 `electronHook` 做扩展或兜底：

```ts
useElectronKeyBindingVue('ctrl+alt+r', handler, {
  electronHook: ({ event, parsed, processInfo, versions }) => {
    // 统一日志 / 监控
    return true;
  },
});
```

**交互演示：**

<ElectronModeDemo />

### 快捷键组合管理

使用 `KeyBindingManager` 管理一组相关的快捷键绑定：

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { createKeyBindingManager, isValidShortcut, formatShortcut } from '@keekuun/keymaster-vue';

let manager: ReturnType<typeof createKeyBindingManager> | null = null;

onMounted(() => {
  manager = createKeyBindingManager();

  // 链式注册多个快捷键
  manager
    .register('ctrl+s', () => save(), { preventDefault: true })
    .register('ctrl+z', () => undo())
    .register('ctrl+shift+z', () => redo());
});

onBeforeUnmount(() => {
  // 组件卸载时自动清理所有绑定
  manager?.dispose();
});
</script>
```

工具函数：

- `isValidShortcut(shortcut)`: 检查快捷键格式是否有效
- `formatShortcut(shortcut)`: 格式化快捷键字符串（统一大小写）

**交互演示：**

<KeyBindingManagerDemo />
