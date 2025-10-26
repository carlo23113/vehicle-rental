import { computed } from 'vue'
import type { Ref } from 'vue'
import type { User } from '~/types/user'

/**
 * Composable for calculating user statistics
 * Uses single-pass aggregation for better performance (O(n) instead of O(4n))
 */
export const useUserStats = (users: Ref<User[]>) => {
  const stats = computed(() => {
    // Single pass through the data to calculate all stats
    const aggregated = users.value.reduce(
      (acc, user) => {
        // Count by role
        if (user.role === 'admin') {
          acc.adminCount++
        } else if (user.role === 'manager') {
          acc.managerCount++
        } else if (user.role === 'agent') {
          acc.agentCount++
        }

        // Count active users
        if (user.status === 'active') {
          acc.activeCount++
        }

        return acc
      },
      {
        adminCount: 0,
        managerCount: 0,
        agentCount: 0,
        activeCount: 0,
      }
    )

    return [
      {
        icon: 'mdi-shield-crown',
        label: 'Admins',
        value: aggregated.adminCount,
        color: 'error'
      },
      {
        icon: 'mdi-account-tie',
        label: 'Managers',
        value: aggregated.managerCount,
        color: 'primary'
      },
      {
        icon: 'mdi-account-circle',
        label: 'Agents',
        value: aggregated.agentCount,
        color: 'info'
      },
      {
        icon: 'mdi-account-check',
        label: 'Active Users',
        value: aggregated.activeCount,
        color: 'success'
      }
    ]
  })

  return {
    stats
  }
}
