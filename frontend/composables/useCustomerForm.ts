import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { useCustomers } from '~/composables/useCustomers'
import type { CustomerFormData } from '~/components/customers/CustomerFormFields.vue'

export const useCustomerForm = (isEditMode = false) => {
  const router = useRouter()
  const formRef = ref()
  const loading = ref(false)
  const { snackbar, showSuccess, showError } = useSnackbar()
  const { customers, addCustomer, updateCustomer } = useCustomers()

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getDefaultFormData = (): CustomerFormData => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'PH',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    driversLicense: '',
    licenseExpiry: '',
    dateOfBirth: '',
    status: 'active',
    notes: ''
  })

  const form = ref<CustomerFormData>(getDefaultFormData())

  const validateForm = async () => {
    const { valid } = await formRef.value.validate()
    if (!valid) {
      showError('Please fill in all required fields correctly')
      return false
    }
    return true
  }

  const handleCreate = async () => {
    if (!await validateForm()) return

    loading.value = true

    try {
      // TODO: Implement API call to save customer
      console.log('Creating customer:', form.value)

      // Add customer to store
      addCustomer(form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('Customer created successfully!')
      router.push('/customers')
    } catch (error) {
      console.error('Error creating customer:', error)
      showError('Failed to create customer. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const handleUpdate = async (id: string) => {
    if (!await validateForm()) return

    loading.value = true

    try {
      // TODO: Implement API call to update customer
      console.log('Updating customer:', id, form.value)

      // Update customer in store
      updateCustomer(Number(id), form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('Customer updated successfully!')
      router.push(`/customers/${id}`)
    } catch (error) {
      console.error('Error updating customer:', error)
      showError('Failed to update customer. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const loadCustomerData = async (id: string) => {
    loading.value = true

    try {
      // TODO: Implement API call to load customer
      console.log('Loading customer:', id)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Load customer from store
      const customer = customers.value.find(c => c.id === Number(id))

      if (!customer) {
        showError('Customer not found')
        router.push('/customers')
        return
      }

      // Populate form with customer data
      form.value = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        country: 'PH', // Default since not in customer type yet
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        driversLicense: customer.driversLicense,
        licenseExpiry: customer.licenseExpiry,
        dateOfBirth: customer.dateOfBirth,
        status: customer.status,
        notes: customer.notes || ''
      }
    } catch (error) {
      console.error('Error loading customer:', error)
      showError('Failed to load customer data. Please try again.')
      router.push('/customers')
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    formRef,
    loading,
    snackbar,
    handleCreate,
    handleUpdate,
    loadCustomerData,
    getDefaultFormData,
    getTodayDate
  }
}
