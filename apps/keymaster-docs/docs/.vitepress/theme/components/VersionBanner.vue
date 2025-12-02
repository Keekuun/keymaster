<template>
  <div v-if="showBanner" class="version-banner">
    <div class="banner-content">
      <span class="banner-icon">ℹ️</span>
      <span class="banner-text">
        你正在查看 <strong>v{{ currentVersion }}</strong> 版本的文档。
        <template v-if="packageName">
          如果你使用的是其他版本，请查看
          <a :href="npmLink" target="_blank" rel="noopener noreferrer" class="banner-link">
            npm 上的所有版本
          </a>
          、
          <a
            href="https://github.com/Keekuun/keymaster/releases"
            target="_blank"
            rel="noopener noreferrer"
            class="banner-link"
          >
            GitHub 发布历史
          </a>
          或
          <a href="/versions" class="banner-link"> 版本管理文档 </a>
          。
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import { versions } from '@theme/utils/versions';

interface Props {
  currentVersion?: string;
  showBanner?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showBanner: true,
});

const route = useRoute();

const packageName = computed(() => {
  const path = route.path;
  if (path.startsWith('/react')) {
    return '@keekuun/keymaster-react';
  } else if (path.startsWith('/vue')) {
    return '@keekuun/keymaster-vue';
  } else if (path.startsWith('/core')) {
    return '@keekuun/keymaster-core';
  }
  return null;
});

const currentVersion = computed(() => {
  if (props.currentVersion) return props.currentVersion;
  const path = route.path;
  if (path.includes('/react/')) {
    return versions.react;
  } else if (path.includes('/vue/')) {
    return versions.vue;
  } else if (path.includes('/core/')) {
    return versions.core;
  }
  return '';
});

const npmLink = computed(() => {
  if (!packageName.value) return '';
  return `https://www.npmjs.com/package/${packageName.value}?activeTab=versions`;
});
</script>

<style scoped>
.version-banner {
  margin: 16px 0;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  border-left: 4px solid var(--vp-c-brand);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.banner-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-text strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.banner-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.banner-link:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .banner-content {
    font-size: 13px;
  }
}
</style>
