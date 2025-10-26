<template>
  <CommonPageContainer>
    <!-- Header - Critical content (always visible) -->
    <CommonPageHeader
      title="Vehicles"
      subtitle="Manage your fleet inventory"
      action-text="Add Vehicle"
      action-icon="mdi-plus"
      @action-click="handleAddVehicle"
    />

    <!-- Filters - Code-split lazy loaded component -->
    <LazyVehiclesFilters
      v-if="showFilters || isTableVisible"
      v-model:show-filters="showFilters"
      v-model:filters="filters"
      @clear="clearFilters"
    />

    <!-- Vehicles Table - Code-split with progressive loading -->
    <div ref="tableSection">
      <LazyVehiclesTableSection
        v-if="isTableVisible"
        :vehicles="displayedItems"
        :is-loading-more="isLoadingMore"
        :get-status-color="getStatusColor"
        :get-type-label="getTypeLabel"
        @view="handleViewVehicle"
        @edit="handleEditVehicle"
        @delete="handleDeleteVehicle"
        @row-click="handleViewVehicle"
      />
      <VehiclesTableSkeleton v-else />
    </div>

    <!-- Delete Dialog - Code-split lazy loaded -->
    <LazyVehiclesDeleteDialog
      v-if="showDeleteDialog"
      v-model="showDeleteDialog"
      :vehicle="vehicleToDelete"
      :deleting="deleting"
      @confirm="deleteVehicle"
      @cancel="handleCancelDelete"
    />

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicles } from '~/composables/useVehicles'
import { useSnackbar } from '~/composables/useSnackbar'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'

const router = useRouter()

// Core composables
const { filters, filteredVehicles, getStatusColor, getTypeLabel, vehicles } = useVehicles()
const { snackbar, showSuccess, showError } = useSnackbar()

// Progressive table loading (DRY - reusing composable from rentals)
const {
  tableSection,
  sectionsLoaded,
  displayedItems,
  isLoadingMore,
  updateDisplayedItems,
} = useProgressiveTable(filteredVehicles, { batchSize: 20 })

// Use table visibility from sections loaded
const isTableVisible = ref(false)

// Watch for section loading
watch(() => sectionsLoaded.value.table, (loaded) => {
  isTableVisible.value = loaded
})

// Debounced filters (DRY - reusing composable from rentals)
const { watchImmediateFilters } = useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: () => {
    if (isTableVisible.value) {
      updateDisplayedItems()
    }
  },
  onFilterChange: () => {
    if (isTableVisible.value) {
      updateDisplayedItems()
    }
  },
})

// Watch immediate filters (status, type)
watchImmediateFilters(['status', 'type'])

// UI state
const showFilters = ref(false)
const showDeleteDialog = ref(false)
const vehicleToDelete = ref<any>(null)
const deleting = ref(false)

// Action handlers (DRY - using helper function)
const navigateToRoute = (path: string) => router.push(path)

const handleAddVehicle = () => navigateToRoute('/owner/vehicles/add')
const handleViewVehicle = (vehicle: any) => navigateToRoute(`/owner/vehicles/${vehicle.id}`)
const handleEditVehicle = (vehicle: any) => navigateToRoute(`/owner/vehicles/edit/${vehicle.id}`)

const handleDeleteVehicle = (vehicle: any) => {
  vehicleToDelete.value = vehicle
  showDeleteDialog.value = true
}

// Delete handler (DRY - extracted helper for list removal)
const removeFromList = (list: any[], id: number) => {
  const index = list.findIndex(v => v.id === id)
  if (index > -1) list.splice(index, 1)
}

const deleteVehicle = async () => {
  if (!vehicleToDelete.value) return

  deleting.value = true

  try {
    // TODO: Implement API call to delete vehicle
    console.log('Deleting vehicle:', vehicleToDelete.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove vehicle from both lists (maintain consistency)
    removeFromList(vehicles.value, vehicleToDelete.value.id)
    removeFromList(displayedItems.value, vehicleToDelete.value.id)

    showSuccess(
      `${vehicleToDelete.value.make} ${vehicleToDelete.value.model} has been deleted successfully.`
    )
    showDeleteDialog.value = false
    vehicleToDelete.value = null
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    showError('Failed to delete vehicle. Please try again.')
  } finally {
    deleting.value = false
  }
}

const handleCancelDelete = () => {
  vehicleToDelete.value = null
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: 'all',
    type: 'all',
  }
}
</script>
