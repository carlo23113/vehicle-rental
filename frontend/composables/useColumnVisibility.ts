/**
 * Reusable composable for managing table column visibility
 * Stores user preferences in localStorage
 */

import { ref, computed, watch } from 'vue'

export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  align?: 'start' | 'end' | 'center'
  width?: string | number
  // Column visibility options
  hideable?: boolean // Can this column be hidden? (default: true)
  visible?: boolean // Is this column currently visible? (default: true)
  required?: boolean // Must this column always be visible? (default: false)
}

export interface ColumnVisibilityOptions {
  storageKey: string // LocalStorage key for persisting preferences
  defaultVisible?: string[] // Column keys that are visible by default
}

export const useColumnVisibility = (
  columns: TableColumn[],
  options: ColumnVisibilityOptions,
) => {
  const { storageKey, defaultVisible } = options

  // Initialize visibility state from localStorage or defaults
  const initializeVisibility = (): Record<string, boolean> => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load column visibility preferences:', error)
    }

    // Default visibility
    const visibility: Record<string, boolean> = {}
    columns.forEach((col) => {
      if (col.required) {
        visibility[col.key] = true
      } else if (defaultVisible) {
        visibility[col.key] = defaultVisible.includes(col.key)
      } else {
        visibility[col.key] = col.visible !== false
      }
    })
    return visibility
  }

  const columnVisibility = ref<Record<string, boolean>>(initializeVisibility())

  // Save to localStorage whenever visibility changes
  watch(
    columnVisibility,
    (newVisibility) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newVisibility))
      } catch (error) {
        console.error('Failed to save column visibility preferences:', error)
      }
    },
    { deep: true },
  )

  // Computed list of visible columns
  const visibleColumns = computed(() => {
    return columns.filter((col) => {
      // Required columns are always visible
      if (col.required) return true
      // Check visibility state
      return columnVisibility.value[col.key] !== false
    })
  })

  // Computed list of hidden columns
  const hiddenColumns = computed(() => {
    return columns.filter((col) => {
      // Required columns can't be hidden
      if (col.required) return false
      // Check if hidden
      return columnVisibility.value[col.key] === false
    })
  })

  // Toggle column visibility
  const toggleColumn = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey)
    if (column?.required) return // Can't toggle required columns

    columnVisibility.value[columnKey] = !columnVisibility.value[columnKey]
  }

  // Show a specific column
  const showColumn = (columnKey: string) => {
    columnVisibility.value[columnKey] = true
  }

  // Hide a specific column
  const hideColumn = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey)
    if (column?.required) return // Can't hide required columns

    columnVisibility.value[columnKey] = false
  }

  // Show all columns
  const showAllColumns = () => {
    columns.forEach((col) => {
      columnVisibility.value[col.key] = true
    })
  }

  // Reset to defaults
  const resetToDefaults = () => {
    columns.forEach((col) => {
      if (col.required) {
        columnVisibility.value[col.key] = true
      } else if (defaultVisible) {
        columnVisibility.value[col.key] = defaultVisible.includes(col.key)
      } else {
        columnVisibility.value[col.key] = col.visible !== false
      }
    })
  }

  // Check if a column is visible
  const isColumnVisible = (columnKey: string): boolean => {
    const column = columns.find((col) => col.key === columnKey)
    if (column?.required) return true
    return columnVisibility.value[columnKey] !== false
  }

  // Get hideable columns (columns that can be toggled)
  const hideableColumns = computed(() => {
    return columns.filter((col) => !col.required && col.hideable !== false)
  })

  // Count of visible columns
  const visibleCount = computed(() => visibleColumns.value.length)

  // Count of hidden columns
  const hiddenCount = computed(() => hiddenColumns.value.length)

  return {
    columnVisibility,
    visibleColumns,
    hiddenColumns,
    hideableColumns,
    visibleCount,
    hiddenCount,
    toggleColumn,
    showColumn,
    hideColumn,
    showAllColumns,
    resetToDefaults,
    isColumnVisible,
  }
}
