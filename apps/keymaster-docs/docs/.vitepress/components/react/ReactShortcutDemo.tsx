import React, { useState, useRef } from 'react';
import { useKeyBinding } from '@keekuun/keymaster-react';
import './ReactShortcutDemo.css';

interface ReactShortcutDemoProps {
  isZh?: boolean;
}

export default function ReactShortcutDemo({ isZh = false }: ReactShortcutDemoProps) {
  const [lastAction, setLastAction] = useState('');
  const [message, setMessage] = useState('');
  const timerRef = useRef<number | null>(null);

  function showAction(text: string) {
    setLastAction(text);
    setMessage(isZh ? '已捕获快捷键：' + text : 'Shortcut captured: ' + text);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setMessage('');
      timerRef.current = null;
    }, 2000);
  }

  useKeyBinding(
    'ctrl+s',
    () => {
      showAction(isZh ? '保存（Ctrl+S）' : 'Save (Ctrl+S)');
    },
    { preventDefault: true },
  );

  useKeyBinding('ctrl+z', () => {
    showAction(isZh ? '撤销（Ctrl+Z）' : 'Undo (Ctrl+Z)');
  });

  return (
    <div className="shortcut-demo">
      <p className="shortcut-demo__title">
        {isZh ? (
          <>
            在下方页面任意位置按下 <kbd>Ctrl</kbd>+<kbd>S</kbd> 或 <kbd>Ctrl</kbd>+<kbd>Z</kbd>{' '}
            体验快捷键效果。
          </>
        ) : (
          <>
            Press <kbd>Ctrl</kbd>+<kbd>S</kbd> or <kbd>Ctrl</kbd>+<kbd>Z</kbd> anywhere on the page
            to try the shortcuts.
          </>
        )}
      </p>
      <p className="shortcut-demo__status">
        {isZh ? '最近触发：' : 'Last triggered:'}{' '}
        <strong>{lastAction || (isZh ? '暂无' : 'None')}</strong>
      </p>
      {message && <p className="shortcut-demo__message">{message}</p>}
    </div>
  );
}
