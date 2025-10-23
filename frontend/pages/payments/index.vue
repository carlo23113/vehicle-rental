<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Payments"
      subtitle="Manage payment transactions and billing"
      action-text="Record Payment"
      action-icon="mdi-plus"
      @action-click="$router.push('/payments/new')"
    />

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <PaymentFilters
          :filters="filters"
          :status-options="statusOptions"
          :method-options="methodOptions"
          :date-range-options="dateRangeOptions"
          @update:search="(val: string) => filters.search = val"
          @update:status="(val: any) => filters.status = val"
          @update:method="(val: any) => filters.method = val"
          @update:date-range="(val: string) => filters.dateRange = val"
        />
      </v-col>
    </v-row>

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

const handleRefund = (payment: any) => {
  if (confirm(`Are you sure you want to refund ${formatCurrency(payment.amount)} to ${payment.customerName}?`)) {
    refundPayment(payment.id, payment.amount)
    console.log('Refunded payment:', payment)
  }
}

const viewPayment = (payment: any) => {
  navigateTo(`/payments/${payment.id}`)
}

const printReceipt = (payment: any) => {
  printReceiptUtil({
    payment,
    formatCurrency,
    formatDate,
    getMethodLabel,
  })
}
</script>

