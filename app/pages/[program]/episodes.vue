<template>
  <div>
    <h1>{{ id }}</h1>
    <AppLoading :loading="pending" />
    <EpisodeList
      v-if="data"
      :program-id="id"
      :episodes="data.episodes"
    />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'エピソード',
})

const route = useRoute('program-episodes')
const id = route.params.program as string

const { execute, data, pending } = useFetch(`/api/${id}/episodes`, { immediate: false })

onMounted(() => {
  execute()
})
</script>
