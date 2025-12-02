import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerKeyBinding } from '@react/index';

describe('@keekuun/keymaster-react registerKeyBinding', () => {
  const originalAdd = window.addEventListener;
  const originalRemove = window.removeEventListener;

  beforeEach(() => {
    // Ensure listeners are clean before each test
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  afterEach(() => {
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('triggers handler when matching shortcut is pressed', () => {
    const handler = vi.fn();
    const dispose = registerKeyBinding('ctrl+s', handler, { preventDefault: true });

    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    dispose();
  });
});
