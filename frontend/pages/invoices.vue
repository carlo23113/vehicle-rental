<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Invoices & Receipts"
      subtitle="Manage invoices, receipts, and billing"
      action-text="Create Invoice"
      action-icon="mdi-plus"
      @action-click="showCreateDialog = true"
    />

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in statsCards" :key="stat.label" cols="12" sm="6" lg="3">
        <CommonUiStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <InvoiceFilters
      v-model="showFilters"
      :filters="filters"
      :date-range="dateRange"
      @clear="clearFilters"
      @update:date-range="dateRange = $event"
    />

    <v-row>
      <v-col cols="12">
        <InvoicesTable
          :invoices="mockInvoices"
          @view="viewInvoice"
          @download="downloadInvoice"
          @send="sendInvoice"
          @mark-paid="markAsPaidDialog"
        />
      </v-col>
    </v-row>

    <!-- Create Invoice Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="1000" scrollable>
      <InvoiceGenerator
        customer-name="John Doe"
        customer-email="john@example.com"
        @cancel="showCreateDialog = false"
        @generate="handleGenerateInvoice"
        @preview="handlePreviewInvoice"
      />
    </v-dialog>

    <!-- View Invoice Dialog -->
    <InvoiceViewDialog
      v-model="showViewDialog"
      :invoice="selectedInvoice"
      :company-info="companyInfo"
      @download="downloadInvoice"
      @send="sendInvoice"
    />

    <!-- Mark as Paid Dialog -->
    <MarkAsPaidDialog
      v-model="showMarkPaidDialog"
      :invoice="selectedInvoice"
      :payment-methods="paymentMethods"
      @confirm="confirmMarkAsPaid"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInvoices } from '~/composables/useInvoices'
import { useInvoiceStats } from '~/composables/useInvoiceStats'
import { DEFAULT_COMPANY_INFO } from '~/types/invoice'
import { exportToPDF } from '~/utils/pdfExport'
import type { Invoice } from '~/types/invoice'

definePageMeta({
  layout: 'default',
})

const { filters } = useInvoices()

const showFilters = ref(false)
const showCreateDialog = ref(false)
const showViewDialog = ref(false)
const showMarkPaidDialog = ref(false)
const selectedInvoice = ref<Invoice | null>(null)
const dateRange = ref('all')
const companyInfo = DEFAULT_COMPANY_INFO

const snackbar = ref<{
  show: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
  icon: string
}>({
  show: false,
  message: '',
  color: 'success',
  icon: '',
})

const clearFilters = () => {
  filters.value.status = 'all'
  filters.value.paymentStatus = 'all'
  filters.value.search = ''
  filters.value.dateFrom = ''
  filters.value.dateTo = ''
}

// Mock data
const mockInvoices = ref<Invoice[]>([
  {
    id: '1',
    invoiceNumber: 'INV-00001',
    type: 'rental',
    status: 'sent',
    paymentStatus: 'unpaid',
    customerId: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    rentalId: 'R-001',
    issueDate: '2025-01-15',
    dueDate: '2025-02-14',
    items: [
      {
        id: '1',
        description: 'Vehicle Rental - Toyota Camry (5 days)',
        quantity: 5,
        unitPrice: 45,
        amount: 225,
        taxRate: 8.5,
        taxAmount: 19.13,
        total: 244.13,
      },
    ],
    subtotal: 225,
    taxRate: 8.5,
    taxAmount: 19.13,
    discountAmount: 0,
    totalAmount: 244.13,
    amountPaid: 0,
    amountDue: 244.13,
    createdAt: '2025-01-15T10:00:00Z',
    createdBy: 'Admin',
  },
])

const { statsCards } = useInvoiceStats(mockInvoices)

const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Check', 'Other']

const viewInvoice = (invoice: any) => {
  selectedInvoice.value = invoice
  showViewDialog.value = true
}

const downloadInvoice = (invoice: any) => {
  exportToPDF('invoice-preview', `invoice-${invoice.invoiceNumber}.pdf`)
}

const sendInvoice = (invoice: any) => {
  snackbar.value = {
    show: true,
    message: `Invoice ${invoice.invoiceNumber} sent to ${invoice.customerEmail}`,
    color: 'success',
    icon: 'mdi-check-circle',
  }
}

const markAsPaidDialog = (invoice: any) => {
  selectedInvoice.value = invoice
  showMarkPaidDialog.value = true
}

const confirmMarkAsPaid = (data: { paymentMethod: string; paymentReference: string; amountPaid: number }) => {
  if (selectedInvoice.value) {
    // Update invoice status
    selectedInvoice.value.status = 'paid'
    selectedInvoice.value.paymentStatus = 'paid'
    selectedInvoice.value.amountPaid = data.amountPaid
    selectedInvoice.value.amountDue = 0

    snackbar.value = {
      show: true,
      message: `Invoice ${selectedInvoice.value.invoiceNumber} marked as paid`,
      color: 'success',
      icon: 'mdi-check-circle',
    }
  }
}

const handleGenerateInvoice = (invoiceData: any) => {
  console.log('Generate invoice:', invoiceData)
  showCreateDialog.value = false
  snackbar.value = {
    show: true,
    message: 'Invoice created successfully',
    color: 'success',
    icon: 'mdi-check-circle',
  }
}

const handlePreviewInvoice = (invoiceData: any) => {
  console.log('Preview invoice:', invoiceData)
}
</script>

