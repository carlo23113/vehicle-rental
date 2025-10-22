<template>
  <CommonPageContainer>
    <!-- Header with Breadcrumbs and Actions -->
    <CommonPageDetailPageHeader
      :title="`${vehicle.make} ${vehicle.model}`"
      :subtitle="`${vehicle.year} • ${vehicle.licensePlate}`"
      :badge="vehicle.status.replace('-', ' ')"
      :badge-color="getStatusColor(vehicle.status)"
      show-breadcrumbs
      parent-label="Vehicles"
      parent-icon="mdi-car-multiple"
      :actions="headerActions"
      @back="$router.push('/vehicles')"
      @action="handleAction"
    />

    <v-row>
      <!-- Left Column: Photos and Main Info -->
      <v-col cols="12" lg="8">
        <!-- Photo Gallery -->
        <CommonUiDetailCard title="Vehicle Photos" icon="mdi-camera" class="mb-6">
          <CommonUiPhotoGallery :photos="vehicle.photos" />
        </CommonUiDetailCard>

        <!-- Vehicle Information -->
        <VehiclesVehicleInfoCard :vehicle="vehicle" class="mb-6" />

        <!-- Identification -->
        <VehiclesVehicleIdentificationCard :vehicle="vehicle" class="mb-6" />
      </v-col>

      <!-- Right Column: Stats and Details -->
      <v-col cols="12" lg="4">
        <!-- Pricing -->
        <CommonUiStatDisplayCard
          title="Pricing"
          icon="mdi-currency-usd"
          :value="formatCurrency(vehicle.dailyRate)"
          suffix="per day"
          color="primary"
          class="mb-6"
        />

        <!-- Mileage -->
        <CommonUiStatDisplayCard
          title="Mileage"
          icon="mdi-speedometer"
          :value="vehicle.mileage || 0"
          suffix="miles"
          size="medium"
          class="mb-6"
        />

        <!-- Quick Stats -->
        <VehiclesVehicleStatsCard :stats="vehicleStats" class="mb-6" />
      </v-col>
    </v-row>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicles } from '~/composables/useVehicles'
import { useCurrency } from '~/composables/useCurrency'

const route = useRoute()
const router = useRouter()
const { getStatusColor } = useVehicles()
const { formatCurrency } = useCurrency()

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
  mileage: 15420,
  photos: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  ]
})

// Mock stats data - replace with actual API call
const vehicleStats = ref({
  totalRentals: 24,
  revenueGenerated: 12450,
  averageRating: 4.8,
  totalReviews: 18,
  lastService: 'Jan 15, 2025'
})

const headerActions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: 'mdi-pencil',
    variant: 'outlined' as const,
    color: 'primary'
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: 'mdi-delete',
    variant: 'text' as const,
    color: 'error'
  }
]

const handleAction = (key: string) => {
  if (key === 'edit') {
    editVehicle()
  } else if (key === 'delete') {
    deleteVehicle()
  }
}

const editVehicle = () => {
  router.push(`/vehicles/edit/${vehicle.value.id}`)
}

const deleteVehicle = () => {
  // TODO: Show delete confirmation
  console.log('Delete vehicle:', vehicle.value.id)
}
</script>
