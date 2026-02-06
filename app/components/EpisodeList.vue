<template>
  <div class="grid gap-4 grid-cols-1 2xl:grid-cols-2">
    <UCard
      v-for="episode in episodes"
      :key="episode.audio"
      variant="outline"
      class="flex flex-col justify-between"
    >
      <template #header>
        {{ episode.title }}
      </template>
      <div class="flex items-start gap-4 mb-2">
        <img
          v-if="episode.thumbnail"
          :src="episode.thumbnail"
          alt="thumbnail"
          class="w-50 h-30 object-cover rounded"
        >
        <p class="h-30 overflow-auto">
          {{ episode.description }}
        </p>
      </div>
      <small class="flex items-center gap-2">
        <span>
          長さ: {{ episode.length }} / 公開日: {{ new Date(episode.publishedAt).toLocaleString() }}
        </span>
        <UButton
          :href="episode.audio"
          target="_blank"
          label="Play"
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-external-link"
          size="sm"
        />
      </small>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Episode } from '~~/shared/model/episode'

defineProps<{
  programId: string
  episodes: Episode[]
}>()
</script>
