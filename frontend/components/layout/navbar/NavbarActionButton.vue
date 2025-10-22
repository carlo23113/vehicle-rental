<template>
  <v-btn
    icon
    variant="flat"
    class="bg-primary/6 transition-all duration-300 relative overflow-visible hover:bg-primary/12 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(var(--v-theme-primary),0.15)]"
    size="large"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
.v-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center,
    rgba(var(--v-theme-primary), 0.25) 0%,
    rgba(var(--v-theme-primary), 0.1) 50%,
    transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
  transform: scale(0.5);
}

.v-btn:hover::before {
  opacity: 1;
  transform: scale(1);
}
</style>
