import { ref, computed } from 'vue'
import type { MaintenanceRecord, MaintenanceFilters } from '~/types/maintenance'

export const useMaintenance = () => {
  const maintenanceRecords = ref<MaintenanceRecord[]>([
    {
      id: 1,
      vehicleId: 1,
      vehicleName: 'Toyota Camry 2023',
      licensePlate: 'ABC-1234',
      type: 'oil-change',
      status: 'completed',
      priority: 'medium',
      scheduledDate: '2024-09-15',
      completedDate: '2024-09-15',
      mileage: 15000,
      cost: 89.99,
      description: 'Regular oil change and filter replacement',
      performedBy: 'AutoCare Service Center',
      notes: 'Used synthetic oil, next service at 20,000 miles',
      nextServiceDate: '2025-03-15',
      nextServiceMileage: 20000,
      createdAt: '2024-09-10T10:00:00Z',
    },
    {
      id: 2,
      vehicleId: 5,
      vehicleName: 'BMW 5 Series 2024',
      licensePlate: 'JKL-7890',
      type: 'brake-service',
      status: 'in-progress',
      priority: 'high',
      scheduledDate: '2025-01-22',
      mileage: 12400,
      cost: 450.0,
      description: 'Brake pad replacement and rotor resurfacing',
      performedBy: 'BMW Service Center',
      notes: 'Front brake pads worn, rear pads at 40%',
      createdAt: '2025-01-18T14:30:00Z',
    },
    {
      id: 3,
      vehicleId: 2,
      vehicleName: 'Honda CR-V 2024',
      licensePlate: 'XYZ-5678',
      type: 'tire-rotation',
      status: 'completed',
      priority: 'low',
      scheduledDate: '2024-08-20',
      completedDate: '2024-08-20',
      mileage: 7500,
      cost: 45.0,
      description: 'Tire rotation and pressure check',
      performedBy: 'Quick Tire Service',
      notes: 'All tires in good condition, rotated front to back',
      nextServiceDate: '2025-02-20',
      nextServiceMileage: 15000,
      createdAt: '2024-08-15T09:00:00Z',
    },
    {
      id: 4,
      vehicleId: 8,
      vehicleName: 'Jeep Wrangler 2024',
      licensePlate: 'STU-9753',
      type: 'repair',
      status: 'scheduled',
      priority: 'urgent',
      scheduledDate: '2025-01-24',
      mileage: 31200,
      cost: 1200.0,
      description: 'Transmission repair - slipping gears',
      notes: 'Vehicle out of service until repair completed',
      createdAt: '2025-01-20T16:45:00Z',
    },
    {
      id: 5,
      vehicleId: 3,
      vehicleName: 'Ford F-150 2023',
      licensePlate: 'DEF-9012',
      type: 'inspection',
      status: 'completed',
      priority: 'medium',
      scheduledDate: '2024-10-05',
      completedDate: '2024-10-05',
      mileage: 22000,
      cost: 125.0,
      description: 'Annual safety inspection',
      performedBy: 'State Inspection Center',
      notes: 'Passed inspection, minor issues noted',
      nextServiceDate: '2025-10-05',
      createdAt: '2024-09-28T11:20:00Z',
    },
    {
      id: 6,
      vehicleId: 4,
      vehicleName: 'Tesla Model 3 2024',
      licensePlate: 'GHI-3456',
      type: 'cleaning',
      status: 'scheduled',
      priority: 'low',
      scheduledDate: '2025-01-23',
      mileage: 5200,
      cost: 75.0,
      description: 'Interior and exterior detailing',
      notes: 'Prepare for upcoming luxury rental',
      createdAt: '2025-01-21T08:30:00Z',
    },
    {
      id: 7,
      vehicleId: 6,
      vehicleName: 'Mercedes-Benz Sprinter 2023',
      licensePlate: 'MNO-2468',
      type: 'oil-change',
      status: 'completed',
      priority: 'medium',
      scheduledDate: '2024-09-10',
      completedDate: '2024-09-10',
      mileage: 18000,
      cost: 150.0,
      description: 'Oil change and multi-point inspection',
      performedBy: 'Mercedes Service Center',
      notes: 'Diesel oil change, transmission fluid checked',
      nextServiceDate: '2025-03-10',
      nextServiceMileage: 25000,
      createdAt: '2024-09-05T13:15:00Z',
    },
    {
      id: 8,
      vehicleId: 7,
      vehicleName: 'Chevrolet Malibu 2023',
      licensePlate: 'PQR-1357',
      type: 'repair',
      status: 'cancelled',
      priority: 'low',
      scheduledDate: '2024-12-15',
      mileage: 19000,
      cost: 0,
      description: 'AC system check',
      notes: 'Customer cancelled, issue resolved itself',
      createdAt: '2024-12-10T15:00:00Z',
    },
    {
      id: 9,
      vehicleId: 1,
      vehicleName: 'Toyota Camry 2023',
      licensePlate: 'ABC-1234',
      type: 'tire-rotation',
      status: 'scheduled',
      priority: 'medium',
      scheduledDate: '2025-01-28',
      mileage: 15420,
      cost: 50.0,
      description: 'Tire rotation and alignment check',
      notes: 'Customer reported slight pull to the right',
      createdAt: '2025-01-22T10:45:00Z',
    },
    {
      id: 10,
      vehicleId: 3,
      vehicleName: 'Ford F-150 2023',
      licensePlate: 'DEF-9012',
      type: 'other',
      status: 'completed',
      priority: 'low',
      scheduledDate: '2024-11-20',
      completedDate: '2024-11-20',
      mileage: 21500,
      cost: 85.0,
      description: 'Bed liner installation',
      performedBy: 'Truck Accessories Plus',
      notes: 'Spray-in bed liner installed',
      createdAt: '2024-11-15T09:30:00Z',
    },
  ])

  const filters = ref<MaintenanceFilters>({
    search: '',
    type: 'all',
    status: 'all',
    priority: 'all',
  })

  const filteredRecords = computed(() => {
    return maintenanceRecords.value.filter(record => {
      const matchesSearch =
        !filters.value.search ||
        record.vehicleName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        record.licensePlate.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        record.description.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesType = filters.value.type === 'all' || record.type === filters.value.type

      const matchesStatus = filters.value.status === 'all' || record.status === filters.value.status

      const matchesPriority =
        filters.value.priority === 'all' || record.priority === filters.value.priority

      return matchesSearch && matchesType && matchesStatus && matchesPriority
    })
  })

  const addMaintenanceRecord = (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
    const newId = Math.max(...maintenanceRecords.value.map(r => r.id), 0) + 1
    maintenanceRecords.value.push({
      ...record,
      id: newId,
      createdAt: new Date().toISOString(),
    })
  }

  const updateMaintenanceRecord = (id: number, updates: Partial<MaintenanceRecord>) => {
    const index = maintenanceRecords.value.findIndex(r => r.id === id)
    if (index !== -1) {
      maintenanceRecords.value[index] = { ...maintenanceRecords.value[index], ...updates }
    }
  }

  const completeMaintenanceRecord = (id: number) => {
    updateMaintenanceRecord(id, {
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
    })
  }

  const deleteMaintenanceRecord = (id: number) => {
    maintenanceRecords.value = maintenanceRecords.value.filter(r => r.id !== id)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'info',
      'in-progress': 'warning',
      completed: 'success',
      cancelled: 'error',
    }
    return colors[status] || 'default'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'info',
      medium: 'primary',
      high: 'warning',
      urgent: 'error',
    }
    return colors[priority] || 'default'
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'oil-change': 'Oil Change',
      'tire-rotation': 'Tire Rotation',
      'brake-service': 'Brake Service',
      inspection: 'Inspection',
      repair: 'Repair',
      cleaning: 'Cleaning',
      other: 'Other',
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return {
    maintenanceRecords,
    filters,
    filteredRecords,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    completeMaintenanceRecord,
    deleteMaintenanceRecord,
    getStatusColor,
    getPriorityColor,
    getTypeLabel,
    formatDate,
  }
}
