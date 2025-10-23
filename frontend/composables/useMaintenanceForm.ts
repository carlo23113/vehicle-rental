import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { useMaintenance } from '~/composables/useMaintenance'
import type { MaintenanceFormData } from '~/components/maintenance/MaintenanceFormFields.vue'

export const useMaintenanceForm = (isEditMode = false) => {
  const router = useRouter()
  const formRef = ref()
  const loading = ref(false)
  const { snackbar, showSuccess, showError } = useSnackbar()
  const { addMaintenanceRecord } = useMaintenance()

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getDefaultFormData = (): MaintenanceFormData => ({
    vehicleId: null,
    vehicleName: '',
    type: 'inspection',
    description: '',
    scheduledDate: getTodayDate(),
    completedDate: '',
    status: 'scheduled',
    priority: 'medium',
    mileage: null,
    cost: 0,
    performedBy: '',
    notes: ''
  })

  const form = ref<MaintenanceFormData>(getDefaultFormData())

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
      // TODO: Implement API call to save maintenance
      console.log('Creating maintenance:', form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('Maintenance scheduled successfully!')
      router.push('/maintenance')
    } catch (error) {
      console.error('Error creating maintenance:', error)
      showError('Failed to schedule maintenance. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const handleUpdate = async (id: string) => {
    if (!await validateForm()) return

    loading.value = true

    try {
      // TODO: Implement API call to update maintenance
      console.log('Updating maintenance:', id, form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('Maintenance updated successfully!')
      router.push(`/maintenance/${id}`)
    } catch (error) {
      console.error('Error updating maintenance:', error)
      showError('Failed to update maintenance. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const loadMaintenanceData = async (id: string) => {
    loading.value = true

    try {
      // TODO: Implement API call to load maintenance
      console.log('Loading maintenance:', id)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock data - replace with actual API call
      form.value = {
        vehicleId: 1,
        vehicleName: 'Toyota Camry 2023',
        type: 'oil-change',
        description: 'Regular oil change and filter replacement',
        scheduledDate: getTodayDate(),
        completedDate: '',
        status: 'scheduled',
        priority: 'medium',
        mileage: 15000,
        cost: 45,
        performedBy: 'AutoCare Service Center',
        notes: 'Use synthetic oil'
      }
    } catch (error) {
      console.error('Error loading maintenance:', error)
      showError('Failed to load maintenance data. Please try again.')
      router.push('/maintenance')
    } finally {
      loading.value = false
    }
  }

  const loadVehicleData = async (vehicleId: string) => {
    loading.value = true

    try {
      // TODO: Implement API call to load vehicle
      console.log('Loading vehicle for maintenance:', vehicleId)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock: Pre-fill vehicle data in the form
      form.value.vehicleId = Number(vehicleId)
      form.value.vehicleName = 'Toyota Camry 2023'
    } catch (error) {
      console.error('Error loading vehicle:', error)
      showError('Failed to load vehicle data.')
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
    loadMaintenanceData,
    loadVehicleData,
    getDefaultFormData
  }
}
