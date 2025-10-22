<script setup lang="ts">
defineProps<{
  vehicle: string
  message: string
}>()
</script>

<template>
  <v-list-item class="alert-item">
    <template #prepend>
      <div class="alert-icon-container">
        <v-icon icon="mdi-wrench" size="18" color="warning" />
        <div class="icon-glow" />
      </div>
    </template>
    <v-list-item-title class="text-body-2 font-weight-bold alert-title">
      {{ vehicle }}
    </v-list-item-title>
    <v-list-item-subtitle class="text-caption alert-message">
      {{ message }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<style scoped>
.alert-item {
  border-radius: 14px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-warning), 0.08) 0%,
    rgba(var(--v-theme-warning), 0.04) 100%
  );
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.alert-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    180deg,
    rgb(var(--v-theme-warning)) 0%,
    rgba(var(--v-theme-warning), 0.5) 100%
  );
  transition: width 0.3s ease;
}

.alert-item:hover::before {
  width: 5px;
}

.alert-item:hover {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-warning), 0.12) 0%,
    rgba(var(--v-theme-warning), 0.06) 100%
  );
  border-color: rgba(var(--v-theme-warning), 0.3);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-warning), 0.15);
}

.alert-icon-container {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(var(--v-theme-warning), 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s ease;
  margin-right: 10px;
}

.alert-item:hover .alert-icon-container {
  transform: rotate(15deg) scale(1.1);
}

.icon-glow {
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  background: rgba(var(--v-theme-warning), 0.2);
  filter: blur(6px);
  animation: glow-pulse 2s infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.alert-title {
  color: rgb(var(--v-theme-on-surface));
  transition: color 0.3s ease;
}

.alert-item:hover .alert-title {
  color: rgb(var(--v-theme-warning));
}

.alert-message {
  color: rgba(var(--v-theme-on-surface), 0.7);
  line-height: 1.4;
}
</style>
