<template>
  <UFieldGroup role="group">
    <UPopover v-model:open="open">
      <UButton
        icon="i-lucide-calendar"
        color="neutral"
        variant="outline"
        :label="model?.toString() ?? '指定なし'"
      />
      <template #content>
        <UCalendar
          :model-value="model"
          :min-value="min"
          :max-value="max"
          @update:model-value="select($event as DateValue | undefined)"
        />
      </template>
    </UPopover>
    <UButton
      v-if="model"
      icon="i-lucide-x"
      color="neutral"
      variant="outline"
      aria-label="日付をクリア"
      @click="model = undefined"
    />
  </UFieldGroup>
</template>

<script setup lang="ts">
import { toCalendarDate } from '@internationalized/date'
import type { CalendarDate, DateValue } from '@internationalized/date'

const model = defineModel<CalendarDate>()

defineProps<{
  min?: CalendarDate
  max?: CalendarDate
}>()

const open = ref(false)

function select(value: DateValue | undefined) {
  open.value = false
  model.value = value && toCalendarDate(value)
}
</script>
