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
  <CommonUiDashboardCard>
    <v-card-title class="pa-6 pb-4">
      <CommonUiSectionHeader
        title="Maintenance Alerts"
        subtitle="Vehicles requiring attention"
        icon="mdi-alert-circle"
        icon-color="warning"
      />
    </v-card-title>
    <v-card-text class="pa-6 pt-2">
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
    </v-card-text>
  </CommonUiDashboardCard>
</template>
