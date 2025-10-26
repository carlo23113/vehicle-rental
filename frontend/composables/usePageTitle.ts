import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const usePageTitle = () => {
  const route = useRoute()

  const pageTitle = computed(() => {
    const path = route.path

    // Define custom titles for specific routes
    const titleMap: Record<string, string> = {
      '/': 'Dashboard',
      '/owner/dashboard': 'Dashboard',
      '/owner/vehicles': 'Vehicles',
      '/owner/vehicles/add': 'Add Vehicle',
      '/owner/customers': 'Customers',
      '/owner/rentals': 'Rentals',
      '/reservations': 'Reservations',
      '/owner/payments': 'Payments',
      '/owner/maintenance': 'Maintenance',
      '/owner/reports': 'Reports',
      '/owner/users': 'Users',
      '/owner/roles': 'Roles',
      '/owner/settings': 'Settings',
      '/owner/locations': 'Locations',
      '/owner/locations/add': 'Add Location',
    }

    // Check if we have a custom title for this route
    if (titleMap[path]) {
      return titleMap[path]
    }

    // Handle dynamic routes (e.g., /roles/123, /vehicles/123)
    const segments = path.split('/').filter(Boolean)
    if (segments.length > 1) {
      const baseRoute = `/${segments[0]}`
      if (titleMap[baseRoute]) {
        // Capitalize the action or ID
        const lastSegment = segments[segments.length - 1]
        if (lastSegment === 'add') {
          return `Add ${titleMap[baseRoute].slice(0, -1)}`
        }
        if (lastSegment === 'edit') {
          return `Edit ${titleMap[baseRoute].slice(0, -1)}`
        }
        // If it's a numeric ID or other segment, return "View {Entity}"
        return `View ${titleMap[baseRoute].slice(0, -1)}`
      }
    }

    // Fallback: use route name or path
    const routeName = route.name as string
    if (routeName) {
      return routeName.charAt(0).toUpperCase() + routeName.slice(1)
    }

    return 'Dashboard'
  })

  return {
    pageTitle
  }
}
