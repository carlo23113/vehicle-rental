<template>
  <div>
    <!-- Basic Information Section -->
    <CommonFormSection title="Basic Information" icon="mdi-information">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="modelValue.make"
            label="Make *"
            variant="outlined"
            density="comfortable"
            placeholder="e.g., Toyota"
            prepend-inner-icon="mdi-factory"
            rounded="lg"
            :rules="[rules.required]"
            @update:model-value="updateField('make', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="modelValue.model"
            label="Model *"
            variant="outlined"
            density="comfortable"
            placeholder="e.g., Camry"
            prepend-inner-icon="mdi-car"
            rounded="lg"
            :rules="[rules.required]"
            @update:model-value="updateField('model', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="modelValue.year"
            label="Year *"
            variant="outlined"
            density="comfortable"
            type="number"
            placeholder="e.g., 2024"
            prepend-inner-icon="mdi-calendar"
            rounded="lg"
            :rules="[rules.required, rules.year]"
            @update:model-value="updateField('year', $event ? Number($event) : null)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="modelValue.color"
            label="Color"
            variant="outlined"
            density="comfortable"
            placeholder="e.g., Silver"
            prepend-inner-icon="mdi-palette"
            rounded="lg"
            @update:model-value="updateField('color', $event)"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Identification Section -->
    <CommonFormSection title="Identification" icon="mdi-card-text">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="modelValue.licensePlate"
            label="License Plate *"
            variant="outlined"
            density="comfortable"
            placeholder="e.g., ABC-1234"
            prepend-inner-icon="mdi-card-account-details"
            rounded="lg"
            :rules="[rules.required]"
            @update:model-value="updateField('licensePlate', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="modelValue.vin"
            label="VIN"
            variant="outlined"
            density="comfortable"
            placeholder="Vehicle Identification Number"
            prepend-inner-icon="mdi-barcode"
            rounded="lg"
            :rules="[rules.vin]"
            @update:model-value="updateField('vin', $event)"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Details Section -->
    <CommonFormSection title="Details" icon="mdi-cog">
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            :model-value="modelValue.type"
            :items="typeOptions"
            label="Type *"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-car-info"
            rounded="lg"
            :rules="[rules.required]"
            @update:model-value="updateField('type', $event)"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            :model-value="modelValue.status"
            :items="statusOptions"
            label="Status *"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-check-circle"
            rounded="lg"
            :rules="[rules.required]"
            @update:model-value="updateField('status', $event)"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            :model-value="modelValue.mileage"
            label="Current Mileage"
            variant="outlined"
            density="comfortable"
            type="number"
            suffix="mi"
            placeholder="0"
            prepend-inner-icon="mdi-speedometer"
            rounded="lg"
            :rules="[rules.positive]"
            @update:model-value="updateField('mileage', $event ? Number($event) : null)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :model-value="modelValue.locationId"
            :items="locationOptions"
            item-title="title"
            item-value="value"
            label="Location *"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-map-marker"
            rounded="lg"
            :rules="[rules.required]"
            @update:model-value="updateField('locationId', $event)"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #subtitle>
                  <span class="text-caption">{{ item.raw.subtitle }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Pricing Section -->
    <CommonFormSection title="Pricing" :icon="getCurrencyIcon()">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="modelValue.rates?.cityRate"
            label="City Drive Rate *"
            variant="outlined"
            density="comfortable"
            type="number"
            :prefix="getCurrencySymbol()"
            placeholder="0.00"
            prepend-inner-icon="mdi-city"
            rounded="lg"
            :rules="[rules.required, rules.positive]"
            hint="Daily rate for city driving"
            persistent-hint
            @update:model-value="updateRates('cityRate', $event ? Number($event) : null)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="modelValue.rates?.provinceRate"
            label="Province Drive Rate *"
            variant="outlined"
            density="comfortable"
            type="number"
            :prefix="getCurrencySymbol()"
            placeholder="0.00"
            prepend-inner-icon="mdi-map-marker-distance"
            rounded="lg"
            :rules="[rules.required, rules.positive]"
            hint="Daily rate for province/long-distance driving"
            persistent-hint
            @update:model-value="updateRates('provinceRate', $event ? Number($event) : null)"
          />
        </v-col>
      </v-row>
    </CommonFormSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocations } from '~/composables/useLocations'

const { getCurrencySymbol, getCurrencyIcon } = useCurrency()

export interface VehicleFormData {
  make: string
  model: string
  year: number | null
  licensePlate: string
  vin: string
  type: string
  status: string
  color: string
  dailyRate: number | null
  rates: {
    cityRate: number | null
    provinceRate: number | null
  }
  mileage: number | null
  locationId: string
}

interface Props {
  modelValue: VehicleFormData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: VehicleFormData]
}>()

const { locations, formatLocationForSelect } = useLocations()

// Map locations to select options
const locationOptions = computed(() =>
  locations.value.map(location => formatLocationForSelect(location))
)

const statusOptions = [
  { title: 'Available', value: 'available' },
  { title: 'Rented', value: 'rented' },
  { title: 'Maintenance', value: 'maintenance' },
  { title: 'Out of Service', value: 'out-of-service' },
]

const typeOptions = [
  { title: 'Sedan', value: 'sedan' },
  { title: 'SUV', value: 'suv' },
  { title: 'Truck', value: 'truck' },
  { title: 'Van', value: 'van' },
  { title: 'Electric', value: 'electric' },
  { title: 'Luxury', value: 'luxury' },
]

const rules = {
  required: (v: any) => !!v || 'This field is required',
  year: (v: number) => {
    if (!v) return true
    const currentYear = new Date().getFullYear()
    return (v >= 1900 && v <= currentYear + 1) || 'Invalid year'
  },
  vin: (v: string) => {
    if (!v) return true
    return v.length === 17 || 'VIN must be 17 characters'
  },
  positive: (v: number) => {
    if (v === null || v === undefined) return true
    return v >= 0 || 'Must be a positive number'
  },
}

const updateField = (field: keyof VehicleFormData, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

const updateRates = (rateField: 'cityRate' | 'provinceRate', value: number | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    rates: {
      ...props.modelValue.rates,
      [rateField]: value
    }
  })
}
</script>

