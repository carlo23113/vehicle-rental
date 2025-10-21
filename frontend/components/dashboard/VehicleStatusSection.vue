<template>
  <v-card elevation="0" class="modern-card h-100">
    <v-card-title class="pa-6">
      <h3 class="text-h5 font-weight-bold">Vehicle Status</h3>
      <p class="text-caption text-medium-emphasis mt-1">Fleet distribution</p>
    </v-card-title>
    <v-card-text class="pa-6">
      <LazyDashboardVehicleStatusChart :data="chartData" />
      <div v-for="status in statuses" :key="status.label" class="mb-4">
        <div class="d-flex justify-space-between mb-2">
          <div class="d-flex align-center">
            <div
              class="status-dot mr-2"
              :style="`background-color: ${status.color}`"
            ></div>
            <span class="text-body-2 font-weight-medium">{{
              status.label
            }}</span>
          </div>
          <span class="text-body-2 font-weight-bold">{{ status.value }}</span>
        </div>
        <v-progress-linear
          :model-value="status.percentage"
          :color="status.themeColor"
          height="8"
          rounded
          class="progress-bar-modern"
        ></v-progress-linear>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface VehicleStatus {
  label: string;
  value: string;
  percentage: number;
  color: string;
  themeColor: string;
}

const props = defineProps<{
  statuses: VehicleStatus[];
}>();

const chartData = computed(() =>
  props.statuses.map((status) => ({
    label: status.label,
    value: parseInt(status.value),
    color: status.color
  }))
);
</script>

<style scoped>
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.progress-bar-modern {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
