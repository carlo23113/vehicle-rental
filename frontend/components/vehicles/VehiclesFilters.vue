<template>
  <CommonFilterSection v-model="showFiltersModel" :filters="filtersModel" @clear="$emit('clear')">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filtersModel.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by make, model, or license plate..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filtersModel.status"
          :items="VEHICLE_STATUS_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-car-info"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filtersModel.type"
          :items="VEHICLE_TYPE_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Type"
          prepend-inner-icon="mdi-car-side"
          clearable
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VEHICLE_STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS } from '~/constants/filterOptions'

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
