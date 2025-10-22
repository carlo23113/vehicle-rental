import { ref } from 'vue'

interface SnackbarState {
  show: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
  icon: string
}

export const useSnackbar = () => {
  const snackbar = ref<SnackbarState>({
    show: false,
    message: '',
    color: 'info',
    icon: 'mdi-information',
  })

  const showSnackbar = (
    message: string,
    color: SnackbarState['color'] = 'info',
    icon?: string
  ) => {
    const iconMap = {
      success: 'mdi-check-circle',
      error: 'mdi-alert-circle',
      warning: 'mdi-alert',
      info: 'mdi-information',
    }

    snackbar.value = {
      show: true,
      message,
      color,
      icon: icon || iconMap[color],
    }
  }

  const showSuccess = (message: string) => {
    showSnackbar(message, 'success')
  }

  const showError = (message: string) => {
    showSnackbar(message, 'error')
  }

  const showWarning = (message: string) => {
    showSnackbar(message, 'warning')
  }

  const showInfo = (message: string) => {
    showSnackbar(message, 'info')
  }

  const hideSnackbar = () => {
    snackbar.value.show = false
  }

  return {
    snackbar,
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideSnackbar,
  }
}
