<template>
  <CommonPageLayout
    title="Payments"
    subtitle="Manage payment transactions and billing"
    action-text="Record Payment"
    action-icon="mdi-plus"
    @action-click="handleAddPayment"
  >
    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyPaymentsFilters
        v-if="isFilterVisible || sections.stats"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <LazyPaymentsStatsCards :stats="stats" />
    </template>

    <!-- Main Content Slot -->
    <template #content>
      <LazyPaymentsTableSection
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
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <PaymentProcessDialog
        v-model="processDialog"
        v-model:transaction-id="transactionId"
        :amount="currentPayment ? formatCurrency(currentPayment.amount) : ''"
        :loading="actionLoading"
        @confirm="confirmProcess"
      />

      <PaymentRefundDialog
        v-model="refundDialog"
        v-model:refund-amount="refundAmount"
        v-model:reason="refundReason"
        :original-amount="currentPayment ? formatCurrency(currentPayment.amount) : formatCurrency(0)"
        :max-amount="currentPayment?.amount || 0"
        :loading="actionLoading"
        @confirm="confirmRefund"
      />
    </template>

    <!-- Snackbar Slot -->
    <template #snackbar>
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageLayout>
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

// Progressive table loading (DRY - reusing composable)
const {
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

