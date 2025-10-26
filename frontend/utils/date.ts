export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0]
}

export const addDays = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

export const formatISODate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}
