/**
 * Vue 版 keymaster 库核心实现。
 *
 * 设计目标：
 * - 提供组合式 API，方便在 setup 中直接绑定快捷键。
 * - 默认监听 window 的 keydown 事件，后续可平滑对接原始 keymaster 库。
 */

import { onMounted, onBeforeUnmount } from "vue";

export type KeymasterVueHandler = (event: KeyboardEvent) => void;

export interface KeymasterVueBindingOptions {
  /**
   * 是否在事件被处理后阻止默认行为。
   */
  preventDefault?: boolean;

  /**
   * 是否在事件被处理后阻止事件冒泡。
   */
  stopPropagation?: boolean;
}

interface ParsedShortcut {
  key: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

const MODIFIER_CTRL = "ctrl";
const MODIFIER_ALT = "alt";
const MODIFIER_SHIFT = "shift";
const MODIFIER_META = "meta";
const PLUS_SEPARATOR = "+";

function parseShortcut(shortcut: string): ParsedShortcut {
  if (!shortcut) {
    throw new Error("快捷键字符串不能为空。");
  }

  const parts = shortcut
    .split(PLUS_SEPARATOR)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error("快捷键字符串格式不正确。");
  }

  const modifiers = {
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  };

  let key: string | null = null;

  for (const part of parts) {
    if (part === MODIFIER_CTRL) {
      modifiers.ctrl = true;
    } else if (part === MODIFIER_ALT) {
      modifiers.alt = true;
    } else if (part === MODIFIER_SHIFT) {
      modifiers.shift = true;
    } else if (part === MODIFIER_META || part === "cmd") {
      modifiers.meta = true;
    } else {
      key = part;
    }
  }

  if (!key) {
    throw new Error("快捷键必须包含一个主键（例如：ctrl+s 中的 s）。");
  }

  return {
    key,
    ctrl: modifiers.ctrl,
    alt: modifiers.alt,
    shift: modifiers.shift,
    meta: modifiers.meta
  };
}

function isMatchingShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean {
  const eventKey = (event.key || "").toLowerCase();

  if (event.ctrlKey !== parsed.ctrl) return false;
  if (event.altKey !== parsed.alt) return false;
  if (event.shiftKey !== parsed.shift) return false;
  if (event.metaKey !== parsed.meta) return false;

  return eventKey === parsed.key;
}

/**
 * 通用快捷键注册函数，直接在 window 上监听 keydown。
 */
export function registerVueKeyBinding(
  shortcut: string,
  handler: KeymasterVueHandler,
  options: KeymasterVueBindingOptions = {}
): () => void {
  if (!shortcut || typeof handler !== "function") {
    throw new Error("registerVueKeyBinding 需要合法的快捷键字符串和处理函数。");
  }

  const parsed = parseShortcut(shortcut);

  const listener = (event: KeyboardEvent) => {
    try {
      if (!isMatchingShortcut(event, parsed)) {
        return;
      }

      if (options.preventDefault) {
        event.preventDefault();
      }
      if (options.stopPropagation) {
        event.stopPropagation();
      }

      handler(event);
    } catch (error) {
      console.error("keymaster-vue: 在处理快捷键时出现错误", error);
    }
  };

  window.addEventListener("keydown", listener);

  return () => {
    window.removeEventListener("keydown", listener);
  };
}

/**
 * 组合式 API：在 Vue 组件中绑定快捷键。
 *
 * 使用示例（<script setup>）：
 * useKeyBindingVue("ctrl+s", (event) => {
 *   // 处理保存逻辑
 * });
 */
export function useKeyBindingVue(
  shortcut: string,
  handler: KeymasterVueHandler,
  options: KeymasterVueBindingOptions = {}
): void {
  let cleanup: (() => void) | null = null;

  onMounted(() => {
    cleanup = registerVueKeyBinding(shortcut, handler, options);
  });

  onBeforeUnmount(() => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  });
}

