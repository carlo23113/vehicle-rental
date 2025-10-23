<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon: string
  label: string
  value: number | string
  color?: string
  change?: string
  trend?: 'up' | 'down'
  subtitle?: string
  variant?: 'compact' | 'detailed'
}>()

const isDetailed = computed(() => props.variant === 'detailed')
const effectiveColor = computed(() => props.color || 'primary')
const trendIcon = computed(() => (props.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'))
const trendColor = computed(() => (props.trend === 'up' ? 'success' : 'error'))
const showTrendChip = computed(() => props.change && props.trend)
</script>

<template>
  <v-card elevation="0" class="stat-card" :class="isDetailed ? 'pa-6' : 'pa-3'">
    <template v-if="isDetailed">
      <div class="d-flex justify-space-between align-center mb-4">
        <div :class="['stat-icon-wrapper', 'detailed', `bg-${effectiveColor}`]">
          <v-icon :icon="icon" size="30" color="white" />
        </div>
        <v-chip
          v-if="showTrendChip"
          :color="trendColor"
          size="small"
          variant="flat"
          class="font-weight-bold trend-chip"
        >
          <v-icon :icon="trendIcon" size="16" start />
          {{ change }}
        </v-chip>
      </div>
      <p
        class="text-caption text-medium-emphasis mb-2 text-uppercase font-weight-bold letter-spacing stat-label"
      >
        {{ label }}
      </p>
      <h2 class="stat-value mb-2">{{ value }}</h2>
      <p v-if="subtitle" class="text-caption text-medium-emphasis stat-subtitle">{{ subtitle }}</p>
    </template>

    <template v-else>
      <div class="d-flex align-center">
        <div :class="['stat-icon-wrapper', `bg-${effectiveColor}`, 'mr-3']">
          <v-icon :icon="icon" size="20" color="white" />
        </div>
        <div>
          <p class="text-caption text-medium-emphasis mb-0">{{ label }}</p>
          <h3 class="text-h5 font-weight-bold">{{ value }}</h3>
        </div>
      </div>
    </template>
  </v-card>
</template>

<style scoped>
.stat-card {
  @apply relative h-full overflow-hidden;
  border: 1px solid rgba(var(--v-border-color), 0.06);
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-surface)) 0%,
    rgba(var(--v-theme-surface), 0.95) 100%
  );
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card::before {
  @apply absolute top-0 left-0 right-0 opacity-0;
  content: '';
  height: 4px;
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 50%,
    rgb(var(--v-theme-primary)) 100%
  );
  background-size: 200% 100%;
  transition: all 0.4s ease;
}

.stat-card:hover::before {
  @apply opacity-100;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.stat-card::after {
  @apply absolute inset-0 opacity-0;
  content: '';
  background: radial-gradient(
    circle at top right,
    rgba(var(--v-theme-primary), 0.03) 0%,
    transparent 60%
  );
  transition: opacity 0.4s ease;
}

.stat-card:hover::after {
  @apply opacity-100;
}

.stat-card:hover {
  @apply -translate-y-2 scale-[1.02];
  box-shadow:
    0 20px 48px -16px rgba(var(--v-theme-primary), 0.2),
    0 0 0 1px rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.15);
}

.stat-icon-wrapper {
  @apply w-12 h-12 flex items-center justify-center relative overflow-hidden;
  border-radius: 14px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover .stat-icon-wrapper {
  @apply -rotate-[5deg] scale-105;
}

.stat-icon-wrapper::before {
  @apply absolute inset-0;
  content: '';
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  opacity: 0.8;
}

.stat-icon-wrapper::after {
  @apply absolute inset-0;
  content: '';
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%);
}

.stat-icon-wrapper.detailed {
  @apply w-[68px] h-[68px];
  border-radius: 18px;
  box-shadow:
    0 10px 28px -8px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.letter-spacing {
  @apply tracking-wide;
}

.stat-label {
  @apply text-[0.7rem] opacity-80;
}

.stat-value {
  @apply text-4xl font-extrabold leading-tight;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-on-surface)) 0%,
    rgba(var(--v-theme-on-surface), 0.85) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-subtitle {
  @apply opacity-60 text-[0.7rem];
}

.trend-chip {
  @apply rounded-xl px-2.5 shadow-md;
}
</style>
