import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Payment } from '~/types/payment'

/**
 * Composable for calculating payment statistics
 * Uses single-pass aggregation for better performance (O(n) instead of O(4n))
 */
export const usePaymentStats = (
  payments: Ref<Payment[]>,
  formatCurrency: (amount: number) => string
) => {
  const stats = computed(() => {
    // Single pass through the data to calculate all stats
    const aggregated = payments.value.reduce(
      (acc, payment) => {
        // Aggregate by status
        if (payment.status === 'completed') {
          acc.completedTotal += payment.amount
        } else if (payment.status === 'pending') {
          acc.pendingTotal += payment.amount
        } else if (payment.status === 'failed') {
          acc.failedCount++
        } else if (payment.status === 'refunded') {
          acc.refundedTotal += payment.refundAmount || 0
        }

        return acc
      },
      {
        completedTotal: 0,
        pendingTotal: 0,
        failedCount: 0,
        refundedTotal: 0,
      }
    )

    return [
      {
        icon: 'mdi-check-circle',
        label: 'Completed',
        value: formatCurrency(aggregated.completedTotal),
        color: 'success'
      },
      {
        icon: 'mdi-clock-outline',
        label: 'Pending',
        value: formatCurrency(aggregated.pendingTotal),
        color: 'warning'
      },
      {
        icon: 'mdi-alert-circle',
        label: 'Failed',
        value: aggregated.failedCount,
        color: 'error'
      },
      {
        icon: 'mdi-keyboard-return',
        label: 'Refunded',
        value: formatCurrency(aggregated.refundedTotal),
        color: 'info'
      }
    ]
  })

  return {
    stats
  }
}
