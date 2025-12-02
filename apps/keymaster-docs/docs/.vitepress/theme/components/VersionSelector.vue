<template>
  <div class="version-selector">
    <select
      v-model="selectedVersion"
      @change="handleVersionChange"
      class="version-select"
      aria-label="选择文档版本"
    >
      <option v-for="version in versions" :key="version.value" :value="version.value">
        {{ version.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vitepress';

interface VersionOption {
  value: string;
  label: string;
  link?: string;
}

const router = useRouter();
const route = useRoute();

const selectedVersion = ref('latest');

// 版本列表（可以从 npm API 或配置文件动态获取）
const versions: VersionOption[] = [
  { value: 'latest', label: '最新版本 (v' + currentVersion + ')' },
  { value: 'npm', label: '查看所有版本 (npm)' },
  { value: 'github', label: '查看发布历史 (GitHub)' },
];

// 从配置中获取当前版本（应该从 config.ts 中动态注入）
const currentVersion = '0.1.2';

function handleVersionChange() {
  const version = versions.find((v) => v.value === selectedVersion.value);
  if (!version) return;

  if (version.value === 'latest') {
    // 保持在当前文档
    return;
  } else if (version.value === 'npm') {
    // 根据当前路由判断是哪个包
    const path = route.path;
    if (path.startsWith('/react')) {
      window.open(
        'https://www.npmjs.com/package/@keekuun/keymaster-react?activeTab=versions',
        '_blank',
      );
    } else if (path.startsWith('/vue')) {
      window.open(
        'https://www.npmjs.com/package/@keekuun/keymaster-vue?activeTab=versions',
        '_blank',
      );
    } else if (path.startsWith('/core')) {
      window.open(
        'https://www.npmjs.com/package/@keekuun/keymaster-core?activeTab=versions',
        '_blank',
      );
    }
  } else if (version.value === 'github') {
    window.open('https://github.com/Keekuun/keymaster/releases', '_blank');
  }
}

onMounted(() => {
  selectedVersion.value = 'latest';
});
</script>

<style scoped>
.version-selector {
  display: inline-block;
}

.version-select {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.version-select:hover {
  border-color: var(--vp-c-brand);
}

.version-select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}
</style>
