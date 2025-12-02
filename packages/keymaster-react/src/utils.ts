/**
 * keymaster-react 工具函数集合
 */

import type { KeymasterHandler, KeymasterBindingOptions } from '@react/index';
import { registerKeyBinding } from '@react/index';

/**
 * 快捷键组合管理器：用于管理一组相关的快捷键绑定。
 */
export class KeyBindingManager {
  private bindings: Array<() => void> = [];

  /**
   * 注册一个快捷键绑定。
   * @param shortcut 快捷键字符串
   * @param handler 处理函数
   * @param options 选项
   * @returns 返回管理器实例，支持链式调用
   */
  register(shortcut: string, handler: KeymasterHandler, options?: KeymasterBindingOptions): this {
    const dispose = registerKeyBinding(shortcut, handler, options);
    this.bindings.push(dispose);
    return this;
  }

  /**
   * 取消所有已注册的快捷键绑定。
   */
  dispose(): void {
    this.bindings.forEach((dispose) => dispose());
    this.bindings = [];
  }

  /**
   * 获取当前已注册的绑定数量。
   */
  getBindingCount(): number {
    return this.bindings.length;
  }
}

/**
 * 创建快捷键组合管理器实例。
 */
export function createKeyBindingManager(): KeyBindingManager {
  return new KeyBindingManager();
}

/**
 * 检查快捷键字符串格式是否有效。
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
 */
export function formatShortcut(shortcut: string): string {
  const parts = shortcut
    .split('+')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  return parts.join('+');
}
