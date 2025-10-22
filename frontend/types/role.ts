export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  userCount: number
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface RoleFilters {
  search: string
  module: string
}

export const PERMISSION_MODULES = [
  'Dashboard',
  'Vehicles',
  'Rentals',
  'Customers',
  'Reservations',
  'Maintenance',
  'Payments',
  'Reports',
  'Users',
  'Settings',
] as const

export type PermissionModule = typeof PERMISSION_MODULES[number]
