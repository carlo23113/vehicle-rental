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
    <CommonFilterSection v-model="showFilters" :filters="filters" @clear="clearFilters">
      <v-row dense>
        <v-col cols="12" md="4">
          <v-select
            v-model="filters.period"
            :items="PERIOD_OPTIONS"
            variant="outlined"
            density="comfortable"
            label="Period"
            prepend-inner-icon="mdi-calendar"
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.startDate"
            type="date"
            variant="outlined"
            density="comfortable"
            label="Start Date"
            prepend-inner-icon="mdi-calendar-start"
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.endDate"
            type="date"
            variant="outlined"
            density="comfortable"
            label="End Date"
            prepend-inner-icon="mdi-calendar-end"
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
    <ExportReportDialog
      v-model="showExportDialog"
      v-model:format="exportFormat"
      :start-date="filters.startDate"
      :end-date="filters.endDate"
      :loading="exporting"
      @export="handleExport"
    />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReports } from '~/composables/useReports'
import { useCurrency } from '~/composables/useCurrency'
import { useReportExport } from '~/composables/useReportExport'
import {
  useReportHelpers,
  PERIOD_OPTIONS,
  getRevenueChartConfig,
  getStatConfigs,
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

const { formatCurrency, getCurrencyIcon } = useCurrency()
const {
  getUtilizationColor,
  getRankColor,
  getRentalStatusIcon,
  getRentalStatusColor,
  getPaymentStatusColor,
} = useReportHelpers()

// Filter state
const showFilters = ref(false)

// Export functionality
const showExportDialog = ref(false)
const exporting = ref(false)
const exportFormat = ref('pdf')

const { exportToCSV, exportToExcel, exportToPDF } = useReportExport({
  filters,
  totalRevenue,
  totalRentals,
  avgUtilization,
  totalMaintenanceCost,
  rentalStatusBreakdown,
  paymentStatusOverview,
  vehicleUtilization,
  topCustomers,
  locationPerformance,
  formatCurrency,
  formatDate,
})

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

// Data values map
const dataValues: Record<string, any> = {
  totalRevenue,
  totalRentals,
  avgUtilization,
  totalMaintenanceCost,
}

const stats = computed(() =>
  getStatConfigs(getCurrencyIcon).map(config => {
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
  paymentStatusOverview.value.map((item: { status: string; count: number; amount: number; percentage: number }) => ({
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

const clearFilters = () => {
  filters.value = {
    period: 'month',
    startDate: '',
    endDate: '',
  }
}
</script>
