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
}

export interface RentalFilters {
  search: string
  status: RentalStatus | 'all'
  paymentStatus: PaymentStatus | 'all'
  dateRange: string | 'all'
}
