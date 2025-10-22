import { ref } from 'vue'
import type { TimelineActivity } from '~/components/rental/TimelineCard.vue'

export const useRentalTimeline = () => {
  // Mock timeline - replace with actual data from API
  const timeline = ref<TimelineActivity[]>([
    {
      id: 1,
      title: 'Rental Started',
      timestamp: 'Today at 8:00 AM',
      color: 'success',
      icon: 'mdi-play-circle',
    },
    {
      id: 2,
      title: 'Rental Confirmed',
      timestamp: 'Yesterday at 2:30 PM',
      color: 'info',
      icon: 'mdi-check-circle',
    },
    {
      id: 3,
      title: 'Rental Created',
      timestamp: 'Jan 14, 2025 at 10:15 AM',
      color: 'primary',
      icon: 'mdi-calendar-plus',
    },
  ])

  return {
    timeline,
  }
}
