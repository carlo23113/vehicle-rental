import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { useLocations } from '~/composables/useLocations'
import type { LocationFormData } from '~/components/locations/LocationFormFields.vue'

export const useLocationForm = (isEditMode = false) => {
  const router = useRouter()
  const formRef = ref()
  const loading = ref(false)
  const { snackbar, showSuccess, showError } = useSnackbar()
  const { locations, addLocation, updateLocation } = useLocations()

  const getDefaultFormData = (): LocationFormData => ({
    name: '',
    address: '',
    country: 'PH',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    status: 'active',
    type: 'branch',
    operatingHours: {
      weekday: '8:00 AM - 8:00 PM',
      weekend: '9:00 AM - 6:00 PM',
    },
    capacity: 20,
  })

  const form = ref<LocationFormData>(getDefaultFormData())

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
      // Add location to store
      addLocation(form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('Location created successfully!')
      router.push('/locations')
    } catch (error) {
      console.error('Error creating location:', error)
      showError('Failed to create location. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const handleUpdate = async (id: string) => {
    if (!await validateForm()) return

    loading.value = true

    try {
      // Update location in store
      updateLocation(id, form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('Location updated successfully!')
      router.push(`/locations/${id}`)
    } catch (error) {
      console.error('Error updating location:', error)
      showError('Failed to update location. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const loadLocationData = async (id: string) => {
    loading.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const location = locations.value.find(l => l.id === id)

      if (!location) {
        showError('Location not found')
        router.push('/locations')
        return
      }

      // Populate form with location data
      form.value = {
        name: location.name,
        address: location.address,
        country: location.country || 'PH',
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
        phone: location.phone,
        email: location.email,
        status: location.status,
        type: location.type,
        operatingHours: {
          weekday: location.operatingHours.weekday,
          weekend: location.operatingHours.weekend,
        },
        capacity: location.capacity,
      }
    } catch (error) {
      console.error('Error loading location:', error)
      showError('Failed to load location data. Please try again.')
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
    loadLocationData,
    getDefaultFormData,
  }
}
