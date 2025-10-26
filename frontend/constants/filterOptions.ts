/**
 * Reusable filter options constants
 * Centralizes filter configuration to follow DRY principles
 */

export const RENTAL_STATUS_OPTIONS = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Reserved', value: 'reserved' },
  { title: 'Active', value: 'active' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' },
] as const

export const PAYMENT_STATUS_OPTIONS = [
  { title: 'All Payment', value: 'all' },
  { title: 'Pending', value: 'pending' },
  { title: 'Partial', value: 'partial' },
  { title: 'Paid', value: 'paid' },
] as const

export const DATE_RANGE_OPTIONS = [
  { title: 'All Time', value: 'all' },
  { title: 'Today', value: 'today' },
  { title: 'This Week', value: 'week' },
  { title: 'This Month', value: 'month' },
  { title: 'This Year', value: 'year' },
] as const

export const VEHICLE_STATUS_OPTIONS = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Available', value: 'available' },
  { title: 'Rented', value: 'rented' },
  { title: 'Maintenance', value: 'maintenance' },
  { title: 'Out of Service', value: 'out-of-service' },
] as const

export const VEHICLE_TYPE_OPTIONS = [
  { title: 'All Types', value: 'all' },
  { title: 'Sedan', value: 'sedan' },
  { title: 'SUV', value: 'suv' },
  { title: 'Truck', value: 'truck' },
  { title: 'Van', value: 'van' },
  { title: 'Electric', value: 'electric' },
  { title: 'Luxury', value: 'luxury' },
] as const

export const LOCATION_STATUS_OPTIONS = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
] as const

export const LOCATION_TYPE_OPTIONS = [
  { title: 'All Types', value: 'all' },
  { title: 'Main Office', value: 'main' },
  { title: 'Branch Location', value: 'branch' },
] as const

export const MAINTENANCE_TYPE_OPTIONS = [
  { title: 'All Types', value: 'all' },
  { title: 'Oil Change', value: 'oil-change' },
  { title: 'Tire Rotation', value: 'tire-rotation' },
  { title: 'Brake Service', value: 'brake-service' },
  { title: 'Inspection', value: 'inspection' },
  { title: 'Repair', value: 'repair' },
  { title: 'Cleaning', value: 'cleaning' },
  { title: 'Other', value: 'other' },
] as const

export const MAINTENANCE_STATUS_OPTIONS = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in-progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' },
] as const

export const MAINTENANCE_PRIORITY_OPTIONS = [
  { title: 'All Priorities', value: 'all' },
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
  { title: 'Urgent', value: 'urgent' },
] as const

export const PAYMENT_STATUS_OPTIONS_EXTENDED = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Pending', value: 'pending' },
  { title: 'Completed', value: 'completed' },
  { title: 'Failed', value: 'failed' },
  { title: 'Refunded', value: 'refunded' },
] as const

export const PAYMENT_METHOD_OPTIONS = [
  { title: 'All Methods', value: 'all' },
  { title: 'Credit Card', value: 'credit-card' },
  { title: 'Debit Card', value: 'debit-card' },
  { title: 'Cash', value: 'cash' },
  { title: 'Bank Transfer', value: 'bank-transfer' },
  { title: 'Other', value: 'other' },
] as const

export const USER_ROLE_OPTIONS = [
  { title: 'All Roles', value: 'all' },
  { title: 'Admin', value: 'admin' },
  { title: 'Manager', value: 'manager' },
  { title: 'Agent', value: 'agent' },
  { title: 'Technician', value: 'technician' },
] as const

export const USER_STATUS_OPTIONS = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Suspended', value: 'suspended' },
] as const

export const NOTIFICATION_TYPE_OPTIONS = [
  { title: 'Rental', value: 'rental' },
  { title: 'Maintenance', value: 'maintenance' },
  { title: 'Customer', value: 'customer' },
  { title: 'Payment', value: 'payment' },
  { title: 'System', value: 'system' },
] as const

export const NOTIFICATION_STATUS_OPTIONS = [
  { title: 'Unread', value: 'unread' },
  { title: 'Read', value: 'read' },
] as const

export const NOTIFICATION_PRIORITY_OPTIONS = [
  { title: 'High', value: 'high' },
  { title: 'Medium', value: 'medium' },
  { title: 'Low', value: 'low' },
] as const
