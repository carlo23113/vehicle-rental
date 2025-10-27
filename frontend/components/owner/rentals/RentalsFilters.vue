<template>
  <CommonFilterSection v-model="showFiltersModel" :filters="filtersModel" @clear="$emit('clear')">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filtersModel.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by customer or vehicle..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select
          v-model="filtersModel.status"
          :items="RENTAL_STATUS_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-calendar-check"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select
          v-model="filtersModel.paymentStatus"
          :items="PAYMENT_STATUS_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Payment"
          :prepend-inner-icon="getCurrencyIcon()"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select
          v-model="filtersModel.dateRange"
          :items="DATE_RANGE_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Date Range"
          prepend-inner-icon="mdi-calendar-range"
          clearable
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '~/composables/useCurrency'
import {
  RENTAL_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  DATE_RANGE_OPTIONS,
} from '~/constants/filterOptions'

const { getCurrencyIcon } = useCurrency()

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
