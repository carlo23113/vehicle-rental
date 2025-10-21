/**
 * Dynamic Theme Configuration
 * Allows clients to customize the entire color palette
 */

export interface ThemePalette {
  // Primary brand color
  primary: string
  primaryHover: string
  primaryActive: string
  primaryLight: string
  primaryDark: string

  // Secondary brand color
  secondary: string
  secondaryHover: string
  secondaryActive: string
  secondaryLight: string
  secondaryDark: string

  // Accent color
  accent: string
  accentHover: string
  accentLight: string

  // Semantic colors
  success: string
  successLight: string
  successDark: string

  danger: string
  dangerLight: string
  dangerDark: string

  warning: string
  warningLight: string
  warningDark: string

  info: string
  infoLight: string
  infoDark: string

  // Neutral colors
  background: string
  surface: string
  border: string

  // Text colors
  textPrimary: string
  textSecondary: string
  textMuted: string
  textInverse: string
}

// Default theme (can be overridden by client)
export const defaultTheme: ThemePalette = {
  // Primary (Blue)
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primaryActive: '#1d4ed8',
  primaryLight: '#dbeafe',
  primaryDark: '#1e40af',

  // Secondary (Indigo)
  secondary: '#6366f1',
  secondaryHover: '#4f46e5',
  secondaryActive: '#4338ca',
  secondaryLight: '#e0e7ff',
  secondaryDark: '#3730a3',

  // Accent (Purple)
  accent: '#a855f7',
  accentHover: '#9333ea',
  accentLight: '#f3e8ff',

  // Success (Green)
  success: '#22c55e',
  successLight: '#dcfce7',
  successDark: '#15803d',

  // Danger (Red)
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  dangerDark: '#b91c1c',

  // Warning (Amber)
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  warningDark: '#b45309',

  // Info (Cyan)
  info: '#06b6d4',
  infoLight: '#cffafe',
  infoDark: '#0e7490',

  // Neutrals
  background: '#ffffff',
  surface: '#f9fafb',
  border: '#e5e7eb',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textInverse: '#ffffff'
}

// Example alternative theme
export const darkTheme: ThemePalette = {
  primary: '#60a5fa',
  primaryHover: '#3b82f6',
  primaryActive: '#2563eb',
  primaryLight: '#1e3a8a',
  primaryDark: '#1e40af',

  secondary: '#818cf8',
  secondaryHover: '#6366f1',
  secondaryActive: '#4f46e5',
  secondaryLight: '#312e81',
  secondaryDark: '#3730a3',

  accent: '#c084fc',
  accentHover: '#a855f7',
  accentLight: '#581c87',

  success: '#4ade80',
  successLight: '#14532d',
  successDark: '#15803d',

  danger: '#f87171',
  dangerLight: '#7f1d1d',
  dangerDark: '#b91c1c',

  warning: '#fbbf24',
  warningLight: '#78350f',
  warningDark: '#b45309',

  info: '#22d3ee',
  infoLight: '#164e63',
  infoDark: '#0e7490',

  background: '#111827',
  surface: '#1f2937',
  border: '#374151',

  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textInverse: '#111827'
}

// Export available themes
export const themes = {
  default: defaultTheme,
  dark: darkTheme
} as const

export type ThemeName = keyof typeof themes
