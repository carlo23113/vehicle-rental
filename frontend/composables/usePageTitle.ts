import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const usePageTitle = () => {
  const route = useRoute()

  const pageTitle = computed(() => {
    const path = route.path

    // Define custom titles for specific routes
    const titleMap: Record<string, string> = {
      '/owner/dashboard': 'Dashboard',
      '/owner/vehicles': 'Vehicles',
      '/owner/vehicles/add': 'Add Vehicle',
      '/owner/customers': 'Customers',
      '/owner/rentals': 'Rentals',
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

    // Handle dynamic routes (e.g., /owner/vehicles/123, /owner/roles/123)
    const segments = path.split('/').filter(Boolean)
    if (segments.length > 1) {
      // Build the base route by checking segments from start
      // For /owner/vehicles/123, we want to match /owner/vehicles
      for (let i = segments.length - 1; i >= 0; i--) {
        const baseRoute = '/' + segments.slice(0, i + 1).join('/')
        if (titleMap[baseRoute]) {
          const lastSegment = segments[segments.length - 1]
          const secondLastSegment = segments.length > 1 ? segments[segments.length - 2] : ''

          // Handle /owner/vehicles/edit/123
          if (secondLastSegment === 'edit') {
            return `Edit ${titleMap[baseRoute].slice(0, -1)}`
          }

          // Handle /owner/vehicles/add
          if (lastSegment === 'add') {
            return `Add ${titleMap[baseRoute].slice(0, -1)}`
          }

          // Handle /owner/vehicles/123 (view/detail page)
          if (lastSegment !== 'edit' && lastSegment !== 'add') {
            return `${titleMap[baseRoute].slice(0, -1)} Details`
          }
        }
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
    pageTitle,
  }
}
