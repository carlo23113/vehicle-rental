<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Reports & Analytics"
      subtitle="View business insights and performance metrics"
      action-text="Export Report"
      action-icon="mdi-download"
      @action-click="showExportDialog = true"
    />

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <ReportsFilters
          :filters="filters"
          :period-options="PERIOD_OPTIONS"
          @update:period="val => (filters.period = val as any)"
          @update:start-date="val => (filters.startDate = val)"
          @update:end-date="val => (filters.endDate = val)"
        />
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" lg="3">
        <CommonUiStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <!-- Revenue Chart -->
    <v-row class="mb-6">
      <v-col cols="12">
        <CommonUiDetailCard title="Revenue Trends" icon="mdi-chart-line">
          <LazyCommonChartsLineChart v-bind="revenueChartConfig" />
        </CommonUiDetailCard>
      </v-col>
    </v-row>

    <!-- Vehicle Utilization & Top Customers -->
    <v-row class="mb-6">
      <!-- Vehicle Utilization -->
      <v-col cols="12" lg="7">
        <CommonUiDetailCard title="Vehicle Utilization" icon="mdi-car-multiple" class="h-full">
          <VehicleUtilizationTable
            :items="vehicleUtilization"
            :format-currency="formatCurrency"
            :get-utilization-color="getUtilizationColor"
          />
        </CommonUiDetailCard>
      </v-col>

      <!-- Top Customers -->
      <v-col cols="12" lg="5">
        <CommonUiDetailCard title="Top Customers" icon="mdi-account-star" class="h-full">
          <CommonUiRankingList :items="topCustomersItems" :get-rank-color="getRankColor" />
        </CommonUiDetailCard>
      </v-col>
    </v-row>

    <!-- Revenue by Type & Status Breakdown -->
    <v-row class="mb-6">
      <!-- Revenue by Vehicle Type -->
      <v-col cols="12" lg="6">
        <CommonUiDetailCard title="Revenue by Vehicle Type" icon="mdi-car-settings" class="h-full">
          <CommonUiProgressList :items="revenueByTypeItems" />
        </CommonUiDetailCard>
      </v-col>

      <!-- Rental & Payment Status -->
      <v-col cols="12" lg="6">
        <v-row>
          <v-col cols="12">
            <CommonUiDetailCard title="Rental Status" icon="mdi-calendar-check">
              <CommonUiStatusGrid
                :items="rentalStatusBreakdown"
                :get-icon="getRentalStatusIcon"
                :get-color="getRentalStatusColor"
              />
            </CommonUiDetailCard>
          </v-col>
          <v-col cols="12">
            <CommonUiDetailCard title="Payment Status" icon="mdi-credit-card-check">
              <CommonUiProgressList :items="paymentStatusItems" :height="6" />
            </CommonUiDetailCard>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Location Performance -->
    <v-row class="mb-6">
      <v-col cols="12">
        <CommonUiDetailCard title="Location Performance" icon="mdi-map-marker-multiple">
          <LocationPerformanceTable
            :items="locationPerformance"
            :format-currency="formatCurrency"
            :get-utilization-color="getUtilizationColor"
          />
        </CommonUiDetailCard>
      </v-col>
    </v-row>

    <!-- Maintenance Summary -->
    <v-row>
      <v-col cols="12">
        <CommonUiDetailCard title="Maintenance Summary" icon="mdi-wrench-clock">
          <MaintenanceSummaryTable
            :items="maintenanceSummary"
            :format-currency="formatCurrency"
            :format-date="formatDate"
          />
        </CommonUiDetailCard>
      </v-col>
    </v-row>

    <!-- Export Dialog -->
    <v-dialog v-model="showExportDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold">Export Report</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="exportFormat"
                :items="exportFormats"
                label="Export Format"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <v-card variant="tonal" color="primary" class="pa-3">
                <div class="text-body-2 font-weight-medium mb-2">Report Period</div>
                <div class="text-body-1">{{ filters.startDate }} to {{ filters.endDate }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showExportDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" :loading="exporting" @click="handleExport">
            Export
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReports } from '~/composables/useReports'
import { useCurrency } from '~/composables/useCurrency'
import {
  useReportHelpers,
  PERIOD_OPTIONS,
  getRevenueChartConfig,
  STAT_CONFIGS,
} from '~/composables/useReportHelpers'

const {
  filters,
  vehicleUtilization,
  topCustomers,
  maintenanceSummary,
  totalRevenue,
  totalRentals,
  avgUtilization,
  totalMaintenanceCost,
  revenueByType,
  rentalStatusBreakdown,
  paymentStatusOverview,
  locationPerformance,
  formatDate,
} = useReports()

const { formatCurrency } = useCurrency()
const {
  getUtilizationColor,
  getRankColor,
  getRentalStatusIcon,
  getRentalStatusColor,
  getPaymentStatusColor,
} = useReportHelpers()

// Export functionality
const showExportDialog = ref(false)
const exporting = ref(false)
const exportFormat = ref('pdf')
const exportFormats = [
  { title: 'PDF Document', value: 'pdf' },
  { title: 'CSV Spreadsheet', value: 'csv' },
  { title: 'Excel Spreadsheet', value: 'excel' },
]

const handleExport = async () => {
  exporting.value = true
  try {
    if (exportFormat.value === 'csv') {
      await exportToCSV()
    } else if (exportFormat.value === 'excel') {
      await exportToExcel()
    } else {
      await exportToPDF()
    }
  } catch (error) {
    console.error('Export failed:', error)
  } finally {
    exporting.value = false
    showExportDialog.value = false
  }
}

const exportToCSV = async () => {
  const csvData = [
    ['Vehicle Rental Management System - Reports'],
    ['Period:', `${filters.value.startDate} to ${filters.value.endDate}`],
    [''],
    ['Summary Statistics'],
    ['Total Revenue', formatCurrency(totalRevenue.value)],
    ['Total Rentals', totalRentals.value.toString()],
    ['Average Utilization', `${avgUtilization.value}%`],
    ['Total Maintenance Cost', formatCurrency(totalMaintenanceCost.value)],
    [''],
    ['Vehicle Utilization'],
    ['Vehicle', 'Total Days', 'Rented Days', 'Utilization Rate', 'Revenue'],
    ...vehicleUtilization.value.map(v => [
      v.vehicleName,
      v.totalDays.toString(),
      v.rentedDays.toString(),
      `${v.utilizationRate}%`,
      formatCurrency(v.revenue),
    ]),
    [''],
    ['Top Customers'],
    ['Customer', 'Total Rentals', 'Total Spent', 'Avg Rental Value', 'Last Rental'],
    ...topCustomers.value.map(c => [
      c.customerName,
      c.totalRentals.toString(),
      formatCurrency(c.totalSpent),
      formatCurrency(c.avgRentalValue),
      formatDate(c.lastRentalDate),
    ]),
  ]

  const csvContent = csvData.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `rental-report-${filters.value.startDate}-${filters.value.endDate}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const exportToPDF = async () => {
  // Placeholder for PDF export functionality
  console.log('PDF export not yet implemented')
}

const exportToExcel = async () => {
  // Placeholder for Excel export functionality
  console.log('Excel export not yet implemented')
}

// Data values map
const dataValues: Record<string, any> = {
  totalRevenue,
  totalRentals,
  avgUtilization,
  totalMaintenanceCost,
}

const stats = computed(() =>
  STAT_CONFIGS.map(config => {
    const rawValue = dataValues[config.key].value
    let value: string | number

    switch (config.format) {
      case 'currency':
        value = formatCurrency(rawValue)
        break
      case 'percentage':
        value = `${rawValue}%`
        break
      default:
        value = rawValue
    }

    return {
      icon: config.icon,
      label: config.label,
      value,
      color: config.color,
    }
  })
)

const revenueByTypeItems = computed(() =>
  revenueByType.value.map(item => ({
    label: item.type,
    value: formatCurrency(item.revenue),
    percentage: item.percentage,
    color: getUtilizationColor(item.percentage * 2),
  }))
)

const paymentStatusItems = computed(() =>
  paymentStatusOverview.value.map(item => ({
    label: item.status,
    value: formatCurrency(item.amount),
    percentage: item.percentage,
    color: getPaymentStatusColor(item.status),
  }))
)

const topCustomersItems = computed(() =>
  topCustomers.value.map(customer => ({
    id: customer.customerId,
    name: customer.customerName,
    subtitle: `${customer.totalRentals} rentals`,
    value: formatCurrency(customer.totalSpent),
  }))
)

const revenueChartConfig = computed(() => getRevenueChartConfig(filters.value.period))
</script>
