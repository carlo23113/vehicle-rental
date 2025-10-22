import { ref, computed } from 'vue'
import type {
  RevenueReport,
  VehicleUtilization,
  CustomerReport,
  MaintenanceSummary,
  ReportFilters,
} from '~/types/report'

export const useReports = () => {
  const filters = ref<ReportFilters>({
    period: 'month',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  // Revenue data
  const revenueData = ref<RevenueReport[]>([
    { period: 'Week 1', revenue: 12500, rentals: 28, avgDailyRate: 65 },
    { period: 'Week 2', revenue: 15200, rentals: 32, avgDailyRate: 68 },
    { period: 'Week 3', revenue: 18400, rentals: 38, avgDailyRate: 72 },
    { period: 'Week 4', revenue: 14800, rentals: 30, avgDailyRate: 66 },
  ])

  // Vehicle utilization data
  const vehicleUtilization = ref<VehicleUtilization[]>([
    {
      vehicleId: 1,
      vehicleName: 'Toyota Camry 2023',
      totalDays: 30,
      rentedDays: 24,
      utilizationRate: 80,
      revenue: 1080,
    },
    {
      vehicleId: 2,
      vehicleName: 'Honda CR-V 2024',
      totalDays: 30,
      rentedDays: 22,
      utilizationRate: 73,
      revenue: 1430,
    },
    {
      vehicleId: 3,
      vehicleName: 'Ford F-150 2023',
      totalDays: 30,
      rentedDays: 18,
      utilizationRate: 60,
      revenue: 1350,
    },
    {
      vehicleId: 4,
      vehicleName: 'Tesla Model 3 2024',
      totalDays: 30,
      rentedDays: 26,
      utilizationRate: 87,
      revenue: 2470,
    },
    {
      vehicleId: 5,
      vehicleName: 'BMW 5 Series 2024',
      totalDays: 30,
      rentedDays: 15,
      utilizationRate: 50,
      revenue: 1800,
    },
    {
      vehicleId: 6,
      vehicleName: 'Mercedes-Benz Sprinter 2023',
      totalDays: 30,
      rentedDays: 20,
      utilizationRate: 67,
      revenue: 1700,
    },
    {
      vehicleId: 7,
      vehicleName: 'Chevrolet Malibu 2023',
      totalDays: 30,
      rentedDays: 19,
      utilizationRate: 63,
      revenue: 798,
    },
  ])

  // Top customers data
  const topCustomers = ref<CustomerReport[]>([
    {
      customerId: 7,
      customerName: 'Robert Anderson',
      totalRentals: 18,
      totalSpent: 4200,
      avgRentalValue: 233,
      lastRentalDate: '2025-01-20',
    },
    {
      customerId: 3,
      customerName: 'Michael Brown',
      totalRentals: 15,
      totalSpent: 3200,
      avgRentalValue: 213,
      lastRentalDate: '2025-01-18',
    },
    {
      customerId: 10,
      customerName: 'Maria Rodriguez',
      totalRentals: 14,
      totalSpent: 3150,
      avgRentalValue: 225,
      lastRentalDate: '2025-01-15',
    },
    {
      customerId: 1,
      customerName: 'John Smith',
      totalRentals: 12,
      totalSpent: 2450,
      avgRentalValue: 204,
      lastRentalDate: '2025-01-12',
    },
    {
      customerId: 6,
      customerName: 'Jennifer Martinez',
      totalRentals: 10,
      totalSpent: 2100,
      avgRentalValue: 210,
      lastRentalDate: '2025-01-10',
    },
  ])

  // Maintenance summary data
  const maintenanceSummary = ref<MaintenanceSummary[]>([
    {
      vehicleId: 1,
      vehicleName: 'Toyota Camry 2023',
      totalMaintenance: 3,
      totalCost: 189.99,
      avgCostPerService: 63.33,
      lastServiceDate: '2025-01-22',
    },
    {
      vehicleId: 5,
      vehicleName: 'BMW 5 Series 2024',
      totalMaintenance: 2,
      totalCost: 450.0,
      avgCostPerService: 225.0,
      lastServiceDate: '2025-01-22',
    },
    {
      vehicleId: 2,
      vehicleName: 'Honda CR-V 2024',
      totalMaintenance: 2,
      totalCost: 45.0,
      avgCostPerService: 22.5,
      lastServiceDate: '2024-08-20',
    },
    {
      vehicleId: 8,
      vehicleName: 'Jeep Wrangler 2024',
      totalMaintenance: 1,
      totalCost: 1200.0,
      avgCostPerService: 1200.0,
      lastServiceDate: '2025-01-24',
    },
    {
      vehicleId: 3,
      vehicleName: 'Ford F-150 2023',
      totalMaintenance: 2,
      totalCost: 210.0,
      avgCostPerService: 105.0,
      lastServiceDate: '2024-11-20',
    },
  ])

  const totalRevenue = computed(() => {
    return revenueData.value.reduce((sum, item) => sum + item.revenue, 0)
  })

  const totalRentals = computed(() => {
    return revenueData.value.reduce((sum, item) => sum + item.rentals, 0)
  })

  const avgUtilization = computed(() => {
    const total = vehicleUtilization.value.reduce(
      (sum, item) => sum + item.utilizationRate,
      0
    )
    return Math.round(total / vehicleUtilization.value.length)
  })

  const totalMaintenanceCost = computed(() => {
    return maintenanceSummary.value.reduce((sum, item) => sum + item.totalCost, 0)
  })

  const { formatCurrency: formatCurrencyUtil } = useCurrency()

  const formatCurrency = (value: number) => {
    return formatCurrencyUtil(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return {
    filters,
    revenueData,
    vehicleUtilization,
    topCustomers,
    maintenanceSummary,
    totalRevenue,
    totalRentals,
    avgUtilization,
    totalMaintenanceCost,
    formatCurrency,
    formatDate,
  }
}
