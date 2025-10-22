<template>
  <div class="dashboard-page">
    <CommonPageContainer>
      <CommonPageHeader
        :title="`Good ${greeting}, ${userName}! 👋`"
        subtitle="Here's what's happening with your fleet today"
        action-text="Add Vehicle"
        action-icon="mdi-plus"
        @action-click="handleQuickAction('add-vehicle')"
      />

      <!-- Statistics Cards - Always visible (above the fold) -->
      <LazyStatisticsCards :stats="stats" :loading="loading.stats" class="mb-6" />

      <!-- Charts Row - Lazy load when visible -->
      <div ref="chartsSection">
        <v-row v-if="visibleSections.charts" class="mb-6">
          <!-- Revenue Chart -->
          <v-col cols="12" lg="8">
            <LazyRevenueSection v-model:filter="revenueFilter" />
          </v-col>

          <!-- Vehicle Status -->
          <v-col cols="12" lg="4">
            <LazyVehicleStatusSection :statuses="vehicleStatus" :loading="loading.vehicleStatus" />
          </v-col>
        </v-row>
        <v-row v-else class="mb-6">
          <v-col cols="12">
            <v-skeleton-loader type="card" height="300" />
          </v-col>
        </v-row>
      </div>

      <!-- Recent Activities and Quick Actions - Lazy load when visible -->
      <div ref="activitiesSection">
        <v-row v-if="visibleSections.activities">
          <!-- Recent Rentals -->
          <v-col cols="12" lg="8">
            <LazyRecentRentalsTable :rentals="recentRentals" :loading="loading.rentals" />
          </v-col>

          <!-- Quick Actions & Alerts -->
          <v-col cols="12" lg="4">
            <LazyQuickActions :actions="quickActions" @action-click="handleQuickAction" />
            <LazyMaintenanceAlerts :alerts="maintenanceAlerts" :loading="loading.alerts" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <v-skeleton-loader type="table" height="300" />
          </v-col>
        </v-row>
      </div>
    </CommonPageContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useDashboardData } from '~/composables/useDashboardData'

const router = useRouter()
const authStore = useAuthStore()

// Refs for intersection observer
const chartsSection = ref<HTMLElement | null>(null)
const activitiesSection = ref<HTMLElement | null>(null)

// Track which sections are visible
const visibleSections = ref({
  charts: false,
  activities: false,
})

// Loading states for progressive data loading
const loading = ref({
  stats: true,
  vehicleStatus: true,
  rentals: true,
  alerts: true,
})

// Get dashboard data with lazy loading support
const {
  stats,
  vehicleStatus,
  recentRentals,
  quickActions,
  maintenanceAlerts,
  loadStats,
  loadVehicleStatus,
  loadRecentRentals,
  loadMaintenanceAlerts,
} = useDashboardData()

const userName = computed(() => authStore.userName || 'Admin')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
})

const revenueFilter = ref<'week' | 'month' | 'year'>('month')

// Intersection Observer for lazy loading sections
let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  const options = {
    root: null,
    rootMargin: '50px', // Start loading 50px before element comes into view
    threshold: 0.1,
  }

  observer = new IntersectionObserver(entries => {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        if (entry.target === chartsSection.value) {
          visibleSections.value.charts = true
          // Load vehicle status data when charts section becomes visible
          await loadVehicleStatus?.()
          loading.value.vehicleStatus = false
        } else if (entry.target === activitiesSection.value) {
          visibleSections.value.activities = true
          // Load rentals and alerts data when activities section becomes visible
          await Promise.all([loadRecentRentals?.(), loadMaintenanceAlerts?.()])
          loading.value.rentals = false
          loading.value.alerts = false
        }
        // Stop observing once loaded
        if (entry.target instanceof Element) {
          observer?.unobserve(entry.target)
        }
      }
    })
  }, options)

  // Start observing sections
  if (chartsSection.value) observer.observe(chartsSection.value)
  if (activitiesSection.value) observer.observe(activitiesSection.value)
}

onMounted(async () => {
  // Load critical above-the-fold data immediately
  await loadStats?.()
  loading.value.stats = false

  // Setup intersection observer for other sections
  setupIntersectionObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const handleQuickAction = (action: string) => {
  switch (action) {
    case 'add-vehicle':
      router.push('/vehicles/add')
      break
    case 'new-rental':
      router.push('/rentals/add')
      break
    case 'add-customer':
      router.push('/customers')
      break
    case 'generate-report':
      router.push('/reports')
      break
    default:
      console.log('Quick action:', action)
  }
}
</script>
