<template>
  <div :class="containerClass">
    <label class="text-[0.8125rem] font-medium text-on-surface/70 mb-2 block">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    containerClass?: string
  }>(),
  {
    containerClass: 'mb-4'
  }
)
</script>
