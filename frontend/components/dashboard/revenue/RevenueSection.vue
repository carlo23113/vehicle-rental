<script setup lang="ts">
type FilterType = 'week' | 'month' | 'year'

defineProps<{
  filter: FilterType
}>()

defineEmits<{
  'update:filter': [value: FilterType]
}>()

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]
</script>

<template>
  <CommonUiDetailCard title="Revenue Overview" icon="mdi-cash-multiple">
    <template #actions>
      <v-btn-toggle
        :model-value="filter"
        @update:model-value="$emit('update:filter', $event)"
        mandatory
        density="comfortable"
        variant="outlined"
        divided
        rounded="xl"
        color="primary"
      >
        <v-btn
          v-for="option in filterOptions"
          :key="option.value"
          :value="option.value"
          class="px-4"
        >
          {{ option.label }}
        </v-btn>
      </v-btn-toggle>
    </template>
    <LazyRevenueChart :filter="filter" />
  </CommonUiDetailCard>
</template>
