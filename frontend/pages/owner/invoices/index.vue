<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Invoices"
      subtitle="Manage invoices and billing for rentals"
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

    <!-- Hidden Invoice Template for Printing -->
    <div style="position: absolute; left: -9999px; top: -9999px;">
      <div id="invoice-for-print">
        <InvoiceTemplate v-if="selectedInvoice" :invoice="selectedInvoice" :company-info="companyInfo" print-mode />
      </div>
    </div>

    <!-- View Invoice Dialog -->
    <InvoiceViewDialog
      v-model="showViewDialog"
      :invoice="selectedInvoice"
      :company-info="companyInfo"
      @download="downloadInvoice"
      @print="printInvoice"
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

const printInvoice = () => {
  // Use the hidden invoice template for printing
  const printContents = document.getElementById('invoice-for-print')
  if (!printContents || !selectedInvoice.value) {
    snackbar.value = {
      show: true,
      message: 'Invoice not available for printing',
      color: 'error',
      icon: 'mdi-alert-circle',
    }
    return
  }

  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    snackbar.value = {
      show: true,
      message: 'Failed to open print window',
      color: 'error',
      icon: 'mdi-alert-circle',
    }
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
        <title>Invoice - ${selectedInvoice.value.invoiceNumber}</title>
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
      snackbar.value = {
        show: true,
        message: 'Invoice sent to printer',
        color: 'success',
        icon: 'mdi-check-circle',
      }
    }, 500)
  }
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
</script>

