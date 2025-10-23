<template>
  <ClientOnly>
    <div class="relative w-full flex items-center justify-center" :style="{ height: height + 'px' }">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ChartDataItem {
  label: string
  value: number
  color: string
}

interface Props {
  data: ChartDataItem[]
  cutout?: string
  height?: number
  showLegend?: boolean
  showPercentage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cutout: '70%',
  height: 240,
  showLegend: false,
  showPercentage: true
})

const totalValue = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const chartData = computed(() => ({
  labels: props.data.map(item => item.label),
  datasets: [
    {
      data: props.data.map(item => item.value),
      backgroundColor: props.data.map(item => item.color),
      borderWidth: 0,
      hoverOffset: 8,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: true,
  cutout: props.cutout,
  plugins: {
    legend: {
      display: props.showLegend,
      position: 'bottom'
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      displayColors: true,
      boxWidth: 12,
      boxHeight: 12,
      callbacks: {
        label: (context: TooltipItem<'doughnut'>) => {
          const label = context.label || ''
          const value = context.parsed || 0
          if (props.showPercentage) {
            const percentage = ((value / totalValue.value) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
          return `${label}: ${value}`
        },
      },
    },
  },
}))
</script>
