<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageDetailPageHeader
      title="Generate Invoice"
      subtitle="Create a new invoice for a customer or rental"
      show-breadcrumbs
      parent-label="Invoices"
      parent-icon="mdi-file-document-outline"
      @back="$router.push('/owner/invoices')"
    />

    <!-- Invoice Generator Form -->
    <CommonFormCard>
      <v-form ref="formRef">
        <!-- Customer Selection -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.customerName"
              label="Customer Name"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account"
              readonly
              hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.customerEmail"
              label="Customer Email"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email"
              readonly
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <!-- Dates -->
        <v-row class="mt-2">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.issueDate"
              label="Issue Date"
              type="date"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar"
              hide-details="auto"
              :rules="[v => !!v || 'Issue date is required']"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.dueDate"
              label="Due Date"
              type="date"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-alert"
              hide-details="auto"
              :rules="[v => !!v || 'Due date is required']"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="form.status"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-checkbox-marked-circle"
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <!-- Items Section -->
        <div class="items-section pa-6 rounded-lg">
          <div class="d-flex align-center justify-space-between mb-4">
            <h4 class="text-h6 font-weight-bold">Line Items</h4>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-plus"
              @click="addItem"
            >
              Add Item
            </v-btn>
          </div>

          <InvoiceItemCard
            v-for="(item, index) in form.items"
            :key="index"
            :item="item"
            :currency-symbol="getCurrencySymbol()"
            class="mb-4"
            @update="updateItemField(index, $event)"
            @remove="removeItem(index)"
          />

          <v-alert v-if="form.items.length === 0" type="info" variant="tonal" class="mt-4">
            No items added. Click "Add Item" to add line items to the invoice.
          </v-alert>
        </div>

        <v-divider class="my-6" />

        <!-- Discount & Tax -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.discountAmount"
              label="Discount Amount"
              type="number"
              variant="outlined"
              density="comfortable"
              :prefix="getCurrencySymbol()"
              hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.globalTaxRate"
              label="Global Tax Rate"
              type="number"
              variant="outlined"
              density="comfortable"
              suffix="%"
              hide-details="auto"
              hint="Applied to items without individual tax"
              persistent-hint
            />
          </v-col>
        </v-row>

        <!-- Totals Summary -->
        <InvoiceTotalsCard
          :subtotal="calculatedTotals.subtotal"
          :tax-amount="calculatedTotals.taxAmount"
          :discount-amount="form.discountAmount"
          :total-amount="calculatedTotals.totalAmount"
          class="mt-6"
        />

        <!-- Notes & Terms -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-textarea
              v-model="form.notes"
              label="Notes"
              variant="outlined"
              density="comfortable"
              rows="3"
              hint="Internal notes or message to customer"
              persistent-hint
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-textarea
              v-model="form.terms"
              label="Terms & Conditions"
              variant="outlined"
              density="comfortable"
              rows="3"
              hint="Payment terms and conditions"
              persistent-hint
            />
          </v-col>
        </v-row>

        <!-- Form Actions -->
        <CommonFormActions
          submit-text="Generate Invoice"
          submit-icon="mdi-file-document-check"
          submit-type="button"
          cancel-text="Cancel"
          :loading="loading"
          @submit="generateInvoice"
          @cancel="handleCancel"
        >
          <template #prepend>
            <v-btn
              variant="outlined"
              color="primary"
              size="large"
              prepend-icon="mdi-eye"
              :disabled="form.items.length === 0 || loading"
              @click="handlePreview"
            >
              Preview
            </v-btn>
          </template>
        </CommonFormActions>
      </v-form>
    </CommonFormCard>

    <!-- Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="900px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span class="text-h6">Invoice Preview</span>
          <v-btn icon="mdi-close" variant="text" @click="previewDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-0">
          <InvoiceTemplate
            v-if="previewInvoice"
            :invoice="previewInvoice"
            :company-info="companyInfo"
            :show-tax="true"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="previewDialog = false">Close</v-btn>
          <v-btn color="primary" variant="flat" @click="handleGenerateFromPreview">
            Generate Invoice
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
import type { Invoice, InvoiceItem } from '~/types/invoice'
import { INVOICE_STATUS_OPTIONS, DEFAULT_PAYMENT_TERMS, DEFAULT_TAX_RATE, DUE_DATE_DAYS } from '~/constants/invoice'
import { getTodayISO, addDays } from '~/utils/date'

interface InvoiceForm {
  customerName: string
  customerEmail: string
  issueDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid'
  items: InvoiceItem[]
  discountAmount: number
  globalTaxRate: number
  notes: string
  terms: string
}

definePageMeta({
  layout: 'default',
})

const { getCurrencySymbol } = useCurrency()
const { companyInfo } = useCompanyInfo()
const { calculateItemTotal, calculateInvoiceTotals, applyGlobalTaxRate } = useInvoiceCalculations()

// State
const formRef = ref()
const loading = ref(false)
const previewDialog = ref(false)
const previewInvoice = ref<Invoice | null>(null)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success' as 'success' | 'error',
  icon: 'mdi-check-circle',
})

const form = ref<InvoiceForm>({
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  issueDate: getTodayISO(),
  dueDate: addDays(DUE_DATE_DAYS),
  status: 'draft',
  items: [],
  discountAmount: 0,
  globalTaxRate: DEFAULT_TAX_RATE,
  notes: '',
  terms: DEFAULT_PAYMENT_TERMS,
})

const statusOptions = INVOICE_STATUS_OPTIONS

const calculatedTotals = computed(() =>
  calculateInvoiceTotals(form.value.items, form.value.discountAmount)
)

// Item operations
const addItem = () => {
  form.value.items.push({
    id: `item-${Date.now()}`,
    description: '',
    quantity: 1,
    unitPrice: 0,
    amount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
  })
}

const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
}

const updateItemField = (index: number, [field, value]: [keyof InvoiceItem, any]) => {
  const item = form.value.items[index]
  if (item) {
    ;(item as any)[field] = value
    calculateItemTotal(item)
  }
}

const buildInvoiceData = (): Invoice => {
  const invoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-${Date.now()}`,
    type: 'rental',
    status: form.value.status,
    paymentStatus: 'unpaid',
    customerId: '1',
    customerName: form.value.customerName,
    customerEmail: form.value.customerEmail,
    issueDate: form.value.issueDate,
    dueDate: form.value.dueDate,
    items: form.value.items,
    subtotal: calculatedTotals.value.subtotal,
    taxRate: form.value.globalTaxRate,
    taxAmount: calculatedTotals.value.taxAmount,
    discountAmount: form.value.discountAmount,
    totalAmount: calculatedTotals.value.totalAmount,
    amountPaid: 0,
    amountDue: calculatedTotals.value.totalAmount,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  }

  if (form.value.notes) {
    invoice.notes = form.value.notes
  }

  if (form.value.terms) {
    invoice.terms = form.value.terms
  }

  return invoice
}

// Handlers
const handleCancel = () => {
  navigateTo('/owner/invoices')
}

const generateInvoice = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  if (form.value.items.length === 0) {
    snackbar.value = {
      show: true,
      message: 'Please add at least one item to the invoice',
      color: 'error',
      icon: 'mdi-alert-circle',
    }
    return
  }

  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const invoiceData = buildInvoiceData()

    console.log('Saving invoice:', invoiceData)

    snackbar.value = {
      show: true,
      message: 'Invoice generated successfully!',
      color: 'success',
      icon: 'mdi-check-circle',
    }

    setTimeout(() => {
      navigateTo('/owner/invoices')
    }, 1500)
  } finally {
    loading.value = false
  }
}

const handlePreview = () => {
  previewInvoice.value = buildInvoiceData()
  previewDialog.value = true
}

const handleGenerateFromPreview = () => {
  if (previewInvoice.value) {
    previewDialog.value = false
    generateInvoice()
  }
}

// Check for query parameters to pre-populate
const route = useRoute()
const rentalId = route.query.rentalId as string | undefined

// Validate that rentalId is provided
if (!rentalId) {
  // Redirect to rentals page if no rental ID is provided
  navigateTo('/owner/rentals')
} else {
  // In a real app, you would fetch rental details from the API using the rentalId
  // For now, we'll just add a default item with the rental information
  addItem()
  if (form.value.items[0]) {
    form.value.items[0].description = `Vehicle Rental - Rental ID: ${rentalId}`
    form.value.items[0].quantity = 1
    form.value.items[0].unitPrice = 100 // This would come from the rental data
    calculateItemTotal(form.value.items[0])
  }

  // TODO: Fetch rental data and populate:
  // - form.value.customerName from rental.customer.name
  // - form.value.customerEmail from rental.customer.email
  // - Item description with vehicle details
  // - Item quantity (number of days)
  // - Item unitPrice (daily rate from rental)
}
</script>

<style scoped>
.items-section {
  background: transparent;
  border: 1px solid rgba(var(--v-border-color), 0.12);
}
</style>
