<template>
  <div class="revenue-chart">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  filter: "week" | "month" | "year";
}

const props = defineProps<Props>();

const getChartData = () => {
  switch (props.filter) {
    case "week":
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [12500, 15200, 18400, 14800, 21000, 24500, 19800]
      };
    case "month":
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [45000, 52000, 48000, 62000]
      };
    case "year":
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        data: [
          95000, 88000, 102000, 115000, 125000, 118000, 132000, 128000, 145000,
          138000, 142000, 155000
        ]
      };
    default:
      return {
        labels: [],
        data: []
      };
  }
};

const chartData = computed(() => {
  const data = getChartData();

  return {
    labels: data.labels,
    datasets: [
      {
        label: "Revenue",
        data: data.data,
        borderColor: "rgb(33, 150, 243)",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(33, 150, 243)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "rgb(33, 150, 243)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3
      }
    ]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      borderRadius: 8,
      titleFont: {
        size: 14,
        weight: "bold"
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        label: function (context: any) {
          return "Revenue: $" + context.parsed.y.toLocaleString();
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        font: {
          size: 12,
          weight: "500"
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
        drawBorder: false
      },
      border: {
        display: false,
        dash: [5, 5]
      },
      ticks: {
        font: {
          size: 12
        },
        callback: function (value: any) {
          return "$" + value / 1000 + "K";
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: "index"
  }
}));
</script>

<style scoped>
.revenue-chart {
  height: 320px;
  width: 100%;
}
</style>
