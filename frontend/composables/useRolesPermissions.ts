import { ref, computed } from 'vue'
import type { Role, Permission, RoleFilters } from '~/types/role'

export const useRolesPermissions = () => {
  // All available permissions
  const permissions = ref<Permission[]>([
    // Dashboard
    { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to dashboard and analytics', module: 'Dashboard' },

    // Vehicles
    { id: 'vehicles.view', name: 'View Vehicles', description: 'View vehicle list and details', module: 'Vehicles' },
    { id: 'vehicles.create', name: 'Create Vehicles', description: 'Add new vehicles to the system', module: 'Vehicles' },
    { id: 'vehicles.edit', name: 'Edit Vehicles', description: 'Modify vehicle information', module: 'Vehicles' },
    { id: 'vehicles.delete', name: 'Delete Vehicles', description: 'Remove vehicles from the system', module: 'Vehicles' },

    // Rentals
    { id: 'rentals.view', name: 'View Rentals', description: 'View rental list and details', module: 'Rentals' },
    { id: 'rentals.create', name: 'Create Rentals', description: 'Create new rental agreements', module: 'Rentals' },
    { id: 'rentals.edit', name: 'Edit Rentals', description: 'Modify rental information', module: 'Rentals' },
    { id: 'rentals.delete', name: 'Delete Rentals', description: 'Cancel or delete rentals', module: 'Rentals' },
    { id: 'rentals.complete', name: 'Complete Rentals', description: 'Mark rentals as completed', module: 'Rentals' },

    // Customers
    { id: 'customers.view', name: 'View Customers', description: 'View customer list and details', module: 'Customers' },
    { id: 'customers.create', name: 'Create Customers', description: 'Add new customers', module: 'Customers' },
    { id: 'customers.edit', name: 'Edit Customers', description: 'Modify customer information', module: 'Customers' },
    { id: 'customers.delete', name: 'Delete Customers', description: 'Remove customers from the system', module: 'Customers' },

    // Reservations
    { id: 'reservations.view', name: 'View Reservations', description: 'View reservation list', module: 'Reservations' },
    { id: 'reservations.create', name: 'Create Reservations', description: 'Create new reservations', module: 'Reservations' },
    { id: 'reservations.edit', name: 'Edit Reservations', description: 'Modify reservations', module: 'Reservations' },
    { id: 'reservations.delete', name: 'Delete Reservations', description: 'Cancel reservations', module: 'Reservations' },

    // Maintenance
    { id: 'maintenance.view', name: 'View Maintenance', description: 'View maintenance records', module: 'Maintenance' },
    { id: 'maintenance.create', name: 'Create Maintenance', description: 'Schedule maintenance tasks', module: 'Maintenance' },
    { id: 'maintenance.edit', name: 'Edit Maintenance', description: 'Modify maintenance records', module: 'Maintenance' },
    { id: 'maintenance.delete', name: 'Delete Maintenance', description: 'Remove maintenance records', module: 'Maintenance' },

    // Payments
    { id: 'payments.view', name: 'View Payments', description: 'View payment records', module: 'Payments' },
    { id: 'payments.process', name: 'Process Payments', description: 'Process and record payments', module: 'Payments' },
    { id: 'payments.refund', name: 'Refund Payments', description: 'Issue refunds', module: 'Payments' },

    // Reports
    { id: 'reports.view', name: 'View Reports', description: 'Access reports and analytics', module: 'Reports' },
    { id: 'reports.export', name: 'Export Reports', description: 'Export report data', module: 'Reports' },

    // Users
    { id: 'users.view', name: 'View Users', description: 'View system users', module: 'Users' },
    { id: 'users.create', name: 'Create Users', description: 'Add new system users', module: 'Users' },
    { id: 'users.edit', name: 'Edit Users', description: 'Modify user information', module: 'Users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove system users', module: 'Users' },
    { id: 'users.manage_roles', name: 'Manage Roles', description: 'Assign roles to users', module: 'Users' },

    // Settings
    { id: 'settings.view', name: 'View Settings', description: 'Access system settings', module: 'Settings' },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', module: 'Settings' },
  ])

  // Predefined roles
  const roles = ref<Role[]>([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: permissions.value.map(p => p.id),
      userCount: 1,
      isSystem: true,
      createdAt: '2022-01-01',
      updatedAt: '2022-01-01',
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Operations manager with access to most features',
      permissions: [
        'dashboard.view',
        'vehicles.view', 'vehicles.create', 'vehicles.edit',
        'rentals.view', 'rentals.create', 'rentals.edit', 'rentals.complete',
        'customers.view', 'customers.create', 'customers.edit',
        'reservations.view', 'reservations.create', 'reservations.edit', 'reservations.delete',
        'maintenance.view', 'maintenance.create', 'maintenance.edit',
        'payments.view', 'payments.process',
        'reports.view', 'reports.export',
      ],
      userCount: 3,
      isSystem: true,
      createdAt: '2022-01-01',
      updatedAt: '2023-06-15',
    },
    {
      id: 3,
      name: 'Rental Agent',
      description: 'Customer service agent handling rentals and reservations',
      permissions: [
        'dashboard.view',
        'vehicles.view',
        'rentals.view', 'rentals.create', 'rentals.edit',
        'customers.view', 'customers.create', 'customers.edit',
        'reservations.view', 'reservations.create', 'reservations.edit',
        'payments.view',
      ],
      userCount: 4,
      isSystem: false,
      createdAt: '2022-02-15',
      updatedAt: '2023-08-20',
    },
    {
      id: 4,
      name: 'Technician',
      description: 'Maintenance staff with vehicle and maintenance access',
      permissions: [
        'dashboard.view',
        'vehicles.view', 'vehicles.edit',
        'maintenance.view', 'maintenance.create', 'maintenance.edit',
      ],
      userCount: 2,
      isSystem: false,
      createdAt: '2022-03-10',
      updatedAt: '2023-09-05',
    },
    {
      id: 5,
      name: 'Finance Officer',
      description: 'Finance team member with payment and reporting access',
      permissions: [
        'dashboard.view',
        'payments.view', 'payments.process', 'payments.refund',
        'reports.view', 'reports.export',
      ],
      userCount: 2,
      isSystem: false,
      createdAt: '2022-04-01',
      updatedAt: '2023-10-12',
    },
    {
      id: 6,
      name: 'Read Only',
      description: 'View-only access to most modules',
      permissions: [
        'dashboard.view',
        'vehicles.view',
        'rentals.view',
        'customers.view',
        'reservations.view',
        'maintenance.view',
        'payments.view',
        'reports.view',
      ],
      userCount: 1,
      isSystem: false,
      createdAt: '2023-01-15',
      updatedAt: '2023-01-15',
    },
  ])

  const filters = ref<RoleFilters>({
    search: '',
    module: 'all',
  })

  const filteredRoles = computed(() => {
    return roles.value.filter(role => {
      const matchesSearch =
        !filters.value.search ||
        role.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        role.description.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesModule =
        filters.value.module === 'all' ||
        role.permissions.some(permId => {
          const perm = permissions.value.find(p => p.id === permId)
          return perm?.module === filters.value.module
        })

      return matchesSearch && matchesModule
    })
  })

  const getPermissionsByModule = (module: string) => {
    return permissions.value.filter(p => p.module === module)
  }

  const getModules = () => {
    return [...new Set(permissions.value.map(p => p.module))].sort()
  }

  const getRolePermissionCount = (role: Role) => {
    return role.permissions.length
  }

  const hasPermission = (role: Role, permissionId: string) => {
    return role.permissions.includes(permissionId)
  }

  const addRole = (role: Omit<Role, 'id' | 'userCount' | 'createdAt' | 'updatedAt'>) => {
    const newId = Math.max(...roles.value.map(r => r.id), 0) + 1
    const now = new Date().toISOString().split('T')[0]
    roles.value.push({
      ...role,
      id: newId,
      userCount: 0,
      createdAt: now,
      updatedAt: now,
    })
  }

  const updateRole = (id: number, updates: Partial<Role>) => {
    const index = roles.value.findIndex(r => r.id === id)
    if (index !== -1) {
      const now = new Date().toISOString().split('T')[0]
      roles.value[index] = {
        ...roles.value[index],
        ...updates,
        updatedAt: now,
      }
    }
  }

  const deleteRole = (id: number) => {
    roles.value = roles.value.filter(r => r.id !== id)
  }

  const duplicateRole = (role: Role) => {
    const newId = Math.max(...roles.value.map(r => r.id), 0) + 1
    const now = new Date().toISOString().split('T')[0]
    roles.value.push({
      ...role,
      id: newId,
      name: `${role.name} (Copy)`,
      userCount: 0,
      isSystem: false,
      createdAt: now,
      updatedAt: now,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Stats
  const totalUsers = computed(() => roles.value.reduce((sum, r) => sum + r.userCount, 0))
  const customRolesCount = computed(() => roles.value.filter(r => !r.isSystem).length)

  return {
    roles,
    permissions,
    filters,
    filteredRoles,
    getPermissionsByModule,
    getModules,
    getRolePermissionCount,
    hasPermission,
    addRole,
    updateRole,
    deleteRole,
    duplicateRole,
    formatDate,
    totalUsers,
    customRolesCount,
  }
}
