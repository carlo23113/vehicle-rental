<template>
  <CommonPageFilters
    title="Filters"
    subtitle="Refine your location search"
    icon="mdi-filter-variant"
  >
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by name, city, address, or email..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          rounded="lg"
          class="search-field"
          @update:model-value="$emit('update:search', $event)"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          :model-value="filters.status"
          :items="statusOptions"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-flag-outline"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:status', $event)"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          :model-value="filters.type"
          :items="typeOptions"
          variant="outlined"
          density="comfortable"
          label="Type"
          prepend-inner-icon="mdi-office-building"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:type', $event)"
        />
      </v-col>
    </v-row>
  </CommonPageFilters>
</template>

<script setup lang="ts">
interface Filters {
  search: string
  status: string
  type: string
}

defineProps<{
  filters: Filters
  statusOptions: Array<{ title: string; value: string }>
  typeOptions: Array<{ title: string; value: string }>
}>()

defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:type': [value: string]
}>()
</script>
