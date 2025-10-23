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
  border: 1px solid rgba(var(--v-border-color), 0.06);
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-surface)) 0%,
    rgba(var(--v-theme-surface), 0.95) 100%
  );
  backdrop-filter: blur(10px);
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 50%,
    rgb(var(--v-theme-primary)) 100%
  );
  background-size: 200% 100%;
  opacity: 0;
  transition: all 0.4s ease;
}

.stat-card:hover::before {
  opacity: 1;
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
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top right,
    rgba(var(--v-theme-primary), 0.03) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stat-card:hover::after {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 20px 48px -16px rgba(var(--v-theme-primary), 0.2),
    0 0 0 1px rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.15);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover .stat-icon-wrapper {
  transform: rotate(-5deg) scale(1.05);
}

.stat-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  opacity: 0.8;
}

.stat-icon-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%);
}

.stat-icon-wrapper.detailed {
  width: 68px;
  height: 68px;
  border-radius: 18px;
  box-shadow:
    0 10px 28px -8px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.letter-spacing {
  letter-spacing: 1px;
}

.stat-label {
  font-size: 0.7rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.2;
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
  opacity: 0.6;
  font-size: 0.7rem;
}

.trend-chip {
  border-radius: 12px;
  padding: 0 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
