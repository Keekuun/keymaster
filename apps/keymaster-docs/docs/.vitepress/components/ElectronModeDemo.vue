<template>
  <div class="electron-demo">
    <p class="electron-demo__title">
      <strong v-if="isZh">Electron 模式演示</strong>
      <strong v-else>Electron Mode Demo</strong>
    </p>
    <p class="electron-demo__description">
      <template v-if="isZh">
        Electron 模式适配桌面应用场景，可以通过 <code>electronHook</code> 扩展或拦截 Electron
        特定的行为。
      </template>
      <template v-else>
        Electron mode adapts to desktop application scenarios, allowing you to extend or intercept
        Electron-specific behaviors via <code>electronHook</code>.
      </template>
    </p>
    <div class="electron-demo__info">
      <p class="electron-demo__info-item">
        <strong>{{ isZh ? '当前环境：' : 'Current Environment:' }}</strong>
        <span>{{
          isElectron
            ? isZh
              ? 'Electron 环境'
              : 'Electron Environment'
            : isZh
              ? '浏览器环境（仅演示）'
              : 'Browser Environment (Demo Only)'
        }}</span>
      </p>
      <p v-if="electronInfo" class="electron-demo__info-item">
        <strong>{{ isZh ? 'Electron 信息：' : 'Electron Info:' }}</strong>
        <code>{{ electronInfo }}</code>
      </p>
    </div>
    <div class="electron-demo__shortcuts">
      <p class="electron-demo__hint">
        {{
          isZh
            ? '尝试以下快捷键（在 Electron 环境中会触发 hook）：'
            : 'Try these shortcuts (will trigger hook in Electron environment):'
        }}
      </p>
      <div class="electron-demo__shortcut-item">
        <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd> {{ isZh ? '重新加载' : 'Reload' }}
      </div>
      <div class="electron-demo__shortcut-item">
        <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> {{ isZh ? '开发者工具' : 'DevTools' }}
      </div>
    </div>
    <p class="electron-demo__status">
      <template v-if="isZh">最近触发：</template>
      <template v-else>Last triggered:</template>
      <strong>{{ lastAction || (isZh ? '暂无' : 'None') }}</strong>
    </p>
    <p v-if="message" class="electron-demo__message">
      {{ message }}
    </p>
    <div v-if="hookLogs.length > 0" class="electron-demo__logs">
      <p class="electron-demo__logs-title">
        {{ isZh ? 'Hook 日志：' : 'Hook Logs:' }}
      </p>
      <ul class="electron-demo__logs-list">
        <li v-for="(log, index) in hookLogs" :key="index">
          {{ log }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { useRoute } from 'vitepress';
import { registerKeyBinding } from '@keekuun/keymaster-react';
import { isElectronEnvironment, getElectronProcessInfo } from '@keekuun/keymaster-core';

const route = useRoute();
const isZh = computed(() => route.path.startsWith('/zh/'));

const isElectron = ref(false);
const electronInfo = ref('');
const lastAction = ref('');
const message = ref('');
const hookLogs = ref<string[]>([]);
let timer: number | null = null;

let cleanupReload: (() => void) | null = null;
let cleanupDevTools: (() => void) | null = null;

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

function addHookLog(log: string) {
  hookLogs.value.unshift(log);
  if (hookLogs.value.length > 5) {
    hookLogs.value = hookLogs.value.slice(0, 5);
  }
}

onMounted(() => {
  // 检测 Electron 环境
  isElectron.value = isElectronEnvironment();
  if (isElectron.value) {
    const info = getElectronProcessInfo();
    electronInfo.value = JSON.stringify(info, null, 2);
  }

  // Electron 模式示例
  cleanupReload = registerKeyBinding(
    'ctrl+alt+r',
    () => {
      showAction(isZh.value ? '🔄 重新加载（Electron 模式）' : '🔄 Reload (Electron Mode)');
      if (isElectron.value && (window as any).electron?.ipcRenderer) {
        (window as any).electron.ipcRenderer.send('shortcut:reload');
      }
    },
    {
      electronMode: true,
      electronHook: ({ parsed, processInfo, versions }) => {
        const log = isZh.value
          ? `[electronHook] 快捷键: ${parsed.key}, 进程: ${processInfo?.type || 'unknown'}, Electron版本: ${versions?.electron || 'N/A'}`
          : `[electronHook] Shortcut: ${parsed.key}, Process: ${processInfo?.type || 'unknown'}, Electron Version: ${versions?.electron || 'N/A'}`;
        addHookLog(log);
        console.log('[electronHook]', { parsed, processInfo, versions });
        return true;
      },
    },
  );

  cleanupDevTools = registerKeyBinding(
    'ctrl+shift+i',
    () => {
      showAction(isZh.value ? '🛠️ 开发者工具（Electron 模式）' : '🛠️ DevTools (Electron Mode)');
      if (isElectron.value && (window as any).electron?.ipcRenderer) {
        (window as any).electron.ipcRenderer.send('shortcut:devtools');
      }
    },
    {
      electronMode: true,
      electronHook: ({ parsed, processInfo, versions }) => {
        const log = isZh.value
          ? `[electronHook] 快捷键: ${parsed.key}, 进程: ${processInfo?.type || 'unknown'}`
          : `[electronHook] Shortcut: ${parsed.key}, Process: ${processInfo?.type || 'unknown'}`;
        addHookLog(log);
        return true;
      },
    },
  );
});

onBeforeUnmount(() => {
  if (cleanupReload) cleanupReload();
  if (cleanupDevTools) cleanupDevTools();
  if (timer !== null) window.clearTimeout(timer);
});
</script>

<style scoped>
.electron-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
}

.electron-demo__title {
  margin: 0 0 8px;
  font-size: 16px;
}

.electron-demo__description {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.electron-demo__description code {
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--vp-c-bg-alt);
  font-size: 13px;
}

.electron-demo__info {
  margin: 12px 0;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
}

.electron-demo__info-item {
  margin: 0 0 8px;
  font-size: 14px;
}

.electron-demo__info-item:last-child {
  margin-bottom: 0;
}

.electron-demo__info-item code {
  display: block;
  margin-top: 4px;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--vp-c-bg-alt);
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

.electron-demo__shortcuts {
  margin: 12px 0;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
}

.electron-demo__hint {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.electron-demo__shortcut-item {
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.electron-demo__status {
  margin: 12px 0 4px;
  font-size: 14px;
}

.electron-demo__message {
  margin: 4px 0 0;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.electron-demo__logs {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.electron-demo__logs-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 500;
}

.electron-demo__logs-list {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  max-height: 100px;
  overflow-y: auto;
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
