import { ref, computed } from 'vue'
import type { Vehicle, VehicleFilters } from '~/types/vehicle'

export const useVehicles = () => {
  const vehicles = ref<Vehicle[]>([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      licensePlate: 'ABC-1234',
      vin: '1HGBH41JXMN109186',
      type: 'sedan',
      status: 'available',
      color: 'Silver',
      mileage: 15420,
      dailyRate: 45,
      features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
      lastMaintenanceDate: '2024-09-15',
      nextMaintenanceDate: '2025-03-15',
    },
    {
      id: 2,
      make: 'Honda',
      model: 'CR-V',
      year: 2024,
      licensePlate: 'XYZ-5678',
      vin: '2HGFC2F59KH123456',
      type: 'suv',
      status: 'rented',
      color: 'Blue',
      mileage: 8230,
      dailyRate: 65,
      features: ['AWD', 'Sunroof', 'Apple CarPlay', 'Lane Assist'],
      lastMaintenanceDate: '2024-08-20',
      nextMaintenanceDate: '2025-02-20',
    },
    {
      id: 3,
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      licensePlate: 'DEF-9012',
      vin: '1FTFW1ET5KFA12345',
      type: 'truck',
      status: 'available',
      color: 'Black',
      mileage: 22100,
      dailyRate: 75,
      features: ['4WD', 'Towing Package', 'Bed Liner'],
      lastMaintenanceDate: '2024-10-05',
      nextMaintenanceDate: '2025-04-05',
    },
    {
      id: 4,
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      licensePlate: 'GHI-3456',
      vin: '5YJ3E1EA1KF123456',
      type: 'electric',
      status: 'available',
      color: 'White',
      mileage: 5200,
      dailyRate: 95,
      features: ['Autopilot', 'Premium Audio', 'Glass Roof'],
      lastMaintenanceDate: '2024-09-30',
      nextMaintenanceDate: '2025-03-30',
    },
    {
      id: 5,
      make: 'BMW',
      model: '5 Series',
      year: 2024,
      licensePlate: 'JKL-7890',
      vin: 'WBA5A5C54KB123456',
      type: 'luxury',
      status: 'maintenance',
      color: 'Gray',
      mileage: 12400,
      dailyRate: 120,
      features: ['Leather Seats', 'Navigation', 'Premium Sound', 'Heated Seats'],
      lastMaintenanceDate: '2024-10-18',
      nextMaintenanceDate: '2024-10-25',
    },
    {
      id: 6,
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2023,
      licensePlate: 'MNO-2468',
      vin: 'WD3PE8CC5K5123456',
      type: 'van',
      status: 'available',
      color: 'White',
      mileage: 18900,
      dailyRate: 85,
      features: ['12 Passenger', 'Rear AC', 'Bluetooth'],
      lastMaintenanceDate: '2024-09-10',
      nextMaintenanceDate: '2025-03-10',
    },
    {
      id: 7,
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2023,
      licensePlate: 'PQR-1357',
      vin: '1G1ZD5ST5KF123456',
      type: 'sedan',
      status: 'available',
      color: 'Red',
      mileage: 19500,
      dailyRate: 42,
      features: ['Bluetooth', 'Backup Camera'],
      lastMaintenanceDate: '2024-08-25',
      nextMaintenanceDate: '2025-02-25',
    },
    {
      id: 8,
      make: 'Jeep',
      model: 'Wrangler',
      year: 2024,
      licensePlate: 'STU-9753',
      vin: '1C4HJXDG5KW123456',
      type: 'suv',
      status: 'out-of-service',
      color: 'Green',
      mileage: 31200,
      dailyRate: 70,
      features: ['4WD', 'Removable Top', 'Off-Road Package'],
      lastMaintenanceDate: '2024-10-10',
      nextMaintenanceDate: '2024-11-15',
    },
  ])

  const filters = ref<VehicleFilters>({
    search: '',
    status: 'all',
    type: 'all',
  })

  const filteredVehicles = computed(() => {
    return vehicles.value.filter(vehicle => {
      const matchesSearch =
        !filters.value.search ||
        vehicle.make.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesStatus =
        filters.value.status === 'all' || vehicle.status === filters.value.status

      const matchesType = filters.value.type === 'all' || vehicle.type === filters.value.type

      return matchesSearch && matchesStatus && matchesType
    })
  })

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newId = Math.max(...vehicles.value.map(v => v.id), 0) + 1
    vehicles.value.push({ ...vehicle, id: newId })
  }

  const updateVehicle = (id: number, updates: Partial<Vehicle>) => {
    const index = vehicles.value.findIndex(v => v.id === id)
    if (index !== -1) {
      vehicles.value[index] = { ...vehicles.value[index], ...updates }
    }
  }

  const deleteVehicle = (id: number) => {
    vehicles.value = vehicles.value.filter(v => v.id !== id)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'success',
      rented: 'primary',
      maintenance: 'warning',
      'out-of-service': 'error',
    }
    return colors[status] || 'default'
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sedan: 'Sedan',
      suv: 'SUV',
      truck: 'Truck',
      van: 'Van',
      electric: 'Electric',
      luxury: 'Luxury',
    }
    return labels[type] || type
  }

  return {
    vehicles,
    filters,
    filteredVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getStatusColor,
    getTypeLabel,
  }
}
