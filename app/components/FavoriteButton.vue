<template>
  <!-- Lucide には塗りつぶしの星がなく、path に fill="none" が指定されているため、登録済みは path の fill を直接上書きする -->
  <UButton
    icon="i-lucide-star"
    color="neutral"
    variant="ghost"
    aria-label="お気に入り"
    :aria-pressed="favorite"
    :ui="{ leadingIcon: favorite ? 'text-warning [&_path]:fill-current' : '', base: 'rounded-full' }"
    @click="toggleFavorite(programId)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  programId: string
}>()

const { isFavorite, toggleFavorite } = useFavoritePrograms()
const favorite = computed(() => isFavorite(props.programId))
</script>
