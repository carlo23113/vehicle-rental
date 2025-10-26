import type { Ref } from 'vue'

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

interface NotificationFilters {
  type: string | null
  status: string | null
  priority: string | null
}

export const useNotifications = (notifications: Ref<Notification[]>, filters: Ref<NotificationFilters>) => {
  const filteredNotifications = computed(() => {
    return notifications.value.filter(notification => {
      if (filters.value.type && notification.type !== filters.value.type) return false
      if (filters.value.status === 'read' && !notification.read) return false
      if (filters.value.status === 'unread' && notification.read) return false
      if (filters.value.priority && notification.priority !== filters.value.priority) return false
      return true
    })
  })

  const markAsRead = (notification: Notification) => {
    notification.read = true
  }

  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
  }

  const deleteNotification = (notificationId: number) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearFilters = () => {
    filters.value = {
      type: null,
      status: null,
      priority: null,
    }
  }

  return {
    filteredNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearFilters,
  }
}
