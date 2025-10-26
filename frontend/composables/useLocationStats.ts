import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Location } from '~/composables/useLocations'

/**
 * Composable for calculating location statistics
 * Uses single-pass aggregation for better performance (O(n) instead of O(4n))
 */
export const useLocationStats = (locations: Ref<Location[]>) => {
  const stats = computed(() => {
    // Single pass through the data to calculate all stats
    const aggregated = locations.value.reduce(
      (acc, location) => {
        // Count by status
        if (location.status === 'active') {
          acc.activeCount++
        } else if (location.status === 'inactive') {
          acc.inactiveCount++
        }

        // Sum total capacity
        acc.totalCapacity += location.capacity

        return acc
      },
      {
        activeCount: 0,
        inactiveCount: 0,
        totalCapacity: 0,
      }
    )

    return [
      {
        icon: 'mdi-map-marker-check',
        label: 'Active Locations',
        value: aggregated.activeCount,
        color: 'success'
      },
      {
        icon: 'mdi-map-marker-off',
        label: 'Inactive',
        value: aggregated.inactiveCount,
        color: 'warning'
      },
      {
        icon: 'mdi-map-marker',
        label: 'Total Locations',
        value: locations.value.length,
        color: 'info'
      },
      {
        icon: 'mdi-garage',
        label: 'Total Capacity',
        value: aggregated.totalCapacity,
        color: 'primary'
      }
    ]
  })

  return {
    stats
  }
}
