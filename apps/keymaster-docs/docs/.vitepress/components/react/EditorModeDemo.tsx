import React, { useState, useRef, useEffect } from 'react';
import { registerKeyBinding } from '@keekuun/keymaster-react';
import './EditorModeDemo.css';

interface EditorModeDemoProps {
  isZh?: boolean;
}

export default function EditorModeDemo({ isZh = false }: EditorModeDemoProps) {
  const [lastAction, setLastAction] = useState('');
  const [message, setMessage] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
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
    let cleanupUndo: (() => void) | null = null;
    let cleanupRedo: (() => void) | null = null;

    if (editorRef.current) {
      // 编辑器模式会自动阻止默认行为
      cleanupSave = registerKeyBinding(
        'ctrl+s',
        () => {
          showAction(
            isZh
              ? '💾 保存成功（已阻止浏览器默认保存行为）'
              : '💾 Save successful (browser default prevented)',
          );
        },
        {
          scopedElement: editorRef.current,
          editorMode: true,
          preventDefault: true,
        },
      );

      cleanupUndo = registerKeyBinding(
        'ctrl+z',
        () => {
          showAction(isZh ? '↶ 撤销' : '↶ Undo');
        },
        {
          scopedElement: editorRef.current,
          editorMode: true,
          preventDefault: true,
        },
      );

      cleanupRedo = registerKeyBinding(
        'ctrl+shift+z',
        () => {
          showAction(isZh ? '↷ 重做' : '↷ Redo');
        },
        {
          scopedElement: editorRef.current,
          editorMode: true,
          preventDefault: true,
        },
      );
    }

    return () => {
      if (cleanupSave) cleanupSave();
      if (cleanupUndo) cleanupUndo();
      if (cleanupRedo) cleanupRedo();
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isZh]);

  return (
    <div className="editor-mode-demo">
      <p className="editor-mode-demo__title">
        <strong>{isZh ? '编辑器模式演示' : 'Editor Mode Demo'}</strong>
      </p>
      <p className="editor-mode-demo__description">
        {isZh
          ? '编辑器模式会自动阻止浏览器默认行为，适合代码编辑器、富文本编辑器等场景。'
          : 'Editor mode automatically prevents browser default behavior, suitable for code editors, rich text editors, etc.'}
      </p>
      <div className="editor-mode-demo__container">
        <textarea
          ref={editorRef}
          placeholder={
            isZh
              ? '在这里输入代码，然后尝试：\nCtrl+S 保存（不会触发浏览器保存页面）\nCtrl+Z 撤销\nCtrl+Shift+Z 重做'
              : "Type code here, then try:\nCtrl+S Save (won't trigger browser save)\nCtrl+Z Undo\nCtrl+Shift+Z Redo"
          }
          rows={8}
        />
        <div className="editor-mode-demo__actions">
          <div className="editor-mode-demo__action-item">
            <kbd>Ctrl</kbd>+<kbd>S</kbd> {isZh ? '保存' : 'Save'}
          </div>
          <div className="editor-mode-demo__action-item">
            <kbd>Ctrl</kbd>+<kbd>Z</kbd> {isZh ? '撤销' : 'Undo'}
          </div>
          <div className="editor-mode-demo__action-item">
            <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> {isZh ? '重做' : 'Redo'}
          </div>
        </div>
      </div>
      <p className="editor-mode-demo__status">
        {isZh ? '最近操作：' : 'Last action:'}{' '}
        <strong>{lastAction || (isZh ? '暂无' : 'None')}</strong>
      </p>
      {message && <p className="editor-mode-demo__message">{message}</p>}
    </div>
  );
}
