import { ref, computed } from 'vue'
import type { User, UserFilters } from '~/types/user'

export const useUsers = () => {
  const users = ref<User[]>([
    {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@vrms.com',
      phone: '(555) 100-0001',
      role: 'admin',
      roleId: 1,
      status: 'active',
      joinDate: '2022-01-01',
      lastLogin: '2024-10-22',
      department: 'Management',
      permissions: ['all'],
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Manager',
      email: 'sarah.manager@vrms.com',
      phone: '(555) 100-0002',
      role: 'manager',
      roleId: 2,
      status: 'active',
      joinDate: '2022-06-15',
      lastLogin: '2024-10-21',
      department: 'Operations',
      permissions: ['rentals', 'customers', 'vehicles', 'reports'],
    },
    {
      id: 3,
      firstName: 'John',
      lastName: 'Agent',
      email: 'john.agent@vrms.com',
      phone: '(555) 100-0003',
      role: 'agent',
      roleId: 3,
      status: 'active',
      joinDate: '2023-02-20',
      lastLogin: '2024-10-22',
      department: 'Customer Service',
      permissions: ['rentals', 'customers', 'reservations'],
    },
    {
      id: 4,
      firstName: 'Mike',
      lastName: 'Technician',
      email: 'mike.tech@vrms.com',
      phone: '(555) 100-0004',
      role: 'technician',
      roleId: 4,
      status: 'active',
      joinDate: '2023-03-10',
      lastLogin: '2024-10-21',
      department: 'Maintenance',
      permissions: ['vehicles', 'maintenance'],
    },
    {
      id: 5,
      firstName: 'Emily',
      lastName: 'Support',
      email: 'emily.support@vrms.com',
      phone: '(555) 100-0005',
      role: 'agent',
      roleId: 3,
      status: 'active',
      joinDate: '2023-05-18',
      lastLogin: '2024-10-22',
      department: 'Customer Service',
      permissions: ['rentals', 'customers', 'reservations'],
    },
    {
      id: 6,
      firstName: 'Robert',
      lastName: 'Finance',
      email: 'robert.finance@vrms.com',
      phone: '(555) 100-0006',
      role: 'manager',
      roleId: 5,
      status: 'active',
      joinDate: '2022-08-01',
      lastLogin: '2024-10-20',
      department: 'Finance',
      permissions: ['payments', 'reports'],
    },
    {
      id: 7,
      firstName: 'Lisa',
      lastName: 'Coordinator',
      email: 'lisa.coord@vrms.com',
      phone: '(555) 100-0007',
      role: 'agent',
      roleId: 3,
      status: 'inactive',
      joinDate: '2023-01-15',
      lastLogin: '2024-09-10',
      department: 'Operations',
      permissions: ['rentals', 'reservations'],
      notes: 'On leave',
    },
    {
      id: 8,
      firstName: 'David',
      lastName: 'Supervisor',
      email: 'david.super@vrms.com',
      phone: '(555) 100-0008',
      role: 'manager',
      roleId: 2,
      status: 'active',
      joinDate: '2022-11-20',
      lastLogin: '2024-10-22',
      department: 'Operations',
      permissions: ['rentals', 'customers', 'vehicles', 'maintenance', 'reports'],
    },
  ])

  const filters = ref<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all',
  })

  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      const matchesSearch =
        !filters.value.search ||
        fullName.includes(filters.value.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        user.phone.includes(filters.value.search) ||
        (user.department?.toLowerCase().includes(filters.value.search.toLowerCase()))

      const matchesRole = filters.value.role === 'all' || user.role === filters.value.role
      const matchesStatus = filters.value.status === 'all' || user.status === filters.value.status
      const matchesDepartment = filters.value.department === 'all' || user.department === filters.value.department

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment
    })
  })

  const addUser = (user: Omit<User, 'id' | 'joinDate'>) => {
    const newId = Math.max(...users.value.map(u => u.id), 0) + 1
    users.value.push({
      ...user,
      id: newId,
      joinDate: new Date().toISOString().split('T')[0],
    })
  }

  const updateUser = (id: number, updates: Partial<User>) => {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates }
    }
  }

  const deleteUser = (id: number) => {
    users.value = users.value.filter(u => u.id !== id)
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'error',
      manager: 'primary',
      agent: 'info',
      technician: 'warning',
    }
    return colors[role] || 'default'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'warning',
      suspended: 'error',
    }
    return colors[status] || 'default'
  }

  const getFullName = (user: User) => {
    return `${user.firstName} ${user.lastName}`
  }

  const getInitials = (user: User) => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getRoleIcon = (role: string) => {
    const icons: Record<string, string> = {
      admin: 'mdi-shield-crown',
      manager: 'mdi-account-tie',
      agent: 'mdi-account-circle',
      technician: 'mdi-tools',
    }
    return icons[role] || 'mdi-account'
  }

  return {
    users,
    filters,
    filteredUsers,
    addUser,
    updateUser,
    deleteUser,
    getRoleColor,
    getStatusColor,
    getFullName,
    getInitials,
    formatDate,
    getRoleIcon,
  }
}
