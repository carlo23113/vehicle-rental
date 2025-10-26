<template>
  <CommonPageContainer>
    <!-- Header - Critical content (always visible) -->
    <CommonPageDetailPageHeader
      :title="`${vehicle.make} ${vehicle.model}`"
      :subtitle="`${vehicle.year} • ${vehicle.licensePlate}`"
      :badge="vehicle.status.replace('-', ' ')"
      :badge-color="getStatusColor(vehicle.status)"
      show-breadcrumbs
      parent-label="Vehicles"
      parent-icon="mdi-car-multiple"
      :actions="headerActions"
      @back="$router.push('/owner/vehicles')"
      @action="handleAction"
    />

    <v-row>
      <!-- Left Column: Photos and Main Info -->
      <v-col cols="12" lg="8">
        <!-- Photo Gallery - Load with intersection observer -->
        <div ref="photoSection">
          <CommonUiDetailCard
            v-if="sectionsLoaded.photos"
            title="Vehicle Photos"
            icon="mdi-camera"
            class="mb-6"
          >
            <LazyCommonUiPhotoGallery :photos="vehicle.photos" />
          </CommonUiDetailCard>
          <v-card v-else class="mb-6">
            <v-skeleton-loader type="image, article" />
          </v-card>
        </div>

        <!-- Vehicle Information - Deferred load -->
        <div ref="infoSection">
          <LazyVehicleInfoCard v-if="sectionsLoaded.info" :vehicle="vehicle" class="mb-6" />
          <v-card v-else class="mb-6">
            <v-skeleton-loader type="card" />
          </v-card>
        </div>

        <!-- Identification - Deferred load -->
        <div ref="identificationSection">
          <LazyVehicleIdentificationCard
            v-if="sectionsLoaded.identification"
            :vehicle="vehicle"
            class="mb-6"
          />
          <v-card v-else class="mb-6">
            <v-skeleton-loader type="card" />
          </v-card>
        </div>
      </v-col>

      <!-- Right Column: Stats and Details -->
      <v-col cols="12" lg="4">
        <!-- Pricing - Load immediately (important info) -->
        <LazyVehiclePricingCard :vehicle="vehicle" class="mb-6" />

        <!-- Mileage - Load immediately -->
        <CommonUiStatDisplayCard
          title="Mileage"
          icon="mdi-speedometer"
          :value="vehicle.mileage || 0"
          suffix="miles"
          size="medium"
          class="mb-6"
        />

        <!-- Quick Stats - Deferred load -->
        <div ref="statsSection">
          <LazyVehicleStatsCard v-if="sectionsLoaded.stats" :stats="vehicleStats" class="mb-6" />
          <v-card v-else class="mb-6">
            <v-skeleton-loader type="card" />
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog - Lazy load when needed -->
    <LazyCommonDialogDeleteConfirmation
      v-if="deleteDialog"
      v-model="deleteDialog"
      :title="`Delete ${vehicle.make} ${vehicle.model}?`"
      message="This action cannot be undone. This vehicle and all its associated data will be permanently removed."
      :loading="deleteLoading"
      @confirm="confirmDelete"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicles } from '~/composables/useVehicles'

const route = useRoute()
const router = useRouter()
const { getStatusColor, deleteVehicle: deleteVehicleFromStore } = useVehicles()

// Refs for intersection observer
const photoSection = ref<HTMLElement | null>(null)
const infoSection = ref<HTMLElement | null>(null)
const identificationSection = ref<HTMLElement | null>(null)
const statsSection = ref<HTMLElement | null>(null)

// Track which sections have been loaded
const sectionsLoaded = ref({
  photos: false,
  info: false,
  identification: false,
  stats: false,
})

// Dialog state
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success' as 'success' | 'error',
  icon: 'mdi-check-circle',
})

// Mock vehicle data - replace with actual API call
const vehicle = ref({
  id: route.params.id,
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  licensePlate: 'ABC-1234',
  vin: '1HGBH41JXMN109186',
  type: 'sedan',
  status: 'available',
  color: 'Silver',
  dailyRate: 89,
  rates: {
    cityRate: 45,
    provinceRate: 65,
  },
  mileage: 15420,
  locationId: '1', // Downtown Main Branch
  photos: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  ],
})

// Mock stats data - replace with actual API call
const vehicleStats = ref({
  totalRentals: 24,
  revenueGenerated: 12450,
  averageRating: 4.8,
  totalReviews: 18,
  lastService: 'Jan 15, 2025',
})

const headerActions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: 'mdi-pencil',
    variant: 'outlined' as const,
    color: 'primary',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: 'mdi-delete',
    variant: 'text' as const,
    color: 'error',
  },
]

// Intersection Observer for progressive loading
let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback: load all sections immediately
    sectionsLoaded.value = {
      photos: true,
      info: true,
      identification: true,
      stats: true,
    }
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Load section when it becomes visible
          if (entry.target === photoSection.value) {
            sectionsLoaded.value.photos = true
          } else if (entry.target === infoSection.value) {
            sectionsLoaded.value.info = true
          } else if (entry.target === identificationSection.value) {
            sectionsLoaded.value.identification = true
          } else if (entry.target === statsSection.value) {
            sectionsLoaded.value.stats = true
          }

          // Stop observing once loaded
          if (entry.target instanceof Element) {
            observer?.unobserve(entry.target)
          }
        }
      })
    },
    {
      root: null,
      rootMargin: '150px', // Start loading 150px before visible
      threshold: 0.01,
    }
  )

  // Observe all sections
  if (photoSection.value) observer.observe(photoSection.value)
  if (infoSection.value) observer.observe(infoSection.value)
  if (identificationSection.value) observer.observe(identificationSection.value)
  if (statsSection.value) observer.observe(statsSection.value)
}

onMounted(() => {
  // Load header and critical content immediately
  // Then setup progressive loading for below-the-fold content
  setupIntersectionObserver()

  // Alternatively, load all sections after a short delay if user is on fast connection
  if ('connection' in navigator) {
    const conn = (navigator as any).connection
    if (conn && (conn.effectiveType === '4g' || conn.downlink > 5)) {
      // Fast connection: preload everything after a delay
      setTimeout(() => {
        sectionsLoaded.value = {
          photos: true,
          info: true,
          identification: true,
          stats: true,
        }
      }, 500)
    }
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const handleAction = (key: string) => {
  if (key === 'edit') {
    editVehicle()
  } else if (key === 'delete') {
    deleteVehicle()
  }
}

const editVehicle = () => {
  router.push(`/owner/vehicles/edit/${vehicle.value.id}`)
}

const deleteVehicle = () => {
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleteLoading.value = true
  try {
    // TODO: Replace with actual API call
    // await $fetch(`/api/vehicles/${vehicle.value.id}`, { method: 'DELETE' })

    // Call the delete function from useVehicles composable
    deleteVehicleFromStore(Number(vehicle.value.id))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    snackbar.value = {
      show: true,
      message: `${vehicle.value.make} ${vehicle.value.model} has been deleted successfully`,
      color: 'success',
      icon: 'mdi-check-circle',
    }

    // Navigate back to vehicles list after short delay
    setTimeout(() => {
      router.push('/owner/vehicles')
    }, 1000)
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    snackbar.value = {
      show: true,
      message: 'Failed to delete vehicle. Please try again.',
      color: 'error',
      icon: 'mdi-alert-circle',
    }
  } finally {
    deleteLoading.value = false
    deleteDialog.value = false
  }
}
</script>
