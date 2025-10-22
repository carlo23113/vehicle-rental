<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
  iconColor?: string
}>()
</script>

<template>
  <div class="section-header">
    <div class="d-flex align-center">
      <v-icon v-if="icon" :icon="icon" :color="iconColor || 'primary'" class="mr-2" size="24" />
      <div>
        <h3 class="section-title">{{ title }}</h3>
        <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  margin: 0.25rem 0 0 0;
  line-height: 1.3;
}
</style>
