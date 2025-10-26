/**
 * Client-side only lazy loading plugin
 * Provides route-level lazy loading utilities
 */
export default defineNuxtPlugin(() => {
  // Preload routes using preloadRouteComponents
  const preloadRoute = async (path: string) => {
    if (typeof window === 'undefined') return

    try {
      // Use Nuxt's preloadRouteComponents API
      await preloadRouteComponents(path)
    } catch (error) {
      // Silently fail if route prefetch fails
      console.debug('Route preload failed:', path, error)
    }
  }

  // Preload critical routes after initial load
  if (typeof window !== 'undefined') {
    // Wait for the page to be fully loaded before preloading
    window.addEventListener('load', () => {
      // Use requestIdleCallback to preload during idle time
      const preloadCriticalRoutes = () => {
        const criticalRoutes = [
          '/owner/dashboard',
          '/owner/vehicles',
          '/owner/rentals',
          '/owner/customers',
        ]

        criticalRoutes.forEach((route, index) => {
          setTimeout(() => {
            preloadRoute(route)
          }, index * 500) // Stagger preloading
        })
      }

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(preloadCriticalRoutes)
      } else {
        setTimeout(preloadCriticalRoutes, 2000)
      }
    })

    // Prefetch route on hover over navigation links
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement

      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const path = new URL(link.href).pathname
        // Debounce to avoid too many preloads
        if (!link.dataset.preloaded) {
          link.dataset.preloaded = 'true'
          preloadRoute(path)
        }
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
  }

  return {
    provide: {
      preloadRoute,
    },
  }
})
