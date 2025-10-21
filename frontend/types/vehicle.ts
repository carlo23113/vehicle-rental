export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'out-of-service'

export type VehicleType = 'sedan' | 'suv' | 'truck' | 'van' | 'electric' | 'luxury'

export interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  licensePlate: string
  vin: string
  type: VehicleType
  status: VehicleStatus
  color: string
  mileage: number
  dailyRate: number
  imageUrl?: string
  features: string[]
  lastMaintenanceDate?: string
  nextMaintenanceDate?: string
}

export interface VehicleFilters {
  search: string
  status: VehicleStatus | 'all'
  type: VehicleType | 'all'
}
