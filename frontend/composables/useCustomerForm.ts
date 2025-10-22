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
  const { addCustomer } = useCustomers()

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

      // Mock data - replace with actual API call
      form.value = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        country: 'PH',
        address: '123 Main Street',
        city: 'Manila',
        state: 'NCR',
        zipCode: '1000',
        driversLicense: 'D1234567',
        licenseExpiry: '2026-08-15',
        dateOfBirth: '1985-03-20',
        status: 'active',
        notes: 'Preferred customer, always on time'
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
