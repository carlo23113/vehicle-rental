<template>
  <CommonPageLayout
    title="Customers"
    subtitle="Manage customer profiles and information"
    action-text="Add Customer"
    action-icon="mdi-plus"
    @action-click="handleAddCustomer"
  >
    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyCustomersFilters
        v-if="isFilterVisible || sections.stats"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <LazyCustomersStatsCards :stats="stats" />
    </template>

    <!-- Main Content Slot -->
    <template #content>
      <LazyCustomersTableSection
        :customers="displayedItems"
        :is-loading-more="isLoadingMore"
        :get-status-color="getStatusColor"
        :get-full-name="getFullName"
        :get-initials="getInitials"
        :format-date="formatDate"
        @view="handleViewCustomer"
        @edit="handleEditCustomer"
        @delete="handleDeleteCustomer"
      />
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <LazyCustomersDeleteDialog
        v-if="showDeleteDialog"
        v-model="showDeleteDialog"
        :customer="customerToDelete"
        :deleting="deleting"
        :get-full-name="getFullName"
        @confirm="handleDelete"
        @cancel="handleCancelDelete"
      />
    </template>

    <!-- Snackbar Slot -->
    <template #snackbar>
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomers } from '~/composables/useCustomers'
import { useSnackbar } from '~/composables/useSnackbar'
import { useCustomerStats } from '~/composables/useCustomerStats'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'

const router = useRouter()

// Core composables
const {
  customers,
  filters,
  filteredCustomers,
  deleteCustomer,
  getStatusColor,
  getFullName,
  getInitials,
  formatDate,
} = useCustomers()
const { snackbar, showSuccess, showError } = useSnackbar()

// Stats calculation (DRY - extracted to composable)
const { stats } = useCustomerStats(customers)

// Progressive table loading (DRY - reusing composable)
const {
  displayedItems,
  isLoadingMore,
  updateDisplayedItems,
} = useProgressiveTable(filteredCustomers, { batchSize: 20 })

// Debounced filters (DRY - reusing composable)
const { watchImmediateFilters } = useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems,
  onFilterChange: updateDisplayedItems,
})

// Watch immediate filters (status)
watchImmediateFilters(['status'])

// UI state
const showFilters = ref(false)
const showDeleteDialog = ref(false)
const customerToDelete = ref<any>(null)
const deleting = ref(false)

// Action handlers (DRY - using helper function)
const navigateToRoute = (path: string) => router.push(path)

const handleAddCustomer = () => navigateToRoute('/owner/customers/add')
const handleViewCustomer = (customer: any) => navigateToRoute(`/owner/customers/${customer.id}`)
const handleEditCustomer = (customer: any) =>
  navigateToRoute(`/owner/customers/edit/${customer.id}`)

const handleDeleteCustomer = (customer: any) => {
  customerToDelete.value = customer
  showDeleteDialog.value = true
}

// Delete handler (DRY - extracted helper for list removal)
const removeFromList = (list: any[], id: number) => {
  const index = list.findIndex(c => c.id === id)
  if (index > -1) list.splice(index, 1)
}

const handleDelete = async () => {
  if (!customerToDelete.value) return

  deleting.value = true

  try {
    // Delete customer from store
    deleteCustomer(customerToDelete.value.id)

    // Remove from displayed items (maintain consistency)
    removeFromList(displayedItems.value, customerToDelete.value.id)

    showSuccess(`${getFullName(customerToDelete.value)} has been deleted successfully.`)
    showDeleteDialog.value = false
    customerToDelete.value = null
  } catch (error) {
    console.error('Error deleting customer:', error)
    showError('Failed to delete customer. Please try again.')
  } finally {
    deleting.value = false
  }
}

const handleCancelDelete = () => {
  customerToDelete.value = null
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: 'all',
  }
}
</script>
