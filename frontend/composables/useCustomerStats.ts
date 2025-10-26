import { computed } from 'vue'
import { useCurrency } from './useCurrency'

/**
 * Composable for calculating customer statistics
 * Uses single-pass optimization for better performance
 */
export const useCustomerStats = (customers: any) => {
  const { formatCurrency, getCurrencyIcon } = useCurrency()

  // Single-pass stats calculation - O(n) complexity
  const stats = computed(() => {
    const aggregated = customers.value.reduce(
      (acc: any, customer: any) => {
        // Count by status
        if (customer.status === 'active') acc.activeCount++
        else if (customer.status === 'inactive') acc.inactiveCount++

        // Calculate total revenue
        acc.totalRevenue += customer.totalSpent || 0

        return acc
      },
      { activeCount: 0, inactiveCount: 0, totalRevenue: 0 }
    )

    return [
      {
        icon: 'mdi-account-check',
        label: 'Active Customers',
        value: aggregated.activeCount,
        color: 'success' as const,
      },
      {
        icon: 'mdi-account-clock',
        label: 'Inactive',
        value: aggregated.inactiveCount,
        color: 'warning' as const,
      },
      {
        icon: 'mdi-account-group',
        label: 'Total Customers',
        value: customers.value.length,
        color: 'primary' as const,
      },
      {
        icon: getCurrencyIcon(),
        label: 'Total Revenue',
        value: formatCurrency(aggregated.totalRevenue),
        color: 'info' as const,
      },
    ]
  })

  return {
    stats,
  }
}
