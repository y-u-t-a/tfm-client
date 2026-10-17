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
        class="flex items-center gap-2 mb-2"
        @submit.prevent
      >
        <UInput
          v-model.lazy="form.q"
          placeholder="タイトル・本文で絞り込み"
          icon="i-lucide-search"
          class="flex-1 min-w-0"
        />
        <FavoriteButton
          :favorite="form.favorite"
          label="お気に入り"
          class="shrink-0"
          @click="form.favorite = !form.favorite"
        />
      </form>
      <div class="flex flex-wrap items-center gap-1 mb-4">
        <span class="text-sm">公開日</span>
        <DateInput
          v-model="form.from"
          :max="form.to"
          aria-label="公開日の開始"
        />
        <span class="text-sm">〜</span>
        <DateInput
          v-model="form.to"
          :min="form.from"
          aria-label="公開日の終了"
        />
      </div>
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

useHead({
  title: computed(() => data.value ? `${data.value.title} - エピソード` : 'エピソード'),
})

const { isFavorite: isFavoriteProgram, toggleFavorite: toggleFavoriteProgram } = useFavoritePrograms()
const { isFavorite: isFavoriteEpisode } = useFavoriteEpisodes(id)

const form = useEpisodesQuery()

const filteredEpisodes = computed(() => {
  if (!data.value) return []

  const q = form.q.toLowerCase()
  return data.value.episodes.filter((ep) => {
    if (form.favorite && !isFavoriteEpisode(ep.id)) return false
    const publishedDate = toLocalDate(ep.publishedAt)
    if (form.from && publishedDate.compare(form.from) < 0) return false
    if (form.to && publishedDate.compare(form.to) > 0) return false
    return !q || ep.title.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q)
  })
})
</script>
