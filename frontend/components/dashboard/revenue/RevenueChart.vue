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

interface ChartDataConfig {
  labels: string[]
  data: number[]
}

const props = defineProps<{
  filter: 'week' | 'month' | 'year'
}>()

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

const CHART_STYLE = {
  borderColor: 'rgb(33, 150, 243)',
  backgroundColor: 'rgba(33, 150, 243, 0.1)',
  borderWidth: 3,
  fill: true,
  tension: 0.4,
  pointRadius: 4,
  pointHoverRadius: 6,
  pointBackgroundColor: 'rgb(33, 150, 243)',
  pointBorderColor: '#fff',
  pointBorderWidth: 2,
  pointHoverBackgroundColor: 'rgb(33, 150, 243)',
  pointHoverBorderColor: '#fff',
  pointHoverBorderWidth: 3
}

const chartData = computed(() => {
  const { labels, data } = CHART_DATA_MAP[props.filter] || { labels: [], data: [] }

  return {
    labels,
    datasets: [{ label: 'Revenue', data, ...CHART_STYLE }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      borderRadius: 8,
      titleFont: { size: 14, weight: 'bold' as const },
      bodyFont: { size: 13 },
      callbacks: {
        label: (context: TooltipItem<'line'>) => `Revenue: $${(context.parsed.y || 0).toLocaleString()}`
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
        callback: (value: number | string) => `$${Number(value) / 1000}K`
      }
    }
  },
  interaction: { intersect: false, mode: 'index' as const }
}))
</script>

<template>
  <ClientOnly>
    <div class="h-80 w-full">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </ClientOnly>
</template>
