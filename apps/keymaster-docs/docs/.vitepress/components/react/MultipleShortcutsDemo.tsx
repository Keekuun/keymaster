import React, { useState, useEffect } from 'react';
import { registerKeyBinding } from '@keekuun/keymaster-react';
import './MultipleShortcutsDemo.css';

interface MultipleShortcutsDemoProps {
  isZh?: boolean;
}

export default function MultipleShortcutsDemo({ isZh = false }: MultipleShortcutsDemoProps) {
  const [lastAction, setLastAction] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const timerRef = React.useRef<number | null>(null);
  const cleanupsRef = React.useRef<Array<() => void>>([]);

  function showAction(text: string) {
    setLastAction(text);
    setMessage(text);
    setHistory((prev) => {
      const newHistory = [text, ...prev];
      return newHistory.slice(0, 10);
    });

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setMessage('');
      timerRef.current = null;
    }, 2000);
  }

  useEffect(() => {
    // 注册多个快捷键
    cleanupsRef.current.push(
      registerKeyBinding(
        'ctrl+s',
        () => {
          showAction(isZh ? '💾 保存' : '💾 Save');
        },
        { preventDefault: true },
      ),
    );

    cleanupsRef.current.push(
      registerKeyBinding('ctrl+z', () => {
        showAction(isZh ? '↶ 撤销' : '↶ Undo');
      }),
    );

    cleanupsRef.current.push(
      registerKeyBinding('ctrl+shift+z', () => {
        showAction(isZh ? '↷ 重做' : '↷ Redo');
      }),
    );

    cleanupsRef.current.push(
      registerKeyBinding(
        'ctrl+b',
        () => {
          showAction(isZh ? '**加粗**' : '**Bold**');
        },
        { preventDefault: true },
      ),
    );

    cleanupsRef.current.push(
      registerKeyBinding(
        'ctrl+i',
        () => {
          showAction(isZh ? '*斜体*' : '*Italic*');
        },
        { preventDefault: true },
      ),
    );

    cleanupsRef.current.push(
      registerKeyBinding(
        'ctrl+k',
        () => {
          showAction(isZh ? '🔗 插入链接' : '🔗 Insert Link');
        },
        { preventDefault: true, stopPropagation: true },
      ),
    );

    return () => {
      cleanupsRef.current.forEach((cleanup) => cleanup());
      cleanupsRef.current = [];
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isZh]);

  return (
    <div className="multiple-shortcuts-demo">
      <p className="multiple-shortcuts-demo__title">
        <strong>{isZh ? '多个快捷键组合演示' : 'Multiple Shortcuts Demo'}</strong>
      </p>
      <p className="multiple-shortcuts-demo__description">
        {isZh
          ? '在同一个组件中可以绑定多个不同的快捷键，每个快捷键都有独立的处理逻辑。'
          : 'Multiple different shortcuts can be bound in the same component, each with independent handling logic.'}
      </p>
      <div className="multiple-shortcuts-demo__shortcuts">
        <div className="multiple-shortcuts-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>S</kbd>
          <span>{isZh ? '保存' : 'Save'}</span>
        </div>
        <div className="multiple-shortcuts-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>Z</kbd>
          <span>{isZh ? '撤销' : 'Undo'}</span>
        </div>
        <div className="multiple-shortcuts-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>
          <span>{isZh ? '重做' : 'Redo'}</span>
        </div>
        <div className="multiple-shortcuts-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>B</kbd>
          <span>{isZh ? '加粗' : 'Bold'}</span>
        </div>
        <div className="multiple-shortcuts-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>I</kbd>
          <span>{isZh ? '斜体' : 'Italic'}</span>
        </div>
        <div className="multiple-shortcuts-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>K</kbd>
          <span>{isZh ? '插入链接' : 'Insert Link'}</span>
        </div>
      </div>
      <p className="multiple-shortcuts-demo__status">
        {isZh ? '最近触发：' : 'Last triggered:'}{' '}
        <strong>{lastAction || (isZh ? '暂无' : 'None')}</strong>
      </p>
      {message && <p className="multiple-shortcuts-demo__message">{message}</p>}
      <div className="multiple-shortcuts-demo__history">
        <p className="multiple-shortcuts-demo__history-title">
          {isZh ? '操作历史：' : 'Action History:'}
        </p>
        <ul className="multiple-shortcuts-demo__history-list">
          {history.length === 0 ? (
            <li className="multiple-shortcuts-demo__history-empty">
              {isZh ? '暂无操作记录' : 'No action records'}
            </li>
          ) : (
            history.map((action, index) => <li key={index}>{action}</li>)
          )}
        </ul>
      </div>
    </div>
  );
}
