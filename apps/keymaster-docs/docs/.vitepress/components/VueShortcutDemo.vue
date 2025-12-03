<template>
  <div class="shortcut-demo">
    <p class="shortcut-demo__title">
      在下方页面任意位置按下
      <kbd>Ctrl</kbd>+<kbd>S</kbd> 或 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 体验快捷键效果。
    </p>
    <p class="shortcut-demo__status">
      最近触发：
      <strong>{{ lastAction || '暂无' }}</strong>
    </p>
    <p v-if="message" class="shortcut-demo__message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useKeyBindingVue } from '@keekuun/keymaster-vue';

const lastAction = ref('');
const message = ref('');
let timer: number | null = null;

function showAction(text: string) {
  lastAction.value = text;
  message.value = '已捕获快捷键：' + text;

  if (timer !== null) {
    window.clearTimeout(timer);
  }

  timer = window.setTimeout(() => {
    message.value = '';
  }, 2000);
}

useKeyBindingVue(
  'ctrl+s',
  () => {
    showAction('保存（Ctrl+S）');
  },
  { preventDefault: true },
);

useKeyBindingVue('ctrl+z', () => {
  showAction('撤销（Ctrl+Z）');
});
</script>

<style scoped>
.shortcut-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
}

.shortcut-demo__title {
  margin: 0 0 8px;
}

.shortcut-demo__status {
  margin: 0 0 4px;
}

.shortcut-demo__message {
  margin: 0;
  color: var(--vp-c-brand-1);
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
