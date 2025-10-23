<script setup lang="ts">
import type { VehicleUtilization } from '~/types/report'

interface Props {
  items: VehicleUtilization[]
  formatCurrency: (value: number) => string
  getUtilizationColor: (rate: number) => string
}

defineProps<Props>()
</script>

<template>
  <v-table class="modern-table">
    <thead>
      <tr>
        <th>Vehicle</th>
        <th>Rented Days</th>
        <th>Utilization</th>
        <th class="text-right">Revenue</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="vehicle in items" :key="vehicle.vehicleId" class="table-row">
        <td>
          <div class="font-weight-medium">{{ vehicle.vehicleName }}</div>
        </td>
        <td>
          <div class="text-body-2">
            {{ vehicle.rentedDays }}/{{ vehicle.totalDays }} days
          </div>
        </td>
        <td>
          <CommonUiUtilizationRow
            :label="vehicle.vehicleName"
            :value="vehicle.utilizationRate"
            :percentage="vehicle.utilizationRate"
            :color="getUtilizationColor(vehicle.utilizationRate)"
          />
        </td>
        <td class="text-right">
          <div class="font-weight-bold">{{ formatCurrency(vehicle.revenue) }}</div>
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
