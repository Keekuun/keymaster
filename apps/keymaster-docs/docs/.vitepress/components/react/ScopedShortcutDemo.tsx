import React, { useState, useRef, useEffect } from 'react';
import { registerKeyBinding } from '@keekuun/keymaster-react';
import './ScopedShortcutDemo.css';

interface ScopedShortcutDemoProps {
  isZh?: boolean;
}

export default function ScopedShortcutDemo({ isZh = false }: ScopedShortcutDemoProps) {
  const [lastAction, setLastAction] = useState('');
  const [message, setMessage] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);

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

  useEffect(() => {
    let cleanupSave: (() => void) | null = null;
    let cleanupSearch: (() => void) | null = null;

    if (editorRef.current) {
      // 只在编辑器区域内生效
      cleanupSave = registerKeyBinding(
        'ctrl+s',
        () => {
          showAction(isZh ? '✅ 保存成功（作用域内触发）' : '✅ Save successful (scoped trigger)');
        },
        {
          scopedElement: editorRef.current,
          preventDefault: true,
        },
      );

      cleanupSearch = registerKeyBinding(
        'ctrl+k',
        () => {
          showAction(isZh ? '🔍 搜索（作用域内触发）' : '🔍 Search (scoped trigger)');
        },
        {
          scopedElement: editorRef.current,
          preventDefault: true,
          stopPropagation: true,
        },
      );
    }

    return () => {
      if (cleanupSave) cleanupSave();
      if (cleanupSearch) cleanupSearch();
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isZh]);

  return (
    <div className="scoped-demo">
      <p className="scoped-demo__title">
        <strong>{isZh ? '作用域快捷键演示' : 'Scoped Shortcut Demo'}</strong>
      </p>
      <p className="scoped-demo__description">
        {isZh
          ? '下面的编辑器区域内的快捷键只在编辑器内生效，点击外部区域后快捷键不会触发。'
          : 'Shortcuts in the editor area below only work within the editor. Clicking outside will not trigger shortcuts.'}
      </p>
      <div className="scoped-demo__editor" ref={editorRef}>
        <textarea
          ref={textareaRef}
          placeholder={
            isZh
              ? '点击这里聚焦，然后按 Ctrl+S 保存（只在编辑器内生效）'
              : 'Click here to focus, then press Ctrl+S to save (only works in editor)'
          }
          rows={4}
        />
        <p className="scoped-demo__hint">
          {isZh ? (
            <>
              提示：按 <kbd>Ctrl</kbd>+<kbd>S</kbd> 保存，按 <kbd>Ctrl</kbd>+<kbd>K</kbd> 搜索
            </>
          ) : (
            <>
              Tip: Press <kbd>Ctrl</kbd>+<kbd>S</kbd> to save, <kbd>Ctrl</kbd>+<kbd>K</kbd> to
              search
            </>
          )}
        </p>
      </div>
      <p className="scoped-demo__status">
        {isZh ? '最近触发：' : 'Last triggered:'}{' '}
        <strong>{lastAction || (isZh ? '暂无' : 'None')}</strong>
      </p>
      {message && <p className="scoped-demo__message">{message}</p>}
    </div>
  );
}
