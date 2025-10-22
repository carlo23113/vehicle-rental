<script setup lang="ts">
defineProps<{
  label: string
  value: string
  percentage: number
  color: string
  themeColor: string
}>()
</script>

<template>
  <div class="mb-4">
    <div class="d-flex justify-space-between mb-2">
      <div class="d-flex align-center">
        <div class="status-dot mr-2" :style="`background-color: ${color}`" />
        <span class="text-body-2 font-weight-medium">{{ label }}</span>
      </div>
      <span class="text-body-2 font-weight-bold">{{ value }}</span>
    </div>
    <v-progress-linear
      :model-value="percentage"
      :color="themeColor"
      height="8"
      rounded
      class="shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
    />
  </div>
</template>

<style scoped>
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
