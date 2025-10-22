/**
 * Composable for common form validation rules
 * Provides reusable validation functions for forms
 */
export const useFormValidation = () => {
  const rules = {
    required: (value: any) => !!value || 'This field is required',

    email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address',

    phone: (value: string) => {
      const digitsOnly = value.replace(/\D/g, '')
      return (digitsOnly.length >= 10 && /^[\d\s()+-]+$/.test(value)) || 'Invalid phone number'
    },

    positiveNumber: (value: number) => value > 0 || 'Must be a positive number',

    minLength: (min: number) => (value: string) =>
      value.length >= min || `Must be at least ${min} characters`,

    maxLength: (max: number) => (value: string) =>
      value.length <= max || `Must be at most ${max} characters`,

    minValue: (min: number) => (value: number) =>
      value >= min || `Must be at least ${min}`,

    maxValue: (max: number) => (value: number) =>
      value <= max || `Must be at most ${max}`,
  }

  return { rules }
}
