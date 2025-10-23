<template>
  <CommonPageFilters
    title="Filters"
    subtitle="Refine your maintenance search"
    icon="mdi-filter-variant"
  >
    <v-row dense>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by vehicle or description..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          rounded="lg"
          class="search-field"
          @update:model-value="$emit('update:search', $event)"
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          :model-value="filters.type"
          :items="typeOptions"
          variant="outlined"
          density="comfortable"
          label="Type"
          prepend-inner-icon="mdi-tools"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:type', $event)"
        />
      </v-col>
      <v-col cols="12" sm="4" md="3">
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
      <v-col cols="12" sm="4" md="3">
        <v-select
          :model-value="filters.priority"
          :items="priorityOptions"
          variant="outlined"
          density="comfortable"
          label="Priority"
          prepend-inner-icon="mdi-flag"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:priority', $event)"
        />
      </v-col>
    </v-row>
  </CommonPageFilters>
</template>

<script setup lang="ts">
import type { MaintenanceFilters } from '~/types/maintenance'

defineProps<{
  filters: MaintenanceFilters
  typeOptions: Array<{ title: string; value: string }>
  statusOptions: Array<{ title: string; value: string }>
  priorityOptions: Array<{ title: string; value: string }>
}>()

defineEmits<{
  'update:search': [value: string]
  'update:type': [value: string]
  'update:status': [value: string]
  'update:priority': [value: string]
}>()
</script>
