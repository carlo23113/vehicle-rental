import { ref, computed } from 'vue'
import type { Tenant, TenantFilters, TenantStatus, SubscriptionPlan } from '~/types/tenant'

export const useTenants = () => {
  const tenants = ref<Tenant[]>([])
  const loading = ref(false)

  const filters = ref<TenantFilters>({
    search: '',
    status: 'all',
    plan: 'all',
  })

  // Filter logic
  const filteredTenants = computed(() => {
    let filtered = tenants.value

    // Search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(
        (tenant) =>
          tenant.name.toLowerCase().includes(search) ||
          tenant.email.toLowerCase().includes(search) ||
          tenant.contactPerson.toLowerCase().includes(search) ||
          tenant.slug.toLowerCase().includes(search)
      )
    }

    // Status filter
    if (filters.value.status !== 'all') {
      filtered = filtered.filter((tenant) => tenant.status === filters.value.status)
    }

    // Plan filter
    if (filters.value.plan !== 'all') {
      filtered = filtered.filter((tenant) => tenant.plan === filters.value.plan)
    }

    return filtered
  })

  // Helper functions
  const getStatusColor = (status: TenantStatus) => {
    const colors = {
      active: 'success',
      inactive: 'grey',
      suspended: 'error',
      trial: 'warning',
    }
    return colors[status] || 'grey'
  }

  const getPlanColor = (plan: SubscriptionPlan) => {
    const colors = {
      starter: 'info',
      professional: 'primary',
      enterprise: 'purple',
      custom: 'secondary',
    }
    return colors[plan] || 'grey'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'error'
    if (percentage >= 70) return 'warning'
    return 'success'
  }

  const formatFeature = (feature: string) => {
    return feature
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Stats
  const activeTenants = computed(() => tenants.value.filter((t) => t.status === 'active'))
  const trialTenants = computed(() => tenants.value.filter((t) => t.status === 'trial'))
  const suspendedTenants = computed(() => tenants.value.filter((t) => t.status === 'suspended'))

  // Initialize with mock data
  const initializeMockData = () => {
    tenants.value = [
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

  return {
    tenants,
    loading,
    filters,
    filteredTenants,
    activeTenants,
    trialTenants,
    suspendedTenants,
    getStatusColor,
    getPlanColor,
    formatDate,
    getUsageColor,
    formatFeature,
    initializeMockData,
  }
}
