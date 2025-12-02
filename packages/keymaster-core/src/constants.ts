/**
 * keymaster 核心常量定义
 */

export const MODIFIER_CTRL = 'ctrl' as const;
export const MODIFIER_ALT = 'alt' as const;
export const MODIFIER_SHIFT = 'shift' as const;
export const MODIFIER_META = 'meta' as const;
export const MODIFIER_CMD = 'cmd' as const;
export const PLUS_SEPARATOR = '+' as const;

/**
 * 所有修饰键列表
 */
export const MODIFIERS = [
  MODIFIER_CTRL,
  MODIFIER_ALT,
  MODIFIER_SHIFT,
  MODIFIER_META,
  MODIFIER_CMD,
] as const;
