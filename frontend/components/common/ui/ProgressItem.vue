<template>
  <div class="progress-item">
    <div class="d-flex justify-space-between mb-2">
      <div class="d-flex align-center">
        <div v-if="showDot" class="status-dot mr-2" :style="`background-color: ${dotColor}`" />
        <span class="text-body-2 font-weight-medium">{{ label }}</span>
      </div>
      <span class="text-body-2 font-weight-bold">{{ value }}</span>
    </div>
    <v-progress-linear
      :model-value="percentage"
      :color="color"
      :height="height"
      rounded
      class="shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  percentage: number
  color?: string
  dotColor?: string
  showDot?: boolean
  height?: number
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  dotColor: '',
  showDot: true,
  height: 8,
})
</script>

<style scoped>
.progress-item {
  margin-bottom: 1rem;
}

.progress-item:last-child {
  margin-bottom: 0;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
