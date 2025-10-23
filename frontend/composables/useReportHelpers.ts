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
