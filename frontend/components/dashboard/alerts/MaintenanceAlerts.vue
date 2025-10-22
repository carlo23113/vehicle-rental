<script setup lang="ts">
interface MaintenanceAlert {
  vehicle: string
  message: string
}

defineProps<{
  alerts: MaintenanceAlert[]
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
      <v-list density="compact" class="bg-transparent">
        <DashboardAlertsMaintenanceAlertItem
          v-for="alert in alerts"
          :key="alert.vehicle"
          :vehicle="alert.vehicle"
          :message="alert.message"
        />
      </v-list>
    </v-card-text>
  </CommonUiDashboardCard>
</template>
