<script setup lang="ts">
interface Props {
  items: any[]
  formatCurrency: (value: number) => string
  formatDate: (date: string) => string
}

defineProps<Props>()
</script>

<template>
  <v-table class="modern-table">
    <thead>
      <tr>
        <th>Vehicle</th>
        <th>Total Services</th>
        <th>Total Cost</th>
        <th>Avg Cost/Service</th>
        <th>Last Service</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="maintenance in items" :key="maintenance.vehicleId" class="table-row">
        <td>
          <div class="font-weight-medium">{{ maintenance.vehicleName }}</div>
        </td>
        <td>
          <v-chip size="small" variant="tonal" color="primary">
            {{ maintenance.totalMaintenance }} services
          </v-chip>
        </td>
        <td>
          <div class="font-weight-bold">{{ formatCurrency(maintenance.totalCost) }}</div>
        </td>
        <td>
          <div class="text-body-2">
            {{ formatCurrency(maintenance.avgCostPerService) }}
          </div>
        </td>
        <td>
          <div class="text-body-2">{{ formatDate(maintenance.lastServiceDate) }}</div>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.modern-table {
  @apply bg-transparent;
}

.modern-table thead tr th {
  @apply font-bold uppercase text-xs tracking-wide opacity-70 p-4;
  color: rgb(var(--v-theme-on-surface));
  border-bottom: 2px solid rgba(var(--v-border-color), 0.12);
}

.modern-table tbody tr.table-row {
  @apply transition-colors duration-200 ease-in-out;
}

.modern-table tbody tr.table-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.modern-table tbody tr td {
  @apply p-4;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}
</style>
