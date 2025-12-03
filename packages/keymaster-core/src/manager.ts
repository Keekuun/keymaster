/**
 * 快捷键绑定管理器
 *
 * 用于统一管理一组相关的快捷键绑定，支持链式调用和批量清理。
 * 可以在任何 JavaScript/TypeScript 项目中使用，不依赖任何框架。
 */

import type { KeymasterHandler, KeymasterBindingOptionsBase } from '@core/types';
import { parseShortcut, isMatchingShortcut, isEventInScope } from '@core/parser';

/**
 * 注册函数的类型定义
 */
export type RegisterFunction = (
  shortcut: string,
  handler: KeymasterHandler,
  options?: KeymasterBindingOptionsBase,
) => () => void;

/**
 * 默认的注册函数实现（使用浏览器原生 API）
 */
function defaultRegisterKeyBinding(
  shortcut: string,
  handler: KeymasterHandler,
  options: KeymasterBindingOptionsBase = {},
): () => void {
  const parsed = parseShortcut(shortcut);
  const { scopedElement, preventDefault, stopPropagation } = options;

  const listener = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;

    // 检查作用域
    if (scopedElement && !isEventInScope(keyboardEvent, scopedElement)) {
      return;
    }

    // 检查是否匹配快捷键
    if (!isMatchingShortcut(keyboardEvent, parsed)) {
      return;
    }

    // 处理事件
    if (preventDefault) {
      keyboardEvent.preventDefault();
    }
    if (stopPropagation) {
      keyboardEvent.stopPropagation();
    }

    handler(keyboardEvent);
  };

  const target = scopedElement || (typeof window !== 'undefined' ? window : null);
  if (!target) {
    throw new Error('无法注册快捷键：缺少目标元素或 window 对象');
  }

  target.addEventListener('keydown', listener);

  return () => {
    target.removeEventListener('keydown', listener);
  };
}

/**
 * 快捷键组合管理器：用于管理一组相关的快捷键绑定。
 *
 * @example
 * ```typescript
 * import { KeyBindingManager } from '@keekuun/keymaster-core';
 *
 * // 直接使用，无需提供注册函数
 * const manager = new KeyBindingManager();
 * manager
 *   .register('ctrl+s', () => console.log('Save'))
 *   .register('ctrl+z', () => console.log('Undo'));
 *
 * // 清理所有绑定
 * manager.dispose();
 * ```
 *
 * @example
 * ```typescript
 * // 也可以提供自定义注册函数（如使用 React/Vue 的注册函数）
 * import { registerKeyBinding } from '@keekuun/keymaster-react';
 * const manager = new KeyBindingManager(registerKeyBinding);
 * ```
 */
export class KeyBindingManager {
  private bindings: Array<() => void> = [];
  private registerFn: RegisterFunction;

  /**
   * 创建快捷键绑定管理器实例
   *
   * @param registerFn 可选的注册函数，如果不提供则使用默认实现（浏览器原生 API）
   */
  constructor(registerFn?: RegisterFunction) {
    this.registerFn = registerFn || defaultRegisterKeyBinding;
  }

  /**
   * 注册一个快捷键绑定。
   *
   * @param shortcut 快捷键字符串，如 'ctrl+s', 'cmd+k'
   * @param handler 事件处理函数
   * @param options 可选的绑定选项（作用域、编辑器模式等）
   * @returns 返回管理器实例，支持链式调用
   *
   * @example
   * ```typescript
   * manager
   *   .register('ctrl+s', () => console.log('Save'))
   *   .register('ctrl+z', () => console.log('Undo'));
   * ```
   */
  register(
    shortcut: string,
    handler: KeymasterHandler,
    options?: KeymasterBindingOptionsBase,
  ): this {
    const dispose = this.registerFn(shortcut, handler, options);
    this.bindings.push(dispose);
    return this;
  }

  /**
   * 取消所有已注册的快捷键绑定。
   *
   * @example
   * ```typescript
   * manager.dispose(); // 清理所有绑定
   * ```
   */
  dispose(): void {
    this.bindings.forEach((dispose) => dispose());
    this.bindings = [];
  }

  /**
   * 获取当前已注册的绑定数量。
   *
   * @returns 绑定数量
   *
   * @example
   * ```typescript
   * const count = manager.getBindingCount();
   * console.log(`当前有 ${count} 个快捷键绑定`);
   * ```
   */
  getBindingCount(): number {
    return this.bindings.length;
  }
}

/**
 * 检查快捷键字符串格式是否有效。
 *
 * @param shortcut 快捷键字符串
 * @returns 是否有效
 *
 * @example
 * ```typescript
 * isValidShortcut('ctrl+s'); // true
 * isValidShortcut('invalid'); // false
 * ```
 */
export function isValidShortcut(shortcut: string): boolean {
  if (!shortcut || typeof shortcut !== 'string') {
    return false;
  }

  const parts = shortcut
    .split('+')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  if (parts.length === 0) {
    return false;
  }

  // 至少需要一个非修饰键
  const modifiers = ['ctrl', 'alt', 'shift', 'meta', 'cmd'];
  const hasNonModifier = parts.some((part) => !modifiers.includes(part));

  return hasNonModifier;
}

/**
 * 格式化快捷键字符串（统一大小写和格式）。
 *
 * @param shortcut 快捷键字符串
 * @returns 格式化后的字符串
 *
 * @example
 * ```typescript
 * formatShortcut('Ctrl+S'); // 'ctrl+s'
 * formatShortcut('ctrl + shift + z'); // 'ctrl+shift+z'
 * ```
 */
export function formatShortcut(shortcut: string): string {
  const parts = shortcut
    .split('+')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  return parts.join('+');
}
