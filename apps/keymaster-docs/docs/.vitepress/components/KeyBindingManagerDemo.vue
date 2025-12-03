<template>
  <div class="manager-demo">
    <p class="manager-demo__title">
      <strong v-if="isZh">KeyBindingManager 演示</strong>
      <strong v-else>KeyBindingManager Demo</strong>
    </p>
    <p class="manager-demo__description">
      <template v-if="isZh">
        使用
        <code>KeyBindingManager</code> 可以统一管理一组相关的快捷键绑定，支持链式调用和批量清理。
      </template>
      <template v-else>
        Use <code>KeyBindingManager</code> to manage a group of related shortcut bindings,
        supporting chaining and batch cleanup.
      </template>
    </p>
    <div class="manager-demo__actions">
      <button @click="enableManager" :disabled="managerEnabled" class="manager-demo__button">
        {{ isZh ? '启用管理器' : 'Enable Manager' }}
      </button>
      <button @click="disableManager" :disabled="!managerEnabled" class="manager-demo__button">
        {{ isZh ? '禁用管理器（清理所有绑定）' : 'Disable Manager (Clear All Bindings)' }}
      </button>
    </div>
    <div v-if="managerEnabled" class="manager-demo__shortcuts">
      <p class="manager-demo__hint">
        {{ isZh ? '管理器已启用，尝试以下快捷键：' : 'Manager enabled, try these shortcuts:' }}
      </p>
      <div class="manager-demo__shortcut-list">
        <div class="manager-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>S</kbd> {{ isZh ? '保存' : 'Save' }}
        </div>
        <div class="manager-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>Z</kbd> {{ isZh ? '撤销' : 'Undo' }}
        </div>
        <div class="manager-demo__shortcut-item">
          <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> {{ isZh ? '重做' : 'Redo' }}
        </div>
      </div>
    </div>
    <p class="manager-demo__status">
      <template v-if="isZh">状态：</template>
      <template v-else>Status:</template>
      <strong>{{
        managerEnabled ? (isZh ? '已启用' : 'Enabled') : isZh ? '已禁用' : 'Disabled'
      }}</strong>
    </p>
    <p class="manager-demo__status">
      <template v-if="isZh">最近触发：</template>
      <template v-else>Last triggered:</template>
      <strong>{{ lastAction || (isZh ? '暂无' : 'None') }}</strong>
    </p>
    <p v-if="message" class="manager-demo__message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, computed } from 'vue';
import { useRoute } from 'vitepress';
import { createKeyBindingManager } from '@keekuun/keymaster-react';

const route = useRoute();
const isZh = computed(() => route.path.startsWith('/zh/'));

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
        showAction(isZh.value ? '💾 保存（通过管理器）' : '💾 Save (via Manager)');
      },
      { preventDefault: true },
    )
    .register('ctrl+z', () => {
      showAction(isZh.value ? '↶ 撤销（通过管理器）' : '↶ Undo (via Manager)');
    })
    .register('ctrl+shift+z', () => {
      showAction(isZh.value ? '↷ 重做（通过管理器）' : '↷ Redo (via Manager)');
    });

  managerEnabled.value = true;
  showAction(isZh.value ? '✅ 管理器已启用' : '✅ Manager enabled');
}

function disableManager() {
  if (manager) {
    manager.dispose();
    manager = null;
    managerEnabled.value = false;
    showAction(
      isZh.value ? '❌ 管理器已禁用，所有绑定已清理' : '❌ Manager disabled, all bindings cleared',
    );
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
