<template>
  <CommonUiDataTable
    :headers="headers"
    :items="customers"
    :items-per-page="10"
    table-class="customers-table"
    empty-icon="mdi-account-remove"
    empty-title="No customers found"
    empty-message="Try adjusting your filters or add a new customer"
    @row-click="$emit('view', $event)"
  >
    <template #item.customer="{ item }">
      <div class="flex items-center py-3">
        <v-avatar color="primary" size="40">
          <span class="font-bold">
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
        <div class="text-xs">{{ item.phone }}</div>
        <div class="text-xs text-medium-emphasis">{{ item.city }}, {{ item.state }}</div>
      </div>
    </template>

    <template #item.license="{ item }">
      <div>
        <v-chip size="x-small" variant="outlined" class="font-bold mb-1 rounded-lg">
          {{ item.driversLicense }}
        </v-chip>
        <div class="text-xs text-medium-emphasis">Exp: {{ formatDate(item.licenseExpiry) }}</div>
      </div>
    </template>

    <template #item.status="{ item }">
      <CommonUiTableChip
        :color="getStatusColor(item.status)"
        :label="item.status"
        chip-class="status-chip"
      />
    </template>

    <template #item.rentals="{ item }">
      <div>
        <div class="font-bold text-base">{{ item.totalRentals }} rentals</div>
        <div class="text-xs text-medium-emphasis">{{ formatCurrency(item.totalSpent) }} spent</div>
      </div>
    </template>

    <template #item.joinDate="{ item }">
      <div class="text-body-2">{{ formatDate(item.joinDate) }}</div>
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        edit-tooltip="Edit Customer"
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      />
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
.status-chip {
  @apply rounded-lg font-bold;
}
</style>
