<template>
  <div class="grid gap-4 grid-cols-1 2xl:grid-cols-2">
    <UCard
      v-for="episode in episodes"
      :key="episode.audio"
      variant="outline"
      class="flex flex-col justify-between overflow-hidden"
    >
      <template #header>
        <NuxtLink :to="`/${programId}/episode/${episode.id}`">
          {{ episode.title }}
        </NuxtLink>
      </template>
      <div class="flex items-start gap-4 mb-2">
        <img
          v-if="episode.thumbnail"
          :src="episode.thumbnail"
          alt="thumbnail"
          class="w-50 h-50 object-cover rounded"
        />
        <p class="line-clamp-3 flex-1">
          {{ episode.description }}
        </p>
      </div>
      <small>
        長さ: {{ episode.length }} / 公開日: {{ new Date(episode.publishedAt).toLocaleString() }}
      </small>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Episode } from '~~/shared/model/episode';

defineProps<{
  programId: string
  episodes: Episode[]
}>()
</script>
