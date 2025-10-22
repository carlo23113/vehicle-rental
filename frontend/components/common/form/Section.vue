<template>
  <div class="form-section">
    <h3 class="section-title">
      <v-icon v-if="icon" :icon="icon" size="20" />
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  icon?: string
}

defineProps<Props>()
</script>

<style scoped>
.form-section {
  margin-bottom: 2.5rem;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1);
}
</style>
