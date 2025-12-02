import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isElectronEnvironment,
  isElectronRenderer,
  getElectronProcessInfo,
  getElectronVersions,
} from '@core/electron';

describe('keymaster-core electron helpers', () => {
  const originalProcess = (window as any).process;

  beforeEach(() => {
    (window as any).process = {
      type: 'renderer',
      versions: {
        electron: '30.0.0',
        node: '20.0.0',
        chrome: '124.0.0',
      },
    };
  });

  afterEach(() => {
    (window as any).process = originalProcess;
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
