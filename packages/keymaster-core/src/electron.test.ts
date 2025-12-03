import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isElectronEnvironment,
  isElectronRenderer,
  getElectronProcessInfo,
  getElectronVersions,
} from '@core/electron';
import type { ElectronWindow } from '@core/types';

describe('keymaster-core electron helpers', () => {
  const electronWindow = window as ElectronWindow;
  const originalProcess = electronWindow.process;

  beforeEach(() => {
    electronWindow.process = {
      type: 'renderer',
      versions: {
        electron: '30.0.0',
        node: '20.0.0',
        chrome: '124.0.0',
      },
    };
  });

  afterEach(() => {
    electronWindow.process = originalProcess;
  });

  it('detects electron renderer environment', () => {
    expect(isElectronEnvironment()).toBe(true);
    expect(isElectronRenderer()).toBe(true);
  });

  it('returns process info and versions', () => {
    const info = getElectronProcessInfo();
    expect(info?.type).toBe('renderer');

    const versions = getElectronVersions();
    expect(versions?.electron).toBe('30.0.0');
    expect(versions?.node).toBe('20.0.0');
    expect(versions?.chrome).toBe('124.0.0');
  });
});
