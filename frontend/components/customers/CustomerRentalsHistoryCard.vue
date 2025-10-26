<template>
  <CommonUiDetailCard title="Rental History" icon="mdi-history">
    <template #actions>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        prepend-icon="mdi-open-in-new"
        @click="viewAllRentals"
      >
        View All
      </v-btn>
    </template>

    <div v-if="rentals.length === 0" class="text-center py-8">
      <v-icon icon="mdi-calendar-remove" size="48" color="grey-lighten-1" class="mb-3" />
      <p class="text-body-2 text-medium-emphasis">No rental history found</p>
    </div>

    <div v-else class="rentals-list">
      <div
        v-for="rental in rentals"
        :key="rental.id"
        class="rental-item"
        @click="viewRental(rental.id)"
      >
        <div class="rental-header">
          <div class="flex items-center gap-3">
            <v-avatar size="40" class="vehicle-icon">
              <v-icon icon="mdi-car" size="20" />
            </v-avatar>
            <div class="flex-1">
              <div class="text-subtitle-2 font-weight-bold">{{ rental.vehicleName }}</div>
              <div class="text-caption text-medium-emphasis">{{ rental.licensePlate }}</div>
            </div>
          </div>
          <v-chip :color="getStatusColor(rental.status)" size="small" variant="tonal">
            {{ rental.status }}
          </v-chip>
        </div>

        <div class="rental-details">
          <div class="detail-row">
            <v-icon icon="mdi-calendar-range" size="16" class="text-medium-emphasis" />
            <span class="text-caption text-medium-emphasis">
              {{ formatDate(rental.startDate) }} - {{ formatDate(rental.endDate) }}
            </span>
          </div>
          <div class="detail-row">
            <v-icon icon="mdi-calendar-clock" size="16" class="text-medium-emphasis" />
            <span class="text-caption text-medium-emphasis">
              {{ rental.numberOfDays }} day{{ rental.numberOfDays !== 1 ? 's' : '' }}
            </span>
          </div>
          <div class="detail-row">
            <v-icon :icon="getCurrencyIcon()" size="16" class="text-medium-emphasis" />
            <span class="text-caption font-weight-bold">
              {{ formatCurrency(rental.totalAmount) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCurrency } from '~/composables/useCurrency'
import type { Rental } from '~/types/rental'

interface Props {
  rentals: Rental[]
  customerId: number
  formatDate: (date: string) => string
}

const props = defineProps<Props>()
const router = useRouter()
const { formatCurrency, getCurrencyIcon } = useCurrency()

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'success',
    completed: 'info',
    reserved: 'warning',
    cancelled: 'error',
  }
  return colors[status] || 'default'
}

const viewRental = (rentalId: number) => {
  router.push(`/rentals/${rentalId}`)
}

const viewAllRentals = () => {
  router.push(`/rentals?customerId=${props.customerId}`)
}
</script>

<style lang="scss" scoped>
.rentals-list {
  @apply flex flex-col gap-3;
}

.rental-item {
  @apply p-4 rounded-xl cursor-pointer transition-all duration-200 border;
  background: rgba(var(--v-theme-surface), 0.6);
  border-color: rgba(var(--v-border-color), 0.08);

  &:hover {
    background: rgba(var(--v-theme-surface), 1);
    border-color: rgba(var(--v-theme-primary), 0.2);
    @apply shadow-md;
  }
}

.rental-header {
  @apply flex items-center justify-between mb-3;
}

.vehicle-icon {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1),
    rgba(var(--v-theme-secondary), 0.1)
  );
}

.rental-details {
  @apply flex flex-col gap-2;
}

.detail-row {
  @apply flex items-center gap-2;
}
</style>
