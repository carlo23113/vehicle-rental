/**
 * Composable for rental date and time calculations
 * Handles all rental period calculations with 24-hour day logic
 */
export const useRentalCalculations = () => {
  /**
   * Calculate end date based on start date and number of days
   * 1 day = 24 hours, so adding 1 day means the next calendar day
   */
  const calculateEndDate = (startDate: string, amountOfDays: number): string | null => {
    if (!startDate || !amountOfDays) return null

    const date = new Date(startDate)
    date.setDate(date.getDate() + amountOfDays)

    return date.toISOString().split('T')[0] || null
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0] || ''
  }

  /**
   * Get a future date by adding days to today
   */
  const getFutureDate = (days: number): string => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0] || ''
  }

  /**
   * Calculate rental cost
   */
  const calculateRentalCost = (days: number, dailyRate: number): number => {
    return Math.max(0, days) * dailyRate
  }

  /**
   * Format rental duration text
   */
  const formatDuration = (days: number): string => {
    return `${days} day${days !== 1 ? 's' : ''}`
  }

  return {
    calculateEndDate,
    getTodayDate,
    getFutureDate,
    calculateRentalCost,
    formatDuration,
  }
}
