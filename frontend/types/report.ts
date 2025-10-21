export type ReportPeriod = 'week' | 'month' | 'quarter' | 'year' | 'custom'

export interface RevenueReport {
  period: string
  revenue: number
  rentals: number
  avgDailyRate: number
}

export interface VehicleUtilization {
  vehicleId: number
  vehicleName: string
  totalDays: number
  rentedDays: number
  utilizationRate: number
  revenue: number
}

export interface CustomerReport {
  customerId: number
  customerName: string
  totalRentals: number
  totalSpent: number
  avgRentalValue: number
  lastRentalDate: string
}

export interface MaintenanceSummary {
  vehicleId: number
  vehicleName: string
  totalMaintenance: number
  totalCost: number
  avgCostPerService: number
  lastServiceDate: string
}

export interface ReportFilters {
  period: ReportPeriod
  startDate: string
  endDate: string
}
