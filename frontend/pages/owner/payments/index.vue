<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Payments"
      subtitle="Manage payment transactions and billing"
      action-text="Record Payment"
      action-icon="mdi-plus"
      @action-click="$router.push('/owner/payments/new')"
    />

    <!-- Filters -->
    <CommonFilterSection v-model="showFilters" :filters="filters" @clear="clearFilters">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="filters.search"
            variant="outlined"
            density="comfortable"
            placeholder="Search by customer or transaction..."
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="4" md="2">
          <v-select
            v-model="filters.status"
            :items="statusOptions"
            variant="outlined"
            density="comfortable"
            label="Status"
            prepend-inner-icon="mdi-check-circle"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="4" md="2">
          <v-select
            v-model="filters.method"
            :items="methodOptions"
            variant="outlined"
            density="comfortable"
            label="Method"
            prepend-inner-icon="mdi-credit-card"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="4" md="2">
          <v-select
            v-model="filters.dateRange"
            :items="dateRangeOptions"
            variant="outlined"
            density="comfortable"
            label="Date Range"
            prepend-inner-icon="mdi-calendar-range"
            clearable
          />
        </v-col>
      </v-row>
    </CommonFilterSection>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" lg="3">
        <CommonUiStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <!-- Payments Table -->
    <v-row>
      <v-col cols="12">
        <PaymentsTable
          :payments="filteredPayments"
          :format-date="formatDate"
          :format-currency="formatCurrency"
          :get-status-color="getStatusColor"
          :get-method-icon="getMethodIcon"
          :get-method-label="getMethodLabel"
          @process="handleProcess"
          @refund="handleRefund"
          @view="viewPayment"
          @print="printReceipt"
        />
      </v-col>
    </v-row>

    <!-- Process Payment Dialog -->
    <PaymentProcessDialog
      v-model="processDialog"
      v-model:transaction-id="transactionId"
      :amount="currentPayment ? formatCurrency(currentPayment.amount) : ''"
      :loading="actionLoading"
      @confirm="confirmProcess"
    />

    <!-- Refund Payment Dialog -->
    <PaymentRefundDialog
      v-model="refundDialog"
      v-model:refund-amount="refundAmount"
      v-model:reason="refundReason"
      :original-amount="currentPayment ? formatCurrency(currentPayment.amount) : formatCurrency(0)"
      :max-amount="currentPayment?.amount || 0"
      :loading="actionLoading"
      @confirm="confirmRefund"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePayments } from '~/composables/usePayments'
import { usePaymentActions } from '~/composables/usePaymentActions'
import { printReceipt as printReceiptUtil } from '~/utils/receiptPrint'
import type { Payment } from '~/types/payment'

const {
  payments,
  filters,
  filteredPayments,
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
  actionLoading,
  snackbar,
  transactionId,
  openProcessDialog,
  showSuccess,
  showError,
} = usePaymentActions()

// Filter state
const showFilters = ref(false)

// Refund dialog state
const refundDialog = ref(false)
const refundAmount = ref(0)
const refundReason = ref('')

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Pending', value: 'pending' },
  { title: 'Completed', value: 'completed' },
  { title: 'Failed', value: 'failed' },
  { title: 'Refunded', value: 'refunded' },
]

const methodOptions = [
  { title: 'All Methods', value: 'all' },
  { title: 'Credit Card', value: 'credit-card' },
  { title: 'Debit Card', value: 'debit-card' },
  { title: 'Cash', value: 'cash' },
  { title: 'Bank Transfer', value: 'bank-transfer' },
  { title: 'Other', value: 'other' },
]

const dateRangeOptions = [
  { title: 'All Time', value: 'all' },
  { title: 'Today', value: 'today' },
  { title: 'This Week', value: 'week' },
  { title: 'This Month', value: 'month' },
  { title: 'This Year', value: 'year' },
]

// Statistics
const stats = computed(() => {
  const completedTotal = payments.value
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
  const pendingTotal = payments.value
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)
  const failedCount = payments.value.filter(p => p.status === 'failed').length
  const refundedTotal = payments.value
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + (p.refundAmount || 0), 0)

  return [
    {
      icon: 'mdi-check-circle',
      label: 'Completed',
      value: formatCurrency(completedTotal),
      color: 'success'
    },
    {
      icon: 'mdi-clock-outline',
      label: 'Pending',
      value: formatCurrency(pendingTotal),
      color: 'warning'
    },
    {
      icon: 'mdi-alert-circle',
      label: 'Failed',
      value: failedCount,
      color: 'error'
    },
    {
      icon: 'mdi-keyboard-return',
      label: 'Refunded',
      value: formatCurrency(refundedTotal),
      color: 'info'
    }
  ]
})

const currentPayment = ref<Payment | null>(null)

const handleProcess = (payment: Payment) => {
  currentPayment.value = payment
  openProcessDialog(payment)
}

const confirmProcess = async () => {
  if (!currentPayment.value) return

  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    processPayment(currentPayment.value.id, transactionId.value)
    showSuccess('Payment processed successfully')
    processDialog.value = false
  } catch (error) {
    showError('Failed to process payment')
  } finally {
    actionLoading.value = false
  }
}

const handleRefund = (payment: Payment) => {
  currentPayment.value = payment
  refundAmount.value = payment.amount
  refundReason.value = ''
  refundDialog.value = true
}

const confirmRefund = async () => {
  if (!currentPayment.value) return

  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    refundPayment(currentPayment.value.id, refundAmount.value)
    showSuccess(`Successfully refunded ${formatCurrency(refundAmount.value)} to ${currentPayment.value.customerName}`)
    refundDialog.value = false
    refundAmount.value = 0
    refundReason.value = ''
  } catch (error) {
    showError('Failed to process refund')
  } finally {
    actionLoading.value = false
  }
}

const viewPayment = (payment: any) => {
  navigateTo(`/owner/payments/${payment.id}`)
}

const printReceipt = (payment: any) => {
  printReceiptUtil({
    payment,
    formatCurrency,
    formatDate,
    getMethodLabel,
  })
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: 'all',
    method: 'all',
    dateRange: 'all',
  }
}
</script>

