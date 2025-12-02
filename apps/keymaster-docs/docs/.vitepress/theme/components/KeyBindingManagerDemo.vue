<template>
  <div class="manager-demo">
    <p class="manager-demo__title">
      <strong>KeyBindingManager 演示</strong>
    </p>
    <p class="manager-demo__description">
      使用 <code>KeyBindingManager</code> 可以统一管理一组相关的快捷键绑定，支持链式调用和批量清理。
    </p>
    <div class="manager-demo__actions">
      <button @click="enableManager" :disabled="managerEnabled" class="manager-demo__button">
        启用管理器
      </button>
      <button @click="disableManager" :disabled="!managerEnabled" class="manager-demo__button">
        禁用管理器（清理所有绑定）
      </button>
    </div>
    <div v-if="managerEnabled" class="manager-demo__shortcuts">
      <p class="manager-demo__hint">管理器已启用，尝试以下快捷键：</p>
      <div class="manager-demo__shortcut-list">
        <div class="manager-demo__shortcut-item"><kbd>Ctrl</kbd>+<kbd>S</kbd> 保存</div>
        <div class="manager-demo__shortcut-item"><kbd>Ctrl</kbd>+<kbd>Z</kbd> 撤销</div>
        <div class="manager-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> 重做
        </div>
      </div>
    </div>
    <p class="manager-demo__status">
      状态：<strong>{{ managerEnabled ? '已启用' : '已禁用' }}</strong>
    </p>
    <p class="manager-demo__status">
      最近触发：<strong>{{ lastAction || '暂无' }}</strong>
    </p>
    <p v-if="message" class="manager-demo__message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { createKeyBindingManager } from '@keekuun/keymaster-react';

const managerEnabled = ref(false);
const lastAction = ref('');
const message = ref('');
let timer: number | null = null;
let manager: ReturnType<typeof createKeyBindingManager> | null = null;

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

function enableManager() {
  if (manager) return;

  manager = createKeyBindingManager();

  // 链式注册多个快捷键
  manager
    .register(
      'ctrl+s',
      () => {
        showAction('💾 保存（通过管理器）');
      },
      { preventDefault: true },
    )
    .register('ctrl+z', () => {
      showAction('↶ 撤销（通过管理器）');
    })
    .register('ctrl+shift+z', () => {
      showAction('↷ 重做（通过管理器）');
    });

  managerEnabled.value = true;
  showAction('✅ 管理器已启用');
}

function disableManager() {
  if (manager) {
    manager.dispose();
    manager = null;
    managerEnabled.value = false;
    showAction('❌ 管理器已禁用，所有绑定已清理');
  }
}

onBeforeUnmount(() => {
  disableManager();
  if (timer !== null) window.clearTimeout(timer);
});
</script>

<style scoped>
.manager-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
}

.manager-demo__title {
  margin: 0 0 8px;
  font-size: 16px;
}

.manager-demo__description {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.manager-demo__description code {
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--vp-c-bg-alt);
  font-size: 13px;
}

.manager-demo__actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.manager-demo__button {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.manager-demo__button:hover:not(:disabled) {
  background-color: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand-1);
}

.manager-demo__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.manager-demo__shortcuts {
  margin: 12px 0;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
}

.manager-demo__hint {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.manager-demo__shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.manager-demo__shortcut-item {
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.manager-demo__status {
  margin: 8px 0 4px;
  font-size: 14px;
}

.manager-demo__message {
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
