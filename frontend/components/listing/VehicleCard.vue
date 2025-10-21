<template>
  <v-card elevation="0" class="vehicle-card" hover @click="$emit('select', vehicle)">
    <!-- Vehicle Image -->
    <div class="vehicle-image">
      <div class="image-overlay"></div>
      <v-img
        :src="vehicle.imageUrl || '/placeholder-car.jpg'"
        :alt="vehicleName"
        cover
        height="220"
        class="rounded-t-lg"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center h-100 bg-surface-variant">
            <v-icon icon="mdi-car" size="64" color="surface"></v-icon>
          </div>
        </template>
      </v-img>
      <v-chip
        :color="getStatusColor(vehicle.status)"
        size="small"
        class="status-chip"
        variant="flat"
      >
        <v-icon :icon="getStatusIcon(vehicle.status)" start size="14"></v-icon>
        {{ vehicle.status }}
      </v-chip>
      <div class="favorite-btn">
        <v-btn icon size="small" variant="flat" color="white">
          <v-icon icon="mdi-heart-outline" size="18" color="error"></v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Vehicle Details -->
    <v-card-text class="pa-5">
      <div class="d-flex justify-space-between align-start mb-3">
        <div class="flex-grow-1">
          <h3 class="text-h6 font-weight-bold mb-1 vehicle-name">{{ vehicleName }}</h3>
          <div class="d-flex align-center ga-2 mb-2">
            <v-icon icon="mdi-calendar" size="14" color="medium-emphasis"></v-icon>
            <span class="text-caption text-medium-emphasis">{{ vehicle.year }}</span>
            <span class="text-caption text-medium-emphasis">•</span>
            <v-icon icon="mdi-palette" size="14" color="medium-emphasis"></v-icon>
            <span class="text-caption text-medium-emphasis">{{ vehicle.color }}</span>
          </div>
        </div>
        <v-chip size="small" variant="tonal" color="primary" class="type-chip">
          {{ getTypeLabel(vehicle.type) }}
        </v-chip>
      </div>

      <!-- Specs Grid -->
      <div class="specs-grid mb-4">
        <div class="spec-item">
          <v-icon icon="mdi-speedometer" size="18" color="primary"></v-icon>
          <div class="spec-content">
            <div class="spec-label">Mileage</div>
            <div class="spec-value">{{ vehicle.mileage.toLocaleString() }} mi</div>
          </div>
        </div>
        <div class="spec-item">
          <v-icon icon="mdi-clipboard-text" size="18" color="primary"></v-icon>
          <div class="spec-content">
            <div class="spec-label">Plate</div>
            <div class="spec-value">{{ vehicle.licensePlate }}</div>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="features-list mb-4">
        <div class="features-label mb-2">
          <v-icon icon="mdi-star-circle" size="14" class="mr-1"></v-icon>
          <span class="text-caption font-weight-medium">Features</span>
        </div>
        <div class="d-flex flex-wrap ga-1">
          <v-chip
            v-for="feature in displayFeatures"
            :key="feature"
            size="x-small"
            variant="tonal"
            color="primary"
            class="feature-chip"
          >
            <v-icon icon="mdi-check" start size="12"></v-icon>
            {{ feature }}
          </v-chip>
          <v-chip
            v-if="vehicle.features.length > 3"
            size="x-small"
            variant="text"
            color="primary"
          >
            +{{ vehicle.features.length - 3 }}
          </v-chip>
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Pricing -->
      <div class="d-flex justify-space-between align-center">
        <div class="pricing-section">
          <div class="text-caption text-medium-emphasis mb-1">Starting from</div>
          <div class="d-flex align-baseline ga-1">
            <span class="price-amount">${{ vehicle.dailyRate }}</span>
            <span class="price-period">/day</span>
          </div>
        </div>
        <v-btn
          color="primary"
          variant="flat"
          size="default"
          class="book-btn"
          :disabled="vehicle.status !== 'available'"
          @click.stop="$emit('book', vehicle)"
        >
          <v-icon icon="mdi-calendar-check" start size="18"></v-icon>
          {{ vehicle.status === 'available' ? 'Book Now' : 'Unavailable' }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Vehicle } from '~/types/vehicle'

const props = defineProps<{
  vehicle: Vehicle
}>()

defineEmits<{
  select: [vehicle: Vehicle]
  book: [vehicle: Vehicle]
}>()

const vehicleName = computed(() => `${props.vehicle.make} ${props.vehicle.model}`)

const displayFeatures = computed(() => props.vehicle.features.slice(0, 3))

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    available: 'success',
    rented: 'error',
    maintenance: 'warning',
    'out-of-service': 'error',
  }
  return colors[status] || 'default'
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    sedan: 'Sedan',
    suv: 'SUV',
    truck: 'Truck',
    van: 'Van',
    electric: 'Electric',
    luxury: 'Luxury',
  }
  return labels[type] || type
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    available: 'mdi-check-circle',
    rented: 'mdi-clock-outline',
    maintenance: 'mdi-wrench',
    'out-of-service': 'mdi-close-circle',
  }
  return icons[status] || 'mdi-information'
}
</script>

<style scoped>
.vehicle-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 20px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.vehicle-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.03) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
  pointer-events: none;
}

.vehicle-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.2);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.vehicle-card:hover::before {
  opacity: 1;
}

.vehicle-image {
  position: relative;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.vehicle-card:hover .image-overlay {
  opacity: 1;
}

.vehicle-image :deep(.v-img) {
  transition: transform 0.4s ease;
}

.vehicle-card:hover .vehicle-image :deep(.v-img) {
  transform: scale(1.05);
}

.status-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  text-transform: capitalize;
  z-index: 2;
  backdrop-filter: blur(8px);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.favorite-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.vehicle-card:hover .favorite-btn {
  opacity: 1;
  transform: scale(1);
}

.favorite-btn :deep(.v-btn) {
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.vehicle-name {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.type-chip {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  transition: all 0.3s ease;
}

.spec-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  border-color: rgba(var(--v-theme-primary), 0.2);
  transform: translateY(-2px);
}

.spec-content {
  flex: 1;
  min-width: 0;
}

.spec-label {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.features-label {
  display: flex;
  align-items: center;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
}

.feature-chip {
  font-weight: 500;
}

.pricing-section {
  flex: 1;
}

.price-amount {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.price-period {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  font-weight: 500;
}

.book-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.book-btn:hover {
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
  transform: translateY(-2px);
}

.book-btn:disabled {
  opacity: 0.5;
}
</style>
