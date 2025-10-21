export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Reservation {
  id: number
  customerId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleId: number
  vehicleName: string
  vehicleType: string
  licensePlate: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  status: ReservationStatus
  dailyRate: number
  numberOfDays: number
  totalAmount: number
  pickupLocation: string
  returnLocation: string
  paymentStatus: 'pending' | 'partial' | 'paid'
  depositAmount: number
  notes?: string
  createdAt: string
  confirmedAt?: string
}

export interface ReservationFilters {
  search: string
  status: ReservationStatus | 'all'
  dateRange: 'all' | 'today' | 'week' | 'month'
  paymentStatus: 'all' | 'pending' | 'partial' | 'paid'
}
