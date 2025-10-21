<template>
  <section class="relative py-16 overflow-hidden">
    <div class="stats-bg-pattern"></div>
    <v-container class="position-relative">
      <div class="relative z-10 rounded-3xl py-10 px-5 border border-[rgba(var(--v-border-color),0.1)] shadow-[0_4px_20px_rgba(0,0,0,0.03)]" style="background: rgb(var(--v-theme-surface))">
        <v-row class="align-center">
          <v-col cols="6" sm="6" md="3" v-for="(stat, index) in stats" :key="stat.label">
            <div class="stat-card fade-in-up" :style="{ animationDelay: `${index * 100}ms` }">
              <div class="inline-flex mb-4">
                <div class="stat-icon-bg" :class="`stat-icon-${stat.color}`">
                  <v-icon :icon="stat.icon" size="32" :color="stat.color"></v-icon>
                </div>
              </div>
              <h3 class="stat-value mb-2">
                <span class="counter">{{ stat.value }}</span>
              </h3>
              <p class="text-[0.95rem] opacity-70 font-medium" style="color: rgb(var(--v-theme-on-surface))">{{ stat.label }}</p>
            </div>
            <v-divider
              v-if="index < stats.length - 1"
              vertical
              class="stat-divider d-none d-md-block"
            ></v-divider>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: '150+', label: 'Vehicles', icon: 'mdi-car-multiple', color: 'primary' },
  { value: '5000+', label: 'Happy Customers', icon: 'mdi-account-group', color: 'success' },
  { value: '10+', label: 'Years Experience', icon: 'mdi-shield-check', color: 'info' },
  { value: '24/7', label: 'Support', icon: 'mdi-headset', color: 'warning' },
]
</script>

<style scoped lang="scss">
.stats-bg-pattern {
  @apply absolute inset-0 z-0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(var(--v-theme-primary), 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(var(--v-theme-success), 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(var(--v-theme-info), 0.02) 0%, transparent 50%);
}

.stat-card {
  @apply text-center transition-transform duration-300 relative;

  &:hover {
    @apply -translate-y-2;

    .stat-icon-bg {
      @apply scale-110 rotate-[5deg];
    }

    .stat-icon-bg::before {
      @apply opacity-100;
      animation: shine 1.5s infinite;
    }
  }
}

.stat-icon-bg {
  @apply w-[72px] h-[72px] flex items-center justify-center rounded-2xl transition-all duration-300 mx-auto relative overflow-hidden;

  &::before {
    content: '';
    @apply absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: rotate(45deg);
    transition: all 0.6s;
  }

  &.stat-icon-primary {
    background: rgba(var(--v-theme-primary), 0.08);
  }

  &.stat-icon-success {
    background: rgba(var(--v-theme-success), 0.08);
  }

  &.stat-icon-info {
    background: rgba(var(--v-theme-info), 0.08);
  }

  &.stat-icon-warning {
    background: rgba(var(--v-theme-warning), 0.08);
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.stat-value {
  @apply text-[2.5rem] font-extrabold;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-divider {
  @apply absolute right-0 top-1/2 -translate-y-1/2 h-[60px] opacity-20;
}

@media (max-width: 600px) {
  .stat-value {
    @apply text-[2rem];
  }
}
</style>
