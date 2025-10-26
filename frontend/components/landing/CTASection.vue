<template>
  <section class="relative py-20">
    <v-container>
      <div class="cta-card-modern">
        <div class="cta-background">
          <div class="cta-pattern"></div>
          <ClientOnly>
            <div class="cta-particles">
              <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
            </div>
          </ClientOnly>
        </div>
        <div class="cta-content">
          <div class="cta-icon mb-6">
            <v-icon icon="mdi-steering" size="64" color="white" class="cta-icon-spin"></v-icon>
          </div>
          <h2 class="text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-4 -tracking-[0.02em]">
            Ready to Hit the Road?
          </h2>
          <p class="text-[clamp(1rem,2vw,1.25rem)] text-white/90 mb-10 max-w-[700px] mx-auto">
            Join thousands of satisfied customers. Book your perfect vehicle today and start your
            adventure.
          </p>
          <div class="d-flex justify-center flex-wrap ga-4">
            <v-btn
              color="white"
              size="x-large"
              elevation="0"
              class="rounded-pill px-8 cta-btn-primary"
              to="/owner/browse"
            >
              <v-icon icon="mdi-car-key" start></v-icon>
              Get Started Now
            </v-btn>
            <v-btn
              variant="outlined"
              color="white"
              size="x-large"
              class="rounded-pill px-8 cta-btn-secondary"
              to="/owner/help"
            >
              Contact Support
              <v-icon icon="mdi-arrow-right" end></v-icon>
            </v-btn>
          </div>
          <div class="d-flex justify-center flex-wrap gap-8 mt-8 cta-stats">
            <div class="cta-stat-item" v-for="(stat, index) in ctaStats" :key="index">
              <div class="cta-stat-value">{{ stat.value }}</div>
              <div class="cta-stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
const ctaStats = [
  { value: '150+', label: 'Vehicles' },
  { value: '5000+', label: 'Happy Customers' },
  { value: '24/7', label: 'Support' },
]

const getParticleStyle = (_index: number) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDelay = Math.random() * 5
  const randomDuration = 10 + Math.random() * 10
  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`,
  }
}
</script>

<style scoped lang="scss">
.cta-card-modern {
  @apply relative rounded-[32px] overflow-hidden py-20 px-10 text-center;
}

.cta-background {
  @apply absolute inset-0 z-0;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
}

.cta-content {
  @apply relative z-10;
}

.cta-icon {
  @apply inline-block;
}

.cta-pattern {
  @apply absolute inset-0 opacity-50;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

.cta-particles {
  @apply absolute inset-0 overflow-hidden z-10;
}

.particle {
  @apply absolute w-1 h-1 rounded-full;
  background: rgba(255, 255, 255, 0.6);
  animation: particle-float infinite ease-in-out;
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(50px);
    opacity: 0;
  }
}

.cta-icon-spin {
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cta-btn-primary {
  @apply relative overflow-hidden normal-case font-bold tracking-normal;
  background: white !important;
  color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    @apply absolute top-1/2 left-1/2 w-0 h-0 rounded-full;
    background: rgba(var(--v-theme-primary), 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover::before {
    @apply w-[300px] h-[300px];
  }

  &:hover {
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.3);
    @apply -translate-y-0.5;
  }
}

.cta-btn-secondary {
  @apply normal-case font-bold tracking-normal;
  border-width: 2px !important;

  &:hover {
    background: rgba(255, 255, 255, 0.1) !important;
  }
}

.cta-stats {
  @apply pt-8 border-t border-white/20 mt-8;
}

.cta-stat-item {
  @apply text-center;
}

.cta-stat-value {
  @apply text-[2rem] font-extrabold text-white mb-1;
}

.cta-stat-label {
  @apply text-sm uppercase tracking-wider;
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 960px) {
  .cta-card-modern {
    @apply py-[60px] px-6;
  }
}
</style>
