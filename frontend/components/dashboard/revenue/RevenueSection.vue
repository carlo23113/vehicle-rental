<script setup lang="ts">
type FilterType = 'week' | 'month' | 'year'

defineProps<{
  filter: FilterType
}>()

defineEmits<{
  'update:filter': [value: FilterType]
}>()

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
]
</script>

<template>
  <v-card elevation="0" class="revenue-card">
    <v-card-title class="pa-6 d-flex justify-space-between align-center flex-wrap gap-3">
      <div>
        <h3 class="text-h5 font-weight-bold mb-1">Revenue Overview</h3>
        <p class="text-caption text-medium-emphasis">Track your earnings performance</p>
      </div>
      <v-btn-toggle
        :model-value="filter"
        @update:model-value="$emit('update:filter', $event)"
        mandatory
        density="comfortable"
        variant="outlined"
        divided
        rounded="xl"
        color="primary"
      >
        <v-btn v-for="option in filterOptions" :key="option.value" :value="option.value" class="px-4">
          {{ option.label }}
        </v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-card-text class="pa-6 pt-0">
      <LazyDashboardRevenueChart :filter="filter" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.revenue-card {
  border: 1px solid rgba(var(--v-border-color), 0.06);
  border-radius: 24px;
  background: linear-gradient(135deg,
    rgb(var(--v-theme-surface)) 0%,
    rgba(var(--v-theme-surface), 0.98) 100%);
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05),
              0 0 0 1px rgba(var(--v-theme-primary), 0.05);
  position: relative;
  overflow: hidden;
}

.revenue-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.2) 0%,
    transparent 50%,
    rgba(var(--v-theme-secondary), 0.2) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.revenue-card:hover::before {
  opacity: 1;
}

.revenue-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08),
              0 0 0 1px rgba(var(--v-theme-primary), 0.12);
  transform: translateY(-2px);
}
</style>
