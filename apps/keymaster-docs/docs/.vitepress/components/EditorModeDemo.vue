<template>
  <div class="editor-mode-demo">
    <p class="editor-mode-demo__title">
      <strong v-if="isZh">编辑器模式演示</strong>
      <strong v-else>Editor Mode Demo</strong>
    </p>
    <p class="editor-mode-demo__description">
      <template v-if="isZh">
        编辑器模式会自动阻止浏览器默认行为，适合代码编辑器、富文本编辑器等场景。
      </template>
      <template v-else>
        Editor mode automatically prevents browser default behavior, suitable for code editors, rich
        text editors, etc.
      </template>
    </p>
    <div class="editor-mode-demo__container">
      <textarea
        ref="editorRef"
        :placeholder="
          isZh
            ? '在这里输入代码，然后尝试：\nCtrl+S 保存（不会触发浏览器保存页面）\nCtrl+Z 撤销\nCtrl+Shift+Z 重做'
            : 'Type code here, then try:\nCtrl+S Save (won\'t trigger browser save)\nCtrl+Z Undo\nCtrl+Shift+Z Redo'
        "
        rows="8"
      />
      <div class="editor-mode-demo__actions">
        <div class="editor-mode-demo__action-item">
          <kbd>Ctrl</kbd>+<kbd>S</kbd> {{ isZh ? '保存' : 'Save' }}
        </div>
        <div class="editor-mode-demo__action-item">
          <kbd>Ctrl</kbd>+<kbd>Z</kbd> {{ isZh ? '撤销' : 'Undo' }}
        </div>
        <div class="editor-mode-demo__action-item">
          <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> {{ isZh ? '重做' : 'Redo' }}
        </div>
      </div>
    </div>
    <p class="editor-mode-demo__status">
      <template v-if="isZh">最近操作：</template>
      <template v-else>Last action:</template>
      <strong>{{ lastAction || (isZh ? '暂无' : 'None') }}</strong>
    </p>
    <p v-if="message" class="editor-mode-demo__message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { useRoute } from 'vitepress';
import { registerKeyBinding } from '@keekuun/keymaster-react';

const route = useRoute();
const isZh = computed(() => route.path.startsWith('/zh/'));

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
      showAction(
        isZh.value
          ? '💾 保存成功（已阻止浏览器默认保存行为）'
          : '💾 Save successful (browser default prevented)',
      );
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
      showAction(isZh.value ? '↶ 撤销' : '↶ Undo');
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
      showAction(isZh.value ? '↷ 重做' : '↷ Redo');
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
