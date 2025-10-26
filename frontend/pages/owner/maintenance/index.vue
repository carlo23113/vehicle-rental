<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Maintenance"
      subtitle="Track vehicle maintenance and service records"
      action-text="Schedule Maintenance"
      action-icon="mdi-plus"
      @action-click="handleAddMaintenance"
    />

    <!-- Filters -->
    <LazyMaintenanceFilters
      v-if="showFilters || sectionsLoaded.stats"
      v-model="showFilters"
      v-model:filters="filters"
      @clear="clearFilters"
    />

    <!-- Statistics Cards -->
    <div ref="statsSection">
      <LazyMaintenanceStatsCards v-if="sectionsLoaded.stats" :stats="stats" />
      <LazyMaintenanceStatsSkeleton v-else />
    </div>

    <!-- Maintenance Table -->
    <div ref="tableSection">
      <LazyMaintenanceTableSection
        v-if="sectionsLoaded.table"
        :displayed-items="displayedItems"
        :is-loading-more="isLoadingMore"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :get-priority-color="getPriorityColor"
        :get-type-label="getTypeLabel"
        @view="handleViewRecord"
        @edit="handleEditRecord"
        @delete="openDeleteDialog"
        @complete="openCompleteDialog"
      />
      <LazyMaintenanceTableSkeleton v-else />
    </div>

    <!-- Complete Confirmation Dialog -->
    <LazyMaintenanceCompleteDialog
      v-model="showCompleteDialog"
      :record="recordToComplete"
      :loading="completing"
      :format-date="formatDate"
      :get-type-label="getTypeLabel"
      @confirm="handleComplete"
      @cancel="cancelComplete"
    />

    <!-- Delete Confirmation Dialog -->
    <LazyMaintenanceDeleteDialog
      v-model="showDeleteDialog"
      :record="recordToDelete"
      :loading="deleting"
      :format-date="formatDate"
      :get-type-label="getTypeLabel"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenance } from '~/composables/useMaintenance'
import { useCurrency } from '~/composables/useCurrency'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'
import { useMaintenanceStats } from '~/composables/useMaintenanceStats'

const router = useRouter()
const { formatCurrency, getCurrencyIcon } = useCurrency()

const {
  maintenanceRecords,
  filters,
  filteredRecords,
  completeMaintenanceRecord,
  deleteMaintenanceRecord,
  getStatusColor,
  getPriorityColor,
  getTypeLabel,
  formatDate,
} = useMaintenance()

// Filter state
const showFilters = ref(false)

// Progressive table loading with intersection observer
const {
  statsSection,
  tableSection,
  sectionsLoaded,
  displayedItems,
  isLoadingMore,
  updateDisplayedItems
} = useProgressiveTable(filteredRecords, { batchSize: 20 })

// Debounced filters
useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems
})

// Single-pass stats calculation
const { stats } = useMaintenanceStats(maintenanceRecords, formatCurrency, getCurrencyIcon)

// DRY navigation helper
const navigateToRoute = (path: string) => router.push(path)
const handleAddMaintenance = () => navigateToRoute('/owner/maintenance/add')
const handleViewRecord = (record: any) => navigateToRoute(`/owner/maintenance/${record.id}`)
const handleEditRecord = (record: any) => navigateToRoute(`/owner/maintenance/edit/${record.id}`)

// DRY list removal helper
const removeFromList = (list: any[], id: number | string) => {
  const index = list.findIndex(r => r.id === id)
  if (index > -1) list.splice(index, 1)
}

// Complete functionality
const showCompleteDialog = ref(false)
const recordToComplete = ref<any>(null)
const completing = ref(false)

const openCompleteDialog = (record: any) => {
  recordToComplete.value = record
  showCompleteDialog.value = true
}

const cancelComplete = () => {
  showCompleteDialog.value = false
  recordToComplete.value = null
}

const handleComplete = async () => {
  if (!recordToComplete.value) return

  completing.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    completeMaintenanceRecord(recordToComplete.value.id)

    snackbar.value = {
      show: true,
      message: 'Maintenance marked as completed',
      color: 'success',
      icon: 'mdi-check-circle'
    }

    showCompleteDialog.value = false
    recordToComplete.value = null
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to complete maintenance record',
      color: 'error',
      icon: 'mdi-alert-circle'
    }
  } finally {
    completing.value = false
  }
}

// Delete functionality
const showDeleteDialog = ref(false)
const recordToDelete = ref<any>(null)
const deleting = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success' as 'success' | 'error' | 'warning' | 'info',
  icon: 'mdi-check-circle',
})

const openDeleteDialog = (record: any) => {
  recordToDelete.value = record
  showDeleteDialog.value = true
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  recordToDelete.value = null
}

const handleDelete = async () => {
  if (!recordToDelete.value) return

  deleting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    deleteMaintenanceRecord(recordToDelete.value.id)

    // Remove from both lists
    removeFromList(maintenanceRecords.value, recordToDelete.value.id)
    removeFromList(displayedItems.value, recordToDelete.value.id)

    snackbar.value = {
      show: true,
      message: 'Maintenance record deleted successfully',
      color: 'success',
      icon: 'mdi-check-circle',
    }

    showDeleteDialog.value = false
    recordToDelete.value = null
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to delete maintenance record',
      color: 'error',
      icon: 'mdi-alert-circle',
    }
  } finally {
    deleting.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    type: 'all',
    status: 'all',
    priority: 'all',
  }
}
</script>
