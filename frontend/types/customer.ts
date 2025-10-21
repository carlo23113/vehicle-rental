export type CustomerStatus = 'active' | 'inactive' | 'blocked'

export interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  driversLicense: string
  licenseExpiry: string
  dateOfBirth: string
  status: CustomerStatus
  joinDate: string
  totalRentals: number
  totalSpent: number
  notes?: string
}

export interface CustomerFilters {
  search: string
  status: CustomerStatus | 'all'
}
