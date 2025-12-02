import { describe, it, expect } from 'vitest';
import { parseShortcut, isMatchingShortcut, isEventInScope } from '@core/parser';

describe('keymaster-core parser', () => {
  it('parses simple shortcut like ctrl+s', () => {
    const parsed = parseShortcut('ctrl+s');
    expect(parsed.key).toBe('s');
    expect(parsed.ctrl).toBe(true);
    expect(parsed.alt).toBe(false);
    expect(parsed.shift).toBe(false);
    expect(parsed.meta).toBe(false);
  });

  it('matches keyboard event to parsed shortcut', () => {
    const parsed = parseShortcut('ctrl+s');
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });

    expect(isMatchingShortcut(event, parsed)).toBe(true);
  });

  it('checks scoped element correctly', () => {
    const container = document.createElement('div');
    const child = document.createElement('button');
    container.appendChild(child);

    const eventInScope = new KeyboardEvent('keydown', { bubbles: true });
    child.dispatchEvent(eventInScope);

    expect(isEventInScope(eventInScope, container)).toBe(true);
  });
});
