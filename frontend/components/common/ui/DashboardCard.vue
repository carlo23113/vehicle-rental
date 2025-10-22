<script setup lang="ts">
defineProps<{
  noPadding?: boolean
}>()
</script>

<template>
  <v-card elevation="0" class="dashboard-card">
    <slot />
  </v-card>
</template>

<style scoped>
.dashboard-card {
  border: 1px solid rgba(var(--v-border-color), 0.06);
  border-radius: 24px;
  background: linear-gradient(135deg,
    rgb(var(--v-theme-surface)) 0%,
    rgba(var(--v-theme-surface), 0.98) 100%);
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05),
              0 0 0 1px rgba(var(--v-theme-primary), 0.05);
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.2) 0%,
    transparent 50%,
    rgba(var(--v-theme-secondary), 0.2) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.dashboard-card:hover::before {
  opacity: 1;
}

.dashboard-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08),
              0 0 0 1px rgba(var(--v-theme-primary), 0.12);
  transform: translateY(-2px);
}
</style>
