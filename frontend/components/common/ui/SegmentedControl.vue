<template>
  <v-btn-toggle
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    mandatory
    density="comfortable"
    variant="outlined"
    divided
    rounded="xl"
    color="primary"
    class="segmented-control"
  >
    <v-btn
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :prepend-icon="option.icon"
      class="px-4"
    >
      {{ option.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
export interface SegmentedOption {
  value: string | number
  label: string
  icon?: string
}

defineProps<{
  modelValue: string | number
  options: SegmentedOption[]
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<style scoped>
.segmented-control {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
