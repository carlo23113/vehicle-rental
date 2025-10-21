import { ref, computed } from 'vue'
import type { Customer, CustomerFilters } from '~/types/customer'

export const useCustomers = () => {
  const customers = ref<Customer[]>([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      driversLicense: 'D1234567',
      licenseExpiry: '2026-08-15',
      dateOfBirth: '1985-03-20',
      status: 'active',
      joinDate: '2023-01-15',
      totalRentals: 12,
      totalSpent: 2450,
      notes: 'Preferred customer, always on time',
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      address: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      driversLicense: 'D2345678',
      licenseExpiry: '2027-02-28',
      dateOfBirth: '1990-07-12',
      status: 'active',
      joinDate: '2023-03-22',
      totalRentals: 8,
      totalSpent: 1840,
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'mbrown@email.com',
      phone: '(555) 345-6789',
      address: '789 Pine Road',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      driversLicense: 'D3456789',
      licenseExpiry: '2025-11-30',
      dateOfBirth: '1988-11-05',
      status: 'active',
      joinDate: '2023-02-10',
      totalRentals: 15,
      totalSpent: 3200,
      notes: 'Business traveler, prefers SUVs',
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@email.com',
      phone: '(555) 456-7890',
      address: '321 Elm Street',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95814',
      driversLicense: 'D4567890',
      licenseExpiry: '2026-05-20',
      dateOfBirth: '1992-05-18',
      status: 'active',
      joinDate: '2023-06-08',
      totalRentals: 5,
      totalSpent: 980,
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Wilson',
      email: 'dwilson@email.com',
      phone: '(555) 567-8901',
      address: '654 Maple Drive',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94601',
      driversLicense: 'D5678901',
      licenseExpiry: '2025-09-15',
      dateOfBirth: '1987-09-25',
      status: 'inactive',
      joinDate: '2022-11-20',
      totalRentals: 3,
      totalSpent: 420,
      notes: 'Has not rented in 6 months',
    },
    {
      id: 6,
      firstName: 'Jennifer',
      lastName: 'Martinez',
      email: 'jmartinez@email.com',
      phone: '(555) 678-9012',
      address: '987 Cedar Lane',
      city: 'Fresno',
      state: 'CA',
      zipCode: '93701',
      driversLicense: 'D6789012',
      licenseExpiry: '2027-06-30',
      dateOfBirth: '1991-12-08',
      status: 'active',
      joinDate: '2023-04-15',
      totalRentals: 10,
      totalSpent: 2100,
    },
    {
      id: 7,
      firstName: 'Robert',
      lastName: 'Anderson',
      email: 'randerson@email.com',
      phone: '(555) 789-0123',
      address: '147 Birch Street',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95113',
      driversLicense: 'D7890123',
      licenseExpiry: '2026-03-10',
      dateOfBirth: '1984-04-15',
      status: 'active',
      joinDate: '2022-08-30',
      totalRentals: 18,
      totalSpent: 4200,
      notes: 'VIP customer, frequent business rentals',
    },
    {
      id: 8,
      firstName: 'Lisa',
      lastName: 'Thompson',
      email: 'lthompson@email.com',
      phone: '(555) 890-1234',
      address: '258 Willow Court',
      city: 'Long Beach',
      state: 'CA',
      zipCode: '90802',
      driversLicense: 'D8901234',
      licenseExpiry: '2025-12-20',
      dateOfBirth: '1989-08-30',
      status: 'blocked',
      joinDate: '2023-05-12',
      totalRentals: 2,
      totalSpent: 180,
      notes: 'Payment issues, account blocked',
    },
    {
      id: 9,
      firstName: 'James',
      lastName: 'Garcia',
      email: 'jgarcia@email.com',
      phone: '(555) 901-2345',
      address: '369 Spruce Avenue',
      city: 'Anaheim',
      state: 'CA',
      zipCode: '92801',
      driversLicense: 'D9012345',
      licenseExpiry: '2027-01-25',
      dateOfBirth: '1993-01-22',
      status: 'active',
      joinDate: '2023-07-18',
      totalRentals: 6,
      totalSpent: 1320,
    },
    {
      id: 10,
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'mrodriguez@email.com',
      phone: '(555) 012-3456',
      address: '741 Ash Boulevard',
      city: 'Santa Ana',
      state: 'CA',
      zipCode: '92701',
      driversLicense: 'D0123456',
      licenseExpiry: '2026-10-05',
      dateOfBirth: '1986-10-14',
      status: 'active',
      joinDate: '2022-12-05',
      totalRentals: 14,
      totalSpent: 3150,
      notes: 'Prefers luxury vehicles',
    },
  ])

  const filters = ref<CustomerFilters>({
    search: '',
    status: 'all',
  })

  const filteredCustomers = computed(() => {
    return customers.value.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase()
      const matchesSearch =
        !filters.value.search ||
        fullName.includes(filters.value.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        customer.phone.includes(filters.value.search) ||
        customer.driversLicense.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesStatus = filters.value.status === 'all' || customer.status === filters.value.status

      return matchesSearch && matchesStatus
    })
  })

  const addCustomer = (customer: Omit<Customer, 'id' | 'joinDate' | 'totalRentals' | 'totalSpent'>) => {
    const newId = Math.max(...customers.value.map(c => c.id), 0) + 1
    customers.value.push({
      ...customer,
      id: newId,
      joinDate: new Date().toISOString().split('T')[0],
      totalRentals: 0,
      totalSpent: 0,
    })
  }

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updates }
    }
  }

  const deleteCustomer = (id: number) => {
    customers.value = customers.value.filter(c => c.id !== id)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'warning',
      blocked: 'error',
    }
    return colors[status] || 'default'
  }

  const getFullName = (customer: Customer) => {
    return `${customer.firstName} ${customer.lastName}`
  }

  const getInitials = (customer: Customer) => {
    return `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return {
    customers,
    filters,
    filteredCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getStatusColor,
    getFullName,
    getInitials,
    formatDate,
  }
}
