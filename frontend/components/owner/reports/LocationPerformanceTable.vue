<script setup lang="ts">
interface Props {
  items: any[]
  formatCurrency: (value: number) => string
  getUtilizationColor: (rate: number) => string
}

defineProps<Props>()
</script>

<template>
  <v-table class="modern-table">
    <thead>
      <tr>
        <th>Location</th>
        <th>Total Rentals</th>
        <th>Revenue</th>
        <th>Utilization</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="location in items" :key="location.location" class="table-row">
        <td>
          <div class="font-weight-medium">{{ location.location }}</div>
        </td>
        <td>
          <v-chip size="small" variant="tonal" color="primary">
            {{ location.rentals }} rentals
          </v-chip>
        </td>
        <td>
          <div class="font-weight-bold">{{ formatCurrency(location.revenue || 0) }}</div>
        </td>
        <td>
          <CommonUiUtilizationRow
            :label="location.location"
            :value="location.utilization"
            :percentage="location.utilization"
            :color="getUtilizationColor(location.utilization)"
            max-width="120px"
          />
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
