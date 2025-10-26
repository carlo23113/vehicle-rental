<template>
  <CommonUiDataTable
    :headers="headers"
    :items="rentals"
    :items-per-page="10"
    table-class="rentals-table"
    empty-icon="mdi-calendar-remove"
    empty-title="No rentals found"
    empty-message="Try adjusting your filters or create a new rental"
  >
    <template #item.customer="{ item }">
      <div class="flex items-center py-3">
        <v-avatar color="primary" size="40">
          <span class="font-bold">
            {{ getInitials(item.customerName) }}
          </span>
        </v-avatar>
        <div class="ml-3">
          <div class="font-bold text-base">{{ item.customerName }}</div>
          <div class="text-xs text-medium-emphasis">{{ item.customerEmail }}</div>
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

    <template #item.period="{ item }">
      <div>
        <div class="text-body-2 font-medium">{{ formatDate(item.startDate) }}</div>
        <div class="text-xs text-medium-emphasis">to {{ formatDate(item.endDate) }}</div>
        <v-chip size="x-small" variant="tonal" color="primary" class="mt-1 duration-chip">
          <v-icon icon="mdi-calendar" start size="12" />
          {{ item.numberOfDays }} days
        </v-chip>
      </div>
    </template>

    <template #item.status="{ item }">
      <div class="status-container">
        <CommonUiTableChip
          :color="getStatusColor(item.status)"
          :icon="getStatusIcon(item.status)"
          :label="item.status"
          chip-class="status-chip"
        />
        <CommonUiTableChip
          v-if="item.paymentStatus"
          :color="getPaymentStatusColor(item.paymentStatus)"
          icon="mdi-cash"
          :icon-size="12"
          :label="item.paymentStatus"
          size="x-small"
          variant="tonal"
          chip-class="payment-chip"
        />
      </div>
    </template>

    <template #item.totalAmount="{ item }">
      <div class="amount-display">
        <div class="text-lg font-bold">{{ formatCurrency(item.totalAmount) }}</div>
        <div class="text-xs text-medium-emphasis">{{ formatCurrency(item.dailyRate) }}/day</div>
      </div>
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        edit-tooltip="Edit Rental"
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      >
        <template #middle>
          <CommonUiTableActionButton
            v-if="getInvoiceButtonState(item).show"
            :icon="getInvoiceButtonState(item).icon"
            :tooltip="getInvoiceButtonState(item).tooltip"
            :color="getInvoiceButtonState(item).color"
            @click="$emit('generate-invoice', item)"
          />
        </template>
      </CommonUiTableActionButtons>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'

defineProps<{
  rentals: any[]
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getPaymentStatusColor: (status: string) => string
}>()

defineEmits<{
  view: [rental: any]
  edit: [rental: any]
  delete: [rental: any]
  'generate-invoice': [rental: any]
}>()

const { formatCurrency } = useCurrency()

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Rental Period', key: 'period', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Total Amount', key: 'totalAmount', sortable: true },
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
    active: 'mdi-check-circle',
    reserved: 'mdi-calendar-clock',
    completed: 'mdi-check-all',
    cancelled: 'mdi-cancel',
  }
  return icons[status] || 'mdi-help-circle'
}

const hasInvoice = (rental: any): boolean => {
  // Check if rental has an invoice
  // In production, this would check a property on the rental object
  const existingInvoice = localStorage.getItem(`invoice-draft-rental-${rental.id}`)
  return !!existingInvoice
}

const getInvoiceButtonState = (rental: any) => {
  const hasInv = hasInvoice(rental)

  // Cancelled or Reserved rentals - hide button
  // Reserved: invoice auto-generated, no action needed
  // Cancelled: no invoice needed
  if (rental.status === 'cancelled' || rental.status === 'reserved') {
    return {
      show: false,
      icon: 'mdi-file-document-outline',
      tooltip: 'No Invoice',
      color: 'grey',
    }
  }

  // Active or Completed WITHOUT invoice = ERROR state (should never happen)
  if ((rental.status === 'active' || rental.status === 'completed') && !hasInv) {
    return {
      show: true,
      icon: 'mdi-alert-circle',
      tooltip: 'Missing Invoice - Create Now',
      color: 'error',
    }
  }

  // Active or Completed WITH invoice = View invoice
  return {
    show: true,
    icon: 'mdi-file-document-check',
    tooltip: 'View Invoice',
    color: 'info',
  }
}
</script>

<style scoped lang="scss">
.license-chip {
  @apply font-mono font-bold;
  border: 1.5px solid rgba(var(--v-theme-on-surface), 0.2);
}

.duration-chip {
  @apply font-semibold;
}

.status-chip {
  @apply capitalize font-semibold;
}

.payment-chip {
  @apply capitalize font-semibold;
}

.status-container {
  @apply flex flex-col gap-1 items-start w-fit;
}

.amount-display {
  @apply flex flex-col gap-0.5;
}
</style>
