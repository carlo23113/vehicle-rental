<template>
  <v-card elevation="0" class="modern-card">
    <v-card-title class="pa-6 d-flex justify-space-between align-center">
      <div>
        <h3 class="text-h5 font-weight-bold">Recent Rentals</h3>
        <p class="text-caption text-medium-emphasis mt-1"
          >Latest rental activity</p
        >
      </div>
      <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
        View All
      </v-btn>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-table class="modern-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Period</th>
            <th>Status</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rental in rentals" :key="rental.id" class="table-row">
            <td>
              <div class="d-flex align-center py-2">
                <v-avatar :color="rental.color" size="40" class="mr-3">
                  <span class="text-subtitle-2 font-weight-bold">{{
                    rental.customerInitials
                  }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ rental.customer }}</div>
                  <div class="text-caption text-medium-emphasis">Customer</div>
                </div>
              </div>
            </td>
            <td>
              <div>
                <div class="font-weight-medium">{{ rental.vehicle }}</div>
                <div class="text-caption text-medium-emphasis">{{
                  rental.licensePlate
                }}</div>
              </div>
            </td>
            <td>
              <div>
                <div class="text-body-2">{{ rental.startDate }}</div>
                <div class="text-caption text-medium-emphasis"
                  >to {{ rental.endDate }}</div
                >
              </div>
            </td>
            <td>
              <v-chip
                :color="rental.statusColor"
                size="small"
                variant="flat"
                class="font-weight-bold"
              >
                {{ rental.status }}
              </v-chip>
            </td>
            <td class="text-right">
              <div class="text-h6 font-weight-bold">${{ rental.amount }}</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Rental {
  id: number;
  customer: string;
  customerInitials: string;
  vehicle: string;
  licensePlate: string;
  startDate: string;
  endDate: string;
  status: string;
  statusColor: string;
  amount: string;
  color: string;
}

defineProps<{
  rentals: Rental[];
}>();
</script>

<style scoped>
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.modern-table {
  background: transparent;
}

.modern-table thead tr th {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  border-bottom: 2px solid rgba(var(--v-border-color), 0.12);
  padding: 1rem;
}

.modern-table tbody tr.table-row {
  transition: background-color 0.2s ease;
}

.modern-table tbody tr.table-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.modern-table tbody tr td {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
  padding: 1rem;
}
</style>
