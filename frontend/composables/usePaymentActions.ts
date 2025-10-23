import { ref } from 'vue'
import type { Payment } from '~/types/payment'

interface SnackbarState {
  show: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
  icon: string
}

export const usePaymentActions = () => {
  // Dialog states
  const processDialog = ref(false)
  const refundDialog = ref(false)
  const emailDialog = ref(false)
  const retryDialog = ref(false)
  const actionLoading = ref(false)
  const snackbar = ref<SnackbarState>({
    show: false,
    message: '',
    color: 'success',
    icon: 'mdi-check-circle',
  })

  // Form data
  const transactionId = ref('')
  const refundAmount = ref<number>(0)
  const refundReason = ref('')
  const emailAddress = ref('')
  const includeDetails = ref(true)

  // Action handlers
  const openProcessDialog = (payment: Payment) => {
    transactionId.value = `TXN-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`
    processDialog.value = true
  }

  const openRefundDialog = (amount: number) => {
    refundAmount.value = amount
    refundReason.value = ''
    refundDialog.value = true
  }

  const openEmailDialog = (customerEmail?: string) => {
    emailAddress.value = customerEmail || ''
    includeDetails.value = true
    emailDialog.value = true
  }

  const openRetryDialog = () => {
    retryDialog.value = true
  }

  const showSuccess = (message: string) => {
    snackbar.value = {
      show: true,
      message,
      color: 'success',
      icon: 'mdi-check-circle',
    }
  }

  const showError = (message: string) => {
    snackbar.value = {
      show: true,
      message,
      color: 'error',
      icon: 'mdi-alert-circle',
    }
  }

  return {
    // Dialog states
    processDialog,
    refundDialog,
    emailDialog,
    retryDialog,
    actionLoading,
    snackbar,

    // Form data
    transactionId,
    refundAmount,
    refundReason,
    emailAddress,
    includeDetails,

    // Actions
    openProcessDialog,
    openRefundDialog,
    openEmailDialog,
    openRetryDialog,
    showSuccess,
    showError,
  }
}
