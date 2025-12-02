# Vue Quick Start

<VersionBanner />

This guide shows how to use <code>@keekuun/keymaster-vue</code> to register keyboard shortcuts in Vue projects, with basic examples.

## Installation

> 💡 **Version Notice**: The documentation shows the latest version (<VersionText />). If you need a specific version, check the [Version Management](/versions) documentation or [all versions on npm](https://www.npmjs.com/package/@keekuun/keymaster-vue?activeTab=versions).

### Install Latest Version

```bash
npm install @keekuun/keymaster-vue
# or
pnpm add @keekuun/keymaster-vue
```

### Install Specific Version

If you need a specific version (e.g., `0.1.0`), specify the version:

```bash
npm install @keekuun/keymaster-vue@0.1.0
# or
pnpm add @keekuun/keymaster-vue@0.1.0
```

> ⚠️ **Note**: If using an older version, some APIs in the documentation may not be available. Check the README for that version (on the npm package page) or the [Version Management](/versions) documentation.

## Basic Example: Save Shortcut `Ctrl+S`

The following example uses `<script setup>` syntax to bind save logic to `Ctrl+S` in a component:

```vue
<template>
  <textarea placeholder="Type here, then press Ctrl+S to save" />
</template>

<script setup lang="ts">
import { useKeyBindingVue } from '@keekuun/keymaster-vue';

function onSave() {
  // Execute save logic here, e.g., call API / update local state
  console.log('Saved successfully');
}

useKeyBindingVue(
  'ctrl+s',
  () => {
    onSave();
  },
  { preventDefault: true }, // Prevent browser's default save page behavior
);
</script>
```

Place this component in your Vue application, then press `Ctrl+S` in the browser to verify that the `onSave` logic is triggered correctly.

## Multiple Shortcuts

You can also bind multiple shortcuts in the same component:

```vue
<script setup lang="ts">
import { useKeyBindingVue } from '@keekuun/keymaster-vue';

useKeyBindingVue(
  'ctrl+s',
  () => {
    saveContent();
  },
  { preventDefault: true },
);

useKeyBindingVue('ctrl+z', () => {
  undo();
});

useKeyBindingVue('ctrl+shift+z', () => {
  redo();
});
</script>
```

## Advanced APIs

### Scoped Shortcuts (scopedElement)

When you need to bind shortcuts within a specific element scope (e.g., editors, dialogs), you can use the `scopedElement` option:

```vue
<template>
  <textarea ref="editorRef" placeholder="Press Ctrl+S to save" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useKeyBindingVue } from '@keekuun/keymaster-vue';

const editorRef = ref<HTMLTextAreaElement | null>(null);

// Only works within the editor area
useKeyBindingVue(
  'ctrl+s',
  () => {
    console.log('Save editor content');
  },
  {
    scopedElement: editorRef.value,
    preventDefault: true,
  },
);
</script>
```

Or use the convenient `useScopedKeyBindingVue` Composition API:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useScopedKeyBindingVue } from '@keekuun/keymaster-vue';

const containerRef = ref<HTMLDivElement | null>(null);
useScopedKeyBindingVue(
  'ctrl+k',
  () => {
    console.log('Only works within container');
  },
  containerRef,
);
</script>
```

### Editor Mode

Editor mode automatically handles common shortcut conflicts, especially suitable for code editors, rich text editors, and similar scenarios:

```vue
<template>
  <textarea ref="editorRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEditorKeyBindingVue } from '@keekuun/keymaster-vue';

const editorRef = ref<HTMLTextAreaElement | null>(null);

// Editor mode automatically prevents default behavior
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

### Electron Mode

In Electron applications, you can use `useElectronKeyBindingVue` to adapt shortcut coordination between the main process and renderer process:

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

#### Electron Hook (`electronHook`)

You can also use `electronHook` in Vue to intercept or extend Electron behavior:

```ts
useElectronKeyBindingVue('ctrl+alt+r', handler, {
  electronHook: ({ event, parsed, processInfo, versions }) => {
    // custom logging / monitoring
    return true;
  },
});
```

### Shortcut Combination Management

Use `KeyBindingManager` to manage a group of related shortcut bindings:

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { createKeyBindingManager, isValidShortcut, formatShortcut } from '@keekuun/keymaster-vue';

let manager: ReturnType<typeof createKeyBindingManager> | null = null;

onMounted(() => {
  manager = createKeyBindingManager();

  // Chain register multiple shortcuts
  manager
    .register('ctrl+s', () => save(), { preventDefault: true })
    .register('ctrl+z', () => undo())
    .register('ctrl+shift+z', () => redo());
});

onBeforeUnmount(() => {
  // Automatically clean up all bindings when component unmounts
  manager?.dispose();
});
</script>
```

Utility functions:

- `isValidShortcut(shortcut)`: Check if shortcut format is valid
- `formatShortcut(shortcut)`: Format shortcut string (normalize case)

## Interactive Demo

You can directly experience the shortcut effects on the documentation site:

<VueShortcutDemo />

After focusing the page in the browser window, try pressing `Ctrl+S` or `Ctrl+Z`. The demo above will display the recently captured shortcuts in real-time. This way you don't need to create a separate project to quickly confirm whether `@keekuun/keymaster-vue`'s behavior meets your expectations.

## API Overview

### `useKeyBindingVue(shortcut, handler, options?)`

- **`shortcut`**: `string` - Shortcut string, e.g., `"ctrl+s"`, `"ctrl+shift+z"`
- **`handler`**: `(event: KeyboardEvent) => void` - Callback triggered when matching shortcut is detected
- **`options`**: `KeymasterVueBindingOptions` (optional)
  - `preventDefault?: boolean` - Whether to call `event.preventDefault()` after trigger
  - `stopPropagation?: boolean` - Whether to call `event.stopPropagation()` after trigger
  - `scopedElement?: HTMLElement | null` - Scoped element, shortcut only works within element
  - `editorMode?: boolean` - Editor mode, automatically handles shortcut conflicts
  - `electronMode?: boolean` - Electron mode, adapts for Electron applications

## Documentation & Examples

For more interactive demos, usage scenarios, and design recommendations, visit the documentation site:

- Vue Documentation & Demo: [https://keymaster-docs.vercel.app/vue/](https://keymaster-docs.vercel.app/vue/)
