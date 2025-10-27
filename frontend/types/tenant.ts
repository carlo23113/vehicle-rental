export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'trial'
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise' | 'custom'

export interface Tenant {
  id: number
  name: string
  slug: string
  domain?: string
  email: string
  phone?: string
  contactPerson: string
  status: TenantStatus
  plan: SubscriptionPlan
  createdAt: string
  expiresAt?: string
  maxUsers: number
  maxVehicles: number
  currentUsers: number
  currentVehicles: number
  features: string[]
  customSettings?: Record<string, any>
  billingInfo?: {
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    taxId?: string
  }
  notes?: string
}

export interface TenantFilters {
  search: string
  status: TenantStatus | 'all'
  plan: SubscriptionPlan | 'all'
}

export interface TenantFormData {
  name: string
  slug: string
  domain?: string
  email: string
  phone?: string
  contactPerson: string
  status: TenantStatus
  plan: SubscriptionPlan
  expiresAt?: string
  maxUsers: number
  maxVehicles: number
  features: string[]
  billingInfo?: {
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    taxId?: string
  }
  notes?: string
}
