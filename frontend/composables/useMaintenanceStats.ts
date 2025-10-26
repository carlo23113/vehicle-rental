import { computed } from 'vue'
import type { Ref } from 'vue'

/**
 * Composable for calculating maintenance statistics
 * Uses single-pass aggregation for better performance (O(n) instead of O(4n))
 */
export const useMaintenanceStats = (
  maintenanceRecords: Ref<any[]>,
  formatCurrency: (amount: number) => string,
  getCurrencyIcon: () => string
) => {
  const stats = computed(() => {
    // Single pass through the data to calculate all stats
    const aggregated = maintenanceRecords.value.reduce(
      (acc, record) => {
        // Count by status
        if (record.status === 'scheduled') {
          acc.scheduledCount++
        } else if (record.status === 'in-progress') {
          acc.inProgressCount++
        } else if (record.status === 'completed') {
          acc.completedCount++
          // Sum cost for completed records only
          acc.totalCost += record.cost
        }

        return acc
      },
      {
        scheduledCount: 0,
        inProgressCount: 0,
        completedCount: 0,
        totalCost: 0,
      }
    )

    return [
      {
        icon: 'mdi-calendar-clock',
        label: 'Scheduled',
        value: aggregated.scheduledCount,
        color: 'info',
      },
      {
        icon: 'mdi-tools',
        label: 'In Progress',
        value: aggregated.inProgressCount,
        color: 'warning',
      },
      {
        icon: 'mdi-check-circle',
        label: 'Completed',
        value: aggregated.completedCount,
        color: 'success',
      },
      {
        icon: getCurrencyIcon(),
        label: 'Total Cost',
        value: formatCurrency(aggregated.totalCost),
        color: 'primary',
      },
    ]
  })

  return {
    stats
  }
}
