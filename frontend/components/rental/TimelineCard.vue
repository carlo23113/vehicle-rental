<template>
  <CommonUiDetailCard title="Activity Timeline" icon="mdi-timeline-clock" class="mb-6">
    <v-timeline side="end" density="compact">
      <v-timeline-item
        v-for="activity in timeline"
        :key="activity.id"
        :dot-color="activity.color"
        :icon="activity.icon"
        size="small"
      >
        <div class="mb-2">
          <div class="text-body-2 font-weight-medium">{{ activity.title }}</div>
          <div class="text-caption text-medium-emphasis">{{ activity.timestamp }}</div>
        </div>
      </v-timeline-item>
    </v-timeline>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
export interface TimelineActivity {
  id: number | string
  title: string
  timestamp: string
  color: string
  icon: string
}

defineProps<{
  timeline: TimelineActivity[]
}>()
</script>
