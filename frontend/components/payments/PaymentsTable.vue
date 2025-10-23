<template>
  <CommonUiDataTable
    :headers="headers"
    :items="payments"
    :items-per-page="10"
    table-class="payments-table"
    empty-icon="mdi-cash-remove"
    empty-title="No payments found"
    empty-message="Try adjusting your filters or record a new payment"
  >
    <template #item.customer="{ item }">
      <div class="flex items-center py-3">
        <v-avatar color="primary" size="40" class="customer-avatar">
          <span class="text-subtitle-2 font-bold">
            {{ getInitials(item.customerName) }}
          </span>
        </v-avatar>
        <div class="ml-3">
          <div class="font-bold text-base">{{ item.customerName }}</div>
          <div class="text-xs text-medium-emphasis">Rental #{{ item.rentalId }}</div>
        </div>
      </div>
    </template>

    <template #item.vehicle="{ item }">
      <div>
        <div class="font-semibold text-body-2">{{ item.vehicleName }}</div>
        <v-chip size="x-small" variant="outlined" class="mt-1 license-chip">
          {{ item.licensePlate }}
        </v-chip>
      </div>
    </template>

    <template #item.amount="{ item }">
      <div class="amount-display">
        <div class="text-lg font-bold">{{ formatCurrency(item.amount) }}</div>
        <div v-if="item.transactionId" class="text-xs text-medium-emphasis">
          {{ item.transactionId }}
        </div>
      </div>
    </template>

    <template #item.method="{ item }">
      <div class="flex items-center gap-2">
        <v-icon :icon="getMethodIcon(item.paymentMethod)" size="20" />
        <span class="text-body-2">{{ getMethodLabel(item.paymentMethod) }}</span>
      </div>
    </template>

    <template #item.status="{ item }">
      <v-chip
        :color="getStatusColor(item.status)"
        size="small"
        variant="flat"
        class="status-chip"
      >
        <v-icon :icon="getStatusIcon(item.status)" start size="14" />
        {{ item.status }}
      </v-chip>
    </template>

    <template #item.date="{ item }">
      <div>
        <div v-if="item.paymentDate" class="text-body-2 font-medium">
          {{ formatDate(item.paymentDate) }}
        </div>
        <div class="text-xs text-medium-emphasis mt-1">
          Due: {{ formatDate(item.dueDate) }}
        </div>
        <v-chip v-if="item.refundDate" size="x-small" variant="tonal" color="info" class="mt-1">
          <v-icon icon="mdi-keyboard-return" start size="12" />
          {{ formatDate(item.refundDate) }}
        </v-chip>
      </div>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-2" @click.stop>
        <v-btn
          v-if="item.status === 'pending'"
          icon="mdi-credit-card-check"
          size="small"
          variant="tonal"
          color="success"
          class="action-btn"
          @click="$emit('process', item)"
        >
          <v-icon>mdi-credit-card-check</v-icon>
          <v-tooltip activator="parent" location="top">Process Payment</v-tooltip>
        </v-btn>
        <v-btn
          v-if="item.status === 'completed'"
          icon="mdi-keyboard-return"
          size="small"
          variant="tonal"
          color="warning"
          class="action-btn"
          @click="$emit('refund', item)"
        >
          <v-icon>mdi-keyboard-return</v-icon>
          <v-tooltip activator="parent" location="top">Refund</v-tooltip>
        </v-btn>
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="tonal"
          color="info"
          class="action-btn"
          @click="$emit('view', item)"
        >
          <v-icon>mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top">View Details</v-tooltip>
        </v-btn>
        <v-btn
          icon="mdi-printer"
          size="small"
          variant="tonal"
          color="primary"
          class="action-btn"
          @click="$emit('print', item)"
        >
          <v-icon>mdi-printer</v-icon>
          <v-tooltip activator="parent" location="top">Print Receipt</v-tooltip>
        </v-btn>
      </div>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
defineProps<{
  payments: any[]
  formatDate: (date: string) => string
  formatCurrency: (amount: number) => string
  getStatusColor: (status: string) => string
  getMethodIcon: (method: string) => string
  getMethodLabel: (method: string) => string
}>()

defineEmits<{
  process: [payment: any]
  refund: [payment: any]
  view: [payment: any]
  print: [payment: any]
}>()

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Method', key: 'method', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
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

<style scoped>
.payments-table :deep(tbody tr:hover) .customer-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.customer-avatar {
  transition: all 0.3s ease;
}

.license-chip {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  border: 1.5px solid rgba(var(--v-theme-on-surface), 0.2);
}

.status-chip {
  text-transform: capitalize;
  font-weight: 600;
}

.amount-display {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}
</style>
