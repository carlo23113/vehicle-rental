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
  loading?: boolean
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
      <template v-if="loading">
        <v-skeleton-loader type="image" height="200" class="mb-4" />
        <v-skeleton-loader type="list-item" class="mb-2" />
        <v-skeleton-loader type="list-item" class="mb-2" />
        <v-skeleton-loader type="list-item" class="mb-2" />
        <v-skeleton-loader type="list-item" />
      </template>
      <template v-else>
        <LazyVehicleStatusChart :data="chartData" />
        <div class="mt-4">
          <LazyVehicleStatusItem
            v-for="status in statuses"
            :key="status.label"
            :label="status.label"
            :value="status.value"
            :percentage="status.percentage"
            :color="status.color"
            :theme-color="status.themeColor"
          />
        </div>
      </template>
    </v-card-text>
  </CommonUiDashboardCard>
</template>
