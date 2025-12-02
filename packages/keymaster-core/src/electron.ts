/**
 * Electron 环境检测和类型定义
 */

import type { ElectronWindow } from '@core/types';

/**
 * 检查当前是否在 Electron 环境中
 */
export function isElectronEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const electronWindow = window as ElectronWindow;
  return (
    typeof electronWindow.process !== 'undefined' && electronWindow.process.type === 'renderer'
  );
}

/**
 * 获取 Electron 进程信息（如果可用）
 */
export function getElectronProcessInfo(): ElectronWindow['process'] | null {
  if (!isElectronEnvironment()) {
    return null;
  }

  const electronWindow = window as ElectronWindow;
  return electronWindow.process || null;
}
