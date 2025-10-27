<script setup lang="ts">
interface TimelineItem {
  icon: string
  color: string
  title: string
  subtitle: string
}

interface Props {
  timeline: TimelineItem[]
}

defineProps<Props>()
</script>

<template>
  <CommonUiDetailCard title="Timeline" icon="mdi-timeline-clock">
    <v-timeline density="compact" align="start" side="end">
      <v-timeline-item
        v-for="(item, index) in timeline"
        :key="index"
        :icon="item.icon"
        :dot-color="item.color"
        size="small"
      >
        <div class="timeline-item">
          <div class="timeline-title">{{ item.title }}</div>
          <div class="timeline-subtitle">{{ item.subtitle }}</div>
        </div>
      </v-timeline-item>
    </v-timeline>
  </CommonUiDetailCard>
</template>

<style scoped>
.timeline-item {
  @apply pb-4;
}

.timeline-title {
  @apply text-sm font-semibold mb-1;
}

.timeline-subtitle {
  @apply text-xs;
  opacity: 0.7;
}
</style>
