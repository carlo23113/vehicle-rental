<template>
  <v-row class="mb-8">
    <v-col cols="12">
      <div class="page-header">
        <div class="header-content">
          <div class="title-wrapper">
            <h1 class="page-title">{{ title }}</h1>
            <div class="title-underline"></div>
          </div>
          <p class="page-subtitle">{{ subtitle }}</p>
        </div>
        <slot name="actions">
          <v-btn
            v-if="actionText"
            color="primary"
            elevation="0"
            class="action-btn"
            size="large"
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem 0;
}

.header-content {
  flex: 1;
  min-width: 250px;
}

.title-wrapper {
  display: inline-block;
  position: relative;
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  margin: 0;
}

.title-underline {
  height: 4px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, transparent 100%);
  border-radius: 2px;
  margin-top: 0.5rem;
  width: 60px;
  animation: expand 0.6s ease-out;
}

@keyframes expand {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 60px;
    opacity: 1;
  }
}

.page-subtitle {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  font-size: 0.95rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.2px;
}

.action-btn {
  border-radius: 14px;
  text-transform: none;
  letter-spacing: 0.3px;
  font-weight: 600;
  padding: 0 24px;
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn:hover::before {
  opacity: 1;
}

.action-btn:hover {
  transform: translateY(-2px);
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
