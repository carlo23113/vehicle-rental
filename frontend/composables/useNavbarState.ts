import { ref } from 'vue'
import { useScrollDetection } from './useScrollDetection'
import { usePageTitle } from './usePageTitle'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

export const useNavbarState = () => {
  const showSearch = ref(false)
  const { isScrolled } = useScrollDetection(10)
  const { pageTitle } = usePageTitle()

  // Setup keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      meta: true,
      ctrl: true,
      callback: () => {
        showSearch.value = true
      },
      description: 'Open search'
    }
  ])

  const openSearch = () => {
    showSearch.value = true
  }

  const closeSearch = () => {
    showSearch.value = false
  }

  return {
    showSearch,
    isScrolled,
    pageTitle,
    openSearch,
    closeSearch
  }
}
