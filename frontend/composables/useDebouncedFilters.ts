import { watch, onUnmounted } from 'vue'

interface UseDebouncedFiltersOptions {
  searchDebounce?: number
  onSearchChange?: () => void
  onFilterChange?: () => void
}

/**
 * Composable for debounced filter handling
 * Optimizes filter performance by debouncing search and handling immediate filters
 */
export const useDebouncedFilters = (
  filters: any,
  options: UseDebouncedFiltersOptions = {}
) => {
  const { searchDebounce = 300, onSearchChange, onFilterChange } = options

  let filterDebounceTimer: ReturnType<typeof setTimeout> | null = null

  // Debounced search watcher
  watch(
    () => filters.value.search,
    () => {
      if (filterDebounceTimer) {
        clearTimeout(filterDebounceTimer)
      }
      filterDebounceTimer = setTimeout(() => {
        onSearchChange?.()
      }, searchDebounce)
    }
  )

  // Immediate filter watchers (for dropdowns)
  const watchImmediateFilters = (filterKeys: string[]) => {
    watch(
      () => filterKeys.map(key => filters.value[key]),
      () => {
        onFilterChange?.()
      }
    )
  }

  // Cleanup
  onUnmounted(() => {
    if (filterDebounceTimer) {
      clearTimeout(filterDebounceTimer)
    }
  })

  return {
    watchImmediateFilters,
  }
}
