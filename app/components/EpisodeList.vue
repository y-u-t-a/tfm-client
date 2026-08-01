<template>
  <div
    v-if="episodes.length > 0"
    class="grid gap-4 grid-cols-1 2xl:grid-cols-2"
  >
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
          class="w-1/6 aspect-square object-cover rounded"
        >
        <p class="overflow-auto text-sm">
          {{ episode.description }}
        </p>
      </div>
      <small class="flex items-center gap-2">
        <span>
          長さ: {{ formatDuration(episode.durationSeconds) }} / 公開日: {{ new Date(episode.publishedAt).toLocaleString() }}
        </span>
        <UButton
          :to="`/${programId}/episodes/${encodeURIComponent(episode.id)}`"
          label="Play"
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-play"
          size="sm"
        />
        <UButton
          label="Download"
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-download"
          size="sm"
          :disabled="downloadingFile !== null"
          :loading="downloadingFile === episode.audio"
          @click="download(episode)"
        />
      </small>
    </UCard>
  </div>
  <div v-else>
    該当するエピソードが見つかりませんでした
  </div>
</template>

<script setup lang="ts">
import type { Episode } from '~~/shared/model/episode'

defineProps<{
  episodes: Episode[]
  programId: string
}>()

const { downloadingFile, download } = useEpisodeDownload()
</script>
