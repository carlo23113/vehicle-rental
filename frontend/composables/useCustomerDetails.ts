import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { useCustomers } from '~/composables/useCustomers'
import { useRentals } from '~/composables/useRentals'
import type { Customer } from '~/types/customer'
import type { Rental } from '~/types/rental'

export const useCustomerDetails = (customerId: string) => {
  const router = useRouter()
  const { snackbar, showSuccess, showError } = useSnackbar()
  const { customers, getStatusColor, getFullName, formatDate, deleteCustomer } = useCustomers()
  const { rentals } = useRentals()

  const customer = ref<Customer | null>(null)
  const customerRentals = ref<Rental[]>([])
  const loading = ref(true)
  const deleteDialog = ref(false)
  const actionLoading = ref(false)

  const loadCustomer = async () => {
    loading.value = true

    try {
      // TODO: Implement API call to load customer
      console.log('Loading customer:', customerId)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock data - replace with actual API call
      const foundCustomer = customers.value.find(c => c.id === Number(customerId))

      if (!foundCustomer) {
        showError('Customer not found')
        router.push('/owner/customers')
        return
      }

      customer.value = foundCustomer

      // Load customer rentals
      customerRentals.value = rentals.value
        .filter(r => r.customerId === Number(customerId))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5) // Show only last 5 rentals
    } catch (error) {
      console.error('Error loading customer:', error)
      showError('Failed to load customer data. Please try again.')
      router.push('/owner/customers')
    } finally {
      loading.value = false
    }
  }

  const openDeleteDialog = () => {
    deleteDialog.value = true
  }

  const confirmDelete = async () => {
    if (!customer.value) return

    actionLoading.value = true

    try {
      // TODO: Implement API call to delete customer
      console.log('Deleting customer:', customer.value.id)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      deleteCustomer(customer.value.id)
      showSuccess('Customer deleted successfully!')
      router.push('/owner/customers')
    } catch (error) {
      console.error('Error deleting customer:', error)
      showError('Failed to delete customer. Please try again.')
    } finally {
      actionLoading.value = false
      deleteDialog.value = false
    }
  }

  const handleEdit = () => {
    if (!customer.value) return
    router.push(`/owner/customers/edit/${customer.value.id}`)
  }

  const getAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const getInitials = (customer: Customer) => {
    return `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase()
  }

  const isLicenseExpired = (licenseExpiry: string) => {
    return new Date(licenseExpiry) < new Date()
  }

  const isLicenseExpiringSoon = (licenseExpiry: string) => {
    const expiryDate = new Date(licenseExpiry)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return daysUntilExpiry <= 90 && daysUntilExpiry > 0
  }

  return {
    customer,
    customerRentals,
    loading,
    deleteDialog,
    actionLoading,
    snackbar,
    loadCustomer,
    openDeleteDialog,
    confirmDelete,
    handleEdit,
    getAge,
    getInitials,
    getStatusColor,
    getFullName,
    formatDate,
    isLicenseExpired,
    isLicenseExpiringSoon,
  }
}
