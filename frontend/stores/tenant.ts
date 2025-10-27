import { defineStore } from 'pinia'
import type { Tenant, TenantFormData, TenantFilters } from '~/types/tenant'

interface TenantState {
  tenants: Tenant[]
  selectedTenant: Tenant | null
  filters: TenantFilters
  loading: boolean
}

export const useTenantStore = defineStore('tenant', {
  state: (): TenantState => ({
    tenants: [],
    selectedTenant: null,
    filters: {
      search: '',
      status: 'all',
      plan: 'all',
    },
    loading: false,
  }),

  getters: {
    filteredTenants: (state) => {
      let filtered = state.tenants

      // Search filter
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (tenant) =>
            tenant.name.toLowerCase().includes(search) ||
            tenant.email.toLowerCase().includes(search) ||
            tenant.contactPerson.toLowerCase().includes(search) ||
            tenant.slug.toLowerCase().includes(search)
        )
      }

      // Status filter
      if (state.filters.status !== 'all') {
        filtered = filtered.filter((tenant) => tenant.status === state.filters.status)
      }

      // Plan filter
      if (state.filters.plan !== 'all') {
        filtered = filtered.filter((tenant) => tenant.plan === state.filters.plan)
      }

      return filtered
    },

    activeTenants: (state) => state.tenants.filter((t) => t.status === 'active'),
    trialTenants: (state) => state.tenants.filter((t) => t.status === 'trial'),
    suspendedTenants: (state) => state.tenants.filter((t) => t.status === 'suspended'),

    getTenantById: (state) => (id: number) => state.tenants.find((t) => t.id === id),
    getTenantBySlug: (state) => (slug: string) => state.tenants.find((t) => t.slug === slug),
  },

  actions: {
    async fetchTenants() {
      this.loading = true
      try {
        // Mock data - replace with actual API call
        this.tenants = generateMockTenants()
      } catch (error) {
        console.error('Error fetching tenants:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTenant(data: TenantFormData) {
      this.loading = true
      try {
        // Mock implementation - replace with actual API call
        const newTenant: Tenant = {
          id: Math.max(...this.tenants.map((t) => t.id), 0) + 1,
          ...data,
          createdAt: new Date().toISOString(),
          currentUsers: 0,
          currentVehicles: 0,
          customSettings: {},
        }
        this.tenants.push(newTenant)
        return newTenant
      } catch (error) {
        console.error('Error creating tenant:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTenant(id: number, data: Partial<TenantFormData>) {
      this.loading = true
      try {
        const index = this.tenants.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.tenants[index] = { ...this.tenants[index], ...data }
          if (this.selectedTenant?.id === id) {
            this.selectedTenant = this.tenants[index]
          }
        }
      } catch (error) {
        console.error('Error updating tenant:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTenant(id: number) {
      this.loading = true
      try {
        this.tenants = this.tenants.filter((t) => t.id !== id)
        if (this.selectedTenant?.id === id) {
          this.selectedTenant = null
        }
      } catch (error) {
        console.error('Error deleting tenant:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async suspendTenant(id: number) {
      await this.updateTenant(id, { status: 'suspended' })
    },

    async activateTenant(id: number) {
      await this.updateTenant(id, { status: 'active' })
    },

    selectTenant(tenant: Tenant | null) {
      this.selectedTenant = tenant
    },

    setFilters(filters: Partial<TenantFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: 'all',
        plan: 'all',
      }
    },
  },
})

// Mock data generator
function generateMockTenants(): Tenant[] {
  return [
    {
      id: 1,
      name: 'ABC Rentals Inc',
      slug: 'abc-rentals',
      domain: 'abc-rentals.example.com',
      email: 'admin@abc-rentals.com',
      phone: '+1234567890',
      contactPerson: 'John Smith',
      status: 'active',
      plan: 'professional',
      createdAt: '2024-01-15',
      expiresAt: '2025-01-15',
      maxUsers: 25,
      maxVehicles: 100,
      currentUsers: 18,
      currentVehicles: 75,
      features: ['advanced_analytics', 'api_access', 'custom_branding'],
      billingInfo: {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
        taxId: 'US123456789',
      },
    },
    {
      id: 2,
      name: 'XYZ Fleet Solutions',
      slug: 'xyz-fleet',
      email: 'contact@xyz-fleet.com',
      phone: '+1987654321',
      contactPerson: 'Jane Doe',
      status: 'active',
      plan: 'enterprise',
      createdAt: '2024-02-20',
      expiresAt: '2025-02-20',
      maxUsers: 100,
      maxVehicles: 500,
      currentUsers: 45,
      currentVehicles: 230,
      features: ['advanced_analytics', 'api_access', 'custom_branding', 'priority_support', 'white_label'],
      billingInfo: {
        address: '456 Business Ave',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94102',
      },
    },
    {
      id: 3,
      name: 'Quick Drive Rentals',
      slug: 'quick-drive',
      email: 'info@quickdrive.com',
      contactPerson: 'Mike Johnson',
      status: 'trial',
      plan: 'starter',
      createdAt: '2024-10-01',
      expiresAt: '2024-11-01',
      maxUsers: 5,
      maxVehicles: 20,
      currentUsers: 3,
      currentVehicles: 12,
      features: ['basic_analytics'],
      notes: 'Trial period - following up next week',
    },
    {
      id: 4,
      name: 'Premium Auto Lease',
      slug: 'premium-auto',
      email: 'admin@premiumauto.com',
      phone: '+1555123456',
      contactPerson: 'Sarah Williams',
      status: 'suspended',
      plan: 'professional',
      createdAt: '2023-06-10',
      expiresAt: '2024-06-10',
      maxUsers: 25,
      maxVehicles: 100,
      currentUsers: 20,
      currentVehicles: 85,
      features: ['advanced_analytics', 'api_access'],
      notes: 'Payment overdue - suspended on 2024-10-20',
    },
  ]
}
