# React Quick Start

<VersionBanner />

This guide shows how to use <code>@keekuun/keymaster-react</code> to register keyboard shortcuts in React projects, with basic examples.

## Installation

> 💡 **Version Notice**: The documentation shows the latest version (<VersionText />). If you need a specific version, check the [Version Management](/versions) documentation or [all versions on npm](https://www.npmjs.com/package/@keekuun/keymaster-react?activeTab=versions).

### Install Latest Version

```bash
npm install @keekuun/keymaster-react
# or
pnpm add @keekuun/keymaster-react
```

### Install Specific Version

If you need a specific version (e.g., `0.1.0`), specify the version:

```bash
npm install @keekuun/keymaster-react@0.1.0
# or
pnpm add @keekuun/keymaster-react@0.1.0
```

> ⚠️ **Note**: If using an older version, some APIs in the documentation may not be available. Check the README for that version (on the npm package page) or the [Version Management](/versions) documentation.

## Basic Example: Save Shortcut `Ctrl+S`

The following example shows how to bind save logic to `Ctrl+S` in an editor component:

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

To verify the behavior in your application, simply mount the `Editor` component to the page, then press `Ctrl+S` in the browser to observe the console output or whether your actual save logic is triggered.

## Multiple Shortcuts

You can also call `useKeyBinding` multiple times in the same component to bind different behaviors to different shortcuts:

```tsx
import React from 'react';
import { useKeyBinding } from '@keekuun/keymaster-react';

function Editor() {
  useKeyBinding(
    'ctrl+s',
    () => {
      saveContent();
    },
    { preventDefault: true },
  );

  useKeyBinding('ctrl+z', () => {
    undo();
  });

  useKeyBinding('ctrl+shift+z', () => {
    redo();
  });

  return <textarea />;
}
```

## Advanced APIs

### Scoped Shortcuts (scopedElement)

When you need to bind shortcuts within a specific element scope (e.g., editors, dialogs), you can use the `scopedElement` option:

```tsx
import React, { useRef } from 'react';
import { useKeyBinding } from '@keekuun/keymaster-react';

function Editor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Only works within the editor area
  useKeyBinding(
    'ctrl+s',
    () => {
      console.log('Save editor content');
    },
    {
      scopedElement: editorRef.current,
      preventDefault: true,
    },
  );

  return <textarea ref={editorRef} placeholder="Press Ctrl+S to save" />;
}
```

Or use the convenient `useScopedKeyBinding` Hook:

```tsx
import { useScopedKeyBinding } from '@keekuun/keymaster-react';

const containerRef = useRef<HTMLDivElement>(null);
useScopedKeyBinding(
  'ctrl+k',
  () => {
    console.log('Only works within container');
  },
  containerRef,
);
```

### Editor Mode

Editor mode automatically handles common shortcut conflicts, especially suitable for code editors, rich text editors, and similar scenarios:

```tsx
import { useEditorKeyBinding } from '@keekuun/keymaster-react';

function CodeEditor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Editor mode automatically prevents default behavior
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

### Electron Mode

In Electron applications, you can use `useElectronKeyBinding` to adapt shortcut coordination between the main process and renderer process:

```tsx
import { useElectronKeyBinding } from '@keekuun/keymaster-react';

function ElectronApp() {
  // Electron mode automatically handles special behavior in renderer process
  useElectronKeyBinding('ctrl+alt+r', () => {
    // Reload window
    window.location.reload();
  });

  return <div>Electron App</div>;
}
```

### Shortcut Combination Management

Use `KeyBindingManager` to manage a group of related shortcut bindings:

```tsx
import { useEffect } from 'react';
import { createKeyBindingManager, isValidShortcut, formatShortcut } from '@keekuun/keymaster-react';

function Editor() {
  useEffect(() => {
    const manager = createKeyBindingManager();

    // Chain register multiple shortcuts
    manager
      .register('ctrl+s', () => save(), { preventDefault: true })
      .register('ctrl+z', () => undo())
      .register('ctrl+shift+z', () => redo());

    // Automatically clean up all bindings when component unmounts
    return () => manager.dispose();
  }, []);

  return <textarea />;
}
```

Utility functions:

- `isValidShortcut(shortcut)`: Check if shortcut format is valid
- `formatShortcut(shortcut)`: Format shortcut string (normalize case)

## Interactive Demo

If you just want to quickly experience the effect without immediately creating a React project, you can try it directly on the documentation site:

<ReactShortcutDemo />

After focusing the page in the browser window, try pressing `Ctrl+S` or `Ctrl+Z`. The demo above will display the recently captured shortcuts in real-time. The underlying logic uses `registerKeyBinding` from `@keekuun/keymaster-react`. This helps you confirm whether the library's behavior meets your expectations before deciding how to integrate it into your React project.

## API Overview

### `useKeyBinding(shortcut, handler, options?)`

- **`shortcut`**: `string` - Shortcut string, e.g., `"ctrl+s"`, `"ctrl+shift+z"`
- **`handler`**: `(event: KeyboardEvent) => void` - Callback triggered when matching shortcut is detected
- **`options`**: `KeymasterBindingOptions` (optional)
  - `preventDefault?: boolean` - Whether to call `event.preventDefault()` after trigger
  - `stopPropagation?: boolean` - Whether to call `event.stopPropagation()` after trigger
  - `scopedElement?: HTMLElement | null` - Scoped element, shortcut only works within element
  - `editorMode?: boolean` - Editor mode, automatically handles shortcut conflicts
  - `electronMode?: boolean` - Electron mode, adapts for Electron applications

## Documentation & Examples

For more interactive demos, usage scenarios, and design recommendations, visit the documentation site:

- React Documentation & Demo: [https://keymaster-docs.vercel.app/react/](https://keymaster-docs.vercel.app/react/)
