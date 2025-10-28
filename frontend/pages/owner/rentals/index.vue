<template>
  <CommonPageLayout
    title="Rentals"
    subtitle="Track and manage rental bookings"
    action-text="New Rental"
    action-icon="mdi-plus"
    @action-click="handleAddRental"
  >
    <!-- Header Actions Slot (Export Menu) -->
    <template #header-actions>
      <RentalsExportMenu
        :has-rentals="filteredRentals.length > 0"
        @export="handleQuickExport"
        @open-dialog="showExportDialog = true"
        @download-contracts="handleDownloadContracts"
        @generate-summary="handleGenerateSummary"
        @generate-monthly="handleGenerateMonthly"
      />
    </template>

    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyRentalsFilters
        v-if="isFilterVisible || sections.stats"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <LazyRentalsStatsCards :stats="stats" />
    </template>

    <!-- Main Content Slot -->
    <template #content>
      <!-- Alert Banners -->
      <div v-if="alerts.hasAlerts" class="alerts-section mb-4">
        <!-- Overdue Returns Alert -->
        <CommonUiAlertBanner
          v-if="alerts.overdue.count > 0"
          :count="alerts.overdue.count"
          title="Overdue Returns"
          :message="`${alerts.overdue.count} rental${alerts.overdue.count !== 1 ? 's are' : ' is'} past their return date. Immediate action required.`"
          type="error"
          icon="mdi-alert-circle"
          :items="alerts.overdue.items"
          :max-items="3"
          action-text="View Overdue"
          @action="handleViewOverdue"
        />

        <!-- Upcoming Pickups Alert -->
        <CommonUiAlertBanner
          v-if="alerts.upcoming.count > 0"
          :count="alerts.upcoming.count"
          title="Upcoming Pickups"
          :message="`${alerts.upcoming.count} rental${alerts.upcoming.count !== 1 ? 's are' : ' is'} scheduled to start soon. Ensure vehicles are ready.`"
          type="info"
          icon="mdi-calendar-clock"
          :items="alerts.upcoming.items"
          :max-items="3"
          action-text="View Upcoming"
          action-color="info"
          @action="handleViewUpcoming"
        />

        <!-- Unpaid Balances Alert -->
        <CommonUiAlertBanner
          v-if="alerts.unpaid.count > 0"
          :count="alerts.unpaid.count"
          title="Unpaid Balances"
          :message="`${alerts.unpaid.count} rental${alerts.unpaid.count !== 1 ? 's have' : ' has'} outstanding payment balances.`"
          type="warning"
          icon="mdi-cash-remove"
          :items="alerts.unpaid.items"
          :max-items="3"
          action-text="View Unpaid"
          @action="handleViewUnpaid"
        />

        <!-- Missing Documents Alert -->
        <CommonUiAlertBanner
          v-if="alerts.documents.count > 0"
          :count="alerts.documents.count"
          title="Missing Documents"
          :message="`${alerts.documents.count} rental${alerts.documents.count !== 1 ? 's have' : ' has'} incomplete documentation.`"
          type="warning"
          icon="mdi-file-alert"
          :items="alerts.documents.items"
          :max-items="3"
          action-text="View Missing Docs"
          @action="handleViewMissingDocs"
        />
      </div>

      <LazyRentalsTableSection
        v-model:selected-rentals="selectedRentals"
        :rentals="displayedItems"
        :is-loading-more="isLoadingMore"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :get-payment-status-color="getPaymentStatusColor"
        :enable-bulk-actions="true"
        @view="handleViewRental"
        @edit="handleEditRental"
        @delete="handleDeleteRental"
        @generate-invoice="handleGenerateInvoice"
        @bulk-status-update="handleBulkStatusUpdate"
        @bulk-export="handleBulkExport"
        @bulk-invoice="handleBulkInvoice"
      />
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <LazyRentalsDeleteDialog
        v-if="showDeleteDialog"
        v-model="showDeleteDialog"
        :rental="rentalToDelete"
        :deleting="deleting"
        :format-date="formatDate"
        @confirm="deleteRental"
        @cancel="cancelDelete"
      />

      <!-- Export Dialog -->
      <CommonUiExportDialog
        v-if="showExportDialog"
        v-model="showExportDialog"
        entity-name="Rentals"
        :total-count="rentals.length"
        :filtered-count="filteredRentals.length"
        :selected-count="selectedRentals.length"
        :loading="exporting"
        default-filename="rentals"
        @export="handleExport"
      />

      <!-- Bulk Invoice Dialog -->
      <CommonUiBulkInvoiceDialog
        v-model="showBulkInvoiceDialog"
        :selected-items="selectedRentals"
        :loading="generatingInvoices"
        item-label="rental"
        :get-item-title="(item) => `Rental #${item.id}`"
        :get-item-subtitle="(item) => `${item.vehicleName} - ${item.customerName}`"
        @confirm="confirmBulkInvoice"
        @cancel="showBulkInvoiceDialog = false"
      />
    </template>

    <!-- Snackbar Slot -->
    <template #snackbar>
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRentals } from '~/composables/useRentals'
import { useCustomers } from '~/composables/useCustomers'
import { useSnackbar } from '~/composables/useSnackbar'
import { useRentalStats } from '~/composables/useRentalStats'
import { useRentalAlerts } from '~/composables/useRentalAlerts'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'
import { useExport } from '~/composables/useExport'
import type { ExportFormat, ExportOptions } from '~/composables/useExport'

const router = useRouter()
const route = useRoute()

// Core composables
const { rentals, filters, filteredRentals, getStatusColor, getPaymentStatusColor, formatDate } =
  useRentals()
const { customers, getFullName } = useCustomers()
const { snackbar, showSuccess, showError } = useSnackbar()
const { exportData } = useExport()

// Stats calculation (DRY - extracted to composable)
const { stats } = useRentalStats(rentals)

// Alerts calculation (DRY - extracted to composable)
const { alerts } = useRentalAlerts(computed(() => rentals.value))

// Progressive table loading (DRY - extracted to composable)
const { displayedItems, isLoadingMore, updateDisplayedItems } = useProgressiveTable(
  filteredRentals,
  { batchSize: 20 }
)

// Debounced filters (DRY - extracted to composable)
const { watchImmediateFilters } = useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems,
  onFilterChange: updateDisplayedItems,
})

// Watch immediate filters (status, payment, dateRange)
watchImmediateFilters(['status', 'paymentStatus', 'dateRange'])

// UI state
const showFilters = ref(false)
const showDeleteDialog = ref(false)
const rentalToDelete = ref<any>(null)
const deleting = ref(false)
const selectedRentals = ref<any[]>([])
const showBulkInvoiceDialog = ref(false)
const generatingInvoices = ref(false)
const showExportDialog = ref(false)
const exporting = ref(false)
const downloadingContracts = ref(false)
const generatingSummary = ref(false)
const generatingMonthly = ref(false)

// Export columns configuration
const exportColumns = computed<ExportOptions['columns']>(() => [
  { key: 'id', label: 'ID' },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'customerEmail', label: 'Customer Email' },
  { key: 'customerPhone', label: 'Customer Phone' },
  { key: 'vehicleName', label: 'Vehicle' },
  { key: 'licensePlate', label: 'License Plate' },
  { key: 'startDate', label: 'Start Date', format: (val) => formatDate(val) },
  { key: 'endDate', label: 'End Date', format: (val) => formatDate(val) },
  { key: 'numberOfDays', label: 'Duration (Days)' },
  { key: 'status', label: 'Status' },
  { key: 'dailyRate', label: 'Daily Rate', format: (val) => `$${val}` },
  { key: 'totalAmount', label: 'Total Amount', format: (val) => `$${val}` },
  { key: 'pickupLocation', label: 'Pickup Location' },
  { key: 'returnLocation', label: 'Return Location' },
  { key: 'paymentStatus', label: 'Payment Status' },
])

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
    vehicleType: 'all',
    priceRange: { min: null, max: null },
    duration: 'all',
    customerType: 'all',
    showOverdueOnly: false,
  }
}

// Alert action handlers
const handleViewOverdue = () => {
  clearFilters()
  filters.value.status = 'active'
  filters.value.showOverdueOnly = true
  showSuccess('Showing overdue rentals')
}

const handleViewUpcoming = () => {
  clearFilters()
  filters.value.status = 'reserved'
  filters.value.dateRange = 'upcoming'
  showSuccess('Showing upcoming rentals')
}

const handleViewUnpaid = () => {
  clearFilters()
  filters.value.paymentStatus = 'unpaid'
  showSuccess('Showing unpaid rentals')
}

const handleViewMissingDocs = () => {
  clearFilters()
  // Filter to show only rentals with incomplete documents
  // This would typically be handled by a specific filter
  showSuccess('Showing rentals with missing documents')
}

// Bulk action handlers
const handleBulkStatusUpdate = async (payload: { rentals: any[]; status: string; notes: string }) => {
  try {
    console.log('Bulk status update:', payload)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update rental statuses
    payload.rentals.forEach(rental => {
      const index = rentals.value.findIndex(r => r.id === rental.id)
      if (index > -1 && rentals.value[index]) {
        rentals.value[index].status = payload.status as any
      }
    })

    showSuccess(`Successfully updated status for ${payload.rentals.length} rental(s)`)
  } catch (error) {
    console.error('Bulk status update error:', error)
    showError('Failed to update rental statuses. Please try again.')
  }
}

// Quick export handler (from button dropdown)
const handleQuickExport = async (format: ExportFormat) => {
  exporting.value = true
  try {
    await exportData(filteredRentals.value, format, {
      columns: exportColumns.value,
      title: 'Rentals Report',
      filename: 'rentals',
    })
    showSuccess(`Rentals exported to ${format.toUpperCase()} successfully`)
  } catch (error) {
    console.error('Export error:', error)
    showError('Failed to export rentals. Please try again.')
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
    let dataToExport = filteredRentals.value
    if (payload.scope === 'all') {
      dataToExport = rentals.value
    } else if (payload.scope === 'selected') {
      dataToExport = selectedRentals.value
    }

    // Add timestamp to filename if requested
    let filename = payload.filename
    if (payload.includeTimestamp) {
      const timestamp = new Date().toISOString().split('T')[0]
      filename = `${filename}-${timestamp}`
    }

    await exportData(dataToExport, payload.format, {
      columns: exportColumns.value,
      title: 'Rentals Report',
      filename,
    })

    showSuccess(`Rentals exported to ${payload.format.toUpperCase()} successfully`)
    showExportDialog.value = false
  } catch (error) {
    console.error('Export error:', error)
    showError('Failed to export rentals. Please try again.')
  } finally {
    exporting.value = false
  }
}

// Bulk export handler - opens export dialog with selected rentals
const handleBulkExport = () => {
  if (selectedRentals.value.length === 0) {
    showError('Please select rentals to export')
    return
  }
  showExportDialog.value = true
}

const handleBulkInvoice = () => {
  if (selectedRentals.value.length === 0) {
    showError('Please select rentals to generate invoices')
    return
  }

  // Filter only active/reserved rentals
  const eligibleRentals = selectedRentals.value.filter(
    r => r.status === 'active' || r.status === 'reserved'
  )

  if (eligibleRentals.length === 0) {
    showError('No active or reserved rentals selected. Only active/reserved rentals can have invoices generated.')
    return
  }

  showBulkInvoiceDialog.value = true
}

const confirmBulkInvoice = async (options: { includeDetails: boolean; sendEmail: boolean }) => {
  generatingInvoices.value = true

  try {
    // Get eligible rentals
    const eligibleRentals = selectedRentals.value.filter(
      r => r.status === 'active' || r.status === 'reserved'
    )

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const successMessage = options.sendEmail
      ? `Successfully generated and sent ${eligibleRentals.length} invoice(s)`
      : `Successfully generated ${eligibleRentals.length} invoice(s)`

    showSuccess(successMessage)
    showBulkInvoiceDialog.value = false

    // Navigate to invoices page to view generated invoices
    setTimeout(() => {
      router.push('/owner/invoices')
    }, 1000)
  } catch (error) {
    console.error('Bulk invoice generation error:', error)
    showError('Failed to generate invoices. Please try again.')
  } finally {
    generatingInvoices.value = false
  }
}

// Download All Contracts handler
const handleDownloadContracts = async () => {
  if (filteredRentals.value.length === 0) {
    showError('No rentals available to download contracts')
    return
  }

  downloadingContracts.value = true
  try {
    // TODO: Implement API call to generate PDF contracts for all filtered rentals
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In production, this would generate a ZIP file with all contract PDFs
    showSuccess(`Successfully downloaded ${filteredRentals.value.length} rental contract(s)`)
  } catch (error) {
    console.error('Download contracts error:', error)
    showError('Failed to download contracts. Please try again.')
  } finally {
    downloadingContracts.value = false
  }
}

// Generate Summary Report handler
const handleGenerateSummary = async () => {
  if (filteredRentals.value.length === 0) {
    showError('No rentals available to generate summary report')
    return
  }

  generatingSummary.value = true
  try {
    // Calculate summary statistics
    const totalRevenue = filteredRentals.value.reduce((sum, r) => sum + r.totalAmount, 0)
    const avgDuration = filteredRentals.value.reduce((sum, r) => sum + r.numberOfDays, 0) / filteredRentals.value.length
    const activeCount = filteredRentals.value.filter(r => r.status === 'active').length
    const completedCount = filteredRentals.value.filter(r => r.status === 'completed').length

    // Create summary report data
    const summaryData = {
      reportTitle: 'Rental Summary Report',
      generatedDate: new Date().toLocaleDateString(),
      totalRentals: filteredRentals.value.length,
      activeRentals: activeCount,
      completedRentals: completedCount,
      totalRevenue: `$${totalRevenue.toFixed(2)}`,
      avgDuration: avgDuration.toFixed(1),
      rentals: filteredRentals.value,
    }

    // TODO: In production, generate PDF report with summary statistics
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Summary report data:', summaryData)
    showSuccess('Summary report generated successfully')
  } catch (error) {
    console.error('Generate summary error:', error)
    showError('Failed to generate summary report. Please try again.')
  } finally {
    generatingSummary.value = false
  }
}

// Generate Monthly Report handler
const handleGenerateMonthly = async () => {
  if (filteredRentals.value.length === 0) {
    showError('No rentals available to generate monthly report')
    return
  }

  generatingMonthly.value = true
  try {
    // Group rentals by month
    const rentalsByMonth = filteredRentals.value.reduce((acc, rental) => {
      const month = new Date(rental.startDate).toLocaleString('default', {
        year: 'numeric',
        month: 'long'
      })

      if (!acc[month]) {
        acc[month] = {
          rentals: [],
          totalRevenue: 0,
          count: 0,
        }
      }

      acc[month].rentals.push(rental)
      acc[month].totalRevenue += rental.totalAmount
      acc[month].count += 1

      return acc
    }, {} as Record<string, { rentals: any[]; totalRevenue: number; count: number }>)

    // Create monthly report data
    const monthlyData = {
      reportTitle: 'Monthly Rental Breakdown',
      generatedDate: new Date().toLocaleDateString(),
      months: Object.entries(rentalsByMonth).map(([month, data]) => ({
        month,
        count: data.count,
        revenue: `$${data.totalRevenue.toFixed(2)}`,
        avgRevenue: `$${(data.totalRevenue / data.count).toFixed(2)}`,
      })),
    }

    // TODO: In production, generate PDF report with monthly breakdown
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Monthly report data:', monthlyData)
    showSuccess('Monthly report generated successfully')
  } catch (error) {
    console.error('Generate monthly report error:', error)
    showError('Failed to generate monthly report. Please try again.')
  } finally {
    generatingMonthly.value = false
  }
}
</script>
