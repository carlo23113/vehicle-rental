import { computed, type Ref } from 'vue'

interface Notification {
  id: number
  read: boolean
  priority: string
}

export const useNotificationStats = (notifications: Ref<Notification[]>) => {
  const stats = computed(() => {
    return notifications.value.reduce(
      (acc, notification) => {
        acc.total++
        if (!notification.read) acc.unread++
        if (notification.priority === 'high') acc.high++
        if (notification.priority === 'medium') acc.medium++
        return acc
      },
      { total: 0, unread: 0, high: 0, medium: 0 }
    )
  })

  return stats
}
