<template>
  <section id="how-it-works" class="relative py-20 overflow-hidden">
    <div class="how-it-works-bg"></div>
    <v-container class="position-relative">
      <div class="text-center mb-16">
        <div class="flex justify-center mb-4">
          <v-chip color="primary" variant="tonal" size="small" class="px-4">
            Simple Process
          </v-chip>
        </div>
        <h2 class="text-[clamp(2rem,4vw,3rem)] font-extrabold -tracking-[0.02em] mb-4 md:text-[2rem]">
          How It Works
        </h2>
        <p class="text-[clamp(1rem,2vw,1.25rem)] opacity-70 max-w-[600px] mx-auto" style="color: rgb(var(--v-theme-on-surface))">
          Get on the road in just three simple steps
        </p>
      </div>
      <v-row class="relative">
        <v-col cols="12" md="4" v-for="(step, index) in steps" :key="step.title" class="relative">
          <div v-if="index < steps.length - 1" class="step-connector d-none d-md-block"></div>
          <div
            class="step-card-modern fade-in-up"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div class="step-number-badge mb-6">
              <div class="step-number-circle">
                <span class="step-number-text">{{ index + 1 }}</span>
              </div>
              <div class="step-pulse"></div>
            </div>
            <div class="mb-4">
              <v-icon :icon="step.icon" size="56" color="primary"></v-icon>
            </div>
            <h3 class="text-2xl font-bold mb-3">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Choose Your Vehicle',
    description: 'Browse our fleet and select the perfect vehicle for your needs.',
    icon: 'mdi-car-search',
  },
  {
    title: 'Book Online',
    description: 'Complete your reservation in minutes with our easy booking process.',
    icon: 'mdi-calendar-check',
  },
  {
    title: 'Hit the Road',
    description: 'Pick up your vehicle and enjoy your journey with peace of mind.',
    icon: 'mdi-road-variant',
  },
]
</script>

<style scoped lang="scss">
.how-it-works-bg {
  @apply absolute inset-0 z-0;
  background-image:
    linear-gradient(60deg, rgba(var(--v-theme-primary), 0.02) 0%, transparent 60%),
    linear-gradient(120deg, rgba(var(--v-theme-error), 0.02) 0%, transparent 60%);

  &::before {
    content: '';
    @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full;
    background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.03) 0%, transparent 70%);
  }
}

.step-card-modern {
  @apply text-center py-10 px-6 relative transition-transform duration-300 z-10;

  &:hover {
    @apply scale-105;
  }
}

.step-number-badge {
  @apply relative z-20;
}

.step-pulse {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-30;
  background: rgb(var(--v-theme-primary));
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

.step-number-circle {
  @apply w-20 h-20 rounded-full flex items-center justify-center mx-auto relative z-10;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  box-shadow: 0 8px 20px rgba(var(--v-theme-primary), 0.3);
}

.step-number-text {
  @apply text-[2rem] font-extrabold text-white;
}

.step-description {
  @apply opacity-70 leading-relaxed;
  color: rgb(var(--v-theme-on-surface));
}

.step-connector {
  @apply absolute top-[86px] w-[calc(100%-80px)] h-0.5 z-0;
  left: calc(50% + 40px);
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-primary)),
    rgba(var(--v-theme-primary), 0.3)
  );
}

@media (max-width: 600px) {
  .step-number-circle {
    @apply w-16 h-16;
  }

  .step-number-text {
    @apply text-[1.5rem];
  }
}
</style>
