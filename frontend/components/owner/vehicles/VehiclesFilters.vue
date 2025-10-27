<template>
  <CommonFilterSection v-model="showFiltersModel" :filters="filtersModel" @clear="handleClearAll">
    <!-- Basic Filters -->
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

    <!-- Advanced Filters Panel -->
    <CommonFiltersAdvancedFiltersPanel
      :active-filters-count="advancedFiltersCount"
      title="Advanced Filters"
      description="Filter by price, mileage, year & availability"
      @clear-filters="clearAdvancedFilters"
    >
      <!-- Price Range Filter -->
      <v-col cols="12" md="6" lg="3">
        <CommonFiltersRangeFilter
          label="Daily Rate"
          :min="filtersModel.priceRange?.min ?? null"
          :max="filtersModel.priceRange?.max ?? null"
          prefix="$"
          unit="per day"
          :show-slider="true"
          :slider-min="0"
          :slider-max="200"
          :step="5"
          @update:min="updatePriceMin"
          @update:max="updatePriceMax"
        />

        <!-- Rate Type Selection -->
        <v-btn-toggle
          :model-value="filtersModel.priceRange?.rateType ?? 'both'"
          class="mt-2 d-flex"
          density="compact"
          variant="outlined"
          divided
          mandatory
          @update:model-value="updateRateType"
        >
          <v-btn value="city" size="small">City</v-btn>
          <v-btn value="province" size="small">Province</v-btn>
          <v-btn value="both" size="small">Both</v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- Mileage Range Filter -->
      <v-col cols="12" md="6" lg="3">
        <CommonFiltersRangeFilter
          label="Mileage"
          :min="filtersModel.mileageRange?.min ?? null"
          :max="filtersModel.mileageRange?.max ?? null"
          suffix=" mi"
          unit="miles"
          :show-slider="true"
          :slider-min="0"
          :slider-max="50000"
          :step="1000"
          @update:min="updateMileageMin"
          @update:max="updateMileageMax"
        />
      </v-col>

      <!-- Year Range Filter -->
      <v-col cols="12" md="6" lg="3">
        <CommonFiltersRangeFilter
          label="Year"
          :min="filtersModel.yearRange?.min ?? null"
          :max="filtersModel.yearRange?.max ?? null"
          unit="year"
          :show-slider="true"
          :slider-min="2015"
          :slider-max="2025"
          :step="1"
          @update:min="updateYearMin"
          @update:max="updateYearMax"
        />
      </v-col>

      <!-- Availability Date Range Filter -->
      <v-col cols="12" md="6" lg="3">
        <CommonFiltersDateRangeFilter
          label="Availability"
          :start-date="filtersModel.availabilityDateRange?.startDate ?? null"
          :end-date="filtersModel.availabilityDateRange?.endDate ?? null"
          :show-quick-select="true"
          @update:start-date="updateAvailabilityStart"
          @update:end-date="updateAvailabilityEnd"
        />
      </v-col>
    </CommonFiltersAdvancedFiltersPanel>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VEHICLE_STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS } from '~/constants/filterOptions'
import type { VehicleFilters } from '~/types/vehicle'

const props = defineProps<{
  showFilters: boolean
  filters: VehicleFilters
}>()

const emit = defineEmits<{
  'update:showFilters': [value: boolean]
  'update:filters': [value: VehicleFilters]
  clear: []
}>()

const showFiltersModel = computed({
  get: () => props.showFilters,
  set: value => emit('update:showFilters', value),
})

const filtersModel = computed({
  get: () => props.filters,
  set: value => emit('update:filters', value),
})

// Count active advanced filters
const advancedFiltersCount = computed(() => {
  let count = 0

  if (props.filters.priceRange?.min !== null || props.filters.priceRange?.max !== null) {
    count++
  }
  if (props.filters.mileageRange?.min !== null || props.filters.mileageRange?.max !== null) {
    count++
  }
  if (props.filters.yearRange?.min !== null || props.filters.yearRange?.max !== null) {
    count++
  }
  if (
    props.filters.availabilityDateRange?.startDate ||
    props.filters.availabilityDateRange?.endDate
  ) {
    count++
  }

  return count
})

// Price range updaters
const updatePriceMin = (value: number | null) => {
  const updated = { ...props.filters }
  if (!updated.priceRange) {
    updated.priceRange = { min: null, max: null, rateType: 'both' }
  }
  updated.priceRange.min = value
  emit('update:filters', updated)
}

const updatePriceMax = (value: number | null) => {
  const updated = { ...props.filters }
  if (!updated.priceRange) {
    updated.priceRange = { min: null, max: null, rateType: 'both' }
  }
  updated.priceRange.max = value
  emit('update:filters', updated)
}

const updateRateType = (value: 'city' | 'province' | 'both') => {
  const updated = { ...props.filters }
  if (!updated.priceRange) {
    updated.priceRange = { min: null, max: null, rateType: 'both' }
  }
  updated.priceRange.rateType = value
  emit('update:filters', updated)
}

// Mileage range updaters
const updateMileageMin = (value: number | null) => {
  const updated = { ...props.filters }
  if (!updated.mileageRange) {
    updated.mileageRange = { min: null, max: null }
  }
  updated.mileageRange.min = value
  emit('update:filters', updated)
}

const updateMileageMax = (value: number | null) => {
  const updated = { ...props.filters }
  if (!updated.mileageRange) {
    updated.mileageRange = { min: null, max: null }
  }
  updated.mileageRange.max = value
  emit('update:filters', updated)
}

// Year range updaters
const updateYearMin = (value: number | null) => {
  const updated = { ...props.filters }
  if (!updated.yearRange) {
    updated.yearRange = { min: null, max: null }
  }
  updated.yearRange.min = value
  emit('update:filters', updated)
}

const updateYearMax = (value: number | null) => {
  const updated = { ...props.filters }
  if (!updated.yearRange) {
    updated.yearRange = { min: null, max: null }
  }
  updated.yearRange.max = value
  emit('update:filters', updated)
}

// Availability date range updaters
const updateAvailabilityStart = (value: string | null) => {
  const updated = { ...props.filters }
  if (!updated.availabilityDateRange) {
    updated.availabilityDateRange = { startDate: null, endDate: null }
  }
  updated.availabilityDateRange.startDate = value
  emit('update:filters', updated)
}

const updateAvailabilityEnd = (value: string | null) => {
  const updated = { ...props.filters }
  if (!updated.availabilityDateRange) {
    updated.availabilityDateRange = { startDate: null, endDate: null }
  }
  updated.availabilityDateRange.endDate = value
  emit('update:filters', updated)
}

// Clear advanced filters
const clearAdvancedFilters = () => {
  const updated = { ...props.filters }
  updated.priceRange = { min: null, max: null, rateType: 'both' }
  updated.mileageRange = { min: null, max: null }
  updated.yearRange = { min: null, max: null }
  updated.availabilityDateRange = { startDate: null, endDate: null }
  emit('update:filters', updated)
}

// Clear all filters
const handleClearAll = () => {
  clearAdvancedFilters()
  emit('clear')
}
</script>
