/**
 * keymaster 核心类型定义（React 和 Vue 共享）
 */

/**
 * 键盘事件处理函数类型
 */
export type KeymasterHandler = (event: KeyboardEvent) => void;

/**
 * 快捷键绑定选项（基础选项，React 和 Vue 共享）
 */
export interface KeymasterBindingOptionsBase {
  /**
   * 是否在事件被处理后阻止默认行为。
   */
  preventDefault?: boolean;

  /**
   * 是否在事件被处理后阻止事件冒泡。
   */
  stopPropagation?: boolean;

  /**
   * 作用域元素：将快捷键绑定到特定元素而非全局 window。
   * 适用于编辑器、对话框等需要局部快捷键的场景。
   * 当提供此选项时，快捷键仅在元素或其子元素聚焦时生效。
   */
  scopedElement?: HTMLElement | null;

  /**
   * 编辑器模式：自动处理常见的编辑器快捷键冲突。
   * 启用后会自动阻止浏览器默认行为（如 Ctrl+S 保存页面）。
   */
  editorMode?: boolean;

  /**
   * Electron 模式：适配 Electron 应用的特殊行为。
   * 启用后会处理主进程与渲染进程的快捷键协调。
   */
  electronMode?: boolean;

  /**
   * Electron 钩子：当在 Electron 环境下并启用了 electronMode 时调用。
   *
   * - 可以用于上报日志 / 采集环境信息（process type、versions 等）
   * - 可以决定是否继续执行后续的快捷键处理逻辑（返回 false 则中断）
   */
  electronHook?: (context: ElectronHookContext) => void | boolean;
}

/**
 * Electron 钩子上下文
 */
export interface ElectronHookContext {
  event: KeyboardEvent;
  /**
   * 解析后的快捷键
   */
  parsed: ParsedShortcut;
  /**
   * Electron 进程信息（仅在 Electron 渲染进程中可用）
   */
  processInfo: ElectronWindow['process'] | null;
  /**
   * Electron / Node / Chrome 版本信息
   */
  versions: {
    electron?: string;
    node?: string;
    chrome?: string;
  } | null;
}

/**
 * 解析后的快捷键结构
 */
export interface ParsedShortcut {
  key: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

/**
 * Electron 环境类型声明
 */
export interface ElectronWindow extends Window {
  process?: {
    type?: string;
    versions?: {
      electron?: string;
      node?: string;
      chrome?: string;
    };
  };
}
