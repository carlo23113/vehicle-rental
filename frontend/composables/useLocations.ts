import { ref, computed } from 'vue'

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  status: 'active' | 'inactive'
  type: 'main' | 'branch'
  operatingHours: {
    weekday: string
    weekend: string
  }
  capacity: number
  hasMaintenanceFacility: boolean
  createdAt: string
}

export const useLocations = () => {
  const locations = ref<Location[]>([
    {
      id: '1',
      name: 'Downtown Main Office',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      phone: '(555) 123-4567',
      email: 'downtown@rentals.com',
      status: 'active',
      type: 'main',
      operatingHours: {
        weekday: '8:00 AM - 8:00 PM',
        weekend: '9:00 AM - 6:00 PM',
      },
      capacity: 50,
      hasMaintenanceFacility: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Airport Branch',
      address: '456 Airport Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94128',
      phone: '(555) 234-5678',
      email: 'airport@rentals.com',
      status: 'active',
      type: 'branch',
      operatingHours: {
        weekday: '6:00 AM - 10:00 PM',
        weekend: '7:00 AM - 9:00 PM',
      },
      capacity: 75,
      hasMaintenanceFacility: false,
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'Bay Area Service Center',
      address: '789 Industrial Way',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94607',
      phone: '(555) 345-6789',
      email: 'bayarea@rentals.com',
      status: 'active',
      type: 'branch',
      operatingHours: {
        weekday: '7:00 AM - 7:00 PM',
        weekend: '9:00 AM - 5:00 PM',
      },
      capacity: 30,
      hasMaintenanceFacility: true,
      createdAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'South Bay Location',
      address: '321 Tech Drive',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95110',
      phone: '(555) 456-7890',
      email: 'southbay@rentals.com',
      status: 'active',
      type: 'branch',
      operatingHours: {
        weekday: '8:00 AM - 7:00 PM',
        weekend: '10:00 AM - 6:00 PM',
      },
      capacity: 40,
      hasMaintenanceFacility: false,
      createdAt: '2024-04-05',
    },
    {
      id: '5',
      name: 'North Beach Branch',
      address: '555 Beach Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94133',
      phone: '(555) 567-8901',
      email: 'northbeach@rentals.com',
      status: 'inactive',
      type: 'branch',
      operatingHours: {
        weekday: '9:00 AM - 6:00 PM',
        weekend: 'Closed',
      },
      capacity: 20,
      hasMaintenanceFacility: false,
      createdAt: '2024-01-20',
    },
  ])

  const activeLocations = computed(() => {
    return locations.value.filter(location => location.status === 'active')
  })

  const getLocationById = (id: string) => {
    return locations.value.find(location => location.id === id)
  }

  const getFullAddress = (location: Location) => {
    return `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
  }

  const formatLocationForSelect = (location: Location) => {
    return {
      value: location.id,
      title: location.name,
      subtitle: getFullAddress(location),
    }
  }

  const addLocation = (location: Omit<Location, 'id' | 'createdAt'>) => {
    const newLocation: Location = {
      ...location,
      id: (locations.value.length + 1).toString(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    locations.value.push(newLocation)
    return newLocation
  }

  const updateLocation = (id: string, updates: Partial<Location>) => {
    const index = locations.value.findIndex(location => location.id === id)
    if (index !== -1) {
      locations.value[index] = { ...locations.value[index], ...updates }
      return locations.value[index]
    }
    return null
  }

  const deleteLocation = (id: string) => {
    const index = locations.value.findIndex(location => location.id === id)
    if (index !== -1) {
      locations.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    locations,
    activeLocations,
    getLocationById,
    getFullAddress,
    formatLocationForSelect,
    addLocation,
    updateLocation,
    deleteLocation,
  }
}
