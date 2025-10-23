<script setup lang="ts">
interface Props {
  status: string
  count: number | string
  percentage?: number
  color?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  percentage: 0,
  color: 'primary'
})
</script>

<template>
  <div class="status-card" :class="`status-card--${color}`">
    <div class="status-card-header">
      <div v-if="icon" class="status-icon-wrapper" :class="`bg-${color}`">
        <v-icon :icon="icon" color="white" size="22" />
      </div>
      <div class="status-info">
        <div class="status-label">{{ status }}</div>
        <div class="status-count">{{ count }}</div>
      </div>
    </div>
    <div v-if="percentage" class="status-percentage">
      <div class="percentage-bar">
        <div class="percentage-fill" :class="`bg-${color}`" :style="{ width: `${percentage}%` }"></div>
      </div>
      <div class="percentage-text">
        <span class="font-weight-bold">{{ percentage }}%</span>
        <span class="text-medium-emphasis text-xs ml-1">of total</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-card {
  @apply p-4 rounded-xl flex flex-col;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 120px;
  position: relative;
  overflow: hidden;
}

.status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(var(--v-theme-primary), 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.status-card:hover::before {
  opacity: 1;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.status-card-header {
  @apply flex items-start gap-3 mb-3;
}

.status-icon-wrapper {
  @apply w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.status-card:hover .status-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.status-info {
  @apply flex-1;
}

.status-label {
  @apply text-xs font-semibold uppercase tracking-wide mb-1;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.status-count {
  @apply text-3xl font-bold;
  line-height: 1.2;
}

.status-percentage {
  @apply mt-auto;
}

.percentage-bar {
  @apply h-2 rounded-full mb-2;
  background: rgba(var(--v-theme-on-surface), 0.08);
  overflow: hidden;
}

.percentage-fill {
  @apply h-full rounded-full transition-all duration-500 ease-out;
  box-shadow: 0 0 8px currentColor;
}

.status-card:hover .percentage-fill {
  box-shadow: 0 0 12px currentColor;
}

.percentage-text {
  @apply flex items-center justify-between text-xs;
}

/* Color variants */
.status-card--success:hover {
  border-color: rgba(var(--v-theme-success), 0.3);
}

.status-card--primary:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.status-card--info:hover {
  border-color: rgba(var(--v-theme-info), 0.3);
}

.status-card--error:hover {
  border-color: rgba(var(--v-theme-error), 0.3);
}

.status-card--warning:hover {
  border-color: rgba(var(--v-theme-warning), 0.3);
}
</style>
