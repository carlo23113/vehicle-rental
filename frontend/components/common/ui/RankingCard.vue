<script setup lang="ts">
interface Props {
  rank: number
  title: string
  subtitle?: string
  value: string | number
  rankColor?: string
  showAvatar?: boolean
  icon?: string
}

withDefaults(defineProps<Props>(), {
  rankColor: 'primary',
  showAvatar: true
})
</script>

<template>
  <div class="ranking-card">
    <div class="d-flex align-center gap-3">
      <v-avatar v-if="showAvatar" :color="rankColor" size="44" class="rank-avatar">
        <span v-if="!icon" class="text-subtitle-1 font-weight-bold">{{ rank }}</span>
        <v-icon v-else :icon="icon" size="20" />
      </v-avatar>
      <div class="flex-grow-1 min-w-0">
        <div class="text-body-1 font-weight-bold text-truncate">{{ title }}</div>
        <div v-if="subtitle" class="text-caption text-medium-emphasis text-truncate">{{ subtitle }}</div>
      </div>
      <div class="text-right">
        <div class="text-body-1 font-weight-bold">{{ value }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-card {
  @apply p-3 rounded-xl mb-2;
  transition: all 0.2s ease;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

.ranking-card:hover {
  background: rgba(var(--v-theme-primary), 0.04);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.12);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.rank-avatar {
  @apply flex-shrink-0 shadow-md;
}
</style>
