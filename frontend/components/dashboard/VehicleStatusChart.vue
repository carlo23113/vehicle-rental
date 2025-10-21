<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface VehicleStatus {
  label: string;
  value: number;
  color: string;
}

const props = defineProps<{
  data: VehicleStatus[];
}>();

const chartData = computed(() => ({
  labels: props.data.map((item) => item.label),
  datasets: [
    {
      data: props.data.map((item) => item.value),
      backgroundColor: props.data.map((item) => item.color),
      borderWidth: 0,
      hoverOffset: 8
    }
  ]
}));

const chartOptions = computed<ChartOptions<"doughnut">>(() => ({
  responsive: true,
  maintainAspectRatio: true,
  cutout: "70%",
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      cornerRadius: 8,
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      displayColors: true,
      boxWidth: 12,
      boxHeight: 12,
      callbacks: {
        label: (context) => {
          const label = context.label || "";
          const value = context.parsed || 0;
          const total = props.data.reduce((sum, item) => sum + item.value, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
}));
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
