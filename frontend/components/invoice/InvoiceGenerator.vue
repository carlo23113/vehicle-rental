<template>
  <v-card elevation="0" class="invoice-generator-card">
    <v-card-title class="pa-4">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h3 class="text-h6 font-weight-bold">
            {{ isEdit ? 'Edit Invoice' : 'Generate Invoice' }}
          </h3>
          <p class="text-caption text-medium-emphasis mt-1">Create a new invoice for the rental</p>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="$emit('cancel')" />
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-6">
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
        <div class="items-section">
          <div class="d-flex align-center justify-space-between mb-4">
            <h4 class="text-subtitle-1 font-weight-bold">Line Items</h4>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-plus"
              size="small"
              @click="addItem"
            >
              Add Item
            </v-btn>
          </div>

          <div v-for="(item, index) in form.items" :key="index" class="item-row mb-4">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="item.description"
                  label="Description"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  :rules="[v => !!v || 'Description is required']"
                />
              </v-col>

              <v-col cols="6" md="2">
                <v-text-field
                  v-model.number="item.quantity"
                  label="Qty"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  :rules="[v => v > 0 || 'Must be > 0']"
                  @input="calculateItemTotal(item)"
                />
              </v-col>

              <v-col cols="6" md="2">
                <v-text-field
                  v-model.number="item.unitPrice"
                  label="Unit Price"
                  type="number"
                  variant="outlined"
                  density="compact"
                  prefix="$"
                  hide-details="auto"
                  :rules="[v => v >= 0 || 'Must be >= 0']"
                  @input="calculateItemTotal(item)"
                />
              </v-col>

              <v-col cols="6" md="2">
                <v-text-field
                  v-model.number="item.taxRate"
                  label="Tax %"
                  type="number"
                  variant="outlined"
                  density="compact"
                  suffix="%"
                  hide-details="auto"
                  @input="calculateItemTotal(item)"
                />
              </v-col>

              <v-col cols="6" md="2" class="d-flex align-center">
                <div class="flex-grow-1">
                  <p class="text-caption text-medium-emphasis mb-1">Total</p>
                  <p class="text-h6 font-weight-bold">{{ formatCurrency(item.total) }}</p>
                </div>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  size="small"
                  @click="removeItem(index)"
                />
              </v-col>
            </v-row>
          </div>

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
              prefix="$"
              hide-details="auto"
              @input="calculateTotals"
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
              @input="calculateTotals"
            />
          </v-col>
        </v-row>

        <!-- Totals Summary -->
        <v-card elevation="0" class="totals-card mt-6">
          <v-card-text>
            <div class="total-row">
              <span>Subtotal:</span>
              <span class="font-weight-bold">{{ formatCurrency(calculatedTotals.subtotal) }}</span>
            </div>
            <div v-if="form.discountAmount > 0" class="total-row text-success">
              <span>Discount:</span>
              <span class="font-weight-bold">-{{ formatCurrency(form.discountAmount) }}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span class="font-weight-bold">{{ formatCurrency(calculatedTotals.taxAmount) }}</span>
            </div>
            <v-divider class="my-2" />
            <div class="total-row grand-total">
              <span>Total:</span>
              <span class="font-weight-bold">{{
                formatCurrency(calculatedTotals.totalAmount)
              }}</span>
            </div>
          </v-card-text>
        </v-card>

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
      </v-form>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-6">
      <v-btn variant="text" @click="$emit('cancel')"> Cancel </v-btn>
      <v-spacer />
      <v-btn variant="outlined" color="primary" prepend-icon="mdi-eye" @click="previewInvoice">
        Preview
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-check"
        :loading="loading"
        @click="generateInvoice"
      >
        {{ isEdit ? 'Update Invoice' : 'Generate Invoice' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { InvoiceItem } from '~/types/invoice'
import { useCurrency } from '~/composables/useCurrency'

interface Customer {
  id: number | string
  name: string
  email: string
  phone?: string
  address?: string
}

interface Vehicle {
  id: number | string
  make: string
  model: string
  year: number
  licensePlate: string
}

interface Props {
  rentalId?: string
  customer?: Customer
  vehicle?: Vehicle
  customerId?: string
  customerName?: string
  customerEmail?: string
  existingInvoice?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cancel: []
  save: [invoice: any]
  generate: [invoice: any]
  preview: [invoice: any]
}>()

const { formatCurrency } = useCurrency()

const formRef = ref()
const loading = ref(false)

const isEdit = computed(() => !!props.existingInvoice)

const form = ref({
  customerName: props.customer?.name || props.customerName || '',
  customerEmail: props.customer?.email || props.customerEmail || '',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'draft' as const,
  items: [] as InvoiceItem[],
  discountAmount: 0,
  globalTaxRate: 8.5,
  notes: '',
  terms: 'Payment is due within 30 days. Late payments may incur additional fees.',
})

// Watch for customer prop changes
watch(
  () => props.customer,
  newCustomer => {
    if (newCustomer) {
      form.value.customerName = newCustomer.name
      form.value.customerEmail = newCustomer.email
    }
  },
  { immediate: true }
)

const statusOptions = [
  { title: 'Draft', value: 'draft' },
  { title: 'Sent', value: 'sent' },
  { title: 'Paid', value: 'paid' },
]

const calculatedTotals = computed(() => {
  const subtotal = form.value.items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = form.value.items.reduce((sum, item) => sum + (item.taxAmount || 0), 0)
  const totalAmount = subtotal + taxAmount - form.value.discountAmount

  return {
    subtotal,
    taxAmount,
    totalAmount,
  }
})

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
  calculateTotals()
}

const calculateItemTotal = (item: InvoiceItem) => {
  item.amount = item.quantity * item.unitPrice
  item.taxAmount = item.taxRate ? (item.amount * item.taxRate) / 100 : 0
  item.total = item.amount + item.taxAmount
  calculateTotals()
}

const calculateTotals = () => {
  // Recalculate all items
  form.value.items.forEach(item => {
    if (!item.taxRate) {
      item.taxRate = form.value.globalTaxRate
    }
    calculateItemTotal(item)
  })
}

const previewInvoice = () => {
  const invoiceData = buildInvoiceData()
  emit('preview', invoiceData)
}

const generateInvoice = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  if (form.value.items.length === 0) {
    alert('Please add at least one item to the invoice')
    return
  }

  loading.value = true

  try {
    const invoiceData = buildInvoiceData()
    emit('save', invoiceData)
    emit('generate', invoiceData)
  } finally {
    loading.value = false
  }
}

const buildInvoiceData = () => {
  return {
    ...form.value,
    rentalId: props.rentalId,
    customerId: props.customer?.id || props.customerId,
    customerName: form.value.customerName,
    customerEmail: form.value.customerEmail,
    vehicleInfo: props.vehicle
      ? `${props.vehicle.make} ${props.vehicle.model} (${props.vehicle.year})`
      : undefined,
    vehiclePlate: props.vehicle?.licensePlate,
    subtotal: calculatedTotals.value.subtotal,
    taxAmount: calculatedTotals.value.taxAmount,
    totalAmount: calculatedTotals.value.totalAmount,
    amountPaid: 0,
    amountDue: calculatedTotals.value.totalAmount,
  }
}

// Initialize with a rental item if it's a rental invoice
if (props.rentalId && props.vehicle) {
  addItem()
  form.value.items[0].description = `Vehicle Rental - ${props.vehicle.make} ${props.vehicle.model} (${props.vehicle.licensePlate})`
} else if (props.rentalId) {
  addItem()
  form.value.items[0].description = `Vehicle Rental - Rental ID: ${props.rentalId}`
}
</script>

<style scoped>
.invoice-generator-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
}

.items-section {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 20px;
  border-radius: 12px;
}

.item-row {
  background: rgb(var(--v-theme-surface));
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

.totals-card {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05),
    rgba(var(--v-theme-secondary), 0.05)
  );
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  border-radius: 12px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.total-row.grand-total {
  font-size: 20px;
  color: rgb(var(--v-theme-primary));
  padding-top: 8px;
}
</style>
