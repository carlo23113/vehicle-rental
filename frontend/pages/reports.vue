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
    <v-dialog v-model="showExportDialog" max-width="600">
      <v-card class="export-dialog">
        <v-card-title class="d-flex align-center gap-3 pa-6 pb-4">
          <v-icon icon="mdi-download" size="28" color="primary" />
          <div>
            <div class="text-h5 font-weight-bold">Export Report</div>
            <div class="text-caption text-medium-emphasis mt-1">
              Download your analytics report in your preferred format
            </div>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <div class="mb-4">
            <div class="text-body-2 font-weight-bold mb-3">Select Format</div>
            <v-btn-toggle
              v-model="exportFormat"
              mandatory
              color="primary"
              variant="outlined"
              divided
              class="w-100"
            >
              <v-btn value="pdf" class="flex-1-1">
                <v-icon start>mdi-file-pdf-box</v-icon>
                PDF
              </v-btn>
              <v-btn value="csv" class="flex-1-1">
                <v-icon start>mdi-file-delimited</v-icon>
                CSV
              </v-btn>
              <v-btn value="excel" class="flex-1-1">
                <v-icon start>mdi-file-excel</v-icon>
                Excel
              </v-btn>
            </v-btn-toggle>
          </div>

          <div class="report-info pa-4 rounded-lg">
            <div class="d-flex align-center gap-3 mb-3">
              <v-icon icon="mdi-calendar-range" color="primary" />
              <div>
                <div class="text-caption text-medium-emphasis">Report Period</div>
                <div class="text-body-1 font-weight-medium">
                  {{ filters.startDate }} to {{ filters.endDate }}
                </div>
              </div>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex align-center gap-3">
              <v-icon icon="mdi-chart-box" color="primary" />
              <div>
                <div class="text-caption text-medium-emphasis">Includes</div>
                <div class="text-body-2">
                  Revenue trends, vehicle utilization, top customers, and location performance
                </div>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showExportDialog = false" :disabled="exporting">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="exporting"
            @click="handleExport"
            prepend-icon="mdi-download"
            size="large"
          >
            Export Report
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
  const csvData: string[][] = [
    ['Vehicle Rental Management System - Reports'],
    ['Period', `${filters.value.startDate} to ${filters.value.endDate}`],
    [''],
    ['Summary Statistics'],
    ['Metric', 'Value'],
    ['Total Revenue', formatCurrency(totalRevenue.value)],
    ['Total Rentals', totalRentals.value.toString()],
    ['Average Utilization', `${avgUtilization.value}%`],
    ['Total Maintenance Cost', formatCurrency(totalMaintenanceCost.value)],
    [''],
    ['Rental Status Breakdown'],
    ['Status', 'Count', 'Percentage'],
    ...rentalStatusBreakdown.value.map(r => [r.status, r.count.toString(), `${r.percentage}%`]),
    [''],
    ['Payment Status Overview'],
    ['Status', 'Count', 'Percentage'],
    ...paymentStatusOverview.value.map(p => [p.status, p.count.toString(), `${p.percentage}%`]),
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
    [''],
    ['Location Performance'],
    ['Location', 'Rentals', 'Revenue/Remain', 'Utilization Rate'],
    ...locationPerformance.value.map(l => [
      l.location,
      l.rentals.toString(),
      l.revenue ? formatCurrency(l.revenue) : l.remain?.toString() || '0',
      `${l.utilization}%`,
    ]),
  ]

  const csvContent = csvData.map(row =>
    row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
  ).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `rental-report-${filters.value.startDate}-${filters.value.endDate}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const exportToExcel = async () => {
  const XLSX = await import('xlsx')

  // Create workbook
  const wb = XLSX.utils.book_new()

  // Summary Statistics sheet
  const summaryData = [
    ['Vehicle Rental Management System - Reports'],
    ['Period', `${filters.value.startDate} to ${filters.value.endDate}`],
    [],
    ['Summary Statistics'],
    ['Metric', 'Value'],
    ['Total Revenue', formatCurrency(totalRevenue.value)],
    ['Total Rentals', totalRentals.value],
    ['Average Utilization', `${avgUtilization.value}%`],
    ['Total Maintenance Cost', formatCurrency(totalMaintenanceCost.value)],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')

  // Rental Status sheet
  const rentalStatusData = [
    ['Rental Status Breakdown'],
    ['Status', 'Count', 'Percentage'],
    ...rentalStatusBreakdown.value.map(r => [r.status, r.count, `${r.percentage}%`]),
  ]
  const rentalStatusSheet = XLSX.utils.aoa_to_sheet(rentalStatusData)
  XLSX.utils.book_append_sheet(wb, rentalStatusSheet, 'Rental Status')

  // Payment Status sheet
  const paymentStatusData = [
    ['Payment Status Overview'],
    ['Status', 'Count', 'Percentage'],
    ...paymentStatusOverview.value.map(p => [p.status, p.count, `${p.percentage}%`]),
  ]
  const paymentStatusSheet = XLSX.utils.aoa_to_sheet(paymentStatusData)
  XLSX.utils.book_append_sheet(wb, paymentStatusSheet, 'Payment Status')

  // Vehicle Utilization sheet
  const vehicleData = [
    ['Vehicle Utilization'],
    ['Vehicle', 'Total Days', 'Rented Days', 'Utilization Rate', 'Revenue'],
    ...vehicleUtilization.value.map(v => [
      v.vehicleName,
      v.totalDays,
      v.rentedDays,
      `${v.utilizationRate}%`,
      v.revenue,
    ]),
  ]
  const vehicleSheet = XLSX.utils.aoa_to_sheet(vehicleData)
  XLSX.utils.book_append_sheet(wb, vehicleSheet, 'Vehicle Utilization')

  // Top Customers sheet
  const customersData = [
    ['Top Customers'],
    ['Customer', 'Total Rentals', 'Total Spent', 'Avg Rental Value', 'Last Rental'],
    ...topCustomers.value.map(c => [
      c.customerName,
      c.totalRentals,
      c.totalSpent,
      c.avgRentalValue,
      formatDate(c.lastRentalDate),
    ]),
  ]
  const customersSheet = XLSX.utils.aoa_to_sheet(customersData)
  XLSX.utils.book_append_sheet(wb, customersSheet, 'Top Customers')

  // Location Performance sheet
  const locationData = [
    ['Location Performance'],
    ['Location', 'Rentals', 'Revenue/Remain', 'Utilization Rate'],
    ...locationPerformance.value.map(l => [
      l.location,
      l.rentals,
      l.revenue || l.remain || 0,
      `${l.utilization}%`,
    ]),
  ]
  const locationSheet = XLSX.utils.aoa_to_sheet(locationData)
  XLSX.utils.book_append_sheet(wb, locationSheet, 'Location Performance')

  // Generate and download
  XLSX.writeFile(wb, `rental-report-${filters.value.startDate}-${filters.value.endDate}.xlsx`)
}

const exportToPDF = async () => {
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Vehicle Rental Management System', 14, 20)

  doc.setFontSize(14)
  doc.text('Analytics Report', 14, 28)

  // Period
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Period: ${filters.value.startDate} to ${filters.value.endDate}`, 14, 36)

  let yPos = 45

  // Summary Statistics
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary Statistics', 14, yPos)
  yPos += 5

  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Total Revenue', formatCurrency(totalRevenue.value)],
      ['Total Rentals', totalRentals.value.toString()],
      ['Average Utilization', `${avgUtilization.value}%`],
      ['Total Maintenance Cost', formatCurrency(totalMaintenanceCost.value)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Rental Status Breakdown
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Rental Status Breakdown', 14, yPos)
  yPos += 5

  autoTable(doc, {
    startY: yPos,
    head: [['Status', 'Count', 'Percentage']],
    body: rentalStatusBreakdown.value.map(r => [r.status, r.count.toString(), `${r.percentage}%`]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Payment Status Overview
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Status Overview', 14, yPos)
  yPos += 5

  autoTable(doc, {
    startY: yPos,
    head: [['Status', 'Count', 'Percentage']],
    body: paymentStatusOverview.value.map(p => [p.status, p.count.toString(), `${p.percentage}%`]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  })

  // Vehicle Utilization (new page)
  doc.addPage()
  yPos = 20

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Vehicle Utilization', 14, yPos)
  yPos += 5

  autoTable(doc, {
    startY: yPos,
    head: [['Vehicle', 'Total Days', 'Rented Days', 'Utilization', 'Revenue']],
    body: vehicleUtilization.value.map(v => [
      v.vehicleName,
      v.totalDays.toString(),
      v.rentedDays.toString(),
      `${v.utilizationRate}%`,
      formatCurrency(v.revenue),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  })

  // Top Customers (new page)
  doc.addPage()
  yPos = 20

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Top Customers', 14, yPos)
  yPos += 5

  autoTable(doc, {
    startY: yPos,
    head: [['Customer', 'Total Rentals', 'Total Spent', 'Avg Value', 'Last Rental']],
    body: topCustomers.value.map(c => [
      c.customerName,
      c.totalRentals.toString(),
      formatCurrency(c.totalSpent),
      formatCurrency(c.avgRentalValue),
      formatDate(c.lastRentalDate),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  })

  // Location Performance
  yPos = (doc as any).lastAutoTable.finalY + 10

  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Location Performance', 14, yPos)
  yPos += 5

  autoTable(doc, {
    startY: yPos,
    head: [['Location', 'Rentals', 'Revenue/Remain', 'Utilization']],
    body: locationPerformance.value.map(l => [
      l.location,
      l.rentals.toString(),
      l.revenue ? formatCurrency(l.revenue) : l.remain?.toString() || '0',
      `${l.utilization}%`,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  })

  // Save PDF
  doc.save(`rental-report-${filters.value.startDate}-${filters.value.endDate}.pdf`)
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
