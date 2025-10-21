<template>
  <v-card elevation="0" class="modern-card alert-card">
    <v-card-title class="pa-6 d-flex align-center">
      <v-icon
        icon="mdi-alert-circle"
        color="warning"
        class="mr-2"
        size="24"
      ></v-icon>
      <h3 class="text-h6 font-weight-bold">Maintenance Alerts</h3>
    </v-card-title>
    <v-card-text class="pa-4">
      <v-list density="compact" class="alert-list">
        <v-list-item
          v-for="alert in alerts"
          :key="alert.vehicle"
          class="alert-list-item rounded-lg px-3 mb-2"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-wrench" size="20" color="warning"></v-icon>
          </template>
          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ alert.vehicle }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ alert.message }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface MaintenanceAlert {
  vehicle: string;
  message: string;
}

defineProps<{
  alerts: MaintenanceAlert[];
}>();
</script>

<style scoped>
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.alert-card {
  background: rgb(var(--v-theme-surface));
}

.alert-list {
  background: transparent;
}

.alert-list-item {
  background: rgba(var(--v-theme-warning), 0.08);
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
  margin-bottom: 0.5rem;
}
</style>
