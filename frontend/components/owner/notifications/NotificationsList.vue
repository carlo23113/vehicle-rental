<template>
  <v-card elevation="0" rounded="lg">
    <v-list class="py-0">
      <template v-for="(notification, index) in notifications" :key="notification.id">
        <NotificationItem
          :notification="notification"
          @click="$emit('click', notification)"
          @menu="$emit('menu', $event)"
        />
        <v-divider v-if="index < notifications.length - 1" />
      </template>

      <!-- Empty state -->
      <v-list-item v-if="notifications.length === 0">
        <div class="text-center py-12">
          <v-icon size="64" color="grey-lighten-2">mdi-bell-off-outline</v-icon>
          <h3 class="text-h6 mt-4 mb-2">No notifications</h3>
          <p class="text-body-2 text-medium-emphasis">
            You're all caught up! Check back later for updates.
          </p>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
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
  notifications: Notification[]
}>()

defineEmits<{
  click: [notification: Notification]
  menu: [notification: Notification]
}>()
</script>
