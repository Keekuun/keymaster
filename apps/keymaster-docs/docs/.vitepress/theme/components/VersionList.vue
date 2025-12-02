<template>
  <ul>
    <li>
      <strong>@keekuun/keymaster-core</strong>: <code>{{ versions.core }}</code>
    </li>
    <li>
      <strong>@keekuun/keymaster-react</strong>: <code>{{ versions.react }}</code>
    </li>
    <li>
      <strong>@keekuun/keymaster-vue</strong>: <code>{{ versions.vue }}</code>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { versions } from '@theme/utils/versions';
</script>
