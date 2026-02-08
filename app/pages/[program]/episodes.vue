<template>
  <div>
    <AppLoading :loading="pending" />
    <template v-if="data">
      <h1 class="text-2xl font-bold mb-4">
        {{ data.title }}
      </h1>
      <UInput
        v-model.lazy="filterText"
        placeholder="タイトル・本文で絞り込み"
        icon="i-lucide-search"
        class="mb-4 w-full"
      />
      <EpisodeList
        :program-id="id"
        :episodes="filteredEpisodes"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute('program-episodes')
const id = route.params.program as string

const { execute, data, pending } = useFetch(`/api/${id}/episodes`, { immediate: false })
const router = useRouter()

useHead({
  title: computed(() => data.value ? `${data.value.title} - エピソード` : 'エピソード'),
})

const filterText = computed({
  get: () => (route.query.q as string) || '',
  set: q => router.push({ query: q ? { q } : {} }),
})
const filteredEpisodes = computed(() => {
  if (!data.value) return []

  const q = filterText.value.toLowerCase()
  if (!q) return data.value.episodes
  return data.value.episodes.filter(ep =>
    ep.title.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q),
  )
})

onMounted(() => {
  execute()
})
</script>
