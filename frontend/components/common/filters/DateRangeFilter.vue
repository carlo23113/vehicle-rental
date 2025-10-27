<template>
  <v-card variant="outlined" class="date-range-filter">
    <v-card-text class="pb-2">
      <div class="d-flex align-center justify-space-between mb-2">
        <label class="text-subtitle-2 font-weight-bold">{{ label }}</label>
        <v-btn
          v-if="hasValue"
          variant="text"
          size="x-small"
          color="primary"
          @click="clearRange"
        >
          Clear
        </v-btn>
      </div>

      <v-row dense>
        <v-col cols="6">
          <v-text-field
            :model-value="startDate"
            type="date"
            variant="outlined"
            density="compact"
            label="Start Date"
            hide-details
            @update:model-value="updateStartDate"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :model-value="endDate"
            type="date"
            variant="outlined"
            density="compact"
            label="End Date"
            hide-details
            @update:model-value="updateEndDate"
          />
        </v-col>
      </v-row>

      <!-- Quick Selection Chips -->
      <div v-if="showQuickSelect" class="mt-3 d-flex flex-wrap gap-2">
        <v-chip
          v-for="preset in datePresets"
          :key="preset.label"
          size="small"
          variant="outlined"
          @click="applyPreset(preset)"
        >
          {{ preset.label }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
export interface DateRangeFilterProps {
  label: string
  startDate?: string | null
  endDate?: string | null
  showQuickSelect?: boolean
}

interface DatePreset {
  label: string
  days: number
}

const props = withDefaults(defineProps<DateRangeFilterProps>(), {
  startDate: null,
  endDate: null,
  showQuickSelect: true,
})

const emit = defineEmits<{
  'update:startDate': [value: string | null]
  'update:endDate': [value: string | null]
}>()

const hasValue = computed(() => props.startDate !== null || props.endDate !== null)

const datePresets: DatePreset[] = [
  { label: 'Today', days: 0 },
  { label: 'Next 7 days', days: 7 },
  { label: 'Next 30 days', days: 30 },
  { label: 'Next 90 days', days: 90 },
]

const updateStartDate = (value: string) => {
  emit('update:startDate', value || null)
}

const updateEndDate = (value: string) => {
  emit('update:endDate', value || null)
}

const clearRange = () => {
  emit('update:startDate', null)
  emit('update:endDate', null)
}

const applyPreset = (preset: DatePreset) => {
  const today = new Date()
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + preset.days)

  emit('update:startDate', formatDate(today))
  emit('update:endDate', formatDate(futureDate))
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}
</script>

<style scoped>
.date-range-filter {
  border: 1px solid rgba(var(--v-border-color), 0.12);
}
</style>
