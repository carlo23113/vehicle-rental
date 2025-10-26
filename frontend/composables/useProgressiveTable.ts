import { ref, onMounted, onUnmounted } from 'vue'

interface UseProgressiveTableOptions {
  batchSize?: number
  rootMargin?: string
  threshold?: number
}

/**
 * Composable for progressive table loading with intersection observer
 * Handles lazy loading, batch processing, and cleanup
 */
export const useProgressiveTable = (
  filteredData: any,
  options: UseProgressiveTableOptions = {}
) => {
  const { batchSize = 20, rootMargin = '100px', threshold = 0.01 } = options

  // Refs
  const statsSection = ref<HTMLElement | null>(null)
  const tableSection = ref<HTMLElement | null>(null)
  const sectionsLoaded = ref({
    stats: false,
    table: false,
  })

  const displayedItems = ref<any[]>([])
  const isLoadingMore = ref(false)

  let observer: IntersectionObserver | null = null

  // Progressive loading function
  const loadNextBatch = () => {
    if (displayedItems.value.length >= filteredData.value.length) {
      isLoadingMore.value = false
      return
    }

    isLoadingMore.value = true

    setTimeout(() => {
      const nextBatch = filteredData.value.slice(
        displayedItems.value.length,
        displayedItems.value.length + batchSize
      )
      displayedItems.value.push(...nextBatch)

      // Check if there are more items to load
      if (displayedItems.value.length < filteredData.value.length) {
        // Continue loading more batches
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => loadNextBatch())
        } else {
          setTimeout(() => loadNextBatch(), 100)
        }
      } else {
        isLoadingMore.value = false
      }
    }, 200)
  }

  // Update displayed items
  const updateDisplayedItems = () => {
    displayedItems.value = filteredData.value.slice(0, batchSize)

    if (displayedItems.value.length < filteredData.value.length) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadNextBatch())
      } else {
        setTimeout(() => loadNextBatch(), 500)
      }
    }
  }

  // Setup intersection observer
  const setupIntersectionObserver = () => {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: load all sections immediately
      sectionsLoaded.value = {
        stats: true,
        table: true,
      }
      displayedItems.value = filteredData.value.slice(0, batchSize)
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load section when it becomes visible
            if (entry.target === statsSection.value && !sectionsLoaded.value.stats) {
              sectionsLoaded.value.stats = true
            } else if (entry.target === tableSection.value && !sectionsLoaded.value.table) {
              sectionsLoaded.value.table = true
              // Load first batch
              displayedItems.value = filteredData.value.slice(0, batchSize)

              // Queue loading of remaining data
              if (displayedItems.value.length < filteredData.value.length) {
                if ('requestIdleCallback' in window) {
                  window.requestIdleCallback(() => loadNextBatch())
                } else {
                  setTimeout(() => loadNextBatch(), 500)
                }
              }
            }

            // Stop observing once loaded
            if (entry.target instanceof Element) {
              observer?.unobserve(entry.target)
            }
          }
        })
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    )

    // Observe all sections
    if (statsSection.value) observer.observe(statsSection.value)
    if (tableSection.value) observer.observe(tableSection.value)
  }

  // Initialize on mount
  onMounted(() => {
    // If refs are not provided (new CommonPageLayout pattern), auto-load data immediately
    if (!statsSection.value && !tableSection.value) {
      sectionsLoaded.value = {
        stats: true,
        table: true,
      }
      displayedItems.value = filteredData.value.slice(0, batchSize)

      // Queue loading of remaining data
      if (displayedItems.value.length < filteredData.value.length) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => loadNextBatch())
        } else {
          setTimeout(() => loadNextBatch(), 500)
        }
      }
    } else {
      setupIntersectionObserver()
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    statsSection,
    tableSection,
    sectionsLoaded,
    displayedItems,
    isLoadingMore,
    updateDisplayedItems,
  }
}
