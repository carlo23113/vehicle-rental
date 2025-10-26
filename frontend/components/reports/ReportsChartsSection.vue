<template>
  <!-- Revenue Chart -->
  <v-row class="mb-6">
    <v-col cols="12">
      <CommonUiDetailCard title="Revenue Trends" icon="mdi-chart-line">
        <LazyCommonChartsLineChart v-bind="revenueChartConfig" />
      </CommonUiDetailCard>
    </v-col>
  </v-row>

  <!-- Vehicle Utilization & Top Customers -->
  <v-row class="mb-6">
    <v-col cols="12" lg="7">
      <CommonUiDetailCard title="Vehicle Utilization" icon="mdi-car-multiple" class="h-full">
        <LazyVehicleUtilizationTable
          :items="vehicleUtilization"
          :format-currency="formatCurrency"
          :get-utilization-color="getUtilizationColor"
        />
      </CommonUiDetailCard>
    </v-col>

    <v-col cols="12" lg="5">
      <CommonUiDetailCard title="Top Customers" icon="mdi-account-star" class="h-full">
        <CommonUiRankingList :items="topCustomersItems" :get-rank-color="getRankColor" />
      </CommonUiDetailCard>
    </v-col>
  </v-row>

  <!-- Revenue by Type & Status Breakdown -->
  <v-row class="mb-6">
    <v-col cols="12" lg="6">
      <CommonUiDetailCard title="Revenue by Vehicle Type" icon="mdi-car-settings" class="h-full">
        <CommonUiProgressList :items="revenueByTypeItems" />
      </CommonUiDetailCard>
    </v-col>

    <v-col cols="12" lg="6">
      <v-row>
        <v-col cols="12">
          <CommonUiDetailCard title="Rental Status" icon="mdi-calendar-check">
            <CommonUiStatusGrid
              :items="rentalStatusBreakdown"
              :get-icon="getRentalStatusIcon"
              :get-color="getRentalStatusColor"
            />
          </CommonUiDetailCard>
        </v-col>
        <v-col cols="12">
          <CommonUiDetailCard title="Payment Status" icon="mdi-credit-card-check">
            <CommonUiProgressList :items="paymentStatusItems" :height="6" />
          </CommonUiDetailCard>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  revenueChartConfig: any
  vehicleUtilization: any[]
  topCustomersItems: any[]
  revenueByTypeItems: any[]
  rentalStatusBreakdown: any[]
  paymentStatusItems: any[]
  formatCurrency: (amount: number) => string
  getUtilizationColor: (value: number) => string
  getRankColor: (index: number) => string
  getRentalStatusIcon: (status: string) => string
  getRentalStatusColor: (status: string) => string
}>()
</script>
