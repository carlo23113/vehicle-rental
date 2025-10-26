import { computed } from 'vue'
import { useCurrency } from './useCurrency'

/**
 * Composable for calculating rental statistics
 * Uses single-pass optimization for better performance
 */
export const useRentalStats = (rentals: any) => {
  const { formatCurrency, getCurrencyIcon } = useCurrency()

  // Single-pass stats calculation - O(n) complexity
  const stats = computed(() => {
    const aggregated = rentals.value.reduce(
      (acc: any, rental: any) => {
        // Count by status
        if (rental.status === 'active') acc.activeCount++
        else if (rental.status === 'reserved') acc.reservedCount++
        else if (rental.status === 'completed') acc.completedCount++

        // Calculate revenue (exclude cancelled)
        if (rental.status !== 'cancelled') {
          acc.totalRevenue += rental.totalAmount
        }

        return acc
      },
      { activeCount: 0, reservedCount: 0, completedCount: 0, totalRevenue: 0 }
    )

    return [
      {
        icon: 'mdi-check-circle',
        label: 'Active Rentals',
        value: aggregated.activeCount,
        color: 'success' as const,
      },
      {
        icon: 'mdi-calendar-clock',
        label: 'Reserved',
        value: aggregated.reservedCount,
        color: 'warning' as const,
      },
      {
        icon: 'mdi-check-all',
        label: 'Completed',
        value: aggregated.completedCount,
        color: 'info' as const,
      },
      {
        icon: getCurrencyIcon(),
        label: 'Total Revenue',
        value: formatCurrency(aggregated.totalRevenue),
        color: 'primary' as const,
      },
    ]
  })

  return {
    stats,
  }
}
