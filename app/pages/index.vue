<template>
  <div>
    <h2 class="text-xl font-bold mb-4">
      番組を検索
    </h2>
    <form class="mb-6">
      <UInput
        v-model="search"
        name="name"
        icon="i-lucide-search"
        placeholder="番組名で検索..."
        class="w-full"
        size="xl"
      />
      <button
        hidden
        type="submit"
      />
    </form>
    <AppLoading :loading="pending" />
    <ProgramList
      v-if="!pending && data"
      :programs="data.programs"
    />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '番組',
})

const route = useRoute()
const search = ref(route.query.name as string || '')

const { execute, data, pending } = useFetch('/api/programs', {
  query: { name: route.query.name },
  immediate: false,
})

onMounted(() => {
  if (route.query.name != undefined) {
    execute()
  }
})
</script>
