import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerVueKeyBinding } from '@vue/index';

describe('@keekuun/keymaster-vue registerVueKeyBinding', () => {
  const originalAdd = window.addEventListener;
  const originalRemove = window.removeEventListener;

  beforeEach(() => {
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  afterEach(() => {
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('triggers handler when matching shortcut is pressed', () => {
    const handler = vi.fn();
    const dispose = registerVueKeyBinding('ctrl+s', handler, { preventDefault: true });

    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    dispose();
  });
});
