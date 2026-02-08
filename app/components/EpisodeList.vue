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
          長さ: {{ formatDuration(episode.durationSeconds) }} / 公開日: {{ new Date(episode.publishedAt).toLocaleString() }}
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
</template>

<script setup lang="ts">
import type { Episode } from '~~/shared/model/episode'

defineProps<{
  programId: string
  episodes: Episode[]
}>()

const toast = useToast()
const downloadingFile = ref<string | null>(null)

async function download(episode: Episode) {
  downloadingFile.value = episode.audio
  const controller = new AbortController()
  const { id } = toast.add({
    title: 'ダウンロード中...',
    icon: 'i-lucide-download',
    color: 'info',
    duration: 0,
    close: false,
    orientation: 'horizontal',
    actions: [{
      label: 'キャンセル',
      color: 'info',
      variant: 'outline',
      onClick: () => controller.abort(),
    }],
  })
  try {
    const res = await fetch(episode.audio, { signal: controller.signal })
    const blob = await res.blob()
    toast.remove(id)
    toast.add({ title: 'ダウンロード完了', icon: 'i-lucide-check', color: 'success', progress: false })

    // ファイル保存ダイアログの表示
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${episode.title.replace(/[\\/:*?"<>|]/g, '_')}.mp3`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    toast.remove(id)
    if (e instanceof DOMException && e.name === 'AbortError') {
      toast.add({ title: 'ダウンロードをキャンセルしました', icon: 'i-lucide-circle-x', color: 'warning', progress: false })
    } else {
      toast.add({ title: 'ダウンロードに失敗しました', icon: 'i-lucide-circle-x', color: 'error', progress: false })
    }
  } finally {
    downloadingFile.value = null
  }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
</script>
