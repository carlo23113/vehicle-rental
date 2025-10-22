<template>
  <v-card elevation="0" class="filter-card">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center filter-icon">
        <v-icon color="primary" size="20">{{ icon }}</v-icon>
      </div>
      <div>
        <h3 class="text-sm font-bold">{{ title }}</h3>
        <p class="text-xs text-medium-emphasis">{{ subtitle }}</p>
      </div>
    </div>

    <slot />
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Filters',
  subtitle: 'Refine your search results',
  icon: 'mdi-filter-variant'
})
</script>

<style scoped>
.filter-card {
  border: 1px solid rgba(var(--v-border-color), 0.08);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.12);
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.08);
}

.filter-icon {
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.1) 0%,
    rgba(var(--v-theme-secondary), 0.1) 100%);
}

.filter-card :deep(.search-field .v-field) {
  transition: all 0.3s ease;
}

.filter-card :deep(.search-field .v-field:hover) {
  background: rgba(var(--v-theme-primary), 0.02);
}
</style>
