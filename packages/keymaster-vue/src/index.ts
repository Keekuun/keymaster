/**
 * Vue 版 keymaster 库核心实现。
 *
 * 设计目标：
 * - 提供组合式 API，方便在 setup 中直接绑定快捷键。
 * - 默认监听 window 的 keydown 事件。
 * - 使用共享的 core 模块，确保类型一致性和代码复用。
 */

import { onMounted, onBeforeUnmount } from 'vue';
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
 * Vue 版本的处理器类型（与核心类型保持一致）
 */
export type KeymasterVueHandler = KeymasterHandler;

/**
 * Vue 版本的绑定选项（继承自核心选项）
 */
export type KeymasterVueBindingOptions = KeymasterBindingOptionsBase;

/**
 * 通用快捷键注册函数，支持作用域元素、编辑器模式和 Electron 模式。
 */
export function registerVueKeyBinding(
  shortcut: string,
  handler: KeymasterVueHandler,
  options: KeymasterVueBindingOptions = {},
): () => void {
  if (!shortcut || typeof handler !== 'function') {
    throw new Error('registerVueKeyBinding 需要合法的快捷键字符串和处理函数。');
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
        if (hookResult === false) {
          return;
        }
      }

      if (!isMatchingShortcut(event, parsed)) {
        return;
      }

      // 匹配成功后立即阻止默认行为和事件传播，确保在其他监听器之前处理
      if (shouldPreventDefault) {
        event.preventDefault();
      }
      if (options.stopPropagation) {
        event.stopPropagation();
        // 如果设置了 stopPropagation，也使用 stopImmediatePropagation 阻止同一阶段的其他监听器
        event.stopImmediatePropagation();
      }

      handler(event);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('keymaster-vue: 在处理快捷键时出现错误', error);
    }
  };

  // 根据是否有作用域元素决定监听目标
  const target = scopedElement || window;
  target.addEventListener('keydown', listener as EventListener, false);

  return () => {
    target.removeEventListener('keydown', listener as EventListener, false);
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
  options: KeymasterVueBindingOptions = {},
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

/**
 * 组合式 API：在编辑器场景中绑定快捷键（自动阻止默认行为）。
 *
 * 使用示例（<script setup>）：
 * const editorRef = ref<HTMLTextAreaElement | null>(null);
 * useEditorKeyBindingVue("ctrl+s", (event) => {
 *   // 保存编辑器内容
 * }, editorRef.value);
 */
export function useEditorKeyBindingVue(
  shortcut: string,
  handler: KeymasterVueHandler,
  editorElement?: HTMLElement | null,
): void {
  useKeyBindingVue(shortcut, handler, {
    scopedElement: editorElement || undefined,
    editorMode: true,
    preventDefault: true,
  });
}

/**
 * 组合式 API：在 Electron 应用中绑定快捷键。
 *
 * 使用示例（<script setup>）：
 * useElectronKeyBindingVue("ctrl+alt+r", (event) => {
 *   // 重新加载窗口
 * });
 */
export function useElectronKeyBindingVue(
  shortcut: string,
  handler: KeymasterVueHandler,
  options: Omit<KeymasterVueBindingOptions, 'electronMode'> = {},
): void {
  useKeyBindingVue(shortcut, handler, {
    ...options,
    electronMode: true,
  });
}

/**
 * 组合式 API：使用 ref 绑定作用域快捷键。
 *
 * 使用示例（<script setup>）：
 * const containerRef = ref<HTMLDivElement | null>(null);
 * useScopedKeyBindingVue("ctrl+k", (event) => {
 *   // 只在 containerRef 内生效
 * }, containerRef);
 */
export function useScopedKeyBindingVue(
  shortcut: string,
  handler: KeymasterVueHandler,
  elementRef: { value: HTMLElement | null },
  options: Omit<KeymasterVueBindingOptions, 'scopedElement'> = {},
): void {
  useKeyBindingVue(shortcut, handler, {
    ...options,
    scopedElement: elementRef.value || undefined,
  });
}

// 导出工具函数
export * from '@vue/utils';
