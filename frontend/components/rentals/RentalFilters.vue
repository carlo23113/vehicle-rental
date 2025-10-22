<template>
  <CommonPageFilters
    title="Filters"
    subtitle="Refine your rental search"
    icon="mdi-filter-variant"
  >
    <v-row dense>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by customer, vehicle, or plate..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          rounded="lg"
          class="search-field"
          @update:model-value="$emit('update:search', $event)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          :model-value="filters.status"
          :items="statusOptions"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-check-circle"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:status', $event)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          :model-value="filters.dateRange"
          :items="dateRangeOptions"
          variant="outlined"
          density="comfortable"
          label="Date Range"
          prepend-inner-icon="mdi-calendar-range"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:dateRange', $event)"
        />
      </v-col>
    </v-row>
  </CommonPageFilters>
</template>

<script setup lang="ts">
interface Filters {
  search: string
  status: string
  dateRange: string
}

defineProps<{
  filters: Filters
  statusOptions: Array<{ title: string; value: string }>
  dateRangeOptions: Array<{ title: string; value: string }>
}>()

defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:dateRange': [value: string]
}>()
</script>
