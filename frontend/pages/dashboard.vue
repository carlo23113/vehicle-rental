<template>
  <CommonPageContainer>
    <CommonPageHeader
      :title="`Good ${greeting}, ${userName}! 👋`"
      subtitle="Here's what's happening with your fleet today"
      action-text="Add Vehicle"
      action-icon="mdi-plus"
      @action-click="handleQuickAction('add-vehicle')"
    />

    <!-- Statistics Cards -->
    <LazyDashboardStatisticsCards :stats="stats" />

    <!-- Charts Row -->
    <v-row class="mb-8">
      <!-- Revenue Chart -->
      <v-col cols="12" lg="8">
        <LazyDashboardRevenueSection v-model:filter="revenueFilter" />
      </v-col>

      <!-- Vehicle Status -->
      <v-col cols="12" lg="4">
        <LazyDashboardVehicleStatusSection :statuses="vehicleStatus" />
      </v-col>
    </v-row>

    <!-- Recent Activities and Quick Actions -->
    <v-row>
      <!-- Recent Rentals -->
      <v-col cols="12" lg="8">
        <LazyDashboardRecentRentalsTable :rentals="recentRentals" />
      </v-col>

      <!-- Quick Actions & Alerts -->
      <v-col cols="12" lg="4">
        <LazyDashboardQuickActions
          :actions="quickActions"
          @action-click="handleQuickAction"
        />
        <LazyDashboardMaintenanceAlerts :alerts="maintenanceAlerts" />
      </v-col>
    </v-row>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useDashboardData } from "~/composables/useDashboardData";

const authStore = useAuthStore();
const { stats, vehicleStatus, recentRentals, quickActions, maintenanceAlerts } =
  useDashboardData();

const userName = computed(() => authStore.userName || "Admin");

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
});

const revenueFilter = ref<"week" | "month" | "year">("month");

const handleQuickAction = (action: string) => {
  console.log("Quick action:", action);
  // TODO: Implement quick action handlers
};
</script>
