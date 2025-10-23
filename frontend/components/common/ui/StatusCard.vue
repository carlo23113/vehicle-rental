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
  <div class="status-card">
    <div v-if="icon" class="status-icon-wrapper mb-2">
      <v-icon :icon="icon" :color="color" size="20" />
    </div>
    <div class="text-caption text-medium-emphasis mb-1">{{ status }}</div>
    <div class="text-h5 font-weight-bold">{{ count }}</div>
    <div v-if="percentage" class="text-caption mt-1">
      <span class="font-weight-medium">{{ percentage }}%</span>
      <span class="text-medium-emphasis"> of total</span>
    </div>
  </div>
</template>

<style scoped>
.status-card {
  @apply p-4 rounded-xl flex flex-col justify-center;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.12);
  transition: all 0.2s ease;
  min-height: 100px;
}

.status-card:hover {
  background: rgba(var(--v-theme-primary), 0.03);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.status-icon-wrapper {
  @apply w-9 h-9 rounded-lg flex items-center justify-center;
  background: rgba(var(--v-theme-primary), 0.1);
}
</style>
