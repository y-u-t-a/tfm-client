<template>
  <div>
    <AppLoading :loading="pending" />
    <template v-if="data">
      <div class="flex items-start mb-4">
        <FavoriteButton
          :favorite="isFavoriteProgram(id)"
          @click="toggleFavoriteProgram(id)"
        />
        <h1 class="text-2xl font-bold">
          {{ data.title }}
        </h1>
      </div>
      <form
        class="flex items-center gap-2 mb-4"
        @submit.prevent
      >
        <UInput
          v-model="filter.q"
          placeholder="タイトル・本文で絞り込み"
          icon="i-lucide-search"
          class="flex-1 min-w-0"
          @change="search"
        />
        <FavoriteButton
          :favorite="filter.favorite"
          label="お気に入り"
          class="shrink-0"
          @click="toggleFavoriteOnly"
        />
      </form>
      <EpisodeList
        :episodes="filteredEpisodes"
        :program-id="id"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute('program-episodes')
const id = route.params.program as string

const { data, pending } = useFetch(`/api/${id}/episodes`, { immediate: true })
const router = useRouter()

useHead({
  title: computed(() => data.value ? `${data.value.title} - エピソード` : 'エピソード'),
})

const { isFavorite: isFavoriteProgram, toggleFavorite: toggleFavoriteProgram } = useFavoritePrograms()
const { isFavorite: isFavoriteEpisode } = useFavoriteEpisodes(id)

const filter = reactive({ q: '', favorite: false })

const filteredEpisodes = computed(() => {
  if (!data.value) return []

  const episodes = route.query.favorite === '1'
    ? data.value.episodes.filter(ep => isFavoriteEpisode(ep.id))
    : data.value.episodes
  const q = ((route.query.q as string) || '').toLowerCase()
  if (!q) return episodes
  return episodes.filter(ep =>
    ep.title.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q),
  )
})

watch(() => route.query, (query) => {
  filter.q = (query.q as string) || ''
  filter.favorite = query.favorite === '1'
}, { immediate: true })

/**
 * フォームの条件をまとめて URL に反映する。
 */
function search() {
  router.push({ query: { q: filter.q || undefined, favorite: filter.favorite ? '1' : undefined } })
}

function toggleFavoriteOnly() {
  filter.favorite = !filter.favorite
  search()
}
</script>
