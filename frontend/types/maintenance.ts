export type MaintenanceType =
  | 'oil-change'
  | 'tire-rotation'
  | 'brake-service'
  | 'inspection'
  | 'repair'
  | 'cleaning'
  | 'other'

export type MaintenanceStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent'

export interface MaintenanceRecord {
  id: number
  vehicleId: number
  vehicleName: string
  licensePlate: string
  type: MaintenanceType
  status: MaintenanceStatus
  priority: MaintenancePriority
  scheduledDate: string
  completedDate?: string
  mileage: number
  cost: number
  description: string
  performedBy?: string
  notes?: string
  nextServiceDate?: string
  nextServiceMileage?: number
  createdAt: string
}

export interface MaintenanceFilters {
  search: string
  type: MaintenanceType | 'all'
  status: MaintenanceStatus | 'all'
  priority: MaintenancePriority | 'all'
}
