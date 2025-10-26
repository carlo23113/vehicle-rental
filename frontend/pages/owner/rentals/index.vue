<template>
  <CommonPageContainer>
    <!-- Header - Critical content (always visible) -->
    <CommonPageHeader
      title="Rentals"
      subtitle="Track and manage rental bookings"
      action-text="New Rental"
      action-icon="mdi-plus"
      @action-click="handleAddRental"
    />

    <!-- Filters - Code-split lazy loaded component -->
    <LazyRentalsFilters
      v-if="showFilters || sectionsLoaded.stats"
      v-model:show-filters="showFilters"
      v-model:filters="filters"
      @clear="clearFilters"
    />

    <!-- Statistics Cards - Code-split with intersection observer -->
    <div ref="statsSection">
      <LazyRentalsStatsCards v-if="sectionsLoaded.stats" :stats="stats" />
      <RentalsStatsSkeleton v-else />
    </div>

    <!-- Rentals Table - Code-split with progressive loading -->
    <div ref="tableSection">
      <LazyRentalsTableSection
        v-if="sectionsLoaded.table"
        :rentals="displayedItems"
        :is-loading-more="isLoadingMore"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :get-payment-status-color="getPaymentStatusColor"
        @view="handleViewRental"
        @edit="handleEditRental"
        @delete="handleDeleteRental"
        @generate-invoice="handleGenerateInvoice"
      />
      <RentalsTableSkeleton v-else />
    </div>

    <!-- Delete Dialog - Code-split lazy loaded -->
    <LazyRentalsDeleteDialog
      v-if="showDeleteDialog"
      v-model="showDeleteDialog"
      :rental="rentalToDelete"
      :deleting="deleting"
      :format-date="formatDate"
      @confirm="deleteRental"
      @cancel="cancelDelete"
    />

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRentals } from '~/composables/useRentals'
import { useCustomers } from '~/composables/useCustomers'
import { useSnackbar } from '~/composables/useSnackbar'
import { useRentalStats } from '~/composables/useRentalStats'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'

const router = useRouter()
const route = useRoute()

// Core composables
const { rentals, filters, filteredRentals, getStatusColor, getPaymentStatusColor, formatDate } =
  useRentals()
const { customers, getFullName } = useCustomers()
const { snackbar, showSuccess, showError } = useSnackbar()

// Stats calculation (DRY - extracted to composable)
const { stats } = useRentalStats(rentals)

// Progressive table loading (DRY - extracted to composable)
const {
  statsSection,
  tableSection,
  sectionsLoaded,
  displayedItems,
  isLoadingMore,
  updateDisplayedItems,
} = useProgressiveTable(filteredRentals, { batchSize: 20 })

// Debounced filters (DRY - extracted to composable)
const { watchImmediateFilters } = useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: () => {
    if (sectionsLoaded.value.table) {
      updateDisplayedItems()
    }
  },
  onFilterChange: () => {
    if (sectionsLoaded.value.table) {
      updateDisplayedItems()
    }
  },
})

// Watch immediate filters (status, payment, dateRange)
watchImmediateFilters(['status', 'paymentStatus', 'dateRange'])

// UI state
const showFilters = ref(false)
const showDeleteDialog = ref(false)
const rentalToDelete = ref<any>(null)
const deleting = ref(false)

// Initialize with customer filter if provided
onMounted(() => {
  const customerId = route.query.customerId
  if (customerId) {
    const customer = customers.value.find(c => c.id === Number(customerId))
    if (customer) {
      filters.value.search = getFullName(customer)
    }
  }
})

// Action handlers (DRY - using helper function)
const navigateToRoute = (path: string) => router.push(path)

const handleAddRental = () => navigateToRoute('/owner/rentals/add')
const handleViewRental = (rental: any) => navigateToRoute(`/owner/rentals/${rental.id}`)
const handleEditRental = (rental: any) => navigateToRoute(`/owner/rentals/edit/${rental.id}`)
const handleGenerateInvoice = (rental: any) =>
  navigateToRoute(`/owner/invoices/new?rentalId=${rental.id}`)

const handleDeleteRental = (rental: any) => {
  rentalToDelete.value = rental
  showDeleteDialog.value = true
}

// Delete handler (DRY - extracted helper for list removal)
const removeFromList = (list: any[], id: number) => {
  const index = list.findIndex(r => r.id === id)
  if (index > -1) list.splice(index, 1)
}

const deleteRental = async () => {
  if (!rentalToDelete.value) return

  deleting.value = true

  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove from both lists (maintain consistency)
    removeFromList(rentals.value, rentalToDelete.value.id)
    removeFromList(displayedItems.value, rentalToDelete.value.id)

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

const clearFilters = () => {
  filters.value = {
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
  }
}
</script>
