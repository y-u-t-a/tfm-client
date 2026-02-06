<template>
  <div
    v-if="programs.length > 0"
    class="grid gap-x-4 gap-y-6 grid-cols-2 md:grid-cols-4"
  >
    <div
      v-for="program in programs"
      :key="program.id"
      class="hover:opacity-80"
    >
      <NuxtLink :to="`/${program.id}/episodes`">
        <img
          :src="program.img"
          :alt="program.title"
        >
        <span class="block text-start whitespace-normal break-words">{{ program.title }}</span>
      </NuxtLink>
    </div>
  </div>
  <div v-else>
    該当する番組が見つかりませんでした
  </div>
</template>

<script setup lang="ts">
import type { Program } from '~~/shared/model/program'

defineProps<{
  programs: Program[]
}>()
</script>
