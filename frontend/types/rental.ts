export type RentalStatus = 'reserved' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'partial' | 'paid'

export interface Rental {
  id: number
  customerId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleId: number
  vehicleName: string
  vehicleType?: string
  vehicleImage?: string
  licensePlate: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  status: RentalStatus
  paymentStatus?: PaymentStatus
  depositAmount?: number
  totalAmount: number
  dailyRate: number
  numberOfDays: number
  pickupLocation: string
  returnLocation: string
  notes?: string
  createdAt: string
  // For customer type filtering
  isNewCustomer?: boolean
}

export interface RentalFilters {
  search: string
  status: RentalStatus | 'all'
  paymentStatus: PaymentStatus | 'all'
  dateRange: string | 'all'
  // Advanced filters
  vehicleType?: string | 'all'
  priceRange?: {
    min: number | null
    max: number | null
  }
  duration?: string | 'all'
  customerType?: string | 'all'
  showOverdueOnly?: boolean
}
