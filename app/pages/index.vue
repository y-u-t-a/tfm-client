<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">
      番組を検索
    </h1>
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
    <UAlert
      v-if="!pending && error"
      color="error"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="番組情報の取得に失敗しました"
    />
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

const { data, pending, error } = useFetch('/api/programs', {
  query: { name: search.value },
  immediate: true,
})
</script>
