import { ref } from 'vue'

export const useRentalActions = () => {
  const actionLoading = ref(false)
  const cancelDialog = ref(false)

  const snackbar = ref({
    show: false,
    message: '',
    color: 'success' as 'success' | 'error',
    icon: 'mdi-check-circle',
  })

  const startRental = (rental: any) => {
    rental.status = 'active'
    snackbar.value = {
      show: true,
      message: 'Rental has been started successfully',
      color: 'success',
      icon: 'mdi-check-circle',
    }
  }

  const completeRental = (rental: any) => {
    rental.status = 'completed'
    snackbar.value = {
      show: true,
      message: 'Rental has been completed successfully',
      color: 'success',
      icon: 'mdi-check-circle',
    }
  }

  const openCancelDialog = () => {
    cancelDialog.value = true
  }

  const confirmCancel = async (rental: any) => {
    actionLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      rental.status = 'cancelled'
      snackbar.value = {
        show: true,
        message: 'Rental has been cancelled successfully',
        color: 'success',
        icon: 'mdi-check-circle',
      }
    } catch (error) {
      snackbar.value = {
        show: true,
        message: 'Failed to cancel rental. Please try again.',
        color: 'error',
        icon: 'mdi-alert-circle',
      }
    } finally {
      actionLoading.value = false
      cancelDialog.value = false
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      reserved: 'info',
      active: 'success',
      completed: 'primary',
      cancelled: 'error',
    }
    return colors[status] || 'grey'
  }

  return {
    actionLoading,
    cancelDialog,
    snackbar,
    startRental,
    completeRental,
    openCancelDialog,
    confirmCancel,
    getStatusColor,
  }
}
