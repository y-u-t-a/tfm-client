<template>
  <div>
    <AppLoading :loading="pending" />
    <template v-if="data">
      <div
        v-if="episode"
        class="max-w-2xl mx-auto"
      >
        <img
          v-if="episode.thumbnail"
          :src="episode.thumbnail"
          alt="thumbnail"
          class="w-56 aspect-square object-cover rounded-lg mx-auto mb-6"
        >
        <h1 class="text-2xl font-bold mb-1 text-center">
          {{ episode.title }}
        </h1>
        <p class="text-sm text-muted text-center mb-6">
          {{ data.title }} / 公開日: {{ new Date(episode.publishedAt).toLocaleString() }}
        </p>

        <audio
          ref="audioEl"
          :src="episode.audio"
          preload="metadata"
          @play="playing = true"
          @pause="playing = false"
          @ended="playing = false"
          @timeupdate="currentTime = audioEl?.currentTime ?? 0"
          @loadedmetadata="duration = audioEl?.duration ?? 0"
        />

        <USlider
          v-model="sliderTime"
          :max="totalDuration"
          :step="1"
          class="mb-2"
        />
        <div class="flex justify-between text-sm text-muted mb-4">
          <span>{{ formatDuration(currentTime) }}</span>
          <span>{{ formatDuration(totalDuration) }}</span>
        </div>

        <div class="flex items-center justify-center gap-4 mb-4">
          <UButton
            label="15"
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="ghost"
            size="lg"
            @click="skip(-15)"
          />
          <UButton
            :icon="playing ? 'i-lucide-pause' : 'i-lucide-play'"
            color="primary"
            size="xl"
            class="rounded-full p-4"
            @click="togglePlay"
          />
          <UButton
            label="30"
            trailing-icon="i-lucide-rotate-cw"
            color="neutral"
            variant="ghost"
            size="lg"
            @click="skip(30)"
          />
        </div>

        <div class="flex items-center justify-center gap-2 mb-4">
          <UButton
            v-for="rate in PLAYBACK_RATES"
            :key="rate"
            :label="`${rate}x`"
            :variant="rate === playbackRate ? 'solid' : 'soft'"
            color="neutral"
            size="sm"
            @click="setRate(rate)"
          />
        </div>

        <div class="flex justify-center mb-8">
          <UButton
            label="ダウンロード"
            color="neutral"
            variant="soft"
            trailing-icon="i-lucide-download"
            size="sm"
            :loading="downloadingFile !== null"
            @click="download(episode)"
          />
        </div>

        <p class="text-sm whitespace-pre-line">
          {{ episode.description }}
        </p>
      </div>
      <div v-else>
        エピソードが見つかりませんでした
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const PLAYBACK_RATES = [1, 1.25, 1.5, 1.75, 2]

const route = useRoute('program-episodes-episode')
const programId = route.params.program as string
const episodeId = route.params.episode as string

const { data, pending } = useFetch(`/api/${programId}/episodes`, { immediate: true })
const episode = computed(() => data.value?.episodes.find(ep => ep.id === episodeId))

useHead({
  title: computed(() => episode.value ? `${episode.value.title} - 再生` : '再生'),
})

const { downloadingFile, download } = useEpisodeDownload()

const audioEl = useTemplateRef('audioEl')
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const playbackRate = ref(1)

/** audio のメタデータ読み込み前や長さ不明のストリームでは RSS 由来の長さで代用 */
const totalDuration = computed(() =>
  Number.isFinite(duration.value) && duration.value > 0
    ? duration.value
    : episode.value?.durationSeconds ?? 0,
)

const sliderTime = computed({
  get: () => currentTime.value,
  set: (t: number) => {
    if (audioEl.value) audioEl.value.currentTime = t
  },
})

function togglePlay() {
  const audio = audioEl.value
  if (!audio) return
  if (audio.paused) {
    audio.play()
  } else {
    audio.pause()
  }
}

function skip(seconds: number) {
  const audio = audioEl.value
  if (!audio) return
  audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), totalDuration.value)
}

function setRate(rate: number) {
  playbackRate.value = rate
  if (audioEl.value) audioEl.value.playbackRate = rate
}

// 画面に遷移して audio が描画されたら自動再生（ブラウザに拒否された場合は停止状態のまま）
watch(audioEl, (audio) => {
  if (!audio) return
  audio.playbackRate = playbackRate.value
  audio.play().catch(() => {})
})

// OS のメディアコントロール（ロック画面など）に曲情報を表示
watchEffect(() => {
  if (!import.meta.client || !episode.value || !('mediaSession' in navigator)) return
  navigator.mediaSession.metadata = new MediaMetadata({
    title: episode.value.title,
    artist: data.value?.title,
    artwork: episode.value.thumbnail ? [{ src: episode.value.thumbnail }] : [],
  })
})
</script>
