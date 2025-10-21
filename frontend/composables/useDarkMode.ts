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
        theme.global.name.value = savedTheme
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        isDark.value = prefersDark
        theme.global.name.value = prefersDark ? 'dark' : 'light'
      }
    }
  })

  // Watch for changes and persist
  watch(isDark, (newValue) => {
    const themeName = newValue ? 'dark' : 'light'
    theme.global.name.value = themeName

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', themeName)
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
