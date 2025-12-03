# keymaster-core Core Module

<VersionBanner />

> 💡 **Version Notice**: The documentation shows the latest version (<VersionText />). If you're using a different version, check the [Version Management](/versions) documentation or [all versions on npm](https://www.npmjs.com/package/@keekuun/keymaster-core?activeTab=versions).

`@keekuun/keymaster-core` is the core module of keymaster, providing shared type definitions, parsers, and utility functions for React and Vue versions.

## Overview

The core module's design goals are:

- **Type Consistency**: Ensure React and Vue versions use the same type system
- **Code Reuse**: Avoid duplicate implementations of core logic like shortcut parsing and matching
- **Framework Agnostic**: No dependency on any UI framework, usable in any JavaScript/TypeScript project
- **Type Safety**: Complete TypeScript type definitions, zero `any` types

## Architecture

```
┌─────────────────────────────────────┐
│   @keekuun/keymaster-core          │
│   (Core Module - Framework Agnostic)│
├─────────────────────────────────────┤
│ • Type Definitions (types.ts)      │
│ • Shortcut Parser (parser.ts)       │
│ • Electron Support (electron.ts)    │
│ • Constants (constants.ts)          │
│ • KeyBindingManager (manager.ts)    │
│ • Utility Functions (manager.ts)    │
└─────────────────────────────────────┘
           │              │
           ▼              ▼
┌─────────────────┐  ┌─────────────────┐
│ keymaster-react │  │  keymaster-vue  │
│  (React Hook)   │  │ (Composition API)│
└─────────────────┘  └─────────────────┘
```

## Core API

### Type Definitions

#### `KeymasterHandler`

Keyboard event handler function type:

```typescript
type KeymasterHandler = (event: KeyboardEvent) => void;
```

#### `KeymasterBindingOptionsBase`

Base interface for shortcut binding options:

```typescript
interface KeymasterBindingOptionsBase {
  preventDefault?: boolean; // Whether to prevent default behavior
  stopPropagation?: boolean; // Whether to stop event propagation
  scopedElement?: HTMLElement | null; // Scoped element
  editorMode?: boolean; // Editor mode
  electronMode?: boolean; // Electron mode
}
```

#### `ParsedShortcut`

Parsed shortcut structure:

```typescript
interface ParsedShortcut {
  key: string; // Main key (e.g., "s", "enter")
  ctrl: boolean; // Whether Ctrl is pressed
  alt: boolean; // Whether Alt is pressed
  shift: boolean; // Whether Shift is pressed
  meta: boolean; // Whether Meta/Cmd is pressed
}
```

### Shortcut Parsing

#### `parseShortcut(shortcut: string): ParsedShortcut`

Parse a string-format shortcut into a structured object:

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

const parsed = parseShortcut('ctrl+shift+s');
// Result: { key: "s", ctrl: true, shift: true, alt: false, meta: false }
```

**Supported Formats:**

- `"ctrl+s"` - Ctrl + S
- `"ctrl+shift+z"` - Ctrl + Shift + Z
- `"alt+f4"` - Alt + F4
- `"meta+k"` or `"cmd+k"` - Meta/Cmd + K (macOS)

**Error Handling:**

- Empty strings will throw an error
- Missing main key (only modifier keys) will throw an error
- Automatically converts to lowercase, ignoring case differences

### Event Matching

#### `isMatchingShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean`

Determine if a keyboard event matches the parsed shortcut:

```typescript
import { isMatchingShortcut, parseShortcut } from '@keekuun/keymaster-core';

const parsed = parseShortcut('ctrl+s');
const isMatch = isMatchingShortcut(keyboardEvent, parsed);
```

**Matching Rules:**

- Strictly matches all modifier key states (Ctrl, Alt, Shift, Meta)
- Main key must match exactly (case-insensitive)
- Partial matching not supported (e.g., `ctrl+s` will not match `ctrl+shift+s`)

### Scope Checking

#### `isEventInScope(event: KeyboardEvent, scopedElement: HTMLElement): boolean`

Check if an event occurred within a scoped element (including the element itself and its children):

```typescript
import { isEventInScope } from '@keekuun/keymaster-core';

const editorElement = document.getElementById('editor');
const isInScope = isEventInScope(keyboardEvent, editorElement);
```

**Use Cases:**

- Editor shortcuts: Only work within the editor area
- Dialog shortcuts: Only work within the dialog
- Avoid global shortcut conflicts

### Electron Support

#### `isElectronEnvironment(): boolean`

Detect if currently running in an Electron environment:

```typescript
import { isElectronEnvironment } from '@keekuun/keymaster-core';

if (isElectronEnvironment()) {
  console.log('Running in Electron renderer process');
}
```

#### `isElectronRenderer(): boolean`

Alias of `isElectronEnvironment` with clearer naming:

```typescript
import { isElectronRenderer } from '@keekuun/keymaster-core';

if (isElectronRenderer()) {
  // Safe to run renderer-specific Electron logic here
}
```

#### `getElectronProcessInfo(): ElectronWindow["process"] | null`

Get Electron process information (if available):

```typescript
import { getElectronProcessInfo } from '@keekuun/keymaster-core';

const processInfo = getElectronProcessInfo();
if (processInfo) {
  console.log('Process type:', processInfo.type); // "renderer" or "main"
  console.log('Electron version:', processInfo.versions?.electron);
}
```

#### `getElectronVersions(): { electron?: string; node?: string; chrome?: string } | null`

Get version information from `process.versions`:

```typescript
import { getElectronVersions } from '@keekuun/keymaster-core';

const versions = getElectronVersions();
// { electron: '30.0.0', node: '20.0.0', chrome: '124.0.0' }
```

### KeyBindingManager

The `KeyBindingManager` class allows you to manage a group of related shortcut bindings. It's framework-agnostic and can be used independently in any JavaScript/TypeScript project.

**Note**: To use `KeyBindingManager`, you need to provide a registration function that matches your framework or custom implementation.

#### Basic Usage

```typescript
import { KeyBindingManager } from '@keekuun/keymaster-core';

// Create manager instance - no registration function needed!
const manager = new KeyBindingManager();

// Chain register multiple shortcuts
manager
  .register('ctrl+s', () => console.log('Save'))
  .register('ctrl+z', () => console.log('Undo'))
  .register('ctrl+shift+z', () => console.log('Redo'));

// Clean up all bindings
manager.dispose();
```

#### Advanced Usage with Options

```typescript
import { KeyBindingManager } from '@keekuun/keymaster-core';

const manager = new KeyBindingManager();

// Register with options (scoped element, prevent default, etc.)
const editorElement = document.getElementById('editor');
manager
  .register('ctrl+s', () => console.log('Save'), {
    scopedElement: editorElement,
    preventDefault: true,
  })
  .register('ctrl+k', () => console.log('Search'), {
    scopedElement: editorElement,
    preventDefault: true,
    stopPropagation: true,
  });
```

#### Custom Registration Function (Optional)

If you want to use a custom registration function (e.g., from React/Vue packages), you can pass it as a parameter:

```typescript
import { KeyBindingManager } from '@keekuun/keymaster-core';
import { registerKeyBinding } from '@keekuun/keymaster-react';

// Use React's registration function for better framework integration
const manager = new KeyBindingManager(registerKeyBinding);
manager.register('ctrl+s', () => console.log('Save')).register('ctrl+z', () => console.log('Undo'));
```

#### Using with React/Vue

When using with React or Vue, you can use the framework-specific `createKeyBindingManager`:

```typescript
// React
import { createKeyBindingManager } from '@keekuun/keymaster-react';
const manager = createKeyBindingManager();

// Vue
import { createKeyBindingManager } from '@keekuun/keymaster-vue';
const manager = createKeyBindingManager();
```

#### API

- `register(shortcut, handler, options?)`: Register a shortcut binding, returns `this` for chaining
- `dispose()`: Clean up all registered bindings
- `getBindingCount()`: Get the number of currently registered bindings

### Utility Functions

#### `isValidShortcut(shortcut: string): boolean`

Check if a shortcut string format is valid:

```typescript
import { isValidShortcut } from '@keekuun/keymaster-core';

isValidShortcut('ctrl+s'); // true
isValidShortcut('invalid'); // false
isValidShortcut('ctrl'); // false (missing main key)
```

#### `formatShortcut(shortcut: string): string`

Format a shortcut string (normalize case and spacing):

```typescript
import { formatShortcut } from '@keekuun/keymaster-core';

formatShortcut('Ctrl+S'); // 'ctrl+s'
formatShortcut('ctrl + shift + z'); // 'ctrl+shift+z'
```

## Build Formats

The core package supports multiple build formats for different use cases:

- **ES Module** (`dist/index.js`): For modern bundlers (Vite, Webpack, Rollup) and ES module environments
- **CommonJS** (`dist/index.cjs`): For Node.js and CommonJS environments
- **UMD** (`dist/index.umd.js`): For browser `<script>` tags and CDN usage

> **Important**: UMD format is **only available for `@keekuun/keymaster-core`**. React and Vue packages (`@keekuun/keymaster-react` and `@keekuun/keymaster-vue`) do not provide UMD builds because they require framework environments (React/Vue) and are typically used with modern bundlers.

### Using UMD Build (Core Package Only)

You can use the UMD build directly in the browser without any build tools:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Keymaster Core UMD Example</title>
  </head>
  <body>
    <!-- Load via unpkg CDN -->
    <script src="https://unpkg.com/@keekuun/keymaster-core/dist/index.umd.js"></script>
    <!-- Or via jsdelivr CDN -->
    <!-- <script src="https://cdn.jsdelivr.net/npm/@keekuun/keymaster-core/dist/index.umd.js"></script> -->

    <script>
      // Access via global variable KeymasterCore
      const { KeyBindingManager, parseShortcut, isValidShortcut, formatShortcut } = KeymasterCore;

      // Use KeyBindingManager - no registration function needed!
      const manager = new KeyBindingManager();
      manager
        .register(
          'ctrl+s',
          () => {
            console.log('Save triggered');
            alert('Save!');
          },
          { preventDefault: true },
        )
        .register('ctrl+z', () => {
          console.log('Undo triggered');
          alert('Undo!');
        });

      console.log('Shortcuts registered. Try Ctrl+S or Ctrl+Z');
    </script>
  </body>
</html>
```

**Use Cases for UMD:**

- Quick prototypes and demos without build tools
- Legacy projects that don't use modern bundlers
- CDN-based deployments
- Standalone JavaScript applications
- Learning and experimentation

**Limitations:**

- No TypeScript type checking in browser environment
- Requires manual dependency management
- Not recommended for production React/Vue applications (use npm packages with bundlers instead)
- React/Vue packages are not available in UMD format

## Usage Examples

### Custom Shortcut Handling

If you need to implement custom shortcut handling logic, you can directly use the core module:

```typescript
import { parseShortcut, isMatchingShortcut, type KeymasterHandler } from '@keekuun/keymaster-core';

function createCustomKeyHandler(shortcut: string, handler: KeymasterHandler) {
  const parsed = parseShortcut(shortcut);

  return (event: KeyboardEvent) => {
    if (isMatchingShortcut(event, parsed)) {
      handler(event);
    }
  };
}

// Usage
const handler = createCustomKeyHandler('ctrl+k', (event) => {
  console.log('Ctrl+K pressed');
});

window.addEventListener('keydown', handler);
```

### Shortcut Validation Tool

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

function validateShortcut(shortcut: string): {
  valid: boolean;
  error?: string;
} {
  try {
    parseShortcut(shortcut);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Usage
const result = validateShortcut('ctrl+s');
if (result.valid) {
  console.log('Shortcut format is correct');
} else {
  console.error('Shortcut format error:', result.error);
}
```

### Shortcut Formatting

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

function formatShortcut(shortcut: string): string {
  try {
    const parsed = parseShortcut(shortcut);
    const parts: string[] = [];

    if (parsed.ctrl) parts.push('Ctrl');
    if (parsed.alt) parts.push('Alt');
    if (parsed.shift) parts.push('Shift');
    if (parsed.meta) parts.push('Meta');
    parts.push(parsed.key.toUpperCase());

    return parts.join(' + ');
  } catch {
    return shortcut;
  }
}

// Usage
console.log(formatShortcut('ctrl+shift+s')); // "Ctrl + Shift + S"
```

## Constants

The core module exports all modifier key constants:

```typescript
import {
  MODIFIER_CTRL,
  MODIFIER_ALT,
  MODIFIER_SHIFT,
  MODIFIER_META,
  MODIFIER_CMD,
  PLUS_SEPARATOR,
  MODIFIERS,
} from '@keekuun/keymaster-core';

// MODIFIERS = ["ctrl", "alt", "shift", "meta", "cmd"]
```

## Design Principles

1. **Type Safety**: All functions and types have complete TypeScript type definitions, zero `any` types
2. **Framework Agnostic**: Core module doesn't depend on any UI framework (React/Vue), usable in any project
3. **Extensibility**: Provides unified base capabilities for React and Vue versions, easy to extend
4. **Zero Dependencies**: Core module only depends on browser native APIs, no external dependencies

## Version Compatibility

- **TypeScript**: ^5.0.0
- **Browser**: Supports all modern browsers (ES2020+)
- **Node.js**: Not applicable (browser environment only)

## Related Links

- React Documentation: [📖](/react/)
- Vue Documentation: [📖](/vue/)
- GitHub Repository: [https://github.com/Keekuun/keymaster](https://github.com/Keekuun/keymaster)
- npm Package: [https://www.npmjs.com/package/@keekuun/keymaster-core](https://www.npmjs.com/package/@keekuun/keymaster-core)
