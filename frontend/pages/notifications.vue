<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Notifications"
      subtitle="Stay updated with your latest activities and alerts"
      icon="mdi-bell"
    >
      <template #actions>
        <v-btn
          variant="outlined"
          prepend-icon="mdi-check-all"
          @click="markAllAsRead"
        >
          Mark all as read
        </v-btn>
      </template>
    </CommonPageHeader>

    <!-- Filters -->
    <NotificationFilters
      v-model="showFilters"
      :filters="filter"
      @update:type="filter.type = $event"
      @update:status="filter.status = $event"
      @update:priority="filter.priority = $event"
      @clear="clearFilters"
    />

    <!-- Notifications List -->
    <v-row>
      <v-col cols="12">
        <NotificationsList
          :notifications="filteredNotifications"
          @click="handleNotificationClick"
          @menu="showMenu"
        />
      </v-col>
    </v-row>

    <!-- Action Menu -->
    <v-menu v-model="menuOpen" :activator="menuActivator" location="bottom end">
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-check" @click="handleMarkAsRead">
          <v-list-item-title>Mark as read</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-delete" @click="handleDeleteNotification">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  layout: 'default',
})

const showFilters = ref(false)
const menuOpen = ref(false)
const menuActivator = ref<any>(null)
const selectedNotification = ref<any>(null)

const filter = ref({
  type: null as string | null,
  status: null as string | null,
  priority: null as string | null,
})

const notifications = ref([
  {
    id: 1,
    title: 'New rental approved',
    message: 'Toyota Camry rental for John Doe has been approved and is ready for pickup.',
    time: '2 minutes ago',
    icon: 'mdi-check-circle',
    color: 'success',
    type: 'rental',
    priority: 'medium',
    read: false,
  },
  {
    id: 2,
    title: 'Maintenance reminder',
    message: 'Honda CR-V (ABC-1234) requires scheduled service in 3 days. Please schedule maintenance.',
    time: '1 hour ago',
    icon: 'mdi-wrench',
    color: 'warning',
    type: 'maintenance',
    priority: 'high',
    read: false,
  },
  {
    id: 3,
    title: 'New customer registered',
    message: 'John Doe has successfully created an account and completed verification.',
    time: '3 hours ago',
    icon: 'mdi-account-plus',
    color: 'info',
    type: 'customer',
    priority: 'low',
    read: true,
  },
  {
    id: 4,
    title: 'Payment received',
    message: 'Payment of $450.00 received for rental #12345. Transaction completed successfully.',
    time: '5 hours ago',
    icon: 'mdi-cash-check',
    color: 'success',
    type: 'payment',
    priority: 'medium',
    read: true,
  },
  {
    id: 5,
    title: 'Vehicle return overdue',
    message: 'Toyota Corolla (XYZ-5678) is 2 hours overdue. Customer has been notified.',
    time: '6 hours ago',
    icon: 'mdi-clock-alert',
    color: 'error',
    type: 'rental',
    priority: 'high',
    read: false,
  },
  {
    id: 6,
    title: 'System update scheduled',
    message: 'A system maintenance is scheduled for tonight at 2:00 AM. Expected downtime: 30 minutes.',
    time: '1 day ago',
    icon: 'mdi-update',
    color: 'primary',
    type: 'system',
    priority: 'medium',
    read: true,
  },
])

const {
  filteredNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearFilters,
} = useNotifications(notifications, filter)

const handleNotificationClick = (notification: any) => {
  markAsRead(notification)
  // TODO: Navigate to related page or show detail
  console.log('Notification clicked:', notification)
}

const showMenu = (notification: any) => {
  selectedNotification.value = notification
  menuOpen.value = true
}

const handleMarkAsRead = () => {
  if (selectedNotification.value) {
    markAsRead(selectedNotification.value)
  }
  menuOpen.value = false
}

const handleDeleteNotification = () => {
  if (selectedNotification.value) {
    deleteNotification(selectedNotification.value.id)
  }
  menuOpen.value = false
}
</script>

