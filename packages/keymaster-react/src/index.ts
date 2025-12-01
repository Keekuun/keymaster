/**
 * React 版 keymaster 库核心实现。
 *
 * 设计目标：
 * - 提供简单易用的 Hook：在组件中一行代码绑定快捷键。
 * - 默认监听 window 的 keydown 事件，避免用户手动管理事件。
 * - 仅依赖浏览器原生 KeyboardEvent，后续可平滑替换为原始 keymaster 库。
 */

import { useEffect } from "react";

export type KeymasterHandler = (event: KeyboardEvent) => void;

export interface KeymasterBindingOptions {
  /**
   * 是否在事件被处理后阻止默认行为。
   */
  preventDefault?: boolean;

  /**
   * 是否在事件被处理后阻止事件冒泡。
   */
  stopPropagation?: boolean;

  /**
   * 是否只在元素聚焦时生效（默认全局 window）。
   * 当前实现中暂未使用，预留未来扩展。
   */
  scopedElement?: HTMLElement | null;
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

/**
 * 将类似 "ctrl+s"、"shift+alt+k" 的字符串解析成结构化对象。
 * 解析过程中全部转为小写，避免大小写差异带来的问题。
 */
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
      // 非修饰键视为主键，如 s、k、enter 等
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

/**
 * 判断某次键盘事件是否匹配预期的快捷键。
 */
function isMatchingShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean {
  const eventKey = (event.key || "").toLowerCase();

  // 校验修饰键状态
  if (event.ctrlKey !== parsed.ctrl) return false;
  if (event.altKey !== parsed.alt) return false;
  if (event.shiftKey !== parsed.shift) return false;
  if (event.metaKey !== parsed.meta) return false;

  // 校验主键（支持常见按键名称）
  return eventKey === parsed.key;
}

/**
 * 通用快捷键注册函数，后续可在此接入原始 keymaster。
 * 当前实现直接在 window 上监听 keydown 事件。
 */
export function registerKeyBinding(
  shortcut: string,
  handler: KeymasterHandler,
  options: KeymasterBindingOptions = {}
): () => void {
  if (!shortcut || typeof handler !== "function") {
    throw new Error("registerKeyBinding 需要合法的快捷键字符串和处理函数。");
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
      // 这里不向外抛出异常，避免监听器错误导致全局崩溃
      // 后续可在此接入日志上报系统
      console.error("keymaster-react: 在处理快捷键时出现错误", error);
    }
  };

  // 当前版本仅支持全局 window 监听
  window.addEventListener("keydown", listener);

  // 返回取消绑定的函数
  return () => {
    window.removeEventListener("keydown", listener);
  };
}

/**
 * React Hook：在组件层面绑定快捷键。
 *
 * 使用示例：
 * useKeyBinding("ctrl+s", (event) => {
 *   // 处理保存逻辑
 * });
 */
export function useKeyBinding(
  shortcut: string,
  handler: KeymasterHandler,
  options: KeymasterBindingOptions = {}
): void {
  useEffect(() => {
    const cleanup = registerKeyBinding(shortcut, handler, options);
    return () => cleanup();
  }, [shortcut, handler, options.preventDefault, options.stopPropagation, options.scopedElement]);
}



