import { describe, it, expect, vi } from 'vitest';
import { registerKeyBinding } from '@react/index';

describe('@keekuun/keymaster-react registerKeyBinding', () => {
  it('triggers handler when matching shortcut is pressed', () => {
    const handler = vi.fn();
    const dispose = registerKeyBinding('ctrl+s', handler, { preventDefault: true });

    // 创建并分发键盘事件
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    dispose();
  });
});
