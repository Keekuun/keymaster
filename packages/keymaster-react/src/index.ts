/**
 * React 版 keymaster 库核心实现。
 *
 * 设计目标：
 * - 提供简单易用的 Hook：在组件中一行代码绑定快捷键。
 * - 默认监听 window 的 keydown 事件，避免用户手动管理事件。
 * - 使用共享的 core 模块，确保类型一致性和代码复用。
 */

import { useEffect } from 'react';
import type { RefObject } from 'react';
import type {
  KeymasterHandler,
  KeymasterBindingOptionsBase,
  ElectronHookContext,
} from '@keekuun/keymaster-core';
import {
  parseShortcut,
  isMatchingShortcut,
  isEventInScope,
  isElectronEnvironment,
  getElectronProcessInfo,
  getElectronVersions,
} from '@keekuun/keymaster-core';

/**
 * React 版本的绑定选项（继承自核心选项）
 */
export type KeymasterBindingOptions = KeymasterBindingOptionsBase;

/**
 * 导出核心类型，保持向后兼容
 */
export type { KeymasterHandler };

/**
 * 通用快捷键注册函数，支持作用域元素、编辑器模式和 Electron 模式。
 */
export function registerKeyBinding(
  shortcut: string,
  handler: KeymasterHandler,
  options: KeymasterBindingOptions = {},
): () => void {
  if (!shortcut || typeof handler !== 'function') {
    throw new Error('registerKeyBinding 需要合法的快捷键字符串和处理函数。');
  }

  const parsed = parseShortcut(shortcut);
  const { scopedElement, editorMode, electronMode, electronHook } = options;

  // 编辑器模式默认阻止默认行为
  const shouldPreventDefault =
    options.preventDefault !== undefined ? options.preventDefault : editorMode || false;

  const listener = (event: KeyboardEvent) => {
    try {
      // 作用域检查：如果指定了 scopedElement，只处理作用域内的事件
      if (scopedElement) {
        if (!isEventInScope(event, scopedElement)) {
          return;
        }
      }

      // Electron 模式：检查是否在 Electron 环境中，并触发可选钩子
      if (electronMode && isElectronEnvironment()) {
        const context: ElectronHookContext = {
          event,
          parsed,
          processInfo: getElectronProcessInfo(),
          versions: getElectronVersions(),
        };
        const hookResult = electronHook?.(context);
        // 如果钩子显式返回 false，则不再继续后续处理（适用于自定义拦截或错误兜底）
        if (hookResult === false) {
          return;
        }
      }

      if (!isMatchingShortcut(event, parsed)) {
        return;
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }
      if (options.stopPropagation) {
        event.stopPropagation();
      }

      handler(event);
    } catch (error) {
      // 这里不向外抛出异常，避免监听器错误导致全局崩溃
      // 后续可在此接入日志上报系统
      // eslint-disable-next-line no-console
      console.error('keymaster-react: 在处理快捷键时出现错误', error);
    }
  };

  // 根据是否有作用域元素决定监听目标
  const target = scopedElement || window;
  target.addEventListener('keydown', listener as EventListener);

  // 返回取消绑定的函数
  return () => {
    target.removeEventListener('keydown', listener as EventListener);
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
  options: KeymasterBindingOptions = {},
): void {
  useEffect(() => {
    const cleanup = registerKeyBinding(shortcut, handler, options);
    return () => cleanup();
  }, [
    shortcut,
    handler,
    options.preventDefault,
    options.stopPropagation,
    options.scopedElement,
    options.editorMode,
    options.electronMode,
  ]);
}

/**
 * React Hook：在编辑器场景中绑定快捷键（自动阻止默认行为）。
 *
 * 使用示例：
 * const editorRef = useRef<HTMLTextAreaElement>(null);
 * useEditorKeyBinding("ctrl+s", (event) => {
 *   // 保存编辑器内容
 * }, editorRef.current);
 */
export function useEditorKeyBinding(
  shortcut: string,
  handler: KeymasterHandler,
  editorElement?: HTMLElement | null,
): void {
  useKeyBinding(shortcut, handler, {
    scopedElement: editorElement || undefined,
    editorMode: true,
    preventDefault: true,
  });
}

/**
 * React Hook：在 Electron 应用中绑定快捷键。
 *
 * 使用示例：
 * useElectronKeyBinding("ctrl+alt+r", (event) => {
 *   // 重新加载窗口
 * });
 */
export function useElectronKeyBinding(
  shortcut: string,
  handler: KeymasterHandler,
  options: Omit<KeymasterBindingOptions, 'electronMode'> = {},
): void {
  useKeyBinding(shortcut, handler, {
    ...options,
    electronMode: true,
  });
}

/**
 * React Hook：使用 ref 绑定作用域快捷键。
 *
 * 使用示例：
 * const containerRef = useRef<HTMLDivElement>(null);
 * useScopedKeyBinding("ctrl+k", (event) => {
 *   // 只在 containerRef 内生效
 * }, containerRef);
 */
export function useScopedKeyBinding(
  shortcut: string,
  handler: KeymasterHandler,
  elementRef: RefObject<HTMLElement>,
  options: Omit<KeymasterBindingOptions, 'scopedElement'> = {},
): void {
  useKeyBinding(shortcut, handler, {
    ...options,
    scopedElement: elementRef.current || undefined,
  });
}

// 导出工具函数
export * from '@react/utils';
