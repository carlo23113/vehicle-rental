import { ref, computed } from 'vue'
import type { Rental, RentalFilters } from '~/types/rental'

export const useRentals = () => {
  const rentals = ref<Rental[]>([
    {
      id: 1,
      customerId: 1,
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 123-4567',
      vehicleId: 1,
      vehicleName: 'Toyota Camry 2023',
      vehicleType: 'sedan',
      vehicleImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
      licensePlate: 'ABC-1234',
      startDate: '2025-01-15',
      endDate: '2025-01-20',
      status: 'active',
      paymentStatus: 'paid',
      dailyRate: 45,
      numberOfDays: 5,
      totalAmount: 225,
      pickupLocation: 'Main Office',
      returnLocation: 'Main Office',
      notes: 'Customer requested GPS navigation',
      createdAt: '2025-01-10T10:30:00Z',
      isNewCustomer: false,
      documentsComplete: true,
    } as any,
    {
      id: 2,
      customerId: 2,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '(555) 234-5678',
      vehicleId: 2,
      vehicleName: 'Honda CR-V 2024',
      vehicleType: 'suv',
      vehicleImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
      licensePlate: 'XYZ-5678',
      startDate: '2025-01-14',
      endDate: '2025-01-21',
      status: 'active',
      paymentStatus: 'unpaid',
      dailyRate: 65,
      numberOfDays: 7,
      totalAmount: 455,
      pickupLocation: 'Airport Branch',
      returnLocation: 'Main Office',
      createdAt: '2025-01-12T14:20:00Z',
      isNewCustomer: true,
      documentsComplete: false,
    } as any,
    {
      id: 3,
      customerId: 3,
      customerName: 'Michael Brown',
      customerEmail: 'mbrown@email.com',
      customerPhone: '(555) 345-6789',
      vehicleId: 3,
      vehicleName: 'Ford F-150 2023',
      vehicleType: 'truck',
      vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
      licensePlate: 'DEF-9012',
      startDate: '2025-01-13',
      endDate: '2025-01-18',
      status: 'completed',
      dailyRate: 75,
      numberOfDays: 5,
      totalAmount: 375,
      pickupLocation: 'Main Office',
      returnLocation: 'Main Office',
      notes: 'Vehicle returned in excellent condition',
      createdAt: '2025-01-08T09:15:00Z',
    },
    {
      id: 4,
      customerId: 4,
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      customerPhone: '(555) 456-7890',
      vehicleId: 4,
      vehicleName: 'Tesla Model 3 2024',
      vehicleType: 'luxury',
      vehicleImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
      licensePlate: 'GHI-3456',
      startDate: '2025-10-28',
      endDate: '2025-11-04',
      startTime: '09:00',
      endTime: '09:00',
      status: 'reserved',
      paymentStatus: 'pending',
      depositAmount: 200,
      dailyRate: 95,
      numberOfDays: 7,
      totalAmount: 665,
      pickupLocation: 'Downtown Branch',
      returnLocation: 'Downtown Branch',
      notes: 'First time Tesla renter, provide orientation',
      createdAt: '2025-01-16T11:45:00Z',
    },
    {
      id: 5,
      customerId: 5,
      customerName: 'David Wilson',
      customerEmail: 'dwilson@email.com',
      customerPhone: '(555) 567-8901',
      vehicleId: 7,
      vehicleName: 'Chevrolet Malibu 2023',
      vehicleType: 'sedan',
      vehicleImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
      licensePlate: 'PQR-1357',
      startDate: '2025-01-10',
      endDate: '2025-10-20',
      status: 'active',
      paymentStatus: 'partially-paid',
      dailyRate: 42,
      numberOfDays: 2,
      totalAmount: 84,
      pickupLocation: 'Main Office',
      returnLocation: 'Airport Branch',
      createdAt: '2025-01-05T16:30:00Z',
      documentsComplete: true,
    } as any,
    {
      id: 6,
      customerId: 6,
      customerName: 'Jennifer Martinez',
      customerEmail: 'jmartinez@email.com',
      customerPhone: '(555) 678-9012',
      vehicleId: 6,
      vehicleName: 'Mercedes-Benz Sprinter 2023',
      vehicleType: 'van',
      vehicleImage: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400',
      licensePlate: 'MNO-2468',
      startDate: '2025-01-22',
      endDate: '2025-01-29',
      startTime: '10:00',
      endTime: '10:00',
      status: 'reserved',
      paymentStatus: 'partial',
      depositAmount: 150,
      dailyRate: 85,
      numberOfDays: 7,
      totalAmount: 595,
      pickupLocation: 'Main Office',
      returnLocation: 'Main Office',
      notes: 'Group of 10 passengers, wedding event',
      createdAt: '2025-01-15T13:00:00Z',
    },
    {
      id: 7,
      customerId: 7,
      customerName: 'Robert Anderson',
      customerEmail: 'randerson@email.com',
      customerPhone: '(555) 789-0123',
      vehicleId: 1,
      vehicleName: 'Toyota Camry 2023',
      vehicleType: 'sedan',
      vehicleImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
      licensePlate: 'ABC-1234',
      startDate: '2025-01-05',
      endDate: '2025-01-08',
      status: 'completed',
      dailyRate: 45,
      numberOfDays: 3,
      totalAmount: 135,
      pickupLocation: 'Airport Branch',
      returnLocation: 'Airport Branch',
      createdAt: '2025-01-02T08:00:00Z',
    },
    {
      id: 8,
      customerId: 8,
      customerName: 'Lisa Thompson',
      customerEmail: 'lthompson@email.com',
      customerPhone: '(555) 890-1234',
      vehicleId: 3,
      vehicleName: 'Ford F-150 2023',
      vehicleType: 'truck',
      vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
      licensePlate: 'DEF-9012',
      startDate: '2025-01-20',
      endDate: '2025-01-22',
      status: 'cancelled',
      dailyRate: 75,
      numberOfDays: 2,
      totalAmount: 150,
      pickupLocation: 'Main Office',
      returnLocation: 'Main Office',
      notes: 'Customer cancelled due to schedule change',
      createdAt: '2025-01-18T15:45:00Z',
    },
  ])

  const filters = ref<RentalFilters>({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    // Advanced filters
    vehicleType: 'all',
    priceRange: { min: null, max: null },
    duration: 'all',
    customerType: 'all',
    showOverdueOnly: false,
  })

  const filteredRentals = computed(() => {
    return rentals.value.filter(rental => {
      // Basic filters
      const matchesSearch =
        !filters.value.search ||
        rental.customerName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        rental.vehicleName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        rental.licensePlate.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesStatus = filters.value.status === 'all' || rental.status === filters.value.status

      const matchesPaymentStatus =
        filters.value.paymentStatus === 'all' || rental.paymentStatus === filters.value.paymentStatus

      // Simple date range filtering - can be enhanced
      const matchesDateRange = filters.value.dateRange === 'all'

      // Advanced filters
      const matchesVehicleType =
        !filters.value.vehicleType ||
        filters.value.vehicleType === 'all' ||
        rental.vehicleType === filters.value.vehicleType

      const matchesPriceRange =
        (!filters.value.priceRange?.min || rental.totalAmount >= filters.value.priceRange.min) &&
        (!filters.value.priceRange?.max || rental.totalAmount <= filters.value.priceRange.max)

      const matchesDuration = (() => {
        if (!filters.value.duration || filters.value.duration === 'all') return true
        const days = rental.numberOfDays
        if (filters.value.duration === '1-3') return days >= 1 && days <= 3
        if (filters.value.duration === '4-7') return days >= 4 && days <= 7
        if (filters.value.duration === '7+') return days >= 7
        return true
      })()

      const matchesCustomerType = (() => {
        if (!filters.value.customerType || filters.value.customerType === 'all') return true
        if (filters.value.customerType === 'new') return rental.isNewCustomer === true
        if (filters.value.customerType === 'returning') return rental.isNewCustomer === false
        return true
      })()

      const matchesOverdue = (() => {
        if (!filters.value.showOverdueOnly) return true
        const endDate = new Date(rental.endDate)
        const today = new Date()
        return rental.status === 'active' && endDate < today
      })()

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPaymentStatus &&
        matchesDateRange &&
        matchesVehicleType &&
        matchesPriceRange &&
        matchesDuration &&
        matchesCustomerType &&
        matchesOverdue
      )
    })
  })

  const addRental = (rental: Omit<Rental, 'id' | 'createdAt'>) => {
    const newId = Math.max(...rentals.value.map(r => r.id), 0) + 1
    rentals.value.push({
      ...rental,
      id: newId,
      createdAt: new Date().toISOString(),
    })
  }

  const updateRental = (id: number, updates: Partial<Rental>) => {
    const index = rentals.value.findIndex(r => r.id === id)
    if (index !== -1) {
      rentals.value[index] = { ...rentals.value[index], ...updates }
    }
  }

  const deleteRental = (id: number) => {
    rentals.value = rentals.value.filter(r => r.id !== id)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      completed: 'info',
      reserved: 'warning',
      cancelled: 'error',
    }
    return colors[status] || 'default'
  }

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      partial: 'info',
      paid: 'success',
    }
    return colors[status] || 'default'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      active: 'mdi-car-clock',
      completed: 'mdi-check-circle',
      reserved: 'mdi-calendar-clock',
      cancelled: 'mdi-cancel',
    }
    return icons[status] || 'mdi-help-circle'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return {
    rentals,
    filters,
    filteredRentals,
    addRental,
    updateRental,
    deleteRental,
    getStatusColor,
    getStatusIcon,
    getPaymentStatusColor,
    formatDate,
  }
}
