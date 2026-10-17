<template>
  <UApp :locale="ja">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { ja } from '@nuxt/ui/locale'
</script>
