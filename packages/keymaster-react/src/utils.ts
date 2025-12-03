/**
 * keymaster-react 工具函数集合
 */

import { registerKeyBinding } from '@react/index';
import {
  KeyBindingManager as CoreKeyBindingManager,
  isValidShortcut,
  formatShortcut,
} from '@keekuun/keymaster-core';

/**
 * React 版本的快捷键组合管理器：用于管理一组相关的快捷键绑定。
 *
 * 这是 core 包中 KeyBindingManager 的 React 封装版本，使用 registerKeyBinding 作为注册函数。
 * 提供更好的 React 集成和类型支持。
 */
export class KeyBindingManager extends CoreKeyBindingManager {
  constructor() {
    // 使用 React 的 registerKeyBinding 以获得更好的框架集成
    super(registerKeyBinding);
  }
}

/**
 * 创建快捷键组合管理器实例。
 *
 * @returns KeyBindingManager 实例
 *
 * @example
 * ```tsx
 * import { createKeyBindingManager } from '@keekuun/keymaster-react';
 *
 * const manager = createKeyBindingManager();
 * manager
 *   .register('ctrl+s', () => console.log('Save'))
 *   .register('ctrl+z', () => console.log('Undo'));
 *
 * // 清理所有绑定
 * manager.dispose();
 * ```
 */
export function createKeyBindingManager(): KeyBindingManager {
  return new KeyBindingManager();
}

// 重新导出 core 包中的工具函数，保持向后兼容
export { isValidShortcut, formatShortcut };
