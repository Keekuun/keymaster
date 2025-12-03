<template>
  <div class="multiple-shortcuts-demo">
    <p class="multiple-shortcuts-demo__title">
      <strong>多个快捷键组合演示</strong>
    </p>
    <p class="multiple-shortcuts-demo__description">
      在同一个组件中可以绑定多个不同的快捷键，每个快捷键都有独立的处理逻辑。
    </p>
    <div class="multiple-shortcuts-demo__shortcuts">
      <div class="multiple-shortcuts-demo__shortcut-item">
        <kbd>Ctrl</kbd>+<kbd>S</kbd>
        <span>保存</span>
      </div>
      <div class="multiple-shortcuts-demo__shortcut-item">
        <kbd>Ctrl</kbd>+<kbd>Z</kbd>
        <span>撤销</span>
      </div>
      <div class="multiple-shortcuts-demo__shortcut-item">
        <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>
        <span>重做</span>
      </div>
      <div class="multiple-shortcuts-demo__shortcut-item">
        <kbd>Ctrl</kbd>+<kbd>B</kbd>
        <span>加粗</span>
      </div>
      <div class="multiple-shortcuts-demo__shortcut-item">
        <kbd>Ctrl</kbd>+<kbd>I</kbd>
        <span>斜体</span>
      </div>
      <div class="multiple-shortcuts-demo__shortcut-item">
        <kbd>Ctrl</kbd>+<kbd>K</kbd>
        <span>插入链接</span>
      </div>
    </div>
    <p class="multiple-shortcuts-demo__status">
      最近触发：<strong>{{ lastAction || '暂无' }}</strong>
    </p>
    <p v-if="message" class="multiple-shortcuts-demo__message">
      {{ message }}
    </p>
    <div class="multiple-shortcuts-demo__history">
      <p class="multiple-shortcuts-demo__history-title">操作历史：</p>
      <ul class="multiple-shortcuts-demo__history-list">
        <li v-for="(action, index) in history" :key="index">
          {{ action }}
        </li>
        <li v-if="history.length === 0" class="multiple-shortcuts-demo__history-empty">
          暂无操作记录
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { registerKeyBinding } from '@keekuun/keymaster-react';

const lastAction = ref('');
const message = ref('');
const history = ref<string[]>([]);
let timer: number | null = null;

const cleanups: Array<() => void> = [];

function showAction(text: string) {
  lastAction.value = text;
  message.value = text;
  history.value.unshift(text);
  if (history.value.length > 10) {
    history.value = history.value.slice(0, 10);
  }

  if (timer !== null) {
    window.clearTimeout(timer);
  }

  timer = window.setTimeout(() => {
    message.value = '';
  }, 2000);
}

onMounted(() => {
  // 注册多个快捷键
  cleanups.push(
    registerKeyBinding(
      'ctrl+s',
      () => {
        showAction('💾 保存');
      },
      { preventDefault: true },
    ),
  );

  cleanups.push(
    registerKeyBinding('ctrl+z', () => {
      showAction('↶ 撤销');
    }),
  );

  cleanups.push(
    registerKeyBinding('ctrl+shift+z', () => {
      showAction('↷ 重做');
    }),
  );

  cleanups.push(
    registerKeyBinding(
      'ctrl+b',
      () => {
        showAction('**加粗**');
      },
      { preventDefault: true },
    ),
  );

  cleanups.push(
    registerKeyBinding(
      'ctrl+i',
      () => {
        showAction('*斜体*');
      },
      { preventDefault: true },
    ),
  );

  cleanups.push(
    registerKeyBinding(
      'ctrl+k',
      () => {
        showAction('🔗 插入链接');
      },
      { preventDefault: true, stopPropagation: true },
    ),
  );
});

onBeforeUnmount(() => {
  cleanups.forEach((cleanup) => cleanup());
  if (timer !== null) window.clearTimeout(timer);
});
</script>

<style scoped>
.multiple-shortcuts-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.multiple-shortcuts-demo__title {
  margin: 0 0 8px;
  font-size: 16px;
}

.multiple-shortcuts-demo__description {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.multiple-shortcuts-demo__shortcuts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(max-content, 1fr));
  gap: 8px;
  margin-bottom: 12px;
  width: 100%;
  box-sizing: border-box;
}

.multiple-shortcuts-demo__shortcut-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  font-size: 14px;
  white-space: nowrap;
  box-sizing: border-box;
}

.multiple-shortcuts-demo__shortcut-item span {
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.multiple-shortcuts-demo__shortcut-item kbd {
  white-space: nowrap;
}

.multiple-shortcuts-demo__status {
  margin: 12px 0 4px;
  font-size: 14px;
}

.multiple-shortcuts-demo__message {
  margin: 4px 0 0;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.multiple-shortcuts-demo__history {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.multiple-shortcuts-demo__history-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 500;
}

.multiple-shortcuts-demo__history-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  max-height: 120px;
  overflow-y: auto;
}

.multiple-shortcuts-demo__history-empty {
  color: var(--vp-c-text-3);
  font-style: italic;
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
