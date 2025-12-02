<template>
  <div class="editor-mode-demo">
    <p class="editor-mode-demo__title">
      <strong>编辑器模式演示</strong>
    </p>
    <p class="editor-mode-demo__description">
      编辑器模式会自动阻止浏览器默认行为，适合代码编辑器、富文本编辑器等场景。
    </p>
    <div class="editor-mode-demo__container">
      <textarea
        ref="editorRef"
        placeholder="在这里输入代码，然后尝试：&#10;Ctrl+S 保存（不会触发浏览器保存页面）&#10;Ctrl+Z 撤销&#10;Ctrl+Shift+Z 重做"
        rows="8"
      />
      <div class="editor-mode-demo__actions">
        <div class="editor-mode-demo__action-item"><kbd>Ctrl</kbd>+<kbd>S</kbd> 保存</div>
        <div class="editor-mode-demo__action-item"><kbd>Ctrl</kbd>+<kbd>Z</kbd> 撤销</div>
        <div class="editor-mode-demo__action-item">
          <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> 重做
        </div>
      </div>
    </div>
    <p class="editor-mode-demo__status">
      最近操作：<strong>{{ lastAction || '暂无' }}</strong>
    </p>
    <p v-if="message" class="editor-mode-demo__message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { registerKeyBinding } from '@keekuun/keymaster-react';

const editorRef = ref<HTMLTextAreaElement | null>(null);
const lastAction = ref('');
const message = ref('');
let timer: number | null = null;

let cleanupSave: (() => void) | null = null;
let cleanupUndo: (() => void) | null = null;
let cleanupRedo: (() => void) | null = null;

function showAction(text: string) {
  lastAction.value = text;
  message.value = text;

  if (timer !== null) {
    window.clearTimeout(timer);
  }

  timer = window.setTimeout(() => {
    message.value = '';
  }, 2000);
}

onMounted(() => {
  // 编辑器模式会自动阻止默认行为
  cleanupSave = registerKeyBinding(
    'ctrl+s',
    () => {
      showAction('💾 保存成功（已阻止浏览器默认保存行为）');
    },
    {
      scopedElement: editorRef.value,
      editorMode: true,
      preventDefault: true,
    },
  );

  cleanupUndo = registerKeyBinding(
    'ctrl+z',
    () => {
      showAction('↶ 撤销');
    },
    {
      scopedElement: editorRef.value,
      editorMode: true,
      preventDefault: true,
    },
  );

  cleanupRedo = registerKeyBinding(
    'ctrl+shift+z',
    () => {
      showAction('↷ 重做');
    },
    {
      scopedElement: editorRef.value,
      editorMode: true,
      preventDefault: true,
    },
  );
});

onBeforeUnmount(() => {
  if (cleanupSave) cleanupSave();
  if (cleanupUndo) cleanupUndo();
  if (cleanupRedo) cleanupRedo();
  if (timer !== null) window.clearTimeout(timer);
});
</script>

<style scoped>
.editor-mode-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
}

.editor-mode-demo__title {
  margin: 0 0 8px;
  font-size: 16px;
}

.editor-mode-demo__description {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.editor-mode-demo__container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 12px;
  background-color: var(--vp-c-bg);
}

.editor-mode-demo__container textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  resize: vertical;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.editor-mode-demo__actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.editor-mode-demo__action-item {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.editor-mode-demo__status {
  margin: 12px 0 4px;
  font-size: 14px;
}

.editor-mode-demo__message {
  margin: 4px 0 0;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

kbd {
  display: inline-block;
  padding: 2px 6px;
  margin: 0 2px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  font-size: 12px;
}
</style>
