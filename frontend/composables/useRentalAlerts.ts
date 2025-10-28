import { computed, type ComputedRef } from 'vue'
import type { Rental } from '~/types/rental'

export interface RentalAlert {
  type: 'overdue' | 'upcoming' | 'unpaid' | 'documents'
  count: number
  items: string[]
  rentals: Rental[]
}

export interface RentalAlerts {
  overdue: RentalAlert
  upcoming: RentalAlert
  unpaid: RentalAlert
  documents: RentalAlert
  hasAlerts: boolean
  totalAlerts: number
}

export function useRentalAlerts(rentals: ComputedRef<Rental[]>) {
  // Calculate overdue returns (active rentals past end date)
  const overdueRentals = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return rentals.value.filter(rental => {
      if (rental.status !== 'active') return false
      const endDate = new Date(rental.endDate)
      endDate.setHours(0, 0, 0, 0)
      return endDate < today
    })
  })

  const overdueAlert = computed<RentalAlert>(() => {
    const items = overdueRentals.value.map(rental => {
      const daysOverdue = Math.floor(
        (new Date().getTime() - new Date(rental.endDate).getTime()) / (1000 * 60 * 60 * 24)
      )
      return `${rental.vehicleName} - ${rental.customerName} (${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue)`
    })

    return {
      type: 'overdue',
      count: overdueRentals.value.length,
      items,
      rentals: overdueRentals.value,
    }
  })

  // Calculate upcoming pickups (reserved rentals starting today or tomorrow)
  const upcomingRentals = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    return rentals.value.filter(rental => {
      if (rental.status !== 'reserved') return false
      const startDate = new Date(rental.startDate)
      startDate.setHours(0, 0, 0, 0)
      return startDate >= today && startDate < dayAfterTomorrow
    })
  })

  const upcomingAlert = computed<RentalAlert>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const items = upcomingRentals.value.map(rental => {
      const startDate = new Date(rental.startDate)
      startDate.setHours(0, 0, 0, 0)
      const isToday = startDate.getTime() === today.getTime()
      const when = isToday ? 'Today' : 'Tomorrow'
      return `${rental.vehicleName} - ${rental.customerName} (${when})`
    })

    return {
      type: 'upcoming',
      count: upcomingRentals.value.length,
      items,
      rentals: upcomingRentals.value,
    }
  })

  // Calculate unpaid balances (active or completed rentals with unpaid/partially-paid status)
  const unpaidRentals = computed(() => {
    return rentals.value.filter(rental => {
      if (!rental.paymentStatus) return false
      if (rental.status === 'cancelled') return false
      return rental.paymentStatus === 'unpaid' || rental.paymentStatus === 'partially-paid'
    })
  })

  const unpaidAlert = computed<RentalAlert>(() => {
    const items = unpaidRentals.value.map(rental => {
      const statusLabel = rental.paymentStatus === 'unpaid' ? 'Unpaid' : 'Partially Paid'
      return `${rental.vehicleName} - ${rental.customerName} ($${rental.totalAmount} - ${statusLabel})`
    })

    return {
      type: 'unpaid',
      count: unpaidRentals.value.length,
      items,
      rentals: unpaidRentals.value,
    }
  })

  // Calculate missing documents (active/reserved rentals without required documents)
  // Note: This assumes rentals have a 'documentsComplete' field
  const missingDocumentsRentals = computed(() => {
    return rentals.value.filter(rental => {
      if (rental.status !== 'active' && rental.status !== 'reserved') return false
      // Check if documentsComplete field exists and is false
      return (rental as any).documentsComplete === false
    })
  })

  const documentsAlert = computed<RentalAlert>(() => {
    const items = missingDocumentsRentals.value.map(rental => {
      return `${rental.vehicleName} - ${rental.customerName} (Documents incomplete)`
    })

    return {
      type: 'documents',
      count: missingDocumentsRentals.value.length,
      items,
      rentals: missingDocumentsRentals.value,
    }
  })

  // Calculate total alerts
  const totalAlerts = computed(() => {
    return (
      overdueAlert.value.count +
      upcomingAlert.value.count +
      unpaidAlert.value.count +
      documentsAlert.value.count
    )
  })

  const hasAlerts = computed(() => totalAlerts.value > 0)

  const alerts = computed<RentalAlerts>(() => ({
    overdue: overdueAlert.value,
    upcoming: upcomingAlert.value,
    unpaid: unpaidAlert.value,
    documents: documentsAlert.value,
    hasAlerts: hasAlerts.value,
    totalAlerts: totalAlerts.value,
  }))

  return {
    alerts,
    overdueAlert,
    upcomingAlert,
    unpaidAlert,
    documentsAlert,
    hasAlerts,
    totalAlerts,
  }
}
