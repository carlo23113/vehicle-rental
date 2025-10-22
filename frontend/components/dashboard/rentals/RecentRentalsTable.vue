<script setup lang="ts">
interface Rental {
  id: number
  customer: string
  customerInitials: string
  vehicle: string
  licensePlate: string
  startDate: string
  endDate: string
  status: string
  statusColor: string
  amount: string
  color: string
}

defineProps<{
  rentals: Rental[]
}>()

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Period', key: 'startDate', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true, align: 'end' as const }
]
</script>

<template>
  <v-card elevation="0" class="rentals-table-card">
    <v-card-title class="pa-6 d-flex justify-space-between align-center">
      <div>
        <h3 class="text-h5 font-weight-bold mb-1">Recent Rentals</h3>
        <p class="text-caption text-medium-emphasis">Latest rental transactions</p>
      </div>
      <v-btn variant="text" color="primary" append-icon="mdi-arrow-right" class="hover-lift">
        View All
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="rentals"
      :items-per-page="5"
      class="modern-datatable"
      hover
      :show-select="false"
      item-value="id"
    >
      <template #[`item.customer`]="{ item }">
        <div class="d-flex align-center py-2">
          <v-avatar :color="item.color" size="44" class="mr-3 avatar-shadow">
            <span class="text-subtitle-2 font-weight-bold">{{ item.customerInitials }}</span>
          </v-avatar>
          <div>
            <div class="font-weight-medium text-body-1">{{ item.customer }}</div>
            <div class="text-caption text-medium-emphasis">Customer</div>
          </div>
        </div>
      </template>

      <template #[`item.vehicle`]="{ item }">
        <div>
          <div class="font-weight-medium text-body-1">{{ item.vehicle }}</div>
          <div class="text-caption text-medium-emphasis">
            <v-icon icon="mdi-card-text" size="12" class="mr-1" />
            {{ item.licensePlate }}
          </div>
        </div>
      </template>

      <template #[`item.startDate`]="{ item }">
        <div>
          <div class="text-body-2">{{ item.startDate }}</div>
          <div class="text-caption text-medium-emphasis">
            <v-icon icon="mdi-arrow-right" size="12" class="mx-1" />
            {{ item.endDate }}
          </div>
        </div>
      </template>

      <template #[`item.status`]="{ item }">
        <v-chip
          :color="item.statusColor"
          size="small"
          variant="flat"
          class="font-weight-bold status-chip"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template #[`item.amount`]="{ item }">
        <div class="text-h6 font-weight-bold amount-text">${{ item.amount }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
.rentals-table-card {
  border: 1px solid rgba(var(--v-border-color), 0.06);
  border-radius: 24px;
  background: linear-gradient(135deg,
    rgb(var(--v-theme-surface)) 0%,
    rgba(var(--v-theme-surface), 0.98) 100%);
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05),
              0 0 0 1px rgba(var(--v-theme-primary), 0.05);
  overflow: hidden;
  position: relative;
}

.rentals-table-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.2) 0%,
    transparent 50%,
    rgba(var(--v-theme-secondary), 0.2) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.rentals-table-card:hover::before {
  opacity: 1;
}

.rentals-table-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08),
              0 0 0 1px rgba(var(--v-theme-primary), 0.12);
  transform: translateY(-2px);
}

.modern-datatable {
  background: transparent;
}

.modern-datatable :deep(.v-table__wrapper) {
  border-radius: 0 0 24px 24px;
  overflow: hidden;
}

.modern-datatable :deep(.v-data-table__th) {
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.04) 0%,
    rgba(var(--v-theme-primary), 0.02) 100%) !important;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 1px;
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.15) !important;
  padding: 20px 16px !important;
  position: relative;
}

.modern-datatable :deep(.v-data-table__th::after) {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(var(--v-theme-primary), 0.4) 50%,
    transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-datatable :deep(.v-data-table__th:hover::after) {
  opacity: 1;
}

.modern-datatable :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.04) !important;
  padding: 16px !important;
}

.modern-datatable :deep(tbody tr) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.modern-datatable :deep(.v-table__wrapper) {
  position: relative;
}

.modern-datatable :deep(tbody tr) {
  border-left: 4px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-datatable :deep(tbody tr:hover) {
  border-left-color: rgb(var(--v-theme-primary));
}

.modern-datatable :deep(tbody tr:hover) {
  background: linear-gradient(90deg,
    rgba(var(--v-theme-primary), 0.06) 0%,
    rgba(var(--v-theme-primary), 0.02) 100%) !important;
}

.modern-datatable :deep(.v-data-table-footer) {
  border-top: 1px solid rgba(var(--v-border-color), 0.08);
  background: linear-gradient(180deg,
    rgba(var(--v-theme-surface), 0.95) 0%,
    rgba(var(--v-theme-surface), 0.98) 100%);
  backdrop-filter: blur(20px);
  padding: 16px !important;
}

.modern-datatable :deep(.v-data-table-footer .v-btn) {
  transition: all 0.3s ease;
}

.modern-datatable :deep(.v-data-table-footer .v-btn:hover) {
  transform: scale(1.1);
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

.modern-datatable :deep(.v-select) {
  border-radius: 12px;
}

.avatar-shadow {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18),
              0 0 0 3px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.modern-datatable :deep(tbody tr:hover) .avatar-shadow {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25),
              0 0 0 3px rgba(var(--v-theme-primary), 0.2);
  transform: scale(1.05);
}

.status-chip {
  border-radius: 10px;
  padding: 0 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modern-datatable :deep(tbody tr:hover) .status-chip {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.amount-text {
  background: linear-gradient(135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
}

.amount-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%);
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.3s ease;
}

.modern-datatable :deep(tbody tr:hover) .amount-text::after {
  opacity: 1;
  transform: scaleX(1);
}

.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.hover-lift::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.1) 0%,
    transparent 100%);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hover-lift:hover::before {
  opacity: 1;
}

.hover-lift:hover {
  transform: translateX(4px);
}
</style>
