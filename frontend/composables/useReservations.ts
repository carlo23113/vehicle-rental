import { ref, computed } from 'vue'
import type { Reservation, ReservationFilters } from '~/types/reservation'

export const useReservations = () => {
  const reservations = ref<Reservation[]>([
    {
      id: 1,
      customerId: 4,
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      customerPhone: '(555) 456-7890',
      vehicleId: 4,
      vehicleName: 'Tesla Model 3 2024',
      vehicleType: 'Electric',
      licensePlate: 'GHI-3456',
      startDate: '2025-01-25',
      endDate: '2025-02-01',
      startTime: '10:00',
      endTime: '10:00',
      status: 'confirmed',
      dailyRate: 95,
      numberOfDays: 7,
      totalAmount: 665,
      pickupLocation: 'Downtown Branch',
      returnLocation: 'Downtown Branch',
      paymentStatus: 'partial',
      depositAmount: 200,
      notes: 'First time Tesla renter, provide orientation',
      createdAt: '2025-01-16T11:45:00Z',
      confirmedAt: '2025-01-16T14:30:00Z',
    },
    {
      id: 2,
      customerId: 6,
      customerName: 'Jennifer Martinez',
      customerEmail: 'jmartinez@email.com',
      customerPhone: '(555) 678-9012',
      vehicleId: 6,
      vehicleName: 'Mercedes-Benz Sprinter 2023',
      vehicleType: 'Van',
      licensePlate: 'MNO-2468',
      startDate: '2025-01-22',
      endDate: '2025-01-29',
      startTime: '09:00',
      endTime: '17:00',
      status: 'confirmed',
      dailyRate: 85,
      numberOfDays: 7,
      totalAmount: 595,
      pickupLocation: 'Main Office',
      returnLocation: 'Main Office',
      paymentStatus: 'paid',
      depositAmount: 595,
      notes: 'Group of 10 passengers, wedding event',
      createdAt: '2025-01-15T13:00:00Z',
      confirmedAt: '2025-01-15T15:20:00Z',
    },
    {
      id: 3,
      customerId: 9,
      customerName: 'James Garcia',
      customerEmail: 'jgarcia@email.com',
      customerPhone: '(555) 901-2345',
      vehicleId: 1,
      vehicleName: 'Toyota Camry 2023',
      vehicleType: 'Sedan',
      licensePlate: 'ABC-1234',
      startDate: '2025-01-28',
      endDate: '2025-01-30',
      startTime: '14:00',
      endTime: '14:00',
      status: 'pending',
      dailyRate: 45,
      numberOfDays: 2,
      totalAmount: 90,
      pickupLocation: 'Airport Branch',
      returnLocation: 'Airport Branch',
      paymentStatus: 'pending',
      depositAmount: 0,
      notes: 'Business trip rental',
      createdAt: '2025-01-20T09:30:00Z',
    },
    {
      id: 4,
      customerId: 10,
      customerName: 'Maria Rodriguez',
      customerEmail: 'mrodriguez@email.com',
      customerPhone: '(555) 012-3456',
      vehicleId: 5,
      vehicleName: 'BMW 5 Series 2024',
      vehicleType: 'Luxury',
      licensePlate: 'JKL-7890',
      startDate: '2025-02-05',
      endDate: '2025-02-08',
      startTime: '11:00',
      endTime: '11:00',
      status: 'confirmed',
      dailyRate: 120,
      numberOfDays: 3,
      totalAmount: 360,
      pickupLocation: 'Downtown Branch',
      returnLocation: 'Main Office',
      paymentStatus: 'partial',
      depositAmount: 180,
      notes: 'Anniversary celebration',
      createdAt: '2025-01-18T16:45:00Z',
      confirmedAt: '2025-01-19T10:00:00Z',
    },
    {
      id: 5,
      customerId: 2,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '(555) 234-5678',
      vehicleId: 2,
      vehicleName: 'Honda CR-V 2024',
      vehicleType: 'SUV',
      licensePlate: 'XYZ-5678',
      startDate: '2025-02-10',
      endDate: '2025-02-17',
      startTime: '10:00',
      endTime: '10:00',
      status: 'pending',
      dailyRate: 65,
      numberOfDays: 7,
      totalAmount: 455,
      pickupLocation: 'Main Office',
      returnLocation: 'Airport Branch',
      paymentStatus: 'pending',
      depositAmount: 0,
      createdAt: '2025-01-21T14:20:00Z',
    },
    {
      id: 6,
      customerId: 7,
      customerName: 'Robert Anderson',
      customerEmail: 'randerson@email.com',
      customerPhone: '(555) 789-0123',
      vehicleId: 3,
      vehicleName: 'Ford F-150 2023',
      vehicleType: 'Truck',
      licensePlate: 'DEF-9012',
      startDate: '2025-01-23',
      endDate: '2025-01-25',
      startTime: '08:00',
      endTime: '18:00',
      status: 'confirmed',
      dailyRate: 75,
      numberOfDays: 2,
      totalAmount: 150,
      pickupLocation: 'Main Office',
      returnLocation: 'Main Office',
      paymentStatus: 'paid',
      depositAmount: 150,
      notes: 'Hauling equipment for construction',
      createdAt: '2025-01-17T08:15:00Z',
      confirmedAt: '2025-01-17T09:00:00Z',
    },
    {
      id: 7,
      customerId: 3,
      customerName: 'Michael Brown',
      customerEmail: 'mbrown@email.com',
      customerPhone: '(555) 345-6789',
      vehicleId: 7,
      vehicleName: 'Chevrolet Malibu 2023',
      vehicleType: 'Sedan',
      licensePlate: 'PQR-1357',
      startDate: '2025-01-27',
      endDate: '2025-01-29',
      startTime: '12:00',
      endTime: '12:00',
      status: 'cancelled',
      dailyRate: 42,
      numberOfDays: 2,
      totalAmount: 84,
      pickupLocation: 'Airport Branch',
      returnLocation: 'Airport Branch',
      paymentStatus: 'pending',
      depositAmount: 0,
      notes: 'Customer cancelled due to schedule change',
      createdAt: '2025-01-19T11:30:00Z',
    },
  ])

  const filters = ref<ReservationFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
    paymentStatus: 'all',
  })

  const filteredReservations = computed(() => {
    return reservations.value.filter(reservation => {
      const matchesSearch =
        !filters.value.search ||
        reservation.customerName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        reservation.vehicleName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        reservation.licensePlate.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesStatus =
        filters.value.status === 'all' || reservation.status === filters.value.status

      const matchesPaymentStatus =
        filters.value.paymentStatus === 'all' ||
        reservation.paymentStatus === filters.value.paymentStatus

      // Simple date range filtering
      const matchesDateRange = filters.value.dateRange === 'all'

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange
    })
  })

  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newId = Math.max(...reservations.value.map(r => r.id), 0) + 1
    reservations.value.push({
      ...reservation,
      id: newId,
      createdAt: new Date().toISOString(),
    })
  }

  const updateReservation = (id: number, updates: Partial<Reservation>) => {
    const index = reservations.value.findIndex(r => r.id === id)
    if (index !== -1) {
      reservations.value[index] = { ...reservations.value[index], ...updates }
    }
  }

  const confirmReservation = (id: number) => {
    updateReservation(id, {
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    })
  }

  const cancelReservation = (id: number) => {
    updateReservation(id, { status: 'cancelled' })
  }

  const deleteReservation = (id: number) => {
    reservations.value = reservations.value.filter(r => r.id !== id)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'error',
      completed: 'info',
    }
    return colors[status] || 'default'
  }

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'error',
      partial: 'warning',
      paid: 'success',
    }
    return colors[status] || 'default'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return {
    reservations,
    filters,
    filteredReservations,
    addReservation,
    updateReservation,
    confirmReservation,
    cancelReservation,
    deleteReservation,
    getStatusColor,
    getPaymentStatusColor,
    formatDate,
    formatTime,
  }
}
