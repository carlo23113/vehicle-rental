<template>
  <CommonFilterSection v-model="showFiltersModel" :filters="filtersModel" @clear="handleClearAll">
    <!-- Basic Filters -->
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

    <!-- Advanced Filters Panel -->
    <CommonFiltersAdvancedFiltersPanel
      :active-filters-count="advancedFiltersCount"
      title="Advanced Filters"
      description="Filter by vehicle type, price, duration & customer type"
      @clear-filters="clearAdvancedFilters"
    >
      <!-- Vehicle Type Filter -->
      <v-col cols="12" md="6" lg="3">
        <v-select
          v-model="filtersModel.vehicleType"
          :items="VEHICLE_TYPE_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Vehicle Type"
          prepend-inner-icon="mdi-car-side"
          clearable
        />
      </v-col>

      <!-- Price Range Filter -->
      <v-col cols="12" md="6" lg="3">
        <CommonFiltersRangeFilter
          label="Total Amount"
          :min="filtersModel.priceRange?.min ?? null"
          :max="filtersModel.priceRange?.max ?? null"
          prefix="$"
          unit="total"
          :show-slider="true"
          :slider-min="0"
          :slider-max="5000"
          :step="50"
          @update:min="updatePriceMin"
          @update:max="updatePriceMax"
        />
      </v-col>

      <!-- Duration Filter -->
      <v-col cols="12" md="6" lg="3">
        <v-select
          v-model="filtersModel.duration"
          :items="DURATION_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Duration"
          prepend-inner-icon="mdi-calendar-clock"
          clearable
        />
      </v-col>

      <!-- Customer Type Filter -->
      <v-col cols="12" md="6" lg="3">
        <v-select
          v-model="filtersModel.customerType"
          :items="CUSTOMER_TYPE_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Customer Type"
          prepend-inner-icon="mdi-account-group"
          clearable
        />
      </v-col>

      <!-- Overdue Filter -->
      <v-col cols="12" md="6" lg="3">
        <v-checkbox
          v-model="filtersModel.showOverdueOnly"
          label="Show Overdue Only"
          density="comfortable"
          prepend-icon="mdi-alert-circle"
          color="error"
          hide-details
        />
      </v-col>
    </CommonFiltersAdvancedFiltersPanel>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '~/composables/useCurrency'
import {
  RENTAL_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  DATE_RANGE_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
} from '~/constants/filterOptions'

const { getCurrencyIcon } = useCurrency()

// Duration options
const DURATION_OPTIONS = [
  { title: 'All Durations', value: 'all' },
  { title: '1-3 days', value: '1-3' },
  { title: '4-7 days', value: '4-7' },
  { title: '1+ weeks', value: '7+' },
] as const

// Customer type options
const CUSTOMER_TYPE_OPTIONS = [
  { title: 'All Customers', value: 'all' },
  { title: 'New Customers', value: 'new' },
  { title: 'Returning Customers', value: 'returning' },
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

// Advanced filters count
const advancedFiltersCount = computed(() => {
  let count = 0
  if (props.filters.vehicleType && props.filters.vehicleType !== 'all') count++
  if (props.filters.priceRange?.min || props.filters.priceRange?.max) count++
  if (props.filters.duration && props.filters.duration !== 'all') count++
  if (props.filters.customerType && props.filters.customerType !== 'all') count++
  if (props.filters.showOverdueOnly) count++
  return count
})

// Price range handlers
const updatePriceMin = (value: number | null) => {
  filtersModel.value = {
    ...filtersModel.value,
    priceRange: {
      ...filtersModel.value.priceRange,
      min: value,
    },
  }
}

const updatePriceMax = (value: number | null) => {
  filtersModel.value = {
    ...filtersModel.value,
    priceRange: {
      ...filtersModel.value.priceRange,
      max: value,
    },
  }
}

// Clear handlers
const clearAdvancedFilters = () => {
  filtersModel.value = {
    ...filtersModel.value,
    vehicleType: 'all',
    priceRange: { min: null, max: null },
    duration: 'all',
    customerType: 'all',
    showOverdueOnly: false,
  }
}

const handleClearAll = () => {
  emit('clear')
}
</script>
