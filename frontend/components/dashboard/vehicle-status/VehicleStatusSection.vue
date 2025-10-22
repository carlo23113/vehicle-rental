<script setup lang="ts">
import { computed } from 'vue'

interface VehicleStatus {
  label: string
  value: string
  percentage: number
  color: string
  themeColor: string
}

const props = defineProps<{
  statuses: VehicleStatus[]
}>()

const chartData = computed(() =>
  props.statuses.map(status => ({
    label: status.label,
    value: parseInt(status.value),
    color: status.color,
  }))
)
</script>

<template>
  <CommonUiDashboardCard class="h-full">
    <v-card-title class="pa-6 pb-4">
      <CommonUiSectionHeader title="Vehicle Status" subtitle="Real-time fleet distribution" />
    </v-card-title>
    <v-card-text class="pa-6 pt-2">
      <LazyDashboardVehicleStatusChart :data="chartData" />
      <div class="mt-4">
        <DashboardVehicleStatusItem
          v-for="status in statuses"
          :key="status.label"
          :label="status.label"
          :value="status.value"
          :percentage="status.percentage"
          :color="status.color"
          :theme-color="status.themeColor"
        />
      </div>
    </v-card-text>
  </CommonUiDashboardCard>
</template>
