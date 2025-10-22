export type UserRole = 'admin' | 'manager' | 'agent' | 'technician'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  roleId?: number
  status: UserStatus
  joinDate: string
  lastLogin: string
  department?: string
  permissions: string[]
  notes?: string
}

export interface UserFilters {
  search: string
  role: UserRole | 'all'
  status: UserStatus | 'all'
  department: string
}
