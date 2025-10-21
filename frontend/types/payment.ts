export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type PaymentMethod = 'credit-card' | 'debit-card' | 'cash' | 'bank-transfer' | 'other'

export interface Payment {
  id: number
  rentalId: number
  customerId: number
  customerName: string
  vehicleName: string
  licensePlate: string
  amount: number
  paymentMethod: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  paymentDate: string
  dueDate: string
  description: string
  notes?: string
  refundAmount?: number
  refundDate?: string
  createdAt: string
}

export interface PaymentFilters {
  search: string
  status: PaymentStatus | 'all'
  method: PaymentMethod | 'all'
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
}
