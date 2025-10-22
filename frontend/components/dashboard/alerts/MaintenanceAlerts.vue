<script setup lang="ts">
interface MaintenanceAlert {
  vehicle: string
  message: string
}

defineProps<{
  alerts: MaintenanceAlert[]
  loading?: boolean
}>()
</script>

<template>
  <CommonUiDetailCard title="Maintenance Alerts" icon="mdi-alert-circle">
    <template v-if="loading">
      <v-skeleton-loader type="list-item" class="mb-2" />
      <v-skeleton-loader type="list-item" class="mb-2" />
      <v-skeleton-loader type="list-item" />
    </template>
    <v-list v-else density="compact" class="bg-transparent">
      <LazyMaintenanceAlertItem
        v-for="alert in alerts"
        :key="alert.vehicle"
        :vehicle="alert.vehicle"
        :message="alert.message"
      />
    </v-list>
  </CommonUiDetailCard>
</template>
