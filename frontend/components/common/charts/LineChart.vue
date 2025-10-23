<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  labels: string[]
  data: number[]
  label?: string
  borderColor?: string
  backgroundColor?: string
  height?: number
  borderWidth?: number
  tension?: number
  fill?: boolean
  showLegend?: boolean
  yAxisPrefix?: string
  yAxisSuffix?: string
  yAxisDivider?: number
  tooltipPrefix?: string
  tooltipSuffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Data',
  borderColor: 'rgb(33, 150, 243)',
  backgroundColor: 'rgba(33, 150, 243, 0.1)',
  height: 320,
  borderWidth: 3,
  tension: 0.4,
  fill: true,
  showLegend: false,
  yAxisPrefix: '',
  yAxisSuffix: '',
  yAxisDivider: 1,
  tooltipPrefix: '',
  tooltipSuffix: ''
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    label: props.label,
    data: props.data,
    borderColor: props.borderColor,
    backgroundColor: props.backgroundColor,
    borderWidth: props.borderWidth,
    fill: props.fill,
    tension: props.tension,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: props.borderColor,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointHoverBackgroundColor: props.borderColor,
    pointHoverBorderColor: '#fff',
    pointHoverBorderWidth: 3
  }]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: props.showLegend },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      borderRadius: 8,
      titleFont: { size: 14, weight: 'bold' as const },
      bodyFont: { size: 13 },
      callbacks: {
        label: (context: TooltipItem<'line'>) => {
          const value = context.parsed.y || 0
          return `${props.label}: ${props.tooltipPrefix}${value.toLocaleString()}${props.tooltipSuffix}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 12, weight: 500 } }
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
      border: { display: false, dash: [5, 5] },
      ticks: {
        font: { size: 12 },
        callback: (value: number | string) => {
          const numValue = Number(value) / props.yAxisDivider
          return `${props.yAxisPrefix}${numValue}${props.yAxisSuffix}`
        }
      }
    }
  },
  interaction: { intersect: false, mode: 'index' as const }
}))
</script>

<template>
  <ClientOnly>
    <div class="w-full" :style="{ height: height + 'px' }">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </ClientOnly>
</template>
