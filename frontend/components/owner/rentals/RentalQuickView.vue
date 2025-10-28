<template>
  <CommonUiQuickViewDialog
    v-model="dialogModel"
    :title="`Rental #${rental?.id}`"
    icon="mdi-calendar-clock"
    :show-view-details="true"
    @view-details="$emit('view-details', rental)"
  >
    <div v-if="rental" class="rental-quick-view">
      <!-- Header Section with Vehicle & Customer -->
      <v-row class="mb-4">
        <v-col cols="6">
          <div class="info-section">
            <div class="section-label">
              <v-icon icon="mdi-car" size="16" />
              Vehicle
            </div>
            <div class="d-flex align-center gap-3 mt-2">
              <CommonUiImageAvatar
                :src="rental.vehicleImage"
                :alt="rental.vehicleName"
                :fallback-icon="getVehicleIcon(rental.vehicleType)"
                :initials="getVehicleInitials(rental.vehicleName)"
                :size="48"
                :rounded="8"
              />
              <div>
                <div class="font-semibold text-body-1">{{ rental.vehicleName }}</div>
                <v-chip size="x-small" variant="outlined" class="mt-1">
                  {{ rental.licensePlate }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="info-section">
            <div class="section-label">
              <v-icon icon="mdi-account" size="16" />
              Customer
            </div>
            <div class="mt-2">
              <div class="font-semibold text-body-1">{{ rental.customerName }}</div>
              <div class="text-xs text-medium-emphasis">{{ rental.customerEmail }}</div>
              <div class="text-xs text-medium-emphasis">{{ rental.customerPhone }}</div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Rental Period & Status -->
      <v-row class="mb-4">
        <v-col cols="6">
          <div class="info-section">
            <div class="section-label">
              <v-icon icon="mdi-calendar-range" size="16" />
              Rental Period
            </div>
            <div class="mt-2">
              <div class="d-flex align-center gap-2 mb-1">
                <v-icon icon="mdi-calendar-start" size="14" color="primary" />
                <span class="text-sm">{{ formatDate(rental.startDate) }}</span>
              </div>
              <div class="d-flex align-center gap-2 mb-1">
                <v-icon icon="mdi-calendar-end" size="14" color="primary" />
                <span class="text-sm">{{ formatDate(rental.endDate) }}</span>
              </div>
              <v-chip size="small" variant="tonal" color="primary" class="mt-1">
                <v-icon icon="mdi-calendar" start size="12" />
                {{ rental.numberOfDays }} days
              </v-chip>
            </div>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="info-section">
            <div class="section-label">
              <v-icon icon="mdi-information" size="16" />
              Status
            </div>
            <div class="d-flex flex-column align-start gap-2 mt-2">
              <CommonUiTableChip
                :color="getStatusColor(rental.status)"
                :icon="getStatusIcon(rental.status)"
                :label="rental.status"
              />
              <CommonUiTableChip
                v-if="rental.paymentStatus"
                :color="getPaymentStatusColor(rental.paymentStatus)"
                icon="mdi-cash"
                :label="rental.paymentStatus"
                size="small"
                variant="tonal"
              />
              <v-chip
                v-if="isOverdue"
                color="error"
                size="small"
                variant="tonal"
                prepend-icon="mdi-alert-circle"
              >
                Overdue
              </v-chip>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Pricing & Location -->
      <v-row class="mb-4">
        <v-col cols="6">
          <div class="info-section">
            <div class="section-label">
              <v-icon icon="mdi-cash" size="16" />
              Pricing
            </div>
            <div class="mt-2">
              <div class="text-h5 font-bold text-primary">
                {{ formatCurrency(rental.totalAmount) }}
              </div>
              <div class="text-xs text-medium-emphasis">
                {{ formatCurrency(rental.dailyRate) }}/day
              </div>
              <div v-if="rental.depositAmount" class="text-xs text-medium-emphasis mt-1">
                Deposit: {{ formatCurrency(rental.depositAmount) }}
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="info-section">
            <div class="section-label">
              <v-icon icon="mdi-map-marker" size="16" />
              Locations
            </div>
            <div class="mt-2">
              <div class="d-flex align-center gap-2 mb-1">
                <v-icon icon="mdi-map-marker-up" size="14" color="success" />
                <span class="text-sm">{{ rental.pickupLocation }}</span>
              </div>
              <div class="d-flex align-center gap-2">
                <v-icon icon="mdi-map-marker-down" size="14" color="error" />
                <span class="text-sm">{{ rental.returnLocation }}</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Notes (if available) -->
      <div v-if="rental.notes" class="info-section">
        <div class="section-label">
          <v-icon icon="mdi-note-text" size="16" />
          Notes
        </div>
        <div class="mt-2 text-sm text-medium-emphasis">
          {{ rental.notes }}
        </div>
      </div>
    </div>
  </CommonUiQuickViewDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '~/composables/useCurrency'

const props = defineProps<{
  modelValue: boolean
  rental: any
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getPaymentStatusColor: (status: string) => string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'view-details': [rental: any]
}>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { formatCurrency } = useCurrency()

const isOverdue = computed(() => {
  if (!props.rental || props.rental.status !== 'active') return false
  const endDate = new Date(props.rental.endDate)
  const today = new Date()
  return endDate < today
})

const getVehicleInitials = (vehicleName: string): string => {
  const parts = vehicleName.split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return vehicleName.substring(0, 2).toUpperCase()
}

const getVehicleIcon = (vehicleType: string): string => {
  const icons: Record<string, string> = {
    sedan: 'mdi-car',
    suv: 'mdi-car-estate',
    truck: 'mdi-truck',
    van: 'mdi-van-utility',
    motorcycle: 'mdi-motorbike',
    luxury: 'mdi-car-sports',
  }
  return icons[vehicleType?.toLowerCase()] || 'mdi-car'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    active: 'mdi-check-circle',
    reserved: 'mdi-calendar-clock',
    completed: 'mdi-check-all',
    cancelled: 'mdi-cancel',
  }
  return icons[status] || 'mdi-help-circle'
}
</script>

<style scoped lang="scss">
.rental-quick-view {
  @apply min-h-[400px];
}

.info-section {
  @apply flex flex-col;
}

.section-label {
  @apply flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide;
}
</style>
