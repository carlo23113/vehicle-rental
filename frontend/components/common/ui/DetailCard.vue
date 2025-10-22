<template>
  <v-card elevation="0" class="detail-card">
    <v-card-text class="pa-6">
      <div v-if="title || icon" class="flex items-center gap-3 mb-5">
        <div v-if="icon" class="icon-wrapper">
          <v-icon :icon="icon" size="20" color="primary" />
        </div>
        <h3 class="text-base font-bold">{{ title }}</h3>
      </div>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
}

defineProps<Props>()
</script>

<style scoped>
.detail-card {
  border: 1px solid rgba(var(--v-border-color), 0.08);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.12);
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.06);
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
