<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  percentage: number
  color: string
  maxWidth?: string
}

withDefaults(defineProps<Props>(), {
  maxWidth: '100px'
})
</script>

<template>
  <div class="d-flex align-center ga-2">
    <v-progress-linear
      :model-value="percentage"
      :color="color"
      height="8"
      rounded
      :style="`max-width: ${maxWidth}`"
    />
    <span class="text-body-2 font-weight-bold">{{ percentage }}%</span>
  </div>
</template>
