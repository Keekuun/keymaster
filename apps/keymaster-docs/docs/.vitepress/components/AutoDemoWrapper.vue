<template>
  <component :is="selectedComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';

// Vue 版本组件
import ScopedShortcutDemoVue from './ScopedShortcutDemo.vue';
import EditorModeDemoVue from './EditorModeDemo.vue';
import MultipleShortcutsDemoVue from './MultipleShortcutsDemo.vue';
import KeyBindingManagerDemoVue from './KeyBindingManagerDemo.vue';

// React 版本组件
import ScopedShortcutDemoWrapper from './react/ScopedShortcutDemoWrapper.vue';
import EditorModeDemoWrapper from './react/EditorModeDemoWrapper.vue';
import MultipleShortcutsDemoWrapper from './react/MultipleShortcutsDemoWrapper.vue';
import KeyBindingManagerDemoWrapper from './react/KeyBindingManagerDemoWrapper.vue';

interface Props {
  vueComponent: any;
  reactComponent: any;
}

const props = defineProps<Props>();
const route = useRoute();

const isReactRoute = computed(() => {
  const path = route.path;
  return path.startsWith('/react/') || path.startsWith('/zh/react/');
});

const selectedComponent = computed(() => {
  return isReactRoute.value ? props.reactComponent : props.vueComponent;
});
</script>
