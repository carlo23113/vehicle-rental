<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Maintenance"
      subtitle="Track vehicle maintenance and service records"
      action-text="Schedule Maintenance"
      action-icon="mdi-plus"
      @action-click="$router.push('/maintenance/add')"
    />

    <!-- Filters -->
    <CommonFilterSection v-model="showFilters" :filters="filters" @clear="clearFilters">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="filters.search"
            variant="outlined"
            density="comfortable"
            placeholder="Search by vehicle or description..."
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="4" md="2">
          <v-select
            v-model="filters.type"
            :items="typeOptions"
            variant="outlined"
            density="comfortable"
            label="Type"
            prepend-inner-icon="mdi-wrench"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="4" md="2">
          <v-select
            v-model="filters.status"
            :items="statusOptions"
            variant="outlined"
            density="comfortable"
            label="Status"
            prepend-inner-icon="mdi-check-circle"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="4" md="2">
          <v-select
            v-model="filters.priority"
            :items="priorityOptions"
            variant="outlined"
            density="comfortable"
            label="Priority"
            prepend-inner-icon="mdi-alert"
            clearable
          />
        </v-col>
      </v-row>
    </CommonFilterSection>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" lg="3">
        <CommonUiStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <!-- Maintenance Table -->
    <v-row>
      <v-col cols="12">
        <MaintenanceTable
          :records="filteredRecords"
          :format-date="formatDate"
          :get-status-color="getStatusColor"
          :get-priority-color="getPriorityColor"
          :get-type-label="getTypeLabel"
          @view="viewRecord"
          @edit="editRecord"
          @delete="openDeleteDialog"
          @complete="openCompleteDialog"
        />
      </v-col>
    </v-row>

    <!-- Complete Confirmation Dialog -->
    <CommonDialogConfirmationDialog
      v-model="showCompleteDialog"
      title="Mark Maintenance as Complete?"
      :item-name="`${recordToComplete?.vehicleName} - ${recordToComplete ? getTypeLabel(recordToComplete.type) : ''}`"
      :item-details="recordToComplete ? `Scheduled: ${formatDate(recordToComplete.scheduledDate)}` : ''"
      icon="mdi-wrench"
      icon-name="mdi-check-circle-outline"
      message="This will update the status to completed"
      confirm-text="Mark Complete"
      color="success"
      :loading="completing"
      @confirm="handleComplete"
      @cancel="cancelComplete"
    />

    <!-- Delete Confirmation Dialog -->
    <CommonDialogDeleteConfirmation
      v-model="showDeleteDialog"
      title="Delete Maintenance Record?"
      :item-name="`${recordToDelete?.vehicleName} - ${recordToDelete ? getTypeLabel(recordToDelete.type) : ''}`"
      :item-details="recordToDelete ? `Scheduled: ${formatDate(recordToDelete.scheduledDate)}` : ''"
      icon="mdi-delete"
      message="This action is permanent and cannot be undone"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenance } from '~/composables/useMaintenance'
import { useCurrency } from '~/composables/useCurrency'
import type { MaintenanceType, MaintenanceStatus, MaintenancePriority } from '~/types/maintenance'

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

// Optimized stats - compute once instead of filtering multiple times
const stats = computed(() => {
  const scheduledCount = maintenanceRecords.value.filter(r => r.status === 'scheduled').length
  const inProgressCount = maintenanceRecords.value.filter(r => r.status === 'in-progress').length
  const completedCount = maintenanceRecords.value.filter(r => r.status === 'completed').length
  const totalCost = maintenanceRecords.value
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.cost, 0)

  return [
    {
      icon: 'mdi-calendar-clock',
      label: 'Scheduled',
      value: scheduledCount,
      color: 'info',
    },
    {
      icon: 'mdi-tools',
      label: 'In Progress',
      value: inProgressCount,
      color: 'warning',
    },
    {
      icon: 'mdi-check-circle',
      label: 'Completed',
      value: completedCount,
      color: 'success',
    },
    {
      icon: getCurrencyIcon(),
      label: 'Total Cost',
      value: formatCurrency(totalCost),
      color: 'primary',
    },
  ]
})

const typeOptions = [
  { title: 'All Types', value: 'all' },
  { title: 'Oil Change', value: 'oil-change' },
  { title: 'Tire Rotation', value: 'tire-rotation' },
  { title: 'Brake Service', value: 'brake-service' },
  { title: 'Inspection', value: 'inspection' },
  { title: 'Repair', value: 'repair' },
  { title: 'Cleaning', value: 'cleaning' },
  { title: 'Other', value: 'other' },
]

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in-progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' },
]

const priorityOptions = [
  { title: 'All Priorities', value: 'all' },
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
  { title: 'Urgent', value: 'urgent' },
]

const viewRecord = (record: any) => {
  router.push(`/maintenance/${record.id}`)
}

const editRecord = (record: any) => {
  router.push(`/maintenance/edit/${record.id}`)
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
