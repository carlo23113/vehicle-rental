<template>
  <CommonPageLayout
    title="Vehicles"
    subtitle="Manage your fleet inventory"
    action-text="Add Vehicle"
    action-icon="mdi-plus"
    @action-click="handleAddVehicle"
  >
    <!-- Header Actions Slot (Export Button) -->
    <template #header-actions>
      <CommonUiExportButton
        @export="handleQuickExport"
        @open-dialog="showExportDialog = true"
      />
    </template>

    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyVehiclesFilters
        v-if="isFilterVisible || sections.stats"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <LazyVehiclesStatsCards :stats="stats" />
    </template>

    <!-- Main Content Slot -->
    <template #content>
      <LazyVehiclesTableSection
        :vehicles="displayedItems"
        :is-loading-more="isLoadingMore"
        :get-status-color="getStatusColor"
        :get-type-label="getTypeLabel"
        :enable-bulk-actions="true"
        @view="handleViewVehicle"
        @edit="handleEditVehicle"
        @delete="handleDeleteVehicle"
        @row-click="handleViewVehicle"
        @bulk-status-update="handleBulkStatusUpdate"
        @status-action="handleStatusAction"
      />
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <LazyVehiclesDeleteDialog
        v-if="showDeleteDialog"
        v-model="showDeleteDialog"
        :vehicle="vehicleToDelete"
        :deleting="deleting"
        @confirm="deleteVehicle"
        @cancel="handleCancelDelete"
      />

      <CommonUiExportDialog
        v-if="showExportDialog"
        v-model="showExportDialog"
        entity-name="Vehicles"
        :total-count="vehicles.length"
        :filtered-count="filteredVehicles.length"
        :selected-count="0"
        :loading="exporting"
        default-filename="vehicles"
        @export="handleExport"
      />
    </template>

    <!-- Snackbar Slot -->
    <template #snackbar>
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicles } from '~/composables/useVehicles'
import { useVehicleStats } from '~/composables/useVehicleStats'
import { useSnackbar } from '~/composables/useSnackbar'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'
import { useExport } from '~/composables/useExport'
import type { ExportFormat, ExportOptions } from '~/composables/useExport'

const router = useRouter()

// Core composables
const { filters, filteredVehicles, getStatusColor, getTypeLabel, vehicles } = useVehicles()
const { stats } = useVehicleStats(vehicles)
const { snackbar, showSuccess, showError } = useSnackbar()
const { exportData } = useExport()

// Progressive table loading (DRY - reusing composable from rentals)
const {
  displayedItems,
  isLoadingMore,
  updateDisplayedItems,
} = useProgressiveTable(filteredVehicles, { batchSize: 20 })

// Debounced filters (DRY - reusing composable from rentals)
const { watchImmediateFilters } = useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems,
  onFilterChange: updateDisplayedItems,
})

// Watch immediate filters (status, type)
watchImmediateFilters(['status', 'type'])

// UI state
const showFilters = ref(false)
const showDeleteDialog = ref(false)
const vehicleToDelete = ref<any>(null)
const deleting = ref(false)
const exporting = ref(false)
const showExportDialog = ref(false)

// Export columns configuration
const exportColumns = computed<ExportOptions['columns']>(() => [
  { key: 'id', label: 'ID' },
  { key: 'make', label: 'Make' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Year' },
  { key: 'licensePlate', label: 'License Plate' },
  { key: 'type', label: 'Type', format: getTypeLabel },
  {
    key: 'status',
    label: 'Status',
    format: (value: string) => value.replace('-', ' ').toUpperCase()
  },
  { key: 'color', label: 'Color' },
  {
    key: 'mileage',
    label: 'Mileage',
    format: (value: number) => `${value.toLocaleString()} mi`
  },
  {
    key: 'rates.cityRate',
    label: 'City Rate',
    format: (value: number) => `$${value}`
  },
  {
    key: 'rates.provinceRate',
    label: 'Province Rate',
    format: (value: number) => `$${value}`
  },
  { key: 'lastRentalDate', label: 'Last Rental' },
  { key: 'lastUpdated', label: 'Last Updated' },
  { key: 'nextMaintenanceDate', label: 'Next Maintenance' },
])

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

// Quick export handler (from button dropdown)
const handleQuickExport = async (format: ExportFormat) => {
  exporting.value = true
  try {
    await exportData(filteredVehicles.value, format, {
      columns: exportColumns.value,
      title: 'Vehicles Report',
      filename: 'vehicles',
    })
    showSuccess(`Vehicles exported to ${format.toUpperCase()} successfully`)
  } catch (error) {
    console.error('Export error:', error)
    showError('Failed to export vehicles. Please try again.')
  } finally {
    exporting.value = false
  }
}

// Advanced export handler (from dialog)
const handleExport = async (payload: {
  format: ExportFormat
  scope: 'all' | 'filtered' | 'selected'
  filename: string
  includeTimestamp: boolean
}) => {
  exporting.value = true
  try {
    // Determine data to export based on scope
    let dataToExport = filteredVehicles.value
    if (payload.scope === 'all') {
      dataToExport = vehicles.value
    }
    // Note: 'selected' scope would need selected vehicles from table

    // Add timestamp to filename if requested
    let filename = payload.filename
    if (payload.includeTimestamp) {
      const timestamp = new Date().toISOString().split('T')[0]
      filename = `${filename}-${timestamp}`
    }

    await exportData(dataToExport, payload.format, {
      columns: exportColumns.value,
      title: 'Vehicles Report',
      filename,
    })

    showSuccess(`Vehicles exported to ${payload.format.toUpperCase()} successfully`)
    showExportDialog.value = false
  } catch (error) {
    console.error('Export error:', error)
    showError('Failed to export vehicles. Please try again.')
  } finally {
    exporting.value = false
  }
}

// Bulk action handlers
const handleBulkStatusUpdate = async (payload: { vehicles: any[]; status: string; notes: string }) => {
  try {
    console.log('Bulk status update:', payload)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update vehicle statuses
    payload.vehicles.forEach(vehicle => {
      const index = vehicles.value.findIndex(v => v.id === vehicle.id)
      if (index > -1 && vehicles.value[index]) {
        vehicles.value[index].status = payload.status as any
      }
    })

    showSuccess(`Successfully updated status for ${payload.vehicles.length} vehicle(s)`)
  } catch (error) {
    console.error('Bulk status update error:', error)
    showError('Failed to update vehicle statuses. Please try again.')
  }
}

// Status action handler
const handleStatusAction = async (payload: { action: string; item: any }) => {
  try {
    console.log('Status action:', payload)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Map actions to statuses
    const statusMap: Record<string, string> = {
      'mark-available': 'available',
      'mark-maintenance': 'maintenance',
      'mark-out-of-service': 'out-of-service',
      'mark-rented': 'rented',
    }

    const newStatus = statusMap[payload.action]
    if (newStatus) {
      const index = vehicles.value.findIndex(v => v.id === payload.item.id)
      if (index > -1 && vehicles.value[index]) {
        vehicles.value[index].status = newStatus as any
      }

      showSuccess(`Vehicle status updated to ${newStatus.replace('-', ' ')}`)
    }
  } catch (error) {
    console.error('Status action error:', error)
    showError('Failed to update vehicle status. Please try again.')
  }
}
</script>
