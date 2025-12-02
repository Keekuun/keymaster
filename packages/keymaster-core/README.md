# @keekuun/keymaster-core

keymaster core module, providing shared type definitions, parsers, and utility functions for React and Vue versions.

> **Note**: Usually you don't need to install this package directly. It's automatically installed as a dependency of `@keekuun/keymaster-react` and `@keekuun/keymaster-vue`. If you need to use core functionality in other projects, you can install it separately.

## Overview

`@keekuun/keymaster-core` is the underlying core module of `@keekuun/keymaster-react` and `@keekuun/keymaster-vue`, containing:

- **Type Definitions**: Unified type system ensuring type consistency across React and Vue versions
- **Shortcut Parser**: Parses string-format shortcuts (e.g., `"ctrl+s"`) into structured objects
- **Event Matcher**: Determines if keyboard events match expected shortcut combinations
- **Scope Checking**: Verifies if events occur within specific element scopes
- **Electron Support**: Detects and handles special requirements of Electron environments

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

## Design Principles

1. **Type Safety**: All functions and types have complete TypeScript type definitions
2. **Framework Agnostic**: Core module doesn't depend on any UI framework (React/Vue)
3. **Extensibility**: Provides unified base capabilities for React and Vue versions
4. **Zero Dependencies**: Core module only depends on browser native APIs

## Version Compatibility

- TypeScript: ^5.0.0
- Browser: Supports all modern browsers (ES2020+)

## Related Links

- React Version: `@keekuun/keymaster-react`
- Vue Version: `@keekuun/keymaster-vue`
- Documentation Site: [https://keymaster-docs.vercel.app/core/](https://keymaster-docs.vercel.app/core/)
- GitHub Repository: [https://github.com/Keekuun/keymaster](https://github.com/Keekuun/keymaster)

---

### 🌐 Language

- [English](README.md) (current)
- [中文](README.zh.md)
