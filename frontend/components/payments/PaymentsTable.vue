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
        <v-avatar color="primary" size="40">
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
      <CommonUiTableChip
        :color="getStatusColor(item.status)"
        :icon="getStatusIcon(item.status)"
        :label="item.status"
        chip-class="status-chip"
      />
    </template>

    <template #item.date="{ item }">
      <div>
        <div v-if="item.paymentDate" class="text-body-2 font-medium">
          {{ formatDate(item.paymentDate) }}
        </div>
        <div class="text-xs text-medium-emphasis mt-1">Due: {{ formatDate(item.dueDate) }}</div>
        <v-chip v-if="item.refundDate" size="x-small" variant="tonal" color="info" class="mt-1">
          <v-icon icon="mdi-keyboard-return" start size="12" />
          {{ formatDate(item.refundDate) }}
        </v-chip>
      </div>
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        :show-edit="false"
        :show-delete="false"
        @view="$emit('view', item)"
      >
        <template #prepend>
          <CommonUiTableActionButton
            v-if="item.status === 'pending'"
            icon="mdi-credit-card-check"
            tooltip="Process Payment"
            color="success"
            @click="$emit('process', item)"
          />
          <CommonUiTableActionButton
            v-if="item.status === 'completed'"
            icon="mdi-keyboard-return"
            tooltip="Refund"
            color="warning"
            @click="$emit('refund', item)"
          />
        </template>
        <template #append>
          <CommonUiTableActionButton
            icon="mdi-printer"
            tooltip="Print Receipt"
            color="primary"
            @click="$emit('print', item)"
          />
        </template>
      </CommonUiTableActionButtons>
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
.license-chip {
  @apply font-mono font-bold;
  border: 1.5px solid rgba(var(--v-theme-on-surface), 0.2);
}

.status-chip {
  @apply capitalize font-semibold;
}

.amount-display {
  @apply flex flex-col gap-[0.125rem];
}
</style>
