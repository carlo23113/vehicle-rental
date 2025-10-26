<template>
  <v-menu v-model="isOpen" offset="8" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon variant="flat" class="action-btn" size="large">
        <v-badge :content="notifications.length" color="error" floating>
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
        <ClientOnly>
          <v-tooltip activator="parent" location="bottom">Notifications</v-tooltip>
        </ClientOnly>
      </v-btn>
    </template>

    <v-card class="notification-panel" width="380">
      <v-card-title class="pa-4 d-flex justify-space-between align-center">
        <div>
          <h3 class="text-h6 font-weight-bold">Notifications</h3>
          <p class="text-caption text-medium-emphasis ma-0">
            You have {{ notifications.length }} unread message{{ notifications.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <v-btn icon variant="text" size="small">
          <v-icon size="20">mdi-cog</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-list class="notification-list" max-height="400">
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
        >
          <template v-slot:prepend>
            <v-avatar :color="notification.color" size="40">
              <v-icon color="white">{{ notification.icon }}</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2 font-weight-bold">
            {{ notification.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ notification.message }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <span class="text-caption text-medium-emphasis">{{ notification.time }}</span>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-actions class="pa-3">
        <v-btn variant="text" color="primary" block @click="viewAllNotifications">
          View all notifications
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const viewAllNotifications = () => {
  isOpen.value = false
  navigateTo('/notifications')
}

const notifications = ref([
  {
    id: 1,
    title: 'New rental approved',
    message: 'Toyota Camry rental has been approved',
    time: '2m ago',
    icon: 'mdi-check-circle',
    color: 'success'
  },
  {
    id: 2,
    title: 'Maintenance reminder',
    message: 'Honda CR-V requires service in 3 days',
    time: '1h ago',
    icon: 'mdi-alert',
    color: 'warning'
  },
  {
    id: 3,
    title: 'New customer registered',
    message: 'John Doe has created an account',
    time: '3h ago',
    icon: 'mdi-information',
    color: 'info'
  },
])
</script>

<style scoped>
.notification-panel {
  margin-top: 12px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-border-color), 0.08);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
  background: rgba(var(--v-theme-surface), 0.98);
  overflow: hidden;
}

.notification-list {
  background: transparent;
}

.notification-item {
  padding: 16px !important;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.06);
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.notification-item:hover {
  background: rgba(var(--v-theme-primary), 0.04);
  border-left-color: rgb(var(--v-theme-primary));
}

.notification-item:last-child {
  border-bottom: none;
}

</style>

<style src="~/assets/styles/navbar.css"></style>
