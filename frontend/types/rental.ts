export type RentalStatus = 'active' | 'completed' | 'reserved' | 'cancelled'

export interface Rental {
  id: number
  customerId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleId: number
  vehicleName: string
  licensePlate: string
  startDate: string
  endDate: string
  status: RentalStatus
  totalAmount: number
  dailyRate: number
  numberOfDays: number
  pickupLocation: string
  returnLocation: string
  notes?: string
  createdAt: string
}

export interface RentalFilters {
  search: string
  status: RentalStatus | 'all'
  dateRange: string | 'all'
}
