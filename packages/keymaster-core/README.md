# @keekuun/keymaster-core

### 🌐 Language

- [English](README.md) (current)
- [中文](README.zh.md)

keymaster core module, providing shared type definitions, parsers, and utility functions for React and Vue versions.

> **Note**: Usually you don't need to install this package directly. It's automatically installed as a dependency of `@keekuun/keymaster-react` and `@keekuun/keymaster-vue`. If you need to use core functionality in other projects, you can install it separately.

## Overview

`@keekuun/keymaster-core` is the underlying core module of `@keekuun/keymaster-react` and `@keekuun/keymaster-vue`, containing:

- **Type Definitions**: Unified type system ensuring type consistency across React and Vue versions
- **Shortcut Parser**: Parses string-format shortcuts (e.g., `"ctrl+s"`) into structured objects
- **Event Matcher**: Determines if keyboard events match expected shortcut combinations
- **Scope Checking**: Verifies if events occur within specific element scopes
- **Electron Support**: Detects and handles special requirements of Electron environments
- **KeyBindingManager**: Framework-agnostic shortcut binding manager for managing groups of shortcuts
- **Utility Functions**: `isValidShortcut()` and `formatShortcut()` for shortcut validation and formatting

## Installation

### Auto-install as Dependency

When you install `@keekuun/keymaster-react` or `@keekuun/keymaster-vue`, `keymaster-core` will be automatically installed as a dependency:

```bash
npm install @keekuun/keymaster-react
# keymaster-core will be automatically installed
```

### Standalone Installation (Optional)

If you need to use core functionality in other projects, you can install it separately:

```bash
npm install @keekuun/keymaster-core
# or
pnpm add @keekuun/keymaster-core
```

## API Documentation

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

#### `ElectronWindow`

Electron environment Window type extension:

```typescript
interface ElectronWindow extends Window {
  process?: {
    type?: string;
    versions?: {
      electron?: string;
      node?: string;
      chrome?: string;
    };
  };
}
```

### Core Functions

#### `parseShortcut(shortcut: string): ParsedShortcut`

Parse a shortcut string into a structured object:

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

const parsed = parseShortcut('ctrl+shift+s');
// { key: "s", ctrl: true, shift: true, alt: false, meta: false }
```

#### `isMatchingShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean`

Determine if a keyboard event matches the parsed shortcut:

```typescript
import { isMatchingShortcut, parseShortcut } from '@keekuun/keymaster-core';

const parsed = parseShortcut('ctrl+s');
const isMatch = isMatchingShortcut(keyboardEvent, parsed);
```

#### `isEventInScope(event: KeyboardEvent, scopedElement: HTMLElement): boolean`

Check if an event occurred within a scoped element:

```typescript
import { isEventInScope } from '@keekuun/keymaster-core';

const isInScope = isEventInScope(keyboardEvent, editorElement);
```

#### `isElectronEnvironment(): boolean`

Detect if currently running in an Electron environment:

```typescript
import { isElectronEnvironment } from '@keekuun/keymaster-core';

if (isElectronEnvironment()) {
  // Handle Electron-specific logic
}
```

#### `getElectronProcessInfo(): ElectronWindow["process"] | null`

Get Electron process information (if available):

```typescript
import { getElectronProcessInfo } from '@keekuun/keymaster-core';

const processInfo = getElectronProcessInfo();
if (processInfo) {
  console.log(processInfo.type); // "renderer" or "main"
}
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

#### Utility Functions

```typescript
import { isValidShortcut, formatShortcut } from '@keekuun/keymaster-core';

// Validate shortcut format
isValidShortcut('ctrl+s'); // true
isValidShortcut('invalid'); // false

// Format shortcut string
formatShortcut('Ctrl+S'); // 'ctrl+s'
formatShortcut('ctrl + shift + z'); // 'ctrl+shift+z'
```

### Constants

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
```

## Use Cases

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
```

### Shortcut Validation Tool

```typescript
import { parseShortcut } from '@keekuun/keymaster-core';

function validateShortcut(shortcut: string): boolean {
  try {
    parseShortcut(shortcut);
    return true;
  } catch {
    return false;
  }
}
```

## Build Formats

The core package supports multiple build formats for different use cases:

- **ES Module** (`dist/index.js`): For modern bundlers and ES module environments
- **CommonJS** (`dist/index.cjs`): For Node.js and CommonJS environments
- **UMD** (`dist/index.umd.js`): For browser `<script>` tags and CDN usage (core package only)

### UMD Usage (Core Package Only)

> **Note**: UMD format is only available for `@keekuun/keymaster-core`. React and Vue packages (`@keekuun/keymaster-react` and `@keekuun/keymaster-vue`) do not provide UMD builds as they require framework environments and are typically used with modern bundlers.

You can use the UMD build directly in the browser for the core package:

```html
<!-- Via unpkg CDN -->
<script src="https://unpkg.com/@keekuun/keymaster-core/dist/index.umd.js"></script>
<!-- Or via jsdelivr CDN -->
<script src="https://cdn.jsdelivr.net/npm/@keekuun/keymaster-core/dist/index.umd.js"></script>
<script>
  // Access via global variable KeymasterCore
  const { KeyBindingManager, parseShortcut, isValidShortcut, formatShortcut } = KeymasterCore;

  // Example: Use KeyBindingManager with your own registration function
  function myRegisterKeyBinding(shortcut, handler, options) {
    const listener = (event) => {
      // Your custom matching logic
      handler(event);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }

  const manager = new KeyBindingManager(myRegisterKeyBinding);
  manager
    .register('ctrl+s', () => console.log('Save'))
    .register('ctrl+z', () => console.log('Undo'));
</script>
```

**Use Cases for UMD:**

- Quick prototypes and demos without build tools
- Legacy projects that don't use modern bundlers
- CDN-based deployments
- Standalone JavaScript applications

**Limitations:**

- No TypeScript type checking in browser environment
- Requires manual dependency management
- Not recommended for production React/Vue applications (use npm packages instead)

## Design Principles

1. **Type Safety**: All functions and types have complete TypeScript type definitions
2. **Framework Agnostic**: Core module doesn't depend on any UI framework (React/Vue)
3. **Extensibility**: Provides unified base capabilities for React and Vue versions
4. **Zero Dependencies**: Core module only depends on browser native APIs
5. **Standalone Usable**: Can be used independently in any JavaScript/TypeScript project

## Version Compatibility

- TypeScript: ^5.0.0
- Browser: Supports all modern browsers (ES2020+)

## Related Links

- React Version: `@keekuun/keymaster-react`
- Vue Version: `@keekuun/keymaster-vue`
- Documentation Site: [https://keymaster-docs.vercel.app/core/](https://keymaster-docs.vercel.app/core/)
- GitHub Repository: [https://github.com/Keekuun/keymaster](https://github.com/Keekuun/keymaster)
