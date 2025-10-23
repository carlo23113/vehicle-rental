<template>
  <CommonPageContainer>
    <!-- Header with Breadcrumbs and Actions -->
    <CommonPageDetailPageHeader
      :title="`Payment #${payment.id}`"
      :subtitle="`${payment.customerName} • ${payment.vehicleName}`"
      :badge="payment.status"
      :badge-color="getStatusColor(payment.status)"
      show-breadcrumbs
      parent-label="Payments"
      parent-icon="mdi-credit-card-multiple"
      :actions="headerActions"
      @back="$router.push('/payments')"
      @action="handleAction"
    />

    <v-row>
      <!-- Left Column: Main Info -->
      <v-col cols="12" lg="8">
        <PaymentInfoCard
          :transaction-id="payment.transactionId"
          :amount="formatCurrency(payment.amount)"
          :method-icon="getMethodIcon(payment.paymentMethod)"
          :method-label="getMethodLabel(payment.paymentMethod)"
          :status="payment.status"
          :status-color="getStatusColor(payment.status)"
          :status-icon="getStatusIcon(payment.status)"
          :payment-date="payment.paymentDate ? formatDate(payment.paymentDate) : ''"
          :due-date="formatDate(payment.dueDate)"
          :description="payment.description"
          :notes="payment.notes"
          :refund-date="payment.refundDate ? formatDate(payment.refundDate) : ''"
          class="mb-6"
        />

        <PaymentRentalCard
          :rental-id="payment.rentalId"
          :customer-name="payment.customerName"
          :vehicle-name="payment.vehicleName"
          :license-plate="payment.licensePlate"
          class="mb-6"
          @view-rental="viewRental"
        />

        <CommonUiDetailCard
          v-if="payment.notes"
          title="Additional Notes"
          icon="mdi-note-text"
          class="mb-6"
        >
          <p class="text-body-2">{{ payment.notes }}</p>
        </CommonUiDetailCard>
      </v-col>

      <!-- Right Column: Actions and Timeline -->
      <v-col cols="12" lg="4">
        <PaymentActionsCard
          :status="payment.status"
          class="mb-6"
          @process="openProcessDialog(payment)"
          @refund="openRefundDialog(payment.amount)"
          @print="printReceipt"
          @email="openEmailDialog(payment.customerEmail)"
          @retry="openRetryDialog()"
        />

        <PaymentTimelineCard :timeline="timeline" />
      </v-col>
    </v-row>

    <!-- Process Payment Dialog -->
    <PaymentProcessDialog
      v-model="processDialog"
      v-model:transaction-id="transactionId"
      :amount="formatCurrency(payment.amount)"
      :loading="actionLoading"
      @confirm="confirmProcess"
    />

    <!-- Refund Dialog -->
    <PaymentRefundDialog
      v-model="refundDialog"
      v-model:refund-amount="refundAmount"
      v-model:reason="refundReason"
      :original-amount="formatCurrency(payment.amount)"
      :max-amount="payment.amount"
      :loading="actionLoading"
      @confirm="confirmRefund"
    />

    <!-- Email Dialog -->
    <PaymentEmailDialog
      v-model="emailDialog"
      v-model:email-address="emailAddress"
      v-model:include-details="includeDetails"
      :loading="actionLoading"
      @confirm="confirmEmail"
    />

    <!-- Retry Payment Dialog -->
    <CommonDialogDeleteConfirmation
      v-model="retryDialog"
      title="Retry Payment?"
      message="Are you sure you want to retry this payment? This will attempt to process the payment again."
      :loading="actionLoading"
      confirm-text="Retry Payment"
      confirm-color="error"
      @confirm="confirmRetry"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePayments } from '~/composables/usePayments'
import { usePaymentActions } from '~/composables/usePaymentActions'
import { printReceipt as printReceiptUtil } from '~/utils/receiptPrint'
import type { Payment } from '~/types/payment'

const route = useRoute()
const router = useRouter()

const {
  payments,
  processPayment,
  refundPayment,
  getStatusColor,
  getMethodIcon,
  getMethodLabel,
  formatDate,
  formatCurrency,
} = usePayments()

const {
  processDialog,
  refundDialog,
  emailDialog,
  retryDialog,
  actionLoading,
  snackbar,
  transactionId,
  refundAmount,
  refundReason,
  emailAddress,
  includeDetails,
  openProcessDialog,
  openRefundDialog,
  openEmailDialog,
  openRetryDialog,
  showSuccess,
  showError,
} = usePaymentActions()

// Find payment by ID
const paymentId = Number(route.params.id)
const payment = computed((): Payment => {
  return payments.value.find(p => p.id === paymentId) ?? payments.value[0]!
})

// Timeline data
const timeline = ref([
  {
    icon: 'mdi-calendar-plus',
    color: 'primary',
    title: 'Payment Created',
    subtitle: formatDate(payment.value.createdAt),
  },
  ...(payment.value.paymentDate
    ? [
        {
          icon: 'mdi-credit-card-check',
          color: 'success',
          title: 'Payment Completed',
          subtitle: formatDate(payment.value.paymentDate!),
        },
      ]
    : []),
  ...(payment.value.refundDate
    ? [
        {
          icon: 'mdi-keyboard-return',
          color: 'warning',
          title: 'Refund Issued',
          subtitle: `${formatCurrency(payment.value.refundAmount || 0)} - ${formatDate(payment.value.refundDate!)}`,
        },
      ]
    : []),
])

// Header actions
const headerActions = computed(() => {
  const actions = []

  if (payment.value.status === 'completed') {
    actions.push({
      key: 'print',
      label: 'Print Receipt',
      icon: 'mdi-printer',
      variant: 'outlined' as const,
      color: 'primary',
    })
  }

  return actions
})

const handleAction = (key: string) => {
  if (key === 'print') {
    printReceipt()
  }
}

// Action handlers
const confirmProcess = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    processPayment(payment.value.id, transactionId.value)
    showSuccess('Payment processed successfully')
    processDialog.value = false

    // Update timeline
    timeline.value.push({
      icon: 'mdi-credit-card-check',
      color: 'success',
      title: 'Payment Completed',
      subtitle: formatDate(new Date().toISOString().split('T')[0]!),
    })
  } catch (error) {
    showError('Failed to process payment')
  } finally {
    actionLoading.value = false
  }
}

const confirmRefund = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    refundPayment(payment.value.id, refundAmount.value)
    showSuccess(`Refund of ${formatCurrency(refundAmount.value)} issued successfully`)
    refundDialog.value = false

    // Update timeline
    timeline.value.push({
      icon: 'mdi-keyboard-return',
      color: 'warning',
      title: 'Refund Issued',
      subtitle: `${formatCurrency(refundAmount.value)} - ${formatDate(new Date().toISOString().split('T')[0]!)}`,
    })
  } catch (error) {
    showError('Failed to issue refund')
  } finally {
    actionLoading.value = false
  }
}

const printReceipt = () => {
  printReceiptUtil({
    payment: payment.value,
    formatCurrency,
    formatDate,
    getMethodLabel,
  })
  showSuccess('Receipt sent to printer')
}

const confirmEmail = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccess(`Receipt sent to ${emailAddress.value}`)
    emailDialog.value = false
  } catch (error) {
    showError('Failed to send email')
  } finally {
    actionLoading.value = false
  }
}

const confirmRetry = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccess('Payment retry initiated')
    retryDialog.value = false
  } catch (error) {
    showError('Failed to retry payment')
  } finally {
    actionLoading.value = false
  }
}

const viewRental = (rentalId: number) => {
  router.push(`/rentals/${rentalId}`)
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    completed: 'mdi-check-circle',
    pending: 'mdi-clock-outline',
    failed: 'mdi-alert-circle',
    refunded: 'mdi-keyboard-return',
  }
  return icons[status] || 'mdi-help-circle'
}
</script>
