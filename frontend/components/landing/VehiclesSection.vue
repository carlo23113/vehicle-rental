<template>
  <section id="vehicles" class="relative py-20 overflow-hidden">
    <div class="vehicles-bg-circles"></div>
    <v-container class="position-relative">
      <div class="text-center mb-16">
        <div class="flex justify-center mb-4">
          <v-chip color="primary" variant="tonal" size="small" class="px-4"> Our Fleet </v-chip>
        </div>
        <h2 class="text-[clamp(2rem,4vw,3rem)] font-extrabold -tracking-[0.02em] mb-4 md:text-[2rem]">
          Featured Vehicles
        </h2>
        <p class="text-[clamp(1rem,2vw,1.25rem)] opacity-70 max-w-[600px] mx-auto" style="color: rgb(var(--v-theme-on-surface))">
          Discover our most popular and premium rentals
        </p>
      </div>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="(vehicle, index) in featuredVehicles"
          :key="vehicle.id"
        >
          <div class="vehicle-card-wrapper fade-in-up" :style="{ animationDelay: `${index * 100}ms` }">
            <ListingVehicleCard :vehicle="vehicle" @select="goToBrowse" @book="goToBrowse" />
          </div>
        </v-col>
      </v-row>
      <div class="text-center mt-12">
        <v-btn
          color="primary"
          size="x-large"
          variant="flat"
          class="rounded-pill px-8 view-all-btn"
          to="/browse"
        >
          View All Vehicles
          <v-icon icon="mdi-arrow-right" end class="arrow-slide"></v-icon>
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicles } from '~/composables/useVehicles'

const router = useRouter()
const { vehicles } = useVehicles()

const featuredVehicles = computed(() => {
  return vehicles.value.filter(v => v.status === 'available').slice(0, 3)
})

const goToBrowse = () => {
  router.push('/browse')
}
</script>

<style scoped lang="scss">
.vehicles-bg-circles {
  @apply absolute inset-0 z-0;

  &::before {
    content: '';
    @apply absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full;
    background: radial-gradient(circle, rgba(var(--v-theme-info), 0.05) 0%, transparent 70%);
    animation: pulse-slow 10s ease-in-out infinite;
  }

  &::after {
    content: '';
    @apply absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full;
    background: radial-gradient(circle, rgba(var(--v-theme-warning), 0.05) 0%, transparent 70%);
    animation: pulse-slow 12s ease-in-out infinite reverse;
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.vehicle-card-wrapper {
  @apply transition-all duration-300;

  &:hover {
    @apply -translate-y-2;

    :deep(.v-card) {
      box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.2) !important;
    }
  }
}

.view-all-btn {
  @apply normal-case font-semibold tracking-normal relative overflow-hidden transition-all duration-300;
  box-shadow: 0 4px 14px rgba(var(--v-theme-primary), 0.3);

  &::before {
    content: '';
    @apply absolute top-1/2 left-1/2 w-0 h-0 rounded-full;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover::before {
    @apply w-[300px] h-[300px];
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.4);
    @apply -translate-y-0.5;
  }
}

.arrow-slide {
  @apply transition-transform duration-300;
}

.view-all-btn:hover .arrow-slide {
  @apply translate-x-1;
}
</style>
