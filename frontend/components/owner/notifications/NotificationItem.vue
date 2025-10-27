<template>
  <v-list-item
    :class="['notification-item', { 'unread': !notification.read }]"
    @click="$emit('click', notification)"
  >
    <template #prepend>
      <v-avatar :color="notification.color" size="48">
        <v-icon color="white" size="24">{{ notification.icon }}</v-icon>
      </v-avatar>
    </template>

    <v-list-item-title class="text-body-1 font-weight-bold mb-1">
      {{ notification.title }}
    </v-list-item-title>

    <v-list-item-subtitle class="text-body-2 mb-2">
      {{ notification.message }}
    </v-list-item-subtitle>

    <div class="d-flex align-center gap-2 mt-2">
      <v-chip size="x-small" :color="notification.color" variant="tonal">
        {{ notification.type }}
      </v-chip>
      <span class="text-caption text-medium-emphasis">
        <v-icon size="14">mdi-clock-outline</v-icon>
        {{ notification.time }}
      </span>
    </div>

    <template #append>
      <div class="d-flex flex-column align-end gap-2">
        <v-btn
          icon="mdi-dots-vertical"
          variant="text"
          size="small"
          @click.stop="$emit('menu', notification)"
        />
        <v-badge
          v-if="!notification.read"
          dot
          color="primary"
          inline
        />
      </div>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
interface Notification {
  id: number
  title: string
  message: string
  time: string
  icon: string
  color: string
  type: string
  priority: string
  read: boolean
}

defineProps<{
  notification: Notification
}>()

defineEmits<{
  click: [notification: Notification]
  menu: [notification: Notification]
}>()
</script>

<style scoped>
.notification-item {
  @apply p-6 cursor-pointer transition-all duration-200;
}

.notification-item:hover {
  background: rgba(var(--v-theme-primary), 0.04);
}

.notification-item.unread {
  background: rgba(var(--v-theme-primary), 0.02);
  border-left: 4px solid rgb(var(--v-theme-primary));
}
</style>
