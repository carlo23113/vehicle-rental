<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Payments"
      subtitle="Manage payment transactions and billing"
      action-text="Record Payment"
      action-icon="mdi-plus"
      @action-click="handleAddPayment"
    />

    <!-- Filters -->
    <LazyPaymentsFilters
      v-if="showFilters || sectionsLoaded.stats"
      v-model="showFilters"
      v-model:filters="filters"
      @clear="clearFilters"
    />

    <!-- Statistics Cards -->
    <div ref="statsSection">
      <LazyPaymentsStatsCards v-if="sectionsLoaded.stats" :stats="stats" />
      <LazyPaymentsStatsSkeleton v-else />
    </div>

    <!-- Payments Table -->
    <div ref="tableSection">
      <LazyPaymentsTableSection
        v-if="sectionsLoaded.table"
        :displayed-items="displayedItems"
        :is-loading-more="isLoadingMore"
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
      <LazyPaymentsTableSkeleton v-else />
    </div>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePayments } from '~/composables/usePayments'
import { usePaymentActions } from '~/composables/usePaymentActions'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'
import { usePaymentStats } from '~/composables/usePaymentStats'
import { printReceipt as printReceiptUtil } from '~/utils/receiptPrint'
import type { Payment } from '~/types/payment'

const router = useRouter()

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

// Progressive table loading with intersection observer
const {
  statsSection,
  tableSection,
  sectionsLoaded,
  displayedItems,
  isLoadingMore,
  updateDisplayedItems
} = useProgressiveTable(filteredPayments, { batchSize: 20 })

// Debounced filters
useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems
})

// Single-pass stats calculation
const { stats } = usePaymentStats(payments, formatCurrency)

// DRY navigation helper
const handleAddPayment = () => router.push('/owner/payments/new')

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

