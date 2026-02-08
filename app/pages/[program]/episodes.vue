<template>
  <div>
    <AppLoading :loading="pending" />
    <template v-if="data">
      <h1 class="text-2xl font-bold mb-4">
        {{ data.title }}
      </h1>
      <EpisodeList
        :program-id="id"
        :episodes="data.episodes"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute('program-episodes')
const id = route.params.program as string

const { execute, data, pending } = useFetch(`/api/${id}/episodes`, { immediate: false })

useHead({
  title: computed(() => data.value ? `${data.value.title} - エピソード` : 'エピソード'),
})

onMounted(() => {
  execute()
})
</script>
