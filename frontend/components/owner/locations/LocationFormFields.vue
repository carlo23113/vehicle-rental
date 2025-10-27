<template>
  <div>
    <!-- Basic Information -->
    <CommonFormSection title="Basic Information" icon="mdi-information-outline">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.name"
            label="Location Name"
            placeholder="Downtown Main Office"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-map-marker"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.type"
            label="Location Type"
            variant="outlined"
            density="comfortable"
            :items="typeOptions"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-office-building"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.status"
            label="Status"
            variant="outlined"
            density="comfortable"
            :items="statusOptions"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-flag-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="localForm.capacity"
            label="Vehicle Capacity"
            placeholder="50"
            variant="outlined"
            density="comfortable"
            type="number"
            :rules="[rules.required, rules.positiveNumber]"
            prepend-inner-icon="mdi-garage"
            suffix="vehicles"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Address Information -->
    <CommonFormSection title="Address Information" icon="mdi-map">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="localForm.address"
            label="Street Address"
            placeholder="123 Main Street"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-home-map-marker"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.country"
            label="Country"
            variant="outlined"
            density="comfortable"
            :items="countryOptions"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-earth"
            @update:model-value="handleCountryChange"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.state"
            label="State/Province"
            variant="outlined"
            density="comfortable"
            :items="stateOptions"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-map-outline"
            :disabled="!localForm.country"
            @update:model-value="handleStateChange"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.city"
            label="City"
            variant="outlined"
            density="comfortable"
            :items="cityOptions"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-city-variant-outline"
            :disabled="!localForm.state"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.zipCode"
            label="ZIP/Postal Code"
            placeholder="1000"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-mailbox-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Contact Information -->
    <CommonFormSection title="Contact Information" icon="mdi-phone">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required, rules.phone]"
            prepend-inner-icon="mdi-phone-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.email"
            label="Email Address"
            placeholder="location@rentals.com"
            variant="outlined"
            density="comfortable"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Location } from '~/composables/useLocations'
import { useCountryLocations } from '~/composables/useCountryLocations'

export type LocationFormData = Omit<Location, 'id' | 'createdAt'>

const props = defineProps<{
  modelValue: LocationFormData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LocationFormData]
}>()

const localForm = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const { getCountryOptions, getStateOptions, getCityOptions } = useCountryLocations()

const countryOptions = computed(() => getCountryOptions())
const stateOptions = computed(() => getStateOptions(localForm.value.country || ''))
const cityOptions = computed(() =>
  getCityOptions(localForm.value.country || '', localForm.value.state || '')
)

const handleCountryChange = () => {
  localForm.value.state = ''
  localForm.value.city = ''
}

const handleStateChange = () => {
  localForm.value.city = ''
}

const typeOptions = [
  { title: 'Main Office', value: 'main' },
  { title: 'Branch Location', value: 'branch' },
]

const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
]

// Validation rules
const rules = {
  required: (value: any) => !!value || 'This field is required',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Invalid email address'
  },
  phone: (value: string) => {
    const pattern = /^[\d\s()+-]+$/
    return (pattern.test(value) && value.replace(/\D/g, '').length >= 10) || 'Invalid phone number'
  },
  zipCode: (value: string) => {
    const pattern = /^\d{5}(-\d{4})?$/
    return pattern.test(value) || 'Invalid zip code'
  },
  positiveNumber: (value: number) => value > 0 || 'Must be greater than 0',
}
</script>
