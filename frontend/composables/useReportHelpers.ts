// Constants
export const PERIOD_OPTIONS = [
  { title: 'This Week', value: 'week' },
  { title: 'This Month', value: 'month' },
  { title: 'This Quarter', value: 'quarter' },
  { title: 'This Year', value: 'year' },
  { title: 'Custom Range', value: 'custom' },
] as const

// Chart data by period
export const CHART_DATA_BY_PERIOD: Record<string, { labels: string[], data: number[] }> = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12500, 15200, 18400, 14800, 21000, 24500, 19800]
  },
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [45000, 52000, 48000, 62000]
  },
  quarter: {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    data: [155000, 178000, 207000]
  },
  year: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    data: [540000, 610000, 695000, 780000]
  },
  custom: {
    labels: ['Start', 'Mid', 'End'],
    data: [35000, 42000, 38000]
  }
}

// Mock data variations by period
export const MOCK_DATA_BY_PERIOD: Record<string, any> = {
  week: {
    totalRevenue: 125700,
    totalRentals: 28,
    avgUtilization: 72,
    totalMaintenanceCost: 845.99,
    rentalStatusBreakdown: [
      { status: 'Active', count: 8, percentage: 29 },
      { status: 'Completed', count: 18, percentage: 64 },
      { status: 'Reserved', count: 1, percentage: 4 },
      { status: 'Cancelled', count: 1, percentage: 4 },
    ],
    paymentStatusOverview: [
      { status: 'Paid', count: 22, amount: 12200, percentage: 79 },
      { status: 'Partial', count: 4, amount: 2100, percentage: 14 },
      { status: 'Pending', count: 2, amount: 900, percentage: 7 },
    ],
  },
  month: {
    totalRevenue: 207000,
    totalRentals: 128,
    avgUtilization: 69,
    totalMaintenanceCost: 2094.99,
    rentalStatusBreakdown: [
      { status: 'Active', count: 24, percentage: 32 },
      { status: 'Completed', count: 42, percentage: 56 },
      { status: 'Reserved', count: 6, percentage: 8 },
      { status: 'Cancelled', count: 3, percentage: 4 },
    ],
    paymentStatusOverview: [
      { status: 'Paid', count: 48, amount: 28900, percentage: 64 },
      { status: 'Partial', count: 15, amount: 8500, percentage: 20 },
      { status: 'Pending', count: 12, amount: 6200, percentage: 16 },
    ],
  },
  quarter: {
    totalRevenue: 540000,
    totalRentals: 385,
    avgUtilization: 71,
    totalMaintenanceCost: 5850.50,
    rentalStatusBreakdown: [
      { status: 'Active', count: 68, percentage: 30 },
      { status: 'Completed', count: 125, percentage: 55 },
      { status: 'Reserved', count: 18, percentage: 8 },
      { status: 'Cancelled', count: 12, percentage: 5 },
    ],
    paymentStatusOverview: [
      { status: 'Paid', count: 142, amount: 85400, percentage: 62 },
      { status: 'Partial', count: 48, amount: 24200, percentage: 21 },
      { status: 'Pending', count: 35, amount: 18900, percentage: 15 },
    ],
  },
  year: {
    totalRevenue: 2625000,
    totalRentals: 1542,
    avgUtilization: 74,
    totalMaintenanceCost: 28450.75,
    rentalStatusBreakdown: [
      { status: 'Active', count: 285, percentage: 31 },
      { status: 'Completed', count: 512, percentage: 56 },
      { status: 'Reserved', count: 75, percentage: 8 },
      { status: 'Cancelled', count: 48, percentage: 5 },
    ],
    paymentStatusOverview: [
      { status: 'Paid', count: 598, amount: 342000, percentage: 65 },
      { status: 'Partial', count: 195, amount: 98500, percentage: 21 },
      { status: 'Pending', count: 142, amount: 72800, percentage: 15 },
    ],
  },
  custom: {
    totalRevenue: 115000,
    totalRentals: 68,
    avgUtilization: 66,
    totalMaintenanceCost: 1250.00,
    rentalStatusBreakdown: [
      { status: 'Active', count: 12, percentage: 28 },
      { status: 'Completed', count: 22, percentage: 51 },
      { status: 'Reserved', count: 3, percentage: 7 },
      { status: 'Cancelled', count: 2, percentage: 5 },
    ],
    paymentStatusOverview: [
      { status: 'Paid', count: 28, amount: 15400, percentage: 58 },
      { status: 'Partial', count: 8, amount: 4200, percentage: 17 },
      { status: 'Pending', count: 6, amount: 3100, percentage: 12 },
    ],
  },
}

export const getRevenueChartConfig = (period: string) => ({
  labels: CHART_DATA_BY_PERIOD[period]?.labels || CHART_DATA_BY_PERIOD.month.labels,
  data: CHART_DATA_BY_PERIOD[period]?.data || CHART_DATA_BY_PERIOD.month.data,
  label: 'Revenue',
  yAxisPrefix: '$',
  yAxisSuffix: 'K',
  tooltipPrefix: '$',
  yAxisDivider: 1000,
  height: 320
})

export const STAT_CONFIGS = [
  { icon: 'mdi-currency-usd', label: 'Total Revenue', key: 'totalRevenue', color: 'success', format: 'currency' },
  { icon: 'mdi-car-key', label: 'Total Rentals', key: 'totalRentals', color: 'primary', format: 'number' },
  { icon: 'mdi-chart-line', label: 'Avg Utilization', key: 'avgUtilization', color: 'info', format: 'percentage' },
  { icon: 'mdi-wrench', label: 'Maintenance Cost', key: 'totalMaintenanceCost', color: 'warning', format: 'currency' },
] as const

export const useReportHelpers = () => {
  const getUtilizationColor = (rate: number): string => {
    if (rate >= 80) return 'success'
    if (rate >= 60) return 'primary'
    if (rate >= 40) return 'warning'
    return 'error'
  }

  const getRankColor = (index: number): string => {
    const colors = ['warning', 'info', 'success', 'primary', 'secondary']
    return colors[index] || 'primary'
  }

  const getRentalStatusIcon = (status: string): string => {
    const icons: Record<string, string> = {
      Active: 'mdi-clock-outline',
      Completed: 'mdi-check-circle',
      Reserved: 'mdi-calendar-clock',
      Cancelled: 'mdi-close-circle'
    }
    return icons[status] || 'mdi-information'
  }

  const getRentalStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      Active: 'primary',
      Completed: 'success',
      Reserved: 'info',
      Cancelled: 'error'
    }
    return colors[status] || 'primary'
  }

  const getPaymentStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      Paid: 'success',
      Partial: 'warning',
      Pending: 'error'
    }
    return colors[status] || 'primary'
  }

  return {
    getUtilizationColor,
    getRankColor,
    getRentalStatusIcon,
    getRentalStatusColor,
    getPaymentStatusColor
  }
}
