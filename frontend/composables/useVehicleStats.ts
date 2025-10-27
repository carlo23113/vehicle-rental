import { computed } from 'vue'

/**
 * Composable for calculating vehicle statistics
 * Uses single-pass optimization for better performance
 */
export const useVehicleStats = (vehicles: any) => {
  // Single-pass stats calculation - O(n) complexity
  const stats = computed(() => {
    const aggregated = vehicles.value.reduce(
      (acc: any, vehicle: any) => {
        // Count total vehicles
        acc.totalCount++

        // Count by status
        if (vehicle.status === 'available') acc.availableCount++
        else if (vehicle.status === 'rented') acc.rentedCount++
        else if (vehicle.status === 'maintenance') acc.maintenanceCount++
        else if (vehicle.status === 'out-of-service') acc.outOfServiceCount++

        return acc
      },
      {
        totalCount: 0,
        availableCount: 0,
        rentedCount: 0,
        maintenanceCount: 0,
        outOfServiceCount: 0,
      }
    )

    // Calculate utilization rate
    const utilizationRate = aggregated.totalCount > 0
      ? Math.round((aggregated.rentedCount / aggregated.totalCount) * 100)
      : 0

    return [
      {
        icon: 'mdi-car-multiple',
        label: 'Total Vehicles',
        value: aggregated.totalCount,
        color: 'primary' as const,
      },
      {
        icon: 'mdi-check-circle',
        label: 'Available',
        value: aggregated.availableCount,
        color: 'success' as const,
      },
      {
        icon: 'mdi-car-clock',
        label: 'Currently Rented',
        value: aggregated.rentedCount,
        color: 'info' as const,
      },
      {
        icon: 'mdi-wrench',
        label: 'In Maintenance',
        value: aggregated.maintenanceCount,
        color: 'warning' as const,
      },
    ]
  })

  return {
    stats,
  }
}
