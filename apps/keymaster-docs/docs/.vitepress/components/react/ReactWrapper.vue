<template>
  <div ref="containerRef"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue';
import { useRoute } from 'vitepress';
import { createRoot, Root } from 'react-dom/client';
import React from 'react';

interface Props {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

const props = defineProps<Props>();

const route = useRoute();
const isZh = computed(() => route.path.startsWith('/zh/'));
const containerRef = ref<HTMLDivElement | null>(null);
let root: Root | null = null;

function renderReactComponent() {
  if (containerRef.value && root) {
    const reactProps = {
      isZh: isZh.value,
      ...props.props,
    };
    root.render(React.createElement(props.component, reactProps));
  }
}

onMounted(() => {
  if (containerRef.value) {
    root = createRoot(containerRef.value);
    renderReactComponent();
  }
});

// 监听路由变化，更新 React 组件
watch(isZh, () => {
  renderReactComponent();
});

// 监听 props 变化
watch(
  () => props.props,
  () => {
    renderReactComponent();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (root) {
    root.unmount();
    root = null;
  }
});
</script>

<style scoped>
/* React 组件的样式在各自的 CSS 文件中定义 */
</style>
