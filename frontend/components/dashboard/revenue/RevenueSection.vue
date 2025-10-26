<script setup lang="ts">
import { computed } from 'vue'

const { getCurrencySymbol } = useCurrency()

type FilterType = 'week' | 'month' | 'year'

const props = defineProps<{
  filter: FilterType
}>()

defineEmits<{
  'update:filter': [value: FilterType]
}>()

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

interface ChartDataConfig {
  labels: string[]
  data: number[]
}

const CHART_DATA_MAP: Record<string, ChartDataConfig> = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12500, 15200, 18400, 14800, 21000, 24500, 19800]
  },
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [45000, 52000, 48000, 62000]
  },
  year: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [95000, 88000, 102000, 115000, 125000, 118000, 132000, 128000, 145000, 138000, 142000, 155000]
  }
}

const chartConfig = computed(() => CHART_DATA_MAP[props.filter] || { labels: [], data: [] })
</script>

<template>
  <CommonUiDetailCard title="Revenue Overview" icon="mdi-cash-multiple">
    <template #actions>
      <v-btn-toggle
        :model-value="filter"
        @update:model-value="$emit('update:filter', $event)"
        mandatory
        density="comfortable"
        variant="outlined"
        divided
        rounded="xl"
        color="primary"
      >
        <v-btn
          v-for="option in filterOptions"
          :key="option.value"
          :value="option.value"
          class="px-4"
        >
          {{ option.label }}
        </v-btn>
      </v-btn-toggle>
    </template>
    <LazyCommonChartsLineChart
      :labels="chartConfig.labels"
      :data="chartConfig.data"
      label="Revenue"
      :y-axis-prefix="getCurrencySymbol()"
      y-axis-suffix="K"
      :tooltip-prefix="getCurrencySymbol()"
      :y-axis-divider="1000"
      :height="320"
    />
  </CommonUiDetailCard>
</template>
