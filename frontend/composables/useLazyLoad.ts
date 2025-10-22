import { ref, onMounted, onUnmounted } from 'vue'

export interface LazyLoadOptions {
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

/**
 * Composable for lazy loading with Intersection Observer
 * Provides a reusable way to implement lazy loading for any component
 */
export const useLazyLoad = (options: LazyLoadOptions = {}) => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    once = true
  } = options

  const isVisible = ref(false)
  const target = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const observe = () => {
    if (!target.value || typeof IntersectionObserver === 'undefined') {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true

            // Unobserve if once is true
            if (once && observer && target.value) {
              observer.unobserve(target.value)
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      {
        root: null,
        rootMargin,
        threshold
      }
    )

    observer.observe(target.value)
  }

  onMounted(() => {
    observe()
  })

  onUnmounted(() => {
    if (observer && target.value) {
      observer.unobserve(target.value)
      observer.disconnect()
    }
  })

  return {
    target,
    isVisible
  }
}

/**
 * Composable for progressive data loading
 * Loads data in batches to improve perceived performance
 */
export const useProgressiveLoad = <T>(
  items: T[],
  options: {
    batchSize?: number
    delay?: number
  } = {}
) => {
  const { batchSize = 5, delay = 100 } = options

  const visibleItems = ref<T[]>([])
  const isLoading = ref(true)
  const isComplete = ref(false)

  const loadNextBatch = () => {
    const currentLength = visibleItems.value.length
    const nextBatch = items.slice(currentLength, currentLength + batchSize)

    if (nextBatch.length > 0) {
      visibleItems.value.push(...nextBatch)

      if (visibleItems.value.length < items.length) {
        setTimeout(loadNextBatch, delay)
      } else {
        isLoading.value = false
        isComplete.value = true
      }
    } else {
      isLoading.value = false
      isComplete.value = true
    }
  }

  onMounted(() => {
    loadNextBatch()
  })

  return {
    visibleItems,
    isLoading,
    isComplete
  }
}

/**
 * Composable for deferred component loading
 * Delays component rendering until after critical content is loaded
 */
export const useDeferredLoad = (delay: number = 0) => {
  const isReady = ref(false)

  onMounted(() => {
    if (delay === 0) {
      // Use requestIdleCallback if available, otherwise use setTimeout
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          isReady.value = true
        })
      } else {
        setTimeout(() => {
          isReady.value = true
        }, 50)
      }
    } else {
      setTimeout(() => {
        isReady.value = true
      }, delay)
    }
  })

  return {
    isReady
  }
}
