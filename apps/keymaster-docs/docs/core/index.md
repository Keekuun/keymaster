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
│ • Constants (constants.ts)           │
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

- React Documentation: [/react/](https://keymaster-docs.vercel.app/react/)
- Vue Documentation: [/vue/](https://keymaster-docs.vercel.app/vue/)
- GitHub Repository: [https://github.com/Keekuun/keymaster](https://github.com/Keekuun/keymaster)
- npm Package: [https://www.npmjs.com/package/@keekuun/keymaster-core](https://www.npmjs.com/package/@keekuun/keymaster-core)
