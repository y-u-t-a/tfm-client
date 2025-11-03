<template>
  <h1>{{ id }}</h1>
  <Loading :loading="pending" />
  <EpisodeList v-if="data" :program-id="id" :episodes="data.episodes" />
</template>

<script setup lang="ts">
useHead({
  title: "エピソード"
})

const route = useRoute("program-episodes")
const id = route.params.program as string

const { execute, data, pending } = useFetch(`/api/${id}/episodes`, { immediate: false })

onMounted(() => {
  execute()
})
</script>
