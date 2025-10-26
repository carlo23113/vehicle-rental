<template>
  <div class="browse-page">
    <!-- Hero Header -->
    <div class="browse-hero">
      <div class="hero-background">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
      </div>
      <v-container class="position-relative">
        <div class="text-center py-12">
          <div class="hero-badge mb-4 fade-in-up">
            <v-chip color="primary" variant="tonal" size="small" class="px-4">
              <v-icon icon="mdi-car-multiple" start size="16"></v-icon>
              Premium Fleet
            </v-chip>
          </div>
          <h1 class="browse-title mb-4 fade-in-up" style="animation-delay: 100ms">
            Browse Our <span class="text-gradient">Fleet</span>
          </h1>
          <p class="browse-subtitle fade-in-up" style="animation-delay: 200ms">
            Find the perfect vehicle for your journey
          </p>
        </div>
      </v-container>
    </div>

    <v-container fluid class="pa-6">

    <!-- Search and Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="filters-card">
          <div class="filters-header mb-4">
            <v-icon icon="mdi-filter-variant" color="primary" size="20" class="mr-2"></v-icon>
            <span class="text-subtitle-1 font-weight-bold">Filters</span>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              size="small"
              color="primary"
              @click="clearFilters"
            >
              <v-icon icon="mdi-refresh" start size="18"></v-icon>
              Clear All
            </v-btn>
          </div>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.search"
                variant="outlined"
                density="comfortable"
                placeholder="Search by make, model, or features..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
                class="search-field"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.type"
                :items="typeOptions"
                variant="outlined"
                density="comfortable"
                label="Vehicle Type"
                prepend-inner-icon="mdi-car"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                variant="outlined"
                density="comfortable"
                label="Sort By"
                prepend-inner-icon="mdi-sort"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2">
                <v-text-field
                  v-model="priceRange.min"
                  variant="outlined"
                  density="comfortable"
                  label="Min Price"
                  type="number"
                  :prefix="getCurrencySymbol()"
                  hide-details
                ></v-text-field>
                <v-text-field
                  v-model="priceRange.max"
                  variant="outlined"
                  density="comfortable"
                  label="Max Price"
                  type="number"
                  :prefix="getCurrencySymbol()"
                  hide-details
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Results Count -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="results-header">
          <div class="results-count">
            <v-icon icon="mdi-car-multiple" color="primary" size="24" class="mr-2"></v-icon>
            <h2 class="text-h6 font-weight-bold">
              {{ filteredAndSortedVehicles.length }}
              <span class="text-medium-emphasis font-weight-regular">
                vehicle{{ filteredAndSortedVehicles.length !== 1 ? 's' : '' }} available
              </span>
            </h2>
          </div>
          <v-btn-toggle v-model="viewMode" mandatory density="comfortable" variant="outlined" divided class="view-toggle">
            <v-btn value="grid">
              <v-icon icon="mdi-view-grid"></v-icon>
              <span class="d-none d-sm-inline ml-2">Grid</span>
            </v-btn>
            <v-btn value="list">
              <v-icon icon="mdi-view-list"></v-icon>
              <span class="d-none d-sm-inline ml-2">List</span>
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-col>
    </v-row>

    <!-- Vehicle Grid -->
    <v-row v-if="viewMode === 'grid'" class="vehicles-grid">
      <v-col
        v-for="(vehicle, index) in filteredAndSortedVehicles"
        :key="vehicle.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <div class="vehicle-grid-item fade-in-up" :style="{ animationDelay: `${index * 50}ms` }">
          <VehicleCard
            :vehicle="vehicle"
            @select="showVehicleDetails"
            @book="openBookingDialog"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Vehicle List -->
    <v-row v-else>
      <v-col cols="12">
        <v-card
          v-for="vehicle in filteredAndSortedVehicles"
          :key="vehicle.id"
          elevation="0"
          class="modern-card mb-4"
          hover
          @click="showVehicleDetails(vehicle)"
        >
          <v-card-text class="pa-4">
            <div class="d-flex flex-wrap ga-4">
              <!-- Image -->
              <div class="vehicle-list-image">
                <v-img
                  :src="vehicle.imageUrl || '/placeholder-car.svg'"
                  :alt="`${vehicle.make} ${vehicle.model}`"
                  cover
                  width="200"
                  height="150"
                  class="rounded-lg"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center h-100 bg-surface-variant">
                      <v-icon icon="mdi-car" size="48"></v-icon>
                    </div>
                  </template>
                </v-img>
              </div>

              <!-- Details -->
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-center mb-2">
                  <h3 class="text-h5 font-weight-bold">{{ vehicle.make }} {{ vehicle.model }}</h3>
                  <v-chip :color="getStatusColor(vehicle.status)" size="small" variant="flat">
                    {{ vehicle.status }}
                  </v-chip>
                </div>

                <div class="text-body-2 text-medium-emphasis mb-3">
                  {{ vehicle.year }} • {{ vehicle.color }} • {{ getTypeLabel(vehicle.type) }}
                </div>

                <div class="features-wrap mb-3">
                  <v-chip
                    v-for="feature in vehicle.features.slice(0, 5)"
                    :key="feature"
                    size="small"
                    variant="outlined"
                    class="mr-1 mb-1"
                  >
                    {{ feature }}
                  </v-chip>
                </div>

                <div class="d-flex align-center ga-4">
                  <div class="d-flex align-center ga-1">
                    <v-icon icon="mdi-speedometer" size="20"></v-icon>
                    <span>{{ vehicle.mileage.toLocaleString() }} mi</span>
                  </div>
                  <div class="d-flex align-center ga-1">
                    <v-icon icon="mdi-clipboard-text" size="20"></v-icon>
                    <span>{{ vehicle.licensePlate }}</span>
                  </div>
                </div>
              </div>

              <!-- Pricing & Action -->
              <div class="d-flex flex-column justify-space-between align-end">
                <div class="text-right">
                  <div class="text-h4 font-weight-bold text-primary">{{ formatCurrency(vehicle.dailyRate) }}</div>
                  <div class="text-caption text-medium-emphasis">per day</div>
                </div>
                <v-btn
                  color="primary"
                  size="large"
                  variant="flat"
                  :disabled="vehicle.status !== 'available'"
                  @click.stop="openBookingDialog(vehicle)"
                >
                  {{ vehicle.status === 'available' ? 'Book Now' : 'Unavailable' }}
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="filteredAndSortedVehicles.length === 0">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card pa-12 text-center">
          <v-icon icon="mdi-car-off" size="64" color="medium-emphasis" class="mb-4"></v-icon>
          <h3 class="text-h5 font-weight-bold mb-2">No vehicles found</h3>
          <p class="text-body-1 text-medium-emphasis">
            Try adjusting your filters or search criteria
          </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Booking Dialog -->
    <v-dialog v-model="showBookingDialog" max-width="600">
      <v-card v-if="selectedVehicle">
        <v-card-title class="pa-6">
          <h2 class="text-h5 font-weight-bold">
            Book {{ selectedVehicle.make }} {{ selectedVehicle.model }}
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-form>
            <h3 class="text-h6 font-weight-bold mb-4">Your Information</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="First Name"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Last Name"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email"
                  variant="outlined"
                  density="comfortable"
                  type="email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Phone" variant="outlined" density="comfortable"></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Rental Period</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="bookingData.startDate"
                  label="Pickup Date"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="bookingData.endDate"
                  label="Return Date"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Pickup Location"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Main Office"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <!-- Price Summary -->
            <div class="price-summary pa-4 rounded-lg">
              <div class="d-flex justify-space-between mb-2">
                <span>Daily Rate:</span>
                <span class="font-weight-bold">{{ formatCurrency(selectedVehicle.dailyRate) }}/day</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Number of Days:</span>
                <span class="font-weight-bold">{{ calculateDays }} days</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between">
                <span class="text-h6 font-weight-bold">Total:</span>
                <span class="text-h6 font-weight-bold text-primary"> {{ formatCurrency(calculateTotal) }} </span>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showBookingDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" size="large"> Confirm Booking </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Vehicle Details Dialog -->
    <v-dialog v-model="showDetailsDialog" max-width="800">
      <v-card v-if="selectedVehicle">
        <v-img :src="selectedVehicle.imageUrl || '/placeholder-car.svg'" height="300" cover>
          <template #placeholder>
            <div class="d-flex align-center justify-center h-100 bg-surface-variant">
              <v-icon icon="mdi-car" size="96"></v-icon>
            </div>
          </template>
        </v-img>
        <v-card-title class="pa-6">
          <div class="d-flex justify-space-between align-center">
            <h2 class="text-h4 font-weight-bold">
              {{ selectedVehicle.make }} {{ selectedVehicle.model }}
            </h2>
            <v-chip :color="getStatusColor(selectedVehicle.status)" variant="flat">
              {{ selectedVehicle.status }}
            </v-chip>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <h3 class="text-h6 font-weight-bold mb-3">Details</h3>
              <div class="details-list">
                <div class="detail-item">
                  <span class="text-medium-emphasis">Year:</span>
                  <span class="font-weight-medium">{{ selectedVehicle.year }}</span>
                </div>
                <div class="detail-item">
                  <span class="text-medium-emphasis">Type:</span>
                  <span class="font-weight-medium">{{ getTypeLabel(selectedVehicle.type) }}</span>
                </div>
                <div class="detail-item">
                  <span class="text-medium-emphasis">Color:</span>
                  <span class="font-weight-medium">{{ selectedVehicle.color }}</span>
                </div>
                <div class="detail-item">
                  <span class="text-medium-emphasis">Mileage:</span>
                  <span class="font-weight-medium"
                    >{{ selectedVehicle.mileage.toLocaleString() }} mi</span
                  >
                </div>
                <div class="detail-item">
                  <span class="text-medium-emphasis">License Plate:</span>
                  <span class="font-weight-medium">{{ selectedVehicle.licensePlate }}</span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <h3 class="text-h6 font-weight-bold mb-3">Features</h3>
              <div class="features-grid">
                <v-chip
                  v-for="feature in selectedVehicle.features"
                  :key="feature"
                  size="small"
                  variant="tonal"
                  color="primary"
                  class="mr-1 mb-1"
                >
                  {{ feature }}
                </v-chip>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>

          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h3 font-weight-bold text-primary">
                {{ formatCurrency(selectedVehicle.dailyRate) }}
                <span class="text-h6 text-medium-emphasis font-weight-regular">/day</span>
              </div>
            </div>
            <v-btn
              color="primary"
              size="x-large"
              variant="flat"
              :disabled="selectedVehicle.status !== 'available'"
              @click="openBookingDialog(selectedVehicle)"
            >
              {{ selectedVehicle.status === 'available' ? 'Book Now' : 'Unavailable' }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVehicles } from '~/composables/useVehicles'
import { useCurrency } from '~/composables/useCurrency'
import type { Vehicle } from '~/types/vehicle'

definePageMeta({
  layout: 'public',
})

const { vehicles, getStatusColor, getTypeLabel } = useVehicles()
const { formatCurrency, getCurrencySymbol } = useCurrency()

const filters = ref({
  search: '',
  type: 'all',
})

const priceRange = ref({
  min: '',
  max: '',
})

const sortBy = ref('price-low')
const viewMode = ref<'grid' | 'list'>('grid')
const showBookingDialog = ref(false)
const showDetailsDialog = ref(false)
const selectedVehicle = ref<Vehicle | null>(null)
const bookingData = ref({
  startDate: '',
  endDate: '',
})

const typeOptions = [
  { title: 'All Types', value: 'all' },
  { title: 'Sedan', value: 'sedan' },
  { title: 'SUV', value: 'suv' },
  { title: 'Truck', value: 'truck' },
  { title: 'Van', value: 'van' },
  { title: 'Electric', value: 'electric' },
  { title: 'Luxury', value: 'luxury' },
]

const sortOptions = [
  { title: 'Price: Low to High', value: 'price-low' },
  { title: 'Price: High to Low', value: 'price-high' },
  { title: 'Newest First', value: 'year-new' },
  { title: 'Lowest Mileage', value: 'mileage-low' },
]

const filteredAndSortedVehicles = computed(() => {
  let result = vehicles.value.filter(vehicle => {
    // Only show available vehicles
    if (vehicle.status !== 'available') return false

    // Search filter
    const searchLower = filters.value.search.toLowerCase()
    const matchesSearch =
      !filters.value.search ||
      vehicle.make.toLowerCase().includes(searchLower) ||
      vehicle.model.toLowerCase().includes(searchLower) ||
      vehicle.features.some(f => f.toLowerCase().includes(searchLower))

    // Type filter
    const matchesType = filters.value.type === 'all' || vehicle.type === filters.value.type

    // Price range filter
    const matchesMinPrice =
      !priceRange.value.min || vehicle.dailyRate >= Number(priceRange.value.min)
    const matchesMaxPrice =
      !priceRange.value.max || vehicle.dailyRate <= Number(priceRange.value.max)

    return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice
  })

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'price-low':
        return a.dailyRate - b.dailyRate
      case 'price-high':
        return b.dailyRate - a.dailyRate
      case 'year-new':
        return b.year - a.year
      case 'mileage-low':
        return a.mileage - b.mileage
      default:
        return 0
    }
  })

  return result
})

const calculateDays = computed(() => {
  if (!bookingData.value.startDate || !bookingData.value.endDate) return 0
  const start = new Date(bookingData.value.startDate)
  const end = new Date(bookingData.value.endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
})

const calculateTotal = computed(() => {
  if (!selectedVehicle.value) return 0
  return selectedVehicle.value.dailyRate * calculateDays.value
})

const showVehicleDetails = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
  showDetailsDialog.value = true
}

const openBookingDialog = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
  showDetailsDialog.value = false
  showBookingDialog.value = true
}

const clearFilters = () => {
  filters.value.search = ''
  filters.value.type = 'all'
  priceRange.value.min = ''
  priceRange.value.max = ''
  sortBy.value = 'price-low'
}
</script>

<style scoped>
/* Page Layout */
.browse-page {
  background: rgb(var(--v-theme-background));
  min-height: 100vh;
}

/* Hero Section */
.browse-hero {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-secondary), 0.03) 100%
  );
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  top: -20%;
  right: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.3) 0%, transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  bottom: -10%;
  left: -5%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.2) 0%, transparent 70%);
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.hero-badge {
  display: flex;
  justify-content: center;
}

.browse-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.text-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.browse-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Filters Card */
.filters-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 20px;
  background: rgb(var(--v-theme-surface));
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.filters-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.filters-header {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}

.search-field :deep(.v-field) {
  transition: all 0.3s ease;
}

.search-field :deep(.v-field:hover) {
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.1);
}

/* Results Header */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  flex-wrap: wrap;
  gap: 16px;
}

.results-count {
  display: flex;
  align-items: center;
}

.view-toggle {
  border-radius: 12px;
  overflow: hidden;
}

/* Vehicle Grid */
.vehicles-grid {
  margin-top: 0;
}

.vehicle-grid-item {
  height: 100%;
}

/* List View */
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 20px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.vehicle-list-image {
  flex-shrink: 0;
}

.vehicle-list-image :deep(.v-img) {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.modern-card:hover .vehicle-list-image :deep(.v-img) {
  transform: scale(1.05);
}

.features-wrap {
  min-height: 40px;
}

/* Empty State */
.modern-card.pa-12 {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.02) 0%,
    rgba(var(--v-theme-secondary), 0.02) 100%
  );
}

/* Price Summary */
.price-summary {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

/* Details List */
.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}

.detail-item:last-child {
  border-bottom: none;
}

.features-grid {
  display: flex;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 960px) {
  .browse-title {
    font-size: 2rem;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .view-toggle {
    width: 100%;
  }
}
</style>
