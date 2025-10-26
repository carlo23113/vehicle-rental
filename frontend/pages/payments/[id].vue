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

    <!-- Hidden Templates for Printing -->
    <div style="position: absolute; left: -9999px; top: -9999px;">
      <div id="receipt-for-print">
        <ReceiptTemplate v-if="receiptData" :receipt="receiptData" print-mode />
      </div>
      <div id="invoice-for-print">
        <InvoiceTemplate v-if="invoiceData" :invoice="invoiceData" :company-info="companyInfo" print-mode />
      </div>
    </div>

    <!-- View Invoice Dialog -->
    <InvoiceViewDialog
      v-model="showInvoiceDialog"
      :invoice="invoiceData"
      :company-info="companyInfo"
      @download="downloadInvoice"
      @print="printInvoice"
      @send="sendInvoice"
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
import { exportToPDF } from '~/utils/pdfExport'
import { DEFAULT_COMPANY_INFO } from '~/types/invoice'
import type { Payment } from '~/types/payment'
import type { Receipt, Invoice } from '~/types/invoice'

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

// Company info
const companyInfo = DEFAULT_COMPANY_INFO

// Invoice dialog
const showInvoiceDialog = ref(false)
const invoiceData = computed<Invoice | null>(() => {
  if (!payment.value || !payment.value.rentalId) return null

  // In a real app, you would fetch the actual invoice data
  // For now, create a mock invoice based on payment data
  return {
    id: payment.value.rentalId.toString(),
    invoiceNumber: `INV-${String(payment.value.rentalId).padStart(5, '0')}`,
    type: 'rental',
    status: payment.value.status === 'completed' ? 'paid' : 'sent',
    paymentStatus: payment.value.status === 'completed' ? 'paid' : 'unpaid',
    customerId: '1',
    customerName: payment.value.customerName,
    customerEmail: payment.value.customerEmail || 'customer@example.com',
    rentalId: payment.value.rentalId.toString(),
    issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    dueDate: payment.value.dueDate,
    items: [
      {
        id: '1',
        description: `Vehicle Rental - ${payment.value.vehicleName} (${payment.value.licensePlate})`,
        quantity: 1,
        unitPrice: payment.value.amount,
        amount: payment.value.amount,
        taxRate: 0,
        taxAmount: 0,
        total: payment.value.amount,
      },
    ],
    subtotal: payment.value.amount,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: payment.value.amount,
    amountPaid: payment.value.status === 'completed' ? payment.value.amount : 0,
    amountDue: payment.value.status === 'completed' ? 0 : payment.value.amount,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  }
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

  // Always show View Invoice button if payment has an associated rental/invoice
  if (payment.value.rentalId) {
    actions.push({
      key: 'invoice',
      label: 'View Invoice',
      icon: 'mdi-file-document-outline',
      variant: 'outlined' as const,
      color: 'info',
    })
  }

  if (payment.value.status === 'completed') {
    actions.push(
      {
        key: 'receipt',
        label: 'View Receipt',
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
  if (key === 'invoice') {
    viewInvoice()
  } else if (key === 'receipt') {
    showReceiptDialog.value = true
  } else if (key === 'print') {
    printReceipt()
  }
}

const viewInvoice = () => {
  showInvoiceDialog.value = true
}

const downloadInvoice = (invoice: Invoice) => {
  exportToPDF('invoice-preview', `invoice-${invoice.invoiceNumber}.pdf`)
  showSuccess('Invoice downloaded successfully')
}

const printInvoice = () => {
  // Use the hidden invoice template for printing
  const printContents = document.getElementById('invoice-for-print')
  if (!printContents || !invoiceData.value) {
    showError('Invoice not available for printing')
    return
  }

  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    showError('Failed to open print window')
    return
  }

  // Get all stylesheets from the current document
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        console.warn('Could not access stylesheet:', e)
        return ''
      }
    })
    .join('\n')

  // Clone the invoice template
  const clonedContent = printContents.cloneNode(true) as HTMLElement

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${invoiceData.value.invoiceNumber}</title>
        <meta charset="utf-8">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css" rel="stylesheet">
        <style>
          ${styles}

          /* Additional print styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            padding: 20px;
            background: white;
          }
          .v-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${clonedContent.innerHTML}
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
      showSuccess('Invoice sent to printer')
    }, 500)
  }
}

const sendInvoice = async (invoice: Invoice) => {
  // In a real app, this would send the invoice via email
  showSuccess(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customerEmail}`)
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
  // Use the hidden receipt template for printing
  const printContents = document.getElementById('receipt-for-print')
  if (!printContents || !receiptData.value) {
    showError('Receipt not available for printing')
    return
  }

  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    showError('Failed to open print window')
    return
  }

  // Get all stylesheets from the current document
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        console.warn('Could not access stylesheet:', e)
        return ''
      }
    })
    .join('\n')

  // Clone the receipt template
  const clonedContent = printContents.cloneNode(true) as HTMLElement

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Receipt - ${receiptData.value.receiptNumber}</title>
        <meta charset="utf-8">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css" rel="stylesheet">
        <style>
          ${styles}

          /* Additional print styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            padding: 20px;
            background: white;
          }
          .v-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          @media print {
            body {
              padding: 0;
            }
            .receipt-container {
              border: none !important;
            }
          }
        </style>
      </head>
      <body>
        ${clonedContent.innerHTML}
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
      showSuccess('Receipt sent to printer')
    }, 500)
  }
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
