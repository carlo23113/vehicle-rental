import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { useRentalCalculations } from '~/composables/useRentalCalculations'
import type { RentalFormData } from '~/components/rentals/RentalFormFields.vue'

export const useRentalForm = (isEditMode = false) => {
  const router = useRouter()
  const formRef = ref()
  const loading = ref(false)
  const { snackbar, showSuccess, showError } = useSnackbar()
  const { getTodayDate, getFutureDate } = useRentalCalculations()

  const getDefaultFormData = (): RentalFormData => ({
    customerId: null,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerLicense: '',
    vehicleId: null,
    startDate: getTodayDate(),
    endDate: getFutureDate(1),
    amountOfDays: 1,
    pickupLocation: '',
    pickupTime: '08:00',
    returnTime: '08:00',
    rateType: 'city',
    status: 'reserved',
    mileageLimit: null,
    notes: ''
  })

  const form = ref<RentalFormData>(getDefaultFormData())

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
      // TODO: Implement API call to save rental
      console.log('Creating rental:', form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('Rental created successfully!')
      router.push('/rentals')
    } catch (error) {
      console.error('Error creating rental:', error)
      showError('Failed to create rental. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const handleUpdate = async (id: string) => {
    if (!await validateForm()) return

    loading.value = true

    try {
      // TODO: Implement API call to update rental
      console.log('Updating rental:', id, form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('Rental updated successfully!')
      router.push(`/rentals/${id}`)
    } catch (error) {
      console.error('Error updating rental:', error)
      showError('Failed to update rental. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const loadRentalData = async (id: string) => {
    loading.value = true

    try {
      // TODO: Implement API call to load rental
      console.log('Loading rental:', id)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock data - replace with actual API call
      form.value = {
        customerId: 1,
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '+1234567890',
        customerLicense: 'DL123456',
        vehicleId: 1,
        startDate: getTodayDate(),
        endDate: getFutureDate(3),
        amountOfDays: 3,
        pickupLocation: 'Downtown Office',
        pickupTime: '09:00',
        returnTime: '09:00',
        rateType: 'city',
        status: 'active',
        mileageLimit: 500,
        notes: 'Customer requested GPS navigation'
      }
    } catch (error) {
      console.error('Error loading rental:', error)
      showError('Failed to load rental data. Please try again.')
      router.push('/rentals')
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
    loadRentalData,
    getDefaultFormData
  }
}
