<template>
  <div>
    <!-- Customer Information -->
    <CommonFormSection title="Customer Information" icon="mdi-account">
      <!-- Customer Mode Toggle -->
      <div class="mb-6 d-flex justify-space-between align-center flex-wrap gap-3">
        <div>
          <p class="text-body-2 font-weight-medium mb-1">Customer Selection</p>
          <p class="text-caption text-medium-emphasis">
            Choose from existing customers or add a new one
          </p>
        </div>
        <CommonUiSegmentedControl v-model="customerMode" :options="customerModeOptions" />
      </div>

      <!-- Existing Customer Selection -->
      <v-row v-if="customerMode === 'existing'">
        <v-col cols="12">
          <CustomerAutocomplete
            v-model="localForm.customerId"
            :customers="activeCustomers"
            :rules="[rules.required]"
            @update:model-value="handleCustomerSelect"
          />
        </v-col>

        <!-- Display selected customer details -->
        <v-col v-if="selectedCustomer" cols="12">
          <CustomerDetailCard :customer="selectedCustomer" />
        </v-col>
      </v-row>

      <!-- New Customer Form -->
      <v-row v-else>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.customerName"
            label="Customer Name"
            placeholder="John Doe"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.customerEmail"
            label="Email Address"
            placeholder="john.doe@email.com"
            variant="outlined"
            density="comfortable"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.customerPhone"
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
            v-model="localForm.customerLicense"
            label="Driver's License Number"
            placeholder="DL123456789"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-card-account-details-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Vehicle Selection -->
    <CommonFormSection title="Vehicle Selection" icon="mdi-car">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.vehicleId"
            label="Select Vehicle"
            placeholder="Choose a vehicle"
            variant="outlined"
            density="comfortable"
            :items="availableVehicles"
            item-title="label"
            item-value="value"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-car-outline"
            @update:model-value="handleVehicleChange"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <v-avatar size="40" class="vehicle-avatar">
                    <v-icon icon="mdi-car" size="20" />
                  </v-avatar>
                </template>
                <template #subtitle>
                  <span class="text-xs">{{ item.raw.subtitle }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.rateType"
            label="Rate Type"
            placeholder="Select rate type"
            variant="outlined"
            density="comfortable"
            :items="rateTypeOptions"
            item-title="label"
            item-value="value"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-map-marker-distance"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #subtitle>
                  <span class="text-caption">{{ item.raw.description }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="selectedVehicleRate"
            label="Daily Rate"
            variant="outlined"
            density="comfortable"
            readonly
            prepend-inner-icon="mdi-currency-usd"
            :hint="rateHint"
            persistent-hint
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Rental Period -->
    <CommonFormSection title="Rental Period" icon="mdi-calendar-range">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localForm.startDate"
            label="Start Date"
            type="date"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-calendar-start"
            :min="todayDate"
            @update:model-value="handleStartDateChange"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localForm.pickupTime"
            label="Pickup Time"
            type="time"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-clock-outline"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="localForm.pickupLocation"
            label="Pickup Location"
            placeholder="Select pickup location"
            variant="outlined"
            density="comfortable"
            :items="pickupLocationOptions"
            item-title="title"
            item-value="value"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-map-marker-outline"
            readonly
            :hint="pickupLocationHint"
            persistent-hint
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
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localForm.endDate"
            label="End Date"
            type="date"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-calendar-end"
            readonly
            hint="Auto-calculated based on start date and days"
            persistent-hint
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localForm.returnTime"
            label="Return Time"
            type="time"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-clock-check-outline"
            readonly
            :hint="returnTimeHint"
            persistent-hint
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="localForm.amountOfDays"
            label="Amount of Days"
            type="number"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required, rules.positiveNumber]"
            prepend-inner-icon="mdi-counter"
            min="1"
            @update:model-value="calculateEndDate"
          />
        </v-col>
      </v-row>

      <!-- Duration and Cost Summary -->
      <v-alert
        v-if="rentalSummary.days > 0"
        type="info"
        variant="tonal"
        class="mt-4"
        border="start"
      >
        <template #text>
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 font-weight-bold mb-1">Rental Summary</div>
              <div class="text-caption text-medium-emphasis">
                {{ rentalSummary.days }} day{{ rentalSummary.days !== 1 ? 's' : '' }} ×
                {{ formatCurrency(rentalSummary.dailyRate) }}/day
              </div>
            </div>
            <div class="text-h5 font-weight-bold text-primary">
              {{ formatCurrency(rentalSummary.total) }}
            </div>
          </div>
        </template>
      </v-alert>
    </CommonFormSection>

    <!-- Additional Details -->
    <CommonFormSection title="Additional Details" icon="mdi-information-outline">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.status"
            label="Initial Status"
            variant="outlined"
            density="comfortable"
            :items="statusOptions"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-flag-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.mileageLimit"
            label="Mileage Limit (optional)"
            placeholder="e.g., 500"
            variant="outlined"
            density="comfortable"
            type="number"
            suffix="miles/day"
            prepend-inner-icon="mdi-speedometer"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="localForm.notes"
            label="Notes"
            placeholder="Add any special requirements or notes..."
            variant="outlined"
            density="comfortable"
            rows="3"
            prepend-inner-icon="mdi-note-text-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCurrency } from '~/composables/useCurrency'
import { useVehicles } from '~/composables/useVehicles'
import { useCustomers } from '~/composables/useCustomers'
import { useLocations } from '~/composables/useLocations'
import { useFormValidation } from '~/composables/useFormValidation'
import { useRentalCalculations } from '~/composables/useRentalCalculations'

export interface RentalFormData {
  customerId: number | null
  customerName: string
  customerEmail: string
  customerPhone: string
  customerLicense: string
  vehicleId: number | null
  startDate: string
  endDate: string
  amountOfDays: number | null
  pickupLocation: string
  pickupTime: string
  returnTime: string
  rateType: 'city' | 'province'
  status: string
  mileageLimit: number | null
  notes: string
}

const props = defineProps<{
  modelValue: RentalFormData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: RentalFormData]
}>()

const { formatCurrency } = useCurrency()
const { vehicles } = useVehicles()
const { customers, getFullName, getInitials } = useCustomers()
const { getLocationById, formatLocationForSelect } = useLocations()
const { rules } = useFormValidation()
const { calculateEndDate: calcEndDate, getTodayDate, formatDuration } = useRentalCalculations()

// Constants
const customerModeOptions = [
  { value: 'existing', label: 'Existing Customer', icon: 'mdi-account-search' },
  { value: 'new', label: 'New Customer', icon: 'mdi-account-plus' },
]

const rateTypeOptions = [
  {
    value: 'city',
    label: 'City Drive',
    description: 'For driving within city limits',
  },
  {
    value: 'province',
    label: 'Province Drive',
    description: 'For driving outside city limits or long distance',
  },
]

const statusOptions = [
  { title: 'Reserved', value: 'reserved' },
  { title: 'Active', value: 'active' },
]

const pickupLocationHint = 'Pickup location is automatically set based on vehicle location'

// Reactive state
const customerMode = ref<'existing' | 'new'>('existing')

const localForm = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Watch for pickup time changes to auto-update return time
watch(
  () => localForm.value.pickupTime,
  newPickupTime => {
    if (newPickupTime) {
      localForm.value.returnTime = newPickupTime
    }
  }
)

const todayDate = computed(() => getTodayDate())

// Active customers for selection
const activeCustomers = computed(() =>
  customers.value
    .filter(c => c.status === 'active')
    .map(c => {
      const fullName = getFullName(c)
      return {
        id: c.id,
        displayName: `${fullName} - ${c.email}`,
        fullName,
        initials: getInitials(c),
        email: c.email,
        phone: c.phone,
        driversLicense: c.driversLicense,
        totalRentals: c.totalRentals,
      }
    })
)

// Selected customer details
const selectedCustomer = computed(() => {
  if (!localForm.value.customerId) return null
  return activeCustomers.value.find(c => c.id === localForm.value.customerId)
})

// Handle customer selection
const handleCustomerSelect = (customerId: number | null) => {
  if (!customerId) {
    // Clear customer data if deselected
    Object.assign(localForm.value, {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerLicense: '',
    })
    return
  }

  const customer = customers.value.find(c => c.id === customerId)
  if (!customer) return

  Object.assign(localForm.value, {
    customerName: getFullName(customer),
    customerEmail: customer.email,
    customerPhone: customer.phone,
    customerLicense: customer.driversLicense,
  })
}

// Available vehicles (filter for available status)
const availableVehicles = computed(() =>
  vehicles.value
    .filter(v => v.status === 'available')
    .map(v => ({
      value: v.id,
      label: `${v.make} ${v.model} (${v.year})`,
      subtitle: `${v.licensePlate} • City: ${formatCurrency(v.rates.cityRate)} | Province: ${formatCurrency(v.rates.provinceRate)}/day`,
      rates: v.rates,
      locationId: v.locationId,
    }))
)

// Pickup location is auto-selected based on vehicle
const pickupLocationOptions = computed(() => {
  if (!localForm.value.vehicleId) return []

  const vehicle = vehicles.value.find(v => v.id === localForm.value.vehicleId)
  if (!vehicle) return []

  const location = getLocationById(vehicle.locationId)
  if (!location) return []

  return [formatLocationForSelect(location)]
})

// Rate hint
const rateHint = computed(() =>
  localForm.value.rateType
    ? `Rate for ${localForm.value.rateType} drive`
    : 'Select a rate type to see the daily rate'
)

// Selected vehicle rate
const selectedVehicleRate = computed(() => {
  const vehicle = availableVehicles.value.find(v => v.value === localForm.value.vehicleId)
  if (!vehicle || !localForm.value.rateType) return ''

  const rate = vehicle.rates[localForm.value.rateType === 'city' ? 'cityRate' : 'provinceRate']
  return `${formatCurrency(rate)}/day`
})

const handleVehicleChange = (vehicleId: number) => {
  const vehicle = vehicles.value.find(v => v.id === vehicleId)
  if (!vehicle) return

  // Auto-select pickup location based on vehicle location
  const location = getLocationById(vehicle.locationId)
  if (location) {
    localForm.value.pickupLocation = location.id
  }
}

// Calculate rental duration and cost
const rentalSummary = computed(() => {
  const days = localForm.value.amountOfDays || 0

  if (!localForm.value.vehicleId || !localForm.value.rateType || days === 0) {
    return { days: 0, dailyRate: 0, total: 0 }
  }

  const vehicle = availableVehicles.value.find(v => v.value === localForm.value.vehicleId)
  const dailyRate =
    vehicle?.rates[localForm.value.rateType === 'city' ? 'cityRate' : 'provinceRate'] || 0

  return {
    days,
    dailyRate,
    total: days * dailyRate,
  }
})

// Calculate end date based on start date and amount of days
// 1 day = 24 hours, so if pickup is today at 8am, return is tomorrow at 8am
const calculateEndDate = () => {
  if (!localForm.value.startDate || !localForm.value.amountOfDays) return

  const endDate = calcEndDate(localForm.value.startDate, localForm.value.amountOfDays)
  if (endDate) {
    localForm.value.endDate = endDate
  }
}

// Handle start date change
const handleStartDateChange = () => {
  if (localForm.value.amountOfDays) {
    calculateEndDate()
  }
}

// Return time hint
const returnTimeHint = computed(() =>
  localForm.value.amountOfDays
    ? `${localForm.value.amountOfDays} day${localForm.value.amountOfDays !== 1 ? 's' : ''} rental: Same time as pickup on return date`
    : 'Auto-calculated: Same time as pickup (24-hour periods)'
)
</script>

<style scoped>
.vehicle-avatar {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1),
    rgba(var(--v-theme-secondary), 0.1)
  );
}
</style>
