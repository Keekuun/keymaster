# @keekuun/keymaster-vue

Vue 3 version of keymaster keyboard shortcut library, providing Composition API wrappers for common shortcut scenarios (save, undo, list operations, etc.).

## Features

- `useKeyBindingVue` based on Vue 3 Composition API
- Support for key combinations (e.g., `ctrl+s`, `ctrl+shift+z`)
- Default listens to `window`'s `keydown` event
- **Scoped Shortcuts**: Support binding shortcuts within specific element scopes (`scopedElement`)
- **Editor Mode**: Automatically handles shortcut conflicts in editor scenarios
- **Electron Mode**: Adapts to special requirements of Electron applications
- Complete TypeScript type hints

## Installation

```bash
npm install @keekuun/keymaster-vue
# or
pnpm add @keekuun/keymaster-vue
```

## Quick Start

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

## Advanced Features

### Scoped Shortcuts

Bind shortcuts to specific element scopes, suitable for editors, dialogs, etc.:

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

### Editor Mode

Automatically handles shortcut conflicts in editor scenarios:

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

### Electron Mode

Adapt for Electron applications:

```vue
<script setup lang="ts">
import { useElectronKeyBindingVue } from '@keekuun/keymaster-vue';

useElectronKeyBindingVue('ctrl+alt+r', () => {
  window.location.reload();
});
</script>
```

## API Overview

### `useKeyBindingVue(shortcut, handler, options?)`

- **`shortcut`**: `string`  
  Shortcut string, e.g., `"ctrl+s"`, `"ctrl+shift+z"`.
- **`handler`**: `(event: KeyboardEvent) => void`  
  Callback triggered when matching shortcut is detected.
- **`options`**: `KeymasterVueBindingOptions` (optional)
  - `preventDefault?: boolean` - Whether to call `event.preventDefault()` after trigger
  - `stopPropagation?: boolean` - Whether to call `event.stopPropagation()` after trigger
  - `scopedElement?: HTMLElement | null` - Scoped element, shortcut only works within element
  - `editorMode?: boolean` - Editor mode, automatically handles shortcut conflicts
  - `electronMode?: boolean` - Electron mode, adapts for Electron applications

### `registerVueKeyBinding(shortcut, handler, options?)`

Low-level general registration function (non-Composition API), returns a function to unbind:

```ts
import { registerVueKeyBinding } from '@keekuun/keymaster-vue';

const dispose = registerVueKeyBinding(
  'ctrl+s',
  (event) => {
    console.log('Saved successfully');
  },
  { preventDefault: true },
);

// Manually unbind when needed
dispose();
```

## Documentation & Examples

For more interactive demos, usage scenarios, and design recommendations, visit the documentation site:

- Vue Documentation & Demo: [https://keymaster-docs.vercel.app/vue/](https://keymaster-docs.vercel.app/vue/)

---

### 🌐 Language

- [English](README.md) (current)
- [中文](README.zh.md)
