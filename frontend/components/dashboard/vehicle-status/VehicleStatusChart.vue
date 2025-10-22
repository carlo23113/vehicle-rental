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

interface VehicleStatus {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  data: VehicleStatus[]
}>()

const totalVehicles = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

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
  cutout: '70%',
  plugins: {
    legend: { display: false },
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
          const percentage = ((value / totalVehicles.value) * 100).toFixed(1)
          return `${label}: ${value} (${percentage}%)`
        },
      },
    },
  },
}))
</script>

<template>
  <ClientOnly>
    <div class="relative w-full h-60 flex items-center justify-center">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </ClientOnly>
</template>
