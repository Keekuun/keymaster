<template>
  <div class="scoped-demo">
    <p class="scoped-demo__title">
      <strong v-if="isZh">作用域快捷键演示</strong>
      <strong v-else>Scoped Shortcut Demo</strong>
    </p>
    <p class="scoped-demo__description">
      <template v-if="isZh">
        下面的编辑器区域内的快捷键只在编辑器内生效，点击外部区域后快捷键不会触发。
      </template>
      <template v-else>
        Shortcuts in the editor area below only work within the editor. Clicking outside will not
        trigger shortcuts.
      </template>
    </p>
    <div class="scoped-demo__editor" ref="editorRef">
      <textarea
        ref="textareaRef"
        :placeholder="
          isZh
            ? '点击这里聚焦，然后按 Ctrl+S 保存（只在编辑器内生效）'
            : 'Click here to focus, then press Ctrl+S to save (only works in editor)'
        "
        rows="4"
      />
      <p class="scoped-demo__hint">
        <template v-if="isZh">
          提示：按 <kbd>Ctrl</kbd>+<kbd>S</kbd> 保存，按 <kbd>Ctrl</kbd>+<kbd>K</kbd> 搜索
        </template>
        <template v-else>
          Tip: Press <kbd>Ctrl</kbd>+<kbd>S</kbd> to save, <kbd>Ctrl</kbd>+<kbd>K</kbd> to search
        </template>
      </p>
    </div>
    <p class="scoped-demo__status">
      <template v-if="isZh">最近触发：</template>
      <template v-else>Last triggered:</template>
      <strong>{{ lastAction || (isZh ? '暂无' : 'None') }}</strong>
    </p>
    <p v-if="message" class="scoped-demo__message">
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

const editorRef = ref<HTMLDivElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const lastAction = ref('');
const message = ref('');
let timer: number | null = null;

let cleanupSave: (() => void) | null = null;
let cleanupSearch: (() => void) | null = null;

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
  // 只在编辑器区域内生效
  cleanupSave = registerKeyBinding(
    'ctrl+s',
    () => {
      showAction(
        isZh.value ? '✅ 保存成功（作用域内触发）' : '✅ Save successful (scoped trigger)',
      );
    },
    {
      scopedElement: editorRef.value,
      preventDefault: true,
    },
  );

  cleanupSearch = registerKeyBinding(
    'ctrl+k',
    () => {
      showAction(isZh.value ? '🔍 搜索（作用域内触发）' : '🔍 Search (scoped trigger)');
    },
    {
      scopedElement: editorRef.value,
      preventDefault: true,
      stopPropagation: true,
    },
  );
});

onBeforeUnmount(() => {
  if (cleanupSave) cleanupSave();
  if (cleanupSearch) cleanupSearch();
  if (timer !== null) window.clearTimeout(timer);
});
</script>

<style scoped>
.scoped-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
}

.scoped-demo__title {
  margin: 0 0 8px;
  font-size: 16px;
}

.scoped-demo__description {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.scoped-demo__editor {
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 6px;
  padding: 12px;
  background-color: var(--vp-c-bg);
  margin-bottom: 12px;
}

.scoped-demo__editor textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.scoped-demo__hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.scoped-demo__status {
  margin: 8px 0 4px;
  font-size: 14px;
}

.scoped-demo__message {
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
