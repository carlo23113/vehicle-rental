<template>
  <v-card elevation="0" class="detail-card">
    <v-card-text class="pa-6">
      <div v-if="title || icon || $slots.actions" class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div v-if="icon" class="icon-wrapper">
            <v-icon :icon="icon" size="20" color="primary" />
          </div>
          <h3 class="text-base font-bold">{{ title }}</h3>
        </div>
        <slot name="actions" />
      </div>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
}

defineProps<Props>()
</script>

<style scoped>
.detail-card {
  @apply rounded-2xl;
  border: 1px solid rgba(var(--v-border-color), 0.08);
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.12);
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.06);
}

.icon-wrapper {
  @apply w-10 h-10 rounded-xl flex items-center justify-center;
  background: rgba(var(--v-theme-primary), 0.1);
}
</style>
