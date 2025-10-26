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
    <div ref="statsSection">
      <LazyReportsStatsCards v-if="sectionsLoaded.stats" :stats="stats" />
      <LazyReportsStatsSkeleton v-else />
    </div>

    <!-- Charts Section -->
    <div ref="chartsSection">
      <LazyReportsChartsSection
        v-if="sectionsLoaded.charts"
        :revenue-chart-config="revenueChartConfig"
        :vehicle-utilization="vehicleUtilization"
        :top-customers-items="topCustomersItems"
        :revenue-by-type-items="revenueByTypeItems"
        :rental-status-breakdown="rentalStatusBreakdown"
        :payment-status-items="paymentStatusItems"
        :format-currency="formatCurrency"
        :get-utilization-color="getUtilizationColor"
        :get-rank-color="getRankColor"
        :get-rental-status-icon="getRentalStatusIcon"
        :get-rental-status-color="getRentalStatusColor"
      />
      <LazyReportsChartsSkeleton v-else />
    </div>

    <!-- Tables Section -->
    <div ref="tablesSection">
      <LazyReportsTablesSection
        v-if="sectionsLoaded.tables"
        :location-performance="locationPerformance"
        :maintenance-summary="maintenanceSummary"
        :format-currency="formatCurrency"
        :format-date="formatDate"
        :get-utilization-color="getUtilizationColor"
      />
      <LazyReportsTablesSkeleton v-else />
    </div>

    <!-- Export Dialog -->
    <LazyExportReportDialog
      v-if="showExportDialog"
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
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

// Progressive section loading with intersection observer
const statsSection = ref<HTMLElement | null>(null)
const chartsSection = ref<HTMLElement | null>(null)
const tablesSection = ref<HTMLElement | null>(null)

const sectionsLoaded = ref({
  stats: false,
  charts: false,
  tables: false,
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  // Immediate load stats
  sectionsLoaded.value.stats = true

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === chartsSection.value) {
            sectionsLoaded.value.charts = true
          } else if (entry.target === tablesSection.value) {
            sectionsLoaded.value.tables = true
          }
        }
      })
    },
    { rootMargin: '100px' }
  )

  if (chartsSection.value) observer.observe(chartsSection.value)
  if (tablesSection.value) observer.observe(tablesSection.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

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

// DRY export helper
const exportHandlers: Record<string, () => Promise<void>> = {
  csv: exportToCSV,
  excel: exportToExcel,
  pdf: exportToPDF,
}

const handleExport = async () => {
  exporting.value = true
  try {
    const handler = exportHandlers[exportFormat.value]
    if (handler) {
      await handler()
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
  paymentStatusOverview.value.map(
    (item: { status: string; count: number; amount: number; percentage: number }) => ({
      label: item.status,
      value: formatCurrency(item.amount),
      percentage: item.percentage,
      color: getPaymentStatusColor(item.status),
    })
  )
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
