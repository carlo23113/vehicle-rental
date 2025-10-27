<template>
  <div>
    <!-- Personal Information -->
    <CommonFormSection title="Personal Information" icon="mdi-account">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.firstName"
            label="First Name"
            placeholder="John"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.lastName"
            label="Last Name"
            placeholder="Smith"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.email"
            label="Email Address"
            placeholder="john.smith@email.com"
            variant="outlined"
            density="comfortable"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email-outline"
          />
        </v-col>
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
            v-model="localForm.dateOfBirth"
            label="Date of Birth"
            type="date"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-calendar-account"
            :max="maxDateOfBirth"
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
            prepend-inner-icon="mdi-account-check-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Address Information -->
    <CommonFormSection title="Address Information" icon="mdi-map-marker">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="localForm.address"
            label="Street Address"
            placeholder="123 Main Street"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-home-outline"
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

    <!-- Driver's License Information -->
    <CommonFormSection title="Driver's License Information" icon="mdi-card-account-details">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.driversLicense"
            label="Driver's License Number"
            placeholder="D1234567"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-card-account-details-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.licenseExpiry"
            label="License Expiry Date"
            type="date"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-calendar-clock"
            :min="todayDate"
          />
        </v-col>
      </v-row>

      <!-- License Expiry Warning -->
      <v-alert
        v-if="isLicenseExpiringSoon"
        type="warning"
        variant="tonal"
        class="mt-4"
        border="start"
      >
        <template #text>
          <div class="text-subtitle-2 font-weight-medium">License Expiring Soon</div>
          <div class="text-caption mt-1">
            This license will expire within 90 days. Please ensure customer renews before rental
            period.
          </div>
        </template>
      </v-alert>
    </CommonFormSection>

    <!-- Additional Notes -->
    <CommonFormSection title="Additional Information" icon="mdi-note-text">
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="localForm.notes"
            label="Notes (Optional)"
            placeholder="Add any special notes or preferences about this customer..."
            variant="outlined"
            density="comfortable"
            rows="4"
            prepend-inner-icon="mdi-note-text-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useCountryLocations } from '~/composables/useCountryLocations'
import type { CustomerStatus } from '~/types/customer'

export interface CustomerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  address: string
  city: string
  state: string
  zipCode: string
  driversLicense: string
  licenseExpiry: string
  dateOfBirth: string
  status: CustomerStatus
  notes: string
}

const props = defineProps<{
  modelValue: CustomerFormData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CustomerFormData]
}>()

const { rules } = useFormValidation()
const { getCountryOptions, getStateOptions, getCityOptions } = useCountryLocations()

const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Blocked', value: 'blocked' },
]

const countryOptions = computed(() => getCountryOptions())

const stateOptions = computed(() => {
  if (!localForm.value.country) return []
  return getStateOptions(localForm.value.country)
})

const cityOptions = computed(() => {
  if (!localForm.value.country || !localForm.value.state) return []
  return getCityOptions(localForm.value.country, localForm.value.state)
})

const localForm = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Maximum date of birth (must be at least 18 years old)
const maxDateOfBirth = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 18)
  return date.toISOString().split('T')[0]
})

// Check if license is expiring within 90 days
const isLicenseExpiringSoon = computed(() => {
  if (!localForm.value.licenseExpiry) return false

  const expiryDate = new Date(localForm.value.licenseExpiry)
  const today = new Date()
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return daysUntilExpiry <= 90 && daysUntilExpiry > 0
})

// Handle country change - reset state and city
const handleCountryChange = () => {
  localForm.value.state = ''
  localForm.value.city = ''
}

// Handle state change - reset city
const handleStateChange = () => {
  localForm.value.city = ''
}
</script>
