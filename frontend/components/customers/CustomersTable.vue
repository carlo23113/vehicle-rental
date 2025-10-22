<template>
  <CommonUiDataTable
    :headers="headers"
    :items="customers"
    :items-per-page="10"
    table-class="customers-table"
    empty-icon="mdi-account-remove"
    empty-title="No customers found"
    empty-message="Try adjusting your filters or add a new customer"
  >
    <template #item.customer="{ item }">
      <div class="flex items-center py-3">
        <v-avatar color="primary" size="48" class="customer-avatar">
          <span class="text-subtitle-2 font-bold">
            {{ getInitials(item) }}
          </span>
        </v-avatar>
        <div class="ml-3">
          <div class="font-bold text-base">{{ getFullName(item) }}</div>
          <div class="text-xs text-medium-emphasis">{{ item.email }}</div>
        </div>
      </div>
    </template>

    <template #item.contact="{ item }">
      <div>
        <div class="text-body-2">{{ item.phone }}</div>
        <div class="text-xs text-medium-emphasis">
          {{ item.city }}, {{ item.state }}
        </div>
      </div>
    </template>

    <template #item.license="{ item }">
      <div>
        <v-chip size="small" variant="outlined" class="font-bold mb-1 license-chip">
          {{ item.driversLicense }}
        </v-chip>
        <div class="text-xs text-medium-emphasis">
          Exp: {{ formatDate(item.licenseExpiry) }}
        </div>
      </div>
    </template>

    <template #item.status="{ item }">
      <v-chip
        :color="getStatusColor(item.status)"
        size="small"
        variant="flat"
        class="status-chip"
      >
        {{ item.status }}
      </v-chip>
    </template>

    <template #item.rentals="{ item }">
      <div>
        <div class="font-bold text-base">{{ item.totalRentals }} rentals</div>
        <div class="text-xs text-medium-emphasis">
          {{ formatCurrency(item.totalSpent) }} spent
        </div>
      </div>
    </template>

    <template #item.joinDate="{ item }">
      <div class="text-body-2">{{ formatDate(item.joinDate) }}</div>
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

const { formatCurrency } = useCurrency()

defineProps<{
  customers: any[]
  getStatusColor: (status: string) => string
  getFullName: (customer: any) => string
  getInitials: (customer: any) => string
  formatDate: (date: string) => string
}>()

defineEmits<{
  view: [customer: any]
  edit: [customer: any]
  delete: [customer: any]
}>()

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Contact', key: 'contact', sortable: true },
  { title: "Driver's License", key: 'license', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Rentals & Spending', key: 'rentals', sortable: true },
  { title: 'Join Date', key: 'joinDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<style lang="scss" scoped>
.customer-avatar {
  @apply transition-all duration-300;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18), 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.customers-table :deep(tbody tr:hover) .customer-avatar {
  @apply scale-105;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), 0 0 0 3px rgba(var(--v-theme-primary), 0.2);
}

.license-chip {
  @apply rounded-lg;
}

.status-chip {
  @apply rounded-lg font-bold;
}

.action-btn {
  @apply transition-all duration-200;

  &:hover {
    @apply scale-110;
  }
}
</style>
