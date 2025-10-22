<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Rentals"
      subtitle="Track and manage rental bookings"
      action-text="New Rental"
      action-icon="mdi-plus"
      @action-click="$router.push('/rentals/add')"
    />

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <RentalFilters
          :filters="filters"
          :status-options="statusOptions"
          :date-range-options="dateRangeOptions"
          @update:search="(val: string) => filters.search = val"
          @update:status="(val: any) => filters.status = val"
          @update:date-range="(val: string) => filters.dateRange = val"
        />
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" lg="3">
        <CommonUiStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <!-- Rentals Table -->
    <v-row>
      <v-col cols="12">
        <RentalsTable
          :rentals="filteredRentals"
          :format-date="formatDate"
          :get-status-color="getStatusColor"
          @view="handleViewRental"
          @edit="handleEditRental"
          @delete="handleDeleteRental"
        />
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <CommonDialogDeleteConfirmation
      v-model="showDeleteDialog"
      title="Delete Rental?"
      :item-name="rentalToDelete ? rentalToDelete.customerName : ''"
      :item-details="rentalToDelete ? `${rentalToDelete.vehicleName} • ${formatDate(rentalToDelete.startDate)} - ${formatDate(rentalToDelete.endDate)}` : ''"
      icon="mdi-calendar-remove"
      message="This action is permanent and cannot be undone"
      :loading="deleting"
      @confirm="deleteRental"
      @cancel="cancelDelete"
    />

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRentals } from '~/composables/useRentals'
import { useCurrency } from '~/composables/useCurrency'
import { useSnackbar } from '~/composables/useSnackbar'

const router = useRouter()
const { rentals, filters, filteredRentals, getStatusColor, formatDate } = useRentals()
const { formatCurrency } = useCurrency()
const { snackbar, showSuccess, showError } = useSnackbar()

// Delete state
const showDeleteDialog = ref(false)
const rentalToDelete = ref<any>(null)
const deleting = ref(false)

// Filter options
const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Reserved', value: 'reserved' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' },
]

const dateRangeOptions = [
  { title: 'All Time', value: 'all' },
  { title: 'Today', value: 'today' },
  { title: 'This Week', value: 'week' },
  { title: 'This Month', value: 'month' },
  { title: 'This Year', value: 'year' },
]

// Optimized stats - compute once instead of filtering multiple times
const stats = computed(() => {
  const activeCount = rentals.value.filter(r => r.status === 'active').length
  const reservedCount = rentals.value.filter(r => r.status === 'reserved').length
  const completedCount = rentals.value.filter(r => r.status === 'completed').length
  const totalRevenue = rentals.value
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.totalAmount, 0)

  return [
    {
      icon: 'mdi-check-circle',
      label: 'Active Rentals',
      value: activeCount,
      color: 'success'
    },
    {
      icon: 'mdi-calendar-clock',
      label: 'Reserved',
      value: reservedCount,
      color: 'warning'
    },
    {
      icon: 'mdi-check-all',
      label: 'Completed',
      value: completedCount,
      color: 'info'
    },
    {
      icon: 'mdi-currency-usd',
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      color: 'primary'
    }
  ]
})

// Action handlers
const handleViewRental = (rental: any) => {
  router.push(`/rentals/${rental.id}`)
}

const handleEditRental = (rental: any) => {
  router.push(`/rentals/edit/${rental.id}`)
}

const handleDeleteRental = (rental: any) => {
  rentalToDelete.value = rental
  showDeleteDialog.value = true
}

const deleteRental = async () => {
  if (!rentalToDelete.value) return

  deleting.value = true

  try {
    // TODO: Implement API call to delete rental
    console.log('Deleting rental:', rentalToDelete.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove rental from the list
    const index = rentals.value.findIndex(r => r.id === rentalToDelete.value.id)
    if (index > -1) {
      rentals.value.splice(index, 1)
    }

    showSuccess(`Rental for ${rentalToDelete.value.customerName} has been deleted successfully.`)
    showDeleteDialog.value = false
    rentalToDelete.value = null
  } catch (error) {
    console.error('Error deleting rental:', error)
    showError('Failed to delete rental. Please try again.')
  } finally {
    deleting.value = false
  }
}

const cancelDelete = () => {
  rentalToDelete.value = null
}
</script>
