<template>
  <div class="detail-item">
    <div class="flex items-center gap-2 mb-1">
      <v-icon v-if="icon" :icon="icon" size="16" class="text-medium-emphasis" />
      <span class="text-sm font-medium text-medium-emphasis">{{ label }}</span>
    </div>
    <div class="text-base font-semibold">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value?: string | number
  icon?: string
}

defineProps<Props>()
</script>

<style scoped>
.detail-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.06);
  transition: all 0.2s ease;
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-item:first-child {
  padding-top: 0;
}

.detail-item:hover {
  padding-left: 0.5rem;
  background: rgba(var(--v-theme-primary), 0.02);
  border-radius: 8px;
}
</style>
