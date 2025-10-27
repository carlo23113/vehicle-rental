/**
 * Reusable date formatting utilities
 * Provides consistent date formatting across the application
 */

export type DateFormatStyle = 'short' | 'long' | 'relative' | 'time' | 'datetime'

/**
 * Format a date string with various styles
 */
export const formatDate = (
  dateString: string | Date | null | undefined,
  style: DateFormatStyle = 'short',
): string => {
  if (!dateString) return 'N/A'

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString

  // Check for invalid date
  if (isNaN(date.getTime())) return 'Invalid Date'

  switch (style) {
    case 'short':
      // e.g., "Jan 15, 2024"
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

    case 'long':
      // e.g., "January 15, 2024"
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

    case 'time':
      // e.g., "2:30 PM"
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

    case 'datetime':
      // e.g., "Jan 15, 2024 at 2:30 PM"
      return `${formatDate(date, 'short')} at ${formatDate(date, 'time')}`

    case 'relative':
      // e.g., "2 days ago", "Just now", "In 3 hours"
      return getRelativeTimeString(date)

    default:
      return formatDate(date, 'short')
  }
}

/**
 * Get relative time string (e.g., "2 days ago", "Just now")
 */
export const getRelativeTimeString = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  // Future dates
  if (diffInSeconds < 0) {
    const absDiffInSeconds = Math.abs(diffInSeconds)
    const absDiffInMinutes = Math.abs(diffInMinutes)
    const absDiffInHours = Math.abs(diffInHours)
    const absDiffInDays = Math.abs(diffInDays)

    if (absDiffInSeconds < 60) return 'In a few seconds'
    if (absDiffInMinutes < 60) return `In ${absDiffInMinutes} minute${absDiffInMinutes !== 1 ? 's' : ''}`
    if (absDiffInHours < 24) return `In ${absDiffInHours} hour${absDiffInHours !== 1 ? 's' : ''}`
    if (absDiffInDays < 30) return `In ${absDiffInDays} day${absDiffInDays !== 1 ? 's' : ''}`
    return formatDate(date, 'short')
  }

  // Past dates
  if (diffInSeconds < 60) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`
}

/**
 * Check if a date is overdue
 */
export const isOverdue = (dateString: string | Date | null | undefined): boolean => {
  if (!dateString) return false
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.getTime() < new Date().getTime()
}

/**
 * Check if a date is upcoming (within specified days)
 */
export const isUpcoming = (
  dateString: string | Date | null | undefined,
  withinDays: number = 7,
): boolean => {
  if (!dateString) return false
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays >= 0 && diffInDays <= withinDays
}
