<template>
  <span>{{ allVersions }}</span>
</template>

<script setup lang="ts">
import { versionData } from '@theme/utils/version-data';

const allVersions = versionData.allVersions;
</script>
