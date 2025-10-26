import { computed } from 'vue'
import type { Ref } from 'vue'

/**
 * Composable for calculating document statistics
 * Wraps the existing getDocumentStats function for consistency with other pages
 */
export const useDocumentStats = (getDocumentStats: () => {
  total: number
  pending: number
  verified: number
  expiringSoon: number
}) => {
  const stats = computed(() => {
    const docStats = getDocumentStats()

    return [
      {
        icon: 'mdi-file-document',
        label: 'Total Documents',
        value: docStats.total,
        color: 'primary',
      },
      {
        icon: 'mdi-clock-alert',
        label: 'Pending Review',
        value: docStats.pending,
        color: 'warning',
      },
      {
        icon: 'mdi-check-circle',
        label: 'Verified',
        value: docStats.verified,
        color: 'success',
      },
      {
        icon: 'mdi-alert-circle',
        label: 'Expiring Soon',
        value: docStats.expiringSoon,
        color: 'error',
      },
    ]
  })

  return {
    stats
  }
}
