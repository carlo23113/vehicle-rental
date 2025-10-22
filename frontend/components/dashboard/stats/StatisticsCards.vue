<script setup lang="ts">
interface Stat {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  color: string
}

defineProps<{
  stats: Stat[]
}>()
</script>

<template>
  <div class="stats-grid">
    <CommonUiStatCard
      v-for="stat in stats"
      :key="stat.title"
      :icon="stat.icon"
      :label="stat.title"
      :value="stat.value"
      :color="stat.color"
      :change="stat.change"
      :trend="stat.trend"
      subtitle="vs last month"
      variant="detailed"
    />
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 1280px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 959px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
