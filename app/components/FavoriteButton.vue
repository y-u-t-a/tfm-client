<template>
  <!-- Lucide には塗りつぶしの星がなく、path に fill="none" が指定されているため、登録済みは path の fill を直接上書きする -->
  <UButton
    :label="label"
    trailing-icon="i-lucide-star"
    color="neutral"
    :variant="label ? 'soft' : 'ghost'"
    :aria-label="label ? label : 'お気に入り'"
    :aria-pressed="favorite"
    :ui="{
      trailingIcon: favorite ? 'text-warning [&_path]:fill-current' : '',
      base: label ? '' : 'rounded-full',
    }"
  />
</template>

<script setup lang="ts">
defineProps<{
  favorite: boolean
  /** 指定すると Play・Download と同じ見た目のラベル付きボタンになる。省略時は星だけの丸いボタン */
  label?: string
}>()
</script>
