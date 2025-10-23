<template>
  <CommonPageContainer v-if="!loading && maintenance">
    <!-- Header with Breadcrumbs and Actions -->
    <CommonPageDetailPageHeader
      :title="`Maintenance #${maintenance.id}`"
      :subtitle="`${maintenance.vehicleName} • ${getTypeLabel(maintenance.type)}`"
      :badge="maintenance.status"
      :badge-color="getStatusColor(maintenance.status)"
      show-breadcrumbs
      parent-label="Maintenance"
      parent-icon="mdi-tools"
      :actions="headerActions"
      @back="$router.push('/maintenance')"
      @action="handleAction"
    />

    <v-row>
      <!-- Left Column: Main Info -->
      <v-col cols="12" lg="8">
        <MaintenanceVehicleCard :maintenance="maintenance" class="mb-6" />
        <MaintenanceInfoCard
          :maintenance="maintenance"
          :type-label="getTypeLabel(maintenance.type)"
          :get-status-color="getStatusColor"
          :get-priority-color="getPriorityColor"
          :format-date="formatDate"
          class="mb-6"
        />
      </v-col>

      <!-- Right Column: Cost and Actions -->
      <v-col cols="12" lg="4">
        <MaintenanceCostCard
          :maintenance="maintenance"
          :format-date="formatDate"
          class="mb-6"
        />

        <MaintenanceActionsCard
          :maintenance="maintenance"
          @complete="openCompleteDialog"
          @edit="handleEdit"
          @delete="openDeleteDialog"
          @print="handlePrint"
        />
      </v-col>
    </v-row>

    <!-- Complete Confirmation Dialog -->
    <CommonDialogConfirmationDialog
      v-model="showCompleteDialog"
      title="Mark Maintenance as Complete?"
      :item-name="`${maintenance.vehicleName} - ${getTypeLabel(maintenance.type)}`"
      :item-details="`Scheduled: ${formatDate(maintenance.scheduledDate)}`"
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
      :item-name="`${maintenance.vehicleName} - ${getTypeLabel(maintenance.type)}`"
      :item-details="`Scheduled: ${formatDate(maintenance.scheduledDate)}`"
      icon="mdi-delete"
      message="This action is permanent and cannot be undone"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>

  <!-- Loading State -->
  <CommonPageContainer v-else>
    <div class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="text-body-1 text-medium-emphasis mt-4">Loading maintenance details...</p>
    </div>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMaintenanceDetails } from '~/composables/useMaintenanceDetails'
import { useCurrency } from '~/composables/useCurrency'
import { maintenancePrintStyles } from '~/utils/maintenancePrintStyles'

const route = useRoute()
const maintenanceId = String(route.params.id)

const {
  maintenance,
  loading,
  snackbar,
  showCompleteDialog,
  completing,
  openCompleteDialog,
  cancelComplete,
  showDeleteDialog,
  deleting,
  loadMaintenance,
  handleEdit,
  handleComplete,
  openDeleteDialog,
  handleDelete,
  cancelDelete,
  getStatusColor,
  getPriorityColor,
  getTypeLabel,
  formatDate
} = useMaintenanceDetails(maintenanceId)

const { formatCurrency } = useCurrency()

const headerActions = computed(() => {
  const actions = [
    {
      key: 'edit',
      label: 'Edit',
      icon: 'mdi-pencil',
      variant: 'outlined' as const,
      color: 'primary',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'mdi-delete',
      variant: 'outlined' as const,
      color: 'error',
    },
  ]

  // Add complete action if not already completed
  if (maintenance.value?.status === 'scheduled' || maintenance.value?.status === 'in-progress') {
    actions.unshift({
      key: 'complete',
      label: 'Mark Complete',
      icon: 'mdi-check-circle',
      variant: 'outlined' as const,
      color: 'success',
    })
  }

  return actions
})

const handleAction = (key: string) => {
  if (key === 'edit') {
    handleEdit()
  } else if (key === 'delete') {
    openDeleteDialog()
  } else if (key === 'complete') {
    openCompleteDialog()
  }
}

const handlePrint = () => {
  if (!maintenance.value) return

  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  // Get the report component HTML
  const reportHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Maintenance Report #${maintenance.value.id}</title>
        <style>${maintenancePrintStyles}</style>
      </head>
      <body>
        ${generateReportHTML()}
      </body>
    </html>
  `

  printWindow.document.write(reportHTML)
  printWindow.document.close()

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print()
  }
}

const generateReportHTML = () => {
  if (!maintenance.value) return ''

  const companyInfo = {
    name: 'Vehicle Rental Management',
    address: '123 Main Street, City, State 12345',
    phone: '(555) 123-4567',
    email: 'info@vrm.com'
  }

  const formatDateForPrint = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return `
    <div class="maintenance-report">
      <div class="report-header">
        <h1 class="company-name">${companyInfo.name}</h1>
        <div class="company-info">
          <p>${companyInfo.address}</p>
          <p>Phone: ${companyInfo.phone} | Email: ${companyInfo.email}</p>
        </div>
      </div>

      <div class="report-title">
        <h2>MAINTENANCE REPORT</h2>
        <p class="report-number">Report #${maintenance.value.id}</p>
        <p class="report-date">Generated: ${formatDateForPrint(new Date())}</p>
      </div>

      <section class="report-section">
        <h3>VEHICLE INFORMATION</h3>
        <div class="section-content">
          <table class="info-table">
            <tr>
              <td><strong>Vehicle:</strong></td>
              <td>${maintenance.value.vehicleName}</td>
            </tr>
            <tr>
              <td><strong>License Plate:</strong></td>
              <td>${maintenance.value.licensePlate}</td>
            </tr>
            ${maintenance.value.mileage ? `
            <tr>
              <td><strong>Mileage:</strong></td>
              <td>${maintenance.value.mileage.toLocaleString()} miles</td>
            </tr>
            ` : ''}
          </table>
        </div>
      </section>

      <section class="report-section">
        <h3>MAINTENANCE DETAILS</h3>
        <div class="section-content">
          <table class="info-table">
            <tr>
              <td><strong>Type:</strong></td>
              <td>${getTypeLabel(maintenance.value.type)}</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td>${maintenance.value.status.toUpperCase()}</td>
            </tr>
            <tr>
              <td><strong>Priority:</strong></td>
              <td>${maintenance.value.priority.toUpperCase()}</td>
            </tr>
            <tr>
              <td><strong>Scheduled Date:</strong></td>
              <td>${formatDateForPrint(maintenance.value.scheduledDate)}</td>
            </tr>
            ${maintenance.value.completedDate ? `
            <tr>
              <td><strong>Completed Date:</strong></td>
              <td>${formatDateForPrint(maintenance.value.completedDate)}</td>
            </tr>
            ` : ''}
            ${maintenance.value.performedBy ? `
            <tr>
              <td><strong>Service Provider:</strong></td>
              <td>${maintenance.value.performedBy}</td>
            </tr>
            ` : ''}
          </table>
        </div>
      </section>

      <section class="report-section">
        <h3>DESCRIPTION</h3>
        <div class="section-content">
          <p>${maintenance.value.description}</p>
        </div>
      </section>

      ${maintenance.value.notes ? `
      <section class="report-section">
        <h3>NOTES</h3>
        <div class="section-content">
          <p>${maintenance.value.notes}</p>
        </div>
      </section>
      ` : ''}

      <section class="report-section">
        <h3>COST INFORMATION</h3>
        <div class="section-content">
          <table class="pricing-table">
            <tr>
              <td>${maintenance.value.status === 'completed' ? 'Actual Cost:' : 'Estimated Cost:'}</td>
              <td class="amount">${formatCurrency(maintenance.value.cost)}</td>
            </tr>
          </table>
        </div>
      </section>

      <div class="report-footer">
        <p class="text-center">
          This is an official maintenance report generated by ${companyInfo.name}
        </p>
      </div>
    </div>
  `
}

onMounted(() => {
  loadMaintenance()
})
</script>

<style scoped>
.loading-container {
  @apply flex flex-col items-center justify-center min-h-[400px];
}
</style>
