# @keekuun/keymaster-react

### 🌐 Language

- [English](README.md) (current)
- [中文](README.zh.md)

React version of keymaster keyboard shortcut library, helping you elegantly bind keyboard shortcuts in components through Hooks.

## Features

- Bind shortcuts with one line of code using `useKeyBinding`
- Support for key combinations (e.g., `ctrl+s`, `ctrl+shift+z`)
- Default listens to `window`'s `keydown` event, simple to use
- **Scoped Shortcuts**: Support binding shortcuts within specific element scopes (`scopedElement`)
- **Editor Mode**: Automatically handles shortcut conflicts in editor scenarios
- **Electron Mode**: Adapts to special requirements of Electron applications
- Complete TypeScript type hints

## Installation

```bash
npm install @keekuun/keymaster-react
# or
pnpm add @keekuun/keymaster-react
```

## Quick Start

```tsx
import React from 'react';
import { useKeyBinding } from '@keekuun/keymaster-react';

function Editor() {
  useKeyBinding(
    'ctrl+s',
    () => {
      // Execute save logic here, e.g., call API / update local state
      console.log('Saved successfully');
    },
    { preventDefault: true }, // Prevent browser's default save page behavior
  );

  return <textarea placeholder="Type here, then press Ctrl+S to save"></textarea>;
}

export default Editor;
```

## Advanced Features

### Scoped Shortcuts

Bind shortcuts to specific element scopes, suitable for editors, dialogs, etc.:

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

### Editor Mode

Automatically handles shortcut conflicts in editor scenarios:

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

### Electron Mode

Adapt for Electron applications:

```tsx
import { useElectronKeyBinding } from '@keekuun/keymaster-react';

useElectronKeyBinding('ctrl+alt+r', () => {
  window.location.reload();
});
```

## API Overview

### `useKeyBinding(shortcut, handler, options?)`

- **`shortcut`**: `string`  
  Shortcut string, e.g., `"ctrl+s"`, `"ctrl+shift+z"`.
- **`handler`**: `(event: KeyboardEvent) => void`  
  Callback triggered when matching shortcut is detected.
- **`options`**: `KeymasterBindingOptions` (optional)
  - `preventDefault?: boolean` - Whether to call `event.preventDefault()` after trigger
  - `stopPropagation?: boolean` - Whether to call `event.stopPropagation()` after trigger
  - `scopedElement?: HTMLElement | null` - Scoped element, shortcut only works within element
  - `editorMode?: boolean` - Editor mode, automatically handles shortcut conflicts
  - `electronMode?: boolean` - Electron mode, adapts for Electron applications

### `registerKeyBinding(shortcut, handler, options?)`

Low-level general registration function (non-Hook), returns a function to unbind:

```ts
import { registerKeyBinding } from '@keekuun/keymaster-react';

const dispose = registerKeyBinding(
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

- React Documentation & Demo: [https://keymaster-docs.vercel.app/react/](https://keymaster-docs.vercel.app/react/)
