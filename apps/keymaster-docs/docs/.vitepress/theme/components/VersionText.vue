<template>
  <span>v{{ version }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import { versions } from '@theme/utils/versions';

const route = useRoute();

const version = computed(() => {
  const path = route.path;
  if (path.startsWith('/react')) {
    return versions.react;
  } else if (path.startsWith('/vue')) {
    return versions.vue;
  } else if (path.startsWith('/core')) {
    return versions.core;
  }
  return '';
});
</script>
