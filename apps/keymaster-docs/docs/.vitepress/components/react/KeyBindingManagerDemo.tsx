import React, { useState, useRef } from 'react';
import { createKeyBindingManager } from '@keekuun/keymaster-react';
import './KeyBindingManagerDemo.css';

interface KeyBindingManagerDemoProps {
  isZh?: boolean;
}

export default function KeyBindingManagerDemo({ isZh = false }: KeyBindingManagerDemoProps) {
  const [managerEnabled, setManagerEnabled] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const [message, setMessage] = useState('');
  const timerRef = useRef<number | null>(null);
  const managerRef = useRef<ReturnType<typeof createKeyBindingManager> | null>(null);

  function showAction(text: string) {
    setLastAction(text);
    setMessage(text);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setMessage('');
      timerRef.current = null;
    }, 2000);
  }

  function enableManager() {
    if (managerRef.current) return;

    managerRef.current = createKeyBindingManager();

    // 链式注册多个快捷键
    managerRef.current
      .register(
        'ctrl+s',
        () => {
          showAction(isZh ? '💾 保存（通过管理器）' : '💾 Save (via Manager)');
        },
        { preventDefault: true },
      )
      .register('ctrl+z', () => {
        showAction(isZh ? '↶ 撤销（通过管理器）' : '↶ Undo (via Manager)');
      })
      .register('ctrl+shift+z', () => {
        showAction(isZh ? '↷ 重做（通过管理器）' : '↷ Redo (via Manager)');
      });

    setManagerEnabled(true);
    showAction(isZh ? '✅ 管理器已启用' : '✅ Manager enabled');
  }

  function disableManager() {
    if (managerRef.current) {
      managerRef.current.dispose();
      managerRef.current = null;
      setManagerEnabled(false);
      showAction(
        isZh ? '❌ 管理器已禁用，所有绑定已清理' : '❌ Manager disabled, all bindings cleared',
      );
    }
  }

  React.useEffect(() => {
    return () => {
      if (managerRef.current) {
        managerRef.current.dispose();
      }
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="manager-demo">
      <p className="manager-demo__title">
        <strong>{isZh ? 'KeyBindingManager 演示' : 'KeyBindingManager Demo'}</strong>
      </p>
      <p className="manager-demo__description">
        {isZh ? (
          <>
            使用 <code>KeyBindingManager</code>{' '}
            可以统一管理一组相关的快捷键绑定，支持链式调用和批量清理。
          </>
        ) : (
          <>
            Use <code>KeyBindingManager</code> to manage a group of related shortcut bindings,
            supporting chaining and batch cleanup.
          </>
        )}
      </p>
      <div className="manager-demo__actions">
        <button onClick={enableManager} disabled={managerEnabled} className="manager-demo__button">
          {isZh ? '启用管理器' : 'Enable Manager'}
        </button>
        <button
          onClick={disableManager}
          disabled={!managerEnabled}
          className="manager-demo__button"
        >
          {isZh ? '禁用管理器（清理所有绑定）' : 'Disable Manager (Clear All Bindings)'}
        </button>
      </div>
      {managerEnabled && (
        <div className="manager-demo__shortcuts">
          <p className="manager-demo__hint">
            {isZh ? '管理器已启用，尝试以下快捷键：' : 'Manager enabled, try these shortcuts:'}
          </p>
          <div className="manager-demo__shortcut-list">
            <div className="manager-demo__shortcut-item">
              <kbd>Ctrl</kbd>+<kbd>S</kbd> {isZh ? '保存' : 'Save'}
            </div>
            <div className="manager-demo__shortcut-item">
              <kbd>Ctrl</kbd>+<kbd>Z</kbd> {isZh ? '撤销' : 'Undo'}
            </div>
            <div className="manager-demo__shortcut-item">
              <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> {isZh ? '重做' : 'Redo'}
            </div>
          </div>
        </div>
      )}
      <p className="manager-demo__status">
        {isZh ? '状态：' : 'Status:'}{' '}
        <strong>
          {managerEnabled ? (isZh ? '已启用' : 'Enabled') : isZh ? '已禁用' : 'Disabled'}
        </strong>
      </p>
      <p className="manager-demo__status">
        {isZh ? '最近触发：' : 'Last triggered:'}{' '}
        <strong>{lastAction || (isZh ? '暂无' : 'None')}</strong>
      </p>
      {message && <p className="manager-demo__message">{message}</p>}
    </div>
  );
}
