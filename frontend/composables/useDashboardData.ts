import { ref, computed } from 'vue'
import { useCurrency } from './useCurrency'

export const useDashboardData = () => {
  const { formatCurrency } = useCurrency()

  // Statistics data
  const stats = ref([
    {
      title: "Total Revenue",
      value: formatCurrency(124500),
      change: "12.5%",
      trend: "up" as const,
      icon: "mdi-currency-usd",
      color: "success",
    },
    {
      title: "Active Rentals",
      value: "42",
      change: "8.2%",
      trend: "up" as const,
      icon: "mdi-car-key",
      color: "primary",
    },
    {
      title: "Total Vehicles",
      value: "156",
      change: "3.1%",
      trend: "up" as const,
      icon: "mdi-car-multiple",
      color: "info",
    },
    {
      title: "Maintenance Due",
      value: "8",
      change: "2.4%",
      trend: "down" as const,
      icon: "mdi-wrench",
      color: "warning",
    },
  ])

  // Vehicle status data
  const vehicleStatus = ref([
    { label: "Available", value: "98", percentage: 63, color: "#4CAF50", themeColor: "success" },
    { label: "Rented", value: "42", percentage: 27, color: "#2196F3", themeColor: "primary" },
    { label: "Maintenance", value: "8", percentage: 5, color: "#FFC107", themeColor: "warning" },
    { label: "Out of Service", value: "8", percentage: 5, color: "#FF5252", themeColor: "error" },
  ])

  // Recent rentals data
  const recentRentals = ref([
    {
      id: 1,
      customer: "John Smith",
      customerInitials: "JS",
      vehicle: "Toyota Camry 2023",
      licensePlate: "ABC-1234",
      startDate: "Jan 15",
      endDate: "Jan 20",
      status: "Active",
      statusColor: "success",
      amount: "450",
      color: "primary",
    },
    {
      id: 2,
      customer: "Sarah Johnson",
      customerInitials: "SJ",
      vehicle: "Honda CR-V 2024",
      licensePlate: "XYZ-5678",
      startDate: "Jan 14",
      endDate: "Jan 21",
      status: "Active",
      statusColor: "success",
      amount: "560",
      color: "secondary",
    },
    {
      id: 3,
      customer: "Michael Brown",
      customerInitials: "MB",
      vehicle: "Ford Explorer 2023",
      licensePlate: "DEF-9012",
      startDate: "Jan 13",
      endDate: "Jan 18",
      status: "Completed",
      statusColor: "info",
      amount: "780",
      color: "info",
    },
    {
      id: 4,
      customer: "Emily Davis",
      customerInitials: "ED",
      vehicle: "Tesla Model 3",
      licensePlate: "GHI-3456",
      startDate: "Jan 16",
      endDate: "Jan 23",
      status: "Reserved",
      statusColor: "warning",
      amount: "950",
      color: "warning",
    },
  ])

  // Quick actions
  const quickActions = ref([
    { title: "New Rental", icon: "mdi-plus-circle", action: "new-rental", color: "primary" },
    { title: "Add Vehicle", icon: "mdi-car", action: "add-vehicle", color: "success" },
    { title: "Add Customer", icon: "mdi-account-plus", action: "add-customer", color: "info" },
    { title: "Generate Report", icon: "mdi-file-chart", action: "generate-report", color: "secondary" },
  ])

  // Maintenance alerts
  const maintenanceAlerts = ref([
    { vehicle: "Toyota Camry (ABC-1234)", message: "Oil change due in 3 days" },
    { vehicle: "Honda CR-V (XYZ-5678)", message: "Tire rotation needed" },
    { vehicle: "Ford F-150 (JKL-7890)", message: "Inspection expired" },
  ])

  return {
    stats,
    vehicleStatus,
    recentRentals,
    quickActions,
    maintenanceAlerts,
  }
}
