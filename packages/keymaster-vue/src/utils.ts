/**
 * keymaster-vue 工具函数集合
 */

import { registerVueKeyBinding } from '@vue/index';
import {
  KeyBindingManager as CoreKeyBindingManager,
  isValidShortcut,
  formatShortcut,
} from '@keekuun/keymaster-core';

/**
 * Vue 版本的快捷键组合管理器：用于管理一组相关的快捷键绑定。
 *
 * 这是 core 包中 KeyBindingManager 的 Vue 封装版本，使用 registerVueKeyBinding 作为注册函数。
 * 提供更好的 Vue 集成和类型支持。
 */
export class KeyBindingManager extends CoreKeyBindingManager {
  constructor() {
    // 使用 Vue 的 registerVueKeyBinding 以获得更好的框架集成
    super(registerVueKeyBinding);
  }
}

/**
 * 创建快捷键组合管理器实例。
 *
 * @returns KeyBindingManager 实例
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { createKeyBindingManager } from '@keekuun/keymaster-vue';
 *
 * const manager = createKeyBindingManager();
 * manager
 *   .register('ctrl+s', () => console.log('Save'))
 *   .register('ctrl+z', () => console.log('Undo'));
 *
 * // 清理所有绑定
 * manager.dispose();
 * </script>
 * ```
 */
export function createKeyBindingManager(): KeyBindingManager {
  return new KeyBindingManager();
}

// 重新导出 core 包中的工具函数，保持向后兼容
export { isValidShortcut, formatShortcut };
