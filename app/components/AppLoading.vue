<template>
  <div v-if="loading">
    Loading...
    <UProgress />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>()
</script>
