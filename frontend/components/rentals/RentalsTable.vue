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
        <v-avatar color="primary" size="40" class="customer-avatar">
          <span class="text-subtitle-2 font-bold">
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
        <div class="text-xs text-medium-emphasis">
          to {{ formatDate(item.endDate) }}
        </div>
        <v-chip size="x-small" variant="tonal" color="primary" class="mt-1 duration-chip">
          <v-icon icon="mdi-calendar" start size="12" />
          {{ item.numberOfDays }} days
        </v-chip>
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

    <template #item.totalAmount="{ item }">
      <div class="amount-display">
        <div class="text-lg font-bold">{{ formatCurrency(item.totalAmount) }}</div>
        <div class="text-xs text-medium-emphasis">{{ formatCurrency(item.dailyRate) }}/day</div>
      </div>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-2" @click.stop>
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="tonal"
          color="info"
          class="action-btn"
          @click="$emit('view', item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="tonal"
          color="primary"
          class="action-btn"
          @click="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="tonal"
          color="error"
          class="action-btn"
          @click="$emit('delete', item)"
        />
      </div>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'

defineProps<{
  rentals: any[]
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
}>()

defineEmits<{
  view: [rental: any]
  edit: [rental: any]
  delete: [rental: any]
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
</script>

<style scoped>
.rentals-table :deep(tbody tr:hover) .customer-avatar {
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

.duration-chip {
  font-weight: 600;
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
