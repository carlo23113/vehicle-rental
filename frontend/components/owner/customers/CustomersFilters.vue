<template>
  <CommonFilterSection v-model="showFiltersModel" :filters="filtersModel" @clear="$emit('clear')">
    <v-row dense>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="filtersModel.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by name, email, phone, or license..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="filtersModel.status"
          :items="CUSTOMER_STATUS_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-account-check"
          clearable
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Define customer status options locally since they're specific to this feature
const CUSTOMER_STATUS_OPTIONS = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Blocked', value: 'blocked' },
] as const

const props = defineProps<{
  showFilters: boolean
  filters: any
}>()

const emit = defineEmits<{
  'update:showFilters': [value: boolean]
  'update:filters': [value: any]
  clear: []
}>()

const showFiltersModel = computed({
  get: () => props.showFilters,
  set: (value) => emit('update:showFilters', value),
})

const filtersModel = computed({
  get: () => props.filters,
  set: (value) => emit('update:filters', value),
})
</script>
