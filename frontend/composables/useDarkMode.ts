import { useTheme } from 'vuetify'
import { ref, watch, onMounted } from 'vue'

export const useDarkMode = () => {
  const theme = useTheme()
  const isDark = ref(false)

  // Initialize from localStorage
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        isDark.value = prefersDark
      }
      // Apply theme immediately
      if (isDark.value) {
        theme.change('dark')
      } else {
        theme.change('light')
      }
    }
  })

  // Watch for changes and persist
  watch(isDark, newValue => {
    if (newValue) {
      theme.change('dark')
    } else {
      theme.change('light')
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
    }
  })

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
  }

  const setDarkMode = (value: boolean) => {
    isDark.value = value
  }

  return {
    isDark,
    toggleDarkMode,
    setDarkMode,
  }
}
