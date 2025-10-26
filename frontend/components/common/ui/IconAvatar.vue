<template>
  <v-avatar :size="size" :color="color" :class="['icon-avatar', avatarClass]">
    <v-icon :icon="icon" :size="iconSize" :color="iconColor" />
  </v-avatar>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    size?: string | number
    iconSize?: string | number
    color?: string
    iconColor?: string
    avatarClass?: string
  }>(),
  {
    icon: 'mdi-car',
    size: 48,
    iconSize: 24,
    color: undefined,
    iconColor: 'primary',
    avatarClass: '',
  }
)
</script>

<style scoped>
.icon-avatar {
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1),
    rgba(var(--v-theme-secondary), 0.1)
  );
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}
</style>
