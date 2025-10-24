<template>
  <CommonUiDetailCard title="Activity Timeline" icon="mdi-timeline">
    <v-timeline density="compact" align="start" side="end">
      <v-timeline-item
        v-for="(item, index) in activity"
        :key="index"
        :icon="item.icon"
        :dot-color="item.color"
        size="small"
      >
        <div class="timeline-title">{{ item.title }}</div>
        <div class="timeline-subtitle">{{ item.subtitle }}</div>
      </v-timeline-item>
    </v-timeline>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
interface ActivityItem {
  icon: string
  color: string
  title: string
  subtitle: string
}

defineProps<{
  activity: ActivityItem[]
}>()
</script>

<style scoped>
.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 2px;
}

.timeline-subtitle {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>
