# Advanced Filtering Implementation Guide

This guide explains how to implement advanced filtering with reusable range and date filters throughout the application.

## Overview

The advanced filtering system provides powerful, user-friendly filters for narrowing down data using ranges (price, mileage, year) and date selections. All components are fully reusable across different entities.

### Key Components

1. **`CommonFiltersRangeFilter`** - Generic numeric range filter with optional slider
2. **`CommonFiltersDateRangeFilter`** - Date range filter with quick presets
3. **Filter Logic** - Centralized in composables for consistency

## Quick Start

### 1. Create Reusable Range Filter

The `RangeFilter` component handles any numeric range filtering:

```vue
<template>
  <CommonFiltersRangeFilter
    label="Price"
    :min="filters.priceRange?.min"
    :max="filters.priceRange?.max"
    prefix="$"
    unit="USD"
    :show-slider="true"
    :slider-min="0"
    :slider-max="1000"
    :step="10"
    @update:min="updatePriceMin"
    @update:max="updatePriceMax"
  />
</template>
```

### 2. Create Date Range Filter

The `DateRangeFilter` component provides date selection with presets:

```vue
<template>
  <CommonFiltersDateRangeFilter
    label="Availability"
    :start-date="filters.dateRange?.startDate"
    :end-date="filters.dateRange?.endDate"
    :show-quick-select="true"
    @update:start-date="updateStartDate"
    @update:end-date="updateEndDate"
  />
</template>
```

### 3. Define Filter Types

Update your entity's filter interface:

```typescript
export interface VehicleFilters {
  // Basic filters
  search: string
  status: string
  type: string

  // Advanced filters
  priceRange?: {
    min: number | null
    max: number | null
    rateType: 'city' | 'province' | 'both'
  }
  mileageRange?: {
    min: number | null
    max: null
  }
  yearRange?: {
    min: number | null
    max: number | null
  }
  availabilityDateRange?: {
    startDate: string | null
    endDate: string | null
  }
}
```

### 4. Implement Filter Logic

Add filtering logic in your composable:

```typescript
const filteredItems = computed(() => {
  return items.value.filter(item => {
    // Price range filter
    let matchesPrice = true
    if (filters.value.priceRange) {
      const { min, max } = filters.value.priceRange
      matchesPrice =
        (min === null || item.price >= min) &&
        (max === null || item.price <= max)
    }

    // Mileage range filter
    let matchesMileage = true
    if (filters.value.mileageRange) {
      const { min, max } = filters.value.mileageRange
      matchesMileage =
        (min === null || item.mileage >= min) &&
        (max === null || item.mileage <= max)
    }

    // Year range filter
    let matchesYear = true
    if (filters.value.yearRange) {
      const { min, max } = filters.value.yearRange
      matchesYear =
        (min === null || item.year >= min) &&
        (max === null || item.year <= max)
    }

    // Date range filter
    let matchesDate = true
    if (filters.value.availabilityDateRange) {
      const { startDate, endDate } = filters.value.availabilityDateRange
      // Implement your date comparison logic
      if (startDate || endDate) {
        matchesDate = checkDateAvailability(item, startDate, endDate)
      }
    }

    return matchesPrice && matchesMileage && matchesYear && matchesDate
  })
})
```

## Component API Reference

### CommonFiltersRangeFilter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Filter label |
| `min` | `number \| null` | `null` | Minimum value |
| `max` | `number \| null` | `null` | Maximum value |
| `unit` | `string` | `''` | Unit label (e.g., "USD", "miles") |
| `prefix` | `string` | `''` | Value prefix (e.g., "$") |
| `suffix` | `string` | `''` | Value suffix (e.g., " mi") |
| `showSlider` | `boolean` | `false` | Show range slider |
| `sliderMin` | `number` | `undefined` | Slider minimum |
| `sliderMax` | `number` | `undefined` | Slider maximum |
| `step` | `number` | `1` | Slider step increment |

### CommonFiltersRangeFilter Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:min` | `number \| null` | Emitted when min value changes |
| `update:max` | `number \| null` | Emitted when max value changes |

### CommonFiltersDateRangeFilter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Filter label |
| `startDate` | `string \| null` | `null` | Start date (YYYY-MM-DD) |
| `endDate` | `string \| null` | `null` | End date (YYYY-MM-DD) |
| `showQuickSelect` | `boolean` | `true` | Show quick preset chips |

### CommonFiltersDateRangeFilter Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:startDate` | `string \| null` | Emitted when start date changes |
| `update:endDate` | `string \| null` | Emitted when end date changes |

## Real-World Example: Vehicles

### Filter UI Structure

```vue
<template>
  <!-- Basic Filters -->
  <v-row dense>
    <v-col cols="12" md="6">
      <v-text-field v-model="filters.search" />
    </v-col>
    <v-col cols="12" md="3">
      <v-select v-model="filters.status" />
    </v-col>
  </v-row>

  <!-- Advanced Filters Toggle -->
  <v-divider class="my-4" />

  <div class="d-flex align-center justify-space-between">
    <span>Advanced Filters</span>
    <v-chip v-if="advancedFiltersCount > 0" color="primary">
      {{ advancedFiltersCount }}
    </v-chip>
    <v-btn @click="toggleAdvanced" />
  </div>

  <!-- Advanced Filters Section -->
  <v-expand-transition>
    <div v-show="showAdvanced">
      <v-row dense>
        <!-- Price Range -->
        <v-col cols="12" md="3">
          <CommonFiltersRangeFilter
            label="Daily Rate"
            :min="filters.priceRange?.min"
            :max="filters.priceRange?.max"
            prefix="$"
            :show-slider="true"
            :slider-min="0"
            :slider-max="200"
            @update:min="updatePriceMin"
            @update:max="updatePriceMax"
          />
        </v-col>

        <!-- Mileage Range -->
        <v-col cols="12" md="3">
          <CommonFiltersRangeFilter
            label="Mileage"
            :min="filters.mileageRange?.min"
            :max="filters.mileageRange?.max"
            suffix=" mi"
            :show-slider="true"
            :slider-min="0"
            :slider-max="50000"
            :step="1000"
            @update:min="updateMileageMin"
            @update:max="updateMileageMax"
          />
        </v-col>

        <!-- Year Range -->
        <v-col cols="12" md="3">
          <CommonFiltersRangeFilter
            label="Year"
            :min="filters.yearRange?.min"
            :max="filters.yearRange?.max"
            :show-slider="true"
            :slider-min="2015"
            :slider-max="2025"
            @update:min="updateYearMin"
            @update:max="updateYearMax"
          />
        </v-col>

        <!-- Availability -->
        <v-col cols="12" md="3">
          <CommonFiltersDateRangeFilter
            label="Availability"
            :start-date="filters.availabilityDateRange?.startDate"
            :end-date="filters.availabilityDateRange?.endDate"
            @update:start-date="updateAvailabilityStart"
            @update:end-date="updateAvailabilityEnd"
          />
        </v-col>
      </v-row>
    </div>
  </v-expand-transition>
</template>
```

### Filter Update Handlers

```typescript
// Price range updaters
const updatePriceMin = (value: number | null) => {
  const updated = { ...filters.value }
  if (!updated.priceRange) {
    updated.priceRange = { min: null, max: null, rateType: 'both' }
  }
  updated.priceRange.min = value
  filters.value = updated
}

const updatePriceMax = (value: number | null) => {
  const updated = { ...filters.value }
  if (!updated.priceRange) {
    updated.priceRange = { min: null, max: null, rateType: 'both' }
  }
  updated.priceRange.max = value
  filters.value = updated
}

// Similar for mileage, year, and date ranges...
```

### Active Filter Counter

```typescript
const advancedFiltersCount = computed(() => {
  let count = 0

  if (filters.value.priceRange?.min !== null ||
      filters.value.priceRange?.max !== null) {
    count++
  }
  if (filters.value.mileageRange?.min !== null ||
      filters.value.mileageRange?.max !== null) {
    count++
  }
  if (filters.value.yearRange?.min !== null ||
      filters.value.yearRange?.max !== null) {
    count++
  }
  if (filters.value.availabilityDateRange?.startDate ||
      filters.value.availabilityDateRange?.endDate) {
    count++
  }

  return count
})
```

## Advanced Features

### 1. Rate Type Selection (Multi-Criteria Filtering)

For vehicles with multiple rates (city/province):

```vue
<v-btn-toggle
  v-model="filters.priceRange.rateType"
  mandatory
  density="compact"
>
  <v-btn value="city">City</v-btn>
  <v-btn value="province">Province</v-btn>
  <v-btn value="both">Both</v-btn>
</v-btn-toggle>
```

Filter logic:

```typescript
if (rateType === 'city') {
  matchesPrice = (min === null || vehicle.rates.cityRate >= min) &&
                 (max === null || vehicle.rates.cityRate <= max)
} else if (rateType === 'province') {
  matchesPrice = (min === null || vehicle.rates.provinceRate >= min) &&
                 (max === null || vehicle.rates.provinceRate <= max)
} else { // 'both'
  const cityMatch = /* ... */
  const provinceMatch = /* ... */
  matchesPrice = cityMatch || provinceMatch
}
```

### 2. Quick Date Presets

Pre-defined date ranges for common scenarios:

```typescript
const datePresets = [
  { label: 'Today', days: 0 },
  { label: 'Next 7 days', days: 7 },
  { label: 'Next 30 days', days: 30 },
  { label: 'Next 90 days', days: 90 },
]

const applyPreset = (preset) => {
  const today = new Date()
  const future = new Date()
  future.setDate(today.getDate() + preset.days)

  updateStartDate(formatDate(today))
  updateEndDate(formatDate(future))
}
```

### 3. Clear Advanced Filters

```typescript
const clearAdvancedFilters = () => {
  filters.value = {
    ...filters.value,
    priceRange: { min: null, max: null, rateType: 'both' },
    mileageRange: { min: null, max: null },
    yearRange: { min: null, max: null },
    availabilityDateRange: { startDate: null, endDate: null },
  }
}
```

## Implementation Files

- [`components/common/filters/RangeFilter.vue`](../components/common/filters/RangeFilter.vue) - Numeric range filter
- [`components/common/filters/DateRangeFilter.vue`](../components/common/filters/DateRangeFilter.vue) - Date range filter
- [`components/owner/vehicles/VehiclesFilters.vue`](../components/owner/vehicles/VehiclesFilters.vue) - Implementation example
- [`composables/useVehicles.ts`](../composables/useVehicles.ts) - Filter logic
- [`types/vehicle.ts`](../types/vehicle.ts) - Filter types

## Benefits

### 1. **Reusability**
- Same components work for any numeric range
- Date filter works for any entity
- No duplication across different pages

### 2. **Consistency**
- Uniform UX across all filters
- Standardized interaction patterns
- Predictable behavior

### 3. **Flexibility**
- Optional sliders for better UX
- Customizable prefixes/suffixes
- Configurable ranges and steps

### 4. **User Experience**
- Visual feedback with sliders
- Quick date presets
- Clear "Clear" buttons
- Active filter counter

### 5. **Performance**
- Efficient computed filtering
- Reactive updates
- No unnecessary re-renders

## Best Practices

### 1. Use Meaningful Ranges

```typescript
// Good - realistic ranges
<CommonFiltersRangeFilter
  :slider-min="0"
  :slider-max="200"
  :step="5"
/>

// Bad - too wide or imprecise
<CommonFiltersRangeFilter
  :slider-min="0"
  :slider-max="10000"
  :step="1"
/>
```

### 2. Provide Context

```typescript
// Good - clear units and labels
label="Daily Rate"
prefix="$"
unit="per day"

// Bad - ambiguous
label="Price"
```

### 3. Handle Edge Cases

```typescript
// Check for null values
matchesRange =
  (min === null || value >= min) &&
  (max === null || value <= max)

// Don't just check existence
matchesRange = value >= min && value <= max // ❌ Fails if min/max is null
```

### 4. Initialize Properly

```typescript
// Good - initialize all advanced filters
const filters = ref({
  search: '',
  priceRange: { min: null, max: null, rateType: 'both' },
  mileageRange: { min: null, max: null },
})

// Bad - undefined filters
const filters = ref({
  search: '',
  // missing priceRange
})
```

### 5. Clear All Together

```typescript
// Provide both individual and bulk clear
<v-btn @click="clearPriceRange">Clear Price</v-btn>
<v-btn @click="clearAdvancedFilters">Clear All Advanced</v-btn>
```

## Adding to Other Entities

### Example: Rentals

```typescript
export interface RentalFilters {
  search: string
  status: string

  // Advanced filters
  durationRange?: {
    min: number | null  // days
    max: number | null
  }
  totalCostRange?: {
    min: number | null
    max: number | null
  }
  dateRange?: {
    startDate: string | null
    endDate: string | null
  }
}
```

```vue
<template>
  <CommonFiltersRangeFilter
    label="Rental Duration"
    :min="filters.durationRange?.min"
    :max="filters.durationRange?.max"
    suffix=" days"
    :show-slider="true"
    :slider-min="1"
    :slider-max="90"
    @update:min="updateDurationMin"
    @update:max="updateDurationMax"
  />

  <CommonFiltersRangeFilter
    label="Total Cost"
    :min="filters.totalCostRange?.min"
    :max="filters.totalCostRange?.max"
    prefix="$"
    :show-slider="true"
    :slider-min="0"
    :slider-max="5000"
    :step="100"
    @update:min="updateCostMin"
    @update:max="updateCostMax"
  />
</template>
```

## Troubleshooting

### Filters Not Working

1. **Check filter initialization**
   ```typescript
   // Ensure all filter objects are initialized
   priceRange: { min: null, max: null, rateType: 'both' }
   ```

2. **Verify update handlers**
   ```typescript
   // Make sure handlers actually update the filters
   const updateMin = (value) => {
     filters.value.priceRange.min = value // ✅
   }
   ```

3. **Check filter logic**
   ```typescript
   // Ensure null checks are correct
   (min === null || value >= min) // ✅
   value >= min                    // ❌ Fails when min is null
   ```

### Sliders Not Showing

1. **Verify props**
   ```vue
   :show-slider="true"
   :slider-min="0"
   :slider-max="100"
   ```

2. **Check if min/max are undefined vs null**
   ```typescript
   sliderMin !== undefined // Must be defined
   ```

### Date Presets Not Working

1. **Check date format**
   ```typescript
   // Use ISO format: YYYY-MM-DD
   formatDate(date) {
     return date.toISOString().split('T')[0]
   }
   ```

## Future Enhancements

- **Multi-Select Filters**: Select multiple values from a list
- **Tag-Based Filtering**: Filter by tags/categories
- **Saved Filter Presets**: Save and recall common filter combinations
- **Filter URL Params**: Persist filters in URL for sharing
- **Advanced Date Logic**: "Last X days", "This month", etc.
- **Filter Analytics**: Track which filters are most used

## Conclusion

The advanced filtering system provides powerful, reusable components for creating sophisticated filter UIs. By following this guide, you can quickly add advanced filtering to any entity in your application with minimal code duplication.

Key takeaways:
- ✅ Reusable range and date filter components
- ✅ Type-safe filter definitions
- ✅ Consistent UX patterns
- ✅ Easy to extend to new entities
- ✅ Built-in clear functionality
- ✅ Active filter indicators
