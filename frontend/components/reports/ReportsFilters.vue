<template>
  <CommonPageFilters
    title="Date Range"
    subtitle="Filter reports by time period"
    icon="mdi-calendar-range"
  >
    <v-row dense>
      <v-col cols="12" md="4">
        <v-select
          :model-value="filters.period"
          :items="periodOptions"
          variant="outlined"
          density="comfortable"
          label="Period"
          prepend-inner-icon="mdi-calendar-clock"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:period', $event)"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="filters.startDate"
          variant="outlined"
          density="comfortable"
          label="Start Date"
          type="date"
          prepend-inner-icon="mdi-calendar-start"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:startDate', $event)"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="filters.endDate"
          variant="outlined"
          density="comfortable"
          label="End Date"
          type="date"
          prepend-inner-icon="mdi-calendar-end"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:endDate', $event)"
        />
      </v-col>
    </v-row>
  </CommonPageFilters>
</template>

<script setup lang="ts">
interface Filters {
  period: string
  startDate: string
  endDate: string
}

defineProps<{
  filters: Filters
  periodOptions: ReadonlyArray<{ readonly title: string; readonly value: string }>
}>()

defineEmits<{
  'update:period': [value: string]
  'update:startDate': [value: string]
  'update:endDate': [value: string]
}>()
</script>
