import { ref, computed } from 'vue'
import type { Payment, PaymentFilters } from '~/types/payment'

export const usePayments = () => {
  const payments = ref<Payment[]>([
    {
      id: 1,
      rentalId: 1,
      customerId: 1,
      customerName: 'John Smith',
      vehicleName: 'Toyota Camry 2023',
      licensePlate: 'ABC-1234',
      amount: 225,
      paymentMethod: 'credit-card',
      status: 'completed',
      transactionId: 'TXN-2025-001234',
      paymentDate: '2025-01-15',
      dueDate: '2025-01-15',
      description: 'Rental payment for 5 days',
      createdAt: '2025-01-15T10:30:00Z',
    },
    {
      id: 2,
      rentalId: 2,
      customerId: 2,
      customerName: 'Sarah Johnson',
      vehicleName: 'Honda CR-V 2024',
      licensePlate: 'XYZ-5678',
      amount: 455,
      paymentMethod: 'debit-card',
      status: 'completed',
      transactionId: 'TXN-2025-001235',
      paymentDate: '2025-01-14',
      dueDate: '2025-01-14',
      description: 'Full rental payment - 7 days',
      createdAt: '2025-01-14T14:20:00Z',
    },
    {
      id: 3,
      rentalId: 3,
      customerId: 3,
      customerName: 'Michael Brown',
      vehicleName: 'Ford F-150 2023',
      licensePlate: 'DEF-9012',
      amount: 375,
      paymentMethod: 'cash',
      status: 'completed',
      paymentDate: '2025-01-18',
      dueDate: '2025-01-13',
      description: 'Cash payment on completion',
      createdAt: '2025-01-18T16:45:00Z',
    },
    {
      id: 4,
      rentalId: 4,
      customerId: 4,
      customerName: 'Emily Davis',
      vehicleName: 'Tesla Model 3 2024',
      licensePlate: 'GHI-3456',
      amount: 665,
      paymentMethod: 'credit-card',
      status: 'pending',
      dueDate: '2025-01-25',
      description: 'Advance reservation payment due',
      notes: 'Customer to pay on pickup',
      createdAt: '2025-01-16T11:45:00Z',
    },
    {
      id: 5,
      rentalId: 5,
      customerId: 5,
      customerName: 'David Wilson',
      vehicleName: 'Chevrolet Malibu 2023',
      licensePlate: 'PQR-1357',
      amount: 84,
      paymentMethod: 'debit-card',
      status: 'completed',
      transactionId: 'TXN-2025-001236',
      paymentDate: '2025-01-12',
      dueDate: '2025-01-10',
      description: 'Short-term rental payment',
      createdAt: '2025-01-12T09:15:00Z',
    },
    {
      id: 6,
      rentalId: 6,
      customerId: 6,
      customerName: 'Jennifer Martinez',
      vehicleName: 'Mercedes-Benz Sprinter 2023',
      licensePlate: 'MNO-2468',
      amount: 595,
      paymentMethod: 'bank-transfer',
      status: 'completed',
      transactionId: 'TXN-2025-001237',
      paymentDate: '2025-01-15',
      dueDate: '2025-01-15',
      description: 'Group event rental - 7 days',
      createdAt: '2025-01-15T13:00:00Z',
    },
    {
      id: 7,
      rentalId: 7,
      customerId: 7,
      customerName: 'Robert Anderson',
      vehicleName: 'Toyota Camry 2023',
      licensePlate: 'ABC-1234',
      amount: 135,
      paymentMethod: 'credit-card',
      status: 'completed',
      transactionId: 'TXN-2025-001238',
      paymentDate: '2025-01-08',
      dueDate: '2025-01-05',
      description: 'Business rental - 3 days',
      createdAt: '2025-01-08T08:00:00Z',
    },
    {
      id: 8,
      rentalId: 8,
      customerId: 8,
      customerName: 'Lisa Thompson',
      vehicleName: 'Ford F-150 2023',
      licensePlate: 'DEF-9012',
      amount: 150,
      paymentMethod: 'credit-card',
      status: 'refunded',
      transactionId: 'TXN-2025-001239',
      paymentDate: '2025-01-18',
      dueDate: '2025-01-18',
      description: 'Cancelled reservation refund',
      refundAmount: 150,
      refundDate: '2025-01-19',
      notes: 'Full refund processed due to cancellation',
      createdAt: '2025-01-18T15:45:00Z',
    },
    {
      id: 9,
      rentalId: 9,
      customerId: 9,
      customerName: 'James Garcia',
      vehicleName: 'Tesla Model 3 2024',
      licensePlate: 'GHI-3456',
      amount: 190,
      paymentMethod: 'credit-card',
      status: 'failed',
      dueDate: '2025-01-20',
      description: 'Payment declined - insufficient funds',
      notes: 'Customer notified, retry scheduled',
      createdAt: '2025-01-20T10:30:00Z',
    },
    {
      id: 10,
      rentalId: 10,
      customerId: 10,
      customerName: 'Maria Rodriguez',
      vehicleName: 'BMW 5 Series 2024',
      licensePlate: 'JKL-7890',
      amount: 360,
      paymentMethod: 'credit-card',
      status: 'pending',
      dueDate: '2025-02-05',
      description: 'Upcoming rental payment',
      notes: 'Deposit of $180 already received',
      createdAt: '2025-01-18T16:45:00Z',
    },
  ])

  const filters = ref<PaymentFilters>({
    search: '',
    status: 'all',
    method: 'all',
    dateRange: 'all',
  })

  const filteredPayments = computed(() => {
    return payments.value.filter(payment => {
      const matchesSearch =
        !filters.value.search ||
        payment.customerName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        payment.vehicleName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        payment.licensePlate.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesStatus = filters.value.status === 'all' || payment.status === filters.value.status

      const matchesMethod = filters.value.method === 'all' || payment.paymentMethod === filters.value.method

      // Simple date range filtering
      const matchesDateRange = filters.value.dateRange === 'all'

      return matchesSearch && matchesStatus && matchesMethod && matchesDateRange
    })
  })

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newId = Math.max(...payments.value.map(p => p.id), 0) + 1
    payments.value.push({
      ...payment,
      id: newId,
      createdAt: new Date().toISOString(),
    })
  }

  const updatePayment = (id: number, updates: Partial<Payment>) => {
    const index = payments.value.findIndex(p => p.id === id)
    if (index !== -1) {
      payments.value[index] = { ...payments.value[index], ...updates }
    }
  }

  const processPayment = (id: number, transactionId: string) => {
    updatePayment(id, {
      status: 'completed',
      transactionId,
      paymentDate: new Date().toISOString().split('T')[0],
    })
  }

  const refundPayment = (id: number, amount: number) => {
    updatePayment(id, {
      status: 'refunded',
      refundAmount: amount,
      refundDate: new Date().toISOString().split('T')[0],
    })
  }

  const deletePayment = (id: number) => {
    payments.value = payments.value.filter(p => p.id !== id)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      completed: 'success',
      failed: 'error',
      refunded: 'info',
    }
    return colors[status] || 'default'
  }

  const getMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      'credit-card': 'mdi-credit-card',
      'debit-card': 'mdi-credit-card-outline',
      cash: 'mdi-cash',
      'bank-transfer': 'mdi-bank-transfer',
      other: 'mdi-help-circle',
    }
    return icons[method] || 'mdi-help-circle'
  }

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      'credit-card': 'Credit Card',
      'debit-card': 'Debit Card',
      cash: 'Cash',
      'bank-transfer': 'Bank Transfer',
      other: 'Other',
    }
    return labels[method] || method
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const { formatCurrency: formatCurrencyUtil } = useCurrency()

  const formatCurrency = (value: number) => {
    return formatCurrencyUtil(value)
  }

  return {
    payments,
    filters,
    filteredPayments,
    addPayment,
    updatePayment,
    processPayment,
    refundPayment,
    deletePayment,
    getStatusColor,
    getMethodIcon,
    getMethodLabel,
    formatDate,
    formatCurrency,
  }
}
