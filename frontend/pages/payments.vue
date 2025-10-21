<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Payments"
      subtitle="Manage payment transactions and billing"
      action-text="Record Payment"
      action-icon="mdi-plus"
      @action-click="showAddDialog = true"
    />

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card pa-4">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.search"
                variant="outlined"
                density="comfortable"
                placeholder="Search by customer, vehicle, or transaction ID..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                variant="outlined"
                density="comfortable"
                label="Status"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="filters.method"
                :items="methodOptions"
                variant="outlined"
                density="comfortable"
                label="Payment Method"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="2">
              <v-select
                v-model="filters.dateRange"
                :items="dateRangeOptions"
                variant="outlined"
                density="comfortable"
                label="Date Range"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-success mr-4">
              <v-icon icon="mdi-check-circle" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Completed</p>
              <h3 class="text-h4 font-weight-bold">
                {{ formatCurrency(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)) }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-warning mr-4">
              <v-icon icon="mdi-clock-outline" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Pending</p>
              <h3 class="text-h4 font-weight-bold">
                {{ formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)) }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-error mr-4">
              <v-icon icon="mdi-alert-circle" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Failed</p>
              <h3 class="text-h4 font-weight-bold">
                {{ payments.filter(p => p.status === 'failed').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-info mr-4">
              <v-icon icon="mdi-keyboard-return" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Refunded</p>
              <h3 class="text-h4 font-weight-bold">
                {{ formatCurrency(payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0)) }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payments Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="filteredPayments"
              :items-per-page="10"
              class="payments-table"
            >
              <template #item.customer="{ item }">
                <div class="d-flex align-center py-3">
                  <v-avatar color="primary" size="40" class="mr-3">
                    <span class="text-subtitle-2 font-weight-bold">
                      {{ getInitials(item.customerName) }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ item.customerName }}</div>
                    <div class="text-caption text-medium-emphasis">ID: #{{ item.rentalId }}</div>
                  </div>
                </div>
              </template>

              <template #item.vehicle="{ item }">
                <div>
                  <div class="font-weight-medium">{{ item.vehicleName }}</div>
                  <v-chip size="x-small" variant="outlined" class="mt-1">
                    {{ item.licensePlate }}
                  </v-chip>
                </div>
              </template>

              <template #item.amount="{ item }">
                <div>
                  <div class="font-weight-bold text-h6">{{ formatCurrency(item.amount) }}</div>
                  <div v-if="item.transactionId" class="text-caption text-medium-emphasis mt-1">
                    {{ item.transactionId }}
                  </div>
                </div>
              </template>

              <template #item.method="{ item }">
                <div class="d-flex align-center ga-2">
                  <v-icon :icon="getMethodIcon(item.paymentMethod)" size="20"></v-icon>
                  <span class="text-body-2">{{ getMethodLabel(item.paymentMethod) }}</span>
                </div>
              </template>

              <template #item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.date="{ item }">
                <div>
                  <div v-if="item.paymentDate" class="text-body-2">
                    Paid: {{ formatDate(item.paymentDate) }}
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Due: {{ formatDate(item.dueDate) }}
                  </div>
                  <div v-if="item.refundDate" class="text-caption text-info mt-1">
                    Refunded: {{ formatDate(item.refundDate) }}
                  </div>
                </div>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex ga-1">
                  <v-btn
                    v-if="item.status === 'pending'"
                    icon="mdi-credit-card-check"
                    size="small"
                    variant="text"
                    color="success"
                    @click="handleProcess(item)"
                  >
                    <v-icon>mdi-credit-card-check</v-icon>
                    <v-tooltip activator="parent" location="top">Process Payment</v-tooltip>
                  </v-btn>
                  <v-btn
                    v-if="item.status === 'completed'"
                    icon="mdi-keyboard-return"
                    size="small"
                    variant="text"
                    color="warning"
                    @click="handleRefund(item)"
                  >
                    <v-icon>mdi-keyboard-return</v-icon>
                    <v-tooltip activator="parent" location="top">Refund</v-tooltip>
                  </v-btn>
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="viewPayment(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                    <v-tooltip activator="parent" location="top">View Details</v-tooltip>
                  </v-btn>
                  <v-btn
                    icon="mdi-printer"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="printReceipt(item)"
                  >
                    <v-icon>mdi-printer</v-icon>
                    <v-tooltip activator="parent" location="top">Print Receipt</v-tooltip>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Record Payment Dialog -->
    <v-dialog v-model="showAddDialog" max-width="800">
      <v-card>
        <v-card-title class="pa-6">
          <h2 class="text-h5 font-weight-bold">Record Payment</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-form>
            <h3 class="text-h6 font-weight-bold mb-4">Payment Information</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  label="Select Rental"
                  variant="outlined"
                  density="comfortable"
                  :items="[]"
                  placeholder="Choose rental to pay for"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Amount"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  prefix="$"
                  placeholder="0.00"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="methodOptions.filter(m => m.value !== 'all')"
                  label="Payment Method"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="statusOptions.filter(s => s.value !== 'all')"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Payment Date"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Transaction ID"
                  variant="outlined"
                  density="comfortable"
                  placeholder="TXN-2025-XXXXXX"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Description"
                  variant="outlined"
                  density="comfortable"
                  rows="2"
                  placeholder="Payment description..."
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Notes"
                  variant="outlined"
                  density="comfortable"
                  rows="2"
                  placeholder="Additional notes (optional)..."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="showAddDialog = false">
            Record Payment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePayments } from '~/composables/usePayments'

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

const showAddDialog = ref(false)

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Method', key: 'method', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

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

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const handleProcess = (payment: any) => {
  const transactionId = `TXN-2025-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`
  processPayment(payment.id, transactionId)
  console.log('Processed payment:', payment)
}

const handleRefund = (payment: any) => {
  if (confirm(`Are you sure you want to refund ${formatCurrency(payment.amount)} to ${payment.customerName}?`)) {
    refundPayment(payment.id, payment.amount)
    console.log('Refunded payment:', payment)
  }
}

const viewPayment = (payment: any) => {
  console.log('View payment:', payment)
  // TODO: Implement view details modal
}

const printReceipt = (payment: any) => {
  console.log('Print receipt:', payment)
  // TODO: Implement receipt printing
}
</script>

<style scoped>
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.stat-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.2);
}

.payments-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.payments-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}
</style>
