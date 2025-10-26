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

    <!-- Generate Receipt Dialog -->
    <v-dialog v-model="showReceiptDialog" max-width="800px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-receipt-text-outline</v-icon>
            <span class="text-h6">Payment Receipt</span>
          </div>
          <div>
            <v-btn variant="text" @click="downloadReceipt" class="mr-2">
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn variant="text" @click="showReceiptDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6" id="receipt-preview">
          <ReceiptTemplate v-if="receiptData" :receipt="receiptData" />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showReceiptDialog = false"> Close </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-download"
            @click="downloadReceipt"
          >
            Download PDF
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePayments } from '~/composables/usePayments'
import { usePaymentActions } from '~/composables/usePaymentActions'
import { useInvoices } from '~/composables/useInvoices'
import { printReceipt as printReceiptUtil } from '~/utils/receiptPrint'
import { exportToPDF } from '~/utils/pdfExport'
import type { Payment } from '~/types/payment'
import type { Receipt } from '~/types/invoice'

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

const { createReceipt } = useInvoices()

// Find payment by ID
const paymentId = Number(route.params.id)
const payment = computed((): Payment => {
  return payments.value.find(p => p.id === paymentId) ?? payments.value[0]!
})

// Receipt generation
const showReceiptDialog = ref(false)
const receiptData = computed<Receipt | null>(() => {
  if (!payment.value || payment.value.status !== 'completed' || !payment.value.paymentDate) return null

  return {
    id: `R-${payment.value.id}`,
    receiptNumber: `REC-${String(payment.value.id).padStart(5, '0')}`,
    paymentId: payment.value.id.toString(),
    invoiceId: payment.value.rentalId.toString(),
    rentalId: payment.value.rentalId.toString(),
    customerId: '1', // Get from payment if available
    customerName: payment.value.customerName,
    customerEmail: payment.value.customerEmail || 'customer@example.com',
    paymentDate: payment.value.paymentDate,
    paymentMethod: payment.value.paymentMethod,
    paymentReference: payment.value.transactionId || '',
    amount: payment.value.amount,
    currency: 'USD',
    items: [
      {
        description: `Payment for ${payment.value.vehicleName} (${payment.value.licensePlate})`,
        amount: payment.value.amount,
      },
    ],
    notes: payment.value.notes,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin', // Current user
  }
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
    actions.push(
      {
        key: 'receipt',
        label: 'Generate Receipt',
        icon: 'mdi-receipt-text-outline',
        variant: 'outlined' as const,
        color: 'success',
      },
      {
        key: 'print',
        label: 'Print Receipt',
        icon: 'mdi-printer',
        variant: 'outlined' as const,
        color: 'primary',
      }
    )
  }

  return actions
})

const handleAction = (key: string) => {
  if (key === 'receipt') {
    showReceiptDialog.value = true
  } else if (key === 'print') {
    printReceipt()
  }
}

const downloadReceipt = () => {
  if (receiptData.value) {
    exportToPDF('receipt-preview', `receipt-${receiptData.value.receiptNumber}.pdf`)
    showSuccess('Receipt downloaded successfully')
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
