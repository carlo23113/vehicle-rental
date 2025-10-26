<template>
  <!-- Location Performance -->
  <v-row class="mb-6">
    <v-col cols="12">
      <CommonUiDetailCard title="Location Performance" icon="mdi-map-marker-multiple">
        <LazyLocationPerformanceTable
          :items="locationPerformance"
          :format-currency="formatCurrency"
          :get-utilization-color="getUtilizationColor"
        />
      </CommonUiDetailCard>
    </v-col>
  </v-row>

  <!-- Maintenance Summary -->
  <v-row>
    <v-col cols="12">
      <CommonUiDetailCard title="Maintenance Summary" icon="mdi-wrench-clock">
        <LazyMaintenanceSummaryTable
          :items="maintenanceSummary"
          :format-currency="formatCurrency"
          :format-date="formatDate"
        />
      </CommonUiDetailCard>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  locationPerformance: any[]
  maintenanceSummary: any[]
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
  getUtilizationColor: (value: number) => string
}>()
</script>
