/**
 * keymaster 快捷键解析器（React 和 Vue 共享）
 */

import type { ParsedShortcut } from '@core/types';
import {
  MODIFIER_CTRL,
  MODIFIER_ALT,
  MODIFIER_SHIFT,
  MODIFIER_META,
  MODIFIER_CMD,
  PLUS_SEPARATOR,
} from '@core/constants';

/**
 * 将类似 "ctrl+s"、"shift+alt+k" 的字符串解析成结构化对象。
 * 解析过程中全部转为小写，避免大小写差异带来的问题。
 */
export function parseShortcut(shortcut: string): ParsedShortcut {
  if (!shortcut) {
    throw new Error('快捷键字符串不能为空。');
  }

  const parts = shortcut
    .split(PLUS_SEPARATOR)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error('快捷键字符串格式不正确。');
  }

  const modifiers = {
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
  };

  let key: string | null = null;

  for (const part of parts) {
    if (part === MODIFIER_CTRL) {
      modifiers.ctrl = true;
    } else if (part === MODIFIER_ALT) {
      modifiers.alt = true;
    } else if (part === MODIFIER_SHIFT) {
      modifiers.shift = true;
    } else if (part === MODIFIER_META || part === MODIFIER_CMD) {
      modifiers.meta = true;
    } else {
      // 非修饰键视为主键，如 s、k、enter 等
      key = part;
    }
  }

  if (!key) {
    throw new Error('快捷键必须包含一个主键（例如：ctrl+s 中的 s）。');
  }

  return {
    key,
    ctrl: modifiers.ctrl,
    alt: modifiers.alt,
    shift: modifiers.shift,
    meta: modifiers.meta,
  };
}

/**
 * 判断某次键盘事件是否匹配预期的快捷键。
 */
export function isMatchingShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean {
  const eventKey = (event.key || '').toLowerCase();

  // 校验修饰键状态
  if (event.ctrlKey !== parsed.ctrl) return false;
  if (event.altKey !== parsed.alt) return false;
  if (event.shiftKey !== parsed.shift) return false;
  if (event.metaKey !== parsed.meta) return false;

  // 校验主键（支持常见按键名称）
  return eventKey === parsed.key;
}

/**
 * 检查事件是否发生在作用域元素内（包括元素本身及其子元素）。
 */
export function isEventInScope(event: KeyboardEvent, scopedElement: HTMLElement): boolean {
  const target = event.target as HTMLElement | null;
  if (!target) return false;

  // 检查目标元素是否在作用域内
  return scopedElement === target || scopedElement.contains(target);
}
