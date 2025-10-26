<template>
  <v-row class="mb-8">
    <v-col cols="12">
      <div class="page-header">
        <div class="header-content">
          <div class="title-wrapper">
            <h1 class="page-title">{{ title }}</h1>
          </div>
          <p class="page-subtitle">{{ subtitle }}</p>
        </div>
        <slot name="actions">
          <v-btn
            v-if="actionText"
            color="primary"
            elevation="0"
            class="action-btn"
            rounded="lg"
            @click="$emit('action-click')"
          >
            <v-icon v-if="actionIcon" :icon="actionIcon" start size="20"></v-icon>
            {{ actionText }}
          </v-btn>
        </slot>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
.page-header {
  @apply flex justify-between flex-wrap gap-6 py-4;
}

.header-content {
  @apply flex-1 min-w-[250px];
}

.title-wrapper {
  @apply inline-block relative mb-2;
}

.page-title {
  @apply text-3xl font-extrabold m-0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  @apply opacity-70 text-[0.95rem] font-normal m-0;
  color: rgb(var(--v-theme-on-surface));
  letter-spacing: 0.2px;
}

.action-btn {
  @apply relative font-semibold px-6;
  border-radius: 14px;
  text-transform: none;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn::after {
  @apply absolute inset-0 opacity-0 pointer-events-none;
  content: '';
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  transition: opacity 0.3s ease;
}

.action-btn:hover::after {
  @apply opacity-100;
}

.action-btn:hover {
  @apply -translate-y-0.5;
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.35);
}
</style>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  actionText?: string
  actionIcon?: string
}>()

defineEmits<{
  'action-click': []
}>()
</script>
