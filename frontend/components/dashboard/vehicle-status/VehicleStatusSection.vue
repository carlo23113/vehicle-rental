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
  <CommonUiDetailCard title="Vehicle Status" icon="mdi-car-multiple" class="h-full">
    <template v-if="loading">
      <v-skeleton-loader type="image" height="200" class="mb-4" />
      <v-skeleton-loader type="list-item" class="mb-2" />
      <v-skeleton-loader type="list-item" class="mb-2" />
      <v-skeleton-loader type="list-item" class="mb-2" />
      <v-skeleton-loader type="list-item" />
    </template>
    <template v-else>
      <LazyCommonChartsDoughnutChart :data="chartData" />
      <div class="mt-4">
        <CommonUiProgressItem
          v-for="status in statuses"
          :key="status.label"
          :label="status.label"
          :value="status.value"
          :percentage="status.percentage"
          :color="status.themeColor"
          :dot-color="status.color"
        />
      </div>
    </template>
  </CommonUiDetailCard>
</template>
