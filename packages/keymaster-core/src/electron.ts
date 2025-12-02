/**
 * Electron environment detection and helpers (renderer-safe only).
 */

import type { ElectronWindow } from '@core/types';

/**
 * Check whether current context is an Electron renderer process.
 *
 * This is a safe check that only relies on `window.process`.
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
 * Alias of `isElectronEnvironment` for clearer semantics.
 */
export function isElectronRenderer(): boolean {
  return isElectronEnvironment();
}

/**
 * Get Electron process info (if available in renderer).
 */
export function getElectronProcessInfo(): ElectronWindow['process'] | null {
  if (!isElectronEnvironment()) {
    return null;
  }

  const electronWindow = window as ElectronWindow;
  return electronWindow.process || null;
}

/**
 * Get Electron / Node / Chrome version information from `process.versions`.
 */
export function getElectronVersions(): {
  electron?: string;
  node?: string;
  chrome?: string;
} | null {
  const processInfo = getElectronProcessInfo();
  if (!processInfo || !processInfo.versions) {
    return null;
  }

  const { electron, node, chrome } = processInfo.versions;
  return { electron, node, chrome };
}
