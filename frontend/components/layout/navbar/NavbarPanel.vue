<template>
  <v-card
    class="navbar-panel mt-3 rounded-2xl border shadow-[0_12px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl overflow-hidden"
    :class="widthClass"
    :width="width"
  >
    <slot />
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  width?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  width: '280'
})

const widthClass = computed(() => {
  if (typeof props.width === 'number') {
    return `w-[${props.width}px]`
  }
  return props.width
})
</script>

<style scoped>
.navbar-panel {
  border-color: rgba(var(--v-border-color), 0.08);
  background: rgba(var(--v-theme-surface), 0.98);
}
</style>
